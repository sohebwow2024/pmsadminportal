import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from 'reactstrap'
import classnames from "classnames"
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import toggleIcon from '@src/assets/images/toggle-icon.svg'
import toast from 'react-hot-toast'
import { useNotification } from "../../utility/context/NotificationContext"
import { useLocation } from 'react-router-dom';

const Notifications = () => {
    const getUserData = useSelector(state => state.userManageSlice.userData)


    //const { notifications,removeNotification} = useNotification()

    const { LoginID, Token } = getUserData
    const [notifications, setNotifications] = useState([])
    const [guest_details, setGuest_details] = useState([]);
    const [booking_details, setBooking_details] = useState([]);
    const [payment_details, setPayment_details] = useState([]);
    const [existingService, setExistingService] = useState([])
    const [bookingId, setBookingId] = useState('')
    const [del, setDel] = useState(false)
    // console.log('notifications', notifications);
    console.log('existingService', existingService)


    // ............................................................
    // ............................................................

    const location = useLocation();
    const bookingIdFromState = location?.state?.bookingId;


    useEffect(() => {
        if (bookingIdFromState) {
            addNotificationDetail(bookingIdFromState);
            getExistService(bookingIdFromState);
        }
    }, [bookingIdFromState]);


    const detailsRef = useRef(null);
    useEffect(() => {
        if (bookingIdFromState && detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [guest_details]);

    // ........................................................
    // ........................................................

    const columns = [
        {
            name: 'ID',
            minWidth: '17rem',
            width: '250px',
            selector: row => row.extraServiceId ? row.extraServiceId : row.serviceId
        },
        {
            name: 'Service Name',
            minWidth: '12rem',
            selector: row => row.serviceName
        },
        {
            name: 'Service Type',
            minWidth: '10rem',
            selector: row => row.serviceType
        },
        {
            name: 'Amount',
            selector: row => row.totalAmount
        },
        {
            name: 'Reference Text',
            minWidth: '25rem',
            selector: row => row.referenceText
        }, {
            name: 'Room No',
            selector: row => row.roomNo
        },
        // {
        //     name: 'Actions',
        //     selector: row => {
        //         return (
        //             <>
        //                 {
        //                     row.ExtraServiceId.length > 0 && (
        //                         <Trash2 color='red' size='20' onClick={() => {
        //                             setDeleteESID(row.ExtraServiceId)
        //                             handleDeleteModal()
        //                         }}
        //                         />
        //                     )
        //                 }

        //             </>
        //         )
        //     }
        // }
    ]

    const getNotification = async () => {
        try {
            const res = await axios.get(`/Reports/BookedNotificationDetails`, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: "123",
                    Event: 'BookedNotificationDetails'
                }
            })

            setNotifications(res.data[0])

        } catch (error) {
            console.log('error', error)
        }
    }

    const deleteNoti = async (id) => {
        try {
            await axios.post(`Reports/RemoveNotificationDetails?TransactionID=${id}`, {}, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: "123",
                    // Event: 'BookedNotificationDetails',
                    // BookingID: id,
                }
            }).then((res) => {
                console.log(res);
                // removeNotification(id)
                toast.success('Notification Deleted')
                setDel(false)
                // companynotificationList()
            })
        } catch (error) {
            console.error(error)
        }
    }

    const addNotificationDetail = async (id) => {
        try {
            const bookingsBody = {
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                BookingID: id,
                // Event: "select"
            };
            axios
                .post(`/getdata/bookingdetailsbybookingid`, bookingsBody) // TODO - Why
                .then((response) => {
                    console.log("bookingdetailsbybookingid", response?.data);
                    setGuest_details(response?.data[0]);
                    setBooking_details(response?.data[1]);
                    setPayment_details(response?.data[2]);
                })
                .catch((err) => {
                    console.log("err on request", err);
                    toast.error("Something went wrong, check Console!");
                });
        } catch (error) {
            console.log("Bookings Error=====", error.message);
        }
    }



    const getExistService = async (id) => {
        try {
            const res = await axios.get('/booking/extraservice/GetByBookingId', {
                params: {
                    LoginID,
                    Token,
                    BookingID: id
                }
            })
            console.log('existingService', res.data)
            setExistingService(res.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getNotification()
    }, [])
    return (
        <>
            <Row>
                <div className='col-md-6 side-Notification-Card'>
                    <h4>Notification Details</h4>
                    {notifications.map((item, index) => {
                        {/* console.log('item', item) */ }
                        return (
                            <>
                                <Card className='noti-card'>
                                    <CardHeader className="d-flex justify-content-end">
                                        {/* <CardTitle>Booking Information</CardTitle> */}
                                        <UncontrolledDropdown>
                                            <DropdownToggle className='hide-arrow me-1' tag='a' href='/' onClick={e => e.preventDefault()}>
                                                <img src={toggleIcon} width='20' className='me-1' />
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                                <DropdownItem onClick={() => {
                                                    setDel(true)
                                                    setBookingId(item.transactionID)
                                                }}>
                                                    Remove
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        {/* <img src={toggleIcon} width='20' className='me-1' /> */}
                                    </CardHeader>
                                    <CardBody>
                                        <a
                                            key={index}
                                            className="d-flex "
                                            // href={item.switch ? "#" : "/"}
                                            onClick={(e) => {
                                                addNotificationDetail(item.bookingID)
                                                getExistService(item.bookingID)
                                            }}
                                        >
                                            <div
                                                className={classnames("list-item d-flex", {
                                                    "align-items-start": !item.bookingID,
                                                    "align-items-center": item.bookingID,
                                                })}
                                            >
                                                {/* {!item.switch ? ( */}
                                                <Fragment>
                                                    <div className="me-1">
                                                    </div>
                                                    <div className="list-item-body flex-grow-1">

                                                        <p className="media-heading">
                                                            <span className="fw-bolder">{item.guestName} ({item.bookingID})</span>
                                                        </p>
                                                        <div className="d-flex">
                                                            <small className="notification-text me-3">
                                                                CheckIn Date: {moment(item.checkInDate).format('YYYY-MM-DD')}
                                                            </small>
                                                            <small className="notification-text">
                                                                CheckOut Date: {moment(item.checkOutDate).format('YYYY-MM-DD')}
                                                            </small>
                                                        </div>
                                                        <div className="d-flex mt-1">
                                                            <small className="notification-text me-3">
                                                                Received Amount: {item.recievedAmount}
                                                            </small>
                                                            <small className="notification-text">
                                                                Pending Amount: {item.pendingAmount}
                                                            </small>
                                                        </div>
                                                        {/* <div >
                                                    </div> */}
                                                    </div>
                                                </Fragment>
                                            </div>
                                        </a>
                                    </CardBody>
                                </Card>
                            </>
                        );
                    })}
                </div>
                <div className='col-md-6 ps-2' ref={detailsRef}>
                    <h4>Booking Details</h4>
                    <Row className="">
                        {/* <Col> */}
                        {guest_details.map((item, index) => {
                            return (
                                <>
                                    <Card key={index}>
                                        <CardHeader className="d-flex justify-content-center">
                                            <CardTitle>Guest Information</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Form>
                                                <Row className="d-flex flex-column">
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest Name:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                value={item.guestName}
                                                                disabled
                                                            // invalid={isEdit && editGuestName === ""}
                                                            // onChange={(e) => setEditGuestName(e.target.value)}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest Email:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="email"
                                                                value={item.guestEmail}
                                                                disabled
                                                            // invalid={isEdit && editGuestEmail === ""}
                                                            // onChange={(e) => setEditGuestEmail(e.target.value)}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest Mobile:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="number"
                                                                min={12}
                                                                max={13}
                                                                value={item.guestMobileNumber}
                                                                disabled
                                                            // invalid={isEdit && editGuestMobile === ""}
                                                            // onChange={(e) => setEditGuestMobile(e.target.value)}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest City:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                value={item.cityName}
                                                                disabled
                                                            // disabled={isEdit === false}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest State:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                value={item.stateName}
                                                                disabled
                                                            // disabled={isEdit === false}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                        <Col>
                                                            <h5 className="mb-0">Guest Country:</h5>
                                                        </Col>
                                                        <Col>
                                                            <Input
                                                                type="text"
                                                                value={item.countryName}
                                                                disabled
                                                            // disabled={isEdit === false}
                                                            />
                                                        </Col>
                                                    </Col>
                                                    {/* <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                    <Col>
                                                        <h5 className="mb-0">Note:</h5>
                                                    </Col>
                                                    <Col>
                                                        <Input
                                                            type="text"
                                                        // value={editGuestNote}
                                                        // disabled={isEdit === false}
                                                        // onChange={(e) => setEditGuestNote(e.target.value)}
                                                        />
                                                    </Col>
                                                </Col> */}
                                                </Row>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </>
                            )
                        })}
                        {payment_details.map((item, index) => {
                            { console.log('bookingdetailsbybookingid hghg', item) }
                            return (
                                <Card key={index}>
                                    <CardHeader className="d-flex justify-content-center">
                                        <CardTitle>Payment Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row className="d-flex flex-column">
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Booking Commission:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.bookingCommission}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Booking Amount:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.bookingAmount}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">POS Orders:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.posOrder}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Extra Service:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.extraAmount}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Total Amount:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.totalAmount}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Received Amount:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.recievedAmount}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Pending Amount:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={`₹ ${item?.pendingAmount}`}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}
                        {booking_details.map((item, index) => {
                            { console.log('bookingdetailsbybookingid hghg', item) }
                            return (
                                <Card key={index}>
                                    <CardHeader className="d-flex justify-content-center">
                                        <CardTitle>Booking Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row className="d-flex flex-column">
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Booking Source:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={item?.bookingSource}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Booking Id:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={item?.bookingID}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Check-In Date:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="datetime"
                                                        value={moment(item?.checkInDate).format(
                                                            "DD-MM-YYYY, HH:mm"
                                                        )}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Check-Out Date:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="datetime"
                                                        value={moment(
                                                            item?.checkOutDate
                                                        ).format("DD-MM-YYYY, HH:mm")}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Room Count:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={item?.roomCount}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Guest:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={item?.totalGuest}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                            <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">Current Status:</h5>
                                                </Col>
                                                <Col>
                                                    <Input
                                                        type="text"
                                                        value={item?.status}
                                                        disabled
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}
                        <Card>
                            {
                                existingService.length > 0 && (
                                    <DataTable
                                        noHeader
                                        data={existingService}
                                        columns={columns}
                                        className='react-dataTable'
                                        sortIcon={<ChevronDown size={10} />}
                                        pagination
                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                    />
                                )
                            }
                        </Card>
                    </Row>
                </div>
            </Row>
            <Modal
                className='modal-dialog-centered'
                isOpen={del}
            >
                <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
                    Are you sure to Remove Notification?
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button className='m-1' color='danger' onClick={() => deleteNoti(bookingId)}>Remove</Button>
                            <Button className='mx-1' color='secondary' outline onClick={() => setDel(!del)}>Cancel</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default Notifications