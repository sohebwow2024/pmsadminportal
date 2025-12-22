import { useState, useEffect } from "react"
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import axios, { Image_base_uri } from '../../../API/axios'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'

let currency = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
]


const EditHotelModal = ({ showEdit, handleEditModal, hotels, id }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID } = getUserData

    console.log('hotel11', hotels)
    const hotelData = hotels?.filter(hotel => hotel.propertyID === id)
    console.log('hotelData', hotelData)

    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [countryId, setCountryId] = useState('')
    const [countryCode, setCountryCode] = useState(hotelData[0]?.countryCode)
    const [stateId, setStateId] = useState(hotelData[0]?.stateID)
    const [cityId, setCityId] = useState(hotelData[0]?.cityID)


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
                    return { value: c.countryID, label: c.countryName, ...c }
                })
                setCountryList(options)
                let id = options.filter(c => c.countryCode === countryCode)
                setCountryId(id[0]?.CountryID)
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
                    return { value: s.stateID, label: s.stateName, ...s }
                })
                setStateList(options)
            }
        } catch (error) {
            console.log("State List Error", error)
        }
    }

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
                    return { value: ci.cityID, label: ci.cityName, ...ci }
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
    }, [countryId, stateId, cityId])

    const [editHotelName, setEditHotelName] = useState(hotelData[0]?.hotelName)
    const [editAddress, setEditAddress] = useState(hotelData[0]?.addressLine)
    const [editNoOfFloor, setEditNoOfFloor] = useState(hotelData[0]?.floorCount)
    const [editCountry, setEditCountry] = useState(hotelData[0]?.countryName)
    const [editState, setEditState] = useState(hotelData[0]?.stateName)
    const [editCity, setEditCity] = useState(hotelData[0]?.cityName)
    const [editContact, setEditContact] = useState(hotelData[0]?.phoneNumber)
    const [editEmail, setEditEmail] = useState(hotelData[0]?.email)
    const [editBaseCurrency, setEditBaseCurrency] = useState(hotelData[0]?.currencyCode)
    // const [editAcc_startDate, setEditAcc_startDate] = useState(hotelData[0]?.acc_startDate)
    const [editAcc_startDate, setEditAcc_startDate] = useState(hotelData[0]?.createdDate)
    // const [editAcc_endDate, setEditAcc_endDate] = useState(hotelData[0]?.acc_endDate)
    const [editAcc_endDate, setEditAcc_endDate] = useState(hotelData[0]?.updatedDate)
    const [editGst, setEditGst] = useState(hotelData[0]?.gstNumber)
    const [editBankName, setEditBankName] = useState(hotelData[0]?.bankName)
    const [editAccountNumber, setEditAccountNumber] = useState(hotelData[0]?.accountNumber)
    const [editBranch, setEditBranch] = useState(hotelData[0]?.branch)
    const [editIfsc, setEditIfsc] = useState(hotelData[0]?.ifsc)
    const [editWebsite, setEditWebsite] = useState(hotelData[0]?.webSIte)
    const [editLogo, setEditLogo] = useState()
    const [editLogoName] = useState(hotelData[0]?.logoFile)
    const [editPincode, setEditPincode] = useState(hotelData[0]?.postalCode)
    const [editsurname, setEditSurname] = useState(hotelData[0]?.surname)
    const [editpersonName, setEditPersonName] = useState(hotelData[0]?.contactPersonName)
    const [editlongitude, setEditLongitude] = useState(hotelData[0]?.longitude)
    const [editlatitude, setEditLatitude] = useState(hotelData[0]?.latitude)
    const [editlicenseNumber, setEditLicenseNumber] = useState(hotelData[0]?.propertyLicenseNumber)
    const [editpropertydescription, setEditPropertydescription] = useState(hotelData[0]?.propertyDesc)

    const [editDisplay, setEditDisplay] = useState(false)
    console.log('editLogo', editLogo);
    const editHandleSubmit = async () => {
        const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/;
        const lonRegex = /^-?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/;
        const phoneregex = /^\+\d{1,3}\d{9,10}$/;
        setEditDisplay(true)
        let uploadedImage
        if (editLogo !== undefined) {
            let imageformData = new FormData()
            imageformData.append('File', editLogo)
            imageformData.append('CompanyID', CompanyID)
            console.log('imageformData', imageformData);
            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    url: "/api/property/hotel/uploadlogo",
                    data: imageformData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        LoginID,
                        Token
                    }
                })
                console.log('res', res);
                if (res.data.FileName) {
                    // setNewPoslogo(res.data.FileName)
                    // handleRefresh()
                    // setUploadImgStatus(true)
                    uploadedImage = res.data.FileName
                }
            } catch (error) {
                console.log('error', error)
                // setUploadImgStatus(false)
                return 0
            }
        }

        if (editHotelName && editAddress && editNoOfFloor && editCountry && editPincode && editlatitude && editlongitude && editpersonName && editState && editCity && editEmail && editBaseCurrency && editGst && editBankName && editAccountNumber && editBranch && editIfsc !== '') {
            if (latRegex.test(editlatitude) && editlatitude >= -90 && editlatitude <= 90 && lonRegex.test(editlongitude) && editlongitude >= -180 && editlongitude <= 180) {
                if (phoneregex.test(editContact)) {
                    const long = Number(editlongitude)
                    const lat = Number(editlatitude)
                    console.log(long, lat);
                    hotels?.map(hotel => {
                        console.log('hotel', hotel);
                        if (hotel.propertyID === id) {
                            hotel.hotelName = editHotelName
                            hotel.addressLine = editAddress
                            hotel.floorCount = editNoOfFloor
                            hotel.countryName = editCountry
                            hotel.stateName = editState
                            hotel.cityName = editCity
                            hotel.phoneNumber = editContact
                            hotel.email = editEmail
                            hotel.currencyCode = editBaseCurrency
                            // hotel.acc_startDate = editAcc_startDate
                            // hotel.acc_endDate = editAcc_endDate
                            hotel.createdDate = editAcc_startDate
                            hotel.updatedDate = editAcc_endDate
                            hotel.gstNumber = editGst
                            hotel.bankName = editBankName
                            hotel.accountNumber = editAccountNumber
                            hotel.branch = editBranch
                            hotel.IFSC = editIfsc
                            hotel.webSIte = editWebsite
                            hotel.logoFile = uploadedImage
                            hotel.postalCode = editPincode
                            hotel.latitude = lat.toFixed(10)
                            hotel.longitude = long.toFixed(10)
                            hotel.propertyDesc = editpropertydescription
                            hotel.contactPersonName = editpersonName
                            hotel.propertyLicenseNumber = editlicenseNumber
                            hotel.surname = editsurname
                        }
                    })


                    handleEditModal()
                    const body = {

                        //"CompanyID" : "COM001"
                        "LoginID": LoginID,
                        "Token": Token,
                        "HotelName": editHotelName
                        , "HotelType": "Hotel"
                        , "HotelTypeCode": "1"
                        , "PropertyDesc": editpropertydescription
                        , "FloorCount": editNoOfFloor
                        , "AddressLine": editAddress
                        , "CityID": cityId
                        , "CityName": editCity
                        , "CountryCode": "IN"
                        , "CountryName": editCountry
                        , "PostalCode": editPincode
                        , "Longitude": editlongitude
                        , "Latitude": editlatitude
                        , "TimeZone": "Asia/Kolkata"
                        , "LanguageCode": "en"
                        , "CurrencyCode": editBaseCurrency
                        , "PropertyLicenseNumber": editlicenseNumber
                        , "LogoFile": uploadedImage === undefined ? editLogoName : uploadedImage
                        , "WebSIte": editWebsite
                        , "BankName": editBankName
                        , "AccountNumber": editAccountNumber
                        , "Branch": editBranch
                        , "IFSC": editIfsc
                        , "GSTNumber": editGst
                        , "ContactPersonName": editpersonName
                        , "Surname": editsurname
                        , "PhoneNumber": editContact
                        , "Email": editEmail
                        //,"Status" : "Status"
                        , "StateName": editState
                        , "StateID": stateId
                    }
                    console.log('body', body)

                    axios.post(`/property/hotel/update?PropertyID=${hotelData[0]?.propertyID}`, body).then(res => {

                        if (res.data[0][0].status == "Success") {
                            toast.success(res.data[0][0].message, { position: "top-right" })
                        }

                    }).catch(e => {
                        console.log('error', error)
                        handleEditModal()
                        toast.error(e.response.data.message, { position: "top-right" })
                    })
                } else {
                    toast.error("please enter correct Phone Number with country code!", { position: "top-center" })
                }
            } else {
                toast.error("please enter correct Longitude and Latitude value!", { position: "top-center" })
            }
        } else {
            toast.error("please enter required fields!", { position: "top-center" })
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
        setEditDisplay(!editDisplay)
    }

    return (
        <>
            <Modal
                isOpen={showEdit}
                toggle={handleEditModal}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                    <span className=' mb-1'>Edit Hotel</span>
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5' >
                    <>
                        <Form>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='hotel'><span className='text-danger'>*</span>Hotel Name</Label>
                                    <Input
                                        type='text'
                                        name='hotel'
                                        id='hotel'
                                        value={editHotelName}
                                        onChange={e => setEditHotelName(e.target.value)}
                                        invalid={editDisplay && editHotelName === ''}
                                    />
                                    {editDisplay && !editHotelName ? <span className='error_msg_lbl'>Enter Hotel Name </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='address'><span className='text-danger'>*</span>Address </Label>
                                    <Input
                                        type='text'
                                        name='address'
                                        id='address'
                                        value={editAddress}
                                        onChange={e => setEditAddress(e.target.value)}
                                        invalid={editDisplay && editAddress === ''}

                                    />
                                    {editDisplay && !editAddress ? <span className='error_msg_lbl'>Enter Address </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='floor'><span className='text-danger'>*</span>No Of Floor </Label>
                                    <Input
                                        type='text'
                                        name='floor'
                                        id='floor'
                                        value={editNoOfFloor}
                                        onChange={e => setEditNoOfFloor(e.target.value)}
                                        invalid={editDisplay && editNoOfFloor === ''}
                                    />
                                    {editDisplay && !editNoOfFloor ? <span className='error_msg_lbl'>Enter No Of Floor </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='countries'><span className='text-danger'>*</span>Country</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={countryList.filter(c => c.countryName === editCountry)}
                                        options={countryList}
                                        isClearable={false}
                                        onChange={e => {
                                            setEditCountry(e.CountryName)
                                            setCountryId(e.value)
                                        }}
                                        invalid={editDisplay && editCountry === ''}
                                    />
                                    {editDisplay && !editCountry ? <span className='error_msg_lbl'>Enter Country </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='states'><span className='text-danger'>*</span>State</Label>
                                    {console.log('stateList', stateList, editState)}
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={stateList}
                                        value={stateList.filter(c => c.stateName === editState)}
                                        isClearable={false}
                                        onChange={e => {
                                            setEditState(e.label)
                                            setStateId(e.value)
                                        }}
                                        invalid={editDisplay && editState === ''}
                                    />
                                    {editDisplay && !editState ? <span className='error_msg_lbl'>Enter State </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='cities'><span className='text-danger'>*</span>City</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={cityList.filter(c => c.value === cityId)}
                                        options={cityList}
                                        isClearable={false}
                                        onChange={e => {
                                            setEditCity(e.label)
                                            setCityId(e.value)
                                        }}
                                        invalid={editDisplay && editCity === ''}
                                    />
                                    {editDisplay && !editCity ? <span className='error_msg_lbl'>Enter City </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='contact'><span className='text-danger'>*</span>Phone Number <span>(Please add phone number with country code. Format:+911234567890)</span></Label>
                                    <Input
                                        type='text'
                                        name='contact'
                                        id='contact'
                                        value={editContact}
                                        onChange={e => setEditContact(e.target.value)}
                                        invalid={editDisplay && editContact === ''}
                                    />
                                    {editDisplay && !editContact && <span className='text-danger'>Contact is required</span>}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='email'>Email<span className='text-danger'>*</span></Label>
                                    <Input
                                        type='email'
                                        name='email'
                                        id='email'
                                        value={editEmail}
                                        onChange={e => setEditEmail(e.target.value)}
                                        invalid={editDisplay && editEmail === ''}
                                    />
                                    {editDisplay && !editEmail && <span className='text-danger'>Email is required</span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='baseCountry'><span className='text-danger'>*</span>Base Currency</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={currency.filter(c => c.value === editBaseCurrency)}
                                        options={currency}
                                        isClearable={false}
                                        onChange={e => setEditBaseCurrency(e.value)}
                                        invalid={editDisplay ? editBaseCurrency === '' : false}
                                    />
                                    {editDisplay === true && !editBaseCurrency ? <span className='error_msg_lbl'>Enter Base Currency </span> : <></>}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='email'>Pincode<span className='text-danger'>*</span></Label>
                                    <Input
                                        type='email'
                                        name='email'
                                        id='email'
                                        value={editPincode}
                                        onChange={e => setEditPincode(e.target.value)}
                                        invalid={editDisplay && editPincode === ''}
                                    />
                                    {editDisplay && !editPincode && <span className='text-danger'>Pincode is required</span>}
                                </Col>
                                {/* <Col lg='6' className='mb-1'>
                    <Label className='form-label' for='account'>Accounting Period</Label>
                    <Row>
                      <Col lg='6'>
                        <Row>
                          <Col lg='2'>
                            <Label className='form-label' for='start'>Start</Label>
                          </Col>
                          <Col lg='10'>
                            <Flatpickr
                              id='start_date'
                              className='form-control ms-lg-1'
                              placeholder='Select Date'
                              // options={{
                              //   altInput: true,
                              //   // altFormat: 'F, j, Y',
                              //   dateFormat: 'd-m-y'
                              // }}
                              options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y'
                              }}
                              value={editAcc_startDate}
                              onChange={date => setEditAcc_startDate(date[0])}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg='6 mb-1'>
                        <Row>
                          <Col lg='2'>
                            <Label className='form-label' for='end'>End</Label>
                          </Col>
                          <Col lg='10'>
                            <Flatpickr
                              id='start_date'
                              className='form-control ms-lg-1'
                              placeholder='Select Date'
                              options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y'
                              }}
                              value={editAcc_endDate}
                              onChange={date => setEditAcc_endDate(date[0])}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col> */}
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='gst'>GST Number</Label>
                                    <Input
                                        type='text'
                                        name='gst'
                                        id='gst'
                                        value={editGst}
                                        onChange={e => setEditGst(e.target.value)}
                                        invalid={editDisplay && editGst === ''}
                                    />
                                    {editDisplay && !editGst && <span className='text-danger'>GST is required</span>}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='bankName'><span className='text-danger'>*</span>Bank Name</Label>
                                    <Input
                                        type='text'
                                        name='bankName'
                                        id='bankName'
                                        value={editBankName}
                                        onChange={e => setEditBankName(e.target.value)}
                                        invalid={editDisplay && editBankName === ''} />
                                    {editDisplay && !editBankName ? <span className='error_msg_lbl'>Enter Bank Name </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='accountNo'><span className='text-danger'>*</span>Account No</Label>
                                    <Input
                                        type='text'
                                        name='accountNo'
                                        id='accountNo'
                                        value={editAccountNumber}
                                        onChange={e => setEditAccountNumber(e.target.value)}
                                        invalid={editDisplay && editAccountNumber === ''} />
                                    {editDisplay && !editAccountNumber ? <span className='error_msg_lbl'>Enter Account Number </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='branch'><span className='text-danger'>*</span>Branch</Label>
                                    <Input
                                        type='text'
                                        name='branch'
                                        id='branch'
                                        value={editBranch}
                                        onChange={e => setEditBranch(e.target.value)}
                                        invalid={editDisplay && editBranch === ''} />
                                    {editDisplay && !editBranch ? <span className='error_msg_lbl'>Enter Branch </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='ifsc'><span className='text-danger'>*</span>IFSC</Label>
                                    <Input
                                        type='text'
                                        name='ifsc'
                                        id='ifsc'
                                        value={editIfsc}
                                        onChange={e => setEditIfsc(e.target.value)}
                                        invalid={editDisplay && editIfsc === ''} />
                                    {editDisplay && !editIfsc ? <span className='error_msg_lbl'>Enter IFSC </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='website'>Web Site</Label>
                                    <Input
                                        type='text'
                                        name='website'
                                        id='website'
                                        value={editWebsite}
                                        onChange={e => setEditWebsite(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='personName'><span className='text-danger'>*</span>Contact PersonName</Label>
                                    <Input
                                        type='text'
                                        name='personName'
                                        id='personName'
                                        value={editpersonName}
                                        onChange={e => setEditPersonName(e.target.value)}
                                        invalid={editDisplay && editpersonName === ''} />
                                    {editDisplay && !editpersonName ? <span className='error_msg_lbl'>Enter Contact PersonName </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='surname'>Surname</Label>
                                    <Input
                                        type='text'
                                        name='surname'
                                        id='surname'
                                        value={editsurname}
                                        onChange={e => setEditSurname(e.target.value)}
                                    />
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='longitude'><span className='text-danger'>*</span>Longitude <span >(Please add exact value)</span></Label>
                                    <Input
                                        type='text'
                                        name='longitude'
                                        id='longitude'
                                        value={editlongitude}
                                        onChange={e => setEditLongitude(e.target.value)}
                                        invalid={editDisplay && editlongitude === ''} />
                                    {editDisplay && !editlongitude ? <span className='error_msg_lbl'>Enter Longitude </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='latitude'><span className='text-danger'>*</span>Latitude <span >(Please add exact value)</span></Label>
                                    <Input
                                        type='text'
                                        name='latitude'
                                        id='latitude'
                                        value={editlatitude}
                                        onChange={e => setEditLatitude(e.target.value)}
                                        invalid={editDisplay && editlatitude === ''} />
                                    {editDisplay && !editlatitude ? <span className='error_msg_lbl'>Enter Latitude </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='licenseNumber'>Property Licencse Number</Label>
                                    <Input
                                        type='text'
                                        name='licenseNumber'
                                        id='licenseNumber'
                                        value={editlicenseNumber}
                                        onChange={e => setEditLicenseNumber(e.target.value)}
                                    />
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='description'>Property Description</Label>
                                    <Input
                                        type='text'
                                        name='description'
                                        id='description'
                                        value={editpropertydescription}
                                        onChange={e => setEditPropertydescription(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='6'>
                                    <Label className='form-label me-2' for='logo' >Logo</Label>
                                    <Input
                                        type='file'
                                        name='logo'
                                        id='logo'
                                        onChange={e => {
                                            console.log(e.target.files[0]),
                                                setEditLogo(e.target.files[0])
                                        }}
                                    />
                                </Col>
                                <Col lg='6'>
                                    <Label className='form-label me-2' for='logo' >Logo Name</Label>
                                    <Input
                                        type='text'
                                        name='logo'
                                        id='logo'
                                        value={editLogoName}
                                        disabled
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md='12 text-lg-end text-md-center mt-1'>
                                    <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={handleEditModal}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                </ModalBody>
            </Modal>
            {
                showEdit ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default EditHotelModal