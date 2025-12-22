
import {
  Card, CardBody, CardTitle, Input, InputGroupText, InputGroup, Row, Col, Button, Modal, ModalHeader, ModalBody, Form, Label, CardText, Badge, CardHeader, Table
} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import Flatpickr from 'react-flatpickr'
import { Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'

import React, { useEffect, useState } from 'react'
import { FaHandshake, FaClock, FaMobileAlt } from 'react-icons/fa'
import { IoIosHourglass, IoIosLaptop } from 'react-icons/io'
import { IoCaretBackSharp } from 'react-icons/io5'
import { BsFillMoonStarsFill, BsBriefcase } from 'react-icons/bs'
import { HiUserGroup } from 'react-icons/hi'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import EditPromoCodeModal from './EditPromoCodeModal'

let discountType = [
  { value: 'P', label: 'Percentage' },
  { value: 'F', label: 'Flat' }
]

const roomTypes = [
  { value: 'Super', label: 'Super' },
  { value: 'Deluxe', label: 'Deluxe' },
  { value: 'Normal', label: 'Normal' }

]

const ratePlans = [
  { value: 'All', label: 'All' },
  { value: 'xyz', label: 'xyz' }
]

const discounts = [
  { value: 'Rs', label: 'Rs' },
  { value: 'xyz', label: 'xyz' }
]

const statusOptions = [
  { value: true, label: 'ACTIVE' },
  { value: false, label: 'INACTIVE' }
]

// let data
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//   data = response.data
// })

const PromoCode = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Promo Code"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData
  const [promoCodeData, setPromoCodeData] = useState([])
  const [updateOpen, setUpdateOpen] = useState(false)
  const [promoId, setPromoId] = useState('')
  const handleUpdateOpen = () => {
    setUpdateOpen(!updateOpen)
  }

  const getPromoCodeData = async () => {
    try {
      const res = await axios.get('/promocode/list', {
        headers: {
          LoginID,
          Token
        }
      })
      // console.log('res', res.data[0])
      setPromoCodeData(res?.data[0])
    } catch (error) {
      console.log('error', error)
    }
  }

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [selected_promoCode, setSelected_promoCode] = useState()

  const [del, setDel] = useState(false)

  const [promoCodes, setPromoCodes] = useState([
    {
      id: '1',
      rateCode: '121',
      roomType: 'Super Deluxe',
      ratePlan: 'abc',
      promoName: 'abc',
      promoCode: '321',
      fromDate: '2022-10-12',
      toDate: '2022-10-27',
      noOfUse: '6',
      noOfPeopleFrom: 'Mumbai',
      noOfPeopleTo: 'Goa',
      minRooms: '3',
      discount: '5',
      discountDropDown: '3',
      blackOutDates: '2',
      blackOutDatesInput: '5',
      status: true
    }
  ])
  useEffect(() => {
    getPromoCodeData()
  }, [])
  const NewPromoCodeModal = () => {


    const [active, setActive] = useState('1')
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
    // const [blackDate, setBlackDate] = useState('')
    const [roomTypes, setRoomTypes] = useState([])
    const [roomTypesId, setRoomTypesId] = useState('')
    const [roomNo, setRoomNo] = useState('')
    const [blDate, setBlDate] = useState('')
    const [showErrors, setShowErrors] = useState(false);


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

    // check room type
    let RoomData = []
    const [val, setVal] = useState([]);
    const [roomIdName, setRoomIdName] = useState([]);
    const handleAddRoom = () => {
      const values = [...val];
      values.push({
        RoomID: roomTypesId,
        NumberOfRooms: roomNo
      });
      setVal(values);
      setRoomNo('')
      setRoomTypesId('')
    };
    RoomData = [...val]
    const deleteRoomInput = async (index) => {
      RoomData.splice(index, 1)
      setRoomIdName(RoomData)
      setVal(RoomData)
    }
    useEffect(() => {
      setRoomIdName(RoomData)
    }, [val])

    // blackout date
    let BlackoutData = []
    const [bDate, setbDate] = useState([]);
    const [blackDate, setBlackDate] = useState([])
    const handleAddDate = () => {
      const values = [...bDate];
      values.push({
        Date: moment(blDate).format('YYYY-MM-DD')
      });
      setbDate(values);
      setBlDate('')
    };
    BlackoutData = [...bDate]

    const deleteBDateInput = (index) => {
      BlackoutData.splice(index, 1)
      setBlackDate(BlackoutData)
      setbDate(BlackoutData)
    }
    useEffect(() => {
      setBlackDate(BlackoutData)
    }, [bDate])


    const savePromotion = async () => {
      setShowErrors(true);
      try {
        const promotionData = {
          "Promocode": {
            "PromoName": promoName,
            "PromoCode": promoCode,
            "NoOfUse": noOfUse,
            "DiscountType": discountT,
            "DiscPercentage": dPercentage,
            "DiscAmount": dAmount,
            "CheckRoomType": checkRoomType,
            "MinRoomRequire": noOfRoom,
            "GuestType": guestType,
            "IsRefundable": isRefundable
          },
          "Promo_Reservation": {
            "StartStayDate": moment(promoStartD).format('YYYY-MM-DD'),
            "EndStayDate": moment(promoEndD).format('YYYY-MM-DD'),
            "Days": 2,
            "LessDaysCount": 0,
            "LessDiscPercentage": 0,
            "LessDiscAmount": 0
          },
          "Promo_BookingTime": {
            "BookingStartDate": moment(bookingStartD).format('YYYY-MM-DD HH:mm'),
            "BookingEndDate": moment(bookingEndD).format('YYYY-MM-DD HH:mm')
          },
          "Promo_BlackOutDate": bDate,
          "Promo_ApplicableRooms": val,
          "Promo_Refundable": {
            "RefundDateTime": refundDate === '' ? '' : moment(refundDate).format('YYYY-MM-DD'),
            "IsPenaltyApply": isPenalty,
            "RefundPenaltyDate": pDate === '' ? '' : moment(pDate).format('YYYY-MM-DD'),
            "DiscountType": refundDiscounT,
            "LessRefundPerc": refundDPercent,
            "LessRefundAmt": refundDAmount
          }
        }
        const res = await axios.post('/promocode/save', promotionData, {
          headers: {
            LoginID,
            Token,
          }
        })
        if (res.data[0][0].status === "Success") {
          toast.success(res.data[0][0].message, { position: "top-center" })
          location.reload()
        }
      } catch (error) {
        console.log("Error", error)
      }
    }



    const [rateCode, setRateCode] = useState('')
    const [roomType, setRoomType] = useState('')
    const [ratePlan, setRatePlan] = useState('')
    // const [promoName, setPromoName] = useState('')
    // const [promoCode, setPromoCode] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [noOfPeopleFrom, setNoOfPeopleFrom] = useState('')
    const [noOfPeopleTo, setNoOfPeopleTo] = useState('')
    const [minRooms, setMinRooms] = useState('')
    const [discount, setDiscount] = useState('')
    const [discountDropDown, setDiscountDropDown] = useState('')
    const [blackOutDates, setBlackOutDates] = useState('')
    const [blackOutDatesInput, setBlackOutDatesInput] = useState('')

    const [display, setDisplay] = useState(false)

    const promoCodeObj = {
      id: Math.floor(Math.random() * 100),
      rateCode,
      roomType,
      ratePlan,
      promoName,
      promoCode,
      fromDate,
      toDate,
      noOfUse,
      noOfPeopleFrom,
      noOfPeopleTo,
      minRooms,
      discount,
      discountDropDown,
      blackOutDates,
      blackOutDatesInput,
      status: true
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (promoCode && promoName && fromDate && toDate && roomType !== '') {
        setPromoCodes([...promoCodes, promoCodeObj])
        handleModal()
        toast.success('PromoCode Added!', { position: "top-center" })
      }
      // else {
      //   toast.error('Fill All Fields!', {
      //     position: "top-center",
      //     style: {
      //       minWidth: '250px'
      //     },
      //     duration: 3000
      //   })
      // }
    }

    return (
      <>
        <Modal
          isOpen={show}
          toggle={handleModal}
          className='modal-dialog-centered modal-lg'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleModal}>
            Promo Code Details
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <>
              <Form>
                <Row>
                  <Col lg='6' className='mb-1'>
                    <Label className='form-label' for='promo'>Promotion Name <span className='text-danger'>*</span></Label>
                    <Input
                      type='text'
                      name='promo'
                      id='promo'
                      value={promoName}
                      onChange={e => setPromoName(e.target.value)}
                    />
                    {showErrors && promoName === '' && <p className='text-danger'>Promo Name is required</p>}
                  </Col>
                  <Col lg='6' className='mb-1'>
                    <Label className='form-label' for='promo'>Promo Code <span className='text-danger'>*</span></Label>
                    <Input
                      type='text'
                      name='promo'
                      id='promo'
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                    />
                    {showErrors && promoCode === '' && <p className='text-danger'>Promo Code is required</p>}
                  </Col>
                  <Col lg='3' className='mb-1'>
                    <Label className='form-label' for='discount'>Discount Type <span className='text-danger'>*</span> </Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      placeholder="Select"
                      options={discountType}
                      // value={discountT}
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
                      <Input type='checkbox' id='basic-unchecked' onClick={(e) => { setIsRefundable(!isRefundable) }} />
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
                        Refundable Date
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
                          // defaultDate: inDate
                        }}
                        // disabled
                        // defaultValue={inDate}
                        value={refundDate}
                        onChange={date => {
                          setRefundDate(date[0])
                        }}
                      />
                    </Col>
                    <Col lg='6' className='mt-2'>
                      <div className='form-check form-check-inline'>
                        <Input type='checkbox' id='basic-bb-unchecked' onClick={(e) => { setIsPenalty(!isPenalty) }} />
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
                        value={pDate}
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
                        // value={discountT}
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
                      value={promoStartD}
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
                      value={promoEndD}
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
                      onChange={date => setBookingStartD(moment(date[0]))}
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
                      onChange={date => setBookingEndD(moment(date[0]))}
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
                      // value={inDate}
                      // onChange={date => {
                      //     setInDate(date[0])
                      //     setLoader(false);
                      // }}
                      // onChange={(date) => handleBDateInput(index, date[0])}
                      value={blDate}
                      onChange={(date) => {
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
                      <th scope='col' className='text-nowrap'>
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blackDate?.map((a, index) => {
                      return (
                        <>
                          <tr>
                            <td className='text-nowrap text-start'>{a.Date}</td>
                            <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                              deleteBDateInput(index)
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
                      <Input type='checkbox' id='basic-cb-unchecked' onClick={(e) => { setCheckRoomType(!checkRoomType) }} />
                      <Label for='basic-cb-unchecked' className='form-check-label'>
                        Check Room Type
                      </Label>
                    </div>
                  </Col>
                  {/* <Col lg='4' className='mb-1'>
                    <Label className='form-label' for='promo'>Room Type <span className='text-danger'>*</span></Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      placeholder="Select Type"
                    // options={discountType}
                    // value={discountT}
                    // onChange={(e) => {
                    //   setDiscounT(e.value)
                    // }}
                    />
                  </Col>  */}
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
                        <Label className='form-label' for='promo'>No. of Rooms </Label>
                        <Input
                          type='text'
                          name='NumberOfRooms'
                          id='promo'
                          value={roomNo}
                          onChange={(event) => {
                            // handleCheckRoomInput(index, event)
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
                          {roomIdName?.map((a, index) => {
                            return (
                              <>
                                <tr>
                                  <td className='text-nowrap'>{a.RoomID}</td>
                                  <td className='text-nowrap'>{a.NumberOfRooms}</td>
                                  <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                                    deleteRoomInput(index)
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
                <Button color='primary' className='mt-2 d-flex justify-content-center m-auto' style={{ width: '200px' }} onClick={() => savePromotion()}> Save Promo Code</Button>
              </Form>
            </>
          </ModalBody>
        </Modal>
        {
          show ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }


  const DeletePromoCodeModal = ({ id }) => {

    const data = promoCodes.filter(promoCodes => promoCodes.id === id)



    const handleDeletePromoCode = () => {
      try {
        axios.post(`/promocode/Delete?PromotionID=${promoId}`, {}, {
          headers: {
            LoginID,
            Token,
          }
        })
          .then(response => {
            setDel(false)
            getPromoCodeData()
          })
      } catch (error) {
        console.log("Error", error.message)
      }
    }

    return (
      <>
        <Modal
          isOpen={del}
          toggle={() => setDel(!del)}
          className='modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
            Are you sure to delete  {data[0]?.promoName} permanently?
          </ModalHeader>
          <ModalBody>
            <Row className='text-center'>
              <Col xs={12}>
                <Button color='danger' className='m-1' onClick={handleDeletePromoCode}>
                  Delete
                </Button>
                <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {
          del ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const [query, setQuery] = useState("")
  const search = (data) => {
    return data.filter(item =>
      item.promotionId.toLowerCase().includes(query.toLowerCase()) ||
      item.promoName.toLowerCase().includes(query.toLowerCase()) ||
      // item.PhoneNumber.toLowerCase().includes(query.toLowerCase()) ||
      item.promocode.toLowerCase().includes(query.toLowerCase())
    )
  }

  const promoCodeTable = [
    {
      name: 'Promo Id',
      sortable: true,
      minWidth: '250px',
      selector: row => row.promotionId
    },
    {
      name: 'Promo Name',
      sortable: true,
      minWidth: '250px',
      selector: row => row.promoName
    },
    {
      name: 'Promo Code',
      sortable: true,
      minWidth: '250px',
      selector: row => row.promocode
    },
    {
      name: 'Promo Date',
      sortable: true,
      // minWidth: '225px',
      selector: row => moment(row.promoDate).format('YYYY-MM-DD')
    },
    {
      name: 'Discount Type',
      sortable: true,
      // minWidth: '310px',
      selector: row => row.discountType === 'P' ? 'Percentage' : 'Flat'
    },
    {
      name: 'Discount Percentage',
      sortable: true,
      // minWidth: '250px',
      selector: row => row.discPercentage
    },
    {
      name: 'Discount Amount',
      sortable: true,
      // minWidth: '250px',
      selector: row => row.discAmount
    },
    {
      name: 'Guest Type',
      sortable: true,
      // minWidth: '250px',
      selector: row => row.guestType
    },
    {
      name: 'Action',
      sortable: true,
      center: true,
      selector: row => (
        <>
          <Col>
            <Edit className='me-50 pe-auto' onClick={() => {
              handleUpdateOpen()
              setPromoId(row.promotionId)
            }} size={15} />
            <Trash className='me-50' size={15} onClick={() => {
              setDel(true)
              setPromoId(row.promotionId)
            }} />
          </Col>
        </>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Promo Code
          </CardTitle>
          <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
          <Button color='primary' onClick={() => setShow(true)}>Create New Code</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={search(promoCodeData)}
                columns={promoCodeTable}
                className='react-dataTable'
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <NewPromoCodeModal />
      <DeletePromoCodeModal promoId={promoId} />
      {updateOpen && <EditPromoCodeModal updateOpen={updateOpen} handleUpdateOpen={handleUpdateOpen} promoId={promoId} getPromoCodeData={getPromoCodeData} />}
    </>
  )
}

export default PromoCode