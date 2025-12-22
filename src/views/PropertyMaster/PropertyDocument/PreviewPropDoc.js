import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios, { Image_base_uri } from '../../../API/axios'

const PreviewPropDoc = ({ show, handleShow, id }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID } = getUserData

    const [docData, setDocData] = useState([])

    const getDocById = async () => {
        try {
            console.log(id);
            const res = await axios.get(`/property/docs/${id}?PropertyID=${PropertyID}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('res', res)
            if (res?.data.length > 0) {
                setDocData(res?.data[0][0])
            } else setDocData([])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getDocById()
    }, [id])


    return (
        <>
            <Modal
                isOpen={show}
                toggle={() => handleShow()}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent justify-content-center' toggle={() => handleShow()}>
                    Document Details
                </ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <Row>
                        <Col md='6'>


                            <Label>Document Name :</Label>

                            <h4>{docData.documentName}</h4>
                        </Col>
                        <Col md='6'>

                            <Label>Document Description :</Label>


                            <h4>{docData.documentDescription}</h4>

                        </Col>
                    </Row>
                    <Row>
                        <Col className='mb-2'>
                            {console.log('url', `${Image_base_uri}${docData.fileURL}`)}
                            {
                                docData?.fileURL && (
                                    <embed
                                        src={`${Image_base_uri}${docData?.fileURL}`}
                                        width="100%"
                                        // height={`${defaultFileSrc.endsWith('.pdf') | defaultFileSrc.endsWith('.doc') | defaultFileSrc.endsWith('.docx' | defaultFileSrc.endsWith('.ppt') | defaultFileSrc.endsWith('.pptx')) ? '500' : '100%'}`}
                                        height="500"
                                    />
                                )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md='3 lg-text-end md-text-end mb-2'>
                            <Label>Document URL:</Label>
                        </Col>
                        <Col md='9'>
                            <Label className='text-break'><a href={`${Image_base_uri}${docData?.fileURL}`} target='_new'>{`${Image_base_uri}${docData?.fileURL}`}</a></Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12 text-center'>
                            <Button color='danger' onClick={() => handleShow()}>Close</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default PreviewPropDoc