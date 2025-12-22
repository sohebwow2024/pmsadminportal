import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, UserCheck, UserX } from 'react-feather'
import { Button, Col, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Store & Actions
import { store } from '@store/store'
import { setCheckInDate, setCheckOutDate } from '@store/booking'
import { useSelector } from 'react-redux'

const defaultValues = {
    checkIn_date: '',
    checkOut_date: ''
}

const InOutDates = ({ stepper }) => {

    const bookingStore = useSelector(state => state.booking)
    console.log('bookingStore', bookingStore)

    const DateSchema = yup.object().shape({
        checkIn_date: yup.string().required(),
        checkOut_date: yup.string().required()
    })

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(DateSchema)
    })

    const inDate = watch("checkIn_date")
    const outDate = watch("checkOut_date")
    const duration = moment(outDate).diff(moment(inDate), 'days')

    const [loader, setLoader] = useState(false)

    const onSubmit = () => {
        setLoader(true)
        setTimeout(() => {
            if (isObjEmpty(errors)) {
                setLoader(false)
                store.dispatch(setCheckInDate(inDate))
                store.dispatch(setCheckOutDate(outDate)) 
                stepper.next()
                toast.success('Rooms Available')
            }
        }, 2000)
    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col>
                        <Label className='form-label' for='checkIn_date'>
                            Check-In Date:
                        </Label>
                        <Controller
                            defaultValue=''
                            id='checkIn_date'
                            name='checkIn_date'
                            control={control}
                            render={
                                ({ field }) => <Input
                                    type='date'
                                    placeholder='Select Check-In Date'
                                    invalid={errors.checkIn_date && true}
                                    {...field}

                                />
                            }
                        />
                        {errors.checkIn_date && <FormFeedback>{errors.checkIn_date.message}</FormFeedback>}
                    </Col>
                    <Col>
                        <Label className='form-label' for='checkOut_date'>
                            Check-Out Date:
                        </Label>
                        <Controller
                            defaultValue=''
                            control={control}
                            id='checkOut_date'
                            name='checkOut_date'
                            render={
                                ({ field }) => <Input
                                    type='date'
                                    min={moment(inDate).add(1, 'days').format('YYYY-MM-DD')}
                                    placeholder='Select Check-Out Date'
                                    invalid={errors.checkOut_date && true}
                                    {...field}
                                />
                            }
                        />
                        {errors.checkOut_date && <FormFeedback>{errors.checkOut_date.message}</FormFeedback>}
                    </Col>
                </Row>
                {
                    inDate && outDate ? (
                        <Col className='d-flex flex-sm-row flex-column justify-content-center align-item-center'>
                            <Col className='m-1'>
                                <StatsHorizontal icon={<UserCheck size={21} />} color='success' stats={moment(inDate).format("DD/MM/YYYY")} statTitle='Check-In Date' />
                            </Col>
                            <Col className='m-1'>
                                <StatsHorizontal icon={<UserX size={21} />} color='warning' stats={moment(outDate).format("DD/MM/YYYY")} statTitle='Check-Out Date' />
                            </Col>
                            <Col className='m-1'>
                                <StatsHorizontal icon={<Calendar size={21} />} color='primary' stats={duration === 1 ? `${duration} Night` : `${duration} Nights`} statTitle='Duration of Booking' />
                            </Col>
                        </Col>
                    ) : null
                }
                <div className='mt-1 d-flex justify-content-between'>
                    <Button color='secondary' className='btn-prev' outline disabled>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button>
                    <Button type='submit' color='primary' className='btn-next' >
                        <span className='align-middle d-sm-inline-block d-none'>
                            {
                                loader ? (
                                    <Spinner color='#FFF' />
                                ) : 'Check Availability'
                            }
                        </span>
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default InOutDates