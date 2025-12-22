import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { toast } from 'react-hot-toast'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { selectThemeColors } from '@utils'

import axios from '../../API/axios'
import { useSelector } from 'react-redux'

const defaultValues = {
    name: '',
    last_name: '',
    prefix: '',
    mobile_number: '',
    email: '',
    dob: '',
    address: '',
    pincode: '',
    country: '',
    state: '',
    city: ''
}

const RegisterGuest = ({ open, handleOpen }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData

    const [stateList, setStateList] = useState([])
    const [countryList, setCountryList] = useState([])
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

    // const userId = localStorage.getItem('user-id')

    // COUNTRY API
    const countryDetailsList = async () => {
        try {
            const countryListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/countrydetails`, countryListBody)
            console.log('res-country', res)
            setCountryList(res?.data[0])
        } catch (error) {
            console.log("Country List Error", error.message)
        }
    }

    const countryOptions = countryList?.length && countryList[0]?.CountryName ? countryList?.map(function (country) {
        return { value: country.CountryID, label: country.CountryName }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleCountryDetailsList = (value) => {
        if (value === 'reload') {
            countryDetailsList()
            return
        }
        setCountryId(value)
    }

    useEffect(() => {
        countryDetailsList()
    }, [])

    // STATE API
    const stateDetailsList = (value) => {
        try {
            const stateDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CountryID: value,
                Event: "select"
            }
            axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
                .then(stateDropDownResponse => {
                    setStateList(stateDropDownResponse?.data[0])
                })
        } catch (error) {
            console.log("State Details Error", error.message)
        }
    }
    const stateOptions = stateList?.length && stateList[0]?.StateName ? stateList?.map(function (state) {
        return { value: state.StateID, label: state.StateName }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleStateDetailsList = (value) => {
        if (value === 'reload') {
            stateDetailsList()
            return
        }
        setStateId(value)
    }

    // DISTRICT API
    // const districtDetailsList = (value) => {
    //     try {
    //         const districtDetailsBody = {
    //             LoginID,
    //             Token,
    //             Seckey: "abc",
    //             StateID: value,
    //             Event: "select"
    //         }
    //         axios.post(`/getdata/regiondata/districtdetails`, districtDetailsBody)
    //             .then(districtDropDownResponse => {
    //                 setDistrictList(districtDropDownResponse?.data[0])
    //             })
    //     } catch (error) {
    //         console.log("District Details Error", error.message)
    //     }
    // }
    // const districtOptions = districtList?.length && districtList[0]?.DistrictName ? districtList?.map(function (district) {
    //     return { value: district.DistrictID, label: district.DistrictName }
    // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    // const handelDistrictDetailsList = (value) => {
    //     if (value === 'reload') {
    //         districtDetailsList()
    //         return
    //     }
    //     setDistrictId(value)
    // }

    // CITY API
    const cityDetailsList = (value) => {
        try {
            const cityListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                DistrictID: value,
                StateID: value,
                Event: "select"
            }
            axios.post(`/getdata/regiondata/citydetails`, cityListBody)
                .then(cityDropDownResponse => {
                    console.log("cityDropDownResponse", cityDropDownResponse?.data[0])
                    setCityList(cityDropDownResponse?.data[0])
                })
        } catch (error) {
            console.log("City Details Error", error.message)
        }
    }
    const cityOptions = cityList?.length && cityList[0]?.CityName ? cityList?.map(function (city) {
        return { value: city.CityID, label: city.CityName }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleCityDetailsList = (value) => {
        if (value === 'reload') {
            cityDetailsList()
            return
        }
        setCityId(value)
    }

    const GuestSchema = yup.object().shape({
        name: yup.string().required(),
        last_name: yup.string().required(),
        prefix: yup.number().min(2).required(),
        mobile_number: yup.number().min(10).required(),
        email: yup.string().email().required(),
        dob: yup.date().required(),
        pincode: yup.number().required(),
        address: yup.string().required(),
        country: yup.string().required(),
        state: yup.string().required(),
        city: yup.string().required()
    })

    const {
        reset
    } = useForm({
        defaultValues,
        resolver: yupResolver(GuestSchema)
    })

    const handleReset = () => {
        reset({
            name: '',
            last_name: '',
            prefix: '',
            mobile_number: '',
            email: '',
            dob: '',
            address: '',
            pincode: '',
            country: '',
            state: '',
            city: ''
        })
        handleOpen()
    }

    const guestRegister = () => {
        try {
            const guestRegisterBody = {
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
                Event: "insert"
            }
            axios.post(`/setdata/guestdetails`, guestRegisterBody)
                .then((res) => {
                    console.log("Guest Entry", res)
                    toast.success('Guest registered succesfully')
                })
        } catch (error) {
            console.log("Guest Register Error", error.message)
        }
    }

    const onSubmit = () => {
        setDisplay(true)
        if (guestName.trim() && guestLastName.trim() && mobPrefix.trim() && mobNumber.trim() && guestEmail.trim() && guestDob && countryId && stateId && cityId && pinCode.trim() && address.trim() !== '') {
            guestRegister()
            handleOpen()
            setGuestName('')
            setGuestLastName('')
            setMobPrefix('')
            setMobNumber('')
            setGuestEmail('')
            setGuestDob('')
            setCountryId('')
            setStateId('')
            setCityId('')
            setPinCode('')
            setAddress('')
            setDisplay(false)
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
                <ModalHeader className='bg-transparent'>New Guest Details</ModalHeader>
                <Form onReset={handleReset}>
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
                                        onChange={e => setGuestName(e.target.value)}
                                        invalid={display && guestName.trim() === ''}
                                    />
                                    {display === true && !guestName.trim() ? <span className='error_msg_lbl'>Guest Name is required </span> : null}
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
                                        onChange={e => setGuestLastName(e.target.value)}
                                        invalid={display && guestLastName.trim() === ''}
                                    />
                                    {display === true && !guestLastName.trim() ? <span className='error_msg_lbl'>Last Name is required </span> : null}
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
                                            invalid={display && mobPrefix.trim() === ''}
                                        />
                                        {display === true && !mobPrefix.trim() ? <span className='error_msg_lbl'>Enter Prefix </span> : null}
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
                                            invalid={display && mobNumber.trim() === ''}
                                        />
                                        {display === true && !mobNumber.trim() ? <span className='error_msg_lbl'>Mob required </span> : null}
                                    </Col>
                                </Col>
                            </Col>
                            <Col className='mt-1 d-flex flex-md-row flex-column'>
                                <Col md='4' sm='12' className='mx-1'>
                                    <Label className='form-label' for='email'>
                                        Email<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        placeholder='Enter email here'
                                        id='email'
                                        type='email'
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                        invalid={display && guestEmail.trim() === ''}
                                    />
                                    {display === true && !guestEmail.trim() ? <span className='error_msg_lbl'>Email is required </span> : null}
                                </Col>
                                <Col className='mx-1' >
                                    <Label className='form-label' for='dob'>
                                        Date of Birth<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        type='date'
                                        placeholder='Select Date of Birth'
                                        onChange={e => setGuestDob(e.target.value)}
                                        invalid={display && guestDob === ''}
                                    />
                                    {display === true && !guestDob ? <span className='error_msg_lbl'>DOB is required </span> : null}
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
                                        options={countryOptions}
                                        value={countryOptions?.filter(c => c.value === countryId)}
                                        onChange={val => {
                                            handleCountryDetailsList(val.value)
                                            stateDetailsList(val.value)
                                        }}
                                        invalid={display && countryId === ''}
                                    />
                                    {display === true && !countryId ? <span className='error_msg_lbl'>Country is required </span> : null}
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
                                        options={stateOptions}
                                        value={stateOptions?.filter(c => c.value === stateId)}
                                        onChange={val => {
                                            handleStateDetailsList(val.value)
                                            cityDetailsList(val.value)
                                            // districtDetailsList(val.value)
                                        }}
                                        invalid={display && stateId === ''}
                                    />
                                    {display === true && !stateId ? <span className='error_msg_lbl'>State is required </span> : null}
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
                                        options={districtOptions}
                                        value={districtOptions?.filter(c => c.value === districtId)}
                                        onChange={val => {
                                            handelDistrictDetailsList(val.value)
                                            cityDetailsList(val.value)
                                        }}
                                        invalid={display && districtId === ''}
                                    />
                                    {display === true && !districtId ? <span className='error_msg_lbl'>District is required </span> : null}
                                </Col> */}
                                <Col className='mx-1'>
                                    <Label className='form-label' for='city'>
                                        City<span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        isDisabled={stateId === ''}
                                        placeholder='Select City'
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={cityOptions}
                                        value={cityOptions?.filter(c => c.value === cityId)}
                                        onChange={val => {
                                            handleCityDetailsList(val.value)
                                        }}
                                        invalid={display && cityId === ''}
                                    />
                                    {display === true && !cityId ? <span className='error_msg_lbl'>City is required </span> : null}
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
                                        invalid={display && pinCode.trim() === ''}
                                    />
                                    {display === true && !pinCode.trim() ? <span className='error_msg_lbl'>Pincode is required </span> : null}
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
                                        invalid={display && address.trim() === ''}
                                    />
                                    {display === true && !address.trim() ? <span className='error_msg_lbl'>Address is required </span> : null}
                                </Col>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Col xs={12} className='text-center'>
                            <Button className='me-1' color='primary' onClick={onSubmit}>
                                Submit
                            </Button>
                            <Button type='reset' color='secondary' outline>
                                Discard
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

export default RegisterGuest