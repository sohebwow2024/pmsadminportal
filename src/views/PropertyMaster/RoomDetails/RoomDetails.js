import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, RefreshCcw, Trash } from 'react-feather'
import { useSelector } from 'react-redux'
import { Button, Card, CardBody, CardText, CardTitle, Col, Row, CardHeader, Badge } from 'reactstrap'
import axios from '../../../API/axios'
import AddNewRoom from './AddNewRoom'
import DeleteRoom from './DeleteRoom'
import RoomOTA from './RoomOTA'
import RoomRateModal from './RoomRateModal'
import UpdateRoom from './UpdateRoom'

const RoomType = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Room Type"
    
        return () => {
          document.title = prevTitle
        }
      }, [])

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData

    const [roomTypes, setRoomTypes] = useState([])

    const [sel_id, setSel_id] = useState()
    const [propId, setPropId] = useState()

    const [newRoom, setNewRoom] = useState(false)
    const handleNewRoom = () => setNewRoom(!newRoom)

    const [update, setUpdate] = useState(false)
    const handleUpdate = () => setUpdate(!update)

    const [deleteRoom, setDeleteRoom] = useState(false)
    const handleDelete = () => setDeleteRoom(!deleteRoom)

    const [OTA, setOTA] = useState(false)
    const handleOTA = () => setOTA(!OTA)

    const [roomTypeDropDown, setRoomTypeDropDown] = useState([])
    const [roomStatusDropDown, setRoomStatusDropDown] = useState([])
    const [bedTypeDropDown, setBedTypeDropDown] = useState([])
    const [extraBedTypeDropDown, setExtraBedTypeDropDown] = useState([])
    const [roomViewsList, setRoomViewsList] = useState([])
    console.log('ROOM View', roomViewsList)

    const [loader, setLoader] = useState(false)

    const [RoomTypeID, setRoomTypeID] = useState("")
    const [BedTypeID, setBedTypeID] = useState("")
    const [ExtraBedTypeID, setExtraBedTypeID] = useState("")
    const [RoomViewID, setRoomViewID] = useState("")
    const [RoomStatusID, setRoomStatusID] = useState('')
    const [editRoomTypeID, setEditRoomTypeID] = useState()
    const [editBedTypeID, setEditBedTypeID] = useState()
    const [editExtraBedTypeID, setEditExtraBedTypeID] = useState()
    const [editRoomViewID, setEditRoomViewID] = useState()
    // const [editRoomStatusID, setEditRoomStatusID] = useState()

    const [dropdownLoader, setDropdownLoader] = useState(false)

    const [selRoom, setSelRoom] = useState()
    const [openRateModal, setOpenRateModal] = useState(false)
    const handleOpenRateModal = () => setOpenRateModal(!openRateModal)

    const roomDetailsList = () => {
        setLoader(true)
        try {
            const roomDetailsListBody = {
                LoginID,
                // Token: "123",
                Token,
                Seckey: "abc",
                Event: "selectall"
            }
            axios.post(`/getdata/bookingdata/roomdetails`, roomDetailsListBody)
                .then(detailResponse => {
                    console.log('detailResponse', detailResponse)
                    setRoomTypes(detailResponse?.data[0])
                    setLoader(false)
                })
        } catch (error) {
            setLoader(false)
            console.log("Room Details Error", error.message)
        }
    }


    useEffect(() => {
        roomDetailsList()
    }, [])

    const roomTypeDropdown = () => {
        setDropdownLoader(true)
        try {
            const roomTypeDropdownBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            axios.post(`/getdata/bookingdata/roomtype`, roomTypeDropdownBody)
                .then(typeResponse => {
                    setRoomTypeDropDown(typeResponse?.data[0])
                    setDropdownLoader(false)
                })

        } catch (error) {
            setDropdownLoader(false)
            console.log("Room Category Dropdown Error", error.message)
        }
    }
    const roomTypeDropDownOptions = roomTypeDropDown?.length > 0 && roomTypeDropDown[0]?.roomType ? roomTypeDropDown?.map((roomType) => {
        return { value: roomType.roomTypeID, label: roomType.roomType }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleRoomType = (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const roomTypeDropdownBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: "select"
                }
                axios.post(`/getdata/bookingdata/roomtype`, roomTypeDropdownBody)
                    .then(typeResponse => {
                        setRoomTypeDropDown(typeResponse?.data[0])
                        setDropdownLoader(false)
                    })

            } catch (error) {
                setDropdownLoader(false)
                console.log("Room Category Dropdown Error", error.message)
            }
            return
        }
        setRoomTypeID(value)
        setEditRoomTypeID(value)
    }

    // const roomStatusDropdown = () => {
    //     setDropdownLoader(true)
    //     try {
    //         const roomStatusDropdownBody = {
    //             LoginID,
    //             Token,
    //             Seckey: "abc",
    //             Event: "select"
    //         }
    //         axios.post(`/getdata/bookingdata/roomstatus`, roomStatusDropdownBody)
    //             .then(statusResponse => {
    //                 setRoomStatusDropDown(statusResponse?.data[0])
    //                 setDropdownLoader(false)
    //                 console.log("Room status Dropdown", statusResponse?.data[0])

    //             })

    //     } catch (error) {
    //         setDropdownLoader(false)
    //         console.log("Room Category Dropdown Error", error.message)
    //     }
    // }

    // const statusOptions = roomStatusDropDown?.length > 0 && roomStatusDropDown[0]?.Status ? roomStatusDropDown?.map((status) => {
    //     return { value: status.StatusID, label: status.Status }
    // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

    const handleRoomStatus = (value) => {
        // if (value === 'reload') {
        //     setDropdownLoader(true)
        //     try {
        //         const roomStatusDropdownBody = {
        //             LoginID,
        //             Token,
        //             Seckey: "abc",
        //             Event: "select"
        //         }
        //         axios.post(`/getdata/bookingdata/roomstatus`, roomStatusDropdownBody)
        //             .then(statusResponse => {
        //                 setRoomStatusDropDown(statusResponse?.data[0])
        //                 setDropdownLoader(false)
        //                 console.log("Room status Dropdown - ", statusResponse?.data[0])

        //             })

        //     } catch (error) {
        //         setDropdownLoader(false)
        //         console.log("Room Category Dropdown Error", error.message)
        //     }
        //     return
        // }
        setRoomStatusID(value)
        // setEditRoomStatusID(value)
    }

    const bedTypeDropdown = () => {
        setDropdownLoader(true)
        try {
            const bedTypeDropdownBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "selectall"
            }
            axios.post(`/getdata/bookingdata/bedtype`, bedTypeDropdownBody)
                .then(response => {
                    //sorting the Array of objects based on Status
                    setBedTypeDropDown(response?.data[0].sort(i => i.Status))
                    setDropdownLoader(false)
                })
        } catch (error) {
            setDropdownLoader(false)
            console.log("Bed Type Dropdown Error", error.message)
        }
    }
    // const bedTypeDropDownOptions = bedTypeDropDown?.length > 0 && bedTypeDropDown[0]?.BedType ? bedTypeDropDown?.map((bedType) => {
    const bedTypeDropDownOptions = bedTypeDropDown?.length > 0 ? bedTypeDropDown?.map((bedType) => {
        return { value: bedType.bedTypeID, label: bedType.bedType, status: bedType.status } //Inserted Status in key value pair in option
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleBedType = (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const bedTypeDropdownBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: "select"
                }
                axios.post(`/getdata/bookingdata/bedtype`, bedTypeDropdownBody)
                    .then(response => {
                        setBedTypeDropDown(response?.data[0])
                        setDropdownLoader(false)
                    })
            } catch (error) {
                setDropdownLoader(false)
                console.log("Bed Type Dropdown Error", error.message)
            }
            return
        }
        setBedTypeID(value)
        setEditBedTypeID(value)
    }

    const extraBedTypeDropdown = () => {
        setDropdownLoader(true)
        try {
            const extraBedTypeDropdownBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeDropdownBody)
                .then(response => {
                    setExtraBedTypeDropDown(response?.data[0])
                    setDropdownLoader(false)
                })
        } catch (error) {
            setDropdownLoader(false)
            console.log("Extra Bed Type Dropdown Error", error.message)
        }
    }
    const extraBedTypeDropDownOptions = extraBedTypeDropDown?.length > 0 && extraBedTypeDropDown[0]?.extraBedType ? extraBedTypeDropDown?.map((extraBedType) => {
        return { value: extraBedType.extraBedTypeID, label: extraBedType.extraBedType }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleExtraBedType = (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const extraBedTypeDropdownBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: "select"
                }
                axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeDropdownBody)
                    .then(response => {
                        setExtraBedTypeDropDown(response?.data[0])
                        setDropdownLoader(false)
                    })
            } catch (error) {
                setDropdownLoader(false)
                console.log("Extra Bed Type Dropdown Error", error.message)
            }
            return
        }
        setExtraBedTypeID(value)
        setEditExtraBedTypeID(value)
    }

    const roomViewDropdown = () => {
        setDropdownLoader(true)
        try {
            const roomViewDropdownBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            axios.post('/getdata/bookingdata/roomviewdetails', roomViewDropdownBody)
                .then(response => {
                    setRoomViewsList(response?.data[0])
                    setDropdownLoader(false)
                })

        } catch (error) {
            setDropdownLoader(false)
            console.log("Room View Dropdown Error", error.message)
        }
    }
    const roomViewOptions = roomViewsList?.length > 0 && roomViewsList[0]?.roomView ? roomViewsList?.map((roomview) => {
        return { value: roomview.roomViewID, label: roomview.roomView }
    }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

    const handleRoomView = (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const roomViewDropdownBody = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: "select"
                }
                axios.post('/getdata/bookingdata/roomviewdetails', roomViewDropdownBody)
                    .then(response => {
                        setRoomViewsList(response?.data[0])
                        setDropdownLoader(false)
                    })

            } catch (error) {
                setDropdownLoader(false)
                console.log("Room View Dropdown Error", error.message)
            }
            return
        }
        setRoomViewID(value)
        setEditRoomViewID(value)
    }
    useEffect(() => {
        // roomViewDropdown()
        extraBedTypeDropdown()
        bedTypeDropdown()
        roomTypeDropdown()
        // roomStatusDropdown()
    }, [])

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.roomID.toLowerCase().includes(query.toLowerCase()) ||
            item.roomDisplayName.toLowerCase().includes(query.toLowerCase()) ||
            item.roomCategory.toLowerCase().includes(query.toLowerCase()) ||
            item.bedType.toLowerCase().includes(query.toLowerCase()) ||
            item.extraBedType.toLowerCase().includes(query.toLowerCase()) ||
            item.roomView.toLowerCase().includes(query.toLowerCase())
        )
    }

    const roomDetailTable = [
        {
            name: 'ID',
            width: '220px',
            selector: row => row.roomID
        },
        {
            name: 'Rate Plan',
            width: '200px',
            selector: row => {
                return (
                    <>
                        <Button
                            size='sm'
                            color='primary'
                            onClick={() => (handleOpenRateModal(), setSelRoom(row))}
                        >
                            Rate Plan
                        </Button>
                    </>
                )
            }
        },
        {
            name: 'Name',
            left: true,
            width: '20rem',
            selector: row => row.roomDisplayName
        },
        {
            name: 'Room Category',
            width: '200px',
            // selector: row => row.RoomType
            selector: row => row.roomCategory
        },
        {
            name: 'Bed Type',
            width: '150px',
            selector: row => row.bedType
        },
        {
            name: 'Extra Bed Type',
            width: '150px',
            selector: row => row.extraBedType
        },
        {
            name: 'View',
            width: '150px',
            selector: row => row.roomView
        },
        // {
        //     name: 'Rate',
        //     // selector: row => row.TotalAmount
        //     selector: row => row.RoomRate
        // },
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
            name: 'Actions',
            width: '15rem',
            selector: row => {
                // console.log(row);
                return (
                    <>
                        <Col>
                            <Edit className='me-50 pe-auto'
                                size={15}
                                onClick={() => {
                                    handleUpdate()
                                    setSel_id(row.roomID)
                                }}
                            />
                            <Trash
                                className='me-50'
                                size={15}
                                onClick={() => {
                                    handleDelete()
                                    setSel_id(row.roomID)
                                }}
                            />
                            <span className='me-50'>
                                <Button size='sm' color='primary' outline onClick={() => {
                                    handleOTA()
                                    setSel_id(row.roomID)
                                    setPropId(row.propertyID)
                                }}>
                                    <RefreshCcw size={15} /> OTA
                                </Button>
                            </span>
                        </Col>
                    </>
                )
            }
        }
    ]

    return (
        <>
            <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Details</CardTitle>
                            <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                            <div>

                                <Button color='primary' onClick={() => {
                                    handleNewRoom()
                                    roomTypeDropdown()
                                    // roomStatusDropdown()
                                    bedTypeDropdown()
                                    extraBedTypeDropdown()
                                    roomViewDropdown()
                                }}>Add Room</Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <CardText>
                                <DataTable
                                    noHeader
                                    pagination
                                    data={search(roomTypes)}
                                    columns={roomDetailTable}
                                    className='react-dataTable'
                                    sortIcon={<ChevronDown size={10} />}
                                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                    progressPending={loader}
                                />
                            </CardText>
                            <div>
                                <Button className='me-2' color='primary' onClick={roomDetailsList}>Reload</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {
                newRoom ? (
                    <AddNewRoom
                        open={newRoom}
                        handleNewRoom={handleNewRoom}
                        roomTypes={roomTypes}
                        setRoomTypes={setRoomTypes}
                        roomDetailsList={roomDetailsList}
                        roomTypeDropDownOptions={roomTypeDropDownOptions}
                        bedTypeDropDownOptions={bedTypeDropDownOptions}
                        extraBedTypeDropDownOptions={extraBedTypeDropDownOptions}
                        roomViewOptions={roomViewOptions}
                        statusOptions={statusOptions}
                        dropdownLoader={dropdownLoader}
                        handleRoomType={handleRoomType}
                        RoomTypeID={RoomTypeID}
                        setRoomTypeID={setRoomTypeID}
                        handleBedType={handleBedType}
                        setBedTypeID={setBedTypeID}
                        BedTypeID={BedTypeID}
                        handleExtraBedType={handleExtraBedType}
                        setExtraBedTypeID={setExtraBedTypeID}
                        ExtraBedTypeID={ExtraBedTypeID}
                        handleRoomView={handleRoomView}
                        setRoomViewID={setRoomViewID}
                        RoomViewID={RoomViewID}
                        handleRoomStatus={handleRoomStatus}
                        setRoomStatusID={setRoomStatusID}
                        RoomStatusID={RoomStatusID}
                    />
                ) : <></>
            }
            {
                update ? (
                    <UpdateRoom
                        open={update}
                        handleUpdate={handleUpdate}
                        roomTypes={roomTypes}
                        id={sel_id}
                        roomDetailsList={roomDetailsList}
                        roomTypeDropDownOptions={roomTypeDropDownOptions}
                        bedTypeDropDownOptions={bedTypeDropDownOptions}
                        extraBedTypeDropDownOptions={extraBedTypeDropDownOptions}
                        roomViewOptions={roomViewOptions}
                        statusOptions={statusOptions}
                        dropdownLoader={dropdownLoader}
                        handleRoomType={handleRoomType}
                        editRoomTypeID={editRoomTypeID}
                        setEditRoomTypeID={setEditRoomTypeID}
                        handleBedType={handleBedType}
                        editBedTypeID={editBedTypeID}
                        handleExtraBedType={handleExtraBedType}
                        editExtraBedTypeID={editExtraBedTypeID}
                        handleRoomView={handleRoomView}
                        editRoomViewID={editRoomViewID}
                        handleRoomStatus={handleRoomStatus}
                    />
                ) : <></>
            }
            {
                deleteRoom ? (
                    <DeleteRoom
                        open={deleteRoom}
                        handleDelete={handleDelete}
                        roomTypes={roomTypes}
                        id={sel_id}
                        roomDetailsList={roomDetailsList}
                    />
                ) : <></>
            }
            {
                OTA ? (
                    <RoomOTA
                        open={OTA}
                        handleOTA={handleOTA}
                        roomTypes={roomTypes}
                        id={sel_id}
                        PropId={propId}
                    />
                ) : <></>
            }
            {
                openRateModal ? (
                    <RoomRateModal
                        open={openRateModal}
                        handleOpenRateModal={handleOpenRateModal}
                        roomData={selRoom}
                    />
                ) : <></>
            }
        </>
    )
}

export default RoomType
