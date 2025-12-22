import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const ReleaseBill = ({ releaseBill, handleRelease, id, saveSecondary }) => {

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
            const res = await axios.post(`/pos_orders/release?id=${id}`, obj)
            console.log('res', res)
            if (res.status === 200) {
                toast.success(res.data[0][0].message, { position: 'top-right' })
                handleRelease()
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
                isOpen={releaseBill}
                toggle={handleRelease}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader toggle={handleRelease}>Release {id}</ModalHeader>
                <ModalBody>
                    <Row className='mb-1 mx-1'>
                        <Label>Enter Remark for Release Bill...</Label>
                        <Input
                            type='textarea'
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        />
                    </Row>
                    Are you sure you want to Release this Bill?
                </ModalBody>
                <ModalFooter className='text-center'>
                    <Button color='danger' className='m-1' onClick={handleDelete}>Save</Button>
                    <Button color='primary' className='m-1' outline onClick={handleRelease}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {
                releaseBill ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default ReleaseBill