import React from 'react'
import toast from 'react-hot-toast'
import { Button, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
import axios from '../../../API/axios'

const DeleteExtraServiceModal = ({ open, LoginID, Token, handleDeleteModal, deleteESID, getExistService, handleExtraService }) => {

    const handleExtraServiceDelete = async () => {
        console.log(deleteESID)
        try {
            // const res = await axios.post(`/booking/extraservice/delete?LoginID=${LoginID}&Token=${Token}&ExtraServiceID=${deleteESID}`, {
            const res = await axios.post(`/booking/extraservice/delete`, null, {
                params: {
                    LoginID,
                    Token,
                    ExtraServiceID: deleteESID
                }
            })
            console.log('deleteres', res)
            if (res.status === 200) {
                toast.success("Extra service deleted!")
                handleDeleteModal()
                getExistService()
                handleExtraService()
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleDeleteModal}
            className='modal-dialog-centered modal-md'
            backdrop
        >
            <ModalHeader toggle={handleDeleteModal}>Are you sure you want to delete {deleteESID} service?</ModalHeader>
            <ModalBody>
                <Col className='text-center'>
                    <Button color='danger' className='m-1' onClick={handleExtraServiceDelete}>Delete</Button>
                    <Button color='warning' className='m-1' onClick={() => handleDeleteModal()}>Cancel</Button>
                </Col>
            </ModalBody>
        </Modal>
    )
}

export default DeleteExtraServiceModal