import React, { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { Edit, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  Input,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "./Promocode.css";

const initialPromocodeData = [
  {
    id: 1,
    promo: "SAVE20",
    type: "Short Term",
    volume: "Unlimited Usage",
  },
  {
    id: 2,
    promo: "WELCOME10",
    type: "Long Term",
    volume: "Limited Availability",
  },
];

const tenureTypeOptions = [
  { value: "short_term", label: "Short Term" },
  { value: "long_term", label: "Long Term" },
  { value: "fixed_tenure", label: "Fixed Tenure" },
  { value: "flexible_tenure", label: "Flexible Tenure" },
];

const modalFooterStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  justifyContent: "flex-end",
};

const modalActionButtonStyles = {
  flex: "1 1 160px",
};

const headerGroupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "nowrap",
  gap: "0.75rem",
  width: "100%",
};

const headerButtonStyles = {
  flex: "0 1 clamp(150px, 28vw, 210px)",
  padding: "clamp(0.35rem, 1vw, 0.5rem) clamp(0.6rem, 1.8vw, 1rem)",
  fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
  whiteSpace: "nowrap",
};

const Promocode = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Products";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { UserRole } = getUserData;

  const [promoData, setPromoData] = useState(initialPromocodeData);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [promoCode, setPromoCode] = useState("");
  const [tenureType, setTenureType] = useState(null);
  const [unitVolume, setUnitVolume] = useState("");
  const [display, setDisplay] = useState(false);

  const resetForm = () => {
    setPromoCode("");
    setTenureType(null);
    setUnitVolume("");
    setDisplay(false);
    setSelectedPromoId(null);
  };

  const handleShowModal = () => {
    if (!show) {
      resetForm();
    }
    setShow(!show);
  };

  const handleShowModalUpdate = () => {
    if (showUpdate) {
      resetForm();
    }
    setShowUpdate(!showUpdate);
  };

  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  const validateForm = () => {
    setDisplay(true);

    if (!promoCode.trim() || !tenureType || !unitVolume.trim()) {
      toast.error("please enter required fields!", {
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const isPromocodeFormComplete =
    !!promoCode.trim() && !!tenureType && !!unitVolume.trim();

  const buildPromoPayload = () => ({
    id: selectedPromoId || Date.now(),
    promo: promoCode.trim(),
    type: tenureType.label,
    volume: unitVolume.trim(),
  });

  const handleAddPromocode = () => {
    if (!validateForm()) {
      return;
    }

    const payload = buildPromoPayload();
    setPromoData((prev) => [...prev, payload]);
    setCurrentPage(0);
    toast.success("Promocode added successfully", {
      position: "top-center",
    });
    handleShowModal();
  };

  const handleEditClick = (row) => {
    setSelectedPromoId(row.id);
    setPromoCode(row.promo);
    setTenureType(
      tenureTypeOptions.find((item) => item.label === row.type) || null,
    );
    setUnitVolume(row.volume);
    setDisplay(false);
    setShowUpdate(true);
  };

  const handleUpdatePromocode = () => {
    if (!validateForm() || !selectedPromoId) {
      return;
    }

    const payload = buildPromoPayload();
    setPromoData((prev) =>
      prev.map((item) => (item.id === selectedPromoId ? payload : item)),
    );
    setCurrentPage(0);
    toast.success("Promocode updated successfully", {
      position: "top-center",
    });
    handleShowModalUpdate();
  };

  const handleDeletePromocode = () => {
    if (!selectedPromoId) {
      return;
    }

    setPromoData((prev) => prev.filter((item) => item.id !== selectedPromoId));
    setCurrentPage(0);
    toast.success("Promocode deleted successfully", {
      position: "top-center",
    });
    setSelectedPromoId(null);
    setCancelOpen(false);
  };

  const hotelTable = [
    {
      name: "Promo Code",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.promo,
      sortField: "promo",
      selectorKey: "promo",
      cell: (row) => <span>{row.promo}</span>,
    },
    {
      name: "Tenure Type",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.type,
      sortField: "type",
      selectorKey: "type",
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Unit Volume",
      sortable: true,
      minWidth: "160px",
      selector: (row) => row.volume,
      sortField: "volume",
      selectorKey: "volume",
      cell: (row) => <span>{row.volume}</span>,
    },
    {
      name: "Action",
      sortable: false,
      center: true,
      width: "9rem",
      selector: (row) => (
        <>
          <Edit
            className="me-1 cursor-pointer"
            onClick={() => handleEditClick(row)}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              setSelectedPromoId(row.id);
              handleCancelOpen();
            }}
          />
        </>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return promoData;
    }

    return promoData.filter((item) =>
      [item.promo, item.type, item.volume]
        .filter(Boolean)
        .some((value) => `${value}`.toLowerCase().includes(normalizedSearch)),
    );
  }, [promoData, searchValue]);

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
    setSortField(column.sortField || column.selectorKey || "promo");
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
      <Card className="promocode-page-card">
        <CardHeader>
          <CardTitle>
            <h2>Promocode</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button
              color="primary"
              onClick={handleShowModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="me-1"
              >
                <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
              </svg>
              Add Promocode
            </Button>
          ) : null}
        </CardHeader>
        <CardBody>
          <Row className="promocode-toolbar align-items-center justify-content-between gx-2 gy-1 mb-1">
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
              <div className="promocode-table-shell">
                <div className="promocode-table-wrap text-nowrap">
                  <table className="promocode-table table table-hover">
                    <thead>
                      <tr>
                        <th>Promo Code</th>
                        <th>Tenure Type</th>
                        <th>Unit Volume</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <span className="promocode-category-badge">{row.promo}</span>
                            </td>
                            <td>{row.type}</td>
                            <td>{row.volume}</td>
                            <td>
                              <div className="promocode-action-group">
                                <button
                                  type="button"
                                  className="promocode-action-btn"
                                  onClick={() => handleEditClick(row)}
                                  aria-label={`Edit`}
                                >
                                  <Edit size={15} />
                                </button>
                                <button
                                  type="button"
                                  className="promocode-action-btn delete"
                                  onClick={() => {
                                    setSelectedPromoId(row.id);
                                    handleCancelOpen();
                                  }}
                                  aria-label={`Delete`}
                                >
                                  <Trash size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">
                            <div className="promocode-empty-state">No promocodes found.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="promocode-footer align-items-center justify-content-between gx-2 gy-1 mt-1">
            <Col md="6">
              <div className="promocode-footer-note text-md-start text-center">
                {`Showing ${showingFrom} to ${showingTo} of ${sortedData.length} entries`}
              </div>
            </Col>
            <Col md="6">
              <CustomPagination />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Promo Code
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">Are you sure you want to delete?</h3>
          <Col className="text-center">
            <Button className="m-1" color="primary" onClick={handleCancelOpen}>
              Cancel
            </Button>
            <Button
              className="m-1"
              color="danger"
              onClick={handleDeletePromocode}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModal}>
          <span>
            <h4>Add Promocode</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Promo Code <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  invalid={display && promoCode.trim() === ""}
                />
                {display && !promoCode.trim() ? (
                  <span className="error_msg_lbl">Enter Promo Code </span>
                ) : null}
              </Col>

              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Tenure Type <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Tenure Type"
                  options={tenureTypeOptions}
                  value={tenureType}
                  onChange={setTenureType}
                />
                {display && !tenureType ? (
                  <span className="error_msg_lbl">Enter Tenure Type </span>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Unit Volume <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Unit Volume"
                  value={unitVolume}
                  onChange={(e) => setUnitVolume(e.target.value)}
                  invalid={display && unitVolume.trim() === ""}
                />
                {display && !unitVolume.trim() ? (
                  <span className="error_msg_lbl">Enter Unit Volume </span>
                ) : null}
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-1" />
          <Col xs="12" className="pb-2">
            <div style={modalFooterStyles}>
            <Button
              className="btn btn-danger"
              color="secondary"
              outline
              onClick={handleShowModal}
              style={modalActionButtonStyles}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddPromocode}
              disabled={!isPromocodeFormComplete}
              style={modalActionButtonStyles}
            >
              Add Promocode
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>

      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span>
            <h4>Update Promocode</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Promo Code <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  invalid={display && promoCode.trim() === ""}
                />
              </Col>

              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Tenure Type <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Tenure Type"
                  options={tenureTypeOptions}
                  value={tenureType}
                  onChange={setTenureType}
                />
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Unit Volume <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Unit Volume"
                  value={unitVolume}
                  onChange={(e) => setUnitVolume(e.target.value)}
                  invalid={display && unitVolume.trim() === ""}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-1" />
          <Col xs="12" className="pb-2">
            <div style={modalFooterStyles}>
            <Button
              className="btn btn-danger"
              color="secondary"
              outline
              onClick={handleShowModalUpdate}
              style={modalActionButtonStyles}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleUpdatePromocode}
              style={modalActionButtonStyles}
            >
              Submit
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Promocode;
