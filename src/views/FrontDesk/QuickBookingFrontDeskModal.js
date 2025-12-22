import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'

import { selectThemeColors } from '@utils'

import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import DataTable from 'react-data-table-component'
import { Check, CheckSquare, ChevronDown, Edit, XSquare } from 'react-feather'
import ExtraServiceTable from './ExtraServiceTable'
import PaymentTable from './PaymentTable'
import RoomTransfer from './RoomTransfer'
import ExtendDeparture from './ExtendDeparture'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'

const roomOptions = []

const haveGstOptions = []

const houseKeepOption = [
    { value: 'dirty', label: 'DIRTY' },
    { value: 'clean', label: 'CLEAN' }
]

const QuickBookingModal = ({ open, handleOpen, roomData }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    const [roomList, setRoomList] = useState([])

    useEffect(() => {
        if (roomData?.roomAllocationID) {
            try {
                const bookingsBody = {
                    LoginID: LoginID,
                    Token: Token,
                    Seckey: "abc",
                    RoomAllocationID: roomData.roomAllocationID,
                    Event: "select"
                }
                axios.post(`/getdata/bookingdata/allocateroomnumber`, bookingsBody) // TODO - Why
                    .then(response => {
                        console.log("allocateroomnumber response", response?.data[0])
                        setRoomList(response?.data[0])
                    })
            } catch (error) {
                console.log("Bookings Error=====", error.message)
            }
        }

    }, [roomData])

    const [accopen, setAccopen] = useState('')
    const toggleAcc = id => { accopen === id ? setAccopen() : setAccopen(id) }

    const [picker, setPicker] = useState(new Date())

    // const data = [
    //     {
    //         id: 1,
    //         category: '1',
    //         ratePlan: '',
    //         assignedRoom: ''
    //     }
    // ]
    console.log('room data in modal - ', roomData)

    const [roomOpen, setRoomOpne] = useState(false)
    const handleRoomSelect = () => setRoomOpne(!roomOpen)
    const RoomAssign = ({ roomOpen, handleRoomSelect }) => {
        return (
            <Modal isOpen={roomOpen} toggle={handleRoomSelect} className='modal-dialog-centered'>
                <ModalHeader toggle={handleRoomSelect}> Assign Room</ModalHeader>
                <ModalBody>
                    <Select
                        placeholder='Select Room Number'
                        menuPlacement='auto'
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        options={roomOptions}
                    />
                    <Col className='my-1 text-center'>
                        <Button color='success' onClick={handleRoomSelect}>Assign</Button>
                    </Col>
                </ModalBody>
            </Modal>
        )
    }

    const checkinColumns = [
        {
            name: 'Room No',
            sortable: true,
            selector: row => row.roomNo
        },
        {
            name: 'Description',
            sortable: true,
            selector: row => row.description
        },
        {
            name: 'Floor No',
            sortable: true,
            selector: row => row.floorNo
        },
        {
            name: 'Action',
            sortable: true,
            width: '200px',
            selector: row => {
                return (
                    <>
                        {row.assignedRoom}
                        <Button color='primary' onClick={handleRoomSelect}>Assign Room</Button>

                    </>
                )
            }
        }
    ]

    const [isEdit, setIsEdit] = useState(false)
    const [serviceTable, setServiceTable] = useState(false)
    const [paymentTable, setPaymentTable] = useState(false)
    const [hasGst, setHasGst] = useState('')
    const [roomMark, setRoomMark] = useState(houseKeepOption[0])

    return (
        <>
            <Modal isOpen={open} toggle={handleOpen} className='modal-dialog-centered modal-xl' backdrop={false}>
                <ModalHeader className='bg-transparent' toggle={handleOpen}></ModalHeader>
                <ModalBody>
                    <Row className='d-flex flex-lg-row flex-column'>
                        <Col>
                            <Card>
                                <CardHeader className='d-flex justify-content-center'>
                                    <CardTitle>Guest Information</CardTitle>
                                    {isEdit === false ? <Edit className='mx-1' onClick={() => setIsEdit(true)} /> : null}
                                    {
                                        isEdit ? (
                                            <>
                                                <CheckSquare color='green' className='mx-1' onClick={() => setIsEdit(false)} />
                                                <XSquare color='red' className='mx-1' onClick={() => setIsEdit(false)} />
                                            </>
                                        ) : null
                                    }
                                </CardHeader>
                                <CardBody>
                                    <Row className='d-flex flex-column'>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest Name:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='something'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest Email:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='email'
                                                    value='test@test.com'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest Mobile:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='phone'
                                                    value='1234567890'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest City:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='city'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest State:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='state'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest Country:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Country'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Internal Note:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Note'
                                                    disabled={isEdit === false}
                                                />
                                            </Col>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader className='d-flex justify-content-center'>
                                    <CardTitle>Booking Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row className='d-flex flex-column'>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Booking Source:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Booking Source'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Booking Id:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Booking Id'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Check-In Date:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='date'
                                                    value={new Date()}
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Check-Out Date:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='date'
                                                    value={moment(new Date()).add(1, 'days')}
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Room Count:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='1'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Guest:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Guest'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Current Status:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='Current Status'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader className='d-flex justify-content-center'>
                                    <CardTitle>Payment Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row className='d-flex flex-column'>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Booking Commission:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Booking Amount:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>POS Orders:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Extra Service:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Total Amount:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Received Amount:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                        <Col className='mb-1 d-flex flex-row justify-content-between align-items-center'>
                                            <Col>
                                                <h5 className='mb-0'>Pending Amount:</h5>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type='text'
                                                    value='₹ 0.00'
                                                    disabled
                                                />
                                            </Col>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex flex-row flex-wrap justify-content-around align-items-center'>
                            <Button className='m-1' color='warning'>
                                Modify Booking
                            </Button>
                            <Button className='m-1' color='danger' >
                                Cancel Booking
                            </Button>
                            <Button className='m-1' color='success'>
                                Resend Voucher
                            </Button>
                            <Button className='m-1' color='primary'>
                                View / Download Voucher
                            </Button>
                            <Button className='m-1' color='primary'>
                                Send Web CheckIn Link
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='mt-1'>
                            <Accordion className='accordion-margin' open={accopen} toggle={toggleAcc}>
                                <AccordionItem>
                                    <AccordionHeader targetId='1'>
                                        Check In
                                    </AccordionHeader>
                                    <AccordionBody accordionId='1'>
                                        <Row>
                                            <Col>
                                                <Alert color='danger'>
                                                    <p className='alert-heading text-center'>
                                                        <b>Please Note</b> You would not be able to edit Check In data once created be careful while filling up this form.
                                                    </p>
                                                </Alert>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form>
                                                    <Row>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Arrival Date & Time</Label>
                                                            <Flatpickr
                                                                value={picker}
                                                                data-enable-time
                                                                id='date-time-picker'
                                                                className='form-control'
                                                                onChange={date => setPicker(date)}
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Expected Departure Date & Time</Label>
                                                            <Flatpickr
                                                                value={picker}
                                                                data-enable-time
                                                                id='date-time-picker'
                                                                className='form-control'
                                                                onChange={date => setPicker(date)}
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Vehicle No.</Label>
                                                            <Input
                                                                type='text'
                                                                name='Vehicle No'
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Coming From</Label>
                                                            <Input
                                                                type='text'
                                                                name='Coming From'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Going To</Label>
                                                            <Input
                                                                type='text'
                                                                name='Going to'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Id Proof Type<span className='text-danger'>*</span></Label>
                                                            <Select
                                                                placeholder=''
                                                                menuPlacement='auto'
                                                                theme={selectThemeColors}
                                                                className='react-select'
                                                                classNamePrefix='select'
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Name as per Id Proof<span className='text-danger'>*</span></Label>
                                                            <Input
                                                                type='text'
                                                                name='Name as per Id proof'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Id Proof Number</Label>
                                                            <Input
                                                                type='text'
                                                                name='Id proof number'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12 mb-1'>
                                                            <Label>Id Proof Scan Copy(Multiple)</Label>
                                                            <Input
                                                                type='file'
                                                                name='Id proof copy'
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='react-dataTable'>
                                                            <DataTable
                                                                noHeader
                                                                pagination
                                                                data={roomList}
                                                                columns={checkinColumns}
                                                                className='react-dataTable'
                                                                sortIcon={<ChevronDown size={10} />}
                                                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='my-1 d-flex flex-row flex-wrap justify-content-center align-items-center'>
                                                            <Button color='primary' className='m-1'>Submit</Button>
                                                            <Button color='primary' className='m-1'>Assign Room</Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId='2'>Room Transfer</AccordionHeader>
                                    <AccordionBody accordionId='2'>
                                        <RoomTransfer />
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId='3'>Extend Departure</AccordionHeader>
                                    <AccordionBody accordionId='3'>
                                        <ExtendDeparture />
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId='4'>
                                        Extra Service
                                    </AccordionHeader>
                                    <AccordionBody accordionId='4'>
                                        <Col>
                                            <Form>
                                                <Row className='text-center p-1'>
                                                    <u><h3>Add Extra Service</h3></u>
                                                </Row>
                                                <Row>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Extra Service Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='Eservice name'
                                                            placeholder='Extra Service Name'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Amount Without Tax</Label>
                                                        <Input
                                                            type='text'
                                                            name='tax amount'
                                                            placeholder='Amount without tax'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Tax Name(if Any)</Label>
                                                        <Input
                                                            type='text'
                                                            name='tax name'
                                                            placeholder='Tax Name(if Any)'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Tax Amount(if Any)</Label>
                                                        <Input
                                                            type='text'
                                                            name='tax amount'
                                                            placeholder='Tax Amount(if Any)'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Reference text</Label>
                                                        <Input
                                                            type='text'
                                                            name='ref text'
                                                            placeholder='Reference Text'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12' sm='12 text-center' className='mt-lg-2'>
                                                        <Button color='primary' onClick={() => setServiceTable(!serviceTable)}> Add Extra Service</Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                        {
                                            serviceTable && <Col>
                                                <ExtraServiceTable />
                                            </Col>
                                        }
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId='5'>
                                        Payments Folio
                                    </AccordionHeader>
                                    <AccordionBody accordionId='5'>
                                        <Col>
                                            <Form>
                                                <Row className='text-center p-1'>
                                                    <u><h3>Add Payment Folio</h3></u>
                                                </Row>
                                                <Row>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Payment Type</Label>
                                                        <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Addition Type</Label>
                                                        <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Amount</Label>
                                                        <Input
                                                            type='text'
                                                            name='amount'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Received Date</Label>
                                                        <Input
                                                            type='date'
                                                            name='amount received date'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Reference text</Label>
                                                        <Input
                                                            type='text'
                                                            name='ref text'
                                                            placeholder='Reference Text'
                                                        />
                                                    </Col>
                                                    <Col lg='4' md='12 mb-1' sm='12 mb-1' className='mt-lg-2 text-center'>
                                                        <Button color='primary' onClick={() => setPaymentTable(!paymentTable)}> Add Extra Service</Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                        {
                                            paymentTable && <Col>
                                                <PaymentTable />
                                            </Col>
                                        }
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId='6'>
                                        Create Check Out
                                    </AccordionHeader>
                                    <AccordionBody accordionId='6'>
                                        <Row>
                                            <Button color='info'>Click here to Generate PRE Checout Summary</Button>
                                        </Row>
                                        <Row className='my-1'>
                                            <Alert color='warning'>
                                                <div className='alert-heading d-flex flex-row align-items-center'>
                                                    <Col>
                                                        <Label className='fw-bold fs-5'>
                                                            Would you like to charge extra for late checkout?
                                                        </Label>
                                                    </Col>
                                                    <Col className='d-flex flex-row'>
                                                        <Input
                                                            type='text'
                                                            name='more amount'
                                                        />
                                                        <Button className='mx-1' size='sm' color='primary'>Add service</Button>
                                                    </Col>
                                                </div>
                                            </Alert>
                                        </Row>
                                        <Row>
                                            <Form>
                                                <Row>
                                                    <Col lg='3' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Have GST</Label>
                                                        <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={haveGstOptions}
                                                            onChange={(e) => setHasGst(e.value)}
                                                        />
                                                    </Col>
                                                    <Col lg='3' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>On Duty Manager</Label>
                                                        <Input
                                                            type='text'
                                                            name='manager'
                                                        />
                                                    </Col>
                                                    <Col lg='3' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Special Comment</Label>
                                                        <Input
                                                            type='text'
                                                            name='special comment'
                                                        />
                                                    </Col>
                                                    <Col lg='3' md='12 mb-1' sm='12 mb-1'>
                                                        <Label>Mark Room(s) To</Label>
                                                        <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={houseKeepOption}
                                                            value={roomMark}
                                                            onChange={(e) => setRoomMark(e)}
                                                        />
                                                    </Col>
                                                </Row>
                                                {
                                                    hasGst === 'yes' && <Row className='my-1'>
                                                        <Col lg='4' md='12' sm='12' className='mb-md-1 mb-sm-1'>
                                                            <Label className='fw-bold fs-5'>Company GST</Label>
                                                            <Input
                                                                type='text'
                                                                name='company gst'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12' className='mb-md-1 mb-sm-1'>
                                                            <Label className='fw-bold fs-5'>Company Name</Label>
                                                            <Input
                                                                type='text'
                                                                name='company name'
                                                            />
                                                        </Col>
                                                        <Col lg='4' md='12' sm='12'>
                                                            <Label className='fw-bold fs-5'>Company Address</Label>
                                                            <Input
                                                                type='text'
                                                                name='company address'
                                                            />
                                                        </Col>
                                                    </Row>
                                                }
                                                <Row>
                                                    <Col className='mt-1 text-center'>
                                                        <Button color='primary'> Generate Invoice</Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                            </Accordion>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
            {roomOpen ? <RoomAssign roomOpen={roomOpen} handleRoomSelect={handleRoomSelect} /> : <></>}
        </>
    )
}

export default QuickBookingModal