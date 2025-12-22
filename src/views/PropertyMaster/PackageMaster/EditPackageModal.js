import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Token } from 'prismjs'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import { Image_base_uri } from '../../../API/axios'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { Trash } from 'react-feather'
const tableOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const statusOptions = [
    { value: "Active", label: 'ACTIVE' },
    { value: "Inactive", label: 'INACTIVE' }
]
let discountType = [
    { value: 'P', label: 'Percentage' },
    { value: 'F', label: 'Flat' }
]
const EditPackageModal = ({ updateOpen, handleUpdateOpen, promoId, getPackageData }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID, HotelName } = getUserData

    const [discountT, setDiscounT] = useState('')
    const [checkRoomType, setCheckRoomType] = useState(false)
    const [isRefundable, setIsRefundable] = useState(false)
    const [isPenalty, setIsPenalty] = useState(false)
    const [promoName, setPromoName] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [dPercentage, setDPercentage] = useState(0)
    const [dAmount, setDAmount] = useState(0)
    const [noOfRoom, setNoOfRoom] = useState(0)
    const [noOfUse, setNoOfUse] = useState(0)
    const [guestType, setGuestType] = useState('')
    const [refundDate, setRefundDate] = useState('')
    const [pDate, setPDate] = useState('')
    const [refundDiscounT, setRefundDiscounT] = useState('')
    const [refundDPercent, setRefundDPercent] = useState(0)
    const [refundDAmount, setRefundDAmount] = useState(0)
    const [promoStartD, setPromoStartD] = useState('')
    const [promoEndD, setPromoEndD] = useState('')
    const [bookingStartD, setBookingStartD] = useState('')
    const [bookingEndD, setBookingEndD] = useState('')
    const [blackDate, setBlackDate] = useState('')
    const [roomTypes, setRoomTypes] = useState([])
    const [roomTypesId, setRoomTypesId] = useState('')
    const [roomNo, setRoomNo] = useState('')
    const [showErrors, setShowErrors] = useState(false);
    const [promoBDate, setPromoBDate] = useState('');
    const [roomData, setRoomData] = useState('');
    const [promoreserveID, setPromoreserveID] = useState('');
    const [promoBookingID, setPromoBookingID] = useState('');
    const [refundID, setRefundID] = useState('');
    const [blDate, setBlDate] = useState('');
    const [blackoutData, setBlackoutData] = useState([]);
    const [roomCheckData, setRoomCheckData] = useState([]);
    const [packageName, setPackageName] = useState('')
    const [description, setDescription] = useState('')
    const [addon, setAddon] = useState('')
    const [extraServiceOptions, setExtraServiceOptions] = useState([])
    const [addonName, setAddonName] = useState('')
    const [addonId, setAddonId] = useState('')
    let UpdateBDate = []
    const roomTypeList = () => {
        try {
            const roomTypeDetails = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'list'
            }
            axios.post(`/getdata/bookingdata/roomdetails`, roomTypeDetails)
                .then(response => {
                    let data = response?.data[0]
                    const options = data.map(s => {
                        return { value: s.roomID, label: s.roomDisplayName }
                    })
                    setRoomTypes(options)
                })
        } catch (error) {
            console.log("RoomType Error", error.message)
        }
    }
    useEffect(() => {
        roomTypeList()
    }, [])

    const getExtraServiceOptions = async () => {
        try {
            const res = await axios.get(`/master/extraservice/all/Active`, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: "123"
                }
            })
            console.log('servie', res)
            if (res.data[0].length > 0) {
                let result = res.data[0]
                setExtraServiceOptions(result.map(opt => {
                    return { value: opt.serviceID, label: opt.serviceName, ...opt }
                }))
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getExtraServiceOptions()
    }, [])
    const [bDate, setbDate] = useState([]);
    const handleAddDate = () => {
        const values = [...bDate];
        values.push({
            Date: moment(blDate).format('YYYY-MM-DD'),
            BlackOutDateId: '0'
        });
        setbDate(values);
        setBlDate('')
    };


    UpdateBDate = [...bDate, ...promoBDate]
    const deleteBDateInput = async (id, index) => {
        try {
            axios.post(`/pakages/deletebyBlackOutDateId/${id}`, {}, {
                headers: {
                    LoginID,
                    Token,
                }
            })
                .then(response => {
                    console.log('response', response.data[0][0]);
                    if (response.data[0][0].status === "Success") {
                        UpdateBDate.splice(index, 1)
                        setBlackoutData(UpdateBDate)
                        // if (id === "0") {
                        // console.log('0', id, UpdateBDate);
                        setbDate(UpdateBDate)
                        // } else {
                        //     console.log('1', id, UpdateBDate);
                        setPromoBDate([])
                        // }
                    }
                })
        } catch (error) {
            console.log("RoomType Error", error.message)
        }
    }


    useEffect(() => {
        setBlackoutData(UpdateBDate)
    }, [bDate, promoBDate])




    const [val, setVal] = useState([]);
    const handleAddRoom = () => {
        const values = [...val];
        values.push({
            RoomID: roomTypesId,
            NumberOfRooms: roomNo,
            ApplicableRoomId: '0'
        });
        setVal(values);
        setRoomNo('')
        setRoomTypesId('')
    };
    const UpdateRoomData = [...val, ...roomData]
    const deleteRoomInput = async (id, index) => {
        try {
            axios.post(`/pakages/deletebyApplicableRoomId/${id}`, {}, {
                headers: {
                    LoginID,
                    Token,
                }
            })
                .then(response => {
                    console.log('response', response.data[0][0]);
                    if (response.data[0][0].status === "Success") {
                        UpdateRoomData.splice(index, 1)
                        setRoomCheckData(UpdateRoomData)
                        setVal(UpdateRoomData)
                        setRoomData([])
                    }
                })
        } catch (error) {
            console.log("RoomType Error", error.message)
        }
    }
    useEffect(() => {
        setRoomCheckData(UpdateRoomData)
    }, [val, roomData])

    const savePromotion = async () => {
        setShowErrors(true);
        try {
            const promotionData = {
                "Packages": {
                    "PromotionId": promoId,
                    "PromoName": promoName,
                    "DiscountType": discountT,
                    "DiscPercentage": dPercentage,
                    "DiscAmount": dAmount,
                    "CheckRoomType": checkRoomType,
                    "MinRoomRequire": noOfRoom,
                    "GuestType": guestType,
                    "IsRefundable": isRefundable,
                    "AddOnServiceId": addonId,
                    "AddOnServiceName": addonName,
                    "Description": description
                },
                "Promo_Reservation": {
                    "PromoReservationId": promoreserveID,
                    "StartStayDate": promoStartD,
                    "EndStayDate": promoEndD,
                    "Days": 2,
                    "LessDaysCount": 0,
                    "LessDiscPercentage": 0,
                    "LessDiscAmount": 0
                },
                "Promo_BookingTime": {
                    "Promo_BookingTimeId": promoBookingID,
                    "BookingStartDate": bookingStartD,
                    "BookingEndDate": bookingEndD
                },
                "Promo_BlackOutDate": blackoutData,
                "Promo_ApplicableRooms": roomCheckData,
                "Promo_Refundable": {
                    "RefundableId": refundID,
                    "RefundDateTime": refundDate,
                    "IsPenaltyApply": isPenalty,
                    "RefundPenaltyDate": pDate,
                    "DiscountType": refundDiscounT,
                    "LessRefundPerc": refundDPercent,
                    "LessRefundAmt": refundDAmount
                }
            }
            console.log('promotionData', promotionData)
            const res = await axios.post('/pakages/update', promotionData, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            if (res.data[0][0].status === "Success") {
                toast.success(res.data[0][0].message, { position: "top-center" })
                handleUpdateOpen()
                getPackageData()
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const getPromoUpdateData = async () => {
        try {
            const res = await axios.get(`/pakages/getbyid?PromotionID=${promoId}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            // setData(res?.data[0])
            let data = res?.data
            setPromoName(data[0][0]?.promoName)
            setDiscounT(data[0][0]?.discountType)
            setDPercentage(data[0][0]?.discPercentage)
            setAddonId(data[0][0]?.addOnServiceId)
            setAddonName(data[0][0]?.addOnServiceName)
            setDescription(data[0][0]?.description)
            setDAmount(data[0][0]?.discAmount)
            setNoOfRoom(data[0][0]?.minRoomRequire)
            setGuestType(data[0][0]?.guestType)
            setIsRefundable(data[0][0]?.isRefundable)
            setRefundDate(data[5][0]?.refundDateTime)
            setPDate(data[5][0]?.refundPenaltyDate)
            setRefundDiscounT(data[5][0]?.discountType)
            setRefundDPercent(data[5][0]?.lessRefundPerc)
            setRefundDAmount(data[5][0]?.lessRefundAmt)
            setRefundID(data[5][0]?.refundableId)
            setPromoStartD(data[1][0]?.startStayDate)
            setPromoEndD(data[1][0]?.endStayDate)
            setBookingStartD(data[2][0]?.bookingStartDate)
            setBookingEndD(data[2][0]?.bookingEndDate)
            setPromoBDate(data[4])
            setRoomData(data[3])
            setCheckRoomType(data[0][0]?.checkRoomType)
            setPromoreserveID(data[1][0]?.promoReservationId)
            setPromoBookingID(data[2][0]?.promo_BookingTimeId)
            setIsPenalty(data[5][0]?.isPenaltyApply)

        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getPromoUpdateData()
    }, [updateOpen])

    const documentUpload = (e) => {
        setNewPoslogo(URL.createObjectURL(e.target.files[0]))
        // console.log('posBlob', poslogo)
    }

    return (
        <>
            <Modal isOpen={updateOpen}
                toggle={handleUpdateOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader toggle={handleUpdateOpen}>
                    Update Package
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col lg='6' className='mb-1'>
                                <Label className='form-label' for='promo'>Package Name <span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='promo'
                                    id='promo'
                                    value={promoName}
                                    onChange={e => setPromoName(e.target.value)}
                                />
                                {showErrors && promoName === '' && <p className='text-danger'>Package Name is required</p>}
                            </Col>
                            <Col lg='6' className='mb-1'>
                                <Label className='form-label' for='promo'>Add On Services <span className='text-danger'>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder="Select"
                                    options={extraServiceOptions}
                                    value={extraServiceOptions.filter(a => a.label === addonName)}
                                    onChange={(e) => {
                                        setAddonId(e.value)
                                        setAddonName(e.label)
                                    }}
                                />
                                {/* {showErrors && promoCode === '' && <p className='text-danger'> is required</p>} */}
                            </Col>
                            <Col lg='12' className='mb-1'>
                                <Label className='form-label' for='promo'>Description <span className='text-danger'>*</span></Label>
                                <Input
                                    type='textarea'
                                    name='promo'
                                    id='promo'
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                                {/* {showErrors && promoCode === '' && <p className='text-danger'> is required</p>} */}
                            </Col>
                            <Col lg='3' className='mb-1'>
                                <Label className='form-label' for='discount'>Discount Type <span className='text-danger'>*</span> </Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder="Select"
                                    options={discountType}
                                    value={discountType.filter(a => a.value === discountT)}
                                    onChange={(e) => {
                                        setDiscounT(e.value)
                                    }}
                                />
                                {showErrors && discountT === '' && <p className='text-danger'>Select Discount Type</p>}
                            </Col>
                            {discountT === 'P' ? <Col lg='3' className='mb-1'>
                                <Label className='form-label' for='promo'>Discount Percentage <span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='promo'
                                    id='promo'
                                    onChange={e => setDPercentage(e.target.value)}
                                    value={dPercentage}
                                />
                                {/* {showErrors && dPercentage === 0 && <p className='text-danger'>Discount Percentage is required</p>} */}
                            </Col> : <Col lg='3' className='mb-1'>
                                <Label className='form-label' for='promo'>Discount Amount <span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='promo'
                                    id='promo'
                                    onChange={e => setDAmount(e.target.value)}
                                    value={dAmount}
                                />
                                {/* {showErrors && dAmount === 0 && <p className='text-danger'>Discount Amount is required</p>} */}
                            </Col>
                            }


                            <Col lg='6' className='mt-2'>
                                <div className='d-flex flex-row'>
                                    <Label className='form-check-label' for='confirm'>Guest Type:</Label>
                                    <Col className='form-check mx-1 mb-1'>
                                        <Input
                                            type='radio'
                                            id='confirm'
                                            name='GuestType'
                                            onChange={() => {
                                                setGuestType('Existing')
                                            }}
                                            checked={guestType === 'Existing'}
                                        />
                                        <Label className='form-check-label' for='confirm'>Existing</Label>
                                    </Col>
                                    <Col className='form-check mx-1 mb-1 d-block'>
                                        <Input
                                            type='radio'
                                            id='hold'
                                            name='GuestType'
                                            onChange={() => {
                                                setGuestType('All')
                                            }}
                                            checked={guestType === 'All'}
                                        />
                                        <Label className='form-check-label' for='confirm'>All</Label>
                                    </Col>
                                </div>
                                {showErrors && guestType === '' && <p className='text-danger'>Select Guest Type</p>}
                            </Col>
                            <Col lg='6' className='mb-1'>
                                <Label className='form-label' for='promo'>No. of Rooms <span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='promo'
                                    id='promo'
                                    onChange={e => setNoOfRoom(e.target.value)}
                                    value={noOfRoom}
                                />
                                {showErrors && noOfRoom === 0 && <p className='text-danger'>No.of Rooms Required</p>}
                            </Col>
                            <Col lg='6' className='mb-1'>
                                <Label className='form-label' for='promo'>No. of Use <span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='promo'
                                    id='promo'
                                    onChange={e => setNoOfUse(e.target.value)}
                                    value={noOfUse}
                                />
                                {showErrors && noOfUse === 0 && <p className='text-danger'>No.of Use Required</p>}
                            </Col>
                        </Row>
                        <Row>
                            <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Refundable</h4>
                            <Col lg='6' className=' mt-2 mb-2'>
                                <div className='form-check form-check-inline'>
                                    <Input type='checkbox' id='basic-unchecked' checked={isRefundable} onClick={(e) => { setIsRefundable(!isRefundable) }} />
                                    <Label for='basic-unchecked' className='form-check-label'>
                                        IsRefundable
                                    </Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            {isRefundable === true ? <>
                                <Col lg='6' className=''>
                                    <Label className='form-label' for='checkIn_date'>
                                        Refundable Date:<span className='text-danger'>*</span>
                                    </Label>
                                    <Flatpickr
                                        id='checkIn_date'
                                        name='checkIn_date'
                                        placeholder='Select Refundable Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            // minDate: moment(new Date()).subtract(1, 'days'),
                                            defaultDate: refundDate
                                        }}
                                        // disabled
                                        defaultValue={moment(refundDate).format('DD-MM-YY')}
                                        value={moment(refundDate).format('DD-MM-YY')}
                                        onChange={date => {
                                            setRefundDate((date[0]))
                                        }}
                                    />
                                </Col>
                                <Col lg='6' className='mt-2'>
                                    <div className='form-check form-check-inline'>
                                        <Input type='checkbox' id='basic-bb-unchecked' checked={isPenalty} onClick={(e) => { setIsPenalty(!isPenalty) }} />
                                        <Label for='basic-bb-unchecked' className='form-check-label'>
                                            Is Penalty Applied
                                        </Label>
                                    </div>
                                </Col>
                                <Col lg='6' className=' mt-2'>
                                    <Label className='form-label' for='checkIn_date'>
                                        Refundable Penalty Date
                                    </Label>
                                    <Flatpickr
                                        id='checkIn_date'
                                        name='checkIn_date'
                                        placeholder='Select Penalty Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            // minDate: moment(new Date()).subtract(1, 'days'),
                                            // defaultDate: inDate
                                        }}
                                        // disabled
                                        // defaultValue={inDate}
                                        value={moment(pDate).format('DD-MM-YY')}
                                        onChange={date => {
                                            setPDate(date[0])
                                        }}
                                    />
                                </Col>
                                <Col lg='6' className='mt-2'>
                                    <Label className='form-label' for='discount'>Discount Type  </Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder="Select Type"
                                        options={discountType}
                                        value={discountType.filter(a => a.value === refundDiscounT)}
                                        onChange={(e) => {
                                            setRefundDiscounT(e.value)
                                        }}
                                    />
                                </Col>
                                {refundDiscounT === 'P' ? <Col lg='6' className='mb-1 mt-2'>
                                    <Label className='form-label' for='promo'>Discount Percentage </Label>
                                    <Input
                                        type='text'
                                        name='promo'
                                        id='promo'
                                        onChange={(e) => {
                                            setRefundDPercent(e.target.value)
                                        }}
                                        value={refundDPercent}
                                    />
                                </Col> : <Col lg='6' className='mb-1 mt-2'>
                                    <Label className='form-label' for='promo'>Discount Amount </Label>
                                    <Input
                                        type='text'
                                        name='promo'
                                        id='promo'
                                        onChange={(e) => {
                                            setRefundDAmount(e.target.value)
                                        }}
                                        value={refundDAmount}
                                    />
                                </Col>
                                }

                            </>
                                : ''}
                        </Row>
                        <Row>
                            <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Promo Reservation</h4>
                            <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='checkIn_date'>
                                    Start Stay Date:<span className='text-danger'>*</span>
                                </Label>
                                <Flatpickr
                                    id='checkIn_date'
                                    name='checkIn_date'
                                    placeholder='Select Start Date'
                                    options={{
                                        altInput: true,
                                        altFormat: 'd-m-y',
                                        dateFormat: 'd-m-y',
                                        // minDate: moment(new Date()).subtract(1, 'days'),
                                        // defaultDate: inDate
                                    }}
                                    // disabled
                                    // defaultValue={inDate}
                                    value={moment(promoStartD).format('DD-MM-YY')}
                                    onChange={date => {
                                        setPromoStartD(date[0])
                                    }}
                                />
                                {showErrors && promoStartD === '' && <p className='text-danger'>Promo Start Date is required</p>}
                            </Col>
                            <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='checkIn_date'>
                                    End Stay Date:<span className='text-danger'>*</span>
                                </Label>
                                <Flatpickr
                                    id='checkIn_date'
                                    name='checkIn_date'
                                    placeholder='Select End Date'
                                    options={{
                                        altInput: true,
                                        altFormat: 'd-m-y',
                                        dateFormat: 'd-m-y',
                                        // minDate: moment(new Date()).subtract(1, 'days'),
                                        // defaultDate: inDate
                                    }}
                                    // disabled
                                    // defaultValue={inDate}
                                    value={moment(promoEndD).format('DD-MM-YY')}
                                    onChange={date => {
                                        setPromoEndD(date[0])
                                    }}
                                />
                                {showErrors && promoEndD === '' && <p className='text-danger'>Promo End Date is required</p>}
                            </Col>
                        </Row>
                        <Row>
                            <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Booking Time</h4>
                            <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='checkIn_date'>
                                    Booking Start Date:<span className='text-danger'>*</span>
                                </Label>
                                <Flatpickr
                                    value={moment(bookingStartD).toISOString()}
                                    data-enable-time
                                    id='date-time-picker'
                                    className='form-control'
                                    onChange={date => setBookingStartD(moment(date[0]).format('YYYY-MM-DD HH:mm'))}
                                />
                                {showErrors && bookingStartD === '' && <p className='text-danger'>Booking Start Date is required</p>}
                            </Col>
                            <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='checkIn_date'>
                                    Booking End Date:<span className='text-danger'>*</span>
                                </Label>
                                <Flatpickr
                                    value={moment(bookingEndD).toISOString()}
                                    data-enable-time
                                    id='date-time-picker'
                                    className='form-control'
                                    onChange={date => setBookingEndD(moment(date[0]).format('YYYY-MM-DD HH:mm'))}
                                />
                                {showErrors && bookingEndD === '' && <p className='text-danger'>Booking End Date is required</p>}
                            </Col>
                        </Row>
                        <Row>
                            <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Blackout Date</h4>
                            {/* {bDate.map((field, index) => {
                                return ( */}
                            <div className=' mt-1 w-50 d-block'>
                                <Label className='form-label' for='checkIn_date'>
                                    Blackout Date
                                </Label>
                                <Flatpickr
                                    id='checkIn_date'
                                    name='Date'
                                    placeholder='Select Date'
                                    options={{
                                        altInput: true,
                                        altFormat: 'd-m-y',
                                        dateFormat: 'd-m-y',
                                        // minDate: moment(new Date()).subtract(1, 'days'),
                                        // defaultDate: inDate
                                    }}
                                    // disabled
                                    // defaultValue={inDate}
                                    value={blDate}
                                    // onChange={date => {
                                    //     setInDate(date[0])
                                    //     setLoader(false);
                                    // }}
                                    onChange={(date) => {
                                        // handleBDateInput(index, date[0])
                                        setBlDate(date[0])
                                    }
                                    }
                                />
                            </div>
                            {/* )
                            })} */}
                        </Row>
                        <Button color='primary' onClick={() => handleAddDate()} className='mt-2 d-block' style={{ width: '150px' }}> Add Date</Button>
                        <Table responsive className='mt-2'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-nowrap'>
                                        Date
                                    </th>
                                    {/* <th scope='col' className='text-nowrap'>
                                        Id
                                    </th> */}
                                    <th scope='col' className='text-nowrap'>
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {blackoutData && blackoutData?.map((a, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className='text-nowrap text-start'>{moment(a.Date).format('YYYY-MM-DD')}</td>
                                                {/* <td className='text-nowrap text-start'>{a.BlackOutDateId}</td> */}
                                                <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                                                    deleteBDateInput(a.BlackOutDateId, index)
                                                }} /></td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Row>
                            <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Room Type Details</h4>
                            <Col lg='12' className=' mt-2'>
                                <div className='form-check form-check-inline'>
                                    <Input type='checkbox' id='basic-cb-unchecked' checked={checkRoomType} onClick={(e) => { setCheckRoomType(!checkRoomType) }} />
                                    <Label for='basic-cb-unchecked' className='form-check-label'>
                                        Check Room Type
                                    </Label>
                                </div>
                            </Col>
                            {checkRoomType === true ?
                                <>
                                    <Col lg='6' className=' mt-1'>
                                        <Label className='form-label' for='promo'>Room Type </Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            placeholder="Select Type"
                                            options={roomTypes}
                                            name='RoomID'
                                            value={roomTypes.filter(c => c.value === roomTypesId)}
                                            onChange={(event) => {
                                                // handleCheckRoomInput(index, event)
                                                setRoomTypesId(event.value)
                                            }}
                                        />
                                    </Col>
                                    <Col lg='6' className=' mt-1'>
                                        <Label className='form-label' for='promo'>No. of Rooms</Label>
                                        <Input
                                            type='text'
                                            name='NumberOfRooms'
                                            id='promo'
                                            value={roomNo}
                                            onChange={(event) => {
                                                setRoomNo(event.target.value)
                                            }}
                                        />
                                    </Col>

                                    <Button color='primary' onClick={() => handleAddRoom()} className='mt-2' style={{ width: '200px' }}> Add Room Details</Button>
                                    <Table responsive className='mt-2'>
                                        <thead>
                                            <tr>
                                                <th scope='col' className='text-nowrap'>
                                                    Room ID
                                                </th>
                                                <th scope='col' className='text-nowrap'>
                                                    No of Rooms
                                                </th>
                                                <th scope='col' className='text-nowrap'>
                                                    Delete
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roomCheckData && roomCheckData?.map((a, index) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className='text-nowrap text-start'>{a.roomID}</td>
                                                            <td className='text-nowrap text-start'>{a.numberOfRooms}</td>
                                                            <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                                                                deleteRoomInput(a.applicableRoomId, index)
                                                            }} /></td>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </>
                                : ''}
                        </Row>
                        <Button color='primary' className='mt-2 d-flex justify-content-center m-auto' style={{ width: '200px' }} onClick={() => savePromotion()}> Save Package</Button>
                    </Form>
                </ModalBody>
            </Modal>
            {
                updateOpen ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default EditPackageModal