import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { Check, CheckSquare, ChevronDown, Edit, XSquare } from "react-feather";
import PaymentTable from "./PaymentTable";
import RoomTransfer from "./RoomTransferAcc/RoomTransfer";
import ExtendDeparture from "./ExtendDeparture";
import axios from "../../API/axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CheckInBooker from "./CheckINAcc/CheckInBooker";
import AddExtraService from "./ExtraServiceAcc/AddExtraService";
import PaymentsFolio from "./PaymentsFolioAcc/PaymentsFolio";
import CheckoutAcc from "./CheckoutAcc/CheckoutAcc";
import { store } from "@store/store";
import {
  storeBookingDetails,
  storeInvoiceDetails,
} from "../../redux/voucherSlice";
import { setRefresh, setCloseModals } from "../../redux/quickBookingSlice";
import { useSearchParams } from "react-router-dom";
import WebCheckIn from "../WebCheckIn/WebCheckIn";

const BookingModal = ({
  open,
  handleOpen,
  bookingID,
  roomData,
  handleModalOpen,
  bookingStatus
}) => {
  const dispatch = useDispatch();
console.log("BookingID==>",roomData)
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, HotelName, PropertyID } = getUserData;

  const obj = {
    LoginID,
    Token,
    bookingID,
  };
  
  useEffect(() => {
  dispatch(storeInvoiceDetails(obj));
  dispatch(storeBookingDetails({ LoginID, Token, BookingId: bookingID }));
  },[open,bookingID]);

  const [roomList, setRoomList] = useState([]);

  const [guest_details, setGuest_details] = useState([]);
  const [booking_details, setBooking_details] = useState([]);
  const [payment_details, setPayment_details] = useState([]);
console.log("booking_details",booking_details)
  const [isEdit, setIsEdit] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  //State & function to update assigned room values in Checkin Accordian
  const [roomAssigned, setRoomAssigned] = useState(false);
  const handleRoomAssigned = () => setRoomAssigned(!roomAssigned);

  const [roomTransfer, setRoomTransfer] = useState(false);
  const handleRoomTransfer = () => setRoomTransfer(!roomTransfer);

  const [extendDepart, setExtendDepart] = useState(false);
  const handleExtendDepart = () => setExtendDepart(!extendDepart);

  const [extraService, setExtraService] = useState(false);
  const handleExtraService = () => setExtraService(!extraService);

  const [pfolio, setPfolio] = useState(false);
  const handlePfolio = () => setPfolio(!pfolio);


  console.log('bookingStatus', bookingStatus);

  const getBookingInfo = () => {
    if (bookingID || roomData?.roomAllocationID) {
      console.log("RoomAllocationID", roomData?.roomAllocationID);
      console.log("bookingID", bookingID);
      try {
        const bookingsBody = {
          LoginID,
          Token,
          Seckey: "abc",
          RoomAllocationID:bookingID.length === 0 ? roomData?.roomAllocationID : bookingID,
          Event: "selectall",
        };
        axios
          .post(`/getdata/bookingdata/allocateroomnumber`, bookingsBody) // TODO - Why
          .then((response) => {
            console.log("allocateroomnumber response", response?.data[0]);
            setRoomList(response?.data[0]);
          });
      } catch (error) {
        console.log("Bookings Error=====", error.message);
      }
    }
    if (bookingID) {
      try {
        const bookingsBody = {
          LoginID: LoginID,
          Token: Token,
          Seckey: "abc",
          BookingID: bookingID,
          RoomAllocationID:bookingID.length === 0 ? roomData?.roomAllocationID : bookingID,
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
  }


  useEffect(() => {
  if (open) {
    getBookingInfo();
  }

  return () => {
    store.dispatch(setRefresh());
    handleModalOpen && handleModalOpen();
  };
}, [open]);

  // useEffect(() => {
  //   getBookingInfo()
  //   return () => {
  //     store.dispatch(setRefresh());
  //     handleModalOpen && handleModalOpen();
  //   };
  // }, [
  //   open,
  //   bookingID,
  //   roomData,
  //   isEdit,
  //   roomAssigned,
  //   roomTransfer,
  //   extendDepart,
  //   extraService,
  //   pfolio,
  // ]);

  const [accopen, setAccopen] = useState("");
  // const toggleAcc = (id) => {
  //   accopen === id ? setAccopen() : setAccopen(id);
  // };
const toggleAcc = (id) => {
  if (accopen !== id) {
    setAccopen(id);
    handleAccordionApi(id);   // <-- trigger API conditionally
  } else {
    setAccopen();
  }
};

  const openLinkInNewTab = (url) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    if (newTab) newTab.opener = null;
  };

  const GuestInfoForm = ({ details }) => {
    const [editGuestID] = useState(details[0]?.guestID);
    const [editGuestName, setEditGuestName] = useState(details[0]?.guestName);
    const [editGuestEmail, setEditGuestEmail] = useState(
      details[0]?.guestEmail
    );
    const [editGuestMobile, setEditGuestMobile] = useState(
      details[0]?.guestMobileNumber
    );
    const [editGuestCity, setEditGuestCity] = useState(details[0]?.cityName);
    const [editGuestState, setEditGuestState] = useState(details[0]?.stateName);
    const [editGuestCountry, setEditGuestCountry] = useState(
      details[0]?.countryName
    );
    const [editGuestNote, setEditGuestNote] = useState(details[0]?.specialNote);

    const handleEdit = () => {
      setIsEdit(true);
      if (
        editGuestID &&
        editGuestName &&
        editGuestEmail &&
        editGuestMobile !== ""
      ) {
        let obj = {
          LoginID,
          Token,
          Seckey: "abc",
          GuestID: editGuestID,
          Name: editGuestName,
          Email: editGuestEmail,
          MobileNumber: editGuestMobile,
          SpecialNote: editGuestNote,
        };
        try {
          axios.post(`/booking/GuestUpdate/${editGuestID}`, obj).then((res) => {
            res.status === 200
              ? toast.success("Guest Info Updated!")
              : toast.error("Something went Wrong!");
            setIsEdit(false);
          });
        } catch (error) {
          setIsEdit(false);
          console.log(error.response);
          toast.error(error.response);
        }
      } else {
        toast.error("Highlighted values cannot be blank!", {
          position: "top-center",
        });
      }
    };


    return (
      <>
        <Card>
          <CardHeader className="d-flex justify-content-center">
            <CardTitle>Guest Information</CardTitle>
            {/* {isEdit === false ? (
              <Edit className="mx-1" onClick={() => setIsEdit(true)} />
            ) : null}
            {isEdit ? (
              <>
                <CheckSquare
                  color="green"
                  className="mx-1"
                  onClick={() => handleEdit()}
                />
                <XSquare
                  color="red"
                  className="mx-1"
                  onClick={() => setIsEdit(false)}
                />
              </>
            ) : null} */}
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
                      value={editGuestName}
                      disabled={isEdit === false}
                      invalid={isEdit && editGuestName === ""}
                      onChange={(e) => setEditGuestName(e.target.value)}
                    />
                  </Col>
                  {isEdit && editGuestName === "" && (
                    <FormFeedback>Guest Name cannot be blank</FormFeedback>
                  )}
                </Col>
                <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                  <Col>
                    <h5 className="mb-0">Guest Email:</h5>
                  </Col>
                  <Col>
                    <Input
                      type="email"
                      value={editGuestEmail}
                      disabled={isEdit === false}
                      invalid={isEdit && editGuestEmail === ""}
                      onChange={(e) => setEditGuestEmail(e.target.value)}
                    />
                  </Col>
                  {isEdit && editGuestEmail === "" && (
                    <FormFeedback>Guest Email cannot be blank</FormFeedback>
                  )}
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
                      value={editGuestMobile}
                      disabled={isEdit === false}
                      invalid={isEdit && editGuestMobile === ""}
                      onChange={(e) => setEditGuestMobile(e.target.value)}
                    />
                  </Col>
                  {isEdit && editGuestMobile === "" && (
                    <FormFeedback>Guest Mobile cannot be blank</FormFeedback>
                  )}
                </Col>
                <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                  <Col>
                    <h5 className="mb-0">Guest City:</h5>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      value={editGuestCity}
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
                      value={editGuestState}
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
                      value={editGuestCountry}
                      disabled
                    // disabled={isEdit === false}
                    />
                  </Col>
                </Col>
                <Col className="mb-1 d-flex flex-row justify-content-between align-items-center">
                  <Col>
                    <h5 className="mb-0">Note:</h5>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      value={editGuestNote}
                      disabled={isEdit === false}
                      onChange={(e) => setEditGuestNote(e.target.value)}
                    />
                  </Col>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </>
    );
  };

  const handleCancelBooking = async (id) => {
    try {
      const cancelObj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        BookingID: id,
      };
      const res = await axios.post(`/setdata/cancelbooking`, cancelObj);
      console.log("cancelres", res);
      if (res.data[0][0].status === "Success") {
        handleOpen();
        toast.success(`${id} - booking is cancelled!`);
        handleCancelOpen();
      }
    } catch (err) {
      console.log("cancelerr", err);
      toast.error(err.response);
      handleCancelOpen();
    }
  };

  const CancelModal = ({ id, open, handleCancelOpen }) => {

    return (
      <>
        <Modal
          isOpen={open}
          toggle={handleCancelOpen}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
            Cancel Booking of - {id}
          </ModalHeader>
          <ModalBody>
            <h3 className="text-center">
              Are you sure you want to cancel this booking?
            </h3>
            <Col className="text-center">
              <Button
                className="m-1"
                color="danger"
                onClick={() => handleCancelBooking(id)}
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
      </>
    );
  };

  //   const [searchParams]=useSearchParams();
  //   const loginID= searchParams.get("ln")
  //   console.log("loginID",loginID);
  //   const token=searchParams.get("x2")
  //   console.log("token",token);
  // //   const bookingID1 = searchParams.get("bk")

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const WebCheckIn = async () => {
    const details = {
      "url": window.location.origin,
      "BookingID": bookingID,
      "PropertyID": PropertyID,
    }
    console.log("detals", details);
    try {

      setButtonDisabled(true); // Disable the button


      const res = await axios.post('/webcheckin/new', details, {
        headers: {
          LoginID,
          Token,
        }
      });

      toast.success("Email Sent Successfully");
      console.log("result", res);

    } catch (error) {
      setButtonDisabled(false); // Enable the button
      console.log(error.message);
      console.log(error);
    }
  };
  return (
    <>
      {console.log("guest_details", guest_details)}
      {console.log("payment_details", booking_details[0]?.status)}
      <Modal
        isOpen={open}
        toggle={handleOpen}
        className="modal-dialog-centered modal-xl"
        backdrop={false}
      >
        <ModalHeader
          className="bg-transparent text-center"
          toggle={handleOpen}
        ></ModalHeader>
        <ModalBody>
          <Col className="text-center mb-2 mt-0">
            <Label className="mx-1 text-nowrap">
              <span className="fw-light fs-4">Booking ID </span>
              <Input
                className="text-center"
                type="text"
                value={booking_details[0]?.bookingID}
                disabled
              />
            </Label>
            <Label className="mx-1 text-nowrap">
              <span className="fw-light fs-4">Booking Date</span>{" "}
              <Input
                className="text-center"
                type="text"
                value={moment(booking_details[0]?.bookingTime).format(
                  "DD-MM-YYYY"
                )}
                disabled
              />
            </Label>
            <Label className="mx-1 text-nowrap">
              <span className="fw-light fs-4">Booking Time</span>{" "}
              <Input
                className="text-center"
                type="text"
                value={moment(booking_details[0]?.bookingTime).format("LT")}
                disabled
              />
            </Label>
          </Col>
          <Row className="d-flex flex-lg-row flex-column">
            <Col>
              <GuestInfoForm details={guest_details} />
            </Col>
            <Col>
              <Card>
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
                          value={booking_details[0]?.bookingSource}
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
                          value={booking_details[0]?.bookingID}
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
                          value={moment(booking_details[0]?.checkInDate).format(
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
                            booking_details[0]?.checkOutDate
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
                          value={booking_details[0]?.roomCount}
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
                          value={booking_details[0]?.totalGuest}
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
                          value={booking_details[0]?.status}
                          disabled
                        />
                      </Col>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
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
                          value={`₹ ${payment_details[0]?.bookingCommission}`}
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
                          value={`₹ ${payment_details[0]?.bookingAmount}`}
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
                          value={`₹ ${payment_details[0]?.posOrder}`}
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
                          value={`₹ ${payment_details[0]?.extraAmount}`}
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
                          value={`₹ ${payment_details[0]?.totalAmount}`}
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
                          value={`₹ ${payment_details[0]?.recievedAmount}`}
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
                          value={`₹ ${payment_details[0]?.pendingAmount}`}
                          disabled
                        />
                      </Col>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex flex-row flex-wrap justify-content-around align-items-center">
              <Button
                className="m-1"
                color="danger"
                onClick={() => handleCancelOpen()}
              >
                Cancel Booking
              </Button>
              {/* <Button className='m-1' color='success' onClick={() => openLinkInNewTab('/preview2')} >
                                Test Invoice
                            </Button> */}
              <Button
                className="m-1"
                color="success"
                onClick={() => openLinkInNewTab("/invoice1")}
              >
                View / Download{" "}
                {booking_details[0]?.status === "Checkout" ? null : ""}{" "}
                Invoice
              </Button>
              <Button
                className="m-1"
                color="primary"
                onClick={() => openLinkInNewTab("/voucher1")}
              >
                View / Download Voucher
              </Button>
              <Button
                className="m-1"
                color="info"
                onClick={() => WebCheckIn()}
                disabled={booking_details[0]?.status !== "Reserved" || buttonDisabled}
              >
                Send Web CheckIn Link
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="mt-1">
              <Accordion
                className="accordion-margin"
                open={accopen}
                toggle={toggleAcc}
              >
                {bookingStatus === 'Cancelled' ? '' : <AccordionItem>
                  <AccordionHeader targetId="1">Check In</AccordionHeader>
                  <AccordionBody accordionId="1">
                    <Row>
                      <Col>
                        <CheckInBooker
                          bookingID={bookingID}
                          roomAllocationID={roomList[0]?.roomAllocationID}
                          roomList={roomList}
                          handleRoomAssigned={handleRoomAssigned}
                          bookingDetail={booking_details}
                        />
                      </Col>
                    </Row>
                  </AccordionBody>
                </AccordionItem>}

                <AccordionItem>
                  <AccordionHeader targetId="2">Room Transfer</AccordionHeader>
                  <AccordionBody accordionId="2">
                    <RoomTransfer
                      roomList={roomList}
                      checkOutDate={booking_details[0]?.checkOutDate}
                      checkInDate={booking_details[0]?.checkInDate}
                      handleRoomTransfer={handleRoomTransfer}
                    />
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="3">
                    Extend Departure
                  </AccordionHeader>
                  <AccordionBody accordionId="3">
                    <ExtendDeparture
                      roomList={roomList}
                      bookingID={bookingID}
                      BookingDetails={booking_details}
                      guest_details={guest_details}
                      handleExtendDepart={handleExtendDepart}
                    />
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="4">Extra Service</AccordionHeader>
                  <AccordionBody accordionId="4">
                    <AddExtraService
                      bookingID={bookingID}
                      roomList={roomList}
                      handleExtraService={handleExtraService}
                      getBookingInfo={getBookingInfo}
                    />
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="5">Payments Folio</AccordionHeader>
                  <AccordionBody accordionId="5">
                    <PaymentsFolio
                      bookingID={bookingID}
                      BookingDetails={booking_details}
                      handlePfolio={handlePfolio}
                    />
                  </AccordionBody>
                </AccordionItem>
                {bookingStatus === 'CheckedIN' ? <AccordionItem>
                  <AccordionHeader targetId="6">
                    Create Check Out
                  </AccordionHeader>
                  <AccordionBody accordionId="6">
                    <CheckoutAcc
                      bookingID={bookingID}
                      BookingDetails={booking_details}
                      payment_details={payment_details}
                      handleOpen={handleOpen}
                    />
                  </AccordionBody>
                </AccordionItem> : ''}

              </Accordion>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {open ? <div className="modal-backdrop fade show"></div> : null}
      {cancelOpen ? (
        <CancelModal
          open={cancelOpen}
          id={bookingID}
          handleCancelOpen={handleCancelOpen}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default BookingModal;
