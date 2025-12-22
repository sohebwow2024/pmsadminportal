import React, { useEffect, useState } from 'react'
import {
    Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button, Form, Table, Badge, Spinner
} from 'reactstrap'
import { MoreVertical, Edit, Trash, ChevronDown, ChevronLeft, RefreshCcw, Check, User } from 'react-feather'
// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { Staah } from '../../API/axios'
import Axios from 'axios'
import { openLinkInNewTab } from '../../common/commonMethods'
import moment from 'moment'
import toast from 'react-hot-toast'
import Avatar from '@components/avatar'
import OnHoldQuickBookingModal from '../FrontDesk/OnHoldQuickBookingModal'
import QuickBookingModal from '../FrontDesk/QuickBookingModal'
import OTABookingModal from './OTABookingModal'
import { getBookingData, setOTABookingID } from '../../redux/voucherSlice'
import { store } from "@store/store";
const IBEBooking = () => {
    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-IBE Booking"

        return () => {
            document.title = prevTitle
        }
    }, [])

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID } = getUserData
    let roleType = getUserData?.UserRoleType
    const navigate = useNavigate()
    const { name, id } = useParams()
    const dispatch = useDispatch();
    const [tdata, setTdata] = useState([])
    const [confirmation, setConfirmation] = useState('')
    const [resID, setResID] = useState('')
    const [loading, setLoading] = useState(false)
    const [confirmloading, setConfirmLoading] = useState(false)
    const [selId, setSelID] = useState('')
    const [cancelOpen, setCancelOpen] = useState(false);
    const handleCancelOpen = () => setCancelOpen(!cancelOpen);
    const [bookingRemoveId, setBookingRemoveId] = useState('')
    const [DeleteOpen, setDeleteOpen] = useState(false);
    const handleDeleteOpen = () => setDeleteOpen(!DeleteOpen);

    const [otaModalOpen, setOtaModalOpen] = useState(false)
    const handleModalOpen = () => setOtaModalOpen(!otaModalOpen)

    const getIbeBooking = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/IBE/list', {
                headers: {
                    LoginID,
                    Token,
                }
            })
            setTdata(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getIbeBooking()
    }, [])



    const handleCancelBooking = async () => {
        try {
            const res = await axios.post(`/IBE/remove/bookingdetail`, {}, {
                headers: {
                    LoginID,
                    Token,
                    seckey: 'abc'
                },
                params: {
                    id: bookingRemoveId,
                    eventType: 'Remove'
                }
            });
            // console.log("cancelres", res);
            if (res.data[0][0].Status === "Success") {
                // handleOpen();
                getIbeBooking()
                // handelReset()
                toast.success(`${bookingRemoveId} - booking is Removed!`);
                handleCancelOpen();
            }
        } catch (err) {
            console.log("cancel", err);
            toast.error(err.response);
            handleCancelOpen();
        }
    };
    const handleDeleteBooking = async () => {
        try {
            const res = await axios.post(`/IBE/remove/bookingdetail`, {}, {
                headers: {
                    LoginID,
                    Token,
                    seckey: 'abc'
                },
                params: {
                    id: bookingRemoveId,
                    eventType: 'Cancel'
                }
            });
            // console.log("cancelres", res);
            if (res.data[0][0].Status === "Success") {
                // handleOpen();
                getIbeBooking()
                // handelReset()
                toast.success(`${bookingRemoveId} - booking is Canceled!`);
                handleDeleteOpen();
            }
        } catch (err) {
            console.log("cancel", err);
            toast.error(err.response);
            handleDeleteOpen();
        }
    };


    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            // item.id.toLowerCase().includes(query.toLowerCase()) ||
            item.guestFirstName.toLowerCase().includes(query.toLowerCase()) ||
            item.guestEmail.toLowerCase().includes(query.toLowerCase()) ||
            item.guestMobile.toLowerCase().includes(query.toLowerCase())
        )
    }

    const tableColumns = [
        {
            center: true,
            width: '80px',
            sortable: row => row.id,
            cell: (row, i) => {
                return (
                    console.log('ggsdg', row),
                    <>
                        <div className='d-flex'>
                            <UncontrolledDropdown>
                                <DropdownToggle className='pe-1' tag='span'>
                                    <MoreVertical size={15} />
                                </DropdownToggle>

                                {/* {roleType === 'SuperAdmin' ?  */}
                                <DropdownMenu> <DropdownItem onClick={() => {
                                    handleCancelOpen()
                                    setBookingRemoveId(row.id)
                                }}>
                                    <Trash size={15} />
                                    <span className='align-middle ms-50'>Remove</span>
                                </DropdownItem>
                                    <DropdownItem onClick={() => {
                                        handleDeleteOpen()
                                        setBookingRemoveId(row.id)
                                    }}>
                                        <Trash size={15} />
                                        <span className='align-middle ms-50'>Cancel</span>
                                    </DropdownItem>
                                </DropdownMenu>
                                {/* : ''} */}


                            </UncontrolledDropdown>
                        </div>
                        <div className='d-flex align-items-center cursor-pointer' onClick={() => {
                            setSelID(row.id)
                            if (row.isTransfer === false) {
                                handleModalOpen()
                            }
                        }}>
                            <Avatar
                                title="Click to Manage Booking"
                                icon={<User color='#FFFFFF' size={25} />}
                                color={
                                    row.status === 'Confirmed' && row.isTransfer === true ? (
                                        'success'
                                    ) : row.status === 'Cancel' ? (
                                        'danger'
                                    ) : row.status === 'Remove' ? (
                                        '#000'
                                    ) : row.status === 'Active' && row.isTransfer === false ? (
                                        'warning'
                                    ) : '#000'
                                }
                            />
                        </div>
                    </>
                )
            }
        },
        {
            name: 'Booking Status',
            minWidth: '12rem',
            center: true,
            sortable: true,
            selector: row => row.status,
            cell: row => {
                return (
                    <>
                        {
                            row.status === 'Confirmed' && row.isTransfer === true ? (
                                <Badge color='success'>Checked In</Badge>
                            ) : row.status === 'Cancel' ? (
                                <Badge color='danger'> Cancelled</Badge>
                            ) : row.status === 'Remove' ? (
                                <Badge color='light-secondary'>Removed</Badge>
                            ) : row.status === 'Active' && row.isTransfer === false ? (
                                <Badge color='warning'>Reserved</Badge>
                            ) : <Badge color='light-secondary'>{row.status}</Badge>
                        }
                    </>
                )
            }
        },
        {
            name: 'Id',
            sortable: true,
            minWidth: '150px',
            selector: row => (row.id)
        },
        {
            name: 'Booking Id',
            sortable: true,
            minWidth: '150px',
            selector: row => (row.bookingMapID === null ? '' : row.bookingMapID)
        },

        {
            name: 'Guest Name',
            sortable: true,
            minWidth: '200px',
            selector: row => (row.guestFirstName)
        },
        {
            name: 'Guest Mobile',
            sortable: true,
            minWidth: '200px',
            selector: row => (row.guestMobile)
        },
        {
            name: 'Guest Email',
            sortable: true,
            selector: row => row.guestEmail
        },
        {
            name: 'CheckIn Date',
            sortable: true,
            minWidth: '150px',
            selector: row => moment(row.checkInDate).format("DD-MM-YYYY")
        },
        {
            name: 'CheckOut Date',
            sortable: true,
            minWidth: '150px',
            selector: row => moment(row.checkOutDate).format("DD-MM-YYYY")
        },
        {
            name: 'Transfered To PMS',
            sortable: true,
            width: '180px',
            selector: row => (
                <>
                    <Col>
                        {row.isTransfer === true ? 'Yes' : 'No'}
                    </Col>
                </>
            )
        },
    ]

    return (
        <>
            <div className='d-flex justify-content-between'>
                {/* <Button className='mb-1 ' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button> */}
                {/* <span className='fs-3 '>{name}IBE Booking</span> */}
                {/* <Button className='mb-1 float-end' color='primary' outline onClick={() => handleSync()} > <RefreshCcw size={15} className='me-1' disabled={loading === true} />{loading === true ? 'Loading' : 'SYNC ALL'} </Button> */}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>IBE Booking</CardTitle>
                    <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col className='react-dataTable'>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                    <Spinner color="primary" />
                                    <span className="ms-2">Loading...</span>
                                </div>
                            ) : (
                                <DataTable
                                    noHeader
                                    pagination
                                    data={tdata}
                                    columns={tableColumns}
                                    className='react-dataTable'
                                    sortIcon={<ChevronDown size={10} />}
                                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                />
                            )}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {otaModalOpen && <OTABookingModal open={otaModalOpen} handleOpen={handleModalOpen} id={selId} getIbeBooking={getIbeBooking} />}
            {/* {quickModalOpen && <QuickBookingModal open={quickModalOpen} handleOpen={handleModalOpen} handleModalOpen={handleModalOpen} />} */}
            <Modal
                isOpen={cancelOpen}
                toggle={handleCancelOpen}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
                    Remove Booking of - {bookingRemoveId}
                </ModalHeader>
                <ModalBody>
                    <h3 className="text-center">
                        Are you sure you want to Remove this booking?
                    </h3>
                    <Col className="text-center">
                        <Button
                            className="m-1"
                            color="danger"
                            onClick={() => handleCancelBooking()}
                        >
                            Confirm
                        </Button>
                        <Button
                            className="m-1"
                            color="primary"
                            onClick={() => handleCancelOpen()}
                        >
                            Cancel
                        </Button>
                    </Col>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={DeleteOpen}
                toggle={handleDeleteOpen}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader className="bg-transparent" toggle={handleDeleteOpen}>
                    Cancel Booking of - {bookingRemoveId}
                </ModalHeader>
                <ModalBody>
                    <h3 className="text-center">
                        Are you sure you want to Cancel this booking?
                    </h3>
                    <Col className="text-center">
                        <Button
                            className="m-1"
                            color="danger"
                            onClick={() => handleDeleteBooking()}
                        >
                            Confirm
                        </Button>
                        <Button
                            className="m-1"
                            color="primary"
                            onClick={() => handleDeleteOpen()}
                        >
                            Cancel
                        </Button>
                    </Col>
                </ModalBody>
            </Modal>
        </>
    )
}

export default IBEBooking