import React from 'react'
import { useState } from 'react'
import { Col, Form, FormFeedback, Input, Label, Row, Tooltip } from 'reactstrap'

const ItemDisplay = ({ index, curr_item, items, setItems }) => {

    const [receiveCount, setReceiveCount] = useState('')
    const [iCheck, setIcheck] = useState(curr_item.check)

    const calc_remain_count = () => {
        let finalCount = curr_item.pO_Item_Count - (curr_item.received_Count + (receiveCount === '' ? 0 : Number(receiveCount)))
        return finalCount
    }

    const checkFunc = (val) => {
        let modified_arr = items.map(i => {
            if (i.pOItemID === curr_item.pOItemID) {
                i.check = val
            }
            return i
        })
        setItems(modified_arr)
    }

    const handleReceivedCount = (e) => {
        setReceiveCount(e.target.value)
        let nowCount
        if (e.target.value <= (curr_item.pO_Item_Count - curr_item.received_Count)) {
            setReceiveCount(e.target.value)
            nowCount = e.target.value
            let modified_arr = items.map(i => {
                if (i.pOItemID === curr_item.pOItemID) {
                    i.Quantity = Number(nowCount)
                }
                return i
            })
            setItems(modified_arr)
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
                            value={curr_item.pO_Item_Count}
                            disabled
                        />
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Received Earlier</Label>}
                        <Input
                            type='number'
                            value={curr_item.received_Count}
                            disabled
                        />
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Received Now</Label>}
                        <Input
                            type='number'
                            value={receiveCount}
                            disabled={curr_item.check === false ? true : false || curr_item.pO_Item_Count - curr_item.received_Count === 0 ? true : false}
                            invalid={(receiveCount !== '' && (curr_item.check && receiveCount <= 0) || (curr_item.check && receiveCount > (curr_item.pO_Item_Count - curr_item.received_Count)))}
                            onChange={e => {
                                handleReceivedCount(e)
                            }}
                        />
                        {curr_item.check && receiveCount <= 0 && <FormFeedback>Received value needs to be greater than 0</FormFeedback>}
                        {curr_item.check && receiveCount > (curr_item.pO_Item_Count - curr_item.received_Count) && <FormFeedback>Received value cannot be greater than Remaining Quantity</FormFeedback>}
                    </Col>
                    <Col>
                        {index === 0 && <Label className='form-label'>Remaining</Label>}
                        <Col className='d-flex flex-row align-items-center'>
                            <Input
                                type='number'
                                value={calc_remain_count()}
                                disabled
                            />
                            <Input
                                className='ms-1'
                                type='checkbox'
                                checked={iCheck}
                                onChange={() => {
                                    setIcheck(!iCheck)
                                    checkFunc(!iCheck)
                                }}
                            />
                        </Col>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default ItemDisplay