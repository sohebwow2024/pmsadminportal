
import React, { useState, useEffect } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
import toast from 'react-hot-toast'
// ** Utils
import { selectThemeColors } from '@utils'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Store & Actions
import { store } from '@store/store'
import { setPytTypeId, setPytModeId, setPaymentTypeName, setBookedBy, disposeNewStore, setPartialAmt } from '../redux/reserve'
import axios from '../API/axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
// import NewBookingDetailPreview from './NewBookingDetailPreview'
import { setBookingRate } from '../redux/usermanageReducer'
import NewBookingDetailPreview from './NewReservation/Confirmation/NewBookingDetailPreview'
import { RAZOR_KEY } from '../common/ConstantString'


const BKNewConfimationFinal = ({ stepper }) => {
    console.log('vcbdnvbdv');
    const navigate = useNavigate()
    // const getUserData = useSelector(state => state.userManageSlice.userData)
    // console.log('getUserData', getUserData);
    // const { LoginID, Token, PropertyID } = getUserData

    const reserveStore = useSelector(state => state.reserveSlice)
    const reservedRooms = useSelector(state => state.reserveSlice.selRoomArr)
    console.log('reservedRoomssssss', reservedRooms, reserveStore);

    let newArr = reservedRooms.length > 0 && reservedRooms?.map(r => {
        let newObj = {
            RoomID: r.RoomID,
            Adult: r.SEL_ADULT,
            Children: r.SEL_CHILD,
            Infant: r.SEL_INFANT,
            MealID: r.SEL_MEAL,
        }
        return newObj
    })
    const RateData = useSelector(state => state?.userManageSlice?.bookingRateData?.dateRate)
    const myArrayFiltered = RateData?.filter((el) => {
        return reservedRooms.some((f) => {
            return f.RoomID === el.ROOMID && f.SEL_MEAL === el.MealID;
        });
    });

    console.log('myArrayFiltered', myArrayFiltered);

    let newRateData = myArrayFiltered?.length > 0 && myArrayFiltered?.map(r => {
        let newObj = {
            BookingDate: r.Date,
            RoomID: r.ROOMID,
            RoomRate: r.ROOMRATE,
            ExtraAdultRate: r.EXTRAADULTRATE,
            ExtraChildRate: r.EXTRACHILDRATE,
            RatePlanId: r.RatePlanID
        }
        return newObj
    })
    console.log('RateData', newRateData);
    // console.log('reservedRooms', newArr);

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
    const [gTax, setGTax] = useState(0)
    const [holdInote, setHoldInote] = useState("")
    const [total_Adult, setTotal_Adult] = useState(0)
    const [total_Child, setTotal_Child] = useState(0)
    const [total_Infant, setTotal_Infant] = useState(0)
    const [netTotal, setNetTotal] = useState(0)
    const [gTotal, setGTotal] = useState(0)

    const [bookingError, setBookingError] = useState('')
    const [bookingResponse, setBookingResponse] = useState()
    const [spin, setSpin] = useState(false)
    const [selRooms, setSelRooms] = useState(reservedRooms.length > 0 && reservedRooms.every(r => r.SEL_ADULT > 0) ? reservedRooms : [])
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])

    const [showBookingDetails, setShowBookingDetails] = useState(false)
    const handleFinalModal = () => {
        setShowBookingDetails(!showBookingDetails)
    }

    // const reserveStore = useSelector(state => state.reserveSlice)
    const { iDate, oDate } = reserveStore
    console.log('reserveStoreinRoom', reservedRooms)
    const duration = (moment(oDate).diff(moment(iDate), 'days'))

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
                LoginID: 'LGID001',
                Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
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
                LoginID: 'LGID001',
                Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
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
                LoginID: 'LGID001',
                Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
                Seckey: "abc",
                Event: "select"
            }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            console.log('userDetail', userDetailResponse)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.UserID, label: `${userDetail.FirstName} : ${userDetail.Email}` }
            })
            setUserDetails(userDetailsOption)
            if (userDetails !== []) { setUserDetailsStatus(true) }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }



    const getExistBookedRoomData = () => {
        console.log('rrrrrrrraa', reservedRooms)
        let adult_occ = reservedRooms.every(r => r.SEL_ADULT > 0)
        if (reservedRooms.length > 0 && adult_occ) {
            console.log('rrrrrrrraa', reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_ADULT }, 0));
            let adult_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_ADULT }, 0)
            let child_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_CHILD }, 0)
            let infant_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_INFANT }, 0)
            setTotal_Adult(adult_count)
            setTotal_Child(child_count)
            setTotal_Infant(infant_count)
            let all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
            let all_tax = reservedRooms.reduce((acc, obj) => { return acc + obj.TAX }, 0)
            console.log('all_tax', all_tax)
            // let total_with_duration = all_net_total * duration
            // let total_with_duration_and_tax = total_with_duration + (all_tax * duration)
            let total_with_duration = duration === 0 ? all_net_total : all_net_total * duration
            let total_with_duration_and_tax = duration === 0 ? total_with_duration + all_tax : total_with_duration + (all_tax * duration)
            setNetTotal(all_net_total * duration)
            setGTax(all_tax)
            setGTotal(total_with_duration_and_tax)

            // if (discountAmount > 0 && discountType === "flat") {
            //     // let each_room_dis_amt = discountAmount / reservedRooms.length
            //     // console.log('disss', each_room_dis_amt)
            //     // let new_reservedRooms = reservedRooms.map(room => ({ ...room, "TOTAL": (room.TOTAL - each_room_dis_amt) }))
            //     // console.log('gggg', new_reservedRooms)
            //     // let all_net_total = new_reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
            //     // let all_tax = new_reservedRooms.reduce((acc, obj) => { return acc + (obj.TOTAL * (obj.IGST_P / 100)) }, 0)
            //     // console.log('all_tax', all_tax)
            //     let all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
            //     console.log('all_net_toatl', all_net_total)
            //     // let all_tax_percent_total = reservedRooms.reduce((acc, obj) => { return acc + obj.IGST_P }, 0)
            //     // let all_tax = all_net_total * (all_tax_percent_total / 100)
            //     let all_tax = ((all_net_total * duration) - discountAmount) * (reservedRooms[0].IGST_P / 100)
            //     let total_with_duration = (all_net_total * duration) - discountAmount
            //     let total_with_duration_and_tax = total_with_duration + (all_tax)
            //     setNetTotal((all_net_total * duration) - discountAmount)
            //     if (hasGst) {
            //         setGTax(all_tax)
            //         setGTotal(total_with_duration_and_tax)
            //     } else {
            //         setGTax(0)
            //         setGTotal(total_with_duration)
            //     }
            // } else if (discountAmount > 0 && discountType === "percentage") {
            //     let old_all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)

            //     let new_reservedRooms = reservedRooms.map(room => ({ ...room, "TOTAL": (room.TOTAL - (room.TOTAL * (Number(discount) / 100))) }))
            //     console.log('gggg', new_reservedRooms)
            //     let all_net_total = new_reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
            //     setDiscountAmount((old_all_net_total - all_net_total) * duration)
            //     let all_tax = new_reservedRooms.reduce((acc, obj) => { return acc + (obj.TOTAL * (obj.IGST_P / 100)) }, 0)
            //     console.log('all_tax', all_tax)
            //     let total_with_duration = all_net_total * duration
            //     console.log('total_with_duration', total_with_duration)
            //     let total_with_duration_and_tax = total_with_duration + (all_tax * duration)
            //     console.log('total_with_duration_and_tax', total_with_duration_and_tax)
            //     setNetTotal(all_net_total * duration)
            //     if (hasGst) {
            //         setGTax(all_tax * duration)
            //         setGTotal(total_with_duration_and_tax)
            //     } else {
            //         setGTax(0)
            //         setGTotal(total_with_duration)
            //     }
            // } else {
            //     let all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
            //     let all_tax = reservedRooms.reduce((acc, obj) => { return acc + obj.TAX }, 0)
            //     console.log('all_tax', all_tax)
            //     let total_with_duration = all_net_total * duration
            //     let total_with_duration_and_tax = total_with_duration + (all_tax * duration)
            //     setNetTotal(all_net_total * duration)
            //     if (hasGst) {
            //         setGTax(all_tax * duration)
            //         setGTotal(total_with_duration_and_tax)
            //     } else {
            //         setGTax(0)
            //         setGTotal(total_with_duration)
            //     }
            // }
        }
    }
    useEffect(() => {
        userDetailsData()
        getExistBookedRoomData()
    }, [userDetailsStatus, duration, selRooms])
    useEffect(() => {
        handleStateSets()
        getExistBookedRoomData()
    }, [reserveStore])
    const handleBooking = async (response) => {
        console.log('response', response);
        try {
            setLoader(true)
            setHoldLoader(true)
            setSpin(true)
            let bookingBody = {
                LoginID: 'LGID001',
                Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
                Seckey: "abc",
                OnHold: bookingOption === 'hold' ? "true" : "false",
                HotelId: 'HOTL20230303AA00001',
                Adult: total_Adult,
                Child: total_Child,
                OnlinePaymentRefId: response.PaymentFolioID,
                OTPVerification: "567890",
                bookingDetails: newArr,
                transactionDetails: [
                    {
                        CheckInDate: moment(reserveStore.iDate).format('YYYY-MM-DDThh:mm:ss'),
                        CheckOutDate: moment(reserveStore.oDate).format('YYYY-MM-DDThh:mm:ss'),
                        BookingSourceID: 'BSID20231229AA00005',
                        SourceTypeID: 'STID20231229AA00010',
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
                        PendingAmount: (amount - pamt),
                        RecievedAmount: +pamt,
                        CustID: reserveStore.customerId,
                        PaymentReferenceText: pref
                    }
                ],
                guestDetails: [
                    {
                        Name: reserveStore.GuestFName,
                        LastName: reserveStore.GuestLName,
                        Prefix: '',
                        Mobile: reserveStore.GuestMobileNo,
                        Email: reserveStore.GuestMail,
                        IDProofType: '',
                        NameAsPerIDProof: '',
                        IDProofNumber: '',
                        IDProofScanCopyURL: '',
                        CountryId: '',
                        StateId: '',
                        CityId: '',
                    }
                ],
                bookingRateDetails: newRateData
            }
            setBookingError('')
            console.log('bookingBody', bookingBody)
            console.log('bookingBody json', JSON.stringify(bookingBody))

            const res = await axios.post(`/IBE/save/bookingData`, bookingBody)
            const responseData = res?.data[0]
            console.log("bookingBody", responseData)
            toast.success("Booked!!!", { position: 'top-center' })
            store.dispatch(
                setBookingRate({})
            )
            location.reload()
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
        // handleBooking()
        setLoader(false)
        // if (bookingOption === 'confirm' && pstatus && ctype && booker && booker !== '0') {
        //     setShowBookingDetails(true)
        // } else if (bookingOption === 'confirm' && pstatus && ctype && booker === '0' && newBooker !== '') {
        //     handleBooking()
        //     setLoader(false)
        //     setShowBookingDetails(true)
        // } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && (cname && cgst && cadd !== '') && booker && booker !== '0') {
        //     handleBooking()
        //     setLoader(false)
        //     setShowBookingDetails(true)
        // } else if (bookingOption === 'confirm' && pstatusName === "Bill to Company" && (cname && cgst && cadd !== '') && booker === '0' && newBooker !== '') {
        //     handleBooking()
        //     setLoader(false)
        //     setShowBookingDetails(true)
        // }
        // if (bookingOption === 'hold' && holdInote) {
        //     handleBooking()
        //     setHoldLoader(false)
        //     setShowBookingDetails(true)
        // }

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

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src

            script.onload = () => {
                resolve(true)
            }

            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script)
        })
    }
    const displayRazorpay = async (amount) => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
            alert('You are offline...Failed to load Razorpay SDK')
            return
        }

        const options = {
            key: RAZOR_KEY,
            currency: "INR",
            amount: gTotal * 100,
            description: "Thanks for paying",

            handler: function (response) {
                console.log('response', response);
                const objBody = {
                    Status: 'Active',
                    //   PaymentLinkID:lnk,
                    PaymentFolioID: response.razorpay_payment_id,
                    PaymentResponseJSON: "Status\":\"Success"

                }
                console.log("Successs", objBody);
                handleBooking(objBody)
                console.log("OBJBODY", objBody)

            },
            prefill: {
                name: "Piyush Garg",
                email: "youremail@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }


    return (
        <>
            {console.log('pstatus', pstatusName)}
            <Col className='col-md-12 col-12 p-2'>
                <Col className=' bg-light rounded p-2'>
                    <h3 className='text-center'>Summary</h3>
                    <hr />
                    <Row className='flex-column-reverse flex-sm-row'>
                        <Col className='col-sm-4 col-12'>
                            <div className='py-1 ps-sm-1'>Guest Name: {reserveStore.guestFName}{reserveStore.guestLName}  </div>
                            <div className='py-1 ps-sm-1'>Email Id: {reserveStore.guestMail} </div>
                            <div className='py-1 ps-sm-1'>Mobile Number: {reserveStore.guestMobileNo} </div>
                            <div className='py-1 ps-sm-1'>Total Room: {reservedRooms.length > 0 && reservedRooms.every(r => r.SEL_ADULT > 0) ? reservedRooms.length : []} </div>
                            <div className='py-1 ps-sm-1'>Total Night's: {duration} </div>

                            {/* <div className='py-1 ps-sm-1'>
                                <h6>Apply GST</h6>
                                <div className='form-switch d-flex flex-row ps-0 align-items-center'>
                                    <Label for='repair_no' className='form-check-label'>
                                        No
                                    </Label>
                                    <Input
                                        className='m-1'
                                        type='switch'
                                        name='primary'
                                        id='gstToggle'
                                    // checked={hasGst}
                                    // onChange={e => handleHasGST(e)}
                                    />
                                    <Label for='reapir_yes' className='form-check-label'>
                                        Yes
                                    </Label>
                                </div>
                            </div>
                            <div className='py-1 ps-sm-1'>Total GST: </div> */}
                            {/* {console.log('discountgTotal', discountAmount)} */}
                            {/* {discountAmount && discountAmount > 0 ? <div className='py-1 ps-sm-1'>Total Discount Amount: ₹ {discountAmount.toFixed(2)}</div> : <></>} */}


                        </Col>
                        <Col className='col-sm-4 col-12'>
                            <div className='py-1 ps-sm-1'>Total Adults: {total_Adult} </div>
                            <div className='py-1 ps-sm-1'>Total Childrens: {total_Child} </div>
                            <div className='py-1 ps-sm-1'>Total Infants: {total_Infant} </div>
                            <div className='py-1 ps-sm-1'>Total Net Cost: ₹ {netTotal} </div>
                            <div className='py-1 ps-sm-1'>Total GST: ₹ {gTax.toFixed(2)}</div>
                            <div className='py-1 ps-sm-1 text-nowrap'>Payable Amount: ₹ {gTotal.toFixed(2)}

                            </div>
                            {/* <div className='mb-2'>
                                <Label>Discount Type</Label>
                                <Select
                                    // isDisabled={netTotal === 0}
                                    menuPlacement='auto'
                                    menuPortalTarget={document.body}
                                    theme={selectThemeColors}
                                    className='react-select discountTypeDropdown'
                                    classNamePrefix='select'
                                />
                            </div> */}

                        </Col>
                        <Col className='col-sm-4 col-12'>
                            <div className='mb-1'>
                                <Label>Promo / Coupon Code</Label>
                                <Input
                                    className='discountField'
                                    type='number'
                                    max={100}
                                    // value={discount}
                                    placeholder='Enter Promo'
                                // onChange={e => setDiscount(e.target.value)}
                                // disabled={disabled || netTotal === 0}
                                />
                            </div>
                            <div className='text-center pt-1'>
                                <div className="d-sm-flex">
                                    {
                                        <>
                                            <Button.Ripple color='success' onClick={() => {
                                                if (prevDiscount !== discount) {
                                                    handleDiscount()
                                                }
                                            }}>Apply</Button.Ripple>
                                            <Button.Ripple className='ms-1' color='danger' onClick={() => {
                                                handleRemoveDiscount()
                                            }}>X</Button.Ripple>
                                        </>
                                    }
                                </div>
                            </div>
                        </Col>
                        {/* <Col className='col-sm-6 col-12'> */}

                        {/* </Col> */}
                        <Col className='col-sm-12 col-12 mt-4'>
                            <div className='mt-1 d-flex justify-content-between'>
                                <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
                                    <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                    <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                                </Button>
                                <Button type='submit' color='primary' onClick={() => displayRazorpay()} className='btn-next'>
                                    <span className='align-middle d-sm-inline-block d-none'>
                                        {/* Create Booking */}
                                        {
                                            "Pay Now"
                                        }
                                    </span>
                                    <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Col >

            {showBookingDetails ? <NewBookingDetailPreview bookingOption={bookingOption} BookingError={bookingError} bookingResponse={bookingResponse} handleFinalModal={handleFinalModal} showBookingDetails={showBookingDetails} dispose={dispose} /> : <></>}
        </>
    )
}

export default BKNewConfimationFinal