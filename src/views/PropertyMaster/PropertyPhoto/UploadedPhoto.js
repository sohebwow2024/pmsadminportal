import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Form, Badge, UncontrolledDropdown, Input, DropdownToggle, Modal, ModalBody, ModalHeader, Row, DropdownMenu, DropdownItem, ModalFooter } from 'reactstrap'
import { Edit, Trash, MoreVertical, FileText } from 'react-feather'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios, { Image_base_uri } from '../../../API/axios'
import UpdatePhotoModal from './UpdatePhotoModal'

const UploadedPhoto = ({ photo, setPhoto, allLabels, photos, setPhotos, onClick, data, getPropertyPhoto, handleFlag, id, getPhotosbyRoomID, isRoom }) => {
    console.log("uploaded photo",photo);
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token, PropertyID } = getUserData
    // console.log(LoginID, Token);
    // console.log(PropertyID);
    const [labelColor] = useState([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'dark'
    ])

    //const [showEdit, setShowEdit] = useState(false)
    //const handleEditModal = () => setShowEdit(!showEdit)

    //    const [del, setDel] = useState(false)

    // const [labels, setLabels] = useState(photo.labels?.split(',')?.map(element => element.trim()))

    const [display, setDisplay] = useState(false)
    const [swich] = useState(`switchStatus_${data.id}`) // unique id for the switch button
    const [checked, setChecked] = useState(true) // checked is valid, on switch

    const [status, setStatus] = useState(false)
    //    const [loader, setLoader] = useState(false)

    const [fullTagList, setFullTagList] = useState(allLabels)

    const [del, setDel] = useState(false)
    const handleDel = () => setDel(!del)

    const [delPid, setDelPid] = useState('')

    const [refresh, setRefresh] = useState(false)
    const [photostatus, setPhotoStatus] = useState(data.status)
    // console.log(photostatus);
    const [propertyPhoto, setPropertyPhoto] = useState([])
    //  const userId = localStorage.getItem('user-id')

    useEffect(() => {
        /*axios.post(`/getdata/propertymaster/photos`, {
            LoginID: userId,
            Token: "123",
            Seckey: "abc",
            Event: "select"
        })
            .then(tagsResponse => {
                setFullTagList(tagsResponse?.data[0])
                if (fullTagList !== []) { setRefresh(true) }
            })*/
        setStatus(true)
        setRefresh(true)
        //setFfullTagList = ['Property', 'Hall', 'Kitchen']

    }, [refresh])


    const photoEdit = () => {
        console.log(photos)
        console.log(labels)
        console.log(display)
        console.log(status)
        console.log(swich)
        setPhotos(photos)
        setPhoto(photo)
        setLabels(labels)
        setFullTagList(fullTagList)
        try {
            /*const photoInsertBody = {
                LoginID: userId,
                Token: "123",
                Seckey: "abc",
                TagsID,
                Event: "insert",
                Photo? object?
            }
            axios.post(`/getdata/propertymaster/propertyphoto`, photoInsertBody)
                .then(() => {
                    photoList()
                })
                */
            //toast.success('Photo details Edited!', { position: "top-center" })

        } catch (error) {
            console.log("Photo Edit Error", error.message)
            toast.error('Photo Edit error!', { position: "top-center" })

        }

    }

    const handleActiveStatus = async (id) => {
        console.log(id);
        try {
            const res = await axios.post(`/property/photo/inactive?PhotoID=${id}`, null, {
                headers: {
                    Token,
                    LoginID,
                },
            })
            // let data = res?.data[0]
            console.log('res', res?.data[0])
            if (res.data[0][0].status == "Success") {
                setPhotoStatus('NotActive')
            }
        } catch (error) {
            console.log('error', error)
            toast.error(error.response, { position: 'top-right' })
        }
    }
    const handleInActiveStatus = async (id) => {
        console.log(id);
        try {
            const res = await axios.post(`/property/photo/activate?PhotoID=${id}`, null, {
                headers: {
                    Token,
                    LoginID,
                },
            })
            // let data = res?.data[0]
            console.log('res', res?.data[0])
            if (res.data[0][0].status == "Success") {
                setPhotoStatus('Active')
            }
        } catch (error) {
            console.log('error', error)
            toast.error(error.response, { position: 'top-right' })
        }
    }


    const handleDelete = async (id) => {
        console.log(id);
        try {
            const res = await axios.post(`/property/photo/delete/${id}?LoginID=${LoginID}&Token=${Token}`, null, {
                headers: {
                    Token,
                    LoginID,
                },
            })
            // let data = res?.data[0]
            console.log('res', res?.data[0])
            if (res.data[0][0].status == "Success") {
                toast.success('Photo Deleted')
                setDelPid('')
                handleDel()
                isRoom && getPhotosbyRoomID(id)
                handleFlag()
                // window.location.reload()
                // getPropertyPhoto()
                // getPhotosbyRoomID()
            }
        } catch (error) {
            console.log('error', error)
            toast.error(error.response, { position: 'top-right' })
        }
    }


    const [photoId, setPhotoId] = useState('')
    const [roomId, setRoomId] = useState('')
    const [updatePhoto, setUpdatePhoto] = useState(false)
    const handleUpdatePhoto = () => {
        setUpdatePhoto(!updatePhoto)
    }

    const DelModal = ({ id }) => {
        return (
            <>
                <Modal
                    isOpen={del}
                    toggle={handleDel}
                    className='modal-dialog-centered modal-md'
                >
                    <ModalHeader toggle={handleDel}>Delete Photo ({id})</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                Are you sure you want to delete this photo?
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Col className='text-center'>
                            <Button className='mx-1' color='danger' onClick={() => handleDelete(id)}>Delete</Button>
                            <Button className='mx-1' color='primary' onClick={() => handleDel()} outline>Cancel</Button>
                        </Col>
                    </ModalFooter>
                </Modal>
            </>
        )
    }

    return (
        <>
            <Card className='mb-50 overflow-hidden'>

                <CardHeader className='justify-content-center align-content-center p-0 overflow-hidden ' style={{ maxHeight: '175px' }} >

                    <img src={Image_base_uri + photo} alt={photo} width='100%' onClick={onClick} style={{ height: '175px', objectFit: 'cover', mixBlendMode: photostatus === 'Active' ? 'normal' : 'luminosity', opacity: photostatus === 'Active' ? '1' : '0.5' }} />
                    {
                        checked ? null : (
                            <div className='me-25 mb-25 position-absolute bottom-0 end-0'>
                                <Badge className='text-secondary opacity-50' color='light'>In-active</Badge>
                            </div>
                        )
                    }
                    <div className='form-check form-switch ps-0 position-absolute bottom-0 start-0'>
                        <Input type='switch' className='ms-25 mb-25' style={{ width: '28px', height: '16px' }} name={swich} id={swich} onChange={() => { photostatus === 'Active' ? handleActiveStatus(data.photoID) : handleInActiveStatus(data.photoID) }} checked={photostatus === 'Active'} />
                    </div>

                </CardHeader>
                <CardBody className='px-25 pb-50 pt-25 text-center'>
                    {/* {
                    allLabels.map((label, i) => {
                        return ( */}
                    {/* <Badge key={`${data.id}_label_${i}`} className={`px-75 me-25 mb-25 cursor-default`} color={labelColor[i < 7 ? i : i % 7]} pill>{allLabels}</Badge> */}
                    <Badge className={`px-75 me-25 mb-25 cursor-default`} color={'primary'} pill>{allLabels}</Badge>
                    {/* )
                    })
                } */}
                </CardBody>
                {/* {<>
                {
                    photo.roomNumber ? (
                        <div className='ms-25 mt-25 position-absolute'>
                            <Badge color='dark'>{photo.roomNumber}</Badge>
                        </div>
                    ) : null
                }
            </>
            } */}
                <div className='position-absolute end-0 d-flex'>
                    <UncontrolledDropdown>
                        <DropdownToggle className='ps-50' tag='span'>
                            <MoreVertical size={16} className='m-25 bg-light bg-opacity-50 rounded-circle fs-6 ' />
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem className='w-100' onClick={onClick}>
                                <FileText size={15} />
                                <span className='align-middle ms-50'>Open</span>
                            </DropdownItem>

                            <DropdownItem className='w-100' onClick={e => {
                                e.preventDefault()
                                handleUpdatePhoto()
                                setPhotoId(data?.photoID)
                                setRoomId(data?.roomID)
                            }}>
                                <Edit size={15} />
                                <span className='align-middle ms-50'>Update</span>
                            </DropdownItem>

                            <DropdownItem className='w-100' onClick={e => {
                                e.preventDefault()
                                setDelPid(data?.photoID)
                                handleDel()
                                // handleDelete(data?.PhotoID)
                            }}>
                                <Trash color='red' size={15} />
                                <span className='align-middle text-danger ms-50'>Remove</span>
                            </DropdownItem>

                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </Card>
            <UpdatePhotoModal open={updatePhoto} handleUpdatePhoto={handleUpdatePhoto} photoId={photoId} roomId={roomId} handleFlag={handleFlag} id={id} getPhotosbyRoomID={getPhotosbyRoomID} />
            {del && <DelModal id={delPid} />}
        </>

    )
}

export default UploadedPhoto