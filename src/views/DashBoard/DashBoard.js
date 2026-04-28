import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "reactstrap";
import {
  Calendar,
  Circle,
  Monitor,
  UserCheck,
  Mail,
  User,
} from "react-feather";
import { Chart as ChartJS, registerables } from "chart.js";
import CardDetail from "./CardDetail";
import { storeBookingDetails } from "../../redux/voucherSlice";
import axios from "../../API/axios";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
// import BookingModal from "../FrontDesk/BookingModal";
import OnHoldQuickBookingModal from "../FrontDesk/OnHoldQuickBookingModal";
import toast from "react-hot-toast";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@components/avatar";
import HotelSelectModal from "./HotelSelectModal";
import "../../assets/scss/style.scss";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

ChartJS.register(...registerables);
const DashBoard = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Dashboard";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const toggleNewModal = () => setIsNewModalOpen(!isNewModalOpen);

  const [cardData, setCardData] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [sel_bookingID, setSel_bookingID] = useState("");
  const [remaining, setRemaining] = useState("");
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, CompanyID, PropertyID } = getUserData;

  const [dailyNumData, setDailyNumData] = useState([]);
  console.log("dailyNumData", dailyNumData);

  const handleOpen = () => setOpen(!open);
  const handleOnHoldOpne = () => setOnHoldOpen(!onHoldOpen);
  const [onHoldOpen, setOnHoldOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");
  console.log("bookingStatus", bookingStatus);

  const [hotelSelectOpen, setHotelSelectOpen] = useState(false);
  const handleHotelSelectOpen = () => setHotelSelectOpen(!hotelSelectOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getNumData = async () => {
    try {
      const objc1 = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "chart",
      };
      const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
      console.log("numressss", res);
      setDailyNumData(res.data);
      setRemaining(res.data[1]);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const getRemainingCheckout = async () => {
    try {
      const objc1 = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "Remaining Checkout",
      };
      const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
      console.log("remres", res);
      console.log("remres", res.data[0]);
      setRemaining(res.data[0]);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getNumData();
    getRemainingCheckout();
  }, []);
  // console.log("dailyNumData", dailyNumData);

  const getRooms = (i) => {
    // console.log("data i > ", data[i]); // TODO - getroom data for the selected reservation
    try {
      const bookingsBody = {
        LoginID,
        Token,
        Seckey: "abc",
      };
      axios
        .post(`/getdata/bookingdata/dashboardchart`, bookingsBody)
        .then((response) => {
          // console.log("Bookings room num response", response?.data[0]);
          // console.log("123qqq");
          setRoomData(response?.data[0]);
        });
    } catch (error) {
      console.log("123qqq2222");
      console.log("Bookings Error=====", error.message);
    }
  };

  // const handleOpen = (row, i) => {
  //   console.log("data i >", data[i]);
  //   dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.BookingID }));
  //   getRooms(i);
  //   setOpen(!open);
  // };

  useEffect(() => {
    try {
      const bookingsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        // CheckInDate: checkInDate,
        Event: "chart",
        // CheckOutDate: checkInDateP
      };
      axios
        .post(`getdata/bookingdata/dashboardchart`, bookingsBody)
        .then((response) => {
          console.log("res111", response?.data[0]);
          if (response.status === 200) {
            // console.log(
            //   "express Bookings room chart response",
            //   response?.data[0]
            // );
            setData(response?.data[0]);
            // console.log("res", response);
          }
        })
        .catch(function (error) {
          console.log("Bookings Error=====", error?.response?.data?.Message);
        });
    } catch (error) {
      console.log("Bookings Error=====", error);
      toast.error("Something went wrong, Try again!");
    }
    if (data == []) {
      setRefresh(true);
    }
  }, [refresh]);

  const columns = [
    {
      center: true,
      width: "80px",
      sortable: (row) => row.guestName,
      cell: (row, i) => (
        <div
          className="d-flex align-items-center cursor-pointer "
          onClick={() => {
            setSel_bookingID(row.bookingID);
            setBookingStatus(row.status);
            console.warn("gengarBookingId", row.bookingID);
            dispatch(
              storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }),
            );
            if (row.Status === "OnHold") {
              handleOnHoldOpne();
            } else handleOpen();
          }}
        >
          {/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
          {/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}

          <Badge
            className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
            // className="text-align-center"
            title="Click to Manage Booking"
            color="success"
            //  icon={<User color='#FFFFFF' size={25} />}
            //  color={
            //    row.Status === 'Active' && row.CheckIn ? (
            //      'success'
            //    ) : row.Status === 'Checkout' ? (
            //      'primary'
            //    ) : row.Status === 'Cancelled' ? (
            //      'danger'
            //    ) : row.Status === 'Active' && row.CheckIn === false ? (
            //      'warning'
            //    ) : row.Status === 'OnHold' ? (
            //      'info'
            //    ) : '#000'
            //  }
          >
            {" "}
            Create
            <br />
            Check-in
          </Badge>
        </div>
      ),
    },
    {
      name: "Booking Status",
      minWidth: "12rem",
      center: true,
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.status === "CheckedIN" ? (
              <Badge color="success">Checked In</Badge>
            ) : row.status === "CheckedOut" ? (
              <Badge color="primary">{row.status}</Badge>
            ) : row.status === "Cancelled" ? (
              <Badge color="danger"> {row.status}</Badge>
            ) : row.status === "Reserved" && row.CheckIn === false ? (
              <Badge color="light-warning">Reserved</Badge>
            ) : row.status === "OnHold" ? (
              <Badge color="light-info">{row.status}</Badge>
            ) : (
              <Badge color="light-secondary">{row.status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Booking ID",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.bookingID,
    },

    {
      name: "Guest Name",
      sortable: true,
      center: true,
      minWidth: "150px",
      selector: (row) => (
        <>
          <p>{row.guestName}</p>
          <p>{row.guestMobileNumber}</p>
        </>
      ),
    },
    {
      name: "Check-In",
      center: true,
      wrap: true,
      sortable: true,
      minWidth: "130px",
      selector: (row) => (
        <>
          <p>{moment(row.checkInDate).format("LL")}</p>
        </>
      ),
    },
  ];

  const columns1 = [
    {
      center: true,
      width: "80px",
      sortable: (row) => row.guestName,
      cell: (row, i) => (
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={() => {
            setSel_bookingID(row.bookingID);
            setBookingStatus(row.status);
            console.warn("gengarBookingId", row.bookingID);
            dispatch(
              storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }),
            );
            if (row.status === "OnHold") {
              handleOnHoldOpne();
            } else handleOpen();
          }}
        >
          <Badge
            className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
            title="Click to Manage Booking"
            color="primary"
          >
            Create <br />
            Check-Out
          </Badge>
        </div>
      ),
    },
    {
      name: "Booking Status",
      minWidth: "12rem",
      center: true,
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.status === "CheckedIN" ? (
              <Badge color="success">Checked In</Badge>
            ) : row.status === "CheckedOut" ? (
              <Badge color="primary">{row.status}</Badge>
            ) : row.status === "Cancelled" ? (
              <Badge color="danger"> {row.status}</Badge>
            ) : row.status === "Reserved" && row.checkIn === false ? (
              <Badge color="light-warning">Reserved</Badge>
            ) : row.status === "OnHold" ? (
              <Badge color="light-info">{row.status}</Badge>
            ) : (
              <Badge color="light-secondary">{row.status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Booking ID",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.bookingID,
    },
    {
      name: "Guest Name",
      sortable: true,
      center: true,
      minWidth: "150px",
      selector: (row) => (
        <>
          <p>{row.guestName}</p>
          <p>{row.guestMobileNumber}</p>
        </>
      ),
    },
    {
      name: "Check-Out",
      center: true,
      wrap: true,
      sortable: true,
      minWidth: "130px",
      selector: (row) => (
        <>
          <p>{moment(row.checkOutDate).format("LL")}</p>
        </>
      ),
    },
  ];
  const remainingColumns = [
    // console.log('row', row),
    {
      center: true,
      width: "80px",
      sortable: (row) => row.guestName,
      cell: (row, i) => (
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={() => {
            setSel_bookingID(row.bookingID);
            setBookingStatus(row.status);
            console.warn("gengarBookingId", row.bookingID);
            dispatch(
              storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }),
            );
            if (row.status === "OnHold") {
              handleOnHoldOpne();
            } else handleOpen();
          }}
        >
          <Badge
            className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
            title="Click to Manage Booking"
            color="primary"
          >
            Create <br />
            Check-Out
          </Badge>
        </div>
      ),
    },
    {
      name: "Booking Status",
      minWidth: "12rem",
      center: true,
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.status === "CheckedIN" ? (
              <Badge color="success">Checked In</Badge>
            ) : row.status === "CheckedOut" ? (
              <Badge color="primary">{row.status}</Badge>
            ) : row.Status === "Cancelled" ? (
              <Badge color="danger"> {row.status}</Badge>
            ) : row.status === "Reserved" && row.checkIn === false ? (
              <Badge color="light-warning">Reserved</Badge>
            ) : row.status === "OnHold" ? (
              <Badge color="light-info">{row.status}</Badge>
            ) : (
              <Badge color="light-secondary">{row.status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Booking ID",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.bookingID,
    },
    {
      name: "Guest Name",
      sortable: true,
      center: true,
      minWidth: "150px",
      selector: (row) => (
        <>
          <p>{row.guestName}</p>
          <p>{row.guestMobileNumber}</p>
        </>
      ),
    },
    {
      name: "Check-Out",
      center: true,
      wrap: true,
      sortable: true,
      minWidth: "130px",
      selector: (row) => (
        <>
          <p>{moment(row.checkOutDate).format("LL")}</p>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (PropertyID === null) {
      handleHotelSelectOpen();
    }
  }, []);

  const dataFilterOption = [
    // {value:"Today",label:"Today"},
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Qurterly", label: "Qurterly" },
    { value: "Yearly", label: "Yearly" },
  ];

  const dashboardCardStyles = {
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  // console.log('dailyNumData', dailyNumData[8], remaining, cardData[0]);
  return (
    <div className="dash_main">
      <Row>
        <div className="col-lg-4 col-sm-6">
          <div
            className="card card-border-shadow-primary h-100 "
            style={dashboardCardStyles}
            onClick={() => navigate("/products")}
          >
            <div className="box card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="me-4">
                  <span className="rounded bg-label-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-packages text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
                      <path d="M2 13.5v5.5l5 3" />
                      <path d="M7 16.545l5 -3.03" />
                      <path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
                      <path d="M12 19l5 3" />
                      <path d="M17 16.5l5 -3" />
                      <path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" />
                      <path d="M7 5.03v5.455" />
                      <path d="M12 8l5 -3" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">42</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Total Products</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">+18.2%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-6">
          <div
            className="card card-border-shadow-warning h-100"
            style={dashboardCardStyles}
            onClick={() => navigate("/plans")}
          >
            <div className=" card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="me-4">
                  <span className="rounded bg-label-warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-credit-card text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" />
                      <path d="M3 10l18 0" />
                      <path d="M7 15l.01 0" />
                      <path d="M11 15l2 0" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">8</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Total Plans</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">-8.7%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-6">
          <div
            className="card card-border-shadow-danger h-100"
            style={dashboardCardStyles}
            onClick={() => navigate("/addClient")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="me-4">
                  <span className="rounded bg-label-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-users text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">27</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Total Clients</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">+4.3%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>

        {/* <Col lg="4" xs="12" sm="4" md="6" xl="4">
          <div className="earnings-card top-card">
            <CardDetail
              id="1"
              title="Revenue"
              // dataArr={dailyNumData[0]}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M136,32V216H40V85.35a8,8,0,0,1,3.56-6.66l80-53.33A8,8,0,0,1,136,32Z"
                    opacity="0.2"
                  ></path>
                  <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"></path>
                </svg>
              }
              amount={
                cardData && cardData[0]?.todaysBookings
                  ? cardData[0]?.todaysBookings
                  : "111"
              }
            />
          </div>
        </Col> */}
      </Row>
      <Row>
        <div className="col-lg-4 col-sm-6 mt-4">
          <div
            className="card card-border-shadow-info h-100"
            style={dashboardCardStyles}
            onClick={() => navigate("/allSubscription")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className=" me-4">
                  <span className=" rounded bg-label-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-refresh text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">13</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Total Subscription</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">-2.5%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 mt-4">
          <div
            className="card card-border-shadow-info h-100"
            style={dashboardCardStyles}
            onClick={() => navigate("/addClient")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="me-4">
                  <span className="rounded bg-label-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-user-check text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                      <path d="M15 19l2 2l4 -4" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">0</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Active Client</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">-2.5%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 mt-4">
          <div
            className="card card-border-shadow-info h-100"
            style={dashboardCardStyles}
            onClick={() => navigate("/revenueReport")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="me-4">
                  <span className="rounded bg-label-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-currency-rupee text-primary"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 5h-11h3a4 4 0 0 1 0 8h-3l6 6" />
                      <path d="M7 9l11 0" />
                    </svg>
                  </span>
                </div>
                <h4 className="mb-0 fs-1 fw-bolder">0</h4>
              </div>
              <p className="mb-1 fs-3 fw-bold">Revenue</p>
              <p className="mb-0">
                <span className="text-heading fw-medium me-2 fs-5">-2.5%</span>
                <small className="text-body-secondary fs-5">
                  than last week
                </small>
              </p>
            </div>
          </div>
        </div>
      </Row>

      <Modal
        className="NewRemainingcount-modal"
        isOpen={isNewModalOpen}
        toggle={toggleNewModal}
      >
        <ModalHeader
          className="bg-transparent border-bottom"
          toggle={() => setIsNewModalOpen(!isNewModalOpen)}
        >
          <div className="BookingsDetails">
            <p>All Bookings Details</p>

            <div className="ms-auto mr-0" style={{ minWidth: 200 }}>
              {/* <Label className='form-check-label'>Filter</Label> */}
              <Select
                className="react-select"
                classNamePrefix="select"
                placeholder="Filter"
                options={dataFilterOption}
              />
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <DataTable
            noHeader
            columns={remainingColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            data={remaining}
          />
        </ModalBody>
        <div
          style={{ paddingRight: "9px" }}
          className="my-50 d-flex justify-content-end"
        >
          <Button
            color="primary"
            onClick={(e) => {
              setIsNewModalOpen(!isNewModalOpen);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* <HotelSelectModal
				open1={hotelSelectOpen}
				handleOpen1={handleHotelSelectOpen} /> */}
      {open && (
        <AddHotel
          open={open}
          handleOpen={handleOpen}
          bookingID={sel_bookingID}
          bookingStatus={bookingStatus}
        />
      )}
      {onHoldOpen && (
        <OnHoldQuickBookingModal
          open={onHoldOpen}
          handleOnHoldOpen={handleOnHoldOpne}
          bookingID={sel_bookingID}
        />
      )}
    </div>
  );
};

export default DashBoard;
