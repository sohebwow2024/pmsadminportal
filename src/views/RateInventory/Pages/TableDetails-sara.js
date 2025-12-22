import React, { useState } from 'react'
import {
    Modal, ModalHeader, ModalBody,
    Button, Input, Row, Col
} from 'reactstrap'
import { BsThreeDotsVertical } from 'react-icons/bs'
import axios from '../../../API/axios'
import moment from "moment"
import { useSelector } from 'react-redux'

function TableDetails(props) {
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')
    const [adult, setAdult] = useState(props.extraAdultRate)
    const [child, setChild] = useState(props.extraChildRate)
    // const [child2, setChild2] = useState(200)
    const [guest1, setGuest1] = useState(props.rate)
    // const [guest2, setGuest2] = useState(300)
    const roomID = props.roomID
    const roomTypeID = props.roomTypeID
    const dateSelected = props.dateSelected
    const extraBedCharges = props.extraBedCharges
    const statusId = props.statusId

    // const userId = localStorage.getItem('user-id')

    let gstRate = 0
    if (guest1 >= 0 && guest1 <= 999) {
        gstRate = 0
    } else if (guest1 >= 1000 && guest1 <= 7499) {
        gstRate = 12
    } else if (guest1 >= 7500) {
        gstRate = 18
    }

    const totalTax = guest1 / gstRate * 100
    const totalAmount = totalTax + guest1

    const rateInventoryInsert = () => {
        try {
            const rateInventoryInsertBody = {
                LoginID,
                Token,
                Seckey: "abc",
                rateandinventory: [
                    {
                        RoomID: roomID,
                        RoomTypeID: roomTypeID,
                        ExtraAdultPrice: parseInt(adult),
                        ExtraChildPrice: parseInt(child),
                        ExtraBedCharges: extraBedCharges,
                        PriceValidOnDate: moment(dateSelected).format('l'),
                        StatusID: statusId,
                        RoomRate: parseInt(guest1),
                        CGST_P: 9.0,
                        SGST_P: 9.0,
                        IGST_P: 18.0,
                        TotalTax: totalTax,
                        TotalAmount: totalAmount
                    },
                    {
                        RoomID: roomID,
                        RoomTypeID: roomTypeID,
                        ExtraAdultPrice: parseInt(adult),
                        ExtraChildPrice: parseInt(child),
                        ExtraBedCharges: extraBedCharges,
                        PriceValidOnDate: moment(dateSelected).format('l'),
                        StatusID: statusId,
                        RoomRate: parseInt(guest1),
                        CGST_P: 9.0,
                        SGST_P: 9.0,
                        IGST_P: 18.0,
                        TotalTax: totalTax,
                        TotalAmount: totalAmount
                    }
                ]
            }
            console.log("rateInventoryInsertBody", rateInventoryInsertBody)
            axios.post(`/setdata/rateinventory`, rateInventoryInsertBody)
                .then((res) => {
                    console.log("rate inventory update response", res?.data[0])
                })
        } catch (error) {
            console.log("Rate Inventory Insert Error", error.message)
        }
    }

    const tableDataSubmit = () => {
        rateInventoryInsert()
    }

    return (
        <>
            <div className='d-flex align-items-center' style={{ cursor: 'pointer' }} onClick={() => setShow(!show)}><BsThreeDotsVertical />
                {props.rate}
                {   // TODO - if value is not set and value taken from the base 
                    true ? (<sup className="text-warning">**</sup>) : null
                }
            </div>

            <Modal
                isOpen={show}
                toggle={() => {
                    setShow(!show)
                }}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                bsSize='sm'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => {
                    setShow(!show)
                }}>
                    <p>{props.roomtype}</p>
                </ModalHeader>
                <ModalBody className='rate_inventry'>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupnumber className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupnumber>
                    ) : null}
                    <div >
                        <Row className="d-flex align-items-center">
                            <Col md={6} className='mt-1'>
                                <span>Rate</span>
                            </Col>
                            <Col md={6} className='mt-1'>
                                <Input type='number' value={guest1} size='small' onChange={(e) => setGuest1(e.target.value)} disabled={!visible} />
                            </Col>

                            <Col md={6} className='mt-1'>
                                <span>Extra Adult</span>
                            </Col>
                            <Col md={6} className='mt-1'>
                                <Input type='number' size='small' value={adult} onChange={(e) => setAdult(e.target.value)} disabled={!visible} />
                            </Col>
                            <Col md={6} className='mt-1'>
                                <span>Extra Child</span>
                            </Col>
                            <Col md={6} className='mt-1'>
                                <Input type='number' value={child} size='small' onChange={(e) => setChild(e.target.value)} disabled={!visible} />
                            </Col>
                            {/* {
                                false ? (
                                    <>

                                        <Col md={6} className='mt-1'>
                                            <span>Extra Child 2</span>
                                        </Col>
                                        <Col md={6} className='mt-1'>
                                            <Input type='number' value={child2} size='small' onChange={(e) => setChild2(e.target.value)} disabled={!visible} />
                                        </Col>

                                        <Col md={6} className='mt-1'>
                                            <span>Rate ( guest 2 )</span>
                                        </Col>
                                        <Col md={6} className='mt-1'>
                                            <Input type='number' value={guest2} size='small' onChange={(e) => setGuest2(e.target.value)} disabled={!visible} />
                                        </Col>
                                    </>
                                ) : null
                            } */}
                        </Row>
                    </div>
                    <div className='text-center p-2'>
                        {!visible ? <Button className='me-1' color='primary' onClick={(e) => {
                            e.preventDefault()
                            setVisible(true)
                        }}>Edit</Button> : <></>}


                        {visible ? <><Button className='me-1' color='success' onClick={() => {
                            setShow(!show)
                            tableDataSubmit()
                        }}>Update</Button>

                            <Button color='danger' onClick={(e) => {
                                e.preventDefault()
                                setShow(!show)
                                setVisible(false)
                            }}>Cancel</Button></> : <></>}


                    </div>
                </ModalBody>

            </Modal>
            {
                show ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default TableDetails