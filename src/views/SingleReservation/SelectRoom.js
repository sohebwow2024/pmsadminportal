import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import { toast } from 'react-hot-toast'
import Select from 'react-select'
import NoOfPeople from './NoOfPeople'
import moment from 'moment'
import { disposeStore } from '@store/booking'
// ** Store & Actions
import { store } from '@store/store'
import { setRoomsBooked, setPrice, setBookingSourceDropdownStore, setGuestDetailDropdownStore, setBookingDetailStore, setLoaderStore } from '@store/booking'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import { useNavigate } from 'react-router-dom'
// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/input-number/input-number.scss'

const SelectRoom = ({ stepper }) => {
    console.log('jhfdjh');
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    const bookingStore = useSelector(state => state.booking)
    console.log('cout', bookingStore.checkOutDate)

    const roomName = bookingStore.roomsAvailView
    const roomRates = bookingStore.rateArr
    const outDate = moment(bookingStore.checkOutDate).format('l')
    const inDate = moment(bookingStore.checkInDate).format('l')

    // const [duration] = useState(outDate ? moment(outDate).diff(inDate, 'days') : moment(bookingStore.checkOutDate).diff(moment(bookingStore.checkInDate), 'days'))
    let duration = moment(outDate).diff(inDate, 'days')

    const discountOptions = [
        { value: 'percentage', label: '%' },
        { value: 'flat', label: 'Flat' }
    ]

    const usePrevious = (value) => {
        const ref = useRef()

        useEffect(() => {
            ref.current = value
        }, [value])

        return ref.current
    }

    const [roomAvailArr, setRoomAvailArr] = useState([])
    const [bookedRooms] = useState([])
    const [confirm, setConfirm] = useState(false)

    const [adults, setAdults] = useState(0)
    const [childrens, setChildrens] = useState(0)
    const [infants, setInfants] = useState(0)

    const [discount, setDiscount] = useState()
    const [discountType, setDiscountType] = useState()
    const [discountAmount, setDiscountAmount] = useState(0)
    const [disabled, setDisabled] = useState(false)

    const [mealsList, setMealsList] = useState([])

    const prevDiscount = usePrevious(discount)

    const [rooms, setRooms] = useState(0)
    const [cost, setCost] = useState(0)
    const [gst, setGst] = useState(0)
    const [total, setTotal] = useState(0)
    const [netCost, setNetCost] = useState(0)
    const [hasGst, setHasGst] = useState(true)
    const bookingData = []

    const [dropdownLoader, setDropdownLoader] = useState(false)

    console.log(netCost)

    const handleHasGST = e => {
        if (e.target.checked) {
            setHasGst(true)
        } else {
            setHasGst(false)
        }
    }

    const handleDiscount = () => {
        console.log('kuch to')
        console.log(discountType)
        if (!cost) {
            toast.error("Please confirm room selection first")
            return
        }
        if (discountType === 'flat') {
            const disAmount = Number(discount)
            const netAmount = cost - disAmount
            // setNetCost(netAmount)
            setTotal(netAmount + gst)
            setDisabled(true)
            setDiscountAmount(disAmount)
        } else if (discountType === 'percentage') {
            const disAmount = (cost * (Number(discount) / 100))
            setDiscountAmount(disAmount)
            // const netAmount = cost - discountAmount
            // setNetCost(netAmount)
            console.log(cost)
            console.log(disAmount)
            console.log(gst)
            setTotal((cost - disAmount) + gst)
            setDisabled(true)
        } else {
            toast.error('Select Discount Type first')
        }
    }

    const handleCalc = () => {
        // const totalRooms = bookedRooms.reduce((acc, object) => { return acc + object.quantity }, 0)
        const totalRooms = bookedRooms.length
        setRooms(totalRooms)
        const totalAdults = bookedRooms.reduce((acc, object) => { return acc + Number(object.adult_occ) }, 0)
        setAdults(totalAdults)
        const totalChildrens = bookedRooms.reduce((acc, object) => { return acc + Number(object.child_occ) }, 0)
        setChildrens(totalChildrens)
        const totalInfants = bookedRooms.reduce((acc, object) => { return acc + Number(object.infant_occ) }, 0)
        setInfants(totalInfants)
        const totalOneDayCost = bookedRooms.reduce((acc, object) => {
            // const meal_price = ('selected_meal_price' in object) ? object.selected_meal_price : 0

            // return acc + Number(object.price) + Number(meal_price) + Number(object.extra_adult_price) + Number(object.extra_child_price)
            return acc + Number(object.total_price)
        }, 0)
        console.log('totalOneDayCost', totalOneDayCost, typeof totalOneDayCost)
        const totalCost = totalOneDayCost * duration
        setCost(totalCost)
        // setNetCost(totalCost)
        const totalGst = bookedRooms.reduce((acc, object) => { return acc + Number(object.gst) }, 0) * duration
        console.log('totalGst', totalGst)
        if (hasGst) {
            setGst(totalGst)
            setTotal(totalCost + totalGst)
        } else {
            setGst(0)
            setTotal(totalCost + 0)
        }


        console.log(totalOneDayCost)
        console.log(discountAmount)
        if (discountAmount > 0) {
            console.log('kuch to hai')
            if (discountType === 'flat') {
                const disAmount = Number(discount)
                const netAmount = totalCost - disAmount
                // setNetCost(netAmount)
                if (hasGst) {
                    setTotal(netAmount + totalGst)
                } else setTotal(netAmount)
                setDiscountAmount(disAmount)
            } else if (discountType === 'percentage') {
                const dicAmount = (totalCost * (Number(discount) / 100))
                setDiscountAmount(dicAmount)
                console.log(dicAmount)
                // const netAmount = cost - discountAmount
                // setNetCost(netAmount)
                if (hasGst) {
                    setTotal((totalCost - dicAmount) + totalGst)
                } else setTotal(totalCost - dicAmount)

            }
        }
    }

    useEffect(() => {
        handleCalc()
    }, [confirm, hasGst])

    const handleRemoveDiscount = () => {
        if (hasGst) {
            setTotal(cost + gst)
        } else setTotal(cost)
        setDiscount(0)
        setDisabled(false)
        setDiscountAmount(0)
    }

    // const userId = 

    const bookingSource = async () => {
        setDropdownLoader(true)
        try {
            const bookinSourceBody = { LoginID, Token, Seckey: "abc", Event: "select" }
            const response = await axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody)

            store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
        } catch (error) {
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
            console.log("Booking Source", error.message)
        }
    }

    const guestDetail = async () => {
        setDropdownLoader(true)
        try {
            const guestDetailBody = { LoginID, Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            console.log("Guest Data-", guestResponse?.data[0])
            store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
        } catch (error) {
            setDropdownLoader(false)
            store.dispatch(setLoaderStore(dropdownLoader))
            console.log("Guest Detail Error", error.message)
        }
    }

    const handleRoomsBooked = () => {
        console.log('bookedRooms', bookedRooms);
        let adult_occ_arr = []
        let meals_for_rooms = []
        bookedRooms.every(room => adult_occ_arr.push(room.adult_occ))
        bookedRooms.every(room => meals_for_rooms.push(room.selected_meal))
        const adult_occ_status = adult_occ_arr.includes(0)
        const meals_room_status = meals_for_rooms.includes("")
        if (bookedRooms.length > 0 && adult_occ_status === false && meals_room_status === false) {
            store.dispatch(setRoomsBooked(bookedRooms))
            store.dispatch(setPrice({ cost, gst, total, discount }))
            bookingSource()
            guestDetail()
            store.dispatch(setBookingDetailStore(bookingData))
            toast.success(`${bookedRooms.length} Rooms selected for reservation`)
            stepper.next()

        } else {
            bookedRooms.length === 0 ? toast.error('Select quantity of Room/Rooms first') : null
            adult_occ_status ? toast.error('Select No. of Adult Occupants for all Rooms!') : null
            meals_room_status ? toast.error("Select Rate Plan for all Rooms!") : null
        }
    }

    const getAdjustment = async () => {
        try {
            const res = await axios.get('/rooms/adjustment', {
                headers: {
                    LoginID,
                    Token,
                    SecKey: 'abc'
                },
                params: {
                    FromDate: moment(bookingStore.checkInDate).format('YYYY-MM-DD'),
                    Todate: moment(bookingStore.checkOutDate).format('YYYY-MM-DD'),
                    For: "PMS"
                }
            })
            console.log('res-room availability', res)
            setRoomAvailArr(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getAdjustment()
    }, [bookingStore])


    const Options = (num, name) => {
        const arr = []
        // let new_num
        // if (num <= 0) {
        //     new_num = 5 + num
        // } else {
        //     new_num = num
        // }
        // for (let i = 0; i <= new_num; i++) {
        let roomAvailObj = roomAvailArr.filter(r => r.RoomID === name)
        console.log('roomAvailObj', roomAvailObj)
        let newNum
        if (roomAvailObj[0]?.RoomCount > 0) {
            newNum = num + roomAvailObj[0]?.RoomCount
        } else {
            newNum = num
        }
        for (let i = 0; i <= newNum; i++) {
            arr.push({ value: i, label: i, name })
        }
        return arr
    }

    const updateBookRoom = (room, index) => {
        bookedRooms[index] = room
        handleCalc()
    }
    const navigate = useNavigate()
    const dispose = () => {
        console.log('bookingStore', bookingStore)
        store.dispatch(disposeStore(true))
        handleOpen()
        navigate('/reservation')
        window.location.reload()
        //stepper.to(0)
    }

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)
    const confirmRefresh = () => {
        // onSubmit(e)

        console.log("disposing....")
        dispose()
    }

    return (
        <>
            <Row>
                {roomName && roomName.length > 0 ? <>
                    <Col className='col-md-12'>
                        <Row>
                            <Col className='col-12 col-md-6 pb-2'>
                                <Row>
                                    <Col className='d-flex flex-row justify-content-between align-items-center'>
                                        <h4>Room Category</h4>
                                        <h4>No. of Rooms Booked</h4>
                                    </Col>
                                </Row>
                                {
                                    roomName && roomName?.map((cat, index) => {
                                        const roomAvailObj = roomAvailArr.filter(r => r.RoomID === cat.RoomID)
                                        let extraCount = roomAvailObj.length > 0 ? roomAvailObj[0]?.RoomCount : 0
                                        return (
                                            <Row key={index} className='my-1 d-flex flex-row justify-content-between align-items-center' >
                                                <Col>
                                                    <h5>{cat.RoomDisplayName}</h5>
                                                    <h6>(Available1 - {cat.RoomsAvailable + extraCount})</h6>
                                                </Col>
                                                <Col className='d-flex justify-content-end'>

                                                    <Select
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select roomsBookedDropdown pe-1'
                                                        classNamePrefix='select'
                                                        options={Options(cat.RoomsAvailable, cat.RoomID)}
                                                        onChange={e => {
                                                            setConfirm(false)
                                                            // const gstAmount = cat.RoomRate * cat.IGST_P / 100
                                                            const roomObj = {
                                                                roomID: cat.RoomID,
                                                                roomCat: cat.RoomDisplayName,
                                                                adultsAllowed: cat.AdultMax,
                                                                infantAllowed: cat.InfantMax,
                                                                childrenAllowed: cat.ChildMax,
                                                                price: cat.RoomRate,
                                                                gst: 0,
                                                                gst_percentage: cat.IGST_P,
                                                                // adult_occ: cat.AdultBase,
                                                                adult_occ: 0,
                                                                child_occ: 0,
                                                                infant_occ: 0,
                                                                selected_meal: '',
                                                                // selected_meal: null,
                                                                selected_meal_price: 0,
                                                                extra_adult_price: 0,
                                                                per_extra_adult_price: cat.ExtraAdultPrice,
                                                                extra_child_price: 0,
                                                                per_extra_child_price: cat.ExtraChildPrice,
                                                                adultBase: cat.AdultBase,
                                                                childBase: cat.ChildBase,
                                                                total_price: cat.RoomRate
                                                            }
                                                            // console.log("0", bookedRooms, e)
                                                            console.log(bookedRooms)
                                                            if (bookedRooms.length === 0) {
                                                                for (let i = 0; i < e.value; i++) {
                                                                    bookedRooms.push(roomObj)
                                                                }
                                                                // console.log("1", bookedRooms)
                                                            } else if (bookedRooms.some(e => e.roomCat === cat.RoomDisplayName)) {

                                                                const filterArr = bookedRooms.filter(room => room.roomCat === cat.RoomDisplayName).length
                                                                // console.log("F0", filterArr)
                                                                if (filterArr < e.value) {
                                                                    for (let i = 0; i < e.value - filterArr; i++) {
                                                                        bookedRooms.push(roomObj)
                                                                    }
                                                                    // console.log("2", bookedRooms)
                                                                } else {
                                                                    bookedRooms.splice(bookedRooms.findIndex(room => room.roomCat === cat.RoomDisplayName), filterArr - e.value)
                                                                    // console.log("3", bookedRooms)
                                                                }
                                                            } else {
                                                                for (let i = 0; i < e.value; i++) {
                                                                    bookedRooms.push(roomObj)
                                                                }
                                                                //console.log("4", bookedRooms)
                                                            }
                                                            bookedRooms.map((elm, index) => {
                                                                const temp = Object.assign({}, elm)

                                                                temp.id = index + 1
                                                                bookedRooms[index] = temp
                                                                return temp
                                                            })
                                                        }
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                                <Row>
                                    <Col className='text-center mb-1'>
                                        <Button.Ripple color='success' onClick={() => {
                                            if (bookedRooms.length > 0) {
                                                setConfirm(true)
                                                handleCalc()
                                                // mealsDetail()
                                            } else {
                                                toast.error('Please select quantity of rooms to book.')
                                            }
                                        }}
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
                                            <div className='py-1 ps-sm-1'>Total Room: {rooms}</div>
                                            <div className='py-1 ps-sm-1'>Total Night's: {duration}</div>
                                            <div className='py-1 ps-sm-1'>Total Adults: {adults}</div>
                                            {childrens !== 0 && <div className='my-1 ps-1'>Total Childrens: {childrens}</div>}
                                            {infants !== 0 && <div className='my-1 ps-1'>Total Infants: {infants}</div>}
                                            <div className='py-1 ps-sm-1'>Total Net Cost: ₹ {cost ? +cost : 0}</div>
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
                                            <div className='py-1 ps-sm-1'>Total GST: ₹ {gst.toFixed(2)}</div>
                                            {discountAmount && discountAmount > 0 ? <div className='py-1 ps-sm-1'>Total Discount Amount: ₹ {discountAmount}</div> : <></>}
                                            <div className='py-1 ps-sm-1 text-nowrap'>Payable Amount: ₹ {total ? +total : 0}</div>
                                        </Col>
                                        <Col className='col-sm-6 col-12'>
                                            <div className='mb-2'>
                                                <Label>Discount Type</Label>
                                                <Select
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
                                                    // min={0}
                                                    max={100}
                                                    value={discount}
                                                    placeholder='Enter discount here'
                                                    // onChange={e => handleDiscountValue(e)}
                                                    onChange={e => setDiscount(e.target.value)}
                                                    disabled={disabled}
                                                />
                                                {
                                                    discountType === 'percentage' && discount > 0 ? (
                                                        <span className='text-small'>
                                                            (₹  {((cost) * (Number(discount) / 100)).toLocaleString()})
                                                        </span>
                                                    ) : null
                                                }
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
                                                                <Button.Ripple className='ms-1' color='warning' onClick={() => {
                                                                    handleRemoveDiscount()
                                                                }}>Remove</Button.Ripple>
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
                        confirm ? (
                            <>
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
                                        {
                                            bookedRooms.map((arr, index) => {
                                                return (
                                                    <NoOfPeople
                                                        key={index}
                                                        r={arr}
                                                        i={index}
                                                        updateBookRoom={updateBookRoom}
                                                        bookingData={bookingData}
                                                        rates={roomRates}
                                                    />

                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </>) : null
                    }
                </Col>
            </Row>
            <Row>
                <div className=' d-flex justify-content-between'>
                    <Button color='secondary' className='btn-prev' outline onClick={() => handleOpen()}>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button>
                    <Button type='submit' color='primary' className='btn-next' onClick={handleRoomsBooked} disabled={confirm === false}>
                        {/* <span className='align-middle d-sm-inline-block d-none'>
                        {
                            loader ? (
                                <Spinner color='#FFF' />
                            ) : 'Book Rooms'
                        }
                    </span> */}
                        Book Rooms
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Row>
            <Modal className='modal-dialog-centered' isOpen={open} toggle={handleOpen} backdrop={false}>
                <ModalHeader className='bg-transparent' toggle={handleOpen}>
                    <p>Are You Sure? You want to go back.</p>
                    You will have to add the booking procedure again.
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button className='m-1' color='danger' onClick={confirmRefresh}>Confirm</Button>
                            <Button className='m-1' color='secondary' outline onClick={handleOpen}>Cancel</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default SelectRoom