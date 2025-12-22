import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const CancelBill = ({ cancel, handleCancel, id, saveSecondary }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [remark, setRemark] = useState('')

    const handleDelete = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Remark: remark
            }
            const res = await axios.post(`/pos_orders/cancel?id=${id}`, obj)
            console.log('res', res)
            if (res.status === 200) {
                handleCancel()
                saveSecondary()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }
    return (
        <>
            <Modal
                isOpen={cancel}
                toggle={handleCancel}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader toggle={handleCancel}>Delete {id}</ModalHeader>
                <ModalBody>
                    <Row className='mb-1 mx-1'>
                        <Label>Enter Remark for cancellation of Bill...</Label>
                        <Input
                            type='textarea'
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        />
                    </Row>
                    Are you sure you want to Cancel this Bill?
                </ModalBody>
                <ModalFooter className='text-center'>
                    <Button color='danger' className='m-1' onClick={handleDelete}>Delete</Button>
                    <Button color='primary' className='m-1' outline onClick={handleCancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {
                cancel ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default CancelBill