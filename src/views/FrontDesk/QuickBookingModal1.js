import { React, useEffect, useRef, useState } from 'react'
import { Badge, Col, Form, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'

// ** Third Party Components
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import { Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Store & Actions
import { store } from '@store/store'

import { setCheckInDate, setCheckOutDate, setCustomerIdStore, setGuestDetailDropdownStore, setLoaderStore, setRoomsAvailViewStore, setSourceTypeStore, setBookingSourceDropdownStore } from "../../redux/quickBookingSlice"
import { setBookingID, disposeStore, setPaymentTypeStore, setPaymentModeStore, setBookingCreatedByStore, setPaymentTypeDropdownStore, setPaymentModeDropdownStore, setRoomsBooked, setPrice, setBookingDetailStore, setBookingSourceStore, setBookingResponse } from "../../redux/quickBookingSlice"

import { useDispatch } from "react-redux"
import axios from '../../API/axios'

// ** Reactstrap Imports
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Input } from 'reactstrap'
import { Button, FormFeedback, Spinner } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'

import { ArrowRight, Edit3 } from 'react-feather'

import ReactSlider from "react-slider";
import toast from 'react-hot-toast'
import RegisterGuest from '../SingleReservation/RegisterGuest'
import RegisterAgency from '../SingleReservation/RegisterAgency'
import BookingModal from './BookingModal'
import QuickBookingDetailPreview from './QuickBookingDetailPreview'
import EditGuest from '../SingleReservation/EditGuest'

const discountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'flat', label: 'Flat' }
]
const defaultValues = {
    bookingSource: '',
    sourceType: '',
    guestDetails: '',
    specialNote: '',
    cType: '',
    ptype: '',
    booker: '',
    pref: '',
    inote: '',
    cname: '',
    newBooker: ''
}

const QuickBookingModal1 = ({ open, handleOpen, handleModalOpen }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    //common state values
    const [loader, setLoader] = useState(false);
    // const userId = LoginID;
    const dispatch = useDispatch()

    //fetch redux data from bookingDetails
    const quickBookingStore = useSelector(state => state.bookingDetails)
    const [roomDetails, setRoomDetails] = useState(quickBookingStore?.roomData || {})

    //dates ref and state values
    const outDateRef = useRef(null)
    const [inDate, setInDate] = useState("");
    const [outDate, setOutDate] = useState("");
    const [duration, setDuration] = useState(1);
    const [currentValue, setCurrentValue] = useState(1);

    //selected room 
    const [selectedRoom, setSelectedRoom] = useState({})
    const [selectedMealId, setSelectedMealId] = useState("")
    console.log('selectedMealId', selectedMealId);
    // const [selectedRoomId,setSelectedRoomId] = useState(quickBookingStore?.roomData?.RoomID||"")

    const [mealsList, setMealsList] = useState([])

    const [discount, setDiscount] = useState(0)
    const [discountType, setDiscountType] = useState()
    const [discountAmount, setDiscountAmount] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [cost, setCost] = useState(0)
    const [netCost, setNetCost] = useState(0)
    const [gst, setGst] = useState(0)
    const [total, setTotal] = useState(0)
    const [payFull, setPayFull] = useState("");
    const [cgst, setCgst] = useState(0)
    const [amount, setAmount] = useState("")

    const usePrevious = (value) => {
        const ref = useRef()
        useEffect(() => {
            ref.current = value
        }, [value])

        return ref.current
    }
    const prevDiscount = usePrevious(discount)

    // const sourceTypesError = [{ label: 'Please Select Booking Source' }]

    const [bookingSourceOptions, setBookingSourceOptions] = useState([])
    const [guestDetailOptions, setGuestDetailOptions] = useState([])
    const [mealsOptions, setMealsOptions] = useState([])
    const [sourceTypes, setSourceTypes] = useState([])
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])


    //** For New User Registeration
    const [bookingSourceId, setBookingSourceId] = useState('')
    const [selGuestDetail, setSelGuestDetail] = useState('')
    const [note, setNote] = useState('')
    const [showErrors, setShowErrors] = useState(false);
    const [dropdownLoader, setDropdownLoader] = useState(false);
    const [status, setStatus] = useState(true)
    const [sourceType, setSourceType] = useState([])

    const [updated, setUpdated] = useState(false)
    const [adult, setAdult] = useState(0)
    const [children, setChildren] = useState(0)
    const [infant, setInfant] = useState(0)
    const [meal, setMeal] = useState()
    const [mealId, setMealId] = useState()
    const [ratePlans, setRatePlans] = useState([])
    const [pstatus, setPstatus] = useState('')
    const [cname, setCname] = useState('')
    const [cadd, setCadd] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [guestOptions, setGuestOptions] = useState([])

    const [newRatePlans, setNewRatePlans] = useState([])
    const [dateRate, setDateRate] = useState([])
    const [selNewRate, setSelNewRate] = useState([])
    const [actualRate, setActualRate] = useState(0)

    const [openg, setOpeng] = useState(false)
    const handleOpeng = () => setOpeng(!openg)

    const [openAgency, setOpenAgency] = useState(false)
    const handleOpenAgency = () => setOpenAgency(!openAgency)

    const [openBookModal, setOpenBookModal] = useState(false)
    const handleBookModal = () => setOpenBookModal(!openBookModal)
    const [newBID, setNewBID] = useState('')

    const [editGuest, setEditGuest] = useState(false)
    const handleEditGuest = () => setEditGuest(!editGuest)

    const [hStatus, setHstatus] = useState([])
    const [hasGst, setHasGst] = useState(true)

    const bookingSourceDropDown = quickBookingStore.bookingSourceDropdown_store;
    const guestDetailDropDown = quickBookingStore.guestDetailDropdown_store;
    const drop_downLoader = quickBookingStore.loader_store;
    const paymentTypeDropDown = quickBookingStore.paymentTypeDropdown_store
    const roomData = quickBookingStore.roomData


    // yup schema for form hook
    const QuickBookingSchema = yup.object().shape({
        // bookingSource: yup.string().required(),
        // sourceType: yup.string().required(),
        // guestDetails: yup.object().required(),
        // specialNote: yup.string().required(),

        // paymentStatus: yup.string().required(),
        // collectionType: yup.string(),
        // paymentType: yup.string(),
        // collectedAmount: yup.string(),
        // paymentReference: yup.string().required(),
        // internalNote: yup.string(),
        // companyGst: yup.string(),
        // companyName: yup.string(),
        // companyAdd: yup.string(),
        // bookedBy: yup.object(),
        // // bookerName: yup.string()
    })

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(QuickBookingSchema)
    })



    // const pstatus = watch("paymentStatus")
    const cType = watch("collectionType")
    const ptype = watch("paymentType")
    const pref = watch("paymentReference")
    const inote = watch("internalNote")
    // const cname = watch("companyName")
    // const cadd = watch("companyAdd")
    const booker = watch("boookedBy")
    const newBooker = watch("bookerName")

    const [roomRates, setRoomRates] = useState([])
    const getRoomRates = async (ind, outd) => {
        try {
            let inDate = moment(ind).format('L')
            let outDate = moment(outd).format('L')
            console.log('indate', inDate)
            console.log('outdate', outDate)
            const bookingsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CheckInDate: inDate,
                CheckOutDate: outDate
            }
            console.log(bookingsBody)
            axios.post(`/getdata/bookingdata/roomavailability`, bookingsBody).then(response => {
                setRoomRates(response?.data[2])
                console.log("Room Rates res", response)
            })
        } catch (error) {
            console.log('error', error)
        }
    }

    const [selRoomRates, setSelRoomRates] = useState([])
    const getSelRoom_RoomRates = () => {
        let rid = quickBookingStore?.roomData?.RoomID
        let newArr = roomRates.filter(j => j.ROOMID === rid)
        setSelRoomRates(newArr)
    }

    const getNewRoomRate = async () => {
        console.log('dates', moment(quickBookingStore?.checkInDate).format('MM-DD-YYYY'), moment(quickBookingStore?.checkOutDate).format('MM-DD-YYYY'))
        try {
            let obj = {
                fromDate: moment(quickBookingStore?.checkInDate).format('MM-DD-YYYY'),
                toDate: outDate !== '' ? moment(quickBookingStore?.checkOutDate).format('MM-DD-YYYY') : moment(new Date(quickBookingStore?.checkInDate).fp_incr(1)).format('MM-DD-YYYY'),
                roomID: roomDetails?.RoomID
            }
            // const res = await axios.post(`/booking/GetRoomRate`, obj, {
            const res = await axios.post(`/bookingv2/getroomrate`, obj, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('newRateres', outDate, typeof outDate, res)
            let result = res?.data[0]
            let arr = result.map(r => {
                return { value: r.RatePlanID, label: r.RatePlanID, ...r }
            })
            setNewRatePlans(arr)
            setSelNewRate(arr[0])
            setMealId(arr[0]?.MealID)
            setActualRate(arr[0]?.ROOMRATE)
            setDateRate(res?.data[1])
        } catch (error) {
            console.log('new rate error', error)
        }
    }

    const handleHouseKeepingStatus = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: 'abc',
                Event: "selectone",
                FloorID: roomData?.FloorID
            }
            const res = await axios.post(`/housekeeping`, obj)
            console.log('houseres', res)
            setHstatus(res?.data[0])
            // if (res?.data[0]?.ClosedDueToMaintenance === 'Yes' || res?.data[0]?.RoomStatus === "Occupied") {
            //     setIsAvail(false)
            // } else {
            //     setIsAvail(true)
            // }
        } catch (error) {
            console.log('houseKeepingError', error)
        }
    }

    //Initial function calls
    useEffect(() => {
        setShowErrors(false);
        reset();
        getRoomRates(quickBookingStore?.checkInDate, quickBookingStore.checkInDate.fp_incr(1))
        setInDate(quickBookingStore?.checkInDate);
        setOutDate(new Date(quickBookingStore?.checkInDate).fp_incr(1))
        setRoomDetails(quickBookingStore?.roomData)
        mealsDetail();
        setDiscount(0);
        setAmount(quickBookingStore.total);
        setPayFull("Yes")
        setBookingSourceId("");
        setSelGuestDetail("")
        handleSourceType('reload')
        handlePaymentType('reload')
        userDetailsData()
    }, [open])

    useEffect(() => {
        handleHouseKeepingStatus()
    }, [roomData])

    useEffect(() => {
        getSelRoom_RoomRates()
    }, [roomRates])

    useEffect(() => {
        getRoomData()
        getNewRoomRate()
    }, [roomDetails, outDate])

    useEffect(() => {
        handlePaymentMode('reload')
    }, [ptype])

    useEffect(() => {
        store.dispatch(setPrice({ cost, gst, total, discount }))
    }, [total])

    //if both indate and outdate is set get selected Room details from the api.
    useEffect(() => {
        // setLoader(true)
        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDuration(diffDays);
        setCurrentValue(Number(diffDays))
        console.log("diffDays", diffDays)
        store.dispatch(setCheckInDate(inDate))
        store.dispatch(setCheckOutDate(outDate))
        getRoomData()
        getRoomRates(inDate, outDate)
    }, [inDate, outDate])

    useEffect(() => {
        updateRoom()
    }, [selectedRoom, actualRate])

    useEffect(() => {
        const bookingSourceOptions = bookingSourceDropDown?.length > 0 && bookingSourceDropDown[0].BookingSource ? bookingSourceDropDown?.map(function (book) {
            return { value: book.BookingSourceID, label: book.BookingSource }
        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }];
        setBookingSourceOptions(bookingSourceOptions)
    }, [bookingSourceDropDown])

    // useEffect(() => {
    //     const guestDetailOptions = guestDetailDropDown?.length > 0 && guestDetailDropDown[0].GuestName ? guestDetailDropDown?.map(function (guest) {
    //         return { value: guest?.GuestID, label: `${guest.GuestName} : ${guest.GuestEmail} : ${guest.GuestMobileNumber}` }
    //     }) : [{ value: 'reload', label: 'Error loading, click to reload again' }];
    //     setGuestDetailOptions(guestDetailOptions)
    // }, [guestDetailDropDown])

    useEffect(() => {
        const sourceTypes = sourceType?.map(function (sourceType) {
            return { value: sourceType?.SourceTypeID, label: sourceType?.SourceType }
        })
        setSourceTypes(sourceTypes)
    }, [sourceType])

    useEffect(() => {
        const PaymentTypeDropDown = paymentTypeDropDown?.slice(1, paymentTypeDropDown.length)
        const paymentTypeOptions = PaymentTypeDropDown?.length > 0 && PaymentTypeDropDown[0].PaymentType ? PaymentTypeDropDown?.map(function (payment) {
            return { value: payment?.PaymentTypeID, label: payment?.PaymentType }
        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]
        setPaymentTypeOptions(paymentTypeOptions);
    }, [paymentTypeDropDown])

    useEffect(() => {
        setOutDate(new Date(inDate).fp_incr(1))
    }, [inDate])



    //fetch selectedRoom data.
    const getRoomData = async () => {
        try {
            const bookingsBody = {
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                // CheckInDate: moment(inDate).format(),
                CheckInDate: inDate,
                // CheckOutDate: moment(outDate).format()
                CheckOutDate: outDate
            }
            await axios.post(`/getdata/bookingdata/roomavailability`, bookingsBody).then(response => {
                store.dispatch(setRoomsAvailViewStore(response?.data[0]))
                setRoomData(response?.data[0])
                console.log("Select Rooms api", response)
                let result = res?.data[1]
                let rates = result?.map(function (meals) {
                    return { value: meals.PlanRate, label: `${meals.RatePlanID} - ${meals.MealType}`, ...meals }
                })
                let finalRates = rates.filter(r => r.Status === "Active")
                setRatePlans(finalRates)
            })

        } catch (error) {
            console.log("Bookings Error :", error)
        }
    }

    const handleRemoveDiscount = () => {
        setTotal(cost + gst)
        setDiscount(0)
        setDisabled(false)
        setDiscountAmount(0)
    }
    //selected room data function.
    const no_of_person_options = (value) => {
        let arr = []
        for (let i = 0; i <= value; i++) {
            arr.push({ value: i, label: `${i}` })
        }
        return arr
    }

    const setRoomData = (rooms) => {
        let roomID = quickBookingStore?.roomData.RoomID;
        // let roomID = "RDT004"
        console.warn("roomIDDetails", roomID)
        let room = rooms?.find(room => room.RoomID == roomID);
        console.warn("roomIDDetails", room)

        console.warn("roomDetails.RoomID", roomDetails)
        console.log("selectedRoom", room)
        var roomObj = {};
        if (room) {
            const gstAmount = room.RoomRate * room.IGST_P / 100
            roomObj = {
                roomID: room.RoomID,
                roomCat: room.RoomDisplayName,
                adultsAllowed: room.AdultMax,
                infantAllowed: room.InfantMax,
                childrenAllowed: room.ChildMax,
                // price: room.RoomRate,
                price: actualRate,
                gst: gstAmount,
                gst_percentage: room.IGST_P,
                adult_occ: room.AdultBase,
                child_occ: 0,
                infant_occ: 0,
                selected_meal: '',
                selected_meal_price: 0,
                extra_adult_price: 0,
                per_extra_adult_price: room.ExtraAdultPrice,
                extra_child_price: 0,
                per_extra_child_price: room.ExtraChildPrice,
                adultBase: room.AdultBase,
                childBase: room.ChildBase,
                total_price: room.RoomRate
            }
            setAdult(1);
            setChildren(0);
        }
        setSelectedRoom(roomObj)

    }

    const updateRoom = () => {
        // const total = selectedRoom.price + selectedRoom.extra_adult_price + selectedRoom.extra_child_price + selectedRoom.selected_meal_price;
        const total = actualRate + selectedRoom.extra_adult_price + selectedRoom.extra_child_price
        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        selectedRoom.total_price = total
        const totalOneDayCost = total
        const totalCost = totalOneDayCost * diffDays
        const totalGst = totalOneDayCost * Number(selectedRoom.gst_percentage) / 100
        // const totalGst = Number(selectedRoom.gst)        
        const totalAmount = totalCost + totalGst
        setCost(totalCost)
        setNetCost(totalCost)
        setGst(totalGst)
        if (hasGst) {
            setTotal(totalAmount)
            setAmount(totalAmount)
        } else {
            setTotal(totalCost)
            setAmount(totalCost)
        }
        // setTotal(totalAmount)
        // setAmount(totalAmount)

        if (discountAmount > 0) {
            if (discountType === 'flat') {
                const disAmount = Number(discount)
                const netAmount = totalCost - disAmount
                const newGst = netAmount * (selectedRoom.gst_percentage / 100)
                setNetCost(netAmount)
                if (hasGst) {
                    setGst(newGst)
                    setTotal(netAmount + newGst)
                    setAmount(netAmount + newGst)
                    store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: disAmount }))
                } else {
                    setGst(0)
                    setTotal(netAmount)
                    setAmount(netAmount)
                    store.dispatch(setPrice({ cost: netAmount, gst: 0, total: netAmount, discount: disAmount }))
                }
                setDiscountAmount(disAmount)
                // store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: disAmount }))
            } else if (discountType === 'percentage') {
                const dicAmount = (totalCost * (Number(discount) / 100))
                setDiscountAmount(dicAmount)
                const netAmount = totalCost - dicAmount
                const newGst = netAmount * (selectedRoom.gst_percentage / 100)
                setNetCost(netAmount)
                if (hasGst) {
                    setGst(newGst)
                    setTotal(netAmount + newGst)
                    setAmount(netAmount + newGst)
                    store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: dicAmount }))
                } else {
                    setGst(0)
                    setTotal(netAmount)
                    setAmount(netAmount)
                    store.dispatch(setPrice({ cost: netAmount, gst: 0, total: netAmount, discount: dicAmount }))
                }
                console.log(dicAmount)
                // store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: dicAmount }))
            }
        } else {
            store.dispatch(setPrice({ cost: totalCost, gst: totalGst, total: totalAmount, discount: 0 }))
        }
    }


    const handleDiscount = () => {
        if (discountType === 'flat') {
            const disAmount = Number(discount)
            const netAmount = cost - disAmount;
            const total = netAmount + gst;
            setTotal(total)
            setDisabled(true)
            setDiscountAmount(disAmount)
            store.dispatch(setPrice({ cost, gst, total, disAmount }))
        } else if (discountType === 'percentage') {
            const disAmount = (cost * (Number(discount) / 100))
            const total = (cost - disAmount) + gst
            setDiscountAmount(disAmount)
            setTotal(total)
            setDisabled(true)
            store.dispatch(setPrice({ cost, gst, total, disAmount }))
        } else {
            toast.error('Select Discount Type first')
        }
    }

    const handleGetPrice = (price) => {
        setUpdPrice(price)
        console.log(updPrice)
    }

    const guestDetail = async () => {
        try {
            const guestDetailBody = { LoginID: LoginID, Token: Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            console.log("Guest Data-", guestResponse?.data[0])
            store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))
        } catch (error) {
            console.log("Guest Detail Error", error.message)
        }
    }

    const handleHasGST = e => {
        if (e.target.checked) {
            setHasGst(true)
        } else {
            setHasGst(false)
        }
    }

    const handleGuestOptions = async () => {
        try {
            const guestDetailBody = { LoginID, Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const res = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            console.log("Guest data - OK > ", res)
            let result = res?.data[0]
            let arr = result.map(r => {
                return { value: r?.GuestID, label: `${r.GuestName} : ${r.GuestEmail} : ${r.GuestMobileNumber}`, ...r }
            })
            setGuestOptions(arr)
        } catch (error) {
            console.log('guesterror', error)
        }
    }

    // const mealsDetails = async () => {
    //     try {
    //         // const mealsBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
    //         const response = await axios.post(`/getdata/mealdetails`, mealsBody)
    //         setMealsList(response?.data[0]);
    //         const mealsOptions = response?.data[0]?.map(function (meals) {
    //             return { value: meals.MealID, label: meals.MealDisplayName }
    //         })
    //         setMealsOptions(mealsOptions)
    //         setSelectedMealId(mealsOptions[0].value)
    //         console.log("MEALS", response?.data[0])
    //     } catch (error) {
    //         console.log("Meals Error", error.message)
    //     }
    // }
    const mealsDetail = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "RatePlan",
                Status: "Active",
                RoomID: quickBookingStore?.roomData.RoomID
            }
            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            console.log('rate res', res)
            if (res.data[0].length > 0) {
                const mealsOptions = res?.data[0]?.map(function (meals) {
                    return { value: meals.PlanRate, label: `${meals.RatePlanID} - ${meals.MealType}`, ...meals }
                })
                setMealsOptions(mealsOptions)
                setSelectedMealId(mealsOptions[0].MealID)
            }
        } catch (error) {
            console.log('error', error)
        }
        // try {
        //     const mealsBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
        //     const response = await axios.post(`/getdata/mealdetails`, mealsBody)
        //     setMealsList(response?.data[0]);
        //     const mealsOptions = response?.data[0]?.map(function (meals) {
        //         return { value: meals.MealID, label: meals.MealDisplayName }
        //     })
        //     setMealsOptions(mealsOptions)
        //     setSelectedMealId(mealsOptions[0].value)
        //     console.log("MEALS", response?.data[0])
        // } catch (error) {
        //     console.log("Meals Error", error.message)
        // }
    }

    const handleGuestDetail = async (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const guestDetailBody = { LoginID: LoginID, Token: Token, Seckey: "abc", SearchPhrase: "abc", Event: "select" }
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
        setSelGuestDetail(value)
        store.dispatch(setCustomerIdStore(value))
    }


    // const bookingSource = async () => {
    //     try {
    //         console.log("booking source")
    //         const bookinSourceBody = { LoginID: LoginID , Token: Token, Seckey: "abc", Event: "select" }
    //         await axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody).then(response => {
    //             console.log("response?.data[0]",response)
    //             store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
    //             setDropdownLoader(false)
    //             store.dispatch(setLoaderStore(dropdownLoader))
    //         })

    //     } catch (error) {
    //         setDropdownLoader(false)
    //         store.dispatch(setLoaderStore(dropdownLoader))
    //         console.log("Booking Source", error.message)
    //     }
    // }
    const handleSourceType = async (value) => {
        if (value === 'reload') {
            console.log('need to ', value)
            setDropdownLoader(true)
            try {
                const bookinSourceBody = { LoginID, Token, Seckey: "abc", Event: "select" }
                const response = await axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody)
                if (response?.data[0]) {
                    store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
                    setDropdownLoader(false)
                    store.dispatch(setLoaderStore(dropdownLoader))
                }
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Booking Source", error.message)
            }
            return
        }

        setBookingSourceId(value);
        try {
            const sourceTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                BookingSourceID: value,
                Event: "select"
            }
            const response = await axios.post('/getdata/bookingdata/sourcetype', sourceTypeBody)

            if (response?.data[0]) {
                let data = response?.data[0]
                const opt = data.map(t => {
                    return { value: t.SourceTypeID, label: t.SourceType }
                })
                setSourceType(opt)
            } else {
                setSourceType([{ value: 'reload', label: 'Please reload' }])
            }

        } catch (error) {
            console.log("State Error", error.message)
        }
        store.dispatch(setBookingSourceStore(value))
    }

    const handlePaymentType = async (value) => {
        if (value === 'reload') {
            console.log('handlePaymentType ', value)
            setDropdownLoader(true)
            try {
                const paymentTypeBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
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
    }

    const handlePaymentMode = async (value) => {
        if (value === 'reload') {
            console.log('handlePaymentMode ', ptype)
            setDropdownLoader(true)
            try {
                const paymentModeBody = { LoginID: LoginID, Token: Token, Seckey: "abc", PaymentTypeID: ptype, Event: "select" }
                axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
                    .then(paymentModeResponse => {
                        setDropdownLoader(false)
                        store.dispatch(setPaymentModeDropdownStore(paymentModeResponse?.data[0]))
                        store.dispatch(setLoaderStore(dropdownLoader))
                        console.warn("paymentModeResponse?.data[0]", paymentModeResponse?.data[0])
                        const paymentModeOptions = paymentModeResponse ? paymentModeResponse?.data[0]?.map(function (paymentMode) {
                            return { value: paymentMode?.PaymentModeID, label: paymentMode?.PaymentMode }
                        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

                        setPaymentModeOptions(paymentModeOptions)
                    })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Payment Mode Error", error.message)
            }
        }
        store.dispatch(setPaymentModeStore(value))
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
            const userDetailsBody = { LoginID, Token, Seckey: "abc", Event: "select" }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.UserID, label: `${userDetail.FirstName} : ${userDetail.Email}` }
            })
            setUserDetails(userDetailsOption)
            // if (userDetails !== []) { setUserDetailsStatus(true) }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }

    const onSubmit = () => {
        console.log("submit")
        setShowErrors(true);
        // store.dispatch(setBookingDetailStore(bookingData))
        store.dispatch(setPrice({ cost, gst, total, discount }))
        handleBooking();

    }

    const handleBooking = async () => {
        try {
            setLoader(true)
            let bookingDetail = [{
                "RoomID": selectedRoom.roomID,
                "Adult": adult,
                "Children": children,
                "Infant": infant,
                "MealID": selectedMealId
            }];
            const bookingBody = {
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                // bookingDetails: quickBookingStore.bookingDetail_store,
                bookingDetails: bookingDetail,
                transactionDetails: [
                    {
                        CheckInDate: moment(quickBookingStore.checkInDate).format('YYYY-MM-DDThh:mm:ss'),
                        CheckOutDate: moment(quickBookingStore.checkOutDate).format('YYYY-MM-DDThh:mm:ss'),
                        BookingSourceID: quickBookingStore.bookingSource_store,
                        SourceTypeID: quickBookingStore.sourceType_store,
                        isCompany: pstatus === 'Bill to Company' ? 1 : 0,
                        CompanyGST: cgst,
                        CompanyName: cname,
                        CompanyAddress: cadd,
                        PaymentTypeID: quickBookingStore.paymentType_store,
                        PaymentModeID: quickBookingStore.paymentMode_store,
                        BookingCreatedBy_UserID: quickBookingStore.bookingCreatedBy_store,
                        isFullPaid: payFull === 'Yes' ? 1 : 0,
                        InternalNote: inote === undefined ? '' : inote,
                        SpecialNote: note
                    }
                ],
                paymentDetails: [
                    {
                        PaymentTypeID: quickBookingStore.paymentType_store,
                        PaymentModeID: quickBookingStore.paymentMode_store,
                        isFullPaid: payFull === "Yes",
                        RoomAmount: cost,
                        Discount: discount,
                        CGST: 0,
                        SGST: 0,
                        IGST: 0,
                        TotalTax: gst,
                        TotalAmount: total,
                        PendingAmount: total - +amount,
                        RecievedAmount: amount,
                        CustID: quickBookingStore.customerId_store
                    }
                ]
            }
            // setBookingError('')
            console.log('bookingBody', bookingBody)
            console.log('bookingBody json', JSON.stringify(bookingBody))
            if (pstatus && cType && booker && booker !== '0') {
                const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                const responseData = res.data[0]
                console.log("Booking Response", responseData)
                if (responseData[0]?.BookingMapID) {
                    toast.success("Booked!!!", { position: 'top-center' })
                    store.dispatch(setBookingID(responseData.BookingMapID));
                    store.dispatch(setBookingResponse(responseData))
                    setNewBID(responseData.BookingMapID)
                    handleBookModal()
                    // handleOpen();                
                } else {
                    toast.error("Error while booking!!!", { position: 'top-center' })
                    // TODO - Error Booking
                    // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                }
            } else if (pstatus && cType && booker === '0' && newBooker !== '') {
                const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                const responseData = res.data[0]
                console.log("Booking Response", responseData)
                if (responseData[0]?.BookingMapID) {
                    toast.success("Booked!!!", { position: 'top-center' })
                    store.dispatch(setBookingID(responseData.BookingMapID));
                    store.dispatch(setBookingResponse(responseData))
                    setNewBID(responseData.BookingMapID)
                    handleBookModal()
                    // handleOpen();                
                } else {
                    toast.error("Error while booking!!!", { position: 'top-center' })
                    // TODO - Error Booking
                    // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                }
            } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker && booker !== '0') {
                const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                const responseData = res.data[0]
                console.log("Booking Response", responseData)
                if (responseData[0]?.BookingMapID) {
                    toast.success("Booked!!!", { position: 'top-center' })
                    store.dispatch(setBookingID(responseData.BookingMapID));
                    store.dispatch(setBookingResponse(responseData))
                    setNewBID(responseData.BookingMapID)
                    handleBookModal()
                    // handleOpen();                
                } else {
                    toast.error("Error while booking!!!", { position: 'top-center' })
                    // TODO - Error Booking
                    // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                }
            } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker === '0' && newBooker !== '') {
                const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                const responseData = res.data[0]
                console.log("Booking Response", responseData)
                if (responseData[0]?.BookingMapID) {
                    toast.success("Booked!!!", { position: 'top-center' })
                    store.dispatch(setBookingID(responseData.BookingMapID));
                    store.dispatch(setBookingResponse(responseData))
                    setNewBID(responseData.BookingMapID)
                    handleBookModal()
                    // handleOpen();                
                } else {
                    toast.error("Error while booking!!!", { position: 'top-center' })
                    // TODO - Error Booking
                    // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                }
            }

            setLoader(false)
        } catch (error) {
            console.log("Booking Error", error)
            toast.error("Something went WRONG!")
            // setBookingError(error.message)
            setLoader(false)
        }
    }

    useEffect(() => {
        handleGuestOptions()
    }, [openg, editGuest])

    useEffect(() => {
        updateRoom()
    }, [discountAmount, hasGst])

    return (
        <>
            {console.log('pstatus', pstatus)}
            {console.log('hstatus', hStatus)}
            <Modal isOpen={open} toggle={handleOpen} className='modal-dialog-centered modal-xl' backdrop={false}>
                <ModalHeader toggle={handleOpen}>
                    Quick Booking Form
                    {
                        hStatus[0]?.closedDueToMaintenance === "Yes" ? (
                            <span className='text-danger'>(Closed Due to Maintenance)</span>
                        ) : null
                    }
                    {/* {
                        hStatus[0]?.RoomStatus === 'Occupied' ? (
                            <span className='text-danger'>(Already Occupied)</span>
                        ) : null
                    } */}
                </ModalHeader>
                <ModalBody>
                    <Form id="form" >
                        {/* <Row className='mb-2 flex-column-reverse flex-md-row row-no-gutters'> */}
                        <Row className='d-flex flex-lg-row flex-column'>
                            <Col className='m-1 d-flex flex-row justify-content-between align-items-center '>
                                <Col lg='5' md='5'>
                                    <Label className='form-label' for='checkIn_date'>
                                        Check-In Date:<span className='text-danger'>*</span>
                                    </Label>
                                    <Flatpickr
                                        id='checkIn_date'
                                        name='checkIn_date'
                                        placeholder='Select Check-In Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            minDate: moment(new Date()).subtract(1, 'days'),
                                            defaultDate: inDate
                                        }}
                                        disabled
                                        defaultValue={inDate}
                                        value={inDate}
                                    // onChange={date => {
                                    //     setInDate(date[0])
                                    //     setLoader(false);
                                    // }}
                                    />
                                    {showErrors && !inDate && <p className='text-danger'>Check-In Date is required</p>}
                                </Col>
                                <Col lg='5' md='5'>
                                    <Label className='form-label' for='checkOut_date'>
                                        Check-Out Date:<span className='text-danger'>*</span>
                                    </Label>
                                    <Flatpickr
                                        id='checkOut_date'
                                        name='checkOut_date'
                                        placeholder='Select Check-Out Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            minDate: new Date(inDate).fp_incr(1),
                                            defaultDate: outDate
                                        }}
                                        value={outDate}
                                        onChange={date => {
                                            setOutDate(date[0])
                                        }}
                                    />
                                    {showErrors && !outDate && <p className='text-danger'>Check-Out Date is required</p>}
                                </Col>
                            </Col>
                            <Col className='m-1'>
                                {console.log("currentValue", currentValue)}
                                <Label className='form-label'>
                                    Number of Days: {currentValue}
                                </Label>
                                <div className='py-1'>
                                    <ReactSlider
                                        className="customSlider"
                                        trackClassName="customSlider-track"
                                        thumbClassName="customSlider-thumb"
                                        marks={1}
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                        value={currentValue}
                                        onChange={(value) => {
                                            setOutDate(new Date(quickBookingStore?.checkInDate).fp_incr(value))
                                        }}
                                        renderMark={(props) => {
                                            if (props.key < currentValue) {
                                                props.className = "customSlider-mark customSlider-mark-before";
                                            } else if (props.key === currentValue) {
                                                props.className = "customSlider-mark customSlider-mark-active";
                                            }
                                            return <span {...props} />;
                                        }}
                                    />
                                </div>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Room Category</th>
                                            <th className='occupantsCol'>
                                                <div className='d-flex flex-column'>
                                                    <span>
                                                        Occupants
                                                    </span>
                                                    <span>
                                                        Children: 6yrs & above,
                                                    </span>
                                                    <span>
                                                        Infant: Upto 5yrs
                                                    </span>
                                                </div>
                                            </th>
                                            <th className='mealCol'>Rate Plan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h5>{selectedRoom.roomCat}</h5>
                                                <div style={{ width: '25rem', margin: 'auto' }}>
                                                    {
                                                        dateRate.length > 0 && (
                                                            dateRate.filter(r => r.ROOMID === selectedRoom.roomID && r.MealID === mealId).map((i, ridx) => {
                                                                return (
                                                                    <Badge className='me-1' key={ridx} color='light-secondary'>
                                                                        <Col>{moment(i.Date).format('DD-MM')}</Col>
                                                                        <Col>₹ {i.ROOMRATE}</Col>
                                                                    </Badge>
                                                                )
                                                            })
                                                        )
                                                    }
                                                    {/* {
                                                        selRoomRates.length > 0 && (
                                                            selRoomRates.map((i, ridx) => {
                                                                return (
                                                                    <Badge className='me-1' key={ridx} color='light-secondary'>
                                                                        <Col>{moment(i.ROOMDATE).format('DD-MM')}</Col>
                                                                        <Col>₹ {i.ROOMRATE}</Col>
                                                                    </Badge>
                                                                )
                                                            })
                                                        )
                                                    } */}
                                                </div>
                                                <div className='my-1'>Cost - {selectedRoom.total_price} </div>
                                            </td>
                                            <td className='d-flex flex-row flex-wrap justify-content-center align-items-center'>
                                                <div>
                                                    <Label>Adults</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select adultsDropdown'
                                                        classNamePrefix='select'
                                                        value={{ value: `${adult}`, label: `${adult}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.adultsAllowed) && index > 0)}
                                                        options={no_of_person_options(selectedRoom.adultsAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.adult_occ = e.value
                                                            let extra = 0
                                                            if (selectedRoom.adult_occ > selectedRoom.adultBase) {
                                                                // extra = (selectedRoom.adult_occ - selectedRoom.adultBase) * selectedRoom.per_extra_adult_price
                                                                extra = (selectedRoom.adult_occ - selectedRoom.adultBase) * selNewRate.EXTRAADULTRATE
                                                            }
                                                            selectedRoom.extra_adult_price = extra
                                                            setUpdated(!updated)
                                                            setAdult(selectedRoom.adult_occ)
                                                            updateRoom()
                                                        }}
                                                    />
                                                </div>
                                                <div className='m-1'>
                                                    <Label>Child</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        placeholder='No. of childrens'
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select adultsDropdown'
                                                        classNamePrefix='select'
                                                        value={{ value: `${children}`, label: `${children}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.childrenAllowed))}
                                                        options={no_of_person_options(selectedRoom.childrenAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.child_occ = e.value
                                                            let extra = 0
                                                            if (selectedRoom.child_occ > selectedRoom.childBase) {
                                                                // extra = (selectedRoom.child_occ - selectedRoom.childBase) * selectedRoom.per_extra_child_price
                                                                extra = (selectedRoom.child_occ - selectedRoom.childBase) * selNewRate.EXTRACHILDRATE
                                                            }
                                                            selectedRoom.extra_child_price = extra
                                                            setUpdated(!updated)
                                                            setChildren(selectedRoom.child_occ)
                                                            updateRoom()
                                                        }}
                                                        isDisabled={selectedRoom.childrenAllowed === '0'}
                                                    />
                                                </div>
                                                <div className='m-1'>
                                                    <Label>Infant</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        placeholder='No. of Infants adultsDropdown'
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        value={{ value: `${infant}`, label: `${infant}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.infantAllowed))}
                                                        options={no_of_person_options(selectedRoom.infantAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.infant_occ = e.value
                                                            setUpdated(!updated)
                                                            setInfant(selectedRoom.infant_occ)
                                                            updateRoom()
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='m-1'>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select mt-1 mealDropdown'
                                                        classNamePrefix='select'
                                                        // options={mealsOptions}
                                                        options={newRatePlans}
                                                        // value={mealsOptions?.filter(c => c.value == meal)}
                                                        value={newRatePlans?.filter(c => c.MealID === mealId)}
                                                        onChange={e => {
                                                            console.log('e', e)
                                                            let room = selectedRoom;
                                                            room.selected_meal = e.value
                                                            // room.selected_meal_price = mealsList?.filter(c => c.MealID === e.value)[0].Price;
                                                            room.selected_meal_price = e.value;
                                                            setSelectedRoom(room);
                                                            setSelectedMealId(e.MealID)
                                                            setMeal(room.selected_meal)
                                                            // setMealPrice(mealsList?.filter(c => c.MealID === e.value))
                                                            setUpdated(!updated)
                                                            setMealId(e.MealID)
                                                            setSelNewRate(e)
                                                            setActualRate(e.ROOMRATE)
                                                            // updateRoom()
                                                        }}
                                                    />
                                                    {
                                                        showErrors && !selectedMealId ? <Label className='text-danger'>Select Rate Plan !</Label> : null
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        <Row className='d-flex flex-lg-row flex-column'>
                            <Col lg='6' className='p-2'>
                                <Col className=' bg-light rounded p-2'>
                                    <h3 className='text-center pb-2'>Summary</h3>
                                    <Row className='flex-column-reverse flex-sm-row row-no-gutters pb-2'>
                                        <Col className='col-sm-8 '>
                                            <div className='py-1 ps-sm-1'>
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
                                                        checked={hasGst}
                                                        onChange={e => handleHasGST(e)}
                                                    />
                                                    <Label for='reapir_yes' className='form-check-label'>
                                                        Yes
                                                    </Label>
                                                </div>
                                            </div>
                                            <div className='my-2 ps-1'>Total Net Cost: ₹ {netCost}</div>
                                            {/* <div className='my-2 ps-1'>Total GST: ₹ {gst}</div> */}
                                            <div className='my-2 ps-1'>Total GST: ₹ {hasGst ? gst.toFixed(2) : 0}</div>
                                            {discountAmount && discountAmount > 0 ? <div className='my-2 ps-1'>Total Discount Amount: ₹ {discountAmount}</div> : <></>}
                                            <div className='my-2 ps-1'>Payable Amount: ₹ {total.toLocaleString()}</div>
                                        </Col>
                                        <Col className='col-sm-4 '>
                                            <div className='mb-2'>
                                                <Label>Discount Type</Label>
                                                <Select
                                                    menuPlacement='auto'
                                                    // menuPortalTarget={document.body}
                                                    theme={selectThemeColors}
                                                    className='react-select discountTypeDropdown'
                                                    classNamePrefix='select'
                                                    options={discountOptions}
                                                    onChange={e => {
                                                        setDiscountType(e.value)
                                                        handleRemoveDiscount()
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <Label>Discount</Label>
                                                <Input
                                                    className='discountField'
                                                    type='number'
                                                    min={0}
                                                    max={100}
                                                    value={discount}
                                                    placeholder='Enter discount here'
                                                    // onChange={e => handleDiscountValue(e)}
                                                    onChange={e => setDiscount(e.target.value)}
                                                    disabled={disabled}
                                                />
                                                {/* {
                                                    discountType === 'percentage' && discount > 0 ? (
                                                        <span className='text-small'>
                                                            (₹  {((cost) * (Number(discount) / 100)).toLocaleString()})
                                                        </span>
                                                    ) : null
                                                } */}
                                            </div>
                                            <div className='text-center pt-1'>
                                                <div className="d-sm-flex">
                                                    {
                                                        discount && discount > 0 ? (
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
                                                        ) : (
                                                            <Button.Ripple color='success' disabled >Apply</Button.Ripple>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col lg='6' className='p-2'>
                                <Col className='d-flex flex-row flex-wrap'>
                                    <div className='pe-1 w-50'>
                                        <Label>
                                            Booking Source<span className='text-danger'>*</span>
                                        </Label>
                                        <Select
                                            //id= 'bookingSource'
                                            placeholder=''
                                            menuPlacement='auto'
                                            aria-readonly
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={bookingSourceOptions}
                                            value={bookingSourceOptions?.filter(c => c.value === bookingSourceId)}
                                            onChange={val => {
                                                handleSourceType(val.value)
                                            }}
                                            invalid={showErrors && bookingSourceId === ''}
                                        />
                                        {
                                            showErrors && !bookingSourceId ? <Label className='text-danger'>select Booking Source !</Label> : null
                                        }
                                    </div>
                                    <div className='ps-1 w-50'>
                                        <Label className='form-label' for='sourceType'>
                                            Source Type{sourceType.length > 0 && <span className='text-danger'>*</span>}
                                        </Label>
                                        <Controller
                                            defaultValue=''
                                            id='sourceType'
                                            name='sourceType'
                                            control={control}
                                            render={
                                                ({ field: { onChange, value, ref } }) => <CreatableSelect
                                                    isDisabled={sourceType.length === 0 && bookingSourceId !== "BSID20230220AA00001" && bookingSourceId !== "BSID20230220AA00002"}
                                                    placeholder=''
                                                    menuPlacement='auto'
                                                    theme={selectThemeColors}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    options={sourceType}
                                                    value={sourceType?.filter(c => value.includes(c.value))}
                                                    inputRef={ref}
                                                    onChange={val => {
                                                        onChange(val.value)
                                                        store.dispatch(setSourceTypeStore(val.value))
                                                    }}
                                                    onCreateOption={handleOpenAgency}
                                                    invalid={errors.sourceType}
                                                />
                                            }
                                        />
                                        {
                                            errors.sourceType ? <Label className='text-danger'>{errors.sourceType.message}!</Label> : null
                                        }
                                    </div>
                                </Col>
                                <div className='me-md-1 me-0 my-1  w-100'>
                                    <Label className='form-label' for='guestDetails'>
                                        Guest Details<span className='text-danger'>*</span>{selGuestDetail ? <span onClick={handleEditGuest} className='mx-1 cursor-pointer'>(<Edit3 color='blue' size={15} /> Edit Guest details)</span> : null}
                                    </Label>
                                    <CreatableSelect
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // options={guestDetailOptions}
                                        // formatCreateLabel={userInput => `Create new Guest '${userInput}'`}
                                        // value={guestDetailOptions?.filter(c => c.value === selGuestDetail)}
                                        // onChange={val => {
                                        //     handleGuestDetail(val.value)
                                        // }}
                                        // onFocus={() => {
                                        //     guestDetail()
                                        // }}
                                        // onCreateOption={handleOpeng}
                                        // invalid={showErrors && selGuestDetail === ''}
                                        // onCreateOption={handleOpen}

                                        options={guestOptions}
                                        formatCreateLabel={userInput => `Create new Guest '${userInput}'`}
                                        // value={guestDetailOptions?.filter(c => c.value === selGuestDetail)}
                                        value={guestOptions?.filter(c => c.value === selGuestDetail)}
                                        onChange={val => {
                                            handleGuestDetail(val.value)
                                        }}
                                        onFocus={() => {
                                            guestDetail()
                                            console.log("called guest result")
                                        }}
                                        onCreateOption={handleOpeng}
                                        invalid={showErrors && selGuestDetail === ''}
                                    />
                                    {
                                        showErrors && !selGuestDetail ? <Label className='text-danger'>select guest details !</Label> : null
                                    }
                                </div>
                                <div className='me-md-1 me-0 my-1 w-100'>
                                    <Label className='form-label' for='specialNote'>
                                        Special Note
                                    </Label>
                                    <Input
                                        type='textarea'
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </div>

                            </Col>
                        </Row>

                        <Row>
                            {/* <Col className='d-flex mt-1 flex-row justify-content-center'>
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
                            </Col> */}
                            <hr />
                            {
                                status && <Col>
                                    <Row className='d-flex flex-lg-row flex-column'>
                                        <Col>
                                            <Label>
                                                Payment Type<span className='text-danger'>*</span>
                                            </Label>
                                            <Col>
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
                                                            onChange={(val) => {
                                                                onChange(val.value)
                                                                setPstatus(val.label)
                                                                console.log('val.label', val.label)
                                                                store.dispatch(setPaymentTypeStore(val.value))
                                                            }}
                                                            invalid={errors.paymentType && true}
                                                        />
                                                    }
                                                />
                                            </Col>
                                            {pstatus === '' && showErrors && <Label className='text-danger'>Payment Status is required!</Label>}
                                        </Col>
                                        {
                                            pstatus !== 'Bill to Company' && <Col>
                                                <Label>
                                                    Payment Mode{pstatus !== '' && <span className='text-danger'>*</span>}
                                                </Label>
                                                <Col>
                                                    <Controller
                                                        defaultValue=''
                                                        id='collectionType'
                                                        name='collectionType'
                                                        control={control}
                                                        render={
                                                            ({ field: { onChange, value, ref } }) => <Select
                                                                isDisabled={pstatus === '' || paymentModeOptions.length === 0}
                                                                placeholder=''
                                                                menuPlacement='auto'
                                                                theme={selectThemeColors}
                                                                className='react-select'
                                                                classNamePrefix='select'
                                                                options={paymentModeOptions}
                                                                inputRef={ref}
                                                                value={paymentModeOptions.filter(c => value.includes(c.value))}
                                                                onChange={(val) => {
                                                                    onChange(val.value)
                                                                    store.dispatch(setPaymentModeStore(val.value))
                                                                }

                                                                }
                                                                invalid={errors.cType && showErrors}
                                                            />
                                                        }
                                                    />
                                                </Col>
                                                {cType === '' && showErrors && <Label className='text-danger'>Collection Type is required!</Label>}
                                            </Col>
                                        }

                                        {
                                            pstatus !== 'hotel' && pstatus !== 'Bill to Company' ? (
                                                <>
                                                    <Col>
                                                        <Col className='mt-2'>
                                                            <div>
                                                                <Input type='radio' name='payFull' id='fullAmount' value="Yes" checked={payFull === "Yes"} onChange={e => (setPayFull(e.target.value), setAmount(quickBookingStore.total))} />
                                                                <Label className='Amount' for='fullAmount'>
                                                                    Full Amount
                                                                </Label>
                                                                <Input type='radio' className='ms-2' name='payFull' id='partialAmount' value="No" checked={payFull === "No"} onChange={e => (setPayFull(e.target.value), setAmount(quickBookingStore.total === amount ? 0 : amount))} />
                                                                <Label className='Amount' for='partialAmount'>
                                                                    Partial Amt
                                                                </Label>

                                                            </div>
                                                        </Col>
                                                        {payFull === '' && loader && <Label className='text-danger'>Payment Type is required!</Label>}
                                                    </Col>
                                                    <Col>
                                                        <Label>
                                                            Collected Amount
                                                        </Label>
                                                        <Col>
                                                            <Input
                                                                type='text'
                                                                onChange={e => {
                                                                    if (e.target.value < 0) {
                                                                        setAmount(0)
                                                                    } else setAmount(e.target.value)
                                                                }}
                                                                value={amount === 0 && payFull === 'Yes' ? quickBookingStore.total : amount}
                                                                disabled={payFull === "Yes"}
                                                                invalid={loader && (amount === '' || amount > quickBookingStore.total)}
                                                            />
                                                        </Col>
                                                        {payFull === "No" && amount === '' && loader && <Label className='text-danger'>Collected amount cannot be blank!</Label>}
                                                        {payFull === "No" && amount > quickBookingStore.total && loader && <Label className='text-danger'>Collected amount cannot be more than full amount!</Label>}
                                                    </Col>
                                                </>
                                            ) : pstatus === 'Bill to Company' && pstatus !== 'hotel' ? (
                                                <>
                                                    <Col>
                                                        <Label>
                                                            Company GST<span className='text-danger'>*</span>
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
                                    <Row className='d-flex flex-lg-row flex-column'>
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
                                    <Row className='d-flex flex-lg-row flex-column'>
                                        <Col>
                                            <Label>
                                                Booking Created By<span className='text-danger'>*</span>
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
                                                        options={userDetails}
                                                        inputRef={ref}
                                                        value={userDetails.filter(c => value.includes(c.value))}
                                                        onChange={val => {
                                                            onChange(val.value)
                                                            store.dispatch(setBookingCreatedByStore(val.value))
                                                        }}
                                                        invalid={errors.boookedBy}
                                                    />
                                                }
                                            />
                                            {showErrors && booker === '' && <span className='text-danger'>Select a booker</span>}
                                            {errors.boookedBy && <Label className='text-danger'>{errors.boookedBy.message}!</Label>}
                                        </Col>
                                        <Col>
                                            <Label>
                                                Created By{booker === '0' && <span className='text-danger'>*</span>}
                                            </Label>
                                            <Controller
                                                defaultValue=''
                                                control={control}
                                                id='bookerName'
                                                name='bookerName'
                                                render={
                                                    ({ field }) => <Input
                                                        type='text'
                                                        disabled={booker !== '0'}
                                                        invalid={errors.bookerName && true}
                                                        {...field}
                                                    />
                                                }
                                            />
                                            {showErrors && booker === '0' && newBooker === '' && <span className='text-danger'>Booking created by is required!</span>}
                                        </Col>
                                    </Row>
                                    <div className='mt-1 d-flex justify-content-center'>
                                        <Button onClick={handleSubmit(() => onSubmit(), () => alert("error"))} color='primary' className='btn-next'>
                                            <span className='align-middle'>
                                                {
                                                    loader ? (
                                                        <Spinner color='#FFF' />
                                                    ) : 'Create Booking'
                                                }
                                            </span>
                                            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                        </Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            {openg && <RegisterGuest open={openg} handleOpen={handleOpeng} />}
            {openAgency && <RegisterAgency open={openAgency} handleOpenAgency={handleOpenAgency} sourceID={bookingSourceId} />}
            {openBookModal && <QuickBookingDetailPreview
                open={openBookModal}
                handleOpen={handleBookModal}
                bookingID={newBID}
                handleModalOpen={handleModalOpen}
            />}
            {editGuest && <EditGuest open={editGuest} handleOpen={handleEditGuest} guestData={selGuestDetail} />}
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default QuickBookingModal1