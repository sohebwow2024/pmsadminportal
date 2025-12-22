import React from 'react'
import { MoreVertical, Edit, Trash, ChevronDown, Eye, EyeOff } from 'react-feather'
import {
    Table, Badge, Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form
} from 'reactstrap'

const ExtendDeparture = () => {
   
    return (
        <>
            <Form className=''>
                <Row>
                    <Col sm='12' className='mb-1'>
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
                    <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='EmailVertical'>
                            Current Departure Date
                        </Label>
                        <Input type='text' name='text' id='EmailVertical' placeholder='Current Departure Date' />
                    </Col>
                    <Col sm='12' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Proposed Departure Date
                        </Label>
                        <Input type='text' name='text' id='mobileVertical' placeholder='Proposed Departure Date' />
                    </Col>
                </Row>
                <Button className='me-2' color='primary' style={{ marginTop: '24px' }} onClick={(e) => {
                    e.preventDefault()
                }}>Update</Button>
                <Button className='me-2' color='warning' style={{ marginTop: '24px' }} onClick={(e) => {
                    e.preventDefault()
                }}>Close</Button>
            </Form>

        </>
    )
}

export default ExtendDeparture