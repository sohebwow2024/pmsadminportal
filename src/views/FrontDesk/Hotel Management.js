import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
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
    {
      name: "Action",
      sortable: true,
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
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={clients}
                columns={Columns}
                keyField="id"
                className="react-dataTable"
              />
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
