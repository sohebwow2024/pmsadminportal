import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const DeletePropDoc = ({ del, handleDel, id }) => {

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

    const handleDeletePropertyDocument = async () => {
        try {
            console.log('id', id)
            const res = await axios.post(`/property/docs/delete/${id}`, {}, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('res', res)
            if (res?.data[0][0].status === "Success") {
                toast.success(res?.data[0][0].message)
                handleDel()
            }
        } catch (error) {
            console.log('delError', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal
                isOpen={del}
                toggle={() => handleDel()}
                className='modal-dialog-centered'
            >
                <ModalHeader className='bg-transparent' toggle={() => handleDel()}>
                    Are you sure to delete "{docData.documentName}" permanently?
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button color='danger' className='m-1' onClick={() => handleDeletePropertyDocument()}>
                                Delete
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={() => handleDel()}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default DeletePropDoc