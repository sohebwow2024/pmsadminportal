import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Col, Input, Label, Row, Form } from 'reactstrap'
import hotelImg from '@src/assets/images/OTA-Logo/hotel.webp'
// import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { ArrowRight, Calendar, UserCheck, UserX, Play, DollarSign, HelpCircle, FileText, Archive } from 'react-feather'
import moment from 'moment'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// import { Swiper, SwiperSlide } from './react/swiper/react/'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import axios, { Image_base_uri } from '../API/axios'
import Linkify from 'react-linkify'
import { useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};

const items = [
    <Card className='m-1'>
        <CardBody>
            <img src={hotelImg} width='200px' style={{ display: 'flex', margin: 'auto' }} />
            <h6 className='pt-1'>CLASSIC</h6>
            <p>Apartment</p>
        </CardBody>
    </Card>,
    <Card className='m-1'>
        <CardBody>
            <img src={hotelImg} width='200px' style={{ display: 'flex', margin: 'auto' }} />
            <h6 className='pt-1'>CLASSIC</h6>
            <p>Apartment</p>
        </CardBody>
    </Card>,
    <Card className='m-1'>
        <CardBody>
            <img src={hotelImg} width='200px' style={{ display: 'flex', margin: 'auto' }} />
            <h6 className='pt-1'>CLASSIC</h6>
            <p>Apartment</p>
        </CardBody>
    </Card>,
    <Card className='m-1'>
        <CardBody>
            <img src={hotelImg} width='200px' style={{ display: 'flex', margin: 'auto' }} />
            <h6 className='pt-1'>CLASSIC</h6>
            <p>Apartment</p>
        </CardBody>
    </Card>,
];



const bookingengine = () => {

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [guestEmailId, setGuestEmailId] = useState('')
    const [guestName, setGuestName] = useState('')
    const [guestMobileNumber, setGuestMobileNumber] = useState('')
    const [guestLastName, setGuestLastName] = useState('')
    const [adult, setAdult] = useState('')
    const [children, setChildren] = useState('')
    const [inDate, setInDate] = useState('')
    const [outDate, setOutDate] = useState('')
    const [showErrors, setShowErrors] = useState(false);
    const duration = (moment(outDate).diff(moment(inDate), 'days'))
    const outDateRef = useRef(null)
    const [showMore, setshowMore] = useState(false)
    const [hoteldata, setHoteldata] = useState([])
    const getHotelData = async () => {
        try {
            const res = await axios.get(`ibe/hotel?id=${id}`)

            setHoteldata(res?.data[0][0])

        } catch (error) {
            console.log('error', error)
        }
    }

    const [packages, setPackages] = useState([])
    const getpackages = async () => {
        try {
            const res = await axios.get('ibe/packages')

            setPackages(res?.data[0])

        } catch (error) {
            console.log('error', error)
        }
    }


    useEffect(() => {
        getHotelData()
        getpackages()
    }, [])

    const reset = () => {
        setInDate('')
        setOutDate('')
        setAdult('')
        setChildren('')
        setGuestName('')
        setGuestLastName('')
        setGuestEmailId('')
        setGuestMobileNumber('')
    }

    const saveBooking = async () => {
        setShowErrors(true);
        if (inDate && outDate && adult && children && guestName && guestLastName && guestEmailId && guestMobileNumber !== '') {
            try {
                const bookingData = {
                    "HotelId": id,
                    "CheckInDate": inDate,
                    "CheckOutDate": outDate,
                    "Adult": adult,
                    "Child": children,
                    "GuestDetails": {
                        "GuestName": guestName,
                        "LastName": guestLastName,
                        "Mobile": guestMobileNumber,
                        "Email": guestEmailId
                    }
                }
                console.log('bookingData', bookingData)
                const res = await axios.post('/ibe/save', bookingData, {})
                console.log("response: ", res.data[0])
                if (res.data[0][0].Status === "Success") {
                    toast.success(res.data[0][0].Message, { position: "top-center" })
                    // location.reload()
                    reset()
                    setShowErrors(false);
                }
            } catch (error) {
                console.log("Error", error)
            }
        } else {
            toast.error("please enter required fields!", { position: "top-center" })
        }
    }
    // console.log(hoteldata);
    return (
        <>
            <Row className='p-3'>
                <Col md='8'>
                    <Form>
                        <Card>
                            <CardBody>
                                <h3 style={{ borderBottom: '1px solid' }} >Hotel Info</h3>
                                <div className='d-flex py-2'>
                                    <img src={`${Image_base_uri}${hoteldata?.LogoURL}`} width='150px' height='150px' style={{ borderRadius: '10px' }} />
                                    <div className='p-2'>
                                        <h4>{hoteldata?.HotelName}</h4>
                                        <p>{hoteldata?.PropertyDesc}</p>
                                    </div>
                                </div>
                                <Row className='mb-2'>
                                    <Col>
                                        <Label className='form-label' for='checkIn_date'>
                                            Check-In Date<span className='text-danger'>*</span>
                                        </Label>
                                        <Flatpickr
                                            id='checkIn_date'
                                            name='checkIn_date'
                                            placeholder='Select Check-In Date'
                                            options={{
                                                altInput: true,
                                                altFormat: 'd-m-y',
                                                dateFormat: 'd-m-y',
                                                // minDate: moment(new Date()).subtract(1, 'days')
                                            }}
                                            value={moment(inDate).toISOString()}
                                            onChange={date => {
                                                setInDate(date[0])
                                                outDateRef.current.flatpickr.open()
                                            }}
                                        />
                                        {showErrors && inDate === '' && <span className='text-danger'>Enter CheckIn Date</span>}
                                    </Col>
                                    <Col>
                                        <Label className='form-label' for='checkOut_date'>
                                            Check-Out Date<span className='text-danger'>*</span>
                                        </Label>
                                        <Flatpickr
                                            id='checkOut_date'
                                            name='checkOut_date'
                                            ref={outDateRef}
                                            placeholder='Select Check-Out Date'
                                            options={{
                                                altInput: true,
                                                altFormat: 'd-m-y',
                                                dateFormat: 'd-m-y',
                                                minDate: new Date(inDate).fp_incr(1)
                                            }}
                                            value={moment(outDate).toISOString()}
                                            onChange={date => {
                                                setOutDate(date[0])
                                            }}
                                        />
                                        {showErrors && outDate === '' && <span className='text-danger'>Enter CheckOut Date</span>}
                                    </Col>
                                </Row>
                                {
                                    duration > 0 ? (
                                        <Row>
                                            {/* <Col className='mt-2 d-flex flex-sm-row flex-column justify-content-center align-item-center'> */}
                                            <Col className='pt-1 durationCard' md='4'>
                                                <StatsHorizontal icon={<UserCheck size={21} />} color='success' stats={moment(inDate).format("DD/MM/YYYY")} statTitle='Check-In Date' />
                                            </Col>
                                            <Col className='pt-1 durationCard' md='4'>
                                                <StatsHorizontal icon={<UserX size={21} />} color='warning' stats={moment(outDate).format("DD/MM/YYYY")} statTitle='Check-Out Date' />
                                            </Col>
                                            <Col className='pt-1 durationCard' md='4'>
                                                <StatsHorizontal icon={<Calendar size={21} />} color='primary' stats={duration === 1 ? `${duration} Night` : `${duration} Nights`} statTitle='Duration of Booking' />
                                            </Col>
                                            {/* </Col> */}
                                        </Row>
                                    ) : null
                                }
                                <Row>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='promo'>No. of Adults<span className='text-danger'>*</span> </Label>
                                        <Input
                                            type='text'
                                            name='promo'
                                            id='promo'
                                            value={adult}
                                            onChange={e => setAdult(e.target.value)}
                                        />
                                        {showErrors && adult === '' && <span className='text-danger'>Enter No. of Adults</span>}
                                    </Col>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='promo'>No. of Childrens<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='text'
                                            name='promo'
                                            id='promo'
                                            value={children}
                                            onChange={e => setChildren(e.target.value)}
                                        />
                                        {showErrors && children === '' && <span className='text-danger'>Enter No. of Childrens</span>}
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                        {/* <Card>
                    <CardBody> */}
                        {/* <AliceCarousel
                    mouseTracking
                    items={items}
                    responsive={responsive}
                    controlsStrategy="default"
                /> */}
                        {/* </CardBody>
                </Card> */}
                        <Card>
                            <CardBody>
                                <h3 style={{ borderBottom: '1px solid' }} >Guest Details</h3>
                                <Row>
                                    <Col lg='12' className='p-2'>
                                        <div className='d-flex flex-row flex-wrap'>
                                            <div className='pe-1 w-25'>
                                                <Label>
                                                    Guest Name<span className='text-danger'>*</span>
                                                </Label>
                                                <Input
                                                    type='text'
                                                    value={guestName}
                                                    name='guestName'
                                                    onChange={e => setGuestName(e.target.value)}
                                                />
                                                {showErrors && guestName === '' && <span className='text-danger'>Enter Name</span>}
                                            </div>
                                            <div className='pe-1 w-25'>
                                                <Label>
                                                    Guest Last Name<span className='text-danger'>*</span>
                                                </Label>
                                                <Input
                                                    type='text'
                                                    value={guestLastName}
                                                    // invalid={cgst === '' && loader}
                                                    onChange={e => setGuestLastName(e.target.value)}
                                                />
                                                {showErrors && guestLastName === '' && <span className='text-danger'>Enter  Last Name</span>}
                                            </div>
                                            <div className='pe-1 w-25' >
                                                <Label>
                                                    Mobile Number<span className='text-danger'>*</span>
                                                </Label>
                                                <Input
                                                    type='text'
                                                    value={guestMobileNumber}
                                                    // invalid={cgst === '' && loader}
                                                    onChange={e => setGuestMobileNumber(e.target.value)}
                                                />
                                                {showErrors && guestMobileNumber === '' && <span className='text-danger'>Enter  Mobile Number</span>}
                                            </div>
                                            <div className='pe-1 w-25'>
                                                <Label>
                                                    Email Id<span className='text-danger'>*</span>
                                                </Label>
                                                <Input
                                                    type='text'
                                                    value={guestEmailId}
                                                    // invalid={cgst === '' && loader}
                                                    onChange={e => setGuestEmailId(e.target.value)}
                                                />
                                                {showErrors && guestEmailId === '' && <span className='text-danger'>Enter Email Id</span>}
                                            </div>
                                        </div>

                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                        {/* <Button color='primary' style={{ width: '100%' }} onClick={() => saveBooking()}>
                        <span className='align-middle'>Booked
                        </span>
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button> */}
                        <Button className='me-1' color='primary' style={{ width: '100%' }} onClick={saveBooking}>
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col md='4'>
                    {/* <Card>
                    <CardBody>
                        <h3 style={{ borderBottom: '1px solid' }} >Price Summary</h3>
                        <div className='d-flex justify-content-between'>
                            <p>Room Charges (1 room x 1 night)</p>
                            <p>₹11898</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>Total Discounts</p>
                            <p>₹9264</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>Price after discounts</p>
                            <p>₹9264</p>
                        </div>
                        <div className='d-flex justify-content-between pt-1' style={{ borderTop: '1px solid #eff3f8' }}>
                            <p className='fw-bolder'>Payable Now</p>
                            <p className='fw-bolder'>₹3286</p>
                        </div>
                    </CardBody>
                </Card> */}
                    <Card>
                        <CardBody>
                            <h3 style={{ borderBottom: '1px solid' }} >Packages</h3>
                            {packages.map((a, index) => {
                                return (
                                    <div className='mt-1 durationCard' key={index}>
                                        <Card className='p-1'>
                                            <div className='d-flex'>
                                                {/* <Input type='radio' name='promo' id='promo' className='me-1' /> */}
                                                <h4 className="d-inline">{a.PackagesName}</h4>
                                            </div>
                                            {showMore ? <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                                                <a target="blank" href={decoratedHref} key={key}>
                                                    {decoratedText}
                                                </a>
                                            )} className='py-1'>{a.Description}</Linkify> : <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                                                <a target="blank" href={decoratedHref} key={key}>
                                                    {decoratedText}
                                                </a>
                                            )} className='py-1'>{a.Description.substring(0, 80)}</Linkify>}
                                            {a.Description.length > 80 ? <a onClick={() => setshowMore(!showMore)} className='d-block text-decoration-underline' style={{ color: '#7467f0' }}>{showMore ? "show less" : "show more"}</a> : ''}
                                        </Card>
                                    </div>
                                )
                            })}

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default bookingengine