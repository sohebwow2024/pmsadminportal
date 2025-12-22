import React, { useState } from 'react'
import {
    Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form, Alert, Accordion, AccordionBody, AccordionHeader, AccordionItem
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'

function Restrication() {
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [checkSun, setCheckSun] = useState(false)
    const [checkMon, setCheckMon] = useState(false)
    const [checkTue, setCheckTue] = useState(false)
    const [checkWed, setCheckWed] = useState(false)
    const [checkThu, setCheckThu] = useState(false)
    const [checkFri, setCheckFri] = useState(false)
    const [checkSat, setCheckSat] = useState(false)
    
    const [open, setOpen] = useState('')

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    const handleCheck = (e) => {
        setCheck(e.target.value)
    }
    return (
        <>
            <Card color='danger' inverse onClick={() => setShow(!show)}>
                <CardHeader className='rate_inventry_card_header'>
                    Restrication
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
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => {
                    setShow(!show)
                }}>
                    <span>Bulk Update Restrication</span>
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
                                value={fromDate}
                                id='hf-picker'
                                className='form-control'
                                onChange={date => setFromDate(date)}
                                options={{
                                    altInput: true,
                                    altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        <Col lg='6' md='6' className='mb-1'>
                            <Label className='form-label' for='hf-picker'>
                                To Date :
                            </Label>
                            <Flatpickr
                                value={toDate}
                                id='hf-picker'
                                className='form-control'
                                onChange={date => setToDate(date)}
                                options={{
                                    altInput: true,
                                    altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        <Col lg='12' md='12' className='mb-1'>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked' onClick={() => setCheckMon(!checkMon)} checked={checkMon === true} value='mon' />
                                <Label for='basic-cb-unchecked' className='form-check-label'>
                                    Mon
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked1' onClick={(e) => setCheckTue(!checkTue)} checked={checkTue === true} value='tue' />
                                <Label for='basic-cb-unchecked1' className='form-check-label'>
                                    Tue
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked2' onClick={(e) => setCheckWed(!checkWed)} checked={checkWed === true} value='wed' />
                                <Label for='basic-cb-unchecked2' className='form-check-label'>
                                    Wed
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked3' onClick={(e) => setCheckThu(!checkThu)} checked={checkThu === true} value='thu' />
                                <Label for='basic-cb-unchecked3' className='form-check-label'>
                                    Thu
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked4' onClick={(e) => setCheckFri(!checkFri)} checked={checkFri === true} value='fri' />
                                <Label for='basic-cb-unchecked4' className='form-check-label'>
                                    Fri
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked5' onClick={(e) => setCheckSat(!checkSat)} checked={checkSat === true} value='sat' />
                                <Label for='basic-cb-unchecked5' className='form-check-label'>
                                    Sat
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-cb-unchecked6' onClick={(e) => setCheckSun(!checkSun)} checked={checkSun === true} value='sun' />
                                <Label for='basic-cb-unchecked6' className='form-check-label'>
                                    Sun
                                </Label>
                            </div>
                        </Col>
                    </Row>
                    <Accordion className='accordion-margin' open={open} toggle={toggle}>
                        <AccordionItem>
                            <AccordionHeader targetId='1'>Standard Room ( AP )</AccordionHeader>
                            <AccordionBody accordionId='1'>
                                <h5>Standard</h5>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId='2'>Standard Room ( MAP )</AccordionHeader>
                            <AccordionBody accordionId='2'>
                                <h4>Standard</h4>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId='3'>Standard Room ( EP )</AccordionHeader>
                            <AccordionBody accordionId='3'>
                                <h4>Standard</h4>
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                    <div className='text-end mt-1'>
                        <Button className='me-1' color='success' type='submit' onClick={(e) => {
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
                    </div>
                </ModalBody>

            </Modal>
        </>
    )
}

export default Restrication