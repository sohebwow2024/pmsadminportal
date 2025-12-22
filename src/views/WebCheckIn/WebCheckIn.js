import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@src/assets/images/logo/hostynnist-logo.png";
import { useSkin } from "@hooks/useSkin";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Image_base_uri } from "../../API/axios";

const idProof = [
  { value: "", label: "Select Id Proof" },
  { value: "passport", label: "Passport" },
  { value: "aadharCard", label: "Aadhaar Card" },
  { value: "panCard", label: "Pan Card" },
  { value: "drivingLicense", label: "Driving License" },
];

const WebCheckIn = () => {
  const [searchParams] = useSearchParams();
  const loginID = searchParams.get("ln");
  console.log("loginID", loginID);
  const token = searchParams.get("x2");
  console.log("token", token);
  const bookingID = searchParams.get("bk");
  console.log("BookingID", bookingID);
  const [show, setShow] = useState(false);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [comingFrom, setComing] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [doc, setDoc] = useState("");
  const [nameOnDoc, setNameOnDoc] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [docImage, setDocImage] = useState("");
  const [CheckIn, setCheckIn] = useState([]);
  const [roomAllocationID, setRoomAllocationID] = useState("");
  const [checkinError, setCheckinError] = useState(true);
  const [checkinCreated, setCheckinCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const [message, setMessage] = useState(" ");
  console.log("chckin", docImage);

  const reset = () => {
    setArrival(""),
      setDeparture(""),
      setGoingTo(""),
      setIdNumber(""),
      setNameOnDoc(""),
      setComing(""),
      setDoc(""),
      setDocImage("");
  };

  const getData = async () => {
    try {
      const res = await axios.get(`/webcheckin/get/${bookingID}`, {
        headers: {
          LoginID: loginID,
          Token: token,
        },
      });
      console.log("res", res);

      const result = res.data[0];
      console.log("result", result);
      setCheckIn(result[0]);
      if (result.length === 0) {
        setCheckinError(true);
        setErrorMessage("ERROR: Invalid Access Details");
        setMessage("");
      } else if (result[0].checkinCreated) {
        setCheckinCreated(true);
        setCheckinError(false);
        setMessage("Check-in is Already Created");
        setErrorMessage("");
      } else {
        setCheckinError(false);
        setErrorMessage("");
      }
      // if (res.data[0][0]) {

      //   // Set Error Flag
      // // Set Error Message = Thank You : Check-in Already Created
      // }else{

      //   setCheckIn(false);
      // }
      // console.log("result", result)
      // if(result.status === 200) {

      // }
      // Check CheckinCreated = true
      // if(checkin === true) {

      // }

    } catch (error) {
      console.log(error.message);
      console.log(error);
      setCheckinError(true);
      setErrorMessage(error.response.data.message);
      // Set Error Flag
      // Set Error Message > ERROR : {message}
    }
  };

  const details = {
    arrival,
    departure,
    // comingFrom,
    // goingTo,
    doc,
    nameOnDoc,
    idNumber,
    docImage,
    bookingID,
    roomAllocationID,
  };
  console.log("details", details);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShow(true);

    const formData = new FormData()
      formData.append("ArrivalDateAndTime", arrival),
      formData.append("ExpectedDateAndTime", departure),
      formData.append("ComingFrom", comingFrom),
      formData.append("GoingTo", goingTo),
      formData.append("IDProofType", doc),
      formData.append("NameAsPerIDProof", nameOnDoc),
      formData.append("IDProofNumber", idNumber),
      formData.append("file", docImage),
      formData.append("RoomAllocationID", CheckIn.roomAllocationID),
      formData.append("BookingID", CheckIn.bookingID)
    console.log("formData", formData);

    if (details !== "") {
      try {
        const res = await axios.post("/webcheckin/checkin", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            LoginID: loginID,
            Token: token,
          },
        });
        console.log("res", res);
        if (res.data[0][0].status === "Success") {
          toast.success("Check-in created successfully", {
            position: "top-center",
          });
          setCheckinCreated(true);
          setMessage("Check-in details submitted successfully.");
          reset();
        }
      } catch (error) {
        console.log("error", error);
      }
    } else toast.error("Fill all details")
  };

  useEffect(() => {
    getData();
  }, []);

  const { skin } = useSkin();
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`);

  return (
    <>
      <div className="p-5">
        <div className="row">
          <Col className="px-xl-2 mx-auto" md="6" lg="6" sm="6">
            <Row>
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
            </Row>
            {/* <Row>
              <Col className="d-flex col">
                <Label className="fw-bold fs-6">Web Check-in for...</Label>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex">
                <h4 className="brand-text" style={{ color: "#7B68EE" }}>
                  {CheckIn?.HotelName}
                </h4>
              </Col>
            </Row> */}
            <Row>
              <Col>
                <div>
                  <img className="img-fluid" src={source} alt="Login Cover" />
                </div>
              </Col>
            </Row>
          </Col>

          {checkinError ? (
            <Card className="py-2 col-md-6">
              <CardHeader className=" m-2">
                <CardTitle className="w-100 d-flex justify-content-center align-items-center" style={{ marginTop: "15%" }}>
                  <Col className="d-flex flex-column align-items-center">
                    <Label className="fw-bold fs-2 text-danger">ERROR!</Label>
                    <Label className="fw-bold fs-4">{errorMessage}</Label>
                  </Col>
                </CardTitle>
              </CardHeader>
            </Card>
          ) : checkinCreated ? (
            <Card className="py-2 col-md-6 d-flex align-items-center my-3 my-md-0">
              <CardHeader className="m-2">
                <CardTitle style={{ marginTop: "15%" }}>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Label className="fw-bold fs-1 text-success">{message}!</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex">
                      <Label className="fw-bold fs-4">
                        <span className="fw-light">Thank you for your business with</span>
                        <b style={{ color: "#7B68EE" }}> {CheckIn.hotelName}</b>.
                      </Label>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <Card className=" py-2 col-md-6">
              <Row className="ms-1">
                {/* <Col className="d-flex col">
                  <Label className="fw-bold fs-6">Web Check-in for...</Label>
                </Col> */}
                <Col className="d-flex">
                  <h4 className="brand-text" style={{ color: "#7B68EE" }}>
                    {CheckIn?.hotelName}
                  </h4>
                </Col>
              </Row>
              <CardHeader>
                <Alert color="primary" className="d-flex justify-content-between p-2" style={{ width: "100%" }}>
                  <CardTitle>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">Booking ID :</Label>
                        <Label className="ms-1 fs-5">{CheckIn.bookingID}</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">CheckIn Date :</Label>
                        <Label className="ms-1 fs-5">{CheckIn.checkInDate}</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">CheckOut Date :</Label>
                        <Label className="ms-1 fs-5">{CheckIn.checkOutDate}</Label>
                      </Col>
                    </Row>
                  </CardTitle>
                  <CardTitle>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">Name : </Label>
                        <Label className="ms-1 fs-5">{CheckIn.guestName}</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">Email : </Label>
                        <Label className="ms-1 fs-5">{CheckIn.guestEmail}</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-sm-flex">
                        <Label className="fw-light fs-6">Mobile No : </Label>
                        <Label className="ms-1 fs-5">
                          {CheckIn.guestMobileNumber}
                        </Label>
                      </Col>
                    </Row>
                  </CardTitle>
                </Alert>
              </CardHeader>
              <CardBody className="mt-1">
                <Form>
                  <Row>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Expected Arrival Date{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={arrival}
                        placeholder="Select Check-In Date"
                        onChange={(e) => setArrival(e.target.value)}
                        invalid={show ? arrival === "" : false}
                      />
                      {show === true && !arrival ? (
                        <span className="error_msg_lbl">
                          Select Arrival Date{" "}
                        </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Expected Departure Date{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={departure}
                        placeholder="Select Check-In Date"
                        onChange={(e) => setDeparture(e.target.value)}
                        invalid={show ? departure === "" : false}
                      />
                      {show === true && !departure ? (
                        <span className="error_msg_lbl">
                          Select Departure Date{" "}
                        </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Coming From
                        {/* <span className="text-danger">*</span> */}
                      </Label>
                      <Input
                        type="text"
                        placeholder="Coming From"
                        value={comingFrom}
                        onChange={(e) => setComing(e.target.value)}
                      // invalid={show ? comingFrom === "" : false}
                      ></Input>

                      {/* {show === true && !comingFrom ? (
                        <span className="error_msg_lbl">Enter Place </span>
                      ) : (
                        <></>
                      )} */}
                    </Col>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Going To
                        {/* <span className="text-danger">*</span> */}
                      </Label>
                      <Input
                        type="text"
                        placeholder="Going To"
                        value={goingTo}
                        onChange={(e) => setGoingTo(e.target.value)}
                      // invalid={show ? goingTo === "" : false}
                      ></Input>

                      {/* {show === true && !goingTo ? (
                        <span className="error_msg_lbl">Enter Place </span>
                      ) : (
                        <></>
                      )} */}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Type of ID Proof <span className="text-danger">*</span>
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select Doc"
                        defaultValue={idProof[0]}
                        options={idProof}
                        isClearable={false}
                        onChange={(e) => setDoc(e.value)}
                        invalid={show ? doc === "" : false}
                      />

                      {show === true && !doc ? (
                        <span className="error_msg_lbl">
                          Select Document Type{" "}
                        </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        Name as Per ID Proof{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Name As On Proof"
                        value={nameOnDoc}
                        onChange={(e) => {
                          const vald = /^[a-z A-Z]*$/.test(e.target.value);
                          if (vald) {
                            setNameOnDoc(e.target.value);
                          }
                        }}
                        invalid={
                          show
                            ? nameOnDoc === "" && nameOnDoc.length <= 5
                            : false
                        }
                      ></Input>

                      {show === true && !nameOnDoc ? (
                        <span className="error_msg_lbl">
                          Enter Name As Per Document{" "}
                        </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" className="mb-md-1 mb-sm-1">
                      <Label>
                        ID Proof Number <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="ID Proof Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        invalid={show ? idNumber === "" : false}
                      ></Input>

                      {show === true && !idNumber ? (
                        <span className="error_msg_lbl">Enter Id Number </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                    <Col lg="6">
                      <Label for="docImage">
                        ID Proof(s) Scan Copy{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="file"
                        id="docImage"
                        name="docImage"
                        // value={docImage}
                        accept="image/*"
                        // invalid={show ? docImage === : false}
                        onChange={(e) => setDocImage(e.target.files[0])}
                      ></Input>

                      {show === true && !docImage ? (
                        <span className="error_msg_lbl">Upload Document </span>
                      ) : (
                        <></>
                      )}
                    </Col>
                    <Col lg="6">
                      <img width="250px" src={docImage} alt="" />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12 mt-1 text-lg-end text-md-center">
                      <Button color="primary" onClick={handleSubmit}>
                        Create Check In
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default WebCheckIn;
