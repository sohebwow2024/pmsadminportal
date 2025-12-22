
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../API/axios'

const StockOut = ({ open, handleOpen, id, name, prd }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [save, setSave] = useState(false)
    const [outby, setOutBy] = useState('')
    const [quantity, setQuantity] = useState('')
    const [note, setNote] = useState('')

    const AddOutProduct = async () => {
        setSave(true)
        if (quantity > 0 && quantity <= prd.closeQuantity && outby !== '') {
            const obj = {
                LoginID,
                Token,
                ProductID: id,
                OutBy: outby,
                OutQuantity: quantity,
                Note: note
            }
            console.log(obj);
            try {
                const res = await axios.post(`/inventory/out_product`, obj, {
                    headers: {
                        LoginID,
                        Token
                    }
                })
                console.log('res', res)
                toast.success("Out Stock Added")
                handleOpen()
            } catch (error) {
                console.log('error', error.response.data.message)
                toast.error(error.response.data.message)
            }
        } else {
            toast.error('Fill all Fields, correctly')
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader toggle={handleOpen}>Product Out - {name}, {id}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Out By<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='outby'
                                    placeholder='Out By'
                                    value={outby}
                                    onChange={e => setOutBy(e.target.value)}
                                    invalid={save && outby === ''}
                                />
                                {save && outby === '' && <span className='text-danger'>Outby is required</span>}
                            </Col>
                            <Col>
                                <Label>Out Quantity<span className='text-danger'>*</span></Label>
                                <Input
                                    type='number'
                                    name='quantity'
                                    placeholder='Out Quantity'
                                    value={quantity}
                                    invalid={save && (quantity <= 0 || quantity > prd.closeQuantity)}
                                    onChange={e => setQuantity(e.target.value)}
                                />
                                {save && quantity <= 0 && <span className='text-danger'>Quantity should be grater than '0'</span>}
                                {save && quantity > prd.closeQuantity && <span className='text-danger'>Quantity cannot be grater than current quantity</span>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>Note</Label>
                                <Input
                                    type='text'
                                    name='note'
                                    placeholder='Product Out Note'
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Col className='text-center'>
                        <Button color='primary' className='mx-1' onClick={AddOutProduct}>Add</Button>
                        <Button type='reset' className='m-1' outline onClick={handleOpen}> Cancel</Button>
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

export default StockOut