import React from 'react'
import toast from 'react-hot-toast'
import { Button, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
import axios from '../../../API/axios'

const DeleteFolioModal = ({ open, handleDelModal, id, LoginID, Token, getExistPaymentData, handlePfolio }) => {

    const handleFolioDelete = async () => {
        try {
            const res = await axios.post('/booking/folio/delete', null, {
                params: {
                    LoginID,
                    Token,
                    FolioID: id
                }
            })
            console.log('res', res)
            if (res.data[0][0].status === "Success") {
                toast.success("Folio deleted Successfully!")
                handleDelModal()
                getExistPaymentData()
                handlePfolio()
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
                toggle={handleDelModal}
                className='modal-dialog-centered modal-md'
                backdrop
            >
                <ModalHeader toggle={handleDelModal}>Are you sure you want to delete {id} service?</ModalHeader>
                <ModalBody>
                    <Col className='text-center'>
                        <Button color='danger' className='m-1' onClick={handleFolioDelete}>Delete</Button>
                        <Button color='warning' className='m-1' onClick={() => handleDelModal()}>Cancel</Button>
                    </Col>
                </ModalBody>
            </Modal>
        </>
    )
}

export default DeleteFolioModal