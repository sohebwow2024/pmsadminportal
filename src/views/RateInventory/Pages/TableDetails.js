import React, { useEffect, useState } from 'react'
import {
    Modal, ModalHeader, ModalBody,
    Button, Input, Row, Col, Label
} from 'reactstrap'
import { BsThreeDotsVertical } from 'react-icons/bs'
import axios from '../../../API/axios'
import moment from "moment"
import { FaChild, FaUserFriends, FaUserTie, FaUserTimes } from 'react-icons/fa'
import InputNumber from 'rc-input-number'
import '@styles/react/libs/input-number/input-number.scss'

import { Minus, Plus } from 'react-feather'
import { useSelector } from 'react-redux'

const TableDetails = (props) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    let roleType = getUserData?.UserRoleType
    // if (props.ratePriceID) {
    //     console.log(' - selected date - ', props.dateSelected)
    //     console.log(' - Rate - ', props.rateRoomRate)
    // }
    //console.log(' - Key - ', props.tableKey)

    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')
    const [rate, setRate] = useState(props.rateRoomRate)
    // console.log('props.rateRoomRate', props.rateRoomRate);
    // console.log('rate', rate);
    const [adult, setAdult] = useState(props.rateExtraAdultPrice)
    const [child, setChild] = useState(props.rateExtraChildPrice)
console.log("Props in TableDetails", props);
    useEffect(() => {
        setRate(props.rateRoomRate)
        setAdult(props.rateExtraAdultPrice)
        setChild(props.rateExtraChildPrice)
    }, [props.dateSelected, props.refreshList])
    // const [child2, setChild2] = useState(200)
    // const [guest2, setGuest2] = useState(300)
    const roomID = props.rateRoomID
    const roomTypeID = props.rateRoomTypeID
    //const dateSelected = dateSelected
    const extraBedCharges = props.roomDetails.extraBedCharges
    const statusId = props.rateStatusID

    // const userId = localStorage.getItem('user-id')

    const gstRate = props.roomDetails.igsT_P
    // if (guest1 >= 0 && guest1 <= 999) {
    //     gstRate = 0
    // } else if (guest1 >= 1000 && guest1 <= 7499) {
    //     gstRate = 12
    // } else if (guest1 >= 7500) {
    //     gstRate = 18
    // }    
console.log("RoomDetails", props.roomDetails);
    const rateInventoryInsert = () => {
        const totalTax = rate * gstRate / 100
        const totalAmount = +totalTax + +rate
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
                        ExtraBedCharges: extraBedCharges ?? 0,
                        PriceValidOnDate: moment(props.dateSelected).format('y-MM-DDT00:00:00'),
                        StatusID: statusId,
                        RoomRate: parseInt(rate),
                        CGST_P: props.roomDetails.cgsT_P,
                        SGST_P: props.roomDetails.sgsT_P,
                        IGST_P: props.roomDetails.igsT_P,
                        TotalTax: parseFloat(Number(totalTax).toFixed(2)),
                        TotalAmount: parseFloat(Number(totalAmount).toFixed(2)),
                        RatePlanID: props.selMeal
                    }
                ]
            }
            console.log("rateInventoryInsertBody", rateInventoryInsertBody)
            axios.post(`/setdata/rateinventory`, rateInventoryInsertBody)
                .then((res) => {
                    console.log("rate inventory update response", res)
                    props.refreshList()
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
            <div key={`label_${props.tableKey}`} className='d-flex align-items-center' style={{ cursor: 'pointer' }} onClick={() => { roleType === 'Travel Agent' ? '' : setShow(!show) }}><BsThreeDotsVertical />

                {+rate + +(props.adults * adult)}

                {   // TODO - if value is not set and value taken from the base 

                    props.ratePriceID ? (<sup className="text-warning">**</sup>) : null
                }
            </div>

            <Modal
                isOpen={show}
                toggle={() => {
                    setShow(!show)
                }}
                className='modal-dialog-centered modal-lg'
                onClosed={() => setCardType('')}
                bssize='sm'
                backdrop={false}
                key={`modal_${props.tableKey}`}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => {
                    setShow(!show)
                }}>
                    <span>{props.roomDetails.roomDisplayName}</span>
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
                            <Col lg='7'>
                                <Row>
                                    <Col className='align-self-center mt-1 col-4'>
                                        <span>Rate</span>
                                    </Col>
                                    <Col className='mt-1 col-8'>
                                        <Input type='number' name="Rate" value={rate} bssize='small' onChange={(e) => setRate(e.target.value)} disabled={!visible} />
                                    </Col>

                                    <Col className='align-self-center mt-1 col-4'>
                                        <span>Extra Adult</span>
                                    </Col>
                                    <Col className='mt-1 col-8'>
                                        <Input type='number' name="XtraAdultRate" bssize='small' value={adult} onChange={(e) => setAdult(e.target.value)} disabled={!visible} />
                                    </Col>
                                    <Col className='align-self-center mt-1 col-4'>
                                        <span>Extra Child</span>
                                    </Col>
                                    <Col className='my-1 col-8'>
                                        <Input type='number' name="XtraChildRate" value={child} bssize='small' onChange={(e) => setChild(e.target.value)} disabled={!visible} />
                                    </Col>
                                </Row>
                                <Row>
                                    <div className='text-md-end text-center p-2'>
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
                                </Row>
                            </Col>
                            <Col lg='5 border-start-primary mb-auto' key={props.tableKey} >

                                {
                                    Array.from({ length: 1 }, (value, key) => {
                                        const [thisChild, setThisChild] = useState(props.roomDetails?.childBase)
                                        const [ttlWdChild, setTtlWdChild] = useState(+rate + +(props.adults * adult))
                                        const [wdChild, setWdChild] = useState(0)
                                        const baseChild = props.roomDetails?.childBase
                                        const maxChild = props.roomDetails?.childMax

                                        const calcTotal = (childCount) => {
                                            setThisChild(childCount)
                                            let childs = +childCount - +baseChild

                                            childs = childs > 0 ? childs : 0

                                            const totalGuestRate = (+rate + +(props.adults * adult)) + +(childs * child)
                                            setTtlWdChild(totalGuestRate)
                                            setWdChild(childs * child)
                                        }
                                        return (
                                            <Row key={`ratemodal_${key}`}>
                                                <Label className='col-4 mt-1 align-self-center text-end'><FaUserTie /> × {+props.adults + 1} = </Label>
                                                <Col className='col-8 mt-1'>
                                                    <Input type='number' className='text-end' name="XtraAdultTotalRate" value={+rate + +(props.adults * adult)} bssize='small' disabled />
                                                </Col>

                                                <Label className='col-4 mt-1 align-self-end text-end'>{thisChild <= props.roomDetails?.childBase ? '*' : null}<FaChild /> × <br />
                                                    <sub>(Child: {props.roomDetails?.childBase === props.roomDetails?.childMax ? props.roomDetails?.childBase : `${props.roomDetails?.childBase} : ${props.roomDetails?.childMax}`})</sub>
                                                </Label>
                                                <Col className='col-8 mt-1'>
                                                    <Row className=' flex-sm-row-reverse'>
                                                        <Col sm='6' className='ps-md-0'>
                                                            <Input type='number' className='text-end' name="XtraChildTotalRate" value={wdChild} bssize='small' disabled />
                                                        </Col>
                                                        <Col sm='6' className='pe-sm-0 mt-25 align-self-center'>
                                                            <InputNumber
                                                                min={0}
                                                                max={maxChild}
                                                                upHandler={<Plus />}
                                                                downHandler={<Minus />}
                                                                value={thisChild}
                                                                style={{ width: '6.5rem' }}
                                                                controls={true}
                                                                //placeholder={+row.quantity}
                                                                onChange={(e) => calcTotal(e)}
                                                            />
                                                        </Col>

                                                    </Row>

                                                </Col>
                                                <Label className='col-4 mt-1 align-self-center text-end'><FaUserFriends /> x {+props.adults + +1 + +thisChild} <br />
                                                    <sub>(Total)</sub>
                                                </Label>
                                                <Col className='col-8 my-1'>
                                                    <Input type='number' className='text-end' name="GuestTotalRate" value={ttlWdChild} bssize='small' disabled />
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                        </Row>
                        <Row className='d-none'>
                            <Col>Child Base: {props.roomDetails?.childBase}</Col>
                            <Col>Child Max: {props.roomDetails?.childMax}</Col>
                            <Col>Adult Base: {props.roomDetails?.adultBase}</Col>
                            <Col>Adult Max: {props.roomDetails?.adultMax}</Col>
                            <Col>Infant Max: {props.roomDetails?.infantMax}</Col>
                            <Col>Max Guests: {props.roomDetails?.guestMax}</Col>
                        </Row>
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