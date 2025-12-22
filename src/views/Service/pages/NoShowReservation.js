import React, { useState } from 'react'
import { MoreVertical, Edit, Trash, ChevronDown, Eye, EyeOff } from 'react-feather'
import {
    Table, Badge, Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button
} from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'

const NoShowReservation = (props) => {
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')

    const colourOptions = [
        { value: 'ocean', label: 'Ocean' },
        { value: 'blue', label: 'Blue' },
        { value: 'purple', label: 'Purple' },
        { value: 'red', label: 'Red' },
        { value: 'orange', label: 'Orange' }
    ]
    return (
        <>
            {show ? (<p className='m-0 mx-50'><Eye style={{ cursor: 'pointer' }} size={20} onClick={() => setShow(!show)} /></p>) : (<p className='m-0 mx-50'><EyeOff style={{ cursor: 'pointer' }} size={20} onClick={() => setShow(!show)} /></p>)}
            <Modal
                isOpen={show}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
                    <p>No Show Reservation {props.id}</p>
                </ModalHeader>
                <ModalBody>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <Row>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Res#</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.registration}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Guest</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.guest}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Room</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.roomType}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Total</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.totalAmount}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Deposit</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.deposit}</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Folip #</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.folip}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Res Type</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.registrationType}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Arrival</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.arrivalDate}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Departure</p>
                                </div>
                                <div className="head align-items-center">
                                    <p className="my-50">{props.departureDate}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top py-50">
                                <div className="head align-items-center">
                                    <p className="my-50">Reason</p>
                                </div>
                                <div className="head align-items-center">
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={colourOptions[1]}
                                        name='clear'
                                        options={colourOptions}
                                        isClearable
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end border-top">
                        <Button className='me-1 my-50' color='success' type='submit' onClick={(e) => {
                            e.preventDefault()
                        }} >
                            Save
                        </Button>
                        <Button className='me-1 my-50' color='primary' type='submit' onClick={(e) => {
                            e.preventDefault()
                            setShow(!show)
                        }} >
                            Close
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

        </>
    )
}

export default NoShowReservation