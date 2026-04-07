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
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";

const SubscriptionHistory = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Payment Folio";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  function subtractMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const [fromDate, setFromDate] = useState(
    moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [bookingData, setBookingData] = useState([]);
  console.log(toDate, fromDate);

  //   const columns = [
  //     {
  //       name: "bookingID",
  //       label: "Booking Id",
  //     },
  //     {
  //       name: "paymentType",
  //       label: "Payment Type",
  //     },
  //     {
  //       name: "paymentDate",
  //       label: "Payment Date",
  //     },
  //     {
  //       name: "referenceText",
  //       label: "Reference Text",
  //     },
  //     {
  //       name: "paidAmount",
  //       label: "Paid Amount",
  //     },
  //     {
  //       name: "invNo",
  //       label: "Invoice Number",
  //     },
  //   ];

  const data = [
    {
      subsid: "030641",
      clientid: "023141",
      creationtime: "Aug 02, 2026",
      planrateid: "808214",
      // action: "btns",
    },
    {
      subsid: "556837",
      clientid: "064273",
      creationtime: "May 30, 2026",
      planrateid: "203042",
      // action: "btns",
    },
  ];
  const basicColumns = [
    {
      name: "Subscription Id",
      sortable: true,
      // width: "22rem",
      cell: (row) => <span>{row.subsid}</span>,
    },
    // {
    //   name: "Purchase Plan",
    //   sortable: true,
    //   cell: (row) => <span>{row.type}</span>,
    // },
    {
      name: "Client Id",
      sortable: true,
      // width: "22rem",
      cell: (row) => <span>{row.clientid}</span>,
    },
    {
      name: "Plan Rate Id",
      sortable: true,
      // width: "22rem",
      cell: (row) => <span>{row.planrateid}</span>,
    },
    {
      name: "Creation Time",
      sortable: true,
      width: "22rem",
      cell: (row) => <span>{row.creationtime}</span>,
    },
    
    // {
    //   name: "Actions",
    //   center: true,
    //   //  minWidth: '150px',
    //   selector: (row) => {
    //     return (
    //       <>
    //         <Col>
    //           <Edit
    //             className="me-1 cursor-pointer"
    //             size={15}
    //             onClick={() => {
    //               handleUpdateOpen();
    //               setPromoId(row.promotionId);
    //             }}
    //           />
    //           <Trash
    //             className="me-1 cursor-pointer"
    //             size={15}
    //             onClick={() => {
    //               // handleUpdateOpen();
    //               setPromoId(row.promotionId);
    //             }}
    //           />
    //         </Col>
    //       </>
    //     );
    //   },
    // },
  ];

  const options = {
    filterType: "dropdown",
    download: true,
  };
  const handelReset = async () => {
    // setDType("");
    setFromDate(moment(new Date()).format("YYYY-MM-DD"));
    setToDate(moment(new Date()).format("YYYY-MM-DD"));
    try {
      const res = await axios.get(
        `/Reports/GuestDetails?FromDate=${moment(
          subtractMonths(new Date(), 1),
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
        `/Reports/PaymentFolioDetails?FromDate=${moment(fromDate).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(toDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      console.log("resData", res.data[0]);
      setBookingData(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getBookingData();
  }, [fromDate, toDate]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Subscription History</h2>
          </CardTitle>
        </CardHeader>
        <Row className="align-items-end ms-2">
          <Col className="text-start">
            <Label className="form-label" for="startDate">
              From Date
            </Label>

            <Flatpickr
              className="form-control"
              value={fromDate}
              onChange={(date) => {
                setFromDate(moment(date[0]).format("YYYY-MM-DD"));
              }}
              id="startDate"
              options={{
                altInput: true,
                dateFormat: "Y-m-d",
              }}
            />
          </Col>
          <Col className="text-start">
            <Label className="form-label" for="endDate">
              To Date
            </Label>

            <Flatpickr
              className="form-control"
              value={toDate}
              onChange={(date) => {
                setToDate(moment(date[0]).format("YYYY-MM-DD"));
              }}
              id="endDate"
              options={{
                altInput: true,
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
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={basicColumns}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default SubscriptionHistory;
