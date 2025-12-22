import React, { useState, useEffect } from 'react'
import {
    Card, CardHeader, Row, Col, Label, Input, Modal, ModalHeader, ModalBody,
    Button,
    Accordion, AccordionBody, AccordionHeader, AccordionItem
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import moment from 'moment'

const Inventory = () => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')

    const [roomTypeData, setRoomTypeData] = useState([])
    console.log('roomTypeData==>', roomTypeData)
    const [count, setCount] = useState('')

    const getRoomTypeData = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "list"
            }
            const res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            if (res?.data[0].length > 0) {
                const result = res?.data[0].map(item => item).filter((value, index, self) => self.indexOf(value) === index)
                console.log('result', result)
                setRoomTypeData(result)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getRoomTypeData()
    }, [show])


    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())

    const [open, setOpen] = useState('')

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    const handleUpdateBulk = async id => {
        if (count > 0 && count.trim() !== '') {
            try {
                const obj = {
                    RoomID: id,
                    RoomCount: count,
                    AdjustedFor: "PMS",
                    FromDate: moment(fromDate).format('YYYY-MM-DD'),
                    ToDate: moment(toDate).format('YYYY-MM-DD'),
                }
                console.log('obj', obj)
                const res = await axios.post('/rooms/adjustment', obj, {
                    headers: {
                        LoginID,
                        Token,
                        Seckey: "abc",
                    }
                })
                console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success("Bulk updated successfully!")
                    setFromDate(new Date())
                    setToDate(new Date())
                    setCount('')
                }
            } catch (error) {
                console.log('error', error)
                toast.error(error.data.response.message)
            }
        } else {
            toast.error('Rooms cannot be blank or 0')
        }

    }
    return (
        <>
            <Card color='primary' inverse onClick={() => setShow(!show)}>
                <CardHeader className='rate_inventry_card_header'>
                    Inventory
                </CardHeader>
            </Card>
            <Modal
                isOpen={show}
                toggle={() => {
                    setShow(!show)
                }}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => {
                    setShow(!show)
                }}>
                    <span>Bulk Update Inventory</span>
                </ModalHeader>
                <ModalBody className='rate_inventry'>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <Row>
                        <Col lg='6' md='6' className='mb-1'>
                            <Label className='form-label' for='hf-picker'>
                                From Date :
                            </Label>
                            <Flatpickr
                                value={moment(fromDate).format('YYYY-MM-DD')}
                                id='hf-picker'
                                className='form-control'
                                onChange={date => setFromDate(moment(date[0]).format('l'))}
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        <Col lg='6' md='6' className='mb-1'>
                            <Label className='form-label' for='hf-picker'>
                                To Date :
                            </Label>
                            <Flatpickr
                                value={moment(toDate).format('YYYY-MM-DD')}
                                id='hf-picker'
                                className='form-control'
                                onChange={date => setToDate(moment(date[0]).format('l'))}
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        {/* <Col lg='12' md='12' className='mb-1'>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked' onClick={() => setMonday(!monday)} value='monday' checked={monday === true} />
                                <Label for='basic-cb-unchecked' className='form-check-label'>
                                    Mon
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked1' onChange={() => setTuesday(!tuesday)} checked={tuesday === true} value='tue' />
                                <Label for='basic-cb-unchecked1' className='form-check-label'>
                                    Tue
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked2' onChange={() => setWednesday(!wednesday)} checked={wednesday === true} value='wed' />
                                <Label for='basic-cb-unchecked2' className='form-check-label'>
                                    Wed
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked3' onChange={() => setThursday(!thursday)} checked={thursday === true} value='thu' />
                                <Label for='basic-cb-unchecked3' className='form-check-label'>
                                    Thu
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked4' onChange={() => setFriday(!friday)} checked={friday === true} value='fri' />
                                <Label for='basic-cb-unchecked4' className='form-check-label'>
                                    Fri
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked5' onChange={() => setSaturday(!saturday)} checked={saturday === true} value='sat' />
                                <Label for='basic-cb-unchecked5' className='form-check-label'>
                                    Sat
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked6' onChange={() => setSunday(!sunday)} checked={sunday === true} value='sun' />
                                <Label for='basic-cb-unchecked6' className='form-check-label'>
                                    Sun
                                </Label>
                            </div>
                        </Col> */}
                    </Row>
                    <Accordion className='accordion-margin' open={open} toggle={toggle}>
                        {
                            roomTypeData.length > 0 && (
                                roomTypeData.map((r, rid) => {
                                    return (
                                        <AccordionItem key={rid}>
                                            <AccordionHeader targetId={rid + 1}>
                                                <div className='accordion-img'>
                                                    <span>{r.roomDisplayName}</span>
                                                </div>
                                            </AccordionHeader>
                                            <AccordionBody accordionId={rid + 1}>
                                                <Col className='mb-1 w-100'>
                                                    <Label>Number Of Room To Be Adjusted:</Label>
                                                    <Col className='d-flex flex-row justify-content-between align-items-end'>
                                                        <Input className='w-50 mb-0' type='number' value={count} onChange={e => setCount(e.target.value)} />
                                                        <Button color='primary' className='mt-1' onClick={() => handleUpdateBulk(r.roomID)}>Save</Button>
                                                    </Col>
                                                </Col>
                                            </AccordionBody>
                                        </AccordionItem>
                                    )
                                })
                            )
                        }
                        {/* <AccordionItem>
                            <AccordionHeader targetId='1'>
                                <div className='accordion-img'>
                                    <span>Standard Room</span>
                                </div>
                            </AccordionHeader>
                            <AccordionBody accordionId='1'>
                                <span>Number Of Room TO Be Adjusted</span>
                                <Col lg='4' md='4' className='mb-1'>
                                    <Input type='text' />
                                </Col>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId='2'>
                                <div className='accordion-img'>
                                    Deluxe
                                </div>
                            </AccordionHeader>
                            <AccordionBody accordionId='2'>
                                <span>Number Of Room TO Be Adjusted</span>
                                <Col lg='4' md='4' className='mb-1'>
                                    <Input type='text' />
                                </Col>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId='3'>
                                <div className='accordion-img'>
                                    Executive Room
                                </div>
                            </AccordionHeader>
                            <AccordionBody accordionId='3'>
                                <span>Number Of Room TO Be Adjusted</span>
                                <Col lg='4' md='4' className='mb-1'>
                                    <Input type='text' />
                                </Col>
                            </AccordionBody>
                        </AccordionItem> */}
                    </Accordion>
                    {/* <div className='text-end mt-1'>
                        <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                            e.preventDefault()
                        }}>
                            Save
                        </Button>
                        <Button className='me-1' color='danger' type='submit' onClick={(e) => {
                            e.preventDefault()
                            setShow(!show)
                        }}>
                            Close
                        </Button>
                    </div> */}
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

export default Inventory