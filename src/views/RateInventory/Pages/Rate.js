import React, { useEffect, useState } from 'react'
import {
    Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form, Alert, Accordion, AccordionBody, AccordionHeader, AccordionItem
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import axios from '../../../API/axios'
import moment from 'moment'
import RateItem from './RateItem'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

function Rate({ RoomTypeList, ReloadRateInventoryList, handleFlag }) {
console.log('RoomTypeList in rate', RoomTypeList)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')
    const [weekDays, setWeekDays] = useState([])
    // setWeekDays([...weekDays, ])
    const [fromDate, setFromDate] = useState(moment().format('l'))
    const [toDate, setToDate] = useState(moment().format('l'))
    const [monday, setMonday] = useState(true)
    const [tuesday, setTuesday] = useState(true)
    const [wednesday, setWednesday] = useState(true)
    const [thursday, setThursday] = useState(true)
    const [friday, setFriday] = useState(true)
    const [saturday, setSaturday] = useState(true)
    const [sunday, setSunday] = useState(true)
    const [open, setOpen] = useState('')
    const [extraAdultPrice, setExtraAdultPrice] = useState('')
    const [extraChildPrice, setExtraChildPrice] = useState('')
    const [roomRate, setRoomRate] = useState('')

    const [mealPlanArr, setMealPlanArr] = useState([])
    const [selMeal, setSelMeal] = useState('')

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    const getDaysByDate = () => {
        console.log('f', fromDate)
        console.log('t', toDate)
        let f = moment(fromDate)
        let t = moment(toDate)
        const range = t.diff(f, 'days')
        console.log('range', range)
        if (range >= 6) {
            setWeekDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        } else {
            let dates = []
            let now = f.clone()
            while (now.isSameOrBefore(t)) {
                dates.push(now.format('MM/DD/YYYY'));
                now.add(1, 'days');
            }
            console.log('dates', dates)
            let arr = dates.map(d => moment(d).format('dddd'))
            setWeekDays(arr)
        }
    }

    useEffect(() => {
        getDaysByDate()
    }, [toDate])

    const getMealPlans = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: 'abc',
                Event: 'selectall'
            }
            const res = await axios.post(`/getdata/mealdetails`, obj)
            console.log('resRate', res)
            let result = res?.data[0]
            if (result.length > 0) {
                let arr = result.map(m => {
                    return { value: m.ratePlanID, label: m.ratePlan, ...m }
                })
                setMealPlanArr(arr)
                setSelMeal(arr[0].value)
            } else {
                setMealPlanArr([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getMealPlans()
    }, [])


    const [updateRateArray] = useState(
        RoomTypeList?.map((roomType) => {
            return { roomid: roomType.roomID, rate: roomType.roomRate, child: roomType.extraChildPrice, adult: roomType.extraAdultPrice }
        })
    )

    const handleRate = async r => {
        if ((weekDays.length === 0)) {
            toast.error('Select a valid date range and days', { position: "top-center" })
        } else {
            try {
                const obj = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    RoomID: r.roomID,
                    RatePlanID: selMeal,
                    RoomTypeID: r.roomTypeID,
                    ExtraAdultPrice: extraAdultPrice,
                    ExtraChildPrice: extraChildPrice,
                    ExtraBedCharges: 10.0,
                    RoomRate: roomRate,
                    CGST_P: r.CGST_P,
                    SGST_P: r.SGST_P,
                    IGST_P: r.IGST_P,
                    TotalTax: r.totalTax,
                    TotalAmount: r.totalAmount,
                    FromDate: moment(fromDate).format('YYYY-MM-DD'),
                    ToDate: moment(toDate).format('YYYY-MM-DD'),
                    Days: weekDays.toString()
                }
                console.log('obj', obj)
                const res = await axios.post('/setdata/rateinventoryrange', obj, {
                    headers: {
                        LoginID,
                        Token,
                        Seckey: "abc",
                    }
                })
                console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success("Rate updated successfully!")
                    setFromDate(new Date())
                    setToDate(new Date())
                    setExtraAdultPrice('')
                    setExtraChildPrice('')
                    setRoomRate('')
                    setWeekDays([])
                }
            } catch (error) {
                console.log('error', error)
                toast.error(error?.data?.response?.message)
            }
        }
    }

    const reset = () => {
        setFromDate(moment().format('l'))
        setToDate(moment().format('l'))
        setWeekDays([])
    }

    return (
        <>
            {console.log('weekdays', weekDays)}
            <Card color='success' inverse onClick={() => setShow(!show)}>
                <CardHeader className='rate_inventry_card_header'>
                    Rate
                </CardHeader>
            </Card>
            <Modal
                isOpen={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                    handleFlag()
                }}
                className='modal-dialog-centered'
                onClosed={() => {
                    setCardType('')
                    reset()
                    handleFlag()
                }}
                size='lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => {
                    setShow(!show)
                }}>
                    <span>Bulk Update Rates</span>
                </ModalHeader>
                <ModalBody className='rate_inventry'>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <Row>
                        <Col lg='4' md='4' className='mb-1'>
                            <Label className='form-label' for='hf-picker'>
                                From Date :
                            </Label>
                            <Flatpickr
                                value={moment(fromDate).format('YYYY-MM-DD')}
                                id='hf-picker'
                                className='form-control'
                                onChange={date => { setFromDate(moment(date[0]).format('l')) }}
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        <Col lg='4' md='4' className='mb-1'>
                            <Label className='form-label' for='hf-picker1'>
                                To Date :
                            </Label>

                            <Flatpickr
                                value={moment(toDate).format('YYYY-MM-DD')}
                                id='hf-picker1'
                                className='form-control'
                                onChange={date => {
                                    console.log(date)
                                    setToDate(moment(date[0]).format('l'))
                                }}
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                            />
                        </Col>
                        <Col lg='4' md='4' className='mb-1'>
                            <Label>Rate Plan</Label>
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                options={mealPlanArr}
                                value={mealPlanArr.filter(c => c.value === selMeal)}
                                onChange={e => setSelMeal(e.value)}
                            />
                        </Col>
                        <Col lg='12' md='12' className='mb-1'>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked'
                                    value='Monday'
                                    checked={weekDays.includes('Monday')}
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked' className='form-check-label'>
                                    Mon
                                </Label>
                            </div>
                            {console.log(weekDays.toString())}
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked1'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Tuesday')}
                                    value='Tuesday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked1' className='form-check-label'>
                                    Tue
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked2'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Wednesday')}
                                    value='Wednesday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked2' className='form-check-label'>
                                    Wed
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked3'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Thursday')}
                                    value='Thursday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked3' className='form-check-label'>
                                    Thu
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked4'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Friday')}
                                    value='Friday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked4' className='form-check-label'>
                                    Fri
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked5'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Saturday')}
                                    value='Saturday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked5' className='form-check-label'>
                                    Sat
                                </Label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <Input
                                    type='checkbox'
                                    id='basic-cb-unchecked6'
                                    // onChange={e => setWeekDays([...weekDays, e.target.value])}
                                    checked={weekDays.includes('Sunday')}
                                    value='Sunday'
                                    onChange={e => {
                                        if (weekDays.includes(e.target.value)) {
                                            let arr = weekDays.filter(d => d !== e.target.value)
                                            setWeekDays(arr)
                                        } else {
                                            setWeekDays([...weekDays, e.target.value])
                                        }
                                    }}
                                />
                                <Label for='basic-cb-unchecked6' className='form-check-label'>
                                    Sun
                                </Label>
                            </div>
                        </Col>
                    </Row>
                    <Accordion className='accordion-margin' open={open} toggle={toggle}>
                        {
                            RoomTypeList?.filter(c => c.ratePlanID === selMeal).map((curElm, index) => {
                                //updateRateArray[index] = {}
                                const theKey = `${curElm.roomID}__${index}`
                                //console.log('element - ', curElm)
                                return (
                                    <RateItem index={index} rateItem={updateRateArray[index]} defaultItem={curElm} theKey={theKey} key={theKey} displayName={curElm.roomDisplayName} RatePlanID={curElm.ratePlanID} handleRate={handleRate} setExtraAdultPrice={setExtraAdultPrice} setExtraChildPrice={setExtraChildPrice} setRoomRate={setRoomRate} extraAdultPrice={extraAdultPrice} extraChildPrice={extraChildPrice} roomRate={roomRate} />
                                )
                            })
                        }
                        {/* <AccordionItem>
                            <AccordionHeader targetId='12'>Executive Room( EP )</AccordionHeader>
                            <AccordionBody accordionId='12'>
                            <Row>
                                <Col md='4' className='my-50'>
                                <span>Set Rate</span>
                                    <Input type='number' />
                                </Col>
                                <Col md='4' className='my-50'>
                                <span>Extra Adult Rate</span>
                                    <Input type='number' />
                                </Col>
                                <Col md='4' className='my-50'>
                                <span>Extra Child Rate</span>
                                    <Input type='number' />
                                </Col>
                                </Row>
                            </AccordionBody>
                        </AccordionItem> */}
                    </Accordion>
                    {/* <div className='text-end mt-1'>
                        <Button className='me-1' color='primary' type='submit' onClick={() => {
                            rateInventoryInsert()
                        }}>
                            Save
                        </Button>
                        <Button className='me-1' color='danger' type='submit' onClick={(e) => {
                            e.preventDefault()
                            setShow(!show)
                        }}>
                            Close
                        </Button>
                    </div> */}
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

export default Rate