import React, { useState } from 'react'
import { MoreVertical, Edit, Trash, ChevronDown, Eye, EyeOff } from 'react-feather'
import {
    Table, Badge, Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form
} from 'reactstrap'

const RoomTransfer = () => {
    const [upgrade, setUpgrade] = useState('')

    const upgradeChange = (e) => {
        if (e.target.value === "0") {
            return
        }
        setUpgrade(e.target.value)
    }
    return (
        <>
            <Form className='border-bottom'>
                <Row>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>
                            Guest Name
                        </Label>
                        <Input
                            type='text'
                            name='name'
                            id='nameVertical'
                            placeholder='Guest Name'

                        />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='EmailVertical'>
                            Arrival
                        </Label>
                        <Input type='text' name='text' id='EmailVertical' placeholder='Arrival' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Departure
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='Departure' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            System Rate
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='System Rate' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Agreed Rate
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='Agreed Rate' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Old Room Category
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='Old Room Category' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Room Number
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='Room Number' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            New Room Category
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='New Room Category' />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Rate Type
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='New Room Category' />
                    </Col>
                    <Col sm='6' className='mb-1'>
                        <div className='form-check'>
                            <Input type='radio' id='ex1-active' name='ex1' value="paid" checked={upgrade === 'paid'} onChange={(e) => upgradeChange(e)} />
                            <Label className='form-check-label' for='ex1-active'>
                                Paid Upgrade
                            </Label>
                        </div>
                    </Col>
                    <Col sm='6' className='mb-1'>
                        <div className='form-check'>
                            <Input type='radio' id='ex2-active' name='ex2' value="free" checked={upgrade === 'free'} onChange={(e) => upgradeChange(e)} />
                            <Label className='form-check-label' for='ex2-active'>
                                Free Upgrade
                            </Label>
                        </div>
                    </Col>
                </Row>
            </Form>
            <CardTitle style={{ backgroundColor: '#c3bdbd', padding: '10px' }}>
                Selected Room Information
            </CardTitle>
            <Row>
                <Col sm='4' className='mb-1'>
                    <Label className='form-label' for='mobileVertical'>
                        New Room Number
                    </Label>
                    <Input type='text' name='text' id='mobileVertical' placeholder='New Room Number' />
                </Col>
                <Col sm='4' className='mb-1'>
                    <Label className='form-label' for='mobileVertical'>
                        System Rate
                    </Label>
                    <Input type='text' name='text' id='mobileVertical' placeholder='System Rate' />
                </Col>
                <Col sm='4' className='mb-1'>
                    <Label className='form-label' for='mobileVertical'>
                        Agreed Rate
                    </Label>
                    <Input type='text' name='text' id='mobileVertical' placeholder='Agreed Rate' />
                </Col>
                <Col sm='4' className='mb-1'>
                    <Label className='form-label' for='mobileVertical'>
                        Transfer Person
                    </Label>
                    <Input type='text' name='text' id='mobileVertical' placeholder='Transfer Person' />
                </Col>
            </Row>
            <Button className='me-2' color='primary' style={{ marginTop: '24px' }} onClick={(e) => {
                e.preventDefault()
            }}>Transfer Room</Button>
            <Button className='me-2' color='warning' style={{ marginTop: '24px' }} onClick={(e) => {
                e.preventDefault()
            }}>Close</Button>

        </>
    )
}

export default RoomTransfer