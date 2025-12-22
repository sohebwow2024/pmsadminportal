import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios, { Image_base_uri } from '../../../API/axios'
const UpdatePhotoModal = ({ open, handleUpdatePhoto, photoId, roomId, handleFlag, id, getPhotosbyRoomID }) => {
    console.log(photoId, open);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData
    const [roomNo, setRoomNo] = useState('')
    const [labels, setLabels] = useState('')
    const [photo, setPhoto] = useState('')
    const [updatedPhoto, setUpdatedPhoto] = useState('')
    const [filename, setFilename] = useState('')
    const getPhotoDetail = async () => {
        try {
            const res = await axios.get(`/property/photo/${photoId}?CompanyID=${CompanyID}`, {
                headers: {
                    "Content-type": "multipart/form-data",
                    'Token': Token,
                    'LoginID': LoginID
                },
            })
            let data = res?.data[0]
            // console.log('res', res?.data[0])
            setRoomNo(data[0]?.roomNo)
            setLabels(data[0]?.displayName)
            setPhoto(data[0]?.fileURL)
        } catch (error) {
            console.log('error', error)
            toast.error(error.response, { position: 'top-right' })
        }
    }

    const handleSubmit = async () => {

        let propertyPhoto

        let formData = new FormData();
        formData.append("CompanyID", CompanyID);
        formData.append("PropertyID", PropertyID);
        formData.append("HotelName", HotelName);
        formData.append("RoomID", roomId);
        formData.append("File", filename);
        if (filename !== '') {
            try {
                const res = await axios.post('/property/photo/upload', formData, {
                    headers: {
                        "Content-type": "multipart/form-data",
                        'Token': Token,
                        'LoginID': LoginID
                    },
                })
                if (res?.data.fileName !== '') {
                    propertyPhoto = res?.data.fileName
                }
            } catch (error) {
                console.log('error', error)
                toast.error(error.response, { position: 'top-right' })
            }
        }

        console.log(propertyPhoto);
        try {
            let obj = {
                CompanyID,
                PropertyID,
                Token,
                LoginID,
                Seckey:"abc",
                RoomID: roomId,
                RoomTypeID: "",
                RoomNo: roomNo,
                DisplayName: labels,
                FileName: propertyPhoto === '' ? photo : propertyPhoto,
                Tags: labels
            }
            console.log('objPhoto', obj);
            const res = await axios.post(`/property/photo/update?PhotoID=${photoId}`, obj, {
                headers: {
                    'Token': Token,
                    'LoginID': LoginID
                },
            })
            // console.log('res', res)
            if (res.data[0][0].status === "Success") {
                toast.success('Property Photo Updated!')
                handleFlag()
                getPhotosbyRoomID(id)
                handleUpdatePhoto()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
        // }
    }

    useEffect(() => {
        if (photoId !== '') {
            getPhotoDetail()
        }
    }, [open])
    const setPreview = e => {
        // console.log(e.target.files[0].name);
        setFilename(e.target.files[0])
        setUpdatedPhoto(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <>
            <Modal
                isOpen={open}
                //toggle={() => {
                //    handlePhotoUpload()
                //    reset()
                //}}
                className='modal-dialog-centered modal-lg'
            //backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={() => {
                    handleUpdatePhoto()
                }}>
                    <span className=' mb-1'>Add Photo</span>
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-1'>
                    <>
                        <Form>
                            <Row>
                                <Col lg='6'>
                                    {/* <Row>
                                        <Col>
                                            <Label className='mt-1' for='RoomType'>
                                                <span className='text-danger'>*</span>Room Type
                                            </Label>
                                            <Input
                                                type='text'
                                                name='RoomType'
                                                id='RoomType'
                                                readOnly
                                            />
                                        </Col>

                                    </Row> */}
                                    {roomId ? (
                                        <Row>
                                            <Col>

                                                <Label for='RoomNumber' className='mt-1'>
                                                    <span className='text-danger'>*</span>Room No
                                                </Label>


                                                <Input
                                                    type='text'
                                                    name='RoomNumber'
                                                    id='RoomNumber'
                                                    value={roomNo}
                                                    onChange={e => setRoomNo(e.target.value)}
                                                // invalid={display && roomNumber.trim() === ''}
                                                />
                                                {/* {display === true && roomNumber.trim() === '' ? <span className='error_msg_lbl'>Room number is required </span> : <></>} */}
                                            </Col>

                                        </Row>
                                    ) : null
                                    }
                                    <Row>
                                        <Col>
                                            <Label for='Photo' className='mt-1'>
                                                <span className='text-danger'>*</span>Image File
                                            </Label>

                                            <Input
                                                type='file'
                                                name='Photo'
                                                id='Photo'
                                                accept='image/*'
                                                onChange={e => setPreview(e)}
                                            // invalid={display && photo.trim() === ''}
                                            />
                                            {/* {display === true && !photo.trim() ? <span className='error_msg_lbl'>Photo is required </span> : <></>} */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Label for='Labels' className='mt-1 w-100'>
                                                <span className='text-danger'>*</span>Labels <span className='float-end'>(add new label separated by comma)</span>
                                            </Label>
                                            <Input
                                                type='text'
                                                name='Labels'
                                                id='Labels'
                                                value={labels}
                                                onChange={e => setLabels(e.target.value)}
                                                // invalid={display && labels.trim() === ''}
                                                className='mb-25'
                                            />
                                            {/* {
                                                labelsArray?.map((label, i) => {
                                                    return (
                                                        labels.includes(label.trim()) ? (
                                                            <Badge className={` me-50 my-25 cursor-pointer`} onClick={() => removeLabel(label.trim())} key={`label_${i}`} color='light-secondary' pill>
                                                                <XCircle size={12} className='align-middle me-25 text-danger' />
                                                                {label.trim()}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className={`px-1 me-50 my-25 cursor-pointer`} onClick={() => addLabel(label.trim())} key={`label_${i}`} color={labelColor[i < 7 ? i : i % 7]} pill>
                                                                {label.trim()}
                                                            </Badge>
                                                        )
                                                    )
                                                })
                                            } */}
                                            <br />
                                            {/* {display === true && !labels.trim() ? <span className='error_msg_lbl'>At least one label is required </span> : <></>} */}

                                        </Col>

                                    </Row>
                                </Col>
                                <Col lg='6 align-self-center '>
                                    <Col className='bg-light d-flex text-center' style={{ minHeight: '300px' }}>
                                        <img width='100%' className='align-self-center' src={`${Image_base_uri}/${photo}`} style={{ objectFit: 'cover' }} alt='Photo Preview' />
                                    </Col>

                                </Col>
                                {updatedPhoto && <Col lg='6 align-self-center '>
                                    <Label>New Photo</Label>
                                    <Col className='bg-light d-flex text-center' style={{ minHeight: '300px' }}>
                                        <img width='100%' className='align-self-center' src={updatedPhoto} style={{ objectFit: 'cover' }} alt='Photo Preview' />
                                    </Col>

                                </Col>}


                            </Row>
                            <Row>
                                <Col md='12 my-2 d-flex justify-content-center'>
                                    <Button className='me-2' color='primary' onClick={handleSubmit}>Upload Photo</Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={
                                            () => {
                                                handleUpdatePhoto()
                                            }
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                </ModalBody>
            </Modal>
        </>
    )
}

export default UpdatePhotoModal