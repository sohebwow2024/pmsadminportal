import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { Edit, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  CardHeader,
} from "reactstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const initialPlanPointData = [
  {
    id: 1,
    name: "Unlimited Website",
    icons: "website-icon.png",
    description: "Website access included",
  },
  {
    id: 2,
    name: "Unlimited FTP Account",
    icons: "ftp-icon.png",
    description: "FTP account access included",
  },
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

const headerButtonStyles = {
  flex: "0 1 clamp(148px, 26vw, 215px)",
  padding: "clamp(0.35rem, 1vw, 0.5rem) clamp(0.6rem, 1.8vw, 1rem)",
  fontSize: "clamp(0.8rem, 1.35vw, 1rem)",
  whiteSpace: "nowrap",
};

const PlanPoint = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Products";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { UserRole } = getUserData;

  const [planPoints, setPlanPoints] = useState(initialPlanPointData);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPlanPointId, setSelectedPlanPointId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [pointName, setPointName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [display, setDisplay] = useState(false);

  const resetForm = () => {
    setPointName("");
    setIcon("");
    setDescription("");
    setDisplay(false);
    setSelectedPlanPointId(null);
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

  const isFormValid = !!pointName.trim() && !!icon.trim();

  const validateForm = () => {
    setDisplay(true);

    if (!isFormValid) {
      toast.error("please enter required fields!", {
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const buildPlanPointPayload = () => ({
    id: selectedPlanPointId || Date.now(),
    name: pointName.trim(),
    icons: icon.trim(),
    description: description.trim(),
  });

  const handleAddPlanPoint = () => {
    if (!validateForm()) {
      return;
    }

    const payload = buildPlanPointPayload();
    setPlanPoints((prev) => [...prev, payload]);
    setCurrentPage(0);
    toast.success("Plan point added", {
      position: "top-center",
    });
    handleShowModal();
  };

  const handleEditClick = (row) => {
    setSelectedPlanPointId(row.id);
    setPointName(row.name);
    setIcon(row.icons);
    setDescription(row.description || "");
    setDisplay(false);
    setShowUpdate(true);
  };

  const handleUpdatePlanPoint = () => {
    if (!validateForm() || !selectedPlanPointId) {
      return;
    }

    const payload = buildPlanPointPayload();
    setPlanPoints((prev) =>
      prev.map((item) => (item.id === selectedPlanPointId ? payload : item)),
    );
    setCurrentPage(0);
    toast.success("Plan point updated", {
      position: "top-center",
    });
    handleShowModalUpdate();
  };

  const handleDeletePlanPoint = () => {
    if (!selectedPlanPointId) {
      return;
    }

    setPlanPoints((prev) =>
      prev.filter((item) => item.id !== selectedPlanPointId),
    );
    setCurrentPage(0);
    toast.success("Plan point deleted", {
      position: "top-center",
    });
    setCancelOpen(false);
    setSelectedPlanPointId(null);
  };

  const planPointTable = [
    {
      name: "Plan Point Name",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.name,
      sortField: "name",
      selectorKey: "name",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Plan Point Icon",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.icons,
      sortField: "icons",
      selectorKey: "icons",
      cell: (row) => <span>{row.icons}</span>,
    },
    {
      name: "Description",
      sortable: true,
      minWidth: "220px",
      selector: (row) => row.description || "",
      sortField: "description",
      selectorKey: "description",
      cell: (row) => <span>{row.description || "-"}</span>,
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
              setSelectedPlanPointId(row.id);
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
      return planPoints;
    }

    return planPoints.filter((item) =>
      [item.name, item.icons, item.description]
        .filter(Boolean)
        .some((value) => `${value}`.toLowerCase().includes(normalizedSearch)),
    );
  }, [planPoints, searchValue]);

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
      <Card>
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-1">
          <CardTitle className="mb-0">
            <h2 className="mb-0">Plan Points</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button
              color="primary"
              onClick={handleShowModal}
              className="flex-shrink-0"
              style={headerButtonStyles}
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
              Add Plan Points
            </Button>
          ) : null}
        </CardHeader>
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
                columns={planPointTable}
                className="react-dataTable"
                keyField="id"
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

      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Plan Point
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
              onClick={handleDeletePlanPoint}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span>
            <h4>Update Plan Point</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Plan Point Name <span className="text-danger">*</span>
                </Label>
                <Input
                  placeholder="Plan Point Name"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  invalid={display && pointName.trim() === ""}
                />
                {display && !pointName.trim() ? (
                  <span className="error_msg_lbl">Enter Point Name </span>
                ) : null}
              </Col>

              {/* <Col lg="12" className="mb-1">
                <Label className="form-label">
                  Icon <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Icon Name"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  invalid={display && icon.trim() === ""}
                />
                {display && !icon.trim() ? (
                  <span className="error_msg_lbl">Choose Icon </span>
                ) : null}
              </Col> */}
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">Description</Label>
                <Input
                  type="textarea"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-2"></hr>
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
              onClick={handleUpdatePlanPoint}
              style={modalActionButtonStyles}
            >
              Submit
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>

      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-md"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModal}>
          <span>
            <h4>Add Plan Point</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Plan Point Name <span className="text-danger">*</span>
                </Label>
                <Input
                  placeholder="Enter Plan Point Name"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  invalid={display && pointName.trim() === ""}
                />
                {display && !pointName.trim() ? (
                  <span className="error_msg_lbl">Enter Point Name</span>
                ) : null}
              </Col>

              {/* <Col lg="12" className="mb-1">
                <Label className="form-label">
                  Icon <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Icon Name"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  invalid={display && icon.trim() === ""}
                />
                {display && !icon.trim() ? (
                  <span className="error_msg_lbl">Choose Icon </span>
                ) : null}
              </Col> */}
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">Description</Label>
                <Input
                  type="textarea"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-2"></hr>
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
              onClick={handleAddPlanPoint}
              disabled={!isFormValid}
              style={modalActionButtonStyles}
            >
              Add Plan Point
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>
      {show ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default PlanPoint;
