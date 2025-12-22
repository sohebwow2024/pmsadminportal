import React, { useState, useEffect } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
import toast from 'react-hot-toast'

// ** Utils
import { selectThemeColors } from '@utils'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Store & Actions
import { store } from '@store/store'
import { setPytTypeId, setPytModeId, setPaymentTypeName, setBookedBy, disposeNewStore, setPartialAmt } from '../../../redux/reserve'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import NewBookingDetailPreview from './NewBookingDetailPreview'
import { setBookingRate } from '../../../redux/usermanageReducer'

const NewConfirmationFinal = ({ stepper }) => {
    console.log('vcbdnvbdv');
    const navigate = useNavigate()
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const reserveStore = useSelector(state => state.reserveSlice)
    const reservedRooms = useSelector(state => state.reserveSlice.selRoomArr)
    console.log('reservedRoomssssss', reservedRooms, reserveStore);

    let newArr = reservedRooms.length > 0 && reservedRooms?.map(r => {
        console.log('NewArr', r);

        let newObj = {
            RoomID: r.roomID,
            Adult: r.SEL_ADULT,
            Children: r.SEL_CHILD,
            Infant: r.SEL_INFANT,
            MealID: r.SEL_MEAL,
        }
        return newObj
    })
    const RateData = useSelector(state => state?.userManageSlice?.bookingRateData?.dateRate)
    console.log('RateData', RateData, reservedRooms);
    const myArrayFiltered = RateData?.filter((el) => {
        return reservedRooms.some((f) => {
            return f.roomID === el.roomID && f.SEL_MEAL === el.mealID;
        });
    });
    // const myRateFiltered = reservedRooms?.filter((el) => {
    //     return RateData.some((f) => {
    //         return f.ROOMID === el.RoomID && f.ROOM_RATE === el.RoomRate;
    //     });
    // });
    console.log('myArrayFiltered', myArrayFiltered);
    const updatedFilter = myArrayFiltered?.length > 0 && myArrayFiltered.map(filterEntry => {
        // const roomID = filterEntry["ROOMID"];
        // const mealId = filterEntry["MealID"];
        const roomID = filterEntry["roomID"];
        const mealId = filterEntry["mealID"];
        console.log('myArrayFiltered', roomID, mealId);
        const reservedRoomEntry = reservedRooms.find(room => room["roomID"] === roomID && room["SEL_MEAL"] === mealId);
        console.log('reservedRoomEntry', reservedRoomEntry);
        return reservedRoomEntry
            ? {
                ...filterEntry, ROOMRATE: parseInt(reservedRoomEntry["ROOM_RATE"]),
                FIXED_ROOM_RATE: parseInt(reservedRoomEntry["FIXED_ROOM_RATE"]),
                CUSTOM_UPDATE: reservedRoomEntry["CUSTOM_UPDATE"]
            }
            : filterEntry;
    });

    //   setFilter(updatedFilter);

    console.log('myArrayFiltered', reservedRooms, myArrayFiltered, updatedFilter);

    let newRateData = updatedFilter?.length > 0 && updatedFilter?.map(r => {
        console.log('nnnnn', r);
        let newObj = {
            BookingDate: r.date,
            RoomID: r.ROOMID,
            RoomRate: r.CUSTOM_UPDATE === true ? r.ROOMRATE : r.FIXED_ROOM_RATE,
            ExtraAdultRate: r.EXTRAADULTRATE,
            ExtraChildRate: r.EXTRACHILDRATE,
            RatePlanId: r.ratePlanID
        }
        return newObj
    })
    // console.log('RateData', newRateData);
    // console.log('newObj', newObj);

    const [loader, setLoader] = useState(false)
    const [holdLoader, setHoldLoader] = useState(false)
    const [status, setStatus] = useState(true)

    const [pstatus, setPstatus] = useState("")
    const [pstatusName, setPstatusName] = useState("")
    const [ctype, setCtype] = useState("")
    const [amount, setAmount] = useState(0)
    const [pamt, setPamt] = useState(0)
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

    const [bookingError, setBookingError] = useState('')
    const [bookingResponse, setBookingResponse] = useState()
    const [spin, setSpin] = useState(false)

    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])

    const [showBookingDetails, setShowBookingDetails] = useState(false)
    const handleFinalModal = () => {
        setShowBookingDetails(!showBookingDetails)
    }

    const handleStateSets = () => {
        if (reserveStore) {
            let pstat = reserveStore?.paymentTypeId !== '' ? reserveStore.paymentTypeId : ""
            setPstatus(pstat)
            let pname = reserveStore?.paymentTypeName !== '' ? reserveStore.paymentTypeName : ""
            setPstatusName(pname)
            let ctyp = reserveStore?.paymentModeId !== '' ? reserveStore.paymentModeId : ""
            setCtype(ctyp)
            let amt = reserveStore?.discount > 0 ? (reserveStore.total) : reserveStore.total
            // commented by Nida Waja at 27-05-2023
            // let amt = reserveStore?.discount > 0 ? (reserveStore.total - reserveStore?.disAmt) : reserveStore.total
            setAmount(amt)
            if (payFull === "No") {
                setPamt(reserveStore.partialAmt)
            } else {
                setPamt(reserveStore.total)
            }
        }
    }

    useEffect(() => {
        handleStateSets()
    }, [reserveStore])

    const dispose = () => {
        console.log('reserveStore', reserveStore)
        store.dispatch(disposeNewStore(true))
        handleFinalModal()
        navigate('/new_reservation')
        window.location.reload()
        //stepper.to(0)
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
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            console.log('userDetail', userDetailResponse)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.userID, label: `${userDetail.firstName} : ${userDetail.email}` }
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

    const handleBooking = async () => {
        try {
            setLoader(true)
            setHoldLoader(true)
            setSpin(true)
            let bookingBody = {
                LoginID,
                Token,
                Seckey: "abc",
                OnHold: bookingOption === 'hold' ? "true" : "false",
                bookingDetails: newArr,
                transactionDetails: [
                    {
                        CheckInDate: moment(reserveStore.iDate).format('YYYY-MM-DDThh:mm:ss'),
                        CheckOutDate: moment(reserveStore.oDate).format('YYYY-MM-DDThh:mm:ss'),
                        BookingSourceID: reserveStore.sourceId,
                        SourceTypeID: reserveStore.sourceTypeId,
                        isCompany: pstatusName === 'Bill to Company' ? 1 : 0,
                        CompanyGST: cgst,
                        CompanyName: cname,
                        CompanyAddress: cadd,
                        PaymentTypeID: reserveStore.paymentTypeId !== '' ? reserveStore.paymentTypeId : null,
                        PaymentModeID: reserveStore.paymentModeId !== '' ? reserveStore.paymentModeId : null,
                        BookingCreatedBy_UserID: booker === 0 ? newBooker : reserveStore.booker,
                        isFullPaid: payFull === "Yes" ? 1 : 0,
                        InternalNote: bookingOption === 'hold' ? holdInote : inote,
                        SpecialNote: reserveStore.specialNote

                    }
                ],
                paymentDetails: [
                    {
                        LoginID,
                        Token,
                        Seckey: "abc",
                        PaymentTypeID: reserveStore.paymentTypeId !== '' ? reserveStore.paymentTypeId : null,
                        PaymentModeID: reserveStore.paymentModeId !== '' ? reserveStore.paymentModeId : null,
                        isFullPaid: payFull === "Yes",
                        RoomAmount: reserveStore.cost,
                        // Discount: reserveStore.discount ?? 0,
                        Discount: reserveStore.disAmt ?? 0,
                        CGST: reserveStore.gst / 2,
                        SGST: reserveStore.gst / 2,
                        IGST: reserveStore.gst,
                        TotalTax: reserveStore.gst,
                        // TotalAmount: reserveStore.total,
                        TotalAmount: amount,
                        PendingAmount: bookingOption === 'hold' ? amount : (amount - pamt),
                        RecievedAmount: bookingOption === 'hold' ? 0 : +pamt,
                        CustID: reserveStore.customerId,
                        PaymentReferenceText: pref
                    }
                ],
                bookingRateDetails: newRateData
            }
            setBookingError('')
            console.log('bookingBody', bookingBody)
            console.log('bookingBody json', JSON.stringify(bookingBody))

            const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
            const responseData = res?.data[0]
            console.log("Booking Response", responseData)
            if (responseData[0]?.bookingMapID) {
                toast.success("Booked!!!", { position: 'top-center' })
                //navigate('/reservation')
                // store.dispatch(setBookingID(responseData.BookingMapID))
                setBookingResponse(responseData[0])
                store.dispatch(
                    // dateRate.map((index) => {
                    setBookingRate({})
                    // })
                )
            } else {
                toast.error("Error while booking!!!", { position: 'top-center' })
                // TODO - Error Booking
                setBookingError(responseData[0]?.Result ?? "Error while booking !!!")

            }
            setHoldLoader(false)
            setLoader(false)
            setSpin(false)


        } catch (error) {
            console.log("Booking Error", error)
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
        } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && (cname && cgst && cadd !== '') && booker && booker !== '0') {
            handleBooking()
            setLoader(false)
            setShowBookingDetails(true)
        } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && (cname && cgst && cadd !== '') && booker === '0' && newBooker !== '') {
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
    // const handlePaymentType = async (value) => {
    //     if (value === 'reload') {
    //         console.log('need to ', value)
    //         setDropdownLoader(true)
    //         try {
    //             const paymentTypeBody = { LoginID, Token, Seckey: "abc", Event: "select" }
    //             axios.post(`/getdata/bookingdata/paymenttype`, paymentTypeBody)
    //                 .then(response => {
    //                     setDropdownLoader(false)
    //                     store.dispatch(setPaymentTypeDropdownStore(response?.data[0]))
    //                     console.log("paymnt type data - ", response?.data[0])
    //                     store.dispatch(setLoaderStore(dropdownLoader))
    //                 })
    //         } catch (error) {
    //             setDropdownLoader(false)
    //             store.dispatch(setLoaderStore(dropdownLoader))
    //             console.log("Payment Type Error", error.message)
    //         }
    //         return
    //     }
    //     setPstatus(value)
    //     store.dispatch(setPaymentTypeStore(value))
    // }

    // const handlePaymentMode = async (value) => {
    //     if (value === 'reload') {
    //         console.log('need to ', value)
    //         setDropdownLoader(true)
    //         try {
    //             const paymentModeBody = {
    //                 LoginID,
    //                 Token,
    //                 Seckey: "abc",
    //                 // PaymentTypeID: "PTI001", 
    //                 PaymentTypeID: pstatus,
    //                 Event: "select"
    //             }
    //             axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
    //                 .then(paymentModeResponse => {
    //                     setDropdownLoader(false)
    //                     store.dispatch(setPaymentModeDropdownStore(paymentModeResponse?.data[0]))
    //                     store.dispatch(setLoaderStore(dropdownLoader))
    //                 })
    //         } catch (error) {
    //             setDropdownLoader(false)
    //             store.dispatch(setLoaderStore(dropdownLoader))
    //             console.log("Payment Mode Error", error.message)
    //         }
    //     }
    //     setCtype(value)
    //     store.dispatch(setPaymentModeStore(value))
    // }

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
                                            onChange={e => {
                                                setPstatusName(e.label)
                                                setPstatus(e.value)
                                                store.dispatch(setPaymentTypeName(e.label))
                                                store.dispatch(setPytTypeId(e.value))
                                                // handlePaymentType(val.value)
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
                                                onChange={e => {
                                                    setCtype(e.value)
                                                    store.dispatch(setPytModeId(e.value))
                                                    // handlePaymentMode(val.value)
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
                                                            <Input
                                                                className='me-1'
                                                                type='radio'
                                                                name='payFull'
                                                                id='fullAmount'
                                                                value="Yes"
                                                                checked={payFull === "Yes"}
                                                                onChange={e => {
                                                                    setPayFull(e.target.value)
                                                                    setPamt(amount)
                                                                }}
                                                            />
                                                            Full Amt
                                                        </Label>
                                                    </Col>
                                                    <Col className='p-0'>
                                                        <Label className='Amount text-nowrap' for='partialAmount'>
                                                            <Input
                                                                className='mx-1'
                                                                type='radio'
                                                                name='payFull'
                                                                id='partialAmount'
                                                                value="No"
                                                                checked={payFull === "No"}
                                                                onChange={e => {
                                                                    setPayFull(e.target.value)
                                                                    // setAmount(reserveStore.total === amount ? 0 : amount)
                                                                    setPamt(amount === pamt ? 0 : pamt)
                                                                }}
                                                            />
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
                                                        onChange={e => {
                                                            if (e.target.value < 0) {
                                                                // setAmount(0)
                                                                setPamt(0)
                                                                store.dispatch(setPartialAmt(0))
                                                            } else {
                                                                // setAmount(e.target.value)
                                                                setPamt(e.target.value)
                                                                store.dispatch(setPartialAmt(e.target.value))
                                                            }
                                                        }}
                                                        // value={amount === 0 && payFull === 'Yes' ? reserveStore.total : amount}
                                                        value={pamt === 0 && payFull === 'Yes' ? amount : pamt}
                                                        disabled={payFull === 'Yes'}
                                                        invalid={loader && (pamt === '' || pamt > amount)}
                                                    />
                                                </Col>
                                                {payFull === "No" && amount === '' && loader && <Label className='text-danger'>Collected amount cannot be blank!</Label>}
                                                {payFull === "No" && amount > reserveStore.total && loader && <Label className='text-danger'>Collected amount cannot be more than full amount!</Label>}
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
                                            onChange={e => {
                                                const filteredValue = e.target.value.replace(/[^a-zA-Z0-9/ ]/g, '');
                                                setPref(filteredValue);
                                            }}
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
                                            onChange={e => {
                                                const filteredvalue = e.target.value.replace(/[^a-zA-Z0-9/]/g, '')

                                                setInote(filteredvalue);
                                            }
                                            }
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
                                                console.log('val', val.value)
                                                setBooker(val.value)
                                                store.dispatch(setBookedBy(val.value))
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
                                            invalid={booker === '0' && newBooker === '' && loader}
                                        />
                                    </Col>
                                    {booker === '0' && newBooker === '' && loader && <Label className='text-danger'>Created by cannot be blank!</Label>}
                                </Col>
                            </Row>
                            <div className='mt-1 d-flex justify-content-between'>
                                <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
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
            </Row>
            {showBookingDetails ? <NewBookingDetailPreview bookingOption={bookingOption} BookingError={bookingError} bookingResponse={bookingResponse} handleFinalModal={handleFinalModal} showBookingDetails={showBookingDetails} dispose={dispose} /> : <></>}
        </>
    )
}

export default NewConfirmationFinal