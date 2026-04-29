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
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import { toast } from "react-hot-toast";
import AddHotel from "./AddHotel";
import UpdateHotel from "./UpdateHotel";
import "../PropertyMaster/Hotel/Products.css";
import "./HotelManagement.css";

const STORAGE_KEY = "frontdesk_client_manager_rows";

const defaultClients = [
  {
    id: "12222000372122",
    type: "Private",
    size: "300+",
    industry: "IT Service",
    name: "Adani Cement",
    tax: "27ABCDE1234F1Z5",
    email: "industry@indus.com",
    phone: "+919677734223",
    address1: "162, Madanpura",
    address2: "",
    address: "162, Madanpura",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    pincode: "420001",
  },
  {
    id: "12222000372111",
    type: "Public",
    size: "500+",
    industry: "Banking",
    name: "Bank of India",
    tax: "29ABCDE1234F2Z7",
    email: "boi@banking.com",
    phone: "+918467774347",
    address1: "150, Hadapsar",
    address2: "",
    address: "150, Hadapsar",
    country: "India",
    state: "Maharashtra",
    city: "Pune",
    pincode: "400011",
  },
];

const headerButtonStyles = {
  flex: "0 1 clamp(132px, 24vw, 190px)",
  padding: "clamp(0.35rem, 1vw, 0.5rem) clamp(0.65rem, 1.8vw, 1rem)",
  fontSize: "clamp(0.8rem, 1.35vw, 1rem)",
  whiteSpace: "nowrap",
};

const buildClientRecord = (clientData, existingId = null) => {
  const address = [clientData.address1, clientData.address2]
    .filter((value) => `${value || ""}`.trim())
    .join(", ");

  return {
    id: existingId || `${Date.now()}`,
    ...clientData,
    address,
  };
};

const loadClients = () => {
  try {
    const storedClients = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(storedClients) && storedClients.length > 0) {
      return storedClients;
    }
  } catch (error) {
    console.log("Unable to read saved clients", error);
  }

  return defaultClients;
};

const HotelManagement = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Guest Master";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const [newGuest, setNewGuest] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(loadClients);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const persistClients = (nextClients) => {
    setClients(nextClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextClients));
  };

  const handleNewGuest = () => {
    setNewGuest((prev) => !prev);
  };

  const handleAddClient = (clientData) => {
    const nextClients = [buildClientRecord(clientData), ...clients];
    persistClients(nextClients);
    setCurrentPage(0);
    toast.success("Client added successfully", { position: "top-right" });
  };

  const handleEditClick = (row) => {
    setSelectedClient(row);
    setShowUpdate(true);
  };

  const handleUpdateClient = (clientData) => {
    if (!selectedClient?.id) {
      return;
    }

    const nextClients = clients.map((client) =>
      client.id === selectedClient.id
        ? buildClientRecord(clientData, selectedClient.id)
        : client,
    );

    persistClients(nextClients);
    setSelectedClient(null);
    setCurrentPage(0);
    toast.success("Client updated successfully", { position: "top-right" });
  };

  const handleDeleteClick = (row) => {
    setSelectedClient(row);
    setCancelOpen(true);
  };

  const handleDeleteClient = () => {
    if (!selectedClient?.id) {
      return;
    }

    const nextClients = clients.filter((client) => client.id !== selectedClient.id);
    persistClients(nextClients);
    setSelectedClient(null);
    setCancelOpen(false);
    setCurrentPage(0);
    toast.success("Client deleted successfully", { position: "top-right" });
  };

  const handleCloseDeleteModal = () => {
    setCancelOpen(false);
    setSelectedClient(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdate(false);
    setSelectedClient(null);
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((item) =>
      [
        item.type,
        item.size,
        item.industry,
        item.name,
        item.tax,
        item.email,
        item.phone,
        item.address,
        item.country,
        item.state,
        item.city,
        item.pincode,
      ]
        .filter(Boolean)
        .some((value) => `${value}`.toLowerCase().includes(normalizedSearch)),
    );
  }, [clients, searchValue]);

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
      <Card className="products-page-card hotel-management-page-card">
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-1">
          <CardTitle className="mb-0">
            <h2 className="mb-0">Client Manager</h2>
          </CardTitle>
          {/* {UserRole === "SuperAdmin" ? ( */}
          <Button
            color="primary"
            onClick={() => {
              setNewGuest(true);
            }}
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
            Add Client
          </Button>
          {/* ) : null} */}
        </CardHeader>
        <CardBody>
          <Row className="products-toolbar align-items-center justify-content-between gx-2 gy-1 mb-1">
            <Col xs="12" md="6">
              <div className="d-flex flex-wrap align-items-center gap-50">
              <span className="me-50">Show</span>
              <Input
                type="select"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "90px", minWidth: "90px" }}
                className="mx-50"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <span className="ms-50">entries</span>
              </div>
            </Col>
            <Col xs="12" md="6">
              <div className="d-flex flex-wrap align-items-center justify-content-md-end justify-content-start gap-50">
                <span className="me-50">Search:</span>
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{ width: "100%", maxWidth: "340px", minWidth: "220px" }}
                />
              </div>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <div className="products-table-shell">
                <div className="products-table-wrap text-nowrap">
                  <table className="products-table hotel-management-table table table-hover">
                    <colgroup>
                      <col className="hotel-management-column-type" />
                      <col className="hotel-management-column-size" />
                      <col className="hotel-management-column-industry" />
                      <col className="hotel-management-column-name" />
                      <col className="hotel-management-column-tax" />
                      <col className="hotel-management-column-email" />
                      <col className="hotel-management-column-phone" />
                      <col className="hotel-management-column-address" />
                      <col className="hotel-management-column-country" />
                      <col className="hotel-management-column-state" />
                      <col className="hotel-management-column-city" />
                      <col className="hotel-management-column-pincode" />
                      <col className="hotel-management-column-actions" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Company Type</th>
                        <th>Company Size</th>
                        <th>Company Industry</th>
                        <th>Company Name</th>
                        <th>Tax Info</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Address</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Pincode</th>
                        <th className="product-action-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row) => (
                          <tr key={row.id}>
                            <td>{row.type}</td>
                            <td>{row.size}</td>
                            <td>{row.industry}</td>
                            <td>
                              <span className="hotel-management-company-name">
                                {row.name}
                              </span>
                            </td>
                            <td>{row.tax}</td>
                            <td>{row.email}</td>
                            <td>{row.phone}</td>
                            <td>{row.address}</td>
                            <td>{row.country}</td>
                            <td>{row.state}</td>
                            <td>{row.city}</td>
                            <td>{row.pincode}</td>
                            <td className="product-action-cell">
                              <UncontrolledDropdown className="product-action-menu">
                                <DropdownToggle
                                  tag="button"
                                  type="button"
                                  className="product-action-trigger"
                                  aria-label={`Open actions for ${row.name}`}
                                >
                                  ...
                                </DropdownToggle>
                                <DropdownMenu
                                  end
                                  className="product-action-dropdown"
                                >
                                  <DropdownItem
                                    className="product-action-dropdown-item"
                                    onClick={() => {
                                      handleEditClick(row);
                                    }}
                                  >
                                    <Edit size={15} />
                                    <span>Edit</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="product-action-dropdown-item delete"
                                    onClick={() => {
                                      handleDeleteClick(row);
                                    }}
                                  >
                                    <Trash size={15} />
                                    <span>Delete</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13">
                            <div className="products-empty-state">
                              No clients found.
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

          {/***** Delete Modal *****/}
      <Modal
        isOpen={cancelOpen}
        toggle={handleCloseDeleteModal}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCloseDeleteModal}>
          Delete Client
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">Are you sure you want to delete?</h3>
          <Col className="text-center">
            <Button
              className="m-1"
              color="primary"
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </Button>
            <Button
              className="m-1"
              color="danger"
              onClick={handleDeleteClient}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      {newGuest ? (
        <AddHotel
          open={newGuest}
          handleOpen={handleNewGuest}
          onAddClient={handleAddClient}
        />
      ) : (
        <></>
      )}

      <UpdateHotel
        handleUpdateHotel={handleCloseUpdateModal}
        showUpdate={showUpdate}
        selectedClient={selectedClient}
        onUpdateClient={handleUpdateClient}
      />
    </>
  );
};

export default HotelManagement;
