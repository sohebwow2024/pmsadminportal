import { React, useEffect, useRef, useState } from 'react'
import { Col, Form, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
// ** Third Party Components
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
// ** Store & Actions
import { store } from '@store/store'
import { useDispatch } from "react-redux"
import axios from '../../API/axios'
// ** Reactstrap Imports
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Input } from 'reactstrap'
import { Button, FormFeedback, Spinner } from 'reactstrap'
import { selectThemeColors } from '@utils'
import { ArrowRight, XCircle } from 'react-feather'
import ReactSlider from "react-slider";
import toast from 'react-hot-toast'
import { number } from 'prop-types'

const discountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'flat', label: 'Flat' }
]

const OnHoldQuickBookingModal = ({ open, handleOnHoldOpen, bookingID }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [loader, setLoader] = useState(false)
    const [roomList, setRoomList] = useState([])

    const [guest_details, setGuest_details] = useState([])
    const [booking_details, setBooking_details] = useState([])
    const [payment_details, setPayment_details] = useState([])
    const [pstatus, setPstatus] = useState('')
    const [pstatusName, setPstatusName] = useState("")
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])
    const [ctype, setCtype] = useState("")
    const [amount, setAmount] = useState("")
    console.log('amount', amount);
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
    const [spin, setSpin] = useState(false)

    const [cancelOpen, setCancelOpen] = useState(false)
    const handleCancelOpen = () => setCancelOpen(!cancelOpen)

    const getBookingInfo = async () => {
        if (bookingID) {
            try {
                const bookingsBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    RoomAllocationID: bookingID,
                    Event: "selectall"
                }
                const res = await axios.post(`/getdata/bookingdata/allocateroomnumber`, bookingsBody) // TODO - Why
                console.log("allocateroomnumber response", res?.data[0])
                setRoomList(res?.data[0])
            } catch (error) {
                console.log("RoomList Error=====", error)
            }
        }
        if (bookingID) {
            try {
                const bookingsBody = {
                    LoginID: LoginID,
                    Token: Token,
                    Seckey: "abc",
                    BookingID: bookingID,
                }
                const res = await axios.post(`/getdata/bookingdetailsbybookingid`, bookingsBody) // TODO - Why                    
                console.log("bookingdetailsbybookingid", res?.data)
                setGuest_details(res?.data[0])
                setBooking_details(res?.data[1])
                setPayment_details(res?.data[2])
            } catch (error) {
                console.log("Booking Details Error=====", error)
            }
        }
    }

    const paymentTypeList = async () => {
        try {
            const ptypeobj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/bookingdata/paymenttype`, ptypeobj)
            console.log('ptyperes', res)
            let data = res?.data[0]
            if (data?.length > 0 && data[0].paymentType) {
                setPaymentTypeOptions(
                    data.map(paymentType => {
                        return {
                            value: paymentType?.paymentTypeID,
                            label: paymentType?.paymentType
                        }
                    })
                )
            } else {
                setPaymentTypeOptions([{ value: 'reload', label: 'Error loading, click to reload again' }])
            }

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
            console.log('pmoderes', res)
            let data = res?.data[0]
            if (data?.length > 0 && data[0].paymentMode) {
                setPaymentModeOptions(
                    data.map(paymentMode => {
                        return {
                            value: paymentMode?.paymentModeID,
                            label: paymentMode?.paymentMode
                        }
                    })
                )
            }
            else {
                setPaymentModeOptions([])
            }
        } catch (error) {
            setPaymentModeOptions([])
            console.log("Payment Mode List Error", error.message)
        }
    }

    const userDetailObject = [
        {
            UserID: "0",
            FirstName: "Others",
            Email: ""
        }
    ]

    const userDetailsData = async () => {
        try {
            const userDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            if (response.data[0].length > 0) {
                const userDetailResponse = response.data[0]?.concat(userDetailObject)

                const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                    return { value: userDetail.userID, label: `${userDetail.firstName} : ${userDetail.email}` }
                })
                setUserDetails(userDetailsOption)
            } else {
                const userDetailResponse = userDetailObject
                const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                    return { value: userDetail.userID, label: `${userDetail.firstName} : ${userDetail.email}` }
                })
                setUserDetails(userDetailsOption)
            }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }

    useEffect(() => {
        getBookingInfo()
        paymentTypeList()
        userDetailsData()
    }, [open, bookingID])

    useEffect(() => {
        paymentModeList()
        if (pstatusName === 'Bill to Company') {
            setAmount(0)
        }
    }, [pstatusName])

    console.log('guest_details', guest_details)
    console.log('booking_details', booking_details)
    console.log('payment_details', payment_details)

    console.log('roomList', roomList)

    const handleCancelBooking = async (id) => {
        try {
            const cancelObj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "update",
                BookingID: id
            }
            const res = await axios.post(`/setdata/cancelbooking`, cancelObj)
            console.log('cancelres', res);
            if (res.data[0][0].status === "Success") {
                // handleOpen()
                toast.success(`${id} - booking is cancelled!`)
                handleCancelOpen()
                handleOnHoldOpen()
            }
        } catch (err) {
            console.log('cancelerr', err);
            toast.error(err.response)
            handleCancelOpen()
        }
    }

    const CancelModal = ({ id, open, handleCancelOpen }) => {
        return (
            <>
                <Modal isOpen={open} toggle={handleCancelOpen} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={handleCancelOpen}>
                        Cancel Booking of - {id}
                    </ModalHeader>
                    <ModalBody>
                        <h3 className='text-center'>Are you sure you want to cancel this booking?</h3>
                        <Col className='text-center'>
                            <Button className='m-1' color='danger' onClick={() => handleCancelBooking(id)}>Confirm</Button>
                            <Button className='m-1' color='primary' onClick={() => handleCancelOpen()}>Cancel</Button>
                        </Col>
                    </ModalBody>
                </Modal>
            </>
        )
    }

    const handleOnHoldSubmit = async (e) => {
        setSpin(true)
        setLoader(true)
        e.preventDefault()
        if (pstatus && pstatusName && ctype && booker !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    isCompany: pstatusName === 'Bill to Company' ? 1 : 0,
                    CompanyGST: cgst,
                    CompanyName: cname,
                    CompanyAddress: cadd,
                    PaymentID: payment_details[0]?.paymentID,
                    PaymentTypeID: pstatus,
                    PaymentModeId: ctype,
                    isFullPaid: payFull === 'Yes' ? 1 : 0,
                    RoomAmount: payment_details[0]?.roomAmount,
                    Discount: payment_details[0]?.discount,
                    CGST: Number(payment_details[0]?.totalTax) / 2,
                    SGST: Number(payment_details[0]?.totalTax) / 2,
                    IGST: payment_details[0]?.totalTax,
                    TotalTax: payment_details[0]?.totalTax,
                    TotalAmount: payment_details[0]?.totalAmount,
                    PendingAmount: amount === 0 ? payment_details[0].pendingAmount : payment_details[0]?.totalAmount - amount,
                    RecievedAmount: amount === 0 ? payment_details[0]?.receivedAmount : Number(amount),
                    PaymentReferenceText: pref
                }
                console.log('objj', obj);
                const res = await axios.post(`/booking/BookingSaveOnHold/${booking_details[0]?.transactionID}`, obj)
                console.log('res', res)
                if (res.status === 200) {
                    toast.success("Booking Confirmed!")
                    handleOnHoldOpen()
                    setSpin(false)
                    setLoader(false)
                } else {
                    toast.error("Something went wrong, Try again!")
                    setSpin(false)
                    setLoader(false)
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
                setSpin(false)
            }
        } else {
            toast.error("Fill all Fields!")
            setSpin(false)
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOnHoldOpen}
                className='modal-dialog-centered modal-xl'
                backdrop={false}
            >
                <ModalHeader toggle={handleOnHoldOpen}>OnHold Booking - {bookingID}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => handleOnHoldSubmit(e)}>
                        <Row>
                            <Col>
                                <Label className='form-label' for='checkIn_date'>
                                    Check-In Date:
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='checkInDate'
                                    value={moment(booking_details[0]?.checkInDate).format('DD-MM-YYYY')}
                                />
                            </Col>
                            <Col>
                                <Label className='form-label' for='checkOut_date'>
                                    Check-In Date:
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='checkOutDate'
                                    value={moment(booking_details[0]?.checkOutDate).format('DD-MM-YYYY')}
                                />
                            </Col>
                            <Col>
                                <Label className='form-label' for='duration'>
                                    Total Duration:(Nights)
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='duration'
                                    value={moment(booking_details[0]?.checkOutDate).diff(moment(booking_details[0]?.checkInDate), 'days')}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Room Category</th>
                                            <th className='occupantsCol'>Occupants</th>
                                            <th className='mealCol'>Rate Plan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            roomList.map((r, i) => {
                                                { console.log('rrr', r) }
                                                return (
                                                    <>
                                                        <tr key={i}>
                                                            <td>
                                                                <div className='d-flex flex-column'>
                                                                    <Label className='fs-4'>{r?.roomCategory}</Label>
                                                                    {/* <Label className='fs-5'>{r?.RoomTypeDesc}</Label> */}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Label className='fs-4 mx-1'>Adutls: {r?.adult}</Label>
                                                                <Label className='fs-4 mx-1'>Children: {r?.children}</Label>
                                                                <Label className='fs-4 mx-1'>Infants: {r?.infant}</Label>
                                                            </td>
                                                            <td>
                                                                <Label className='fs-4'>{`${r.ratePlan} - ${r.mealType}`}</Label>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex flex-row justify-content-between align-items-center'>
                                <div className='w-100 me-1'>
                                    <Label className='form-label' for='booking_source'>
                                        Booking Source:
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='booking_source'
                                        value={booking_details[0]?.bookingSource}
                                    />
                                </div>
                                <div className='w-100 ms-1'>
                                    <Label className='form-label' for='booking_type'>
                                        Booking Type:
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='booking_type'
                                        value={booking_details[0]?.sourceType}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <Label className='form-label' for='guest'>
                                    Guest Details:
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='guest'
                                    value={`${guest_details[0]?.guestName} - ${guest_details[0]?.guestEmail} - ${guest_details[0]?.guestMobileNumber}`}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label className='form-label' for='note'>
                                    Note:
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='guest'
                                    value={guest_details[0]?.specialNote}
                                />
                            </Col>
                            <Col>
                                <Label className='form-label' for='amount'>
                                    Amount:
                                </Label>
                                <Input
                                    disabled
                                    type='text'
                                    name='guest'
                                    value={`₹ ${payment_details[0]?.totalAmount}`}
                                />
                            </Col>
                        </Row>
                        <hr className='mt-2' />
                        <Row>
                            <Col>
                                <Label className='form-label' for='ptype'>
                                    Payment Type<span className='text-danger'>*</span>
                                </Label>
                                <Select
                                    placeholder=''
                                    menuPlacement='auto'
                                    aria-readonly
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={paymentTypeOptions}
                                    value={paymentTypeOptions?.filter(c => c.value === pstatus)}
                                    onChange={val => {
                                        setPstatusName(val.label)
                                        setPstatus(val.value)
                                    }}
                                // invalid={pstatusName === '' && loader}
                                />
                                {pstatusName === '' && loader && <Label className='text-danger'>Payment Type is required!</Label>}
                            </Col>
                            {
                                pstatusName !== 'Bill to Company' && <Col>
                                    <Label>
                                        Payment Mode{(paymentModeOptions.length !== 0) && <span className='text-danger'>*</span>}
                                    </Label>
                                    <Col>
                                        <Select
                                            isDisabled={pstatusName === '' || paymentModeOptions.length === 0}
                                            placeholder=''
                                            menuPlacement='auto'
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={paymentModeOptions}
                                            value={paymentModeOptions?.filter(c => c.value === ctype)}
                                            onChange={val => {
                                                setCtype(val.value)
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
                                                        <Input className='me-1' type='radio' name='payFull' id='fullAmount' value="Yes" checked={payFull === "Yes"} onChange={e => (setPayFull(e.target.value), setAmount(payment_details[0]?.totalAmount))} />
                                                        Full Amt
                                                        {/* <sup for='fullAmount'>({payment_details[0]?.TotalAmount})</sup> */}
                                                    </Label>
                                                </Col>
                                                <Col className='p-0'>
                                                    <Label className='Amount text-nowrap' for='partialAmount'>
                                                        <Input className='mx-1' type='radio' name='payFull' id='partialAmount' value="No" checked={payFull === "No"} onChange={e => (setPayFull(e.target.value), setAmount(payment_details[0]?.totalAmount === amount ? 0 : amount))} />
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
                                                    value={amount === 0 && payFull === 'Yes' ? payment_details[0]?.totalAmount : amount}
                                                    disabled={payFull === 'Yes'}
                                                    invalid={loader && (amount === '' || amount > payment_details[0]?.totalAmount)}
                                                />
                                            </Col>
                                            {payFull === "No" && amount === '' && loader && <Label className='text-danger'>Collected amount cannot be blank!</Label>}
                                            {payFull === "No" && amount > payment_details[0]?.totalAmount && loader && <Label className='text-danger'>Collected amount cannot be more than full amount!</Label>}
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
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={userDetails}
                                        value={userDetails?.filter(c => c.value === booker)}
                                        onChange={val => {
                                            setBooker(val.value)
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
                                    />
                                </Col>
                                {newBooker === '' && loader && <FormFeedback>Created by cannot be blank!</FormFeedback>}
                            </Col>
                        </Row>
                        <div className='mt-1 d-flex justify-content-center'>
                            <Button type='submit' color='primary' className='btn-next m-1'>
                                <span className='align-middle d-sm-inline-block d-none'>
                                    {
                                        spin ? <Spinner color="light" /> : "Confirm Booking"
                                    }
                                </span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                            </Button>
                            <Button type='reset' color='danger' className='btn-next m-1' onClick={() => handleCancelOpen()}>
                                <XCircle size={14} className='align-middle me-sm-25 me-0'></XCircle>
                                <span className='align-middle d-sm-inline-block d-none'>
                                    Cancel Booking
                                </span>
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
            {cancelOpen ? <CancelModal open={cancelOpen} id={bookingID} handleCancelOpen={handleCancelOpen} /> : <></>}
        </>
    )
}

export default OnHoldQuickBookingModal