import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Badge,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { ChevronDown, Edit, Trash, Archive } from "react-feather";
import { useSelector } from "react-redux";
import axios from "../../API/axios";
import AddHotel from "./AddHotel";
import UpdateHotel from "./UpdateHotel";
// import NewGuest from "../GuestMaster/NewGuest";
// import BookingModal from "./BookingModal";
// import NewGuest from "./NewGuest";
// import GuestEdit from "./GuestEdit";

const HotelManagement = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Guest Master";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const [guestOptions, setGuestOptions] = useState([]);
  const [newGuest, setNewGuest] = useState(false);
  const handleNewGuest = () => setNewGuest(!newGuest);
  const [showEdit, setShowEdit] = useState(false);
  const handleGuestEdit = () => setShowEdit(!showEdit);
  const [guestId, setGuestId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handelRefresh = () => setRefresh(!refresh);
  const [activeTab, setActiveTab] = useState("active");

  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdateHotel = () => setShowUpdate(!showUpdate);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.guestID.toLowerCase().includes(query.toLowerCase()) ||
        item.guestName.toLowerCase().includes(query.toLowerCase()) ||
        item.guestMobileNumber.toLowerCase().includes(query.toLowerCase()),
      // item.GuestAddress.toLowerCase().includes(query.toLowerCase())
    );
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
          {/* <Col> */}
          <Edit
            className="me-1 cursor-pointer"
            onClick={() => {
              handleUpdateHotel(true);
              // setGuestId(row.guestID);
            }}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              handleCancelOpen();
              // setPromoId(row.promotionId);
            }}
          />
        </>
      ),
    },
  ];

  const handleGuestOptions = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        SearchPhrase: null,
        Event: "select",
      };
      const res = await axios.post(`/getdata/bookingdata/guestdetails`, obj);
      console.log("Guest data - OK > ", res);
      let result = res?.data[0];
      let arr = result.map((r) => {
        return {
          value: r?.guestID,
          label: `${r.guestName} : ${r.guestEmail} : ${r.guestMobileNumber}`,
          ...r,
        };
      });

      setGuestOptions(arr);
    } catch (error) {
      console.log("guesterror", error);
    }
  };

  useEffect(() => {
    handleGuestOptions();
    setRefresh();
  }, [refresh, newGuest, showEdit]);

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
              class="me-1"
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

      {newGuest ? (
        <AddHotel
          open={newGuest}
          handleOpen={handleNewGuest}
          getOption={handleGuestOptions}
        />
      ) : (
        <></>
      )}
      {/* {showEdit ? (
        <HotelEdit
          open={showEdit}
          handleOpen={handleGuestEdit}
          guestData={guestId}
          onRefresh={handelRefresh}
        />
      ) : (
        <></>
      )} */}

      <UpdateHotel
        // setShowUpdate={setShowUpdate}
        handleUpdateHotel={handleUpdateHotel}
        showUpdate={showUpdate}
      />
    </>
  );
};

export default HotelManagement;
