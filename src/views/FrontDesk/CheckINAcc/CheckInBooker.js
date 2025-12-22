import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeColors } from '@utils'
import { Col, Form, Input, Label, Row, Button, FormFeedback, Alert, Card, CardHeader, CardTitle, CardBody, CardImg, ListGroup, ListGroupItem } from 'reactstrap'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import axios from "axios"
import Axios from '../../../API/axios'
import { Image_base_uri } from '../../../API/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import RoomAssignGuestDetails from './RoomAssignGuestDetails'

const idProofOptions = [
    { value: "passport", label: "Passport" },
    { value: "aadharCard", label: "Aadhaar Card" },
    { value: "panCard", label: "Pan Card" },
    { value: "drivingLicense", label: "Driving License" },
]

const CheckInBooker = ({ bookingID, roomAllocationID, roomList, handleRoomAssigned, bookingDetail }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    console.log("GuesteUerDetails", bookingDetail[0]?.checkInDate)
    const { LoginID, Token } = getUserData

    //State to check if BookerDetails already present
    const [bookerDetailsAvail, setBookerDetailsAvail] = useState(false)

    //States to maintain BookerData 
    const [submitFlag, setSubmitFlag] = useState(false)

    const [checkInId, setCheckInId] = useState('')
    const [arrivalDT, setArrivalDT] = useState('')
    const [departDT, setDepartDT] = useState('')
    const [vehicleNo, setVehicleNo] = useState('')
    const [comingFrom, setComingFrom] = useState('')
    const [goingTo, setGoingTo] = useState('')
    const [checkInGuestID, setCheckInGuestID] = useState('')
    const [nameProof, setNameProof] = useState('')
    const [idProofType, setIdProofType] = useState('')
    const [idProofNumber, setIdProofNumber] = useState('')
    const [idProofImg, setIdProofImg] = useState(null)

    const [uploadedImg, setUploadedImg] = useState(null)
    const [uploadImgStatus, setUploadImgStatus] = useState(false)

    //function to check if bookerData available
    const getBookerCheckInDetail = async () => {
        const obj = {
            LoginID,
            Token,
            Seckey: "abc",
            BookingID: bookingID
        }
        try {
            const res = await Axios.post('/checkindetails', obj)
            console.log('resr', res)
            //Conditions to check if api respose is 'OK' and data is available,
            //if data is available then assign them to states and display them also disable them to input,
            //Otherwise make them available for input.
            if (res?.data[0].length > 0) {
                setBookerDetailsAvail(true)
                setCheckInId(res.data[0][0]?.checkInID)
                setArrivalDT(res.data[0][0]?.rrrivalDateAndTime)
                setDepartDT(res.data[0][0]?.expectedDateAndTime)
                setVehicleNo(res.data[0][0]?.eehicleNo)
                setComingFrom(res.data[0][0]?.comingFrom)
                setGoingTo(res.data[0][0]?.goingTo)
                setCheckInGuestID(res.data[0][0]?.checkInGuestID)
                setNameProof(res.data[0][0]?.nameAsPerIDProof)
                setIdProofType(res.data[0][0]?.idProofType)
                setIdProofNumber(res.data[0][0]?.idProofNumber)
                setIdProofImg(res.data[0][0]?.idProofScanCopyURL)
                setUploadImgStatus(true)
            } else {
                //maintain the state value as empty and make them available for input
                setBookerDetailsAvail(false)
                setUploadImgStatus(false)
            }
        } catch (error) {
            console.log(error);
            setBookerDetailsAvail(false)
        }
    }
    console.log("arrival and departure date====>", arrivalDT, departDT)

    useEffect(() => {
        getBookerCheckInDetail()
        return () => {
            setBookerDetailsAvail(false)
        }
    }, [])


    const handleUploadedImage = (e) => {
        setUploadedImg(e.target.files[0])
    }

    const handleBookerDetail = async (e) => {
        e.preventDefault()
        setSubmitFlag(true)
        if (!uploadedImg) {
            toast.error("Please select an ID proof image")
            return
        }
         let mainImage ;
        const imageformData = new FormData()
        console.log(uploadedImg);
        imageformData.append('file', uploadedImg)
        try {
            const res = await axios({
                method: "post",
                baseURL: `${Image_base_uri}`,
                url: "/api/booking/UploadImage",
                data: imageformData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            console.log('upload photo res', res);
            if (res?.status === 200) {
                setIdProofImg(res?.data?.imageName)
                // mainImage = res?.data?.imageName || ""
                // setIdProofImg(mainImage)
                setUploadImgStatus(true)
                console.log('uploadreturn', res?.data?.imageName);
                mainImage = res?.data?.imageName
            }
            // else {
            //     toast.error("Image upload failed")
            //     setUploadImgStatus(false)
            //     return
            // }
            
        } catch (error) {
            console.log('error', error)
            setUploadImgStatus(false)
            return 0
        }

        // console.log('arrivalDT', arrivalDT);
        // console.log('departDT', departDT);
        // console.log('vehicleNo', vehicleNo);
        // console.log('comingFrom', comingFrom);
        // console.log('goingTo', goingTo);
        // console.log('idProofType', idProofType);
        // console.log('nameProof', nameProof);
        // console.log('idProofNumber', idProofNumber);
        // console.log('mainImage', mainImage);
        //   if (!mainImage) {
        //     toast.error("Uploaded image name missing, try again")
        //     return
        // }
        const regexp = /^\S*$/
        if (!regexp.test(vehicleNo) || !regexp.test(idProofNumber)) {
            toast.error("Space is not allowed in Vehicle Number and Id proof number")
        } else {
            if (arrivalDT && departDT && comingFrom && goingTo && idProofType && nameProof && idProofNumber) {
                try {
                    const bookerDetailObj = {
                        LoginID,
                        Token,
                        Seckey: "abc",
                        Event: "insert",
                        ArrivalDateAndTime: moment(arrivalDT).format("YYYY-MM-DD HH:mm"),
                        ExpectedDateAndTime: moment(departDT).format("YYYY-MM-DD HH:mm"),
                        VehicleNo: vehicleNo,
                        ComingFrom: comingFrom,
                        GoingTo: goingTo,
                        IDProofType: idProofType,
                        NameAsPerIDProof: nameProof,
                        IDProofNumber: idProofNumber,
                        // IDProofScanCopyURL: uploadedImg,
                        IDProofScanCopyURL: mainImage,
                        BookingID: bookingID,
                        RoomAllocationID: roomAllocationID
                    }
                    console.log('bookerDetailObj', bookerDetailObj)
                    console.log('bookerDetailObj', JSON.stringify(bookerDetailObj))
                    const res = await Axios.post('/checkindetails', bookerDetailObj)
                    console.log('detail res', res);
                    if (res.status === 200) {
                        toast.success('Booker details Uploaded!')
                        setBookerDetailsAvail(true)
                        setSubmitFlag(false)

                       // notify RoomAssignGuestDetails to refresh dropdown for this RoomAllocationID
                       try {
                         window.dispatchEvent(new CustomEvent('roomAssignDropdownRefresh', {
                           detail: { roomAllocationID }
                         }))
                       } catch (e) {
                         console.warn('dispatch event failed', e)
                       }
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Something went wrong, Try again!")
                    setBookerDetailsAvail(false)
                }
            } else {
                console.log('Condition error')
                toast.error("Something went wrong, Try again!")
            }
        }

    }

    return (
        <>
            {
                bookerDetailsAvail ? (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>{nameProof}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row className='d-flex flex-row justify-content-center align-items-center'>
                                    <Col>
                                        <ListGroup>
                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                <span>Arrival - </span>
                                                <span>{moment(arrivalDT).format('llll')}</span>
                                            </ListGroupItem>
                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                <span>Expected Departure - </span>
                                                <span>{moment(departDT).format('llll')}</span>
                                            </ListGroupItem>
                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                <span>Coming From - </span>
                                                <span>{comingFrom}</span>
                                            </ListGroupItem>
                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                <span>Going To - </span>
                                                <span>{goingTo}</span>
                                            </ListGroupItem>
                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                <span>{idProofType.toUpperCase()} - </span>
                                                <span>{idProofNumber}</span>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </Col>
                                    <Col className='text-center'>
                                        <img
                                            className='m-1'
                                            src={idProofImg ? `${Image_base_uri}/uploads/documents/${idProofImg}` : `${Image_base_uri}/uploads/dummy.jpg`}
                                            alt='card-top'
                                            width={300}
                                            height={200}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </>
                ) : (
                    <>
                        <Row>
                            <Col>
                                <Alert color='danger'>
                                    <p className='alert-heading text-center'>
                                        <b>Please Note</b> You would not be able to edit Check In data once created be careful while filling up this form.
                                    </p>
                                </Alert>
                            </Col>
                        </Row>
                        <Form onSubmit={e => handleBookerDetail(e)}>
                            <Row>

                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Arrival Date & Time<span className='text-danger'>*</span></Label>
                                    <Flatpickr
                                        data-enable-time
                                        className='form-control'
                                        id='date-time-picker'
                                        //options={bookerDetailsAvail && { clickOpens: true, enableTime: true }}
                                        options={{
                                            clickOpens: true,
                                            enableTime: true,
                                            minDate: moment(bookingDetail[0]?.checkInDate).format("YYYY-MM-DDTHH:mm")
                                        }}
                                        value={moment(arrivalDT).toISOString()}
                                        onChange={date => setArrivalDT(moment(date[0]))}
                                    />
                                    {submitFlag && arrivalDT === '' && <p className='text-danger'>Arrival Date & Time is required</p>}
                                </Col>

                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Expected Departure Date & Time<span className='text-danger'>*</span></Label>
                                    <Flatpickr
                                        data-enable-time
                                        id='date-time-picker'
                                        className='form-control'
                                        options={bookerDetailsAvail ? { clickOpens: true, enableTime: true } :
                                            { minDate: new Date(arrivalDT).fp_incr(0) }}
                                        value={moment(departDT).toISOString()}
                                        onChange={date => setDepartDT(moment(date[0]))}
                                    />
                                    {submitFlag && departDT === '' && <p className='text-danger'>Expected Departure Date & Time is required</p>}
                                </Col>

                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Vehicle No.</Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='text'
                                        name='Vehicle No'
                                        value={vehicleNo}
                                        onChange={e => setVehicleNo(e.target.value.replace(/\s/g, ''))}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Coming From<span className='text-danger'>*</span></Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='text'
                                        name='Coming From'
                                        invalid={submitFlag && comingFrom === ''}
                                        value={comingFrom}
                                        onChange={e => setComingFrom(e.target.value)}
                                    />
                                    {submitFlag && comingFrom === '' && <FormFeedback>Destination is required</FormFeedback>}
                                </Col>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Going To<span className='text-danger'>*</span></Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='text'
                                        name='Going to'
                                        invalid={submitFlag && goingTo === ''}
                                        value={goingTo}
                                        onChange={e => setGoingTo(e.target.value)}
                                    />
                                    {submitFlag && goingTo === '' && <FormFeedback>Destination is required</FormFeedback>}
                                </Col>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Id Proof Type<span className='text-danger'>*</span></Label>
                                    <Select
                                        isDisabled={bookerDetailsAvail}
                                        placeholder={idProofType ? '' : 'Select Id Proof Type'}
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={idProofOptions}
                                        value={idProofOptions.filter(c => c.value === idProofType)}
                                        onChange={c => {
                                            setIdProofType(c.value)
                                        }}
                                    />
                                    {submitFlag && idProofType === '' && <p className='text-danger'>Select an Id Proof Type</p>}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Name as per Id Proof<span className='text-danger'>*</span></Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='text'
                                        name='Name as per Id proof'
                                        invalid={submitFlag && nameProof === ''}
                                        value={nameProof}
                                        onChange={e => setNameProof(e.target.value)}
                                    />
                                    {submitFlag && nameProof === '' && <FormFeedback>Name is required</FormFeedback>}
                                </Col>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Id Proof Number<span className='text-danger'>*</span></Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='text'
                                        name='Id proof number'
                                        invalid={submitFlag && idProofNumber === ''}
                                        value={idProofNumber}
                                        onChange={e => setIdProofNumber(e.target.value.replace(/\s/g, ''))}
                                    />
                                    {submitFlag && idProofNumber === '' && <FormFeedback>Number is required</FormFeedback>}
                                </Col>
                                <Col lg='4' md='12' sm='12 mb-1'>
                                    <Label>Id Proof Scan Copy<span className='text-danger'>*</span></Label>
                                    <Input
                                        disabled={bookerDetailsAvail}
                                        type='file'
                                        name='IdProofCopy'
                                        accept='image/jpg, image/jpeg, image/webp, image/png'
                                        invalid={submitFlag && !uploadedImg}
                                        onChange={e => {
                                            console.log(e.target.files)
                                            handleUploadedImage(e)
                                        }}
                                    />
                                    {submitFlag && uploadedImg === '' && <FormFeedback>Image is required</FormFeedback>}
                                </Col>
                            </Row>
                            <Row>
                                <Col className='my-1 d-flex flex-row flex-wrap justify-content-center align-items-center'>
                                    <Button
                                        type='submit'
                                        color='primary'
                                        className='m-1'
                                        disabled={bookerDetailsAvail}
                                    >
                                        Submit
                                    </Button>
                                    {/* <Button color='primary' className='m-1'>Assign Room</Button> */}
                                </Col>
                            </Row>
                        </Form>
                    </>
                )
            }
            <RoomAssignGuestDetails roomList={roomList} bookerDetailsAvail={bookerDetailsAvail} LoginID={LoginID} Token={Token} handleRoomAssigned={handleRoomAssigned} />
        </>
    )
}

export default CheckInBooker