import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import logo from "@src/assets/images/logo/hostynnist-logo.png";
import { useSkin } from "@hooks/useSkin";
import { Badge, Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import RazorPay from "../../../utility/Razorpay/RazorPay";
import axios from "../../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { CheckCircle } from "react-feather";

function PaymentGateWay() {
  // const getUserData = useSelector((state) => state.userManageSlice.userData);
  // const { LoginID, Token,  } = getUserData;
  const [searchParams] = useSearchParams();
  const lnk = searchParams.get("lnk");
  const token = searchParams.get("xn");
  const login = searchParams.get("lid");

  // console.log("lnk", lnk);
  // console.log("lnk", login);
  // console.log("lnk", token);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAmt, setGuestAmt] = useState("");
  const [guestBookId, setGuestBookId] = useState("");
  const [guestDate, setGuestDate] = useState("");
  const [hotelNa, setHotelNa] = useState("");
  const [hotelLogo, setHotelLogo] = useState("");
  const [payDate, setPayDate] = useState("");
  const [RazorModal, setRazorModal] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("already");
  const [paymentFid,setPaymentFid]=useState('');

  const getPaymentData = async () => {
    try {
      const res = await axios.get(`/paymentlink/get/${lnk}`, {
        headers: {
          LoginID: login,
          Token: token,
        },
      });
      console.log("res", res);
      setGuestName(res?.data[0][0].GuestName);
      setGuestEmail(res?.data[0][0].GuestEmail);
      setGuestAmt(res?.data[0][0].PaymentAmount);
      setGuestBookId(res?.data[0][0].BookingID);
      setGuestDate(res?.data[0][0].BookingTime);
      setPayDate(res?.data[0][0].PaymentDate);
      setHotelNa(res?.data[0][0].HotelName);
      setHotelLogo(res?.data[0][0].Logo);
      setPaymentFid(res?.data[0][0].PaymentFolioID);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getPaymentData();
    setRazorModal(); //Razor PAy Modal
  }, []);

  const { skin } = useSkin();
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`);

  return (
    <>
      <div className="p-4">
        <div className="row">
          <Col className="px-xl-2 mx-auto">
            <Row>
              <Col>
                <Link
                  className="brand-logo d-flex"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    className="fallback-logo"
                    height={28}
                    width={30}
                    src={logo}
                    alt="logo"
                  />
                  <h1 className="brand-text" style={{ color: "#7B68EE" }}>
                    Hostynnist
                  </h1>
                </Link>
              </Col>
            </Row>
            <Row>
              <Col lg="6" md="6">
                <div>
                  <img className="img-fluid" src={source} alt="Login Cover" />
                </div>
              </Col>

{/* {console.log('paydate',payDate)} */}


              {payDate === null  ? (
                <Col lg="6" md="6" className="my-4">
                  <Card>
                    <CardTitle className="p-2">
                      <span style={{ color: "#7B68EE" }}>{hotelNa}</span>
                    </CardTitle>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="d-flex align-items-baseline">
                            <h5>Guest Name :</h5>
                            <span className="px-1">{guestName}</span>
                          </div>
                          <div className="d-flex align-items-baseline">
                            <h5>Booking Id :</h5>
                            <span className="px-1">{guestBookId}</span>
                          </div>
                          <div className="d-flex align-items-baseline">
                            <h5>Amount :</h5>
                            <span className="px-1" id="amtt">
                              {guestAmt} /-
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex align-items-baseline">
                            <h5>Booking Date :</h5>
                            <span className="px-1">
                              {moment(guestDate).format("LL")}
                            </span>
                          </div>
                          <div className="d-flex align-items-baseline">
                            <h5>Guest Email :</h5>
                            <span className="px-1">{guestEmail}</span>
                          </div>
                        </div>
                      </div>
                      <div className="py-3 text-center">
                        <RazorPay
                          buttName="Try Again "
                          amountPy={guestAmt}
                          hotelNa={hotelNa}
                          logo={hotelLogo}
                          sendData={RazorModal}
                          setMessage={setMessage}
                          getPaymentData={getPaymentData}
                          paymentFid={paymentFid}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ) : (
                <Col lg="6" md="6" className="my-4 justify-content-center">
                  <Card className="p-5">
                    
                      <h1>
                        Payment is {message} Done
                        <span className="">
                          <CheckCircle size={50} color="green" />
                        </span>
                      </h1>
                   
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        </div>
      </div>
    </>
  );
}

export default PaymentGateWay;
