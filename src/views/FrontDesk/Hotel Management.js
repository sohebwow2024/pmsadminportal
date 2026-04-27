import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
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
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import { toast } from "react-hot-toast";
import AddHotel from "./AddHotel";
import UpdateHotel from "./UpdateHotel";

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

  const Columns = [
    {
      name: "Company Type",
      sortable: true,
      width: "12rem",
      selector: (row) => row.type,
      sortField: "type",
      selectorKey: "type",
    },
    {
      name: "Company Size",
      sortable: true,
      width: "12rem",
      selector: (row) => row.size,
      sortField: "size",
      selectorKey: "size",
    },
    {
      name: "Company Industry",
      sortable: true,
      width: "12rem",
      selector: (row) => row.industry,
      sortField: "industry",
      selectorKey: "industry",
    },
    {
      name: "Company Name",
      sortable: true,
      width: "12rem",
      selector: (row) => row.name,
      sortField: "name",
      selectorKey: "name",
    },
    {
      name: "Tax Info",
      sortable: true,
      width: "12rem",
      selector: (row) => row.tax,
      sortField: "tax",
      selectorKey: "tax",
    },
    {
      name: "Email",
      sortable: true,
      width: "13rem",
      selector: (row) => row.email,
      sortField: "email",
      selectorKey: "email",
    },
    {
      name: "Phone No.",
      sortable: true,
      width: "10rem",
      selector: (row) => row.phone,
      sortField: "phone",
      selectorKey: "phone",
    },
    {
      name: "Address",
      sortable: true,
      width: "12rem",
      selector: (row) => row.address,
      sortField: "address",
      selectorKey: "address",
    },
    {
      name: "Country",
      sortable: true,
      width: "7rem",
      selector: (row) => row.country,
      sortField: "country",
      selectorKey: "country",
    },
    {
      name: "State",
      sortable: true,
      width: "10rem",
      selector: (row) => row.state,
      sortField: "state",
      selectorKey: "state",
    },
    {
      name: "City",
      sortable: true,
      width: "10rem",
      selector: (row) => row.city,
      sortField: "city",
      selectorKey: "city",
    },
    {
      name: "Pincode",
      sortable: true,
      width: "8rem",
      selector: (row) => row.pincode,
      sortField: "pincode",
      selectorKey: "pincode",
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
            onClick={() => {
              handleEditClick(row);
            }}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              handleDeleteClick(row);
            }}
          />
        </>
      ),
    },
  ];

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
        <CardHeader>
          <CardTitle>
            <h2>Client Manager</h2>
          </CardTitle>
          {/* {UserRole === "SuperAdmin" ? ( */}
          <Button
            color="primary"
            onClick={() => {
              setNewGuest(true);
            }}
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
                columns={Columns}
                keyField="id"
                className="react-dataTable"
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
