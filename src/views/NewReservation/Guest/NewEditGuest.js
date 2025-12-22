import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { toast } from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const NewEditGuest = ({ open, handleOpen, guestData }) => {
    console.log('gData', guestData)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [data, setData] = useState([])
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [cityList, setCityList] = useState([])
    const [guestName, setGuestName] = useState('')
    const [guestLastName, setGuestLastName] = useState('')
    const [mobPrefix, setMobPrefix] = useState('')
    const [mobNumber, setMobNumber] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [guestDob, setGuestDob] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [address, setAddress] = useState('')
    const [countryId, setCountryId] = useState('')
    const [stateId, setStateId] = useState('')
    const [districtId, setDistrictId] = useState('')
    const [cityId, setCityId] = useState('')
    const [display, setDisplay] = useState(false)

    const getGuestData = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: 'abc',
                GuestID: guestData
            }
            const res = await axios.post('/getdata/bookingdata/guestdetails', obj)
            console.log('res', res)
            setData(res?.data[0])
            if (res?.data[0].length > 0) {
                let data = res?.data[0]
                setGuestName(data[0].guestName)
                setGuestLastName(data[0].lastName)
                setMobPrefix(data[0].prefix)
                setMobNumber(data[0].guestMobileNumber)
                setGuestEmail(data[0].guestEmail)
                setGuestDob(data[0].guestDOB)
                setPinCode(data[0].pincode)
                setAddress(data[0].guestAddress)
                setCountryId(data[0].countryID)
                setStateId(data[0].stateID)
                setDistrictId(data[0].districtID)
                setCityId(data[0].cityID)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getGuestData()
    }, [open])

    const getCountryData = async () => {
        try {
            const countryListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/countrydetails`, countryListBody)
            console.log('countryres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(c => {
                    return { value: c.countryID, label: c.countryName }
                })
                setCountryList(options)
            }
        } catch (error) {
            console.log("Country List Error", error)
        }
    }

    const getStateData = async () => {
        try {
            const stateDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CountryID: countryId,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
            console.log('stateres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(s => {
                    return { value: s.stateID, label: s.stateName }
                })
                setStateList(options)
            }
        } catch (error) {
            console.log("State List Error", error)
        }
    }

    // const getDisctrictData = async () => {
    //     try {
    //         const districtDetailsBody = {
    //             LoginID,
    //             Token,
    //             Seckey: "abc",
    //             StateID: stateId,
    //             Event: "select"
    //         }
    //         const res = await axios.post(`/getdata/regiondata/districtdetails`, districtDetailsBody)
    //         console.log('districtres', res)
    //         let data = res?.data[0]
    //         if (data.length > 0) {
    //             const options = data.map(d => {
    //                 return { value: d.DistrictID, label: d.DistrictName }
    //             })
    //             setDistrictList(options)
    //         }
    //     } catch (error) {
    //         console.log("District List Error", error)
    //     }
    // }

    const getCityData = async () => {
        try {
            const cityListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                DistrictID: stateId,
                StateID: stateId,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/citydetails`, cityListBody)
            console.log('cityres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(ci => {
                    return { value: ci.cityID, label: ci.cityName }
                })
                setCityList(options)
            } else setCityList([])
        } catch (error) {
            console.log("City List Error", error)
        }
    }

    useEffect(() => {
        getCountryData()
        getStateData()
        getCityData()
    }, [data, countryId, stateId, cityId])

    const handleUpdateGuestDetail = async (e) => {
        e.preventDefault()
        setDisplay(true)
        console.log('values', guestName, guestLastName, mobPrefix, mobNumber, guestEmail, guestDob, pinCode, address, countryId, stateId, districtId, cityId)
        if (guestName && guestLastName && mobPrefix && mobNumber && pinCode && address && countryId && stateId && cityId !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Name: guestName,
                    LastName: guestLastName,
                    PrefixN: mobPrefix,
                    MobileNumber: mobNumber,
                    Type: "Normal User",
                    Email: guestEmail,
                    DOB: guestDob,
                    Address: address,
                    CountryID: countryId,
                    StateID: stateId,
                    DistrictID: stateId,
                    CityID: cityId,
                    Pincode: pinCode,
                    FloorID: null,
                    SpecialNote: "",
                    Event: "update",
                    GuestID: guestData
                }

                const res = await axios.post('/getdata/bookingdata/guestdetails', obj)
                console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success('Guest details updated!')
                    handleOpen()
                    setDisplay(false)
                } else {
                    toast.error('Fill all fields')
                }
            } catch (error) {
                console.log('error', error)
                toast.error('Something went wrong, Try again!')
            }
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpen}
                className='moadal-dialog-centered modal-xl'
                backdrop={false}
            >
                <ModalHeader toggle={handleOpen}>Edit Guest Details</ModalHeader>
                <Form onSubmit={e => handleUpdateGuestDetail(e)}>
                    <ModalBody>
                        <Row className='d-flex flex-column justify-content-center align-items-center'>
                            <Col className='mt-1 d-flex flex-md-row flex-column'>
                                <Col md='4' sm='12' className='mx-1'>
                                    <Label className='form-label' for='name'>
                                        Guest Name<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        placeholder='Enter name here'
                                        id='name'
                                        type='text'
                                        value={guestName}
                                        //onChange={e => setGuestName(e.target.value)}
                                        onChange={e => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/; // allows only alphabets and spaces
                                            if (regex.test(value)) {
                                                setGuestName(value);
                                            }
                                        }}
                                        invalid={display && guestName?.trim() === ''}
                                    />
                                    {display && !guestName?.trim() ? <span className='error_msg_lbl'>Guest Name is required </span> : null}
                                </Col>
                                <Col className='mx-1'>
                                    <Label className='form-label' for='last_name'>
                                        Guest Last Name<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        placeholder='Enter last name here'
                                        type='text'
                                        id='last_name'
                                        value={guestLastName}
                                       // onChange={e => setGuestLastName(e.target.value)}
                                        onChange={e => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/; // allows only alphabets and spaces
                                            if (regex.test(value)) {
                                                setGuestLastName(value);
                                            }
                                        }}                                        invalid={display && guestLastName?.trim() === ''}
                                    />
                                    {display && !guestLastName?.trim() ? <span className='error_msg_lbl'>Last Name is required </span> : null}
                                </Col>
                                <Col className='mx-1 d-flex flex-row'>
                                    <Col className='me-1'>
                                        <Label className='form-label' for='prefix'>
                                            Prefix<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            placeholder='91'
                                            id='prefix'
                                            type='phone'
                                            maxLength={3}
                                            value={mobPrefix}
                                            onChange={e => setMobPrefix(e.target.value)}
                                            invalid={display && mobPrefix?.trim() === ''}
                                        />
                                        {display && !mobPrefix?.trim() ? <span className='error_msg_lbl'>Enter Prefix </span> : null}
                                    </Col>
                                    <Col>
                                        <Label className='form-label' for='mobile_number'>
                                            Mobile Number<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            placeholder='XXXXX-XXXXX'
                                            id='mobile_number'
                                            type='phone'
                                            maxLength={10}
                                            value={mobNumber}
                                            onChange={e => setMobNumber(e.target.value)}
                                            invalid={display && mobNumber?.trim() === ''}
                                        />
                                        {display && !mobNumber?.trim() ? <span className='error_msg_lbl'>Mob required </span> : null}
                                    </Col>
                                </Col>
                            </Col>
                            <Col className='mt-1 d-flex flex-md-row flex-column'>
                                <Col md='4' sm='12' className='mx-1'>
                                    <Label className='form-label' for='email'>
                                        Email
                                    </Label>
                                    <Input
                                        placeholder='Enter email here'
                                        id='email'
                                        type='email'
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                    // invalid={display && guestEmail?.trim() === ''}
                                    />
                                    {/* {display && !guestEmail?.trim() ? <span className='error_msg_lbl'>Email is required </span> : null} */}
                                </Col>
                                <Col className='mx-1' >
                                    <Label className='form-label' for='dob'>
                                        Date of Birth
                                    </Label>
                                    <Flatpickr
                                        id='dob'
                                        className='form-control'
                                        options={{
                                            dateFormat: 'd-m-Y',
                                        }}
                                        value={moment(guestDob).format('DD-MM-YYYY')}
                                        onChange={date => setGuestDob(date[0])}
                                    />
                                    {/* {display && !guestDob ? <span className='error_msg_lbl'>DOB is required </span> : null} */}
                                </Col>
                                <Col className='mx-1'>
                                    <Label className='form-label' for='country'>
                                        Country<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        placeholder='Select Country'
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={countryList}
                                        value={countryList?.filter(c => c.value === countryId)}
                                        onChange={val => {
                                            setCountryId(val.value)
                                        }}
                                        invalid={display && countryId === ''}
                                    />
                                    {display && !countryId ? <span className='error_msg_lbl'>Country is required </span> : null}
                                </Col>
                            </Col>
                            <Col className='mt-1 d-flex flex-md-row flex-column'>
                                <Col md='3' sm='12' className='mx-1'>
                                    <Label className='form-label' for='state'>
                                        State<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        isDisabled={countryId === ''}
                                        placeholder='Select State'
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={stateList}
                                        value={stateList?.filter(c => c.value === stateId)}
                                        onChange={val => {
                                            setStateId(val.value)
                                        }}
                                        invalid={display && stateId === ''}
                                    />
                                    {display && !stateId ? <span className='error_msg_lbl'>State is required </span> : null}
                                </Col>
                                {/* <Col className='mx-1'>
                                    <Label className='form-label' for='city'>
                                        District<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        isDisabled={stateId === ''}
                                        placeholder='Select Dist'
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={districtList}
                                        value={districtList?.filter(c => c.value === districtId)}
                                        onChange={val => {
                                            setDistrictId(val.value)
                                        }}
                                        invalid={display && districtId === ''}
                                    />
                                    {display && !districtId ? <span className='error_msg_lbl'>District is required </span> : null}
                                </Col> */}
                                <Col className='mx-1'>
                                    <Label className='form-label' for='city'>
                                        City<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        isDisabled={districtId === ''}
                                        placeholder='Select City'
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={cityList}
                                        value={cityList?.filter(c => c.value === cityId)}
                                        onChange={val => {
                                            setCityId(val.value)
                                        }}
                                        invalid={display && cityId === ''}
                                    />
                                    {display && !cityId ? <span className='error_msg_lbl'>City is required </span> : null}
                                </Col>

                                <Col className='mx-1' >
                                    <Label className='form-label' for='pincode'>
                                        Pincode<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        placeholder='Enter Pincode here'
                                        id='pincode'
                                        type='phone'
                                        maxLength={6}
                                        value={pinCode}
                                        onChange={e => setPinCode(e.target.value)}
                                        invalid={display && pinCode?.trim() === ''}
                                    />
                                    {display && !pinCode?.trim() ? <span className='error_msg_lbl'>Pincode is required </span> : null}
                                </Col>
                            </Col>
                            <Col className='mt-1 d-flex flex-md-row flex-column'>
                                <Col className='mx-1'>
                                    <Label className='form-label' for='address'>
                                        Address<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        placeholder='Enter address here'
                                        type='textarea'
                                        id='address'
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        invalid={display && address?.trim() === ''}
                                    />
                                    {display && !address?.trim() ? <span className='error_msg_lbl'>Address is required </span> : null}
                                </Col>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Col xs={12} className='text-center'>
                            <Button className='me-1' color='primary' type='submit'>
                                Submit
                            </Button>
                            <Button onClick={handleOpen} color='secondary' outline>
                                Cancel
                            </Button>
                        </Col>
                    </ModalFooter>
                </Form>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default NewEditGuest