// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Custom Components
import Avatar from "@components/avatar"
import { Link } from 'react-router-dom'
// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Bell, X, Check, AlertTriangle } from "react-feather"
import { useNotification } from "../../../../utility/context/NotificationContext"

// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"
import { useSelector } from "react-redux"
import axios from "../../../../API/axios"
import moment from "moment"
import { useNavigate } from 'react-router-dom'



const NotificationDropdown = () => {

  // const { notifications, removeNotification } = useNotification()

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData
  const [notifications, setNotifications] = useState([])
  const [guest_details, setGuest_details] = useState([]);
  const [booking_details, setBooking_details] = useState([]);
  const [payment_details, setPayment_details] = useState([]);
  const [existingService, setExistingService] = useState([])


  const navigate = useNavigate()
  // console.log('notifications', notifications);
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

      setNotifications(res.data[0] ||  [] )

    } catch (error) {
      console.log('error', error)
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


  // ** Notification Array
  const notificationsArray = [
    {
      // img: require("@src/assets/images/portrait/small/avatar-s-15.jpg").default,
      subtitle: "Won the monthly best seller badge.",
      title: (
        <p className="media-heading">
          <span className="fw-bolder">Congratulation Sam 🎉</span>winner!
        </p>
      )
    },
    {
      // img: require("@src/assets/images/portrait/small/avatar-s-3.jpg").default,
      subtitle: "You have 10 unread messages.",
      title: (
        <p className="media-heading">
          <span className="fw-bolder">New message</span>&nbsp;received
        </p>
      )
    },
    {
      // avatarContent: "MD",
      color: "light-danger",
      subtitle: "MD Inc. order updated",
      title: (
        <p className="media-heading">
          <span className="fw-bolder">Revised Order 👋</span>&nbsp;checkout
        </p>
      )
    },
    // {
    //   title: <h6 className="fw-bolder me-auto mb-0">System Notifications</h6>,
    //   switch: (
    //     <div className="form-check form-switch">
    //       <Input
    //         type="switch"
    //         name="customSwitch"
    //         id="exampleCustomSwitch"
    //         defaultChecked
    //       />
    //     </div>
    //   )
    // },
    // {
    //   avatarIcon: <X size={14} />,
    //   color: "light-danger",
    //   subtitle: "USA Server is down due to hight CPU usage",
    //   title: (
    //     <p className="media-heading">
    //       <span className="fw-bolder">Server down</span>&nbsp;registered
    //     </p>
    //   )
    // },
    // {
    //   avatarIcon: <Check size={14} />,
    //   color: "light-success",
    //   subtitle: "Last month sales report generated",
    //   title: (
    //     <p className="media-heading">
    //       <span className="fw-bolder">Sales report</span>&nbsp;generated
    //     </p>
    //   )
    // },
    // {
    //   avatarIcon: <AlertTriangle size={14} />,
    //   color: "light-warning",
    //   subtitle: "BLR Server using high memory",
    //   title: (
    //     <p className="media-heading">
    //       <span className="fw-bolder">High memory</span>&nbsp;usage
    //     </p>
    //   )
    // }
  ]

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container notification-scroll"
        options={{
          wheelPropagation: false,
        }}
      >
        {notifications.map((item, index) => {
          // console.log('notifications', item)
          return (

            <DropdownItem 
            tag={Link}
            // tag='a' 
           to='/Notifications'
            className="topNotification" onClick={() => {
              addNotificationDetail(item.bookingID)
              getExistService(item.bookingID)
              removeNotification(item.transactionID)
              // navigate('/Notifications')
              navigate('/Notifications', { state: { bookingId: item.bookingID } });
            }}>
              <div
                className={classnames("list-item d-flex", {
                  "align-items-start": !item.transactionID,
                  "align-items-center": item.transactionID,
                })}
              >
                {/* {!item.switch ? ( */}
                <Fragment>
                  <div className="me-1">
                    {/* <Avatar
                      {...(item.img
                        ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                        : item.avatarContent
                          ? {
                            content: item.avatarContent,
                            color: item.color,
                          }
                          : item.avatarIcon
                            ? {
                              icon: item.avatarIcon,
                              color: item.color,
                            }
                            : null)}
                    /> */}
                  </div>
                  <div className="list-item-body flex-grow-1">

                    <p className="media-heading">
                      <span className="fw-bolder">{item.guestName} ({item.bookingID})</span>
                    </p>
                    <div className="d-flex mt-1">
                      <small className="notification-text me-3">
                        CheckIn Date: {moment(item.checkInDate).format('YYYY-MM-DD')}
                      </small>
                      <small className="notification-text">
                        CheckOut Date: {moment(item.checkOutDate).format('YYYY-MM-DD')}
                      </small>
                    </div>
                    <div className="d-flex">
                      <small className="notification-text me-3">
                        Received Amount: {item.recievedAmount}
                      </small>
                      <small className="notification-text">
                        Pending Amount: {item.pendingAmount}
                      </small>
                    </div>

                  </div>
                </Fragment>
                {/* ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )} */}
              </div>
            </DropdownItem>


          );
        })}
      </PerfectScrollbar >
    );
  };
  /*eslint-enable */
  {/* <a
              key={index}
              className="d-flex"
              onClick={(e) => {
                addNotificationDetail(item.BookingID)
                getExistService(item.BookingID)
              }}
            >
            </a> */}
  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          {notifications.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              {notifications.length}
            </Badge>
          </DropdownItem>
        </li>
        {/* <DropdownItem tag={Link} to='/Notifications' className="topNotification" > */}
        <li>
          {renderNotificationItems()}
        </li>
        {/* </DropdownItem> */}
        <li className="dropdown-menu-footer">
          <DropdownItem tag={Link} to='/Notifications' >
            <Button color="primary" block >
              Read all notifications
            </Button>
          </DropdownItem>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown