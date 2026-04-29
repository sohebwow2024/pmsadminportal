import React, { useEffect, useMemo, useState } from "react";
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
import "../PropertyMaster/Hotel/Products.css";

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
      <Card className="products-page-card subscription-history-card">
        <CardHeader>
          <CardTitle>
            <h2>Subscription History</h2>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row className="subscription-history-filters align-items-end gx-2 gy-1 mb-1">
            <Col xs="12" md="4" className="text-start">
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
            <Col xs="12" md="4" className="text-start">
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
            <Col xs="12" md="4">
              <div className="d-flex flex-column flex-sm-row gap-1">
                <Button
                  className="me-sm-1"
                  color="primary"
                  onClick={getBookingData}
                >
                  Search
                </Button>
                <Button color="primary" onClick={handelReset}>
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="products-toolbar align-items-center justify-content-between gx-2 gy-1 mb-1">
            <Col
              xs="12"
              md="6"
              className="d-flex flex-wrap align-items-center gap-1"
            >
              <span className="me-50">Show</span>
              <Input
                type="select"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "90px", minWidth: "90px" }}
                className="mx-0"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <span>entries</span>
            </Col>
            <Col xs="12" md="6">
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-md-end justify-content-start gap-1">
                <span className="me-sm-50">Search:</span>
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{ maxWidth: "340px", width: "100%" }}
                />
              </div>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <div className="products-table-shell">
                <div className="products-table-wrap text-nowrap">
                  <table className="products-table subscription-history-table table table-hover">
                    <colgroup>
                      <col className="subscription-history-column-id" />
                      <col className="subscription-history-column-client" />
                      <col className="subscription-history-column-plan" />
                      <col className="subscription-history-column-time" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Subscription Id</th>
                        <th>Client Id</th>
                        <th>Plan Rate Id</th>
                        <th>Creation Time</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row) => (
                          <tr key={row.subsid}>
                            <td>
                              <span className="category-id-text">
                                {row.subsid}
                              </span>
                            </td>
                            <td>{row.clientid}</td>
                            <td>{row.planrateid}</td>
                            <td>{row.creationtime}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">
                            <div className="products-empty-state">
                              No records found.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="products-footer align-items-center justify-content-between gx-2 gy-1 mt-1">
            <Col xs="12" md="6">
              <div className="products-footer-note text-md-start text-center">
                {`Showing ${showingFrom} to ${showingTo} of ${sortedData.length} entries`}
              </div>
            </Col>
            <Col xs="12" md="6">
              <CustomPagination />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default SubscriptionHistory;
