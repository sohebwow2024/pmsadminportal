import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { ChevronDown, Edit, Trash } from 'react-feather'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, CardHeader, Badge } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const RoomType = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Room Category"
    
        return () => {
          document.title = prevTitle
        }
      }, [])
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    const [show, setShow] = useState(false)
    const handleModal = () => setShow(!show)
    const [refresh, setRefresh] = useState(false)

    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)
    const [selected_roomType, setSelected_roomType] = useState()
    const [del, setDel] = useState(false)
    const [roomTypes, setRoomTypes] = useState([])

    const [loader, setLoader] = useState(false)

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

    // const userId = localStorage.getItem('user-id')

    const roomTypeList = () => {
        setLoader(true)
        try {
            const roomTypeDetails = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'selectall'
            }
            axios.post(`/getdata/bookingdata/roomtype`, roomTypeDetails)
                .then(response => {
                    console.log('responseRoomType', response);
                    setRoomTypes(response.data[0])
                    setLoader(false)
                })
            if (roomTypes === []) { setRefresh(!refresh) }
        } catch (error) {
            setLoader(false)
            console.log("RoomType Error", error.message)
        }
    }
    useEffect(() => {
        roomTypeList()
    }, [refresh])

    console.log('roomTypes', roomTypes);

    const NewRoomTypeModal = () => {
        const [RoomType, setRoomType] = useState('')
        const [RoomTypeDesc, setRoomTypeDesc] = useState('')

        const [display, setDisplay] = useState(false)


        const addNewRoomType = () => {
            try {
                const roomTypeDetails = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: 'insert',
                    RoomType,
                    RoomTypeDesc
                }
                axios.post(`/getdata/bookingdata/roomtype`, roomTypeDetails).then((res) => {
                    // roomTypeList()
                    // window.location.reload();
                    setRefresh(res);
                })
            } catch (error) {
                console.log("RoomType Error", error.message)
            }
        }

        const handleSubmit = () => {
            setDisplay(true)
            if (RoomType.trim() !== '') {
                addNewRoomType()
                handleModal()
                toast.success('RoomType Added!', { position: "top-center" })
            }
        }

        

        return (
            <Modal
                isOpen={show}
                toggle={handleModal}
                className='modal-dialog-centered modal-lg '
                backdrop={false}

            >
                <ModalHeader className='bg-transparent' toggle={handleModal}>
                    Add Room Category
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
                        <Col md='12' className='mb-2'>
                            <Label className='form-label' for='roomType'>
                                <span className='text-danger'>*</span>Room Category
                            </Label>
                            <Input type='text' name='RoomType' id='RoomType' value={RoomType} onChange={e => setRoomType(e.target.value)} invalid={display && RoomType.trim() === ''} />
                            {display && !RoomType.trim() ? <span className='error_msg_lbl'>Enter Room Category </span> : null}
                        </Col>
                        <Col md='12' className='mb-2'>
                            <Label className='form-label' for='RoomTypeDesc'>Room Description</Label>
                            <Input type='textarea' name='RoomTypeDesc' id='RoomTypeDesc' value={RoomTypeDesc} onChange={e => setRoomTypeDesc(e.target.value)} />
                        </Col>
                    </Row>
                    <Row tag='form' className='gy-1 gx-2 mt-75' >
                        <Col className='text-lg-end text-md-center mt-1' xs={12}>
                            <Button className='me-1' color='primary' onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button
                                color='secondary'
                                outline
                                onClick={() => {
                                    setShow(!show)
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

    const EditRoomTypeModal = ({ id }) => {

        const roomTypeData = roomTypes.filter(roomType => roomType.roomTypeID === id)

        const [editStatus, setEditStatus] = useState(roomTypeData[0]?.status)

        const [editRoomType, setEditRoomType] = useState(roomTypeData[0]?.roomType)
        const [editRoomTypeDesc, setEditRoomTypeDesc] = useState(roomTypeData[0]?.roomTypeDesc)
        const [editRoomTypeStatus, setEditRoomTypeStatus] = useState(roomTypeData[0]?.status)
        const [editDisplay, setEditDisplay] = useState(false)

        const edtNewRoomType = () => {
            try {
                const roomTypeDetails = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: 'update',
                    RoomTypeID: id,
                    RoomType: editRoomType,
                    RoomTypeDesc: editRoomTypeDesc,
                    Status: editStatus
                }
                axios.post(`/getdata/bookingdata/roomtype`, roomTypeDetails).then((res) => {
                    // roomTypeList()
                    // window.location.reload();
                    setRefresh(res);
                })
            } catch (error) {
                console.log("RoomType Error", error.message)
            }
        }
        const editHandleSubmit = () => {
            setEditDisplay(true)
            if (editRoomType.trim() !== '') {
                edtNewRoomType()
                handleEditModal()
                toast.success('RoomType Edited Successfully!', { position: "top-center" })
            }
        }

        return (
            <Modal
                isOpen={showEdit}
                toggle={handleEditModal}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                    Edit Room Category
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
                        <Col md='12' className='mb-2'>
                            <Label className='form-label' for='RoomType'>
                                <span className='text-danger'>*</span>Room Category
                            </Label>
                            <Input type='text' name='RoomType' id='RoomType' value={editRoomType} onChange={e => setEditRoomType(e.target.value)} invalid={editDisplay && editRoomType.trim() === ''} />
                            {editDisplay && !editRoomType.trim() ? <span className='error_msg_lbl'>Enter Room Category </span> : null}
                        </Col>
                        <Col md='12' className='mb-2'>
                            <Label className='form-label' for='RoomTypeDesc'>Room Description</Label>
                            <Input type='textarea' name='RoomTypeDesc' id='RoomTypeDesc' value={editRoomTypeDesc} onChange={e => setEditRoomTypeDesc(e.target.value)} />
                        </Col>
                        <Col md='12'>
                            <Label className='form-label'>Room Category Status</Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                classNamePrefix='select'
                                placeholder='Select Room status'
                                options={statusOptions}
                                value={statusOptions?.filter(c => c.value === editRoomTypeStatus)}
                                onChange={e => setEditStatus(e.value)}
                            />
                            {editDisplay && editRoomTypeStatus === '' && <span className='text-danger'>Room Category Status is required</span>}
                        </Col>
                    </Row>
                    <Row tag='form' className='gy-1 gx-2 mt-75' >
                        <Col className='text-lg-end text-md-center mt-1' xs={12}>
                            <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                                Submit
                            </Button>
                            <Button
                                color='secondary'
                                outline
                                onClick={() => {
                                    setShowEdit(handleEditModal)
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

    const DeleteRoomTypeModal = ({ id }) => {

        const data = roomTypes.filter(roomTypes => roomTypes.RoomTypeID === id)
        const edtNewRoomType = () => {
            try {
                const roomTypeDetails = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: 'delete',
                    RoomTypeID: id
                }
                axios.post(`/getdata/bookingdata/roomtype`, roomTypeDetails).then((res) => {
                    // roomTypeList()
                    // window.location.reload();
                    setRefresh(res);
                })
            } catch (error) {
                console.log("RoomType Error", error.message)
            }
        }
        const handleDeleteRoomType = () => {
            edtNewRoomType()
            setDel(!del)
        }

        return (
            <Modal
                isOpen={del}
                toggle={() => setDel(!del)}
                className='modal-dialog-centered'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
                    Are you sure to delete {data[0]?.RoomType} permanently?
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button color='danger' className='m-1' onClick={handleDeleteRoomType}>
                                Delete
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.roomTypeID.toLowerCase().includes(query.toLowerCase()) ||
            item.roomType.toLowerCase().includes(query.toLowerCase()) 
        )
    }

    const roomTypeTable = [
        {
            name: 'ID',
            sortable: true,
            selector: row => row.roomTypeID
        },
        {
            name: 'Room Category',
            sortable: true,
            selector: row => row.roomType
        },
        {
            name: "Room Description",
            selector: row => row.roomTypeDesc
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => row.status,
            cell: row => {
                return (
                    <>
                        {
                            row.Status === 'Active' ? (
                                <Badge color='light-success'> {row.status}</Badge>
                            ) : (
                                <Badge color='light-danger'> {row.status}</Badge>
                            )
                        }
                    </>
                )
            }
        },
        {
            name: 'Action',
            sortable: true,
            center: true,
            selector: row => (
                row.proprtyID !== "ALL" ? (
                    <Col>
                        <Edit className='me-50 pe-auto' onClick={() => {
                            setShowEdit(true)
                            setSelected_roomType(row.roomTypeID)
                        }} size={15} />
                        <Trash className='me-50' onClick={() => {
                            setDel(true)
                            setSelected_roomType(row.roomTypeID)
                        }} size={15} />
                    </Col>
                ) : null
            )
        }
    ]
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Room Category
                    </CardTitle>
                    <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                    <Button color='primary' onClick={() => setShow(true)}>Add Room Category</Button>
                </CardHeader>
                <CardBody>
                    <Row className='my-1'>
                        <Col>
                            <DataTable
                                noHeader
                                data={search(roomTypes)}
                                columns={roomTypeTable}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                pagination
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                progressPending={loader}
                            />
                        </Col>
                    </Row>
                    <div>
                        <Button className='me-2' color='primary' onClick={roomTypeList}>Reload</Button>
                    </div>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardBody>
                            <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                                <h2>Room Category</h2>
                                <Button color='primary' onClick={() => setShow(true)}>Add Room Category</Button>
                            </CardTitle>
                            <CardText>
                                <DataTable
                                    noHeader
                                    data={roomTypes}
                                    columns={roomTypeTable}
                                    className='react-dataTable'
                                    pagination
                                    progressPending={loader}
                                />
                            </CardText>
                            <div>
                                <Button className='me-2' color='primary' onClick={roomTypeList}>Reload</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
            {show ? <NewRoomTypeModal /> : <></>}
            {showEdit ? <EditRoomTypeModal id={selected_roomType} /> : <></>}
            {del ? <DeleteRoomTypeModal id={selected_roomType} /> : <></>}
            {
                show | showEdit | del ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }

        </>
    )
}

export default RoomType