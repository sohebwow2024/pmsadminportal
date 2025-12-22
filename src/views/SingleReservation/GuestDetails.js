import { useEffect, useState } from 'react'
// ** Reactstrap Imports
import { Row, Col, Form, Label, Button, Spinner, Input, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-hot-toast'
import axios from '../../API/axios'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Utils
import { selectThemeColors } from '@utils'
import { ArrowLeft, ArrowRight, Edit3 } from 'react-feather'
import RegisterGuest from './RegisterGuest'
import SelectRoom from './SelectRoom'
import { useNavigate } from 'react-router-dom'
import { disposeStore } from '@store/booking'
// ** Store & Actions
import { store } from '@store/store'
import {
    setGuest,
    setBookingSourceStore,
    setSourceTypeStore,
    setPaymentTypeDropdownStore,
    setPaymentModeDropdownStore,
    setCustomerIdStore,
    setLoaderStore,
    setBookingSourceDropdownStore,
    setGuestDetailDropdownStore,
    setSpecialNote
} from '@store/booking'

import { useSelector } from 'react-redux'
import RegisterAgency from './RegisterAgency'
import EditGuest from './EditGuest'

const defaultValues = {
    bookingSource: '',
    sourceType: '',
    guestDetails: '',
    specialNote: ''
}

const GuestDetails = ({ stepper }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    
    const { LoginID, Token } = getUserData

    const booking = useSelector(state => state.booking)
    const bookingSourceDropDown = booking.bookingSourceDropdown_store
    const guestDetailDropDown = booking.guestDetailDropdown_store
    const drop_downLoader = booking.loader_store

    console.log(guestDetailDropDown)
    console.log(bookingSourceDropDown)
    const [loader, setLoader] = useState(false)

    //** For New User Registeration
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)

    const [editGuest, setEditGuest] = useState(false)
    const handleEditGuest = () => setEditGuest(!editGuest)

    const [openAgency, setOpenAgency] = useState(false)
    const handleOpenAgency = () => setOpenAgency(!openAgency)

    const [sourceType, setSourceType] = useState([])
    const [bookingSourceId, setBookingSourceId] = useState('')
    const [selSourceType, setSelSourceType] = useState('')
    const [selGuestDetail, setSelGuestDetail] = useState('')
    console.log("selGuestDetail", selGuestDetail)
    const [note, setNote] = useState('')
    const [display, setDisplay] = useState(false)

    const [dropdownLoader, setDropdownLoader] = useState(false)

    const [guestOptions, setGuestOptions] = useState([])

    // const userId = localStorage.getItem('user-id')

    // source type dropdown option api
    const handleSourceType = (value) => {
        setSourceType([])
        if (value === 'reload') {
            console.log('need to ', value)
            setDropdownLoader(true)
            try {
                const bookinSourceBody = { LoginID, Token, Seckey: "abc", Event: "select" }
                axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody).then(response => {
                    store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
                    setDropdownLoader(false)
                    store.dispatch(setLoaderStore(dropdownLoader))
                })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Booking Source", error.message)
            }
            return
        }
        setBookingSourceId(value)
        try {
            const sourceTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                BookingSourceID: value,
                Event: "select"
            }
            axios.post('/getdata/bookingdata/sourcetype', sourceTypeBody)
                .then(response => {
                    if (response?.data[0]) {
                        setSourceType(response?.data[0])
                    } else {
                        setSourceType([{ value: 'reload', label: 'Please reload' }])
                    }
                }).catch
        } catch (error) {
            console.log("State Error", error.message)
        }
        store.dispatch(setBookingSourceStore(value))
    }
    const sourceTypesError = [{ label: 'Please Select Booking Source' }]

    const sourceTypes = sourceType?.map(function (sourceType) {
        return { value: sourceType?.sourceTypeID, label: sourceType?.sourceType }
    })

    useEffect(() => {
        handleSourceType(bookingSourceId)
    }, [openAgency])

    const handleGuestOptions = async () => {
        try {
            const guestDetailBody = { LoginID, Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const res = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            console.log("Guest data - OK > ", res)
            let result = res?.data[0]
            let arr = result.map(r => {
                return { value: r?.guestID, label: `${r.guestName} : ${r.GuestEmail} : ${r.guestMobileNumber}`, ...r }
            })
            setGuestOptions(arr)
        store.dispatch(setGuestDetailDropdownStore(result))

        } catch (error) {
            console.log('guesterror', error)
        }
    }
    // const guestDetailOptions = guestDetailDropDown?.length > 0 && guestDetailDropDown[0].GuestName ? guestDetailDropDown?.map(function (guest) {
    //     return { value: guest?.GuestID, label: `${guest.GuestName} : ${guest.GuestEmail} : ${guest.GuestMobileNumber}`, ...guest }
    // }) : []

    // TODO - reload indivividual dropdowns // Fahad
    const bookingSourceOptions = bookingSourceDropDown?.length > 0 && bookingSourceDropDown[0].bookingSource ? bookingSourceDropDown?.map(function (book) {
        return { value: book.bookingSourceID, label: book.bookingSource }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    // booking Source 
    const DetailsSchema = yup.object().shape({
        bookingSource: yup.string().required(),
        sourceType: yup.string().required,
        guestDetails: yup.object().required(),
        specialNote: yup.string()
    })

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(DetailsSchema)
    })

    const details = watch("guestDetails")
    const specialNote = watch("specialNote")

    const paymentTypeData = () => {
        setDropdownLoader(true)
        try {
            const paymentTypeBody = { LoginID, Token, Seckey: "abc", Event: "select" }
            axios.post(`/getdata/bookingdata/paymenttype`, paymentTypeBody)
                .then(response => {
                    store.dispatch(setPaymentTypeDropdownStore(response?.data[0]))
                    setDropdownLoader(false)
                    store.dispatch(setLoaderStore(dropdownLoader))
                })
        } catch (error) {
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
            console.log("Payment Type Error", error.message)
        }
    }

    const paymentModeData = () => {
        setDropdownLoader(true)
        try {
            const paymentModeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                PaymentTypeID: "PTI001",
                Event: "select"
            }
            axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
                .then(paymentModeResponse => {
                    store.dispatch(setPaymentModeDropdownStore(paymentModeResponse?.data[0]))
                    setDropdownLoader(false)
                    store.dispatch(setLoaderStore(dropdownLoader))
                })
        } catch (error) {
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
            console.log("Payment Mode Error", error.message)
        }
    }

    const guestDetail = async () => {
        try {
            const guestDetailBody = {
                LoginID,
                Token,
                Seckey: "abc",
                SearchPhrase: null,
                Event: "select"
            }
            const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            console.log("Guest Data-", guestResponse?.data[0])
            store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))
        } catch (error) {
            console.log("Guest Detail Error", error.message)
        }
    }

    const onSubmit = () => {
        setDisplay(true)
        setLoader(true)
        // if (isObjEmpty(errors)) {
        if (sourceType, bookingSourceId, selGuestDetail, selSourceType) {
            console.log('A ok')
            store.dispatch(setGuest(details))
            store.dispatch(setSpecialNote(note))
            stepper.next()
            setLoader(false)
            paymentTypeData()
            paymentModeData()
        } else {
            toast.error('Something went wrong')
            setLoader(false)
        }
    }

    const handleGuestDetail = async (val) => {
        console.log('need to ===>', val)
         if (!val) return
        if (val === 'reload') {
            console.log('need to ', val)
            setDropdownLoader(true)

            try {
                const guestDetailBody = { LoginID, Token, Seckey: "abc", SearchPhrase: "abc", Event: "select" }
                const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
                console.log("Guest data - OK > ", guestResponse?.ok)

                store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))
                console.log("Guest data - ", guestResponse?.data[0])
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Guest Detail Error", error.message)
            }
            return
        }
        setSelGuestDetail(opt?.value)
        store.dispatch(setCustomerIdStore(val?.value))
        store.dispatch(setGuest(val))
    }

    useEffect(() => {
        handleGuestOptions()
    }, [open, editGuest])

    const bookingStore = useSelector(state => state.booking)
    const navigate = useNavigate()
    const dispose = () => {
        console.log('bookingStore', bookingStore)
        store.dispatch(disposeStore(true))
        handleOpen()
        navigate('/reservation')
        window.location.reload()
        //stepper.to(0)
    }

    const [openConfirm, setOpenConfirm] = useState(false)
    const handleOpenConfirm = () => setOpenConfirm(!openConfirm)
    const confirmRefresh = () => {
        // onSubmit(e)

        console.log("disposing....")
        dispose()
    }

    return (
        <>
            {!drop_downLoader ? (
                <>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='d-flex flex-column'>
                            <Col className='d-flex flex-md-row flex-column justify-content-around align-items-center '>
                                <div className='me-md-1 me-0 my-1  w-100'>
                                    <Label>
                                        Booking Source<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        //id= 'bookingSource'
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={bookingSourceOptions}
                                        value={bookingSourceOptions?.filter(c => c.value === bookingSourceId)}
                                        onChange={val => {
                                            handleSourceType(val.value)

                                        }}
                                        invalid={display && bookingSourceId === ''}
                                    />
                                    {
                                        display && !bookingSourceId ? <Label className='text-danger'>select Booking Source !</Label> : null
                                    }
                                </div>
                                <div className='ms-md-1 ms-0 w-100'>
                                    <Label className='form-label' for='sourceType'>
                                        Source Type{sourceType.length > 0 && <span className='text-danger'>*</span>}
                                    </Label>
                                    <CreatableSelect
                                        isDisabled={sourceType.length === 0 && bookingSourceId !== "BSID20230220AA00001" && bookingSourceId !== "BSID20230220AA00002"}
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // options={bookingSourceId ? sourceTypes : sourceTypesError}
                                        options={sourceTypes}
                                        // inputRef={ref}
                                        // value={sourceType.length === 0 ? "-" : sourceTypes?.filter(c => value.includes(c.value))}
                                        value={sourceTypes?.filter(c => c.value === selSourceType)}
                                        onChange={val => {
                                            // onChange(val.value)
                                            setSelSourceType(val.value)
                                            store.dispatch(setSourceTypeStore(val.value))
                                        }}
                                        onCreateOption={handleOpenAgency}
                                        invalid={display && sourceType.length !== 0 && selSourceType === ''}
                                    />
                                    {
                                        display && sourceType.length !== 0 && selSourceType === '' ? <Label className='text-danger'>Select a Source Type!</Label> : null
                                    }
                                </div>
                            </Col>
                            <Col className='my-1'>
                                <Label className='form-label' for='guestDetails'>
                                    Guest Details (Search With Name, Email, Mobile)<span className='text-danger'>*</span>{selGuestDetail ? <span onClick={handleEditGuest} className='mx-1 cursor-pointer'>(<Edit3 color='blue' size={15} /> Edit Guest details)</span> : null}
                                </Label>
                                <CreatableSelect
                                    placeholder=''
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    // options={guestDetailOptions}
                                    options={guestOptions}
                                    formatCreateLabel={userInput => `Create new Guest '${userInput}'`}
                                    // value={guestDetailOptions?.filter(c => c.value === selGuestDetail)}
                                    value={guestOptions?.filter(c => c.value === selGuestDetail)}
                                    onChange={val => {
                                        handleGuestDetail(val)
                                    }}
                                    onFocus={() => {
                                        guestDetail()
                                        console.log("called guest result")
                                    }}
                                    onCreateOption={handleOpen}
                                    invalid={display && selGuestDetail === ''}
                                />
                                {
                                    display && !selGuestDetail ? <Label className='text-danger'>select guest details !</Label> : null
                                }
                            </Col>
                            <Col className='my-1'>
                                <Label className='form-label' for='specialNote'>
                                    Special Note
                                </Label>
                                <Input
                                    type='textarea'
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <div className='mt-1 d-flex justify-content-between'>
                            <Button color='secondary' className='btn-prev' outline onClick={() => handleOpenConfirm()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
                            <Button type='submit' color='primary' className='btn-next' onClick={onSubmit}>
                                <span className='align-middle d-sm-inline-block d-none'>
                                    {
                                        loader ? (
                                            <Spinner color='#FFF' />
                                        ) : 'Book Rooms'
                                    }
                                </span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                            </Button>
                        </div>
                    </Form>
                    {open && <RegisterGuest open={open} handleOpen={handleOpen} />}
                    {editGuest && <EditGuest open={editGuest} handleOpen={handleEditGuest} guestData={selGuestDetail} />}
                    {openAgency && <RegisterAgency open={openAgency} handleOpenAgency={handleOpenAgency} sourceID={bookingSourceId} />}
                </>
            ) : (
                <div style={{ height: '150px' }}>
                    <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
                </div>
            )}
            <Modal className='modal-dialog-centered' isOpen={openConfirm} toggle={handleOpenConfirm} backdrop={false}>
                <ModalHeader className='bg-transparent' toggle={handleOpenConfirm}>
                    <p>Are You Sure? You want to go back.</p>
                    You will have to add the booking procedure again.
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button className='m-1' color='danger' onClick={confirmRefresh}>Confirm</Button>
                            <Button className='m-1' color='secondary' outline onClick={handleOpenConfirm}>Cancel</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                openConfirm ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>

    )

}

export default GuestDetails
