import React, { useState } from 'react'
import { Row, Col, Label, Input, Button, Form, ListGroup, ListGroupItem, Badge, FormFeedback } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import moment from 'moment'
import { ChevronDown, Trash2 } from 'react-feather'
import { useEffect } from 'react'
import DataTable from 'react-data-table-component'

const ExtendDeparture = ({ bookingID, BookingDetails, guest_details, handleExtendDepart }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    
    const { LoginID, Token } = getUserData
    const [extendedDates, setExtendedDates] = useState([])
    console.log('bookingID', bookingID);
    const [newDepartureDate, setNewDepartureDate] = useState('')
    const [ecost, setEcost] = useState('')
    const [display, setDisplay] = useState(false)
    // console.log(ecost);
    const getExtendedDate = async () => {
        try {
            const res = await axios.get(`/booking/extendcheckout/GetByBookingId=${bookingID}`, {
            // const res = await axios.get('booking/extendcheckout/getbybookingid', {
                headers: {
                    LoginID,
                    Token,
                    Seckey: 'abc'
                },
                // params: {
                //     bookingID
                //     // bookingID: BookingDetails.length > 0 ? BookingDetails[0]?.BookingID : ''
                // }
            })
            console.log('extendedDate res', res)
            setExtendedDates(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getExtendedDate()
    }, [handleExtendDepart])

    const handleUpdateDepartureDate = async () => {
        console.log('newDepartureDate', ecost, display, newDepartureDate)
        setDisplay(true)
        if (ecost && newDepartureDate !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Event: "insert",
                    Seckey: 'abc',
                    // RoomAllocationID: null, 
                    BookingID: BookingDetails[0]?.bookingID,
                    OldDepartureDate: BookingDetails[0]?.checkOutDate,
                    NewDepartureDate: newDepartureDate,
                    ServiceCharge: Number(ecost)
                }
                console.log('objjjjj', obj);
                const res = await axios.post('/booking/extendcheckout/Save', obj, {
                    headers: {
                        LoginID,
                        Token,    
                    }
                })

                console.log('extend-departure', res)
                if (res?.data[0][0].status === "Success") {
                    toast.success("Departure Date Extended!")
                    handleExtendDepart()
                    setNewDepartureDate('')
                }
            } catch (error) {
                console.log('error', error.response.data.Message)
                toast.error(error.response.data.Message)
            }
        } else {
            toast.error('Please Add Proposed Departure Date and Service Charge')
        }
    }

    const handleDeleteDate = async (value) => {
        try {
            const res = await axios.post(`/booking/extendcheckout/delete?ExtendDepartureID=${value}`, {}, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: 'abc'
                },
            })
            if (res?.data[0][0].status === "Success") {
                toast.success("Extended Departure Date Deleted!")
                handleExtendDepart()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    const reset = () => {
        setNewDepartureDate('')
        handleExtendDepart()
    }

    const ExtendDepartureColumns = [
        {
            name: 'Sr No',
            //sortable: true,
            // minWidth: '150px',
            style: { textAlign: 'centre' },
            selector: (row, i) => {
                // console.log(row);
                return (
                    <>
                        #{i + 1}
                    </>
                )
            }
        },
        {
            name: 'Status',
            // minWLaundryIDth: 300,
            style: { textAlign: 'centre' },
            wrap: true,
            //sortable: true,
            selector: (row, i) => {
                return (
                    <>
                        {(extendedDates.length - 1) === i ? 'New Depature Date' : 'Old departure date'}
                    </>
                )
            }
        },
        {
            name: 'New Departure Dates',
            // minWLaundryIDth: 300,
            style: {},
            wrap: true,
            //sortable: true,
            selector: (row) => {
                return (
                    <>
                        {moment(row.newDepartureDate).format('LLL')}
                    </>
                )
            }
        },
        {
            name: 'Action',
            //sortable: true,
            selector: (row, i) => {
                // console.log(i);
                return (extendedDates.length - 1) === i && (
                    <Trash2 className='ms-1' size='15' color='red' onClick={() => handleDeleteDate(row.extendDepartureID)} />
                )
            }
        }
    ]

    return (
        <>
            {console.log('extendedDates', extendedDates)}
            <Form className=''>
                <Row>
                    <Col sm='12' md='2' lg='2' xl='2' className='mb-1'>
                        <Label className='form-label' for='nameVertical'>
                            Guest Name
                        </Label>
                        <Input
                            disabled
                            type='text'
                            value={guest_details[0]?.guestName}
                        />
                    </Col>
                    <Col sm='12' md='2' lg='2' xl='2' className='mb-1'>
                        <Label className='form-label' for='EmailVertical'>
                            Current Departure Date
                        </Label>
                        <Flatpickr
                            data-enable-time
                            isDisabled
                            className='form-control'
                            id='date-time-picker'
                            options={{ clickOpens: false }}
                            value={BookingDetails[0]?.checkOutDate}
                        />
                    </Col>
                    <Col sm='12' md='2' lg='2' xl='2' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Proposed Departure Date<span className='text-danger'>*</span>
                        </Label>
                        <Flatpickr
                            data-enable-time
                            isDisabled
                            className='form-control'
                            id='date-time-picker'
                            options={{ minDate: new Date(BookingDetails[0]?.checkOutDate).fp_incr(1), enableTime: true }}
                            value={newDepartureDate}
                            onChange={date => setNewDepartureDate(moment(date[0]).format())}
                            invalid={display && newDepartureDate === ''}
                        />
                        {display && newDepartureDate === '' && <FormFeedback>Departure Date is required</FormFeedback>}
                    </Col>
                    <Col sm='12' md='2' lg='2' xl='2' className='mb-1'>
                        <Label className='form-label' for='mobileVertical'>
                            Service Charge<span className='text-danger'>*</span>
                        </Label>
                        <Input
                            // disabled
                            type='text'
                            value={ecost}
                            onChange={(e) => setEcost(e.target.value)}
                            invalid={display && ecost === ''}
                        />
                        {display && ecost === '' && <FormFeedback>Service Charge is required</FormFeedback>}
                    </Col>
                    <Col sm='12' md='4' lg='4' xl='4' className='mb-1'>
                        <Button className='me-2' color='primary' style={{ marginTop: '24px' }} onClick={(e) => {
                            e.preventDefault()
                            handleUpdateDepartureDate()
                        }}>Update</Button>
                        <Button className='me-2' color='warning' style={{ marginTop: '24px' }} onClick={(e) => {
                            e.preventDefault()
                            reset()
                        }}>Cancel</Button>
                    </Col>
                    {
                        extendedDates.length > 0 ? (
                            <Col>
                                {/* {
                                    extendedDates.map((d, index) => {
                                        return (
                                            <>
                                                <ListGroup key={index}>
                                                    <ListGroupItem className='d-flex flex-row flex-wrap justify-content-around align-items-center'>
                                                        <span className='mx-1 mb-1'>#{index + 1}</span>
                                                        <span className='mx-1 mb-1'>
                                                            {(extendedDates.length - 1) === index ? 'New Depature Date' : 'Old departure date'} - {moment(d.NewDepartureDate).format('LLL')}
                                                            {
                                                                (extendedDates.length - 1) === index && (
                                                                    <Trash2 className='ms-1' size='15' color='red' onClick={() => handleDeleteDate(d.ExtendDepartureID)} />
                                                                )
                                                            }
                                                        </span>

                                                    </ListGroupItem>
                                                </ListGroup>
                                            </>
                                        )
                                    })
                                } */}
                                <DataTable
                                    noHeader
                                    data={extendedDates}
                                    columns={ExtendDepartureColumns}
                                    className='react-dataTable'
                                    sortIcon={<ChevronDown size={10} />}
                                />
                            </Col>
                        ) : <></>
                    }
                </Row>
            </Form>
        </>
    )
}

export default ExtendDeparture