import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Badge, Button, Col, Input, Label, Row, Table } from 'reactstrap'
import { toast } from 'react-hot-toast'
import Select from 'react-select'
// import NoOfPeople from './NoOfPeople'
import moment from 'moment'

// ** Store & Actions
import { store } from '@store/store'
// import { setRoomsBooked, setPrice, setBookingSourceDropdownStore, setGuestDetailDropdownStore, setBookingDetailStore, setLoaderStore } from '@store/booking'
import { setSelRoomArr, setPrice } from '../../../redux/reserve'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/input-number/input-number.scss'
import NewNoOfPeople from './NewNoOfPeople'
import { setBookingRate } from '../../../redux/usermanageReducer'

const discountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'flat', label: 'Flat' }
]

const NewSelectRoom = ({ stepper }) => {
    console.log('jhfdjh', stepper);
    const usePrevious = (value) => {
        const ref = useRef()

        useEffect(() => {
            ref.current = value
        }, [value])

        return ref.current
    }

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID } = getUserData

    const reserveStore = useSelector(state => state.reserveSlice)
    const { iDate, oDate } = reserveStore
    console.log('reserveStoreinRoom', reserveStore)
    const duration = (moment(oDate).diff(moment(iDate), 'days'))

    const reservedRooms = useSelector(state => state.reserveSlice.selRoomArr)
    console.log('reservedRoomstest', reservedRooms);
    const [availableRooms, setAvailableRooms] = useState([])
    console.log('availableRooms', availableRooms);
    const [adjustCountArr, setAdjustCountArr] = useState()
    const [roomRateArr, setRoomRateArr] = useState([])

    const [confirm, setConfirm] = useState(false)
    const [selRooms, setSelRooms] = useState(reservedRooms.length > 0 && reservedRooms.every(r => r.SEL_ADULT > 0) ? reservedRooms : [])
    console.log('selRooms', selRooms);

    const [ratePlans, setRatePlans] = useState([])
    const [newRatePlans, setNewRatePlans] = useState([])
    const [dateRate, setDateRate] = useState([])
    console.log("ratePlans", dateRate)
    const [emptyFlag, setEmptyFlag] = useState(false)

    const [total_Adult, setTotal_Adult] = useState(0)
    const [total_Child, setTotal_Child] = useState(0)
    const [total_Infant, setTotal_Infant] = useState(0)
    const [netTotal, setNetTotal] = useState(0)
    const [gTotal, setGTotal] = useState(0)
    const [gTax, setGTax] = useState(0)
    const [hasGst, setHasGst] = useState(true)

    const [extraAdultPrice, setExtraAdultPrice] = useState(0)
    const [extraChildPrice, setExtraChildPrice] = useState(0)
    const [extraInfantPrice, setExtraInfantPrice] = useState(0)

    const [discount, setDiscount] = useState(reserveStore?.discount ? reserveStore.discount : 0)
    const [discountType, setDiscountType] = useState(reserveStore?.discountType ? reserveStore.discountType : "")
    console.log('reserveStore?.disAmt', reserveStore?.disAmt);
    const [discountAmount, setDiscountAmount] = useState(reserveStore?.disAmt ? reserveStore.disAmt : 0)
    const [disabled, setDisabled] = useState(false)

    const prevDiscount = usePrevious(discount)

    const [refresh, setRefresh] = useState(false)
    const handleRefresh = () => setRefresh(!refresh)

    const getNoAdjustment = async () => {

        // We stopped unnecessary API calls ("iDate or oDate  se stop kar rahe h")
        if (!iDate || !oDate || !PropertyID || !LoginID || !Token) {
            console.log("Adjustment API blocked: missing required data", {
                iDate,
                oDate,
                PropertyID,
                LoginID,
                Token
            });
            return;  // API CALL STOP
        }

        try {
            const res = await axios.get('/rooms/adjustment', {
                headers: {
                    LoginID,
                    Token,
                    SecKey: 'abc'
                },
                params: {
                    FromDate: moment(iDate).format('YYYY-MM-DD'),
                    // Todate: moment(oDate).format('YYYY-MM-DD'),
                    ToDate: moment(oDate).format('YYYY-MM-DD'),
                    For: "PMS",
                    PropertyId: PropertyID
                }

            })
            console.log('iDateadjustment', iDate)
            console.log('oDateadjustment', oDate)
            console.log('get room adjustment', res)
            setAdjustCountArr(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    const getAvailableRooms = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                CheckInDate: iDate,
                CheckOutDate: oDate
            }
            const res = await axios.post(`/getdata/bookingdata/roomavailability`, obj)
            console.log('available room response', res)
            if (res?.data[0].length > 0) {
                setAvailableRooms(res?.data[0])
                setRoomRateArr(res?.data[2])
                console.log('roomRateArr', res?.data[2])
                let result = res?.data[1]
                console.log('result', result)
                let rates = result?.map(function (meals) {
                    // return { value: meals.planRate, label: `${meals.ratePlanID} - ${meals.mealType}`, ...meals }
                    return { value: meals.ratePlan, label: `${meals.ratePlanID} - ${meals.mealType}`, ...meals }
                })
                let finalRates = rates.filter(r => r.status === "Active")
                console.log('finalRates', finalRates)
                setRatePlans(finalRates)
            }
        } catch (error) {
            console.log('available Room error', error)
        }
    }

    const getExistBookedRoomData = () => {
        console.log('rrrrrrrraa', reservedRooms)
        let adult_occ = reservedRooms.every(r => r.SEL_ADULT > 0)
        if (reservedRooms.length > 0 && adult_occ) {
            let adult_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_ADULT }, 0)
            let child_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_CHILD }, 0)
            let infant_count = reservedRooms.reduce((acc, obj) => { return acc + obj.SEL_INFANT }, 0)
            setTotal_Adult(adult_count)
            setTotal_Child(child_count)
            setTotal_Infant(infant_count)
            if (discountAmount > 0 && discountType === "flat") {
                // let each_room_dis_amt = discountAmount / reservedRooms.length
                // console.log('disss', each_room_dis_amt)
                // let new_reservedRooms = reservedRooms.map(room => ({ ...room, "TOTAL": (room.TOTAL - each_room_dis_amt) }))
                // console.log('gggg', new_reservedRooms)
                // let all_net_total = new_reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
                // let all_tax = new_reservedRooms.reduce((acc, obj) => { return acc + (obj.TOTAL * (obj.IGST_P / 100)) }, 0)
                // console.log('all_tax', all_tax)
                let all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
                console.log('all_net_toatl', all_net_total)
                // let all_tax_percent_total = reservedRooms.reduce((acc, obj) => { return acc + obj.IGST_P }, 0)
                // let all_tax = all_net_total * (all_tax_percent_total / 100)
                let all_tax = duration === 0 ? (all_net_total - discountAmount) * (reservedRooms[0].igsT_P / 100) : ((all_net_total * duration) - discountAmount) * (reservedRooms[0].igsT_P / 100)
                let total_with_duration = duration === 0 ? all_net_total - discountAmount : (all_net_total * duration) - discountAmount
                let total_with_duration_and_tax = total_with_duration + (all_tax)
                setNetTotal(duration === 0 ? all_net_total - discountAmount : (all_net_total * duration) - discountAmount)
                if (hasGst) {
                    setGTax(all_tax)
                    setGTotal(total_with_duration_and_tax)
                } else {
                    setGTax(0)
                    setGTotal(total_with_duration)
                }
            } else if (discountAmount > 0 && discountType === "percentage") {
                let old_all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)

                let new_reservedRooms = reservedRooms.map(room => ({ ...room, "TOTAL": (room.TOTAL - (room.TOTAL * (Number(discount) / 100))) }))
                console.log('gggg', new_reservedRooms)
                let all_net_total = new_reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
                setDiscountAmount(duration === 0 ? (old_all_net_total - all_net_total) : (old_all_net_total - all_net_total) * duration)
                let all_tax = new_reservedRooms.reduce((acc, obj) => { return acc + (obj.TOTAL * (obj.igsT_P / 100)) }, 0)
                console.log('all_tax', all_tax)
                let total_with_duration = duration === 0 ? all_net_total : all_net_total * duration
                console.log('total_with_duration', total_with_duration)
                let total_with_duration_and_tax = duration === 0 ? total_with_duration + all_tax : total_with_duration + (all_tax * duration)
                console.log('total_with_duration_and_tax', total_with_duration_and_tax)
                setNetTotal(duration === 0 ? all_net_total : all_net_total * duration)
                if (hasGst) {
                    setGTax(duration === 0 ? all_tax : all_tax * duration)
                    setGTotal(total_with_duration_and_tax)
                } else {
                    setGTax(0)
                    setGTotal(total_with_duration)
                }
            } else {
                let all_net_total = reservedRooms.reduce((acc, obj) => { return acc + obj.TOTAL }, 0)
                let all_tax = reservedRooms.reduce((acc, obj) => { return acc + obj.TAX }, 0)
                console.log('all_tax', all_tax, all_net_total)
                let total_with_duration = duration === 0 ? all_net_total : all_net_total * duration
                let total_with_duration_and_tax = duration === 0 ? total_with_duration + all_tax : total_with_duration + (all_tax * duration)
                setNetTotal(duration === 0 ? all_net_total : all_net_total * duration)
                if (hasGst) {
                    setGTax(duration === 0 ? all_tax : all_tax * duration)
                    setGTotal(total_with_duration_and_tax)
                } else {
                    setGTax(0)
                    setGTotal(total_with_duration)
                }
            }
        }
    }

    useEffect(() => {
        getAvailableRooms()
        getNoAdjustment()
    }, [iDate, oDate])

    useEffect(() => {
        getExistBookedRoomData()
    }, [refresh, duration, hasGst])

    const Options = (num, id, obj) => {
        const arr = []
        let roomAvailObj = roomRateArr.filter(r => r.roomID === id)
        let newNum
        if (roomAvailObj[0]?.RoomCount > 0) {
            newNum = num + roomAvailObj[0]?.roomCount
        } else {
            newNum = num
        }
        for (let i = 0; i <= newNum; i++) {
            arr.push({ value: i, label: i, id, obj })
        }
        return arr
    }

    const handleHasGST = e => {
        if (e.target.checked) {
            setHasGst(true)
        } else {
            setHasGst(false)
        }
    }

    const handleRemoveDiscount = () => {
        setDiscount(0)
        setDisabled(false)
        setDiscountAmount(0)
    }

    const handleDiscount = () => {
        console.log(discountType)
        if (netTotal === 0) {
            toast.error("Please confirm room selection first")
            return
        }
        if (discountType === 'flat') {
            const disAmount = Number(discount)
            setDisabled(true)
            setDiscountAmount(disAmount)
        } else if (discountType === 'percentage') {
            console.log('discountgTotal', ((gTotal * Number(discount)) / 100) * duration);
            const disAmount = ((gTotal * (Number(discount)) / 100))
            setDiscountAmount(disAmount)
            setDisabled(true)
        } else {
            toast.error('Select Discount Type first')
        }
    }

    const resetSummary = () => {
        setTotal_Adult(0)
        setTotal_Child(0)
        setTotal_Infant(0)
        setNetTotal(0)
        setGTax(0)
        setGTotal(0)
    }

    useEffect(() => {
        resetSummary()
    }, [selRooms])

    useEffect(() => {
        getExistBookedRoomData()
    }, [discountAmount])
    console.log('reservedRoomsssssss', reservedRooms, {
        dateRate
    });
    const handleRoomsBooked = () => {
        if (confirm && reservedRooms.every(r => r.SEL_ADULT > 0) && reservedRooms.every(r => r.SEL_MEAL !== '')) {
            store.dispatch(
                setPrice(
                    {
                        netTotal,
                        gTax,
                        gTotal,
                        discount: Number(discount),
                        disAmt: discountAmount,
                        discountType: discountType
                    }
                )
            )
            store.dispatch(
                // dateRate.map((index) => {
                setBookingRate({
                    dateRate
                })
                // })
            )
            console.log('done')
            toast.success(`${reservedRooms.length} Rooms selected for reservation`)
            stepper.next()

        } else {
            reservedRooms.some(r => r.SEL_MEAL === '') ? toast.error('Select Rate Plan for all Rooms!') : null
            reservedRooms.some(r => r.SEL_ADULT === 0) ? toast.error('Select No. of Adult Occupants for all Rooms!') : null
            // meals_room_status ? toast.error("Select Rate Plan for all Rooms!") : null
        }
    }
    console.log('netTotal', netTotal);
    const getNewRoomRate = async (arr) => {
        let newArr = arr.map(r => r.roomID)
        let unique = [...new Set(newArr)]
        // console.log('arr', unique)
        try {
            let obj = {
                fromDate: iDate,
                toDate: oDate,
                roomID: unique.toString()
            }
            // const res = await axios.post(`/booking/GetRoomRate`, obj, {
            const res = await axios.post(`/bookingv2/getroomrate`, obj, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('newRateres', res)
            let result = res?.data?.daily
            console.log('newRateResult', result)
            if (result.length === 0) {
                setEmptyFlag(true)
            } else {
                let arr = result.map(r => {
                    return { value: r.ratePlanID, label: r.ratePlanID, ...r }
                    // return { value: r.roomRatePlanID, label: r.roomRatePlanID, ...r }
                })
                setNewRatePlans(arr)
                // setDateRate(res?.data[1])
                setDateRate(res?.data?.summary)
                setEmptyFlag(false)
            }
            setConfirm(true)
        } catch (error) {
            console.log('new rate error', error)
        }


    }
    console.log('discountgTotal', discountAmount);
    return (
        <>
            {console.log('ratePPP', ratePlans)}
            <Row>
                {availableRooms && availableRooms.length > 0 ? <>
                    <Col className='col-md-12'>
                        <Row>
                            <Col className='col-12 col-md-6 pb-2'>
                                <Row>
                                    <Col className='d-flex flex-row justify-content-between align-items-center'>
                                        <h4>Room Type</h4>
                                        <h4>No. of Rooms Booked</h4>
                                    </Col>
                                </Row>
                                {console.log('adjustCountArr', adjustCountArr)}
                                {
                                    availableRooms && availableRooms?.map((cat, index) => {
                                        const availRoomrate = adjustCountArr?.filter(r => r.roomID === cat.roomID)
                                        console.log('availRoomrate', availRoomrate)
                                        // let extraCount = availRoomrate?.length > 0 ? availRoomrate[0]?.roomsAvailable : 0
                                        let extraCount = availRoomrate?.length > 0 ? availRoomrate[0]?.RoomCount : 0
                                        let newRoomCount = cat.roomsAvailable + extraCount
                                        return (
                                            <Row key={index} className='my-1 d-flex flex-row justify-content-between align-items-center' >
                                                <Col>
                                                    <h5>{cat.roomDisplayName}</h5>
                                                    <h6>(Available - {cat.roomsAvailable + extraCount})</h6>
                                                </Col>
                                                <Col className='d-flex justify-content-end'>
                                                    <Select
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select roomsBookedDropdown pe-1'
                                                        classNamePrefix='select'
                                                        isDisabled={ratePlans.filter(r => r.roomID === cat.roomID).length > 0 ? false : true}
                                                        options={Options(newRoomCount, cat.roomID, cat)}
                                                        onChange={e => {
                                                            console.log('e', e)
                                                            setConfirm(false)
                                                            const roomExist = selRooms.length > 0 && (selRooms.filter(s => s.roomID === e.id)).length > 0
                                                            const roomExistNos = selRooms.filter(s => s.roomID === e.id).length
                                                            // console.log('roomExist', roomExist)
                                                            // console.log('roomExistNos', roomExistNos)
                                                            if (e.value > 0 && roomExist === false) {
                                                                let tempArr = []
                                                                for (let i = 1; i <= e.value; i++) {
                                                                    tempArr.push(e.obj)
                                                                }
                                                                // setSelRooms([...selRooms, e.obj])
                                                                console.log('tempArr', tempArr)
                                                                setSelRooms(selRooms.concat(tempArr))
                                                            } else if (e.value > 0 && roomExist) {
                                                                if (e.value > roomExistNos) {
                                                                    let tempArr = []
                                                                    let no_of_times_to_push = e.value - roomExistNos
                                                                    for (let i = 1; i <= no_of_times_to_push; i++) {
                                                                        tempArr.push(e.obj)
                                                                    }
                                                                    setSelRooms(selRooms.concat(tempArr))
                                                                } else {
                                                                    let filteredArr = selRooms.filter(room => room.roomID !== e.id)
                                                                    let tempArr = []
                                                                    for (let i = 1; i <= e.value; i++) {
                                                                        tempArr.push(e.obj)
                                                                    }
                                                                    // setSelRooms([...filteredArr, e.obj])
                                                                    setSelRooms(filteredArr.concat(tempArr))
                                                                }
                                                            } else if (e.value === 0 && selRooms.length > 0) {
                                                                let filteredArr = selRooms.filter(room => room.roomID !== e.id)
                                                                setSelRooms(filteredArr)
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                                <Row>
                                    <Col className='text-center mb-1'>
                                        <Button.Ripple
                                            color='success'
                                            onClick={() => {
                                                if (selRooms.length > 0) {
                                                    let modifiedArr = selRooms.map((r, rid) => ({ ...r, ID: rid + 1 }))
                                                    console.log('selRooms231', modifiedArr)

                                                    setSelRooms(modifiedArr)
                                                    store.dispatch(setSelRoomArr(modifiedArr))
                                                    getNewRoomRate(selRooms)
                                                    // setConfirm(true)
                                                } else {
                                                    toast.error('Please select quantity of rooms to book.')
                                                }
                                            }}
                                            disabled={confirm}
                                        >
                                            Confirm
                                        </Button.Ripple>
                                    </Col>
                                </Row>
                            </Col>

                            <Col className='col-md-6 col-12 p-2'>
                                <Col className=' bg-light rounded p-2'>
                                    <h3 className='text-center'>Summary</h3>
                                    <hr />
                                    <Row className='flex-column-reverse flex-sm-row'>
                                        <Col className='col-sm-6 col-12'>
                                            <div className='py-1 ps-sm-1'>Total Room: {selRooms.length}</div>
                                            <div className='py-1 ps-sm-1'>Total Night's: {duration}</div>
                                            <div className='py-1 ps-sm-1'>Total Adults: {total_Adult}</div>
                                            {total_Child !== 0 && <div className='my-1 ps-1'>Total Childrens: {total_Child}</div>}
                                            {total_Infant !== 0 && <div className='my-1 ps-1'>Total Infants: {total_Infant}</div>}
                                            <div className='py-1 ps-sm-1'>Total Net Cost: ₹ {netTotal}</div>
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
                                            <div className='py-1 ps-sm-1'>Total GST: ₹ {hasGst ? gTax.toFixed(2) : 0}</div>
                                            {console.log('discountgTotal', discountAmount)}
                                            {discountAmount && discountAmount > 0 ? <div className='py-1 ps-sm-1'>Total Discount Amount: ₹ {discountAmount.toFixed(2)}</div> : <></>}
                                            <div className='py-1 ps-sm-1 text-nowrap'>Payable Amount: ₹ {gTotal.toFixed(2)}
                                                {/* {
                                                hasGst && discountAmount > 0 ? (gTotal - discountAmount).toFixed(2) : !hasGst && discountAmount > 0 ? (netTotal - discountAmount).toFixed(2) : hasGst ? gTotal.toFixed(2) : netTotal.toFixed(2)
                                            } */}
                                            </div>
                                        </Col>
                                        <Col className='col-sm-6 col-12'>
                                            <div className='mb-2'>
                                                <Label>Discount Type</Label>
                                                <Select
                                                    isDisabled={netTotal === 0}
                                                    menuPlacement='auto'
                                                    menuPortalTarget={document.body}
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
                                            <div className='mb-1'>
                                                <Label>Discount</Label>
                                                <Input
                                                    className='discountField'
                                                    type='number'
                                                    max={100}
                                                    value={discount}
                                                    placeholder='Enter discount here'
                                                    onChange={e => setDiscount(e.target.value)}
                                                    disabled={disabled || netTotal === 0}
                                                />
                                                {/* {
                                                    discountType === 'percentage' && discount > 0 ? (
                                                        <span className='text-small'>
                                                            (₹  {((netTotal) * (Number(discount) / 100)).toLocaleString()})
                                                        </span>
                                                    ) : null
                                                } */}
                                            </div>
                                            <div className='text-center pt-1'>
                                                <div className="d-sm-flex">
                                                    {
                                                        discount && discount > 0 && gTotal > 0 ? (
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
                        </Row>
                    </Col>
                </> : <>
                    <div className='text-center '>
                        <h5>Sorry! No Rooms Available</h5>
                    </div>
                </>
                }

                <Col className='col-12'>
                    {
                        confirm && selRooms.length > 0 && emptyFlag === false ? (
                            <>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Room Type</th>
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
                                        {
                                            selRooms.map((arr, index) => {
                                                console.log('arr', arr)
                                                return (
                                                    <NewNoOfPeople
                                                        key={index}
                                                        arr={arr}
                                                        roomRateArr={roomRateArr}
                                                        ratePlans={ratePlans}
                                                        newRatePlans={newRatePlans}
                                                        dateRate={dateRate}
                                                        setDateRate={setDateRate}
                                                        handleRefresh={handleRefresh}
                                                        setExtraAdultPrice={setExtraAdultPrice}
                                                        setExtraChildPrice={setExtraChildPrice}
                                                        setExtraInfantPrice={setExtraInfantPrice}
                                                        extraAdultPrice={extraAdultPrice}
                                                        extraChildPrice={extraChildPrice}
                                                        extraInfantPrice={extraInfantPrice}
                                                    />
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </>) : confirm && emptyFlag ? (
                                <h3 className='text-center m-1'>There is not Rate plan for the selected Room!, set a Rateplan for the room to book it.</h3>
                            ) : null
                    }
                </Col>
            </Row>
            <Row>
                <div className=' d-flex justify-content-between'>
                    <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button>
                    <Button type='submit' color='primary' className='btn-next' onClick={handleRoomsBooked} disabled={confirm === false}>
                        Book Rooms
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Row>
        </>
    )
}

export default NewSelectRoom