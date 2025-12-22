import React, { useState, useEffect } from 'react'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from 'axios'
import Axios from '../../../API/axios'
import { Image_base_uri } from '../../../API/axios'
import Select from 'react-select'
import toast from 'react-hot-toast'

const idProofOptions = [
    { value: "passport", label: "Passport" },
    { value: "aadharCard", label: "Aadhaar Card" },
    { value: "panCard", label: "Pan Card" },
    { value: "drivingLicense", label: "Driving License" },
]

const AddRoomGuestDetailsModal = ({ openModal, handleOpenModal, LoginID, Token, data }) => {

    const [existGuestDetails, setExistGuestDetails] = useState([])
    const [noOfGuestToAdd, setNoOfGuestToAdd] = useState(data?.adult)
    const [upload, setUpload] = useState(false)


    console.log("data?.roomAllocationID", existGuestDetails);
    const getExistingGuestDetails = async () => {
        try {
            const res = await Axios.get('/booking/CheckInGuest/GetByID', {
                params: {
                    LoginID,
                    Token,
                    RoomAllocationID: data?.roomAllocationID !== '' ? data?.roomAllocationID : 0
                }
            })
            console.log('existingData', res)
            if (res?.data[0]?.length > 0) {
                let existingNoOfGuestDetails = res?.data[0]?.length
                setNoOfGuestToAdd(data.adult - existingNoOfGuestDetails)
                setExistGuestDetails(res?.data[0])
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getExistingGuestDetails()
    }, [upload])


    const GuestDetailForm = ({ key, guestNo }) => {

        const [idType, setIdType] = useState('')
        const [idName, setIdName] = useState('')
        const [idNumber, setIdNumber] = useState('')
        const [idImage, setIdImage] = useState('')

        const uploadGuestData = async (e) => {
            e.preventDefault()
            setUpload(true)
            try {
                console.log('idType', idType);
                console.log('idName', idName);
                console.log('idNumber', idNumber);
                console.log('idImage', idImage);
                if (idType && idName && idNumber !== '') {
                    let guestFormData = new FormData()
                    guestFormData.append('LoginID', LoginID)
                    guestFormData.append('Token', Token)
                    guestFormData.append('IDProofType', idType)
                    guestFormData.append('NameAsPerIDProof', idName)
                    guestFormData.append('IDProofNumber', idNumber)
                    // guestFormData.append('IDProofScanCopyURL', idImage)
                    guestFormData.append('BookingID', data.bookingID)
                    guestFormData.append('RoomAllocationID', data.roomAllocationID)
                    guestFormData.append('file', idImage)

                    const res = await axios({
                        method: "post",
                        baseURL: `${Image_base_uri}`,
                        // url: "/api/booking/CheckInGuestSave",
                        url: "/api/booking/checkinguestsave/v2",
                        data: guestFormData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })

                    console.log('res', res);

                    if (res?.data[0][0].status === "Success") {
                        setUpload(false)
                        toast.success('Guest Details Uploaded')
                    } else {
                        toast.error('Something went wrong, Try again!')
                    }
                }
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong, Try again!')
            }

        }

        return (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Guest {guestNo} - details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form key={key} id={key} onSubmit={uploadGuestData}>
                            <Row>
                                <Col lg='6' md='6' sm='12' className='mb-1'>
                                    <Label>Id Proof Type<span className='text-danger'>*</span></Label>
                                    <Select
                                        name={`proofType-${guestNo}`}
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={idProofOptions}
                                        value={idProofOptions.filter(c => c.value === idType)}
                                        onChange={c => {
                                            setIdType(c.value)
                                        }}
                                    />
                                </Col>
                                <Col lg='6' md='6' sm='12' className='mb-1'>
                                    <Label>Name as per Id Proof<span className='text-danger'>*</span></Label>
                                    <Input
                                        type='text'
                                        name={`Name as per Id proof-${guestNo}`}
                                        value={idName}
                                        invalid={upload && idName === ''}
                                        onChange={e => setIdName(e.target.value)}
                                    />
                                    {upload && idName === '' && <FormFeedback>Name is required!</FormFeedback>}
                                </Col>
                                <Col lg='6' md='6' sm='12' className='mb-1'>
                                    <Label>Id Proof Number<span className='text-danger'>*</span></Label>
                                    <Input
                                        type='text'
                                        name={`Id proof number-${guestNo}`}
                                        value={idNumber}
                                        invalid={upload && idNumber === ''}
                                        onChange={e => setIdNumber(e.target.value)}
                                    />
                                </Col>
                                {upload && idNumber === '' && <FormFeedback>Number is required!</FormFeedback>}
                                <Col lg='6' md='6' sm='12' className='mb-1 d-flex flex-row align-items-end justify-content-between'>
                                    <div>
                                        <Label>Id Proof Scan Copy<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='file'
                                            name={`Id proof-${guestNo}`}
                                            accept='image/jpg, image/jpeg, image/webp, image/png'
                                            invalid={upload && idImage === ''}
                                            onChange={e => {
                                                console.log(e.target.files[0])
                                                setIdImage(e.target.files[0])
                                            }}
                                        />
                                        {upload && idImage === '' && <FormFeedback>File is required!</FormFeedback>}
                                    </div>
                                    <div>
                                        <Button type='Submit' color='primary'>Upload</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </>
        )
    }

    return (
        <>
            <Modal
                isOpen={openModal}
                toggle={handleOpenModal}
                className='modal-dialog-centered modal-xl'
                backdrop
            >
                <ModalHeader toggle={handleOpenModal}>
                    Add/View Guest Details for Room No. - {data.roomNo}
                </ModalHeader>
                {console.log('noOfGuestToAdd', noOfGuestToAdd)}
                <ModalBody>
                    {
                        noOfGuestToAdd >= 0 && (
                            existGuestDetails.map((g, idx) => {
                                { console.log('ghs', g) }
                                return (
                                    <>
                                        <Card key={idx}>
                                            {/* <CardHeader>
                                                <CardTitle>{g.NameAsPerIDProof}</CardTitle>
                                            </CardHeader> */}
                                            <CardBody>
                                                <Row className='d-flex flex-row justify-content-center align-items-center'>
                                                    <Col>
                                                        <ListGroup>
                                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                                <span>Name - </span>
                                                                <span>{g.nameAsPerIDProof}</span>
                                                            </ListGroupItem>
                                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                                <span>{`Id Proof Type`.toUpperCase()} - </span>
                                                                <span>{g.idProofType}</span>
                                                            </ListGroupItem>
                                                            <ListGroupItem className='d-flex flex-row justify-content-between align-items-center'>
                                                                <span>Id Proof Number - </span>
                                                                <span>{g.idProofNumber}</span>
                                                            </ListGroupItem>
                                                        </ListGroup>
                                                    </Col>
                                                    <Col className='text-center'>
                                                        <img
                                                            className='m-1'
                                                            src={g.idProofScanCopyURL ? `${Image_base_uri}/uploads/documents/${g.idProofScanCopyURL}` : `${Image_base_uri}/uploads/documents/img_13152023011546.webp`}
                                                            alt='card-top'
                                                            width={100}
                                                            height={100}
                                                        />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </>
                                )
                            })
                        )
                    }
                    {
                        noOfGuestToAdd > 0 ? (
                            Array.from({ length: noOfGuestToAdd }).map((r, index) => <GuestDetailForm key={index} guestNo={index + 1} />)
                        ) : null
                    }
                </ModalBody>
            </Modal>
        </>
    )
}

export default AddRoomGuestDetailsModal