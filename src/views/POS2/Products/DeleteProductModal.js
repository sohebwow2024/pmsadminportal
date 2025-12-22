import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const DeleteProductModal = ({ open, handleOpen, data }) => {
    console.log('deldata', data)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const handleDelete = async () => {
        try {
            const res = await axios.post(`/pos_product/delete/${data?.posProductID}`, {}, {
                params: {
                    LoginID,
                    Token
                }
            })
            console.log('delres', res)
            if (res?.data[0][0].status === 'Success') {
                toast.success("Product Deleted!")
                handleOpen()
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpen}
                className='modal-dialog-centered modal-md'
            >
                <ModalHeader toggle={handleOpen}>Delete Product - {data?.posProductName}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            Are you sure you want to delete this product?
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Col className='text-center'>
                        <Button className='me-1' color='danger' onClick={handleDelete}>Delete</Button>
                        <Button className='ms-1' color='primary' onClick={handleOpen} outline>Cancel</Button>
                    </Col>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default DeleteProductModal