import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const ReleaseBill = ({ holdBill, handleHold, id, getInvoiceListing }) => {

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
            const res = await axios.post(`/pos_orders/Release?id=${id}`, obj)
            console.log('res', res)
            if (res.status === 200) {
                toast.success(res.data[0][0].Message, { position: 'top-right' })
                handleHold()
                getInvoiceListing()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }
    return (
        <>
            <Modal
                isOpen={holdBill}
                toggle={handleHold}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader toggle={handleHold}>Hold {id}</ModalHeader>
                <ModalBody>
                    <Row className='mb-1 mx-1'>
                        <Label>Enter Remark for Hold Bill...</Label>
                        <Input
                            type='textarea'
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        />
                    </Row>
                    Are you sure you want to Hold this Bill?
                </ModalBody>
                <ModalFooter className='text-center'>
                    <Button color='danger' className='m-1' onClick={handleDelete}>Save</Button>
                    <Button color='primary' className='m-1' outline onClick={handleHold}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {
                holdBill ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default ReleaseBill