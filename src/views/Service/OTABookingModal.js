import { React, useEffect, useRef, useState } from 'react'
import { Col, Form, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap'
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
import { ArrowRight, Plus, PlusCircle, XCircle } from 'react-feather'
import toast from 'react-hot-toast'
import NewBookingSrcTypeModal from './NewBookingSrcTypeModal'
import { Controller } from 'react-hook-form'

const discountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'flat', label: 'Flat' }
]

const OTABookingModal = ({ open, handleOpen, handleOnHoldOpen, id, getIbeBooking }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, HotelName, PropertyID, CompanyID } = getUserData

    const [bookFlag, setBookFlag] = useState(false)
    const [hotelData, setHotelData] = useState([])
    const [otaData, setOtaData] = useState([])
    const [roomNames, setRoomNames] = useState('')
    const [pstatusName, setPstatusName] = useState('')
    const [data, setData] = useState([])
    const [cust_data, setCust_data] = useState([])
    const [affiliation, setAffiliation] = useState([])
    const [roomData, setRoomData] = useState([])
    const [bookingData, setBookingData] = useState([])
    const [extraData, setExtraData] = useState([])
    const [channelData, setChannelData] = useState([])

    const [bookSrcOpt, setBookSrcOpt] = useState([]);
    const [bookSrcTypOpt, setBookSrcTypOpt] = useState([]);
    const [bookSrcName] = useState('OTA')
    const [bookSrcID, setBookSrcID] = useState('')
    const [paymentTypeID, setPaymentTypeID] = useState('')
    const [bookSrcTypId, setBookSrcTypId] = useState('')
    // const [payFull, setPayFull] = useState('Yes')
    const [payFull, setPayFull] = useState("");
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])
    const [ptypeName, setPtypeName] = useState('')
    const [payTypeID, setPayTypeId] = useState('')
    const [payModeID, setPayModeID] = useState('')
    const [PayId, setPayId] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [userDetailsStatus, setUserDetailsStatus] = useState(false)
    const [booker, setBooker] = useState('')
    const [newBooker, setNewBooker] = useState('')

    const [guestName, setGuestName] = useState('')
    const [guestLastName, setGuestLastName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [mobNumber, setMobNumber] = useState('')
    const [guestID, setGuestID] = useState('')
    const [guestData, setGuestData] = useState('')
    const [checkGuest, setCheckGuest] = useState(false)

    const [pref, setPref] = useState('')
    const [inote, setInote] = useState('')

    const [inDate, setInDate] = useState('')
    const [outDate, setOutDate] = useState('')
    const [paymentModeID, setPaymentModeID] = useState('')
    const [amount, setAmount] = useState('')
    const [IBEData, setIBEData] = useState('')
    const [regionData, setRegionData] = useState([])
    const [mealPlanArr, setMealPlanArr] = useState([])
    // const [pricedata] = useState(roomData[0]?.price)
    let pricedata = roomData[0]?.rice
    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(!openModal)
    const [DeleteOpen, setDeleteOpen] = useState(false);
    const handleDeleteOpen = () => setDeleteOpen(!DeleteOpen);

    const [cancelOpen, setCancelOpen] = useState(false);
    const handleCancelOpen = () => setCancelOpen(!cancelOpen);


    const handleCancelBooking = async (id) => {
        try {
            const res = await axios.post(`/IBE/remove/bookingdetail`, {}, {
                headers: {
                    LoginID,
                    Token,
                    seckey: 'abc'
                },
                params: {
                    id: id,
                    eventType: 'Cancel'
                }
            });
            console.log("cancelres", res);
            if (res.data[0][0].status === "Success") {
                handleOpen();
                toast.success(`${id} - booking is cancelled!`);
                handleCancelOpen();
            }
        } catch (err) {
            console.log("cancelerr", err);
            toast.error(err.response);
            handleCancelOpen();
        }
    };

    const CancelModal = ({ id, open, handleCancelOpen }) => {



        return (
            <>
                <Modal
                    isOpen={open}
                    toggle={handleCancelOpen}
                    className="modal-dialog-centered modal-lg"
                >
                    <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
                        Cancel Booking of - {id}
                    </ModalHeader>
                    <ModalBody>
                        <h3 className="text-center">
                            Are you sure you want to cancel this booking?
                        </h3>
                        <Col className="text-center">
                            <Button
                                className="m-1"
                                color="danger"
                                onClick={() => handleCancelBooking(id)}
                            >
                                Confirm
                            </Button>
                            <Button
                                className="m-1"
                                color="primary"
                                onClick={() => handleCancelOpen()}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </ModalBody>
                </Modal>
            </>
        );
    };



    const getIbeBookingbyID = async () => {
        try {
            const res = await axios.get('/IBE/list', {
                headers: {
                    LoginID,
                    Token,
                }
            })
            let data = res?.data[0]
            data.map(item => {
                if (item.id === id) {
                    let newdata = JSON.parse(item.jsonBookingRequest)
                    console.log('jonBookingRequest', item.jsonBookingRequest)
                    setIBEData(newdata)
                    newdata?.transactionDetails.map(item => {
                        setPaymentModeID(item.PaymentTypeID)
                    })
                }
            })
            // setTdata(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getIbeBookingbyID()
    }, [])


    const handleDeleteBooking = async () => {
        try {
            const res = await axios.post(`/IBE/remove/bookingdetail`, {}, {
                headers: {
                    LoginID,
                    Token,
                    seckey: 'abc'
                },
                params: {
                    id: id,
                    eventType: 'Cancel'
                }
            });
            if (res.data[0][0].status === "Success") {
                // handleOpen();
                // handelReset()
                toast.success(`${id} - booking is Canceled!`);
                handleDeleteOpen();
            }
        } catch (err) {
            console.log("cancel", err);
            toast.error(err.response);
            handleDeleteOpen();
        }
    };


    // old code
    const getBookingData = async () => {
        try {
            const res = await axios.get(`booking/GetReservationFromSTAAH/${id}`, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            console.log("getIbeBookingres", res);
            setData(res?.data)
            setCust_data(JSON.parse(res?.data[0][0].customer))
            setAffiliation(JSON.parse(res?.data[0][0].affiliation))
            setRoomData(JSON.parse(res?.data[0][0].rooms))
            setBookingData(JSON.parse(res?.data[0][0]?.booking_json))
            setExtraData(res?.data[0][0])
            setChannelData(res?.data[3][0])
        } catch (error) {
            console.log("Error", error);
        }
    }

    const getRoomName = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/bookingdata/roomdetails`, obj)
            let result = res?.data[0].map(r => {
                return { RoomID: r.roomID, Name: r.roomDisplayName }
            })
            setRoomNames(result)
        } catch (error) {
            console.log('error', error)
        }
    }

    const getBookSrcOpt = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select",
            };
            const res = await axios.post(`/getdata/bookingdata/bookingsource`, obj);
            let result = res?.data[0];
            if (result.length > 0) {
                let arr = result.map(s => {
                    return { value: s.bookingSourceID, label: s.bookingSource }
                })
                let bid = arr.filter(s => {
                    if (s.label === bookSrcName) {
                        return s
                    }
                })
                setBookSrcOpt(arr)
                setBookSrcID(bid[0]?.value)
            } else {
                setBookSrcOpt([]);
            }
        } catch (error) {
            console.log("BookSrcOptErr", error);
        }
    }

    const getBookSrcTypOpt = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                // BookingSourceID: bookingSourceId,
                BookingSourceID: 'BSID20230302AA00010',
                Event: "select",
            };
            const res = await axios.post("/getdata/bookingdata/sourcetype", obj);
            let result = res?.data[0];
            if (result.length > 0) {
                let newArr = result.map((s) => {
                    return { value: s?.sourceTypeID, label: s?.sourceType, ...s };
                });
                setBookSrcTypOpt(newArr);
            } else {
                setBookSrcTypOpt([]);
            }
        } catch (error) {
            console.log("BookTypOpt", error);
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
                setPaymentTypeOptions([])
            }
        } catch (error) {
            console.log("Payment Type List Error", error.message)
            setPaymentTypeOptions([])
        }
    }

    const paymentModeList = async () => {
        try {
            const pmodeobj = {
                LoginID,
                Token,
                Seckey: "abc",
                PaymentTypeID: paymentModeID,
                Event: "select"
            }
            const res = await axios.post(`/getdata/bookingdata/paymentmode`, pmodeobj)
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

    const getUserDetailsData = async () => {
        const userDetailObject = [
            {
                UserID: "0",
                FirstName: "Others",
                Email: ""
            }
        ]

        try {
            const userDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.userID, label: `${userDetail.firstName} : ${userDetail.email}` }
            })
            setUserDetails(userDetailsOption)
            if (userDetails !== []) { setUserDetailsStatus(true) }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }





    const getGuestData = async () => {
        try {
            const guestDetailBody = { LoginID: LoginID, Token: Token, Seckey: "abc", SearchPhrase: "", Event: "select" }
            const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)
            const data = guestResponse.data[0]
            setGuestData(data)
            data && data.map((item) => {
                let result = item.guestMobileNumber.replace('+91', '')
                if (item.lastName === cust_data?.last_name &&
                    item.GuestEmail === cust_data?.email &&
                    result === cust_data?.telephone) {
                    setGuestID(item.guestID)
                    setCheckGuest(true)
                    return
                }
            })
        } catch (error) {
            console.log('error', error)
        }
    }

    const NameByRoomID = (rid) => {
        let roomObj = roomNames && roomNames.filter(n => n?.roomID === rid)
        return roomObj[0]?.name
    }

    const setupPtypeID = (id) => {
        if (paymentTypeOptions.length > 0) {
            let ptid = paymentTypeOptions.filter(p => {
                if (p.label === ptypeName) {
                    return p
                }
            })
            setPayTypeId(ptid[0]?.value)
        }
    }

    // const getRegionDetails = async () => {
    //     try {
    //         let obj = {
    //             LoginID,
    //             Token,
    //             Seckey: 'abc',
    //             Event: "state_by_city",
    //             CityName: cust_data?.city
    //         }
    //         const res = await axios.post(`/getdata/regiondata/citydetails`, obj)
    //         console.log('regionRes', res)
    //         if (res.data[0].length > 0) {
    //             setRegionData(res?.data[0])
    //         }
    //     } catch (error) {
    //         console.log('RegionError', error)
    //     }
    // }

    useEffect(() => {
        getBookingData()
        getRoomName()
        getBookSrcOpt()
        paymentTypeList()
        getUserDetailsData()

    }, [])

    useEffect(() => {
        getGuestData()
    }, [cust_data])

    useEffect(() => {
        setInDate(roomData[0]?.arrival_date)
        setOutDate(roomData[0]?.departure_date)
    }, [roomData])



    const getMealPlans = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: 'abc',
                Event: 'selectall'
            }
            const res = await axios.post(`/getdata/mealdetails`, obj)
            let result = res?.data[0]
            if (result.length > 0) {
                let arr = result.map(m => {
                    return { value: m.mealID, label: m.ratePlan }
                })

                setMealPlanArr(arr)
            } else {
                setMealPlanArr([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getBookSrcTypOpt()
    }, [bookSrcID, openModal])


    useEffect(() => {
        getMealPlans()
    }, [roomData])

    useEffect(() => {
        if (bookingData?.reservations?.length > 0 && bookingData?.reservations[0]?.paymenttype === "Hotel Collect") {
            setPtypeName('Pay At Hotel')
            setPayFull('No')
        } else if (bookingData?.reservations?.length > 0 && bookingData?.reservations[0]?.paymenttype === "Channel Collect") {
            setPtypeName('Prepaid')
            setPayFull('No')
        }
    }, [bookingData])

    useEffect(() => {
        paymentModeList()
    }, [payTypeID])

    useEffect(() => {
        getUserDetailsData()
    }, [userDetailsStatus])

    useEffect(() => {
        setupPtypeID()
    }, [paymentTypeOptions, ptypeName, PayId])

    useEffect(() => {
        if (bookSrcTypOpt.length > 0) {
            let include_arr = bookSrcTypOpt?.filter(c => c.Code === channelData?.otA_Code)
            setBookSrcTypId(include_arr[0]?.sourceTypeID)
        } else {
            setBookSrcTypId('')
        }
    }, [bookSrcTypOpt, channelData])

    const handleNewGuest = async () => {

        try {
            const guestRegisterBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Name: cust_data?.first_name,
                LastName: cust_data?.last_name,
                PrefixN: '+91',////how??
                MobileNumber: cust_data?.telephone,
                Type: "Normal User",
                Email: cust_data?.email,
                DOB: moment(new Date()).format('YYYY-MM-DD'),////how??
                Address: cust_data?.address,
                CountryID: regionData[0]?.countryID,
                StateID: regionData[0]?.stateID,
                DistrictID: regionData[0]?.stateID,
                CityID: regionData[0]?.cityID,
                Pincode: cust_data?.zip,
                FloorID: null,
                SpecialNote: "",
                Event: "insert"
            }
            const res = await axios.post(`/setdata/guestdetails`, guestRegisterBody)
            setGuestID(res.data[0][0]?.guestID)
            toast.success('New Guest Added')
        } catch (error) {
            console.log("Guest Register Error", error.message)
        }
    }

    let newArr = roomData.length > 0 && roomData?.map(r => {
        let mealidarr = mealPlanArr.filter(m => m.label === r.price[0]?.rate_id)
        let mealid = mealidarr[0]?.value
        let newObj = {
            RoomID: r.id,
            Adult: r.numberofadults,
            Children: r.numberofchildren,
            Infant: '',
            MealID: mealid
        }
        return newObj
    })

    let newRateData = roomData?.length > 0 && roomData.map((r) => {
        // let a = moment("2023-05-25");
        // let b = moment("2023-05-27");
        let a = moment(r.arrival_date);
        let b = moment(r.departure_date);
        let result = b.diff(a, 'days')
        let pqr;
        let newObj;
        for (let i = 0; i < result; i++) {
            // pqr = a.add(i, 'days')
            pqr = moment(r.arrival_date).add(i, "days").format()
            newObj = {
                BookingDate: moment(pqr).format('YYYY-MM-DD'),
                RoomID: r.id,
                RoomRate: r?.price[0]?.priceaftertax,
                ExtraAdultRate: 0,
                ExtraChildRate: 0,
                RatePlanId: r?.price[0]?.rate_id
            }
        }
        return newObj

    })
    console.log('IBEData', IBEData);

    const handleBooking = async () => {
        try {
            let data = {
                bd: IBEData,
                // jsonConfirmBookingReq: IBEData,
            }
            const res = await axios.post(`/IBE/transfer/confirm/bookingdetails`, IBEData, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: "abc"
                },
                params: {
                    id: id,
                }

            })
            const responseData = res?.data[0]
            toast.success('Booking Created')
            handleOpen()
            getIbeBooking()

        } catch (error) {
            console.log("Booking Error", error)
            toast.error("Something went WRONG!")
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        setBookFlag(true)
        handleBooking()
        // if (bookSrcTypId && payModeID && booker && booker !== '0') {
        //     // console.log('hitter2');
        // } else if (bookSrcTypId && payModeID && booker === '0' && newBooker !== '') {
        //     handleBooking()
        // }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={() => handleOpen()}
                className='modal-dialog-centered modal-xl'
                backdrop={false}
            >
                <ModalHeader toggle={() => handleOpen()}>Booking - {id}</ModalHeader>
                <ModalBody>
                    <Form onReset={() => handleOpen()} onSubmit={e => handleSubmit(e)}>
                        {IBEData?.transactionDetails?.length > 0 && IBEData?.transactionDetails?.map(item => {
                            console.log('transactionDetailsitem', item);
                            return (
                                <Row>
                                    <Col>
                                        <Label className='form-label' for='checkIn_date'>
                                            Check-In Date:
                                        </Label>
                                        <Input
                                            type='text'
                                            name='inDate'
                                            value={moment(item.CheckInDate).format('L')}
                                            disabled
                                        />
                                    </Col>
                                    <Col>
                                        <Label className='form-label' for='checkOut_date'>
                                            Check-Out Date:
                                        </Label>
                                        <Input
                                            type='text'
                                            name='outDate'
                                            value={moment(item.CheckOutDate).format('L')}
                                            disabled
                                        />
                                    </Col>
                                    <Col>
                                        <Label className='form-label' for='duration'>
                                            Total Duration:(Nights)
                                        </Label>
                                        <Input
                                            type='number'
                                            name='duration'
                                            value={moment(item.CheckOutDate).diff(moment(item.CheckInDate), 'days')}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            )
                        })}
                        <Row>
                            <Col>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Room Category</th>
                                            <th className='occupantsCol'>Occupants</th>
                                            <th className='mealCol'>Rate Plan</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            IBEData?.bookingRateDetails?.length > 0 && IBEData?.bookingRateDetails?.map((i, idx) => {
                                                return (
                                                    <tr key={idx}>
                                                        <td>
                                                            <div className='d-flex flex-column'>
                                                                <Label className='fs-4'>{NameByRoomID(i?.RoomID)}</Label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {IBEData?.bookingDetails?.map(item => {
                                                                return (
                                                                    <>
                                                                        {/* if(item.RoomID===i?.RoomID){} */}
                                                                        <Label className='fs-4 mx-1'> {(item.RoomID === i?.RoomID) ? ` Adults: ${item?.Adult}` : ''}</Label>
                                                                        <Label className='fs-4 mx-1'>{(item.RoomID === i?.RoomID) ? ` Children: ${item?.Children}` : ''}</Label>
                                                                    </>
                                                                )
                                                            })}
                                                        </td>
                                                        <td>
                                                            <Label className='fs-4'>{i?.RatePlanId}</Label>
                                                        </td>
                                                        <td>
                                                            <Label className='fs-5'>{`${i?.RoomRate}/-`}</Label>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Service/addons</th>
                                            <th className='occupantsCol'>Nights</th>
                                            <th className='mealCol'>Price Per Unit</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            roomData && roomData[0]?.addons.map((a, idx) => {
                                                return (
                                                    <tr key={idx}>
                                                        <td className='fs-5 py-1'>{a?.name}</td>
                                                        <td className='fs-5 py-1' >{a?.nights}</td>
                                                        <td className='fs-5 py-1' >{a?.priceperunit}</td>
                                                        <td className='fs-5 py-1' >{`${a?.price}/-`}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col>
                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                    <div className='w-100 me-1'>
                                        <Label className='form-label' for='booking_source'>
                                            Booking Source:
                                        </Label>
                                        <Input
                                            disabled
                                            type='text'
                                            name='guest'
                                            value={'Booking Engine'}
                                        />
                                        {/* <Select
                                            placeholder=''
                                            menuPlacement='auto'
                                            aria-readonly
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            isDisabled
                                            value={bookSrcOpt?.filter(c => c.value === "BSID20230302AA00010")}
                                        // options={paymentTypeOptions}
                                        // onChange={val => {
                                        //     setPstatusName(val.label)
                                        //     setPstatus(val.value)
                                        // }}
                                        /> */}
                                    </div>
                                    <div className='w-100 ms-1'>
                                        <Label className='form-label' for='booking_type'>
                                            Source Type:
                                        </Label>
                                        <Input
                                            disabled
                                            type='text'
                                            name='guest'
                                            value={'Booking Engine'}
                                        />
                                        {/* <CreatableSelect
                                            placeholder="Select/Create source type"
                                            menuPlacement="auto"
                                            theme={selectThemeColors}
                                            className="react-select"
                                            classNamePrefix="select"
                                            isDisabled={bookSrcTypOpt.some(c => c.Code === channelData?.OTA_Code)}
                                            options={bookSrcTypOpt}
                                            value={bookSrcTypOpt?.filter(c => c.value === bookSrcTypId)}
                                            onChange={(c) => {
                                                setBookSrcTypId(c.value)
                                            }}
                                            formatCreateLabel={() =>
                                                `Create new Booking Type`
                                            }
                                            onCreateOption={() => handleOpenModal()}
                                            onFocus={() => {
                                                getBookSrcTypOpt()
                                            }}
                                        // invalid={bookFlag && bookSrcTypId === ""}
                                        /> */}
                                        {/* {bookSrcTypId === '' || bookSrcTypId === undefined && bookFlag && <Label className='text-danger'>Source Type is required!</Label>} */}
                                    </div>
                                </div>

                            </Col>
                            <Col>
                                <Label className='form-label' for='guest'>
                                    Guest Details:
                                </Label>
                                <div className='d-flex flex-row justify-content-between'>
                                    {IBEData?.guestDetails?.map(item => {
                                        return (
                                            <>
                                                <Row className='d-flex flex-column'>
                                                    <Col className='mb-1'><span className='fw-bold '>First Name: </span> {item?.Name}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>Last Name: </span> {item?.LastName}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>Email: </span> {item?.Email}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>Telephone: </span> {item?.Mobile}</Col>
                                                    {/* <Col className='mb-1'><span className='fw-bold '>Zip:</span> {item?.zip}</Col> */}
                                                </Row>
                                                <Row className='d-flex flex-column'>
                                                    <Col className='mb-1'><span className='fw-bold '>Address: </span> {item?.Address}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>Country: </span> {item?.CountryId}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>State: </span> {item?.StateId}</Col>
                                                    <Col className='mb-1'><span className='fw-bold '>City: </span> {item?.CityId}</Col>
                                                </Row>
                                            </>
                                        )
                                    })}
                                    {/* <Row className='d-flex flex-column'>
                                        <Col className='m-1'>
                                            {checkGuest === false ? <Button color='primary' size='sm' onClick={() => handleNewGuest()}><PlusCircle size={15} /> Add as New Guest</Button> : ''}
                                        </Col>
                                    </Row> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label className='form-label' for='note'>
                                    Note:
                                </Label>
                                {IBEData?.transactionDetails?.map(item => {
                                    return (
                                        <Input
                                            disabled
                                            type='textarea'
                                            name='guest'
                                            value={item?.SpecialNote}
                                        />
                                    )
                                })}
                            </Col>
                            <Col>
                                <Label className='form-label' for='amount'>
                                    Amount:
                                </Label>
                                {IBEData?.paymentDetails?.map(item => {
                                    return (
                                        <Input
                                            disabled
                                            type='text'
                                            name='guest'
                                            value={item?.TotalAmount}
                                        />
                                    )
                                })}
                            </Col>
                        </Row>
                        <hr className='mt-2' />
                        <Row>
                            {IBEData?.transactionDetails?.map(item => {
                                return (
                                    <>
                                        <Col>
                                            {paymentTypeOptions?.map(i => {
                                                return (
                                                    <>
                                                        {(i.value === item.PaymentTypeID) ? <>
                                                            <Label className='form-label' for='ptype'>
                                                                Payment Type
                                                            </Label>
                                                            <Input
                                                                disabled
                                                                type='text'
                                                                name='guest'
                                                                value={i.label}
                                                            // onChange={() => {
                                                            //     setPaymentModeID(item.PaymentModeID)
                                                            // }}
                                                            />
                                                        </> : ''}
                                                    </>
                                                )
                                            })}

                                        </Col>
                                        <Col>
                                            <Col>
                                                {paymentModeOptions?.map(i => {
                                                    return (
                                                        <>
                                                            {(i.value === item.PaymentModeID) ? <> <Label>
                                                                Payment Mode
                                                            </Label> <Input
                                                                    disabled
                                                                    type='text'
                                                                    name='guest'
                                                                    value={i.label}
                                                                /></> : ''}

                                                        </>
                                                    )
                                                })}
                                            </Col>

                                        </Col>
                                    </>
                                )
                            })}
                            {/* <Col className='mt-2'>
                                <Row>
                                    <Col>
                                        <Label className='Amount text-nowrap' for='fullAmount'>
                                            <Input className='me-1' type='radio' name='payFull' id='fullAmount' value="Yes" checked={payFull === "Yes"} onChange={e => (setPayFull(e.target.value), setAmount(extraData?.totalprice))} />
                                            
                                            Full Amt
                                        </Label>
                                    </Col>
                                    <Col className='p-0'>
                                        <Label className='Amount text-nowrap' for='partialAmount'>
                                            <Input className='mx-1' type='radio' name='payFull' id='partialAmount' value="No" checked={payFull === "No"} onChange={e => (setPayFull(e.target.value), setAmount(extraData?.totalprice === amount ? 0 : amount))} />
                                            
                                            Partial Amt
                                        </Label>
                                    </Col>
                                    {payFull === '' && <Label className='text-danger'>Payment Type is required!</Label>}
                                </Row>
                            </Col>
                            <Col>
                                <Label>
                                    Collected Amount
                                </Label>
                                <Col>
                                    <Input
                                        type='text'
                                        value={payFull === 'Yes' ? extraData?.totalprice : extraData?.otadue === '' ? 0 : extraData?.otadue}
                                        disabled
                                    />
                                </Col>
                                </Col> */}

                        </Row>
                        {/* <Row>
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
                                    />
                                </Col>
                                {booker === '' && bookFlag && <Label className='text-danger'>Booker is required!</Label>}
                            </Col>
                            <Col>
                                <Label>
                                    Created By
                                    {booker === '0' && <span className='text-danger'>*</span>}
                                </Label>
                                <Col>
                                    <Input
                                        type='text'
                                        disabled={booker !== '0'}
                                        value={newBooker}
                                        invalid={booker === '0' && newBooker === '' && bookFlag}
                                        onChange={e => setNewBooker(e.target.value)}
                                    />
                                </Col>
                                {newBooker === '' && bookFlag && booker === '0' && <Label className='text-danger'>Created by cannot be blank!</Label>}
                            </Col>
                        </Row> */}

                        <div className='mt-1 d-flex justify-content-center'>
                            <Button type='submit' color='primary' className='btn-next m-1'>
                                <span className='align-middle d-sm-inline-block d-none'> Confirm Booking
                                </span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                            </Button>
                            {/* <Button type='reset' color='danger' className='btn-next m-1' onClick={() => {
                                handleDeleteOpen()
                                console.log('cancel')
                            }}  >
                                <XCircle size={14} className='align-middle me-sm-25 me-0'></XCircle>
                                <span className='align-middle d-sm-inline-block d-none'>
                                    Cancel Booking
                                </span>
                            </Button> */}
                            <Button
                                className="m-1"
                                color="danger"
                                onClick={() => handleCancelOpen()}
                            >
                                Cancel Booking
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            {cancelOpen ? (
                <CancelModal
                    open={cancelOpen}
                    id={id}
                    handleCancelOpen={handleCancelOpen}
                />
            ) : (
                <></>
            )}

            {openModal && <NewBookingSrcTypeModal openModal={openModal} handleOpenModal={handleOpenModal} bookSrcOpt={bookSrcOpt} />}
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
            {/* {cancelOpen ? <CancelModal open={cancelOpen} id={bookingID} handleCancelOpen={handleCancelOpen} /> : <></>} */}


        </>
    )
}

export default OTABookingModal