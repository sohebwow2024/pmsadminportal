import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
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
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import {
  ChevronDown,
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
  Eye,
  EyeOff,
} from "react-feather";
import Flatpickr from "react-flatpickr";
import { MdDateRange } from "react-icons/md";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";
import UpdateHotel from "../FrontDesk/UpdateHotel";
const ListHotel = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Hotel List";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdateHotel = () => setShowUpdate(!showUpdate);

  const { LoginID, Token } = getUserData;
  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [bookingdata, setBookingdata] = useState([]);
  console.log("bookingdata", bookingdata);
  const [dType, setDType] = useState("");
  // console.log(dType, toDate, fromDate);
  const dateType = [
    { value: "", label: "" },
    { value: "Booking Date", label: "Booking Date" },
    { value: "Checkin Date", label: "Checkin Date" },
    { value: "Checkout Date", label: "Checkout Date" },
  ];
  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  const staticData = [
    {
      // id: 12222000372122,
      type: "Private",
      size: "300+",
      industry: "IT Service",
      name: "Adani Cement",
      tax: "27ABCDE1234F1Z5",
      email: "industry@indus.com",
      phone: "+919677734223",
      address: "162, Madanpura",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      pincode: "420001",
    },
    {
      // id: 12222000372111,
      type: "Public",
      size: "500+",
      industry: "Banking",
      name: "Bank of India",
      tax: "29ABCDE1234F2Z7",
      email: "boi@banking.com",
      phone: "+918467774347",
      address: "150, Hadapsar",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      pincode: "400011",
    },
  ];

  const Columns = [
    {
      name: "Company Type",
      sortable: true,
      width: "12rem",
      selector: (row) => row.type,
    },
    {
      name: "Company Size",
      sortable: true,
      width: "12rem",
      selector: (row) => row.size,
    },
    {
      name: "Company Industry",
      sortable: true,
      width: "12rem",
      selector: (row) => row.industry,
    },
    {
      name: "Company Name",
      sortable: true,
      width: "12rem",
      selector: (row) => row.name,
    },
    {
      name: "Tax Info",
      sortable: true,
      width: "12rem",
      selector: (row) => row.tax,
    },
    {
      name: "Email",
      sortable: true,
      width: "13rem",
      selector: (row) => row.email,
    },
    {
      name: "Phone No.",
      sortable: true,
      width: "10rem",
      selector: (row) => row.phone,
    },
    {
      name: "Address",
      sortable: true,
      width: "12rem",
      selector: (row) => row.address,
    },
    {
      name: "Country",
      sortable: true,
      width: "7rem",
      selector: (row) => row.country,
    },
    {
      name: "State",
      sortable: true,
      width: "10rem",
      selector: (row) => row.state,
    },
    {
      name: "City",
      sortable: true,
      width: "10rem",
      selector: (row) => row.city,
    },
    {
      name: "Pincode",
      sortable: true,
      width: "8rem",
      selector: (row) => row.pincode,
    },
    // {
    //   name: "Action",
    //   sortable: true,
    //   center: true,
    //   width: "9rem",

    //   selector: (row) => (
    //     <>
    //       {/* <Col> */}
    //       <Edit
    //         className="me-1 cursor-pointer"
    //         onClick={() => {
    //           handleUpdateHotel(true);
    //           // setGuestId(row.guestID);
    //         }}
    //         size={15}
    //       />
    //       <Trash
    //         className="me-1 cursor-pointer"
    //         size={15}
    //         onClick={() => {
    //           handleCancelOpen();
    //           // setPromoId(row.promotionId);
    //         }}
    //       />
    //     </>
    //   ),
    // },
  ];

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
        `/Reports/BookinDetails?FromDate=${moment(new Date()).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}&FetchType=`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      console.log("resData", res.data[0]);
      setBookingdata(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getBookingData = async () => {
    try {
      const res = await axios.get(
        `/Reports/BookinDetails?FromDate=${moment(fromDate).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(toDate).format("YYYY-MM-DD")}&FetchType=${dType}`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      // console.log('resData', res.data[0])
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
          <CardTitle>
            <h2>Clients Lists</h2>
          </CardTitle>
        </CardHeader>

        <Row className="align-items-end ms-2">
          {/* <Col className="text-start">
            <Label className="form-label" for="dateType">
              Date Type
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              // defaultValue={dateType[0]}
              onChange={(e) => {
                // console.log(e.value);
                setDType(e.value);
              }}
              value={dateType?.filter((c) => c.value === dType)}
              options={dateType}
              isClearable={false}
            />
          </Col> */}
          <Col className="text-start">
            <Label className="form-label" for="startDate">
              From Date
            </Label>
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
          </Col>
          <Col className="text-start">
            <Label className="form-label" for="startDate">
              To Date
            </Label>
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
        {/* <div className="react-dataTable pt-2">
          <DataTable
            noHeader
            pagination
            data={staticData}
            columns={Columns}
            className="react-dataTable ms-3"
            sortIcon={<ChevronDown size={10} />}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div> */}
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={staticData}
                columns={Columns}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/***** Delete Modal *****/}
      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Client
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">Are you sure you want to delete?</h3>
          <Col className="text-center">
            <Button
              className="m-1"
              color="danger"
              // onClick={() => handleCancelBooking(id)}
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

      <UpdateHotel
        // setShowUpdate={setShowUpdate}
        handleUpdateHotel={handleUpdateHotel}
        showUpdate={showUpdate}
      />
    </>
  );
};

export default ListHotel;
