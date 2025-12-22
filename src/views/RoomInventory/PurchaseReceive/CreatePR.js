import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import ItemDisplay from './ItemDisplay'
import toast from 'react-hot-toast'

const CreatePR = ({ POID, show, handleShow }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID } = getUserData

    const [save, setSave] = useState(false)
    const [poNo, setPoNo] = useState('')
    const [receivedBy, setReceivedBy] = useState('')
    const [prDate, setPrDate] = useState(new Date())
    const [remark, setRemark] = useState('')
    const [items, setItems] = useState([])
    console.log("Items==>",items);
    const getPoNumber = async () => {
        try {
            const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${POID}&PropertyID=${PropertyID}`)
            console.log('res', res)
            setPoNo(res?.data[0][0]?.poNumber)
        } catch (error) {
            console.log('ponoError', error``)
        }
    }

    const getPoItemsinfo = async () => {
        try {
            const res = await axios.get(`/inventory/po_received_count?LoginID=${LoginID}&Token=${Token}&POID=${POID}`)
            console.log('Itemsres', res)
            let result = res?.data[0]
            let arr = result.map(r => {
                return { check: false, Quantity: 0, ...r }
            })
            setItems(arr)
            // setItems(res?.data[0])
        } catch (error) {
            console.log('infoError', error)
        }
    }

    useEffect(() => {
        getPoNumber()
        getPoItemsinfo()
    }, [])

    const handlePR = async () => {
        console.log('items', items)
        let item_arr = items.filter(i => i.check === true && i.Quantity > 0).map(i => {
            return { POItemID: i.poItemID, Quantity: i.Quantity, EntryType: 'I' }
        })
        console.log('final_items_arr', item_arr)
        let obj = {
            LoginID,
            Token,
            Seckey : "abc",
            POID,
            ReceivedDate: prDate,
            ReceivedBy: receivedBy,
            Remarks: remark,
            PropertyID,
            ReceivedItems: item_arr
        }
        console.log('obj', obj)
        try {
            const res = await axios.post(`/inventory/purchase_receive`, obj)
            console.log('res', res)
            if (res?.data[0][0]?.status === "Success") {
                toast.success(res?.data[0][0]?.message)
                handleShow()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            {console.log('items', items)}
            <Modal
                isOpen={show}
                toggle={handleShow}
                className='modal-dialog-centered modal-xl'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleShow}>
                    Add Purchase Receive
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className='mb-1'>
                            <Label className='form-label'>PO ID</Label>
                            <Input
                                type='text'
                                value={POID}
                                disabled
                            />
                        </Col>
                        <Col className='mb-1'>
                            <Label className='form-label'>PO Number</Label>
                            <Input
                                type='text'
                                value={poNo}
                                disabled
                            />
                        </Col>
                        <Col className='mb-1'>
                            <Label className='form-label'>Received By<span className='text-danger'>*</span></Label>
                            <Input
                                type='text'
                                placeholder='Receiver name'
                                value={receivedBy}
                                onChange={e => setReceivedBy(e.target.value)}
                                invalid={save && receivedBy === ''}
                            />
                            {save && !receivedBy ? <span className='error_msg_lbl'>Enter Receiver Name </span> : null}
                        </Col>
                    </Row>
                    <Row>
                        <Col md='3' className='mb-1'>
                            <Label className='form-label'>Date</Label>
                            <Flatpickr
                                id='startDate'
                                className='form-control'
                                options={{
                                    altInput: true,
                                    altFormat: 'd-m-y',
                                    dateFormat: 'd-m-y',
                                    // minDate: moment(new Date()).subtract(1, 'days')
                                }}
                                value={moment(prDate).toISOString()}
                                onChange={date => setPrDate(date[0])}
                            />
                        </Col>
                        <Col className='mb-1'>
                            <Label className='form-label'>Remark</Label>
                            <Input
                                type='text'
                                placeholder='Remark goes here...'
                                value={remark}
                                onChange={e => setRemark(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                items.length > 0 && (
                                    items.map((i, index) => {
                                        return (
                                            <ItemDisplay
                                                key={index + 1}
                                                index={index}
                                                curr_item={i}
                                                items={items}
                                                setItems={setItems}
                                            />
                                        )
                                    })
                                )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col className='text-center'>
                            <Button
                                color='primary'
                                size='lg'
                                disabled={receivedBy === ''}
                                onClick={() => handlePR()}
                            >Save</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default CreatePR