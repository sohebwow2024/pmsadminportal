import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, RefreshCcw, Trash, Archive, Delete } from "react-feather";
import { AiOutlineCloudSync } from "react-icons/ai";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Input,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  FormFeedback,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import axios, { Image_base_uri } from "../../../API/axios";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
// import NewHotelModal from "./NewHotelModal";
// import EditHotelModal from "./EditHotelModel";
// import DeleteHotelModal from "./DeleteHotelModal";
// import HotelOTA from "./HotelOTA";
import Avatar from "@components/avatar";
// import PlanIncludingModal from "./PlanIncludingModal";

const PlanIncluding = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Products";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, CompanyID, UserRole } = getUserData;

  const [hotels, setHotels] = useState([]);
  const getAllHotelList = () => {
    axios
      .get(
        `/property/hotel/all?CompanyID=${CompanyID}&LoginID=${LoginID}&Token=${Token}`,
      )
      .then((res) => {
        console.log("response:__", res.data[0]);
        setHotels(res.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
      icons: "File",
      name: "Unlimited Website",
      action: "btns",
    },
    {
      icons: "Upload File",
      name: "Unlimited FTP Account",
      action: "btns",
    },
  ];

  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);
  const handleSubmit = () => setShowSubmit(!showEdit);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleShowModalUpdate = () => setShowUpdate(!showUpdate);

  const [selected_hotel, setSelected_hotel] = useState();

  const [del, setDel] = useState(false);
  const handleDelModal = () => setDel(!del);

  const [OTA, SetOTA] = useState(false);
  const handleOTA = () => SetOTA(!OTA);

  const [otaData, setOtaData] = useState([]);
  const getOTAphoto = async () => {
    try {
      const res = await axios.get(`/booking/getotalogo/244`, {
        headers: {
          LoginID,
          Token,
        },
      });
      console.log("otaData", res?.data[0]);
      setOtaData(res?.data[0][0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllHotelList();
    getOTAphoto();
  }, [show, showEdit, del]);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  // const getAllState = () => {
  //   axios.post("/getdata/regiondata/statedetails", {
  //     LoginID,
  //     Token,
  //     Seckey: "abc",
  //     Event: "selectall"
  //   }).then(res => {
  //     console.log("testing:_", res)
  //     if (res.data !== null) {
  //       res.data[0].map(i => states.push({ label: i.StateName, value: i.StateID }))

  //     }
  //   }).catch(e => {
  //     toast.error(e.response.data.Message, { position: 'top-right' })
  //   })
  // }
  // useEffect(() => {
  //   getAllHotelList()
  //   // getAllState()
  // }, [])

  const hotelTable = [
    {
      name: "Plan Incuding Icon",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.icons}</span>,
    },
    {
      name: "Plan Including Name",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.name}</span>,
    },
    // {
    //   name: "Product Category",
    //   sortable: true,
    //   minWidth: "180px",
    //   cell: (row) => <span>{row.details}</span>,
    // },
    // {
    //   name: "Product Description",
    //   sortable: true,
    //   minWidth: "50px",
    //   cell: (row) => <span>{row.dates}</span>,
    // },
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
              handleShowModalUpdate(true);
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Plan Including</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button color="primary" onClick={() => setShow(true)}>
              Add Plan Including
            </Button>
          ) : null}
        </CardHeader>
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={hotelTable}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/********** Delete Modal *********/}

      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Including Plan
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

      {/********* Update Modal ********/}
      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-lg"
        // backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span className=" mb-1">Update Plan Including </span>
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Points Icons <span className="text-danger">*</span>
                  </Label>
                  <Input type="file" placeholder="Chose File" />
                  {/* {display && !country ? <span className='error_msg_lbl'>Enter Category </span> : null} */}
                </Col>

                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Plan Including Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    placeholder="Category Name"
                    id="hotel"
                    // value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    // invalid={display && hotelName === ''}
                  />
                  {/* {display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null} */}
                </Col>
              </Row>
              <Row>
                <Col md="12 text-lg-end text-md-center mt-1">
                  <Button
                    className="me-1"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    // onClick={() => {
                    //     setShow(!show)
                    // }}
                    onClick={handleShowModalUpdate}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
      </Modal>
      {show ? <div className="modal-backdrop fade show"></div> : null}


      {/********* Add Modal ********/}
      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModal}>
          <span className=" mb-1">Add Plan Including </span>
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Points Icons <span className="text-danger">*</span>
                  </Label>
                  <Input type="file" placeholder="Chose File" />
                  {/* {display && !country ? <span className='error_msg_lbl'>Enter Category </span> : null} */}
                </Col>

                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Plan Including Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    placeholder="Category Name"
                    id="hotel"
                    // value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    // invalid={display && hotelName === ''}
                  />
                  {/* {display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null} */}
                </Col>
              </Row>
              <Row>
                <Col md="12 text-lg-end text-md-center mt-1">
                  <Button
                    className="me-1"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Add Plan Including
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    // onClick={() => {
                    //     setShow(!show)
                    // }}
                    onClick={handleShowModal}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
      </Modal>
      {/* {show ? <div className="modal-backdrop fade show"></div> : null} */}

      {/* {show && (
        <PlanIncludingModal
          show={show}
          handleShowModal={handleShowModal}
          getAllHotelList={getAllHotelList}
        />
      )} */}

      {del && (
        <DeleteHotelModal
          del={del}
          handleDelModal={handleDelModal}
          hotels={hotels}
          id={selected_hotel}
        />
      )}
    </>
  );
};

export default PlanIncluding;
