import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios, { Image_base_uri } from '../../../API/axios'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

const NewPropDoc = ({ open, handleOpen }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData

    const [display, setDisplay] = useState(false)
    const [docName, setDocName] = useState('')
    const [docDesc, setDocDesc] = useState('')
    const [docType, setDocType] = useState('')
    const [docFile, setDocFile] = useState('')

    const handleSubmit = async () => {
        setDisplay(true)
        if (docName.trim() && docDesc.trim() && docFile !== '') {
            let newDocData = new FormData()
            newDocData.append('CompanyID', CompanyID)
            newDocData.append('PropertyID', PropertyID)
            newDocData.append('DocumentName', docName)
            newDocData.append('DocumentDescription', docDesc)
            newDocData.append('DocumentType', docType)
            newDocData.append('File', docFile)
            newDocData.append('HotelName', HotelName)
            newDocData.append('AccessLevel', 'all')
            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    // url: "/api/property/docs/add",
                    url: "/api/property/docs/upload",
                    data: newDocData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        LoginID,
                        Token
                    },
                })
                console.log('Docres', res)
                if (res?.data[0][0]?.status === "Success") {
                    toast.success(res?.data[0]?.message)
                    handleOpen()
                }
            } catch (error) {
                console.log('uploadError', error)
                toast.error('Something went wrong, Try again!')
            }
        } else {
            toast.error('Fill all fields')
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={() => handleOpen()}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => handleOpen()}>
                    Add Documents
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Row className='mb-2'>
                            <Col md='12' className='mb-2'>
                                <Label className='form-label' for='documentName'>
                                    <span className='text-danger'>*</span>Document Name
                                </Label>
                                <Input
                                    type='text'
                                    name='documentName'
                                    id='documentName'
                                    value={docName}
                                    onChange={e => setDocName(e.target.value)}
                                    invalid={display && docName.trim() === ''}
                                />
                                {display && !docName.trim() ? <span className='error_msg_lbl'>Document Name Required</span> : null}
                            </Col>
                            <Col md='12' className='mb-2'>
                                <Label className='form-label' for='documnetType'>
                                    Document Type
                                </Label>
                                <Input
                                    type='text'
                                    name='documnetType'
                                    id='documnetType'
                                    value={docType}
                                    onChange={e => setDocType(e.target.value)}
                                />
                            </Col>
                            <Col md='12' className='mb-2'>
                                <Label className='form-label' for='documentDesc'>
                                    <span className='text-danger'>*</span>Document Description
                                </Label>
                                <Input
                                    type='textarea'
                                    name='documentDesc'
                                    id='documentDesc'
                                    value={docDesc}
                                    onChange={e => setDocDesc(e.target.value)}
                                    invalid={display && docDesc.trim() === ''}
                                />
                                {display && !docDesc.trim() ? <span className='error_msg_lbl'>Document Description Required</span> : null}
                            </Col>
                            <Col md='9' className='mb-2'>
                                <Label className='form-label' for='uploadDocument'>
                                    <span className='text-danger'>*</span>upload Document
                                </Label>
                                <Input type='file'
                                    name='uploadDocument'
                                    accept='image/*, 
                                    image/jpg, 
                                    image/jpeg, 
                                    image/webp, 
                                    image/png,
                                    application/pdf, 
                                    application/msword, 
                                    application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
                                    application/vnd.ms-powerpoint, 
                                    application/vnd.openxmlformats-officedocument.presentationml.slideshow, 
                                    application/vnd.openxmlformats-officedocument.presentationml.presentation'
                                    id='uploadDocument'
                                    // multiple={false}
                                    // onChange={e => setDocFile(e.target.value)}
                                    onChange={e => {
                                        console.log('e', e)
                                        setDocFile(e.target.files[0])
                                    }}
                                    invalid={display && docFile === ''}
                                />
                                {display && docFile === '' ? <span className='error_msg_lbl'>Document Required</span> : null}
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-end mt-1' xs={12}>
                                <Button className='me-1' color='primary' onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button
                                    color='secondary'
                                    outline
                                    onClick={() => {
                                        handleOpen()
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </>
                </ModalBody>
            </Modal>
        </>
    )
}

export default NewPropDoc