import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, Col, Form, Input, Badge, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
//import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Add, Trash, Star, XCircle } from 'react-feather'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
//import axios from '../../../API/axios'

const PhotoUploadModal = ({ open, setNewPhoto, isRoom, handlePhotoUpload, roomType, allLabels, photos, setPhotos, id, getPropertyPhoto, getPhotosbyRoomID, handleFlag }) => {
    console.log('id', id);
    const [labelsArray] = useState(allLabels?.split(','))
    const [filename, setFilename] = useState('')
    const [src, setSRC] = useState('')
    const [labels, setLabels] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData
    // console.log(PropertyID, CompanyID);
    const [photo, setPhoto] = useState('')
    const [display, setDisplay] = useState(false)
    const [displayLogo, setDisplayLogo] = useState('')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Token': Token,
            'LoginID': LoginID
        }
    }
    const reset = () => {
        setFilename('')
        setSRC('')
        setLabels('')
        setPhoto('')
        setRoomNumber('')
        setDisplayLogo('')
        setDisplay(false)
    }
    const setPreview = e => {
        // e.preventDefault()

        // var files = e.target.files
        // console.log('result:_', files)

        // const reader = new FileReader()
        // reader.readAsDataURL(files)
        // reader.onload = function () {
        //     setPhoto(reader.result)
        //     setSRC(URL.createObjectURL(files))
        //     console.log('files:__', "file://" + reader.result)
        // }

        setFilename(e.target.files[0])
        setDisplayLogo(URL.createObjectURL(e.target.files[0]))
        //console.log(FileList[0]?.File?.name, '< filename >', filename)


    }
    const handleSubmit = async () => {
        // console.log('roomid', id);
        setDisplay(true)
        setSRC(photo)
        const photoObject = {
            roomType,
            filename,
            // src,
            labels,
            roomNumber: roomNumber.trim() === "" ? "0" : roomNumber
        }
        console.log('photo > ', photoObject)
        const isEmpty = Object.values(photoObject).some(x => x === null || x === '')
        console.log('isEmpty > ', isEmpty)

        let propertyPhoto
        if (isEmpty === false) {
            // toast.success('photo uploading', { position: "top-center" })

            //setPhotos([...photos])//, photoObject])

            let formData = new FormData();
            formData.append("CompanyID", CompanyID);
            formData.append("PropertyID", PropertyID);
            formData.append("HotelName", HotelName);
            formData.append("RoomID", id);
            // formData.append("File", filename);
            formData.append("fileName", filename);
            try {
                const res = await axios.post('/property/photo/upload', formData, {
                    headers: {
                        "Content-type": "multipart/form-data",
                        'Token': Token,
                        'LoginID': LoginID
                    },
                })
                // console.log('res', res)
                if (res?.data.fileName !== '') {
                    // toast.success(res.data.FileName + " uploaded successfully", { position: 'top-right' })
                    propertyPhoto = res?.data.fileName
                }
            } catch (error) {
                console.log('error', error)
                toast.error(error.response, { position: 'top-right' })
            }
            // console.log('hit', propertyPhoto)

            // .then(res => {
            //     console.log(res);
            //     if (res !== null) {
            //         toast.success(res.data.FileName + " uploaded successfully", { position: 'top-right' })
            //         console.log('filename', res?.data.FileName);
            //         propertyPhoto = res.data.FileName
            //     }
            // }).catch(e => {
            //     console.log(e);
            //     toast.error(e.response, { position: 'top-right' })
            // })

            // console.log('set', propertyPhoto);
            try {
                let obj = {
                    LoginID,
                    Token,  
                    Seckey: 'abc',
                    CompanyID,
                    PropertyID,
                    RoomID: id,
                    RoomTypeID: "",
                    RoomNo: roomNumber,
                    DisplayName: labels,
                    FileName: propertyPhoto,
                    Tags: labels
                }
                // console.log('obj', obj);
                const res = await axios.post('/property/photo/detail', obj, {
                    headers: {
                        // "Content-type": "multipart/form-data",
                        'Token': Token,
                        'LoginID': LoginID
                    },
                })
                // const res = await axios.post(`/property/photo/detail`, obj, {
                //     headers: {
                //         Token,
                //         LoginID
                //     },
                // })
                // console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success('Property Photo Uploaded!')
                    handleFlag()
                    roomType !== 'Property' && getPhotosbyRoomID(id)
                    reset()
                    handlePhotoUpload()
                    if (id === '') {
                        getPropertyPhoto()
                    } else {
                        console.log('abc');
                        axios.get(`/property/photo/room?RoomID=${id}&PropertyID=${PropertyID}`, config)
                    }
                    photos
                }
            } catch (error) {
                console.log('error', error)
                toast.error('Something went wrong, Try again!')
            }
        } else {
            toast.error('Fill all Fields')
        }
    }
    const [labelColor] = useState([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'dark'
    ])



    const addLabel = (lbl) => {
        labels.trim() === '' ? setLabels(lbl.trim()) : setLabels(`${labels}, ${lbl.trim()}`)
    }
    const removeLabel = (lbl) => {
        // console.log('tag remove :', lbl)
        if (labels.includes(`, ${lbl.trim()}`)) {
            setLabels(labels.replace(`, ${lbl.trim()}`, ''))
        } else if (labels.includes(`${lbl.trim()}, `)) {
            setLabels(labels.replace(`${lbl.trim()}, `, ''))
        } else {
            setLabels(labels.replace(lbl.trim(), ''))
        }
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
                    handlePhotoUpload()
                    reset()
                }}>
                    <span className=' mb-1'>Add Photo</span>
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-1'>
                    <>
                        <Form>
                            <Row>
                                <Col lg='6'>
                                    <Row>
                                        <Col>

                                            <Label className='mt-1' for='RoomType'>
                                                <span className='text-danger'>*</span>Room Category
                                            </Label>


                                            <Input
                                                type='text'
                                                name='RoomType'
                                                id='RoomType'
                                                value={roomType}
                                                readOnly
                                            />
                                            {display === true && !roomType.trim() ? <span className='error_msg_lbl'>Room Category is required </span> : <></>}
                                        </Col>

                                    </Row>
                                    {isRoom ? (
                                        <Row>
                                            <Col>

                                                <Label for='RoomNumber' className='mt-1'>
                                                    <span className='text-danger'>*</span>Room No
                                                </Label>


                                                <Input
                                                    type='text'
                                                    name='RoomNumber'
                                                    id='RoomNumber'
                                                    value={roomNumber}
                                                    onChange={e => setRoomNumber(e.target.value)}
                                                    invalid={display && roomNumber.trim() === ''}
                                                />
                                                {display === true && roomNumber.trim() === '' ? <span className='error_msg_lbl'>Room number is required </span> : <></>}
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
                                                invalid={display && filename === ''}
                                            />
                                            {display === true && filename === '' ? <span className='error_msg_lbl'>Photo is required </span> : <></>}
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
                                                invalid={display && labels.trim() === ''}
                                                className='mb-25'
                                            />
                                            {
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
                                            }
                                            <br />
                                            {display === true && !labels.trim() ? <span className='error_msg_lbl'>At least one label is required </span> : <></>}

                                        </Col>

                                    </Row>
                                </Col>
                                <Col lg='6 align-self-center '>
                                    <Col className='bg-light d-flex text-center' style={{ minHeight: '300px' }}>
                                        <img src={displayLogo} width='100%' className='align-self-center' style={{ objectFit: 'cover' }} alt='Photo Preview' />
                                    </Col>

                                </Col>

                            </Row>
                            <Row>
                                <Col md='12 my-2 d-flex justify-content-center'>
                                    <Button className='me-2' color='primary' onClick={handleSubmit}>Upload Photo</Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={
                                            () => {
                                                handlePhotoUpload()
                                                reset()
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

export default PhotoUploadModal