import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const DeletePr = ({ selPr, del, handleDel }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const handleDelete = async () => {
        try {
            const res = await axios.post(`/inventory/delete_purchase_receive/${selPr}?LoginID=${LoginID}&Token=${Token}`)
            console.log('res', res)
            if (res?.data[0][0]?.Status === "Success") {
                toast.success(res?.data[0][0]?.Message)
            }
            handleDel()
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <Modal
            isOpen={del}
            toggle={handleDel}
            className='modal-dialog-centered'
            backdrop={false}
        >
            <ModalHeader className='bg-transparent' toggle={handleDel}>
                Are you sure to delete {selPr} permanently?
            </ModalHeader>
            <ModalBody>
                <Row className='text-center'>
                    <Col xs={12}>
                        <Button color='danger' className='m-1' onClick={() => handleDelete()}>
                            Delete
                        </Button>
                        <Button className='m-1' color='secondary' outline onClick={() => handleDel()}>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default DeletePr