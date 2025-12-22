

import React, { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, Calendar, UserCheck, UserX } from 'react-feather'
import { Button, Col, Form, Label, Row } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

import { useSelector } from 'react-redux'

// ** Third Party Components
import moment from 'moment'
// import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Store & Actions
import { store } from '@store/store'
import { setIDate, setODate } from '../redux/reserve'
import toast from 'react-hot-toast'

const BKDatesInOut = ({ stepper }) => {

    const outDateRef = useRef(null)

    const reserveStore = useSelector(state => state.reserveSlice)
    console.log('reserveStore', reserveStore.iDate)

    const [inDate, setInDate] = useState(reserveStore?.iDate ? reserveStore?.iDate : '')
    const [outDate, setOutDate] = useState(reserveStore?.oDate ? reserveStore?.oDate : '')
    // console.log('outDate', inDate, outDate);

    const [loader, setLoader] = useState(false)

    const duration = (moment(outDate).diff(moment(inDate), 'days'))

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoader(true)
        if (inDate !== '' && outDate !== '') {
            store.dispatch(setIDate(moment(inDate).format()))
            store.dispatch(setODate(moment(outDate).format()))
            setLoader(false)
            stepper.next()
        } else {
            toast.error('Select both Check In & Out Date!')
        }
    }

    return (
        <>
            <Form onSubmit={e => handleSubmit(e)}>
                <Row className='mb-2'>
                    <Col>
                        <Label className='form-label' for='checkIn_date'>
                            Check-In Date:
                        </Label>
                        <Flatpickr
                            id='checkIn_date'
                            name='checkIn_date'
                            placeholder='Select Check-In Date'
                            options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                minDate: moment().toDate().fp_incr(0)
                            }}
                            value={moment(inDate).toISOString()}
                            onChange={date => {
                                console.log('indate', date[0])
                                setInDate(date[0])
                                outDateRef.current.flatpickr.open()
                            }}
                        />
                        {loader && (inDate === '' || inDate === undefined) && <p className='text-danger'>Check-In Date is required</p>}
                    </Col>
                    <Col>
                        <Label className='form-label' for='checkOut_date'>
                            Check-Out Date:
                        </Label>
                        <Flatpickr
                            id='checkOut_date'
                            name='checkOut_date'
                            ref={outDateRef}
                            placeholder='Select Check-Out Date'
                            options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                minDate: new Date(inDate).fp_incr(0)
                            }}
                            value={moment(outDate).toISOString()}
                            onChange={date => {
                                setOutDate(date[0])
                            }}
                        />
                        {loader && (outDate === '' || outDate === undefined) && <p className='text-danger'>Check-Out Date is required</p>}
                    </Col>
                </Row>
                {
                    duration >= 0 ? (
                        <Col className='mt-2 d-flex flex-sm-row flex-column justify-content-center align-item-center'>
                            <Col className='mx-1 pt-1'>
                                <StatsHorizontal icon={<UserCheck size={21} />} color='success' stats={moment(inDate).format("DD/MM/YYYY")} statTitle='Check-In Date' />
                            </Col>
                            <Col className='mx-1 pt-1'>
                                <StatsHorizontal icon={<UserX size={21} />} color='warning' stats={moment(outDate).format("DD/MM/YYYY")} statTitle='Check-Out Date' />
                            </Col>
                            <Col className='mx-1 pt-1'>

                                <StatsHorizontal icon={<Calendar size={21} />} color='primary' stats={duration === 1 ? `${duration} Night` : `${duration} Nights`} statTitle='Duration of Booking' />

                            </Col>
                        </Col>
                    ) : null
                }
                <div className='mt-1 d-flex justify-content-end'>
                    {/* <Button color='secondary' className='btn-prev ' outline disabled>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button> */}
                    <Button type='submit' color='primary' className='btn-next' >Check Availability
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default BKDatesInOut