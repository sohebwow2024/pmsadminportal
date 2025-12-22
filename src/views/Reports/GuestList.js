import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { MdDateRange } from "react-icons/md";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";
const GuestList = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Guest List"

    return () => {
      document.title = prevTitle
    }
  }, [])


  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  // const [reset,setReset] = useState(false)
  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [bookingdata, setBookingdata] = useState([]);
  const [dType, setDType] = useState("");

  const dateType = [
    { value: "", label: "" },
    // { value: 'Booking Date', label: 'Booking Date' },
    { value: "Checkin Date", label: "Checkin Date" },
    { value: "Checkout Date", label: "Checkout Date" },
  ];
  const columns = [
    {
      name: "bookingID",
      label: "Booking ID",
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "bookingSource",
      label: "Booking Source",
    },
    {
      name: "guestName",
      label: "Guest Name",
    },
    // {
    //     name: "RoomType",
    //     label: "Room Type",
    // },
    {
      name: "checkInDate",
      label: "CheckIn Date",
    },
    {
      name: "checkOutDate",
      label: "CheckOut Date",
    },
    {
      name: "guests",
      label: "Guests",
    },
    {
      name: "totalAmount",
      label: "Booking Amount",
    },
    {
      name: "recievedAmount",
      label: "Received Amount",
    },
  ];

  // const data = [
  //     { bookingId: "Joe James", hotelName: "Test Corp", source: "Yonkers", roomType: "NY", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "John Walsh", hotelName: "Test Corp", source: "Hartford", roomType: "CT", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "Bob Herm", hotelName: "Test Corp", source: "Tampa", roomType: "FL", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "James Houston", hotelName: "Test Corp", source: "Dallas", roomType: "TX", noofRooms: '1', noofAdults: '1' },
  // ];

  const options = {
    filterType: "dropdown",
    download: true,
  };
  const handelReset = async () => {
    setDType("");
    setFromDate(moment(new Date()).format("YYYY-MM-DD"));
    setToDate(moment(new Date()).format("YYYY-MM-DD"));
    try {
      const res = await axios.get(
        `/Reports/GuestDetails?FromDate=${moment(new Date()).format("YYYY-MM-DD")}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}&FetchType=`,
        {
          headers: {
            LoginID,
            Token,
          },
        }
      );
      console.log("resData", res.data[0]);
      setBookingdata(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getBookingData = async () => {
    console.log(`/Reports/GuestDetails?FromDate=${moment(fromDate).format("YYYY-MM-DD")}&ToDate=${moment(toDate).format("YYYY-MM-DD")}&FetchType=${dType}`);
    try {
      const res = await axios.get(
        `/Reports/GuestDetails?FromDate=${moment(fromDate).format("YYYY-MM-DD")}&ToDate=${moment(toDate).format("YYYY-MM-DD")}&FetchType=${dType}`,
        {
          headers: {
            LoginID,
            Token,
          },
        }
      );
      console.log("resData", res.data[0]);
      setBookingdata(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };



  useEffect(() => {
    getBookingData();
  }, []);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Guest Details</CardTitle>
        </CardHeader>
        <CardBody className="text-center">
          <Row className="align-items-end">
            <Col className="text-start">
              <Label className="form-label" for="dateType">
                Date Type
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => {
                  console.log(e.value);
                  setDType(e.value);
                }}
                value={dateType?.filter((c) => c.value === dType)}
                options={dateType}
                isClearable={false}
              />
            </Col>
            <Col className="text-start">
              <Label className="form-label" for="startDate">
                From Date
              </Label>
              {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
              <Flatpickr
                className="form-control"
                value={moment(fromDate).format("YYYY-MM-DD")}
                onChange={(date) => {
                  setFromDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="startDate"
                options={{
                  altInput: true,
                  // altFormat: 'F j, Y',
                  dateFormat: "Y-m-d",
                }}
              />
              {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup> */}
              {/* </div> */}
            </Col>
            <Col className="text-start">
              <Label className="form-label" for="startDate">
                To Date
              </Label>
              {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
              <Flatpickr
                className="form-control"
                value={toDate}
                onChange={(date) => {
                  setToDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="startDate"
                options={{
                  altInput: true,
                  // altFormat: 'F j, Y',
                  dateFormat: "Y-m-d",
                }}
              />
              {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup> */}
              {/* </div> */}
            </Col>
            <Col>
              <Button className="me-1" color="primary" onClick={getBookingData}>
                Search
              </Button>
              <Button className="me-1" color="primary" onClick={handelReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </CardBody>
        <MUIDataTable
          // title={"Booking Report"}
          data={bookingdata}
          columns={columns}
          options={options}
        />
      </Card>
    </>
  );
};

export default GuestList;
