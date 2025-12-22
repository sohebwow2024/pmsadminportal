import React, { useState, useEffect } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
import toast from 'react-hot-toast'

// ** Utils
import { selectThemeColors } from '@utils'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Store & Actions
import { store } from '@store/store'
import { setBookingID, disposeStore, setPaymentTypeStore, setPaymentModeStore, setBookingCreatedByStore, setPaymentTypeDropdownStore, setLoaderStore, setPaymentModeDropdownStore } from '@store/booking'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'
import BookingDetailPreview from './BookingDetailPreview'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const ConfirmationFinal = ({ stepper }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const bookingStore = useSelector(state => state.booking)
    console.log('dgjfgdshjfgdsjgfsdfg');
    console.log('bookingStore', bookingStore)
    // const paymentTypeDropDown = bookingStore.paymentTypeDropdown_store
    // const paymentModeDropDown = bookingStore.paymentModeDropdown_store

    const [loader, setLoader] = useState(false)
    const [holdLoader, setHoldLoader] = useState(false)
    const [status, setStatus] = useState(true)

    const [pstatus, setPstatus] = useState("")
    const [pstatusName, setPstatusName] = useState("")
    const [ctype, setCtype] = useState("")
    const [amount, setAmount] = useState(0)
    const [pref, setPref] = useState("")
    const [inote, setInote] = useState("")
    const [cgst, setCgst] = useState("")
    const [cname, setCname] = useState("")
    const [cadd, setCadd] = useState("")
    const [booker, setBooker] = useState("")
    const [newBooker, setNewBooker] = useState("")
    const [payFull, setPayFull] = useState("Yes")
    const [userDetails, setUserDetails] = useState([])
    const [userDetailsStatus, setUserDetailsStatus] = useState(false)
    const [bookingOption, setBookingOption] = useState('confirm')

    const [holdInote, setHoldInote] = useState("")

    const [dropdownLoader, setDropdownLoader] = useState(false)

    const [bookingError, setBookingError] = useState('')
    const [bookingResponse, setBookingResponse] = useState()
    const [spin, setSpin] = useState(false)

    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])

    const drop_downLoader = bookingStore.loader_store
    const navigate = useNavigate()
    const [showBookingDetails, setShowBookingDetails] = useState(false)
    const handleFinalModal = () => {
        setShowBookingDetails(!showBookingDetails)
    }

    const dispose = () => {
        console.log('bookingStore', bookingStore)
        store.dispatch(disposeStore(true))
        handleFinalModal()
        navigate('/reservation')
        window.location.reload()
        //stepper.to(0)
    }



    const [openConfirm, setOpenConfirm] = useState(false)
    const handleOpenConfirm = () => setOpenConfirm(!openConfirm)
    const confirmRefresh = () => {
        // onSubmit(e)
        handleOpenConfirm()
        console.log("disposing....")
        dispose()
    }

    const paymentTypeList = () => {
        try {
            const ptypeobj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            axios.post(`/getdata/bookingdata/paymenttype`, ptypeobj)
                .then(res => {
                    console.log('ptyperes', res)
                    let data = res?.data[0]
                    if (data?.length > 0 && data[0].PaymentType) {
                        setPaymentTypeOptions(
                            data.map(paymentType => {
                                return {
                                    value: paymentType?.PaymentTypeID,
                                    label: paymentType?.PaymentType
                                }
                            })
                        )
                    } else {
                        setPaymentTypeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
                    }
                })
        } catch (error) {
            console.log("Payment Type List Error", error.message)
            setPaymentTypeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
        }
    }

    const paymentModeList = async () => {
        try {
            const pmodeobj = {
                LoginID,
                Token,
                Seckey: "abc",
                PaymentTypeID: pstatus,
                Event: "select"
            }
            const res = await axios.post(`/getdata/bookingdata/paymentmode`, pmodeobj)

            // .then(res => {
            console.log('pmoderes', res)
            let data = res?.data[0]
            if (data?.length > 0 && data[0].PaymentMode) {
                setPaymentModeOptions(
                    data.map(paymentMode => {
                        return {
                            value: paymentMode?.PaymentModeID,
                            label: paymentMode?.PaymentMode
                        }
                    })
                )
            }
            else {
                // setPaymentModeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
                setPaymentModeOptions([])
            }
            // }).catch(err => {

            //     setPaymentModeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
            //     console.log("Payment Mode List Error", error.message)
            // })
        } catch (error) {
            // setPaymentModeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
            setPaymentModeOptions([])
            console.log("Payment Mode List Error", error.message)
        }
    }

    useEffect(() => {
        paymentTypeList()
    }, [])

    useEffect(() => {
        paymentModeList()
        if (pstatus === 'Bill to Company') {
            setAmount(0)
        }
    }, [pstatus])

    // const paymentTypeOptions = paymentTypeDropDown?.length > 0 && paymentTypeDropDown[0].PaymentType ? paymentTypeDropDown?.map(function (payment) {
    //     return { value: payment?.PaymentTypeID, label: payment?.PaymentType }
    // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    // const paymentModeOptions = paymentModeDropDown?.length > 0 && paymentModeDropDown[0].PaymentMode ? paymentModeDropDown?.map(function (paymentMode) {
    //     return { value: paymentMode?.PaymentModeID, label: paymentMode?.PaymentMode }
    // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const userDetailObject = [
        {
            UserID: "0",
            FirstName: "Others",
            Email: ""
        }
    ]

    // const userId = localStorage.getItem('user-id')

    const userDetailsData = async () => {
        try {
            const userDetailsBody = { LoginID, Token, Seckey: "abc", Event: "select" }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.UserID, label: `${userDetail.FirstName} : ${userDetail.Email}` }
            })
            setUserDetails(userDetailsOption)
            if (userDetails !== []) { setUserDetailsStatus(true) }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }

    useEffect(() => {
        userDetailsData()
    }, [userDetailsStatus])

    const handleBooking = () => {
        try {
            setLoader(true)
            setHoldLoader(true)
            setSpin(true)
            const bookingBody = {
                LoginID,
                Token,
                Seckey: "abc",
                OnHold: bookingOption === 'hold' ? "true" : "false",
                bookingDetails: bookingStore.bookingDetail_store,
                transactionDetails: [
                    {
                        CheckInDate: moment(bookingStore.checkInDate).format('YYYY-MM-DDThh:mm:ss'),
                        CheckOutDate: moment(bookingStore.checkOutDate).format('YYYY-MM-DDThh:mm:ss'),
                        BookingSourceID: bookingStore.bookingSource_store,
                        SourceTypeID: bookingStore.sourceType_store,
                        isCompany: pstatusName === 'Bill to Company' ? 1 : 0,
                        CompanyGST: cgst,
                        CompanyName: cname,
                        CompanyAddress: cadd,
                        PaymentTypeID: bookingStore.paymentType_store,
                        PaymentModeID: bookingStore.paymentMode_store,
                        BookingCreatedBy_UserID: bookingStore.bookingCreatedBy_store,
                        isFullPaid: payFull === "Yes" ? 1 : 0,
                        InternalNote: bookingOption === 'hold' ? holdInote : inote,
                        SpecialNote: bookingStore.special_note

                    }
                ],
                paymentDetails: [
                    {
                        PaymentTypeID: bookingStore.paymentType_store,
                        PaymentModeID: bookingStore.paymentMode_store,
                        isFullPaid: payFull === "Yes",
                        RoomAmount: bookingStore.cost,
                        Discount: bookingStore.discount ?? 0,
                        CGST: bookingStore.gst / 2,
                        SGST: bookingStore.gst / 2,
                        IGST: bookingStore.gst,
                        TotalTax: bookingStore.gst,
                        TotalAmount: bookingStore.total,
                        PendingAmount: bookingStore.total - +amount,
                        RecievedAmount: amount,
                        CustID: bookingStore.customerId_store,
                        PaymentReferenceText: pref
                    }
                ]
            }
            setBookingError('')
            console.log('bookingBody', bookingBody)
            console.log('bookingBody json', JSON.stringify(bookingBody))
            axios.post(`/setdata/bookingdetails`, bookingBody)
                .then(response => {
                    const responseData = response.data[0]
                    console.log("Booking Response", responseData)
                    // console.log("Booking Response json", JSON.stringify(response))
                    // console.log("Booking Response data", responseData[0])
                    // console.log("Booking Response data json", JSON.stringify(responseData[0]))

                    if (responseData[0]?.BookingMapID) {
                        toast.success("Booked!!!", { position: 'top-center' })
                        //navigate('/reservation')
                        store.dispatch(setBookingID(responseData.BookingMapID))
                        setBookingResponse(responseData[0])
                    } else {
                        toast.error("Error while booking!!!", { position: 'top-center' })
                        // TODO - Error Booking
                        setBookingError(responseData[0]?.Result ?? "Error while booking !!!")

                    }
                    setHoldLoader(false)
                    setLoader(false)
                    setSpin(false)

                })
        } catch (error) {
            console.log("Booking Error", error.message)
            toast.error("Something went WRONG!")
            setBookingError(error.message)
            setHoldLoader(false)
            setLoader(false)
            setSpin(false)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoader(true)
        setHoldLoader(true)
        console.log('booker', typeof booker)
        console.log('newBooker', newBooker, typeof newBooker)
        if (bookingOption === 'confirm' && pstatus && ctype && booker && booker !== '0') {
            handleBooking()
            setLoader(false)
            setShowBookingDetails(true)
        } else if (bookingOption === 'confirm' && pstatus && ctype && booker === '0' && newBooker !== '') {
            handleBooking()
            setLoader(false)
            setShowBookingDetails(true)
        } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && booker && booker !== '0') {
            handleBooking()
            setLoader(false)
            setShowBookingDetails(true)
        } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && booker === '0' && newBooker !== '') {
            handleBooking()
            setLoader(false)
            setShowBookingDetails(true)
        }
        if (bookingOption === 'hold' && holdInote) {
            handleBooking()
            setHoldLoader(false)
            setShowBookingDetails(true)
        }

    }

    // TODO - reload indivividual dropdowns // Fahad
    const handlePaymentType = async (value) => {
        if (value === 'reload') {
            console.log('need to ', value)
            setDropdownLoader(true)
            try {
                const paymentTypeBody = { LoginID, Token, Seckey: "abc", Event: "select" }
                axios.post(`/getdata/bookingdata/paymenttype`, paymentTypeBody)
                    .then(response => {
                        setDropdownLoader(false)
                        store.dispatch(setPaymentTypeDropdownStore(response?.data[0]))
                        console.log("paymnt type data - ", response?.data[0])
                        store.dispatch(setLoaderStore(dropdownLoader))
                    })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Payment Type Error", error.message)
            }
            return
        }
        setPstatus(value)
        store.dispatch(setPaymentTypeStore(value))
    }

    const handlePaymentMode = async (value) => {
        if (value === 'reload') {
            console.log('need to ', value)
            setDropdownLoader(true)
            try {
                const paymentModeBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    // PaymentTypeID: "PTI001", 
                    PaymentTypeID: pstatus,
                    Event: "select"
                }
                axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
                    .then(paymentModeResponse => {
                        setDropdownLoader(false)
                        store.dispatch(setPaymentModeDropdownStore(paymentModeResponse?.data[0]))
                        store.dispatch(setLoaderStore(dropdownLoader))
                    })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Payment Mode Error", error.message)
            }
        }
        setCtype(value)
        store.dispatch(setPaymentModeStore(value))
    }



    return (
        <>
            {console.log('pstatus', pstatusName)}
            <Row className='d-flex flex-column'>
                <Col className='d-flex flex-row justify-content-center'>
                    <h4>Booking Status:</h4>
                    <div className='d-flex flex-row justify-content-around'>
                        <Col className='form-check mx-1 mb-1'>
                            <Input
                                type='radio'
                                id='confirm'
                                name='confirm'
                                checked={bookingOption === 'confirm'}
                                onChange={() => {
                                    setStatus(true)
                                    setBookingOption('confirm')
                                }}
                            />
                            <Label className='form-check-label' for='confirm'>Confirm</Label>
                        </Col>
                        <Col className='form-check mx-1 mb-1'>
                            <Input
                                type='radio'
                                id='hold'
                                name='hold'
                                checked={bookingOption === 'hold'}
                                onChange={() => {
                                    setStatus(false)
                                    setBookingOption('hold')
                                }}
                            />
                            <Label className='form-check-label' for='hold'>Hold</Label>
                        </Col>
                    </div>
                </Col>
                {
                    !drop_downLoader ? (
                        <>
                            {
                                status ? <Col>
                                    <Form onSubmit={e => onSubmit(e)}>
                                        <Row>
                                            <Col>
                                                <Label>
                                                    Payment Type<span className='text-danger'>*</span>
                                                </Label>
                                                <Col>
                                                    <Select
                                                        placeholder=''
                                                        menuPlacement='auto'
                                                        menuPortalTarget={document.body}
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        options={paymentTypeOptions}
                                                        value={paymentTypeOptions?.filter(c => c.value === pstatus)}
                                                        onChange={val => {
                                                            setPstatusName(val.label)
                                                            handlePaymentType(val.value)
                                                        }}
                                                        invalid={pstatus === '' && loader}
                                                    />
                                                </Col>
                                                {pstatus === '' && loader && <Label className='text-danger'>Payment Type is required!</Label>}
                                            </Col>
                                            {
                                                pstatusName !== 'Bill to Company' && <Col>
                                                    <Label>
                                                        Payment Mode{(paymentModeOptions.length !== 0) && <span className='text-danger'>*</span>}
                                                    </Label>
                                                    <Col>
                                                        <Select
                                                            isDisabled={pstatus === '' || paymentModeOptions.length === 0}
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            menuPortalTarget={document.body}
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={paymentModeOptions}
                                                            value={paymentModeOptions?.filter(c => c.value === ctype)}
                                                            onChange={val => {
                                                                handlePaymentMode(val.value)
                                                            }}
                                                            invalid={ctype === '' && loader}
                                                        />
                                                    </Col>
                                                    {ctype === '' && loader && <Label className='text-danger'>Payment Mode is required!</Label>}
                                                </Col>
                                            }

                                            {
                                                pstatusName !== 'hotel' && pstatusName !== 'Bill to Company' ? (
                                                    <>
                                                        <Col className='mt-2'>
                                                            <Row>
                                                                <Col>
                                                                    <Label className='Amount text-nowrap' for='fullAmount'>
                                                                        <Input className='me-1' type='radio' name='payFull' id='fullAmount' value="Yes" checked={payFull === "Yes"} onChange={e => (setPayFull(e.target.value), setAmount(bookingStore.total))} />
                                                                        Full Amt
                                                                        {/* <sup for='fullAmount'>({bookingStore.total})</sup> */}
                                                                    </Label>
                                                                </Col>
                                                                <Col className='p-0'>
                                                                    <Label className='Amount text-nowrap' for='partialAmount'>
                                                                        <Input className='mx-1' type='radio' name='payFull' id='partialAmount' value="No" checked={payFull === "No"} onChange={e => (setPayFull(e.target.value), setAmount(bookingStore.total === amount ? 0 : amount))} />
                                                                        Partial Amt
                                                                    </Label>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Label>
                                                                Collected Amount
                                                            </Label>
                                                            <Col>
                                                                <Input
                                                                    type='number'
                                                                    onChange={e => setAmount(e.target.value)}
                                                                    value={amount === 0 && payFull === 'Yes' ? bookingStore.total : amount}
                                                                    disabled={payFull === 'Yes'}
                                                                    invalid={loader && (amount === '' || amount > bookingStore.total)}
                                                                />
                                                            </Col>
                                                            {payFull === "No" && amount === '' && loader && <Label className='text-danger'>Collected amount cannot be blank!</Label>}
                                                            {payFull === "No" && amount > bookingStore.total && loader && <Label className='text-danger'>Collected amount cannot be more than full amount!</Label>}
                                                        </Col>
                                                    </>
                                                ) : pstatusName === 'Bill to Company' && pstatusName !== 'hotel' ? (
                                                    <>
                                                        <Col>
                                                            <Label>
                                                                Company GST No.<span className='text-danger'>*</span>
                                                            </Label>
                                                            <Col>
                                                                <Input
                                                                    type='text'
                                                                    value={cgst}
                                                                    invalid={cgst === '' && loader}
                                                                    onChange={e => setCgst(e.target.value)}
                                                                />
                                                            </Col>
                                                            {cgst === '' && loader && <FormFeedback>Gst is required!</FormFeedback>}
                                                        </Col>
                                                        <Col>
                                                            <Label>
                                                                Company Name<span className='text-danger'>*</span>
                                                            </Label>
                                                            <Col>
                                                                <Input
                                                                    type='text'
                                                                    value={cname}
                                                                    invalid={cname === '' && loader}
                                                                    onChange={e => setCname(e.target.value)}
                                                                />
                                                            </Col>
                                                            {cname === '' && loader && <FormFeedback>Company Name is required!</FormFeedback>}
                                                        </Col>
                                                        <Col>
                                                            <Label>
                                                                Company Address<span className='text-danger'>*</span>
                                                            </Label>
                                                            <Col>
                                                                <Input
                                                                    type='text'
                                                                    value={cadd}
                                                                    invalid={cadd === '' && loader}
                                                                    onChange={e => setCadd(e.target.value)}
                                                                />
                                                            </Col>
                                                            {cadd === '' && loader && <FormFeedback>Company Address is required!</FormFeedback>}
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
                                                <Col>
                                                    <Input
                                                        type='textarea'
                                                        value={pref}
                                                        onChange={e => setPref(e.target.value)}
                                                    />
                                                </Col>
                                            </Col>
                                            <Col>
                                                <Label>
                                                    Internal Note
                                                </Label>
                                                <Col>
                                                    <Input
                                                        type='textarea'
                                                        value={inote}
                                                        onChange={e => setInote(e.target.value)}
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Label>
                                                    Booking Created By<span className='text-danger'>*</span>
                                                </Label>
                                                <Col>
                                                    <Select
                                                        placeholder=''
                                                        menuPlacement='auto'
                                                        menuPortalTarget={document.body}
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        options={userDetails}
                                                        value={userDetails?.filter(c => c.value === booker)}
                                                        onChange={val => {
                                                            setBooker(val.value)
                                                            store.dispatch(setBookingCreatedByStore(val.value))
                                                        }}
                                                        invalid={booker === '' && loader}
                                                    />
                                                </Col>
                                                {booker === '' && loader && <Label className='text-danger'>Booker is required!</Label>}
                                            </Col>
                                            <Col>
                                                <Label>
                                                    Created By{booker === '0' && <span className='text-danger'>*</span>}
                                                </Label>
                                                <Col>
                                                    <Input
                                                        type='text'
                                                        disabled={booker !== '0'}
                                                        onChange={e => setNewBooker(e.target.value)}
                                                        invalid={newBooker === '' && loader}
                                                    />
                                                </Col>
                                                {newBooker === '' && loader && <Label className='text-danger'>Created by cannot be blank!</Label>}
                                            </Col>
                                        </Row>
                                        <div className='mt-1 d-flex justify-content-between'>
                                            <Button color='secondary' className='btn-prev' outline onClick={() => handleOpenConfirm()}>
                                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                                            </Button>
                                            <Button type='submit' color='primary' className='btn-next'>
                                                <span className='align-middle d-sm-inline-block d-none'>
                                                    {/* Create Booking */}
                                                    {
                                                        spin ? <Spinner color="light" /> : "Create Booking"
                                                    }
                                                </span>
                                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                            </Button>
                                        </div>
                                    </Form>
                                </Col> : <>
                                    <div className='mt-1'>
                                        <div>
                                            <Form onSubmit={e => onSubmit(e)}>
                                                <Col className='my-1'>
                                                    <Label>
                                                        Internal Note<span className='text-danger'>*</span>
                                                    </Label>
                                                    <Col>
                                                        <Input
                                                            type='textarea'
                                                            value={holdInote}
                                                            invalid={holdInote === '' && holdLoader}
                                                            onChange={e => setHoldInote(e.target.value)}
                                                        />
                                                    </Col>
                                                    {holdInote === '' && holdLoader && <Label className='text-danger'>Internal Note is required!</Label>}
                                                </Col>
                                                <Col className='text-center'>
                                                    <Button color='primary' onClick={onSubmit}>
                                                        {/* Save On Hold */}
                                                        {
                                                            spin ? <Spinner color="light" /> : "Save on Hold"
                                                        }
                                                    </Button>
                                                </Col>
                                            </Form>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    ) : (
                        <div style={{ height: '150px' }}>
                            <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
                        </div>
                    )
                }
            </Row>
            {showBookingDetails ? <BookingDetailPreview bookingOption={bookingOption} BookingError={bookingError} bookingResponse={bookingResponse} handleFinalModal={handleFinalModal} showBookingDetails={showBookingDetails} dispose={dispose} /> : <></>}

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

export default ConfirmationFinal