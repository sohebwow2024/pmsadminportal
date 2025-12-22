import React, { useState } from 'react'
import {
    Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form, Alert
} from 'reactstrap'
import { AiFillCalculator } from 'react-icons/ai'
import { BsCalculator } from 'react-icons/bs'

const GSTCalculator = () => {
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')
    const [amount, setAmount] = useState()
    const [gst, setGst] = useState()
    const [gstAmount, setGstAmount] = useState()
    const [totalAmount, setTotalAmount] = useState()

    const gstChanges = (e) => {
        if (e.target.value === "0") {
            return
        }
        setGst(Number(e.target.value))
    }
    const amountHandle = (e) => {
        setAmount(Number(e.target.value))
        setGst(0)
    }
    const handleClick = (e) => {
        // e.preventDefault()
        const result = amount * (Number(e.target.value) / 100)
        setGstAmount(result)
        const tAmt = result + amount
        setTotalAmount(tAmt)
    }

    return (
        <>
            <BsCalculator size={20} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} />
            <Modal
                isOpen={show}
                toggle={() => {
                    setShow(!show)
                    setAmount()
                    setGst()
                    setGstAmount()
                    setTotalAmount()
                }}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='sm'
            >
                <ModalHeader className='bg-transparent' toggle={() => {
                    setShow(!show)
                    setAmount()
                    setGst()
                    setGstAmount()
                    setTotalAmount()
                }}>
                    <p>GST Calculator</p>
                </ModalHeader>
                <ModalBody>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <Form>
                        <Row>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='nameVertical'>
                                    Price Excluding GST ₹
                                </Label>
                                <Input
                                    type='number'
                                    name='name'
                                    id='nameVertical'
                                    placeholder='GST Rate'
                                    value={amount}
                                    onChange={(e) => {
                                        amountHandle(e)
                                    }} />
                            </Col>
                            <Col sm='12' className='d-flex flex-column justify-content-center align-items-center'>
                                <div>
                                    <Input type='text' placeholder='Custom GST' id='custom-gst' name='custom-gst' value={gst} onChange={(e) => {
                                        gstChanges(e)
                                        handleClick(e)
                                    }} />
                                </div>
                                <div className='demo-inline-spacing '>
                                    <div className='form-check'>
                                        <Input type='radio' id='ex1-active' defaultChecked name='ex1' value="5"
                                            checked={gst === 5} onChange={(e) => {
                                                gstChanges(e)
                                                handleClick(e)
                                            }} />
                                        <Label className='form-check-label' for='ex1-active'>
                                            5 %
                                        </Label>
                                    </div>
                                    <div className='form-check'>
                                        <Input type='radio' name='ex1' id='ex1-inactive' value="12"
                                            checked={gst === 12} onChange={(e) => {
                                                gstChanges(e)
                                                handleClick(e)
                                            }} />
                                        <Label className='form-check-label' for='ex1-inactive'>
                                            12 %
                                        </Label>
                                    </div>
                                    <div className='form-check'>
                                        <Input type='radio' name='ex2' id='ex2-inactive' value="18"
                                            checked={gst === 18} onChange={(e) => {
                                                gstChanges(e)
                                                handleClick(e)
                                            }} />
                                        <Label className='form-check-label' for='ex2-inactive'>
                                            18 %
                                        </Label>
                                    </div>
                                </div>
                            </Col>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='EmailVertical'>
                                    Price Including GST ₹
                                </Label>
                                <Input type='number' name='text' id='EmailVertical' placeholder='Price Including GST ₹' value={totalAmount} disabled />
                            </Col>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='mobileVertical'>
                                    GST ₹
                                </Label>
                                <Input type='text' name='text' id='mobileVertical' placeholder='GST ₹' value={gstAmount} disabled />
                            </Col>
                            {/* <Col sm='12'>
                                <div className='text-center'>
                                    <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                                        e.preventDefault()
                                        handleClick(e)
                                    }}>
                                        Calculate
                                    </Button>
                                </div>
                            </Col> */}
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default GSTCalculator