import React, { useState, useEffect } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from '../../API/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const RegisterAgency = ({ open, handleOpenAgency, sourceID }) => {
    console.log('sourceID', sourceID)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [agency, setAgency] = useState('')
    const [countryOpt, setCountryOpt] = useState([])
    const [stateOpt, setStateOpt] = useState([])
    const [districtOpt, setDistrictOpt] = useState([])
    const [cityOpt, setCity] = useState([])
    const [selCountry, setSelCountry] = useState('')
    const [selState, setSelState] = useState('')
    const [selDistrict, setSelDistrict] = useState('')
    const [selCity, setSelCity] = useState('')

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
                setCountryOpt(options)
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
                CountryID: selCountry,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
            console.log('stateres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(s => {
                    return { value: s.stateID, label: s.stateName }
                })
                setStateOpt(options)
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
    //             StateID: selState,
    //             Event: "select"
    //         }
    //         const res = await axios.post(`/getdata/regiondata/districtdetails`, districtDetailsBody)
    //         console.log('districtres', res)
    //         let data = res?.data[0]
    //         if (data.length > 0) {
    //             const options = data.map(d => {
    //                 return { value: d.DistrictID, label: d.DistrictName }
    //             })
    //             setDistrictOpt(options)
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
                DistrictID: selState,
                StateID: selState,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/citydetails`, cityListBody)
            console.log('cityres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(ci => {
                    return { value: ci.cityID, label: ci.cityName }
                })
                setCity(options)
            } else setCity([])
        } catch (error) {
            console.log("City List Error", error)
        }
    }


    useEffect(() => {
        getCountryData()
        getStateData()
        // getDisctrictData()
        getCityData()
        if (sourceID === 'BSID20230220AA00001') {
            setAgency('Travel Agency')
        } else {
            setAgency('Corporate Travel Agency')
        }
    }, [open, selCountry, selState, selCity])

    const [submit, setSubmit] = useState(false)
    const [cname, setCname] = useState('')
    const [aname, setAname] = useState('')
    const [aemail, setAemail] = useState('')
    const [prefix, setPrefix] = useState('')
    const [cnum, setCnum] = useState('')
    const [wsite, setWsite] = useState('')
    const [gst, setGst] = useState('')
    const [add, setAdd] = useState('')

    const reset = () => {
        setSubmit(false)
        setCname('')
        setAname('')
        setAemail('')
        setPrefix('')
        setCnum('')
        setWsite('')
        setGst('')
        setAdd('')
        handleOpenAgency()
    }

    const handleAddAgency = async (e) => {
        setSubmit(true)
        e.preventDefault()
        if (cname && aname && aemail && prefix && cnum !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Event: "insert",
                    CompanyName: cname,
                    AgentName: aname,
                    ContactEmail: aemail,
                    ContactNo: cnum,
                    CountryCode: prefix,
                    WebSite: wsite,
                    GST: gst,
                    AgencyAddress: add,
                    CountryID: selCountry,
                    StateID: selState,
                    DistrictID: selState,
                    CityID: selCity,
                    BookingSourceID: sourceID
                }
                const res = await axios.post('/booking/TravelAgencyDetails/save', obj)
                console.log('res', res)
                if (res?.data[0][0].status === "Success") {
                    toast.success('Data saved!')
                    setSubmit(false)
                    handleOpenAgency()
                    reset()
                }
            } catch (error) {
                console.log('error', error)
                // toast.error("Something went wrong, Try again!")
                toast.error(error.response.data.message)
                setSubmit(false)
            }
        } else {
            toast.error("Fill all fields!")
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpenAgency}
                className='moadal-dialog-centered modal-lg'
                backdrop
            >
                <ModalHeader toggle={handleOpenAgency}>New {agency} details</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => handleAddAgency(e)}>
                        <Row className='mb-1'>
                            <Col>
                                <Label className='form-label' for='cname'>
                                    Company Name<span className='text-danger'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    name='cname'
                                    placeholder='Enter Company name'
                                    value={cname}
                                    onChange={e => setCname(e.target.value)}
                                    invalid={submit && cname === ""}
                                />
                                {submit && cname === "" && <FormFeedback>Company Name is required!</FormFeedback>}
                            </Col>
                            <Col>
                                <Label className='form-label' for='aname'>
                                    Agent Name<span className='text-danger'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    name='aname'
                                    placeholder='Enter agent name'
                                    value={aname}
                                    onChange={e => setAname(e.target.value)}
                                    invalid={submit && aname === ""}
                                />
                                {submit && aname === "" && <FormFeedback>Agent Name is required!</FormFeedback>}
                            </Col>
                            <Col>
                                <Label className='form-label' for='aemail'>
                                    Contact Email<span className='text-danger'>*</span>
                                </Label>
                                <Input
                                    type='email'
                                    name='aemail'
                                    placeholder='Enter contact email'
                                    value={aemail}
                                    onChange={e => setAemail(e.target.value)}
                                    invalid={submit && aemail === ""}
                                />
                                {submit && aemail === "" && <FormFeedback>Contact Email is required!</FormFeedback>}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col className='d-flex flex-row justify-content-between align-items-center'>
                                <div className='w-50 me-1'>
                                    <Label className='form-label' for='prefix'>
                                        Country Code<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        type='number'
                                        name='prefix'
                                        placeholder='91'
                                        value={prefix}
                                        onChange={e => setPrefix(e.target.value)}
                                        invalid={submit && prefix === ""}
                                    />
                                    {submit && prefix === "" && <FormFeedback>Country Code is required!</FormFeedback>}
                                </div>
                                <div className='w-100 ms-1'>
                                    <Label className='form-label' for='cnumber'>
                                        Contact No.<span className='text-danger'>*</span>
                                    </Label>
                                    <Input
                                        type='number'
                                        name='cnumber'
                                        placeholder='Enter contact no.'
                                        value={cnum}
                                        onChange={e => setCnum(e.target.value)}
                                        invalid={submit && cnum === ""}
                                    />
                                    {submit && cnum === "" && <FormFeedback>Contact No. is required!</FormFeedback>}
                                </div>
                            </Col>
                            <Col>
                                <Label className='form-label' for='wsite'>
                                    Website
                                </Label>
                                <Input
                                    type='text'
                                    name='wsite'
                                    placeholder='Enter website URL'
                                    value={wsite}
                                    onChange={e => setWsite(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label className='form-label' for='gst'>
                                    GST Number
                                </Label>
                                <Input
                                    type='text'
                                    name='gst'
                                    placeholder='Enter GST number'
                                    value={gst}
                                    onChange={e => setGst(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label className='form-label' for='add'>
                                    Address
                                </Label>
                                <Input
                                    type='textarea'
                                    name='add'
                                    value={add}
                                    onChange={e => setAdd(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label className='form-label' for='country'>Country</Label>
                                <Select
                                    placeholder='Select Country'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={countryOpt}
                                    value={countryOpt?.filter(c => c.value === selCountry)}
                                    onChange={e => {
                                        setSelCountry(e.value)
                                    }}
                                    invalid={submit && selCountry === ''}
                                />
                            </Col>
                            <Col>
                                <Label className='form-label' for='country'>State</Label>
                                <Select
                                    isDisabled={selCountry === ''}
                                    placeholder='Select State'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={stateOpt}
                                    value={stateOpt?.filter(c => c.value === selState)}
                                    onChange={e => {
                                        setSelState(e.value)
                                    }}
                                    invalid={submit && selState === ''}
                                />
                            </Col>
                            {/* <Col>
                                <Label className='form-label' for='country'>District</Label>
                                <Select
                                    isDisabled={selState === ''}
                                    placeholder='Select District'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={districtOpt}
                                    value={districtOpt?.filter(c => c.value === selDistrict)}
                                    onChange={e => {
                                        setSelDistrict(e.value)
                                    }}
                                    invalid={submit && selDistrict === ''}
                                />
                            </Col> */}
                            <Col>
                                <Label className='form-label' for='country'>City</Label>
                                <Select
                                    isDisabled={selState === ''}
                                    placeholder='Select City'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={cityOpt}
                                    value={cityOpt?.filter(c => c.value === selCity)}
                                    onChange={e => {
                                        setSelCity(e.value)
                                    }}
                                    invalid={submit && selCity === ''}
                                />
                            </Col>
                        </Row>
                        <Row className='text-center'>
                            <Col>
                                <Button className='m-1' color='success' type='Submit'>Save</Button>
                                <Button className='m-1' color='primary' onClick={reset}>Cancel</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default RegisterAgency