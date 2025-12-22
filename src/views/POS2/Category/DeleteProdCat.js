import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const DeleteProdCat = ({ open, handleOpen, id }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const handleDelete = async () => {
        try {
            const res = await axios.post(`/pos_category/delete/${id}`, {}, {
                params: {
                    LoginID,
                    Token
                }
            })
            console.log('res', res)
            toast.success("POS Product Category deleted!!")
            handleOpen()
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpen}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader toggle={handleOpen}>Delete POS - {name}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <h4 className='fw-light'>Are you sure you want to delete, POS - {name}?</h4>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Col className='text-center'>
                        <Button color='danger' className='mx-1' onClick={handleDelete}>Delete</Button>
                        <Button color='primary' className='mx-1' outline onClick={handleDelete}>Cancel</Button>
                    </Col>
                </ModalFooter>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default DeleteProdCat