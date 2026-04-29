import React, { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Row,
  Col,
  Input,
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import "./ProductMaster.css";

const ProductMaster = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(!refresh);
  const data = [
    // {
    //   id: 1,
    //   type: "Basic",
    //   details: "something",
    //   dates: "22/8/2022",
    //   applicability: "all",
    //   action: "btns",
    // },
    {
      id: 1,
      name: "Users",
      type: "Basic",
      details: "Basic package details",
      dates: "22/08/2022",
      applicability: "All Users",
      room: "100",
      disAmount: "10%",
    },
    {
      id: 2,
      name: "Users",
      type: "Standard",
      details: "Standard package details",
      dates: "15/10/2023",
      applicability: "selected",
      room: "100",
      disAmount: "15%",
    },
  ];

  const hotelTable = [
    {
      name: "Subscription Pay Id",
      sortable: true,
      minWidth: "220px",
      selector: (row) => row.name,
      sortField: "name",
      selectorKey: "name",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Subscription Id",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.type,
      sortField: "type",
      selectorKey: "type",
      cell: (row) =>  <span>{row.type}</span>,
    },
    {
      name: "Mode",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.details,
      sortField: "details",
      selectorKey: "details",
      cell: (row) => <span>{row.details}</span>,
    },
    {
      name: "Amount",
      sortable: true,
      // minWidth: "50px",
      selector: (row) => row.dates,
      sortField: "dates",
      selectorKey: "dates",
      cell: (row) => <span>{row.dates}</span>,
    },
    {
      name: "Time",
      sortable: true,
      // minWidth: "250px",
      selector: (row) => row.applicability,
      sortField: "applicability",
      selectorKey: "applicability",
      cell: (row) => <span>{row.applicability}</span>,
    },
    {
      // name: 'Discount Amount',
      name: "Product Id",
      sortable: true,
      // minWidth: "250px",
      selector: (row) => row.room,
      sortField: "room",
      selectorKey: "room",
      cell: (row) => <span>{row.room}</span>,
    },
    {
      name: "Discount Amount",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.disAmount,
      sortField: "disAmount",
      selectorKey: "disAmount",
      cell: (row) => <span>{row.disAmount}</span>,
    },

    // {
    //   name: "Actions",
    //   center: true,
    //   minWidth: "80px",
    //   selector: (row) => {
    //     return (
    //       <>
    //         <Col>
    //           <Edit
    //             className="me-1 cursor-pointer"
    //             size={15}
    //             onClick={() => {
    //               handleUpdateOpen();
    //             //   setPromoId(row.promotionId);
    //             }}
    //           />
    //         </Col>
    //       </>
    //     );
    //   },
    // },
  ];

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      [
        item.name,
        item.type,
        item.details,
        item.dates,
        item.applicability,
        item.room,
        item.disAmount,
      ]
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
    setSortField(column.sortField || column.selectorKey || "name");
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
      <Card className="products-page-card">
        <CardHeader>
          <CardTitle>
            <h2>Subscription Payment</h2>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row className="products-toolbar align-items-center justify-content-between gx-2 gy-1 mb-1">
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
              <div className="products-table-shell">
                <div className="products-table-wrap text-nowrap">
                  <table className="products-table table table-hover">
                    <thead>
                      <tr>
                        <th>Subscription Pay Id</th>
                        <th>Subscription Id</th>
                        <th>Mode</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Product Id</th>
                        <th>Discount Amount</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <span className="product-category-badge">{row.name}</span>
                            </td>
                            <td>{row.type}</td>
                            <td>{row.details}</td>
                            <td>{row.dates}</td>
                            <td>{row.applicability}</td>
                            <td>{row.room}</td>
                            <td>{row.disAmount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7">
                            <div className="products-empty-state">No records found.</div>
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
            <Col md="6">
              <div className="products-footer-note text-md-start text-center">
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

export default ProductMaster;
