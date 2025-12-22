import React, { useState } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
// import { toast } from 'react-hot-toast'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { disposeStore } from '@store/booking'
// ** Utils
import { isObjEmpty, selectThemeColors } from '@utils'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Store & Actions   
import { useSelector } from 'react-redux'

const defaultValues = {
    paymentStatus: '',
    collectionType: '',
    paymentType: '',
    collectedAmount: '',
    paymentReference: '',
    internalNote: '',
    companyGst: '',
    companyName: '',
    companyAdd: '',
    boookedBy: '',
    bookerName: ''
}

const paymentStatusOptions = [
    { value: 'prepaid', label: 'Prepaid' },
    { value: 'hotel', label: 'Pay at Hotel' },
    { value: 'company', label: 'Bill to Company' }
]

const collectionTypeOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'company', label: 'Bill to Company' },
    { value: 'cash', label: 'Cash' }
]

const paymentTypeOptions = [
    { value: 'full', label: 'Full Amount' },
    { value: 'partial', label: 'Partial Amount' }
]

const userOptions = [
    { value: 'naresh', label: 'Naresh' },
    { value: 'paresh', label: 'Paresh' },
    { value: 'mohit', label: 'Mohit' },
    { value: 'priya', label: 'Priya' },
    { value: 'anchal', label: 'Anchal' },
    { value: 'others', label: 'Others' }
]

const FinalConfirmation = ({ stepper }) => {

    const bookingStore = useSelector(state => state.booking)
    console.log('bookingStore', bookingStore)
    console.log('total', bookingStore.total)

    const [loader, setLoader] = useState(false)
    const [status, setStatus] = useState(false)

    const PaymentSchema = yup.object().shape({
        paymentStatus: yup.string(),
        collectionType: yup.string(),
        paymentType: yup.string(),
        collectedAmount: yup.string(),
        paymentReference: yup.string(),
        internalNote: yup.string(),
        companyGst: yup.string(),
        companyName: yup.string(),
        companyAdd: yup.string(),
        bookedBy: yup.string(),
        bookerName: yup.string()
    })

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(PaymentSchema)
    })

    const pstatus = watch("paymentStatus")
    const cType = watch("collectionType")
    const ptype = watch("paymentType")
    const amount = watch("collectedAmount")
    const pref = watch("paymentReference")
    const inote = watch("internalNote")
    const cgst = watch("companyGst")
    const cname = watch("companyName")
    const cadd = watch("companyAdd")
    const booker = watch("boookedBy")
    const newBooker = watch("bookerName")
    console.log('pstatus', pstatus)
    console.log('cType', cType)
    console.log('ptype', ptype)
    console.log('amount', amount)
    console.log('pref', pref)
    console.log('inote', inote)
    console.log('cgst', cgst)
    console.log('cname', cname)
    console.log('cadd', cadd)
    console.log('booker', booker)
    console.log('newBooker', newBooker)

    const onSubmit = () => {
        setLoader(true)
        console.log("abcdefghi...FinalConfirmation")
        if (isObjEmpty(errors)) {
            console.log('A ok')
            setLoader(false)
            stepper.next()
        } else {
            console.log('issues')
            setLoader(false)
        }
    }

    const dispose = () => {
        console.log('bookingStore', bookingStore)
        store.dispatch(disposeStore(true))
        handleFinalModal()
        navigate('/reservation')
        window.location.reload()
        //stepper.to(0)
    }

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)
    const confirm = () => {
        // onSubmit(e)
        console.log("disposing....")
        dispose()
    }

    return (
        <>
            <Row className='d-flex flex-column'>
                <Col className='d-flex flex-row justify-content-center'>
                    <h4>Booking Status:</h4>

                    <div className='d-flex flex-row justify-content-around'>
                        <Col className='form-check mx-1 mb-1'>
                            <Input
                                type='radio'
                                id='confirm'
                                name='confirm'
                                checked={status}
                                onChange={() => setStatus(true)}
                            />
                            <Label className='form-check-label' for='confirm'>Confirm</Label>
                        </Col>
                        <Col className='form-check mx-1 mb-1'>
                            <Input
                                type='radio'
                                id='hold'
                                name='hold'
                                disabled
                            />
                            <Label className='form-check-label' for='confirm'>Hold</Label>
                        </Col>
                    </div>
                </Col>
                <hr />
                {
                    status && <Col>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col>
                                    <Label>
                                        Payment Status
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        id='paymentStatus'
                                        name='paymentStatus'
                                        control={control}
                                        render={
                                            ({ field: { onChange, value, ref } }) => <Select
                                                placeholder=''
                                                menuPlacement='auto'
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={paymentStatusOptions}
                                                inputRef={ref}
                                                value={paymentStatusOptions.filter(c => value.includes(c.value))}
                                                onChange={val => onChange(val.value)}
                                                invalid={errors.paymentStatus && true}
                                            />
                                        }
                                    />
                                    {errors.paymentStatus && <Label className='text-danger'>{errors.paymentStatus.message}!</Label>}
                                </Col>
                                {
                                    pstatus !== 'company' && <Col>
                                        <Label>
                                            Collection Type
                                        </Label>
                                        <Controller
                                            defaultValue=''
                                            id='collectionType'
                                            name='collectionType'
                                            control={control}
                                            render={
                                                ({ field: { onChange, value, ref } }) => <Select
                                                    placeholder=''
                                                    menuPlacement='auto'
                                                    theme={selectThemeColors}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    options={collectionTypeOptions}
                                                    inputRef={ref}
                                                    value={collectionTypeOptions.filter(c => value.includes(c.value))}
                                                    onChange={val => onChange(val.value)}
                                                    invalid={errors.collectionType && true}
                                                />
                                            }
                                        />
                                        {errors.collectionType && <Label className='text-danger'>{errors.collectionType.message}!</Label>}
                                    </Col>
                                }

                                {
                                    pstatus !== 'hotel' && pstatus !== 'company' ? (
                                        <>
                                            <Col>
                                                <Label>
                                                    Payment Type
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    id='paymentType'
                                                    name='paymentType'
                                                    control={control}
                                                    render={
                                                        ({ field: { onChange, value, ref } }) => <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={paymentTypeOptions}
                                                            inputRef={ref}
                                                            value={paymentTypeOptions.filter(c => value.includes(c.value))}
                                                            onChange={val => onChange(val.value)}
                                                            invalid={errors.paymentType && true}
                                                        />
                                                    }
                                                />
                                                {errors.paymentType && <Label className='text-danger'>{errors.paymentType.message}!</Label>}
                                            </Col>
                                            <Col>
                                                <Label>
                                                    Collected Amount
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    control={control}
                                                    id='collectedAmount'
                                                    name='collectedAmount'
                                                    render={
                                                        ({ field }) => <Input
                                                            type='text'
                                                            disabled={ptype !== 'partial'}
                                                            invalid={errors.collectedAmount && true}
                                                            {...field}
                                                        />
                                                    }
                                                />
                                                {errors.collectedAmount && <Label className='text-danger'>{errors.collectedAmount.message}!</Label>}
                                            </Col>
                                        </>
                                    ) : pstatus === 'company' && pstatus !== 'hotel' ? (
                                        <>
                                            <Col>
                                                <Label>
                                                    Company GST
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    control={control}
                                                    id='companyGst'
                                                    name='companyGst'
                                                    render={
                                                        ({ field }) => <Input
                                                            type='text'
                                                            invalid={errors.companyGst && true}
                                                            {...field}
                                                        />
                                                    }
                                                />
                                                {errors.companyGst && <FormFeedback>{errors.companyGst.message}!</FormFeedback>}
                                            </Col>
                                            <Col>
                                                <Label>
                                                    Company Name
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    control={control}
                                                    id='companyName'
                                                    name='companyName'
                                                    render={
                                                        ({ field }) => <Input
                                                            type='text'
                                                            invalid={errors.companyName && true}
                                                            {...field}
                                                        />
                                                    }
                                                />
                                                {errors.companyName && <FormFeedback>{errors.companyName.message}!</FormFeedback>}
                                            </Col>
                                            <Col>
                                                <Label>
                                                    Company Address
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    control={control}
                                                    id='companyAdd'
                                                    name='companyAdd'
                                                    render={
                                                        ({ field }) => <Input
                                                            type='text'
                                                            invalid={errors.companyAdd && true}
                                                            {...field}
                                                        />
                                                    }
                                                />
                                                {errors.companyAdd && <FormFeedback>{errors.companyAdd.message}!</FormFeedback>}
                                            </Col>
                                        </>
                                    ) : null
                                }

                            </Row>
                            <Row>
                                <Col>
                                    <Label>
                                        Payment Reference
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='paymentReference'
                                        name='paymentReference'
                                        render={
                                            ({ field }) => <Input
                                                type='textarea'
                                                invalid={errors.paymentReference && true}
                                                {...field}
                                            />
                                        }
                                    />
                                    {errors.paymentReference && <FormFeedback>{errors.paymentReference.message}!</FormFeedback>}
                                </Col>
                                <Col>
                                    <Label>
                                        Internal Note
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='internalNote'
                                        name='internalNote'
                                        render={
                                            ({ field }) => <Input
                                                type='textarea'
                                                invalid={errors.internalNote && true}
                                                {...field}
                                            />
                                        }
                                    />
                                    {errors.internalNote && <FormFeedback>{errors.internalNote.message}!</FormFeedback>}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label>
                                        Booking Created By
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        id='boookedBy'
                                        name='boookedBy'
                                        control={control}
                                        render={
                                            ({ field: { onChange, value, ref } }) => <Select
                                                placeholder=''
                                                menuPlacement='auto'
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={userOptions}
                                                inputRef={ref}
                                                value={userOptions.filter(c => value.includes(c.value))}
                                                onChange={val => onChange(val.value)}
                                                invalid={errors.boookedBy && true}
                                            />
                                        }
                                    />
                                    {errors.boookedBy && <Label className='text-danger'>{errors.boookedBy.message}!</Label>}
                                </Col>
                                <Col>
                                    <Label>
                                        Created By
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='bookerName'
                                        name='bookerName'
                                        render={
                                            ({ field }) => <Input
                                                type='text'
                                                disabled={booker !== 'others'}
                                                invalid={errors.bookerName && true}
                                                {...field}
                                            />
                                        }
                                    />
                                    {errors.bookerName && <FormFeedback>{errors.bookerName.message}!</FormFeedback>}
                                </Col>
                            </Row>
                            <div className='mt-1 d-flex justify-content-between'>
                                <Button color='secondary' className='btn-prev' outline onClick={() => handleOpen()}>
                                    <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                    <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                                </Button>
                                <Button type='submit' color='primary' className='btn-next'>
                                    <span className='align-middle d-sm-inline-block d-none'>
                                        {
                                            loader ? (
                                                <Spinner color='#FFF' />
                                            ) : 'Create Booking'
                                        }
                                    </span>
                                    <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                </Button>
                            </div>
                        </Form>
                    </Col>
                }
            </Row>

            <Modal className='modal-dialog-centered' isOpen={open} toggle={handleOpen} backdrop={false}>
                <ModalHeader className='bg-transparent' toggle={handleOpen}>
                    <p>Are You Sure? You want to go back.</p>
                    You will have to add the booking procedure again.
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button className='m-1' color='danger' onClick={confirm}>Confirm</Button>
                            <Button className='m-1' color='secondary' outline onClick={handleOpen}>Cancel</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default FinalConfirmation