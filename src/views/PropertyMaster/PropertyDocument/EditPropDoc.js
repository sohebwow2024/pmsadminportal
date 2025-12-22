import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'

const EditPropDoc = ({ edit, handleEdit, id }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData

    const [editDisplay, setEditDisplay] = useState(false)
    const [editDocName, setEditDocName] = useState('')
    const [editDocDesc, setEditDocDesc] = useState('')
    const [editDocType, setEditDocType] = useState('')
    const [editAccess, setEditAccess] = useState('')
    const [editFileName, setEditFileName] = useState('')

    const getDocById = async () => {
        try {
            const res = await axios.get(`/property/docs/${id}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('res', res)
            if (res?.data.length > 0) {
                let result = res.data[0][0]
                setEditDocName(result.documentName)
                setEditDocDesc(result.documentDescription)
                setEditDocType(result.documentType)
                setEditAccess(result.accessLevel)
                setEditFileName(result.fileName)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getDocById()
    }, [id])


    const editHandleSubmit = async () => {
        try {
            if (editDocName && editDocDesc !== '') {
                let obj = {
                    LoginID,
                    Token,
                    Seckey:"abc",
                    DocumentType: editDocType,
                    DocumentName: editDocName,
                    DocumentDescription: editDocDesc,
                    AccessLevel: editAccess,
                    FileName: editFileName
                }
                const res = await axios.post(`/property/docs/update?DocumentID=${id}`, obj, {
                    headers: {
                        LoginID,
                        Token
                    }
                })
                console.log('res', res)
                console.log('obj', obj)
                if (res?.data[0][0]?.status === "Success") {
                    toast.success(res?.data[0][0]?.message)
                    handleEdit()
                }
            } else {
                toast.error('Fill all fields!')
            }
        } catch (error) {
            console.log('UpdateError', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal
                isOpen={edit}
                toggle={() => handleEdit()}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => handleEdit()}>
                    Edit Documents
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
                                    value={editDocName}
                                    onChange={e => setEditDocName(e.target.value)}
                                    invalid={editDisplay && editDocName.trim() === ''}
                                />
                                {editDisplay && !editDocName.trim() ? <span className='error_msg_lbl'>Document Name Required</span> : null}
                            </Col>
                            <Col md='12' className='mb-2'>
                                <Label className='form-label' for='documentType'>
                                    Document Type
                                </Label>
                                <Input
                                    type='text'
                                    name='documentType'
                                    id='documentType'
                                    value={editDocType}
                                    onChange={e => setEditDocType(e.target.value)}
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
                                    value={editDocDesc}
                                    onChange={e => setEditDocDesc(e.target.value)}
                                    invalid={editDisplay && editDocDesc.trim() === ''}
                                />
                                {editDisplay && !editDocDesc.trim() ? <span className='error_msg_lbl'>Document Description Required</span> : null}
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-end mt-1' xs={12}>
                                <Button className='me-1' color='primary' onClick={() => editHandleSubmit()}>
                                    Update
                                </Button>
                                <Button
                                    color='secondary'
                                    outline
                                    onClick={() => {
                                        handleEdit()
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

export default EditPropDoc