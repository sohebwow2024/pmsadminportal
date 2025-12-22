import React from 'react'
import { useState } from 'react'
import { CheckSquare, Edit3, X } from 'react-feather'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import axios from '../../../API/axios'

const EditItemDisplay = ({ index, curr_item, handleFlag }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
console.log('curr_item', curr_item);    
    const [receiveCount, setReceiveCount] = useState(curr_item.quantity)
    const [edit, setEdit] = useState(false)
    const handleEdit = () => setEdit(!edit)

    const calc_remain_count = () => {
        let finalCount = curr_item.pO_Quantity - (curr_item.received_Earlier + Number(receiveCount))
        return finalCount
    }

    const handleItemUpdate = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Quantity: receiveCount
            }
            console.log("updateItemres" ,obj);
            const res = await axios.post(`/inventory/update_received_item?ReceivedItemID=${curr_item.receivedItemID}`, obj)
            console.log('updateItemres', res)
            if (res?.data[0][0]?.status === "Success") {
                toast.success(res?.data[0][0]?.message)
                handleEdit()
                handleFlag()
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    return (
        <>
            <Form>
                <Row className='mb-1'>
                    <Col md='3'>
                        {index === 0 && <Label className='form-label'>Item ID</Label>}
                        <Input
                            type='text'
                            value={curr_item.poItemID}
                            disabled
                        />
                    </Col>
                    <Col md='3'>
                        {index === 0 && <Label className='form-label'>Product Name</Label>}
                        <Input
                            type='text'
                            value={curr_item.productName}
                            disabled
                        />
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>PO Quantity</Label>}
                        <Input
                            type='number'
                            value={curr_item.pO_Quantity}
                            disabled
                        />
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Received Earlier</Label>}
                        <Input
                            type='number'
                            value={curr_item.received_Earlier}
                            disabled
                        />
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Received Now</Label>}
                        <Input
                            type='number'
                            value={receiveCount}
                            disabled={edit === false}
                            invalid={receiveCount <= 0 || (receiveCount > (curr_item.pO_Quantity - curr_item.received_Earlier))}
                            onChange={e => setReceiveCount(e.target.value)}
                        />
                        {receiveCount <= 0 && <FormFeedback>Received value needs to be greater than 0</FormFeedback>}
                        {receiveCount > (curr_item.pO_Quantity - curr_item.received_Earlier) && <FormFeedback>Received value cannot be greater than Remaining Quantity</FormFeedback>}
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Remaining</Label>}
                        <Col className='d-flex flex-row align-items-center'>
                            <Input
                                type='number'
                                value={calc_remain_count()}
                                disabled
                            />
                            {
                                edit ? (
                                    <>
                                        <div>
                                            {receiveCount <= 0 || (receiveCount > (curr_item.pO_Quantity - curr_item.received_Earlier)) ? (
                                                <CheckSquare className='cursor-pointer ms-1' color='green' size={20} onClick={() => toast.error('Enter correct value!')} />
                                            ) : (
                                                <CheckSquare className='cursor-pointer ms-1' color='green' size={20} onClick={() => handleItemUpdate()} />
                                            )}
                                            <X className='cursor-pointer ms-1' color='grey' size={20} onClick={() => (handleEdit(), setReceiveCount(curr_item.quantity))} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <Edit3 className='cursor-pointer ms-1' color='blue' size={20} onClick={() => handleEdit()} />
                                        </div>
                                    </>
                                )
                            }
                        </Col>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default EditItemDisplay