import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
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
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
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
      selector: (row) => row.subsid,
      sortField: "subsid",
      selectorKey: "subsid",
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
      selector: (row) => row.clientid,
      sortField: "clientid",
      selectorKey: "clientid",
      cell: (row) => <span>{row.clientid}</span>,
    },
    {
      name: "Plan Rate Id",
      sortable: true,
      // width: "22rem",
      selector: (row) => row.planrateid,
      sortField: "planrateid",
      selectorKey: "planrateid",
      cell: (row) => <span>{row.planrateid}</span>,
    },
    {
      name: "Creation Time",
      sortable: true,
      width: "22rem",
      selector: (row) => row.creationtime,
      sortField: "creationtime",
      selectorKey: "creationtime",
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

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      [item.subsid, item.clientid, item.planrateid, item.creationtime]
        .filter(Boolean)
        .some((value) => `${value}`.toLowerCase().includes(normalizedSearch)),
    );
  }, [data, searchValue]);

  const sortedData = useMemo(() => {
    if (!sortField) {
      return filteredData;
    }

    const sortedRows = [...filteredData];

    sortedRows.sort((firstRow, secondRow) => {
      const firstValue = `${firstRow?.[sortField] ?? ""}`.toLowerCase();
      const secondValue = `${secondRow?.[sortField] ?? ""}`.toLowerCase();

      if (firstValue < secondValue) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return sortedRows;
  }, [filteredData, sortDirection, sortField]);

  const pageCount = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const currentStartIndex = currentPage * rowsPerPage;
  const currentEndIndex = currentStartIndex + rowsPerPage;
  const paginatedData = sortedData.slice(currentStartIndex, currentEndIndex);

  useEffect(() => {
    const lastPageIndex = Math.max(
      Math.ceil(sortedData.length / rowsPerPage) - 1,
      0,
    );
    if (currentPage > lastPageIndex) {
      setCurrentPage(lastPageIndex);
    }
  }, [currentPage, rowsPerPage, sortedData.length]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setCurrentPage(0);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleSort = (column, direction) => {
    setSortField(column.sortField || column.selectorKey || "subsid");
    setSortDirection(direction);
    setCurrentPage(0);
  };

  const showingFrom = sortedData.length === 0 ? 0 : currentStartIndex + 1;
  const showingTo = Math.min(currentEndIndex, sortedData.length);

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={<span aria-hidden="true">&lsaquo;</span>}
      nextLabel={<span aria-hidden="true">&rsaquo;</span>}
      forcePage={Math.min(currentPage, pageCount - 1)}
      onPageChange={handlePagination}
      pageCount={pageCount}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      disabledClassName="disabled"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-md-end justify-content-center mb-0"
    />
  );

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
          <Row className="align-items-center justify-content-between gx-2 gy-1 mb-1">
            <Col md="6" className="d-flex align-items-center">
              <span className="me-50">Show</span>
              <Input
                type="select"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "90px" }}
                className="mx-50"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <span className="ms-50">entries</span>
            </Col>
            <Col md="6">
              <div className="d-flex align-items-center justify-content-md-end justify-content-start">
                <span className="me-50">Search:</span>
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{ maxWidth: "340px" }}
                />
              </div>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={paginatedData}
                columns={basicColumns}
                className="react-dataTable"
                keyField="subsid"
                onSort={handleSort}
                sortServer
              />
            </Col>
          </Row>
          <Row className="align-items-center justify-content-between gx-2 gy-1 mt-1">
            <Col md="6">
              <div className="text-md-start text-center">
                {`Showing ${showingFrom} to ${showingTo} of ${sortedData.length} entries`}
              </div>
            </Col>
            <Col md="6">
              <CustomPagination />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default SubscriptionHistory;
