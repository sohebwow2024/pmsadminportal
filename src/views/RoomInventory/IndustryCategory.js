import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, RefreshCcw, Trash, Archive } from "react-feather";
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
import axios, { Image_base_uri } from "../../API/axios";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
// import NewHotelModal from "./NewHotelModal";
// import EditHotelModal from "./EditHotelModal";
// import DeleteHotelModal from "./DeleteHotelModal";
// import HotelOTA from "./HotelOTA";
import Avatar from "@components/avatar";

const ProductCategory = () => {
  const [hotelName, setHotelName] = useState("");

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
      id: "024321",
      name: "PMS",
      dates: "Aug 08,2025",
      // applicability: "All Users",
      // room: "100",
      // user: "50",
      action: "btns",
    },
    {
      id: "213042",
      name: "LLM",
      dates: "Oct 10,2025",
      // applicability: "selected",
      // room: "500",
      // user: "200",
      action: "btns",
    },
  ];

  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  const [showCategroy, setShowCategroy] = useState(false);
  const handleShowModalCategory = () => setShowCategroy(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

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
      name: "Category Id",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.id}</span>,
    },
    {
      name: "Category Name",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Creation Time",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.dates}</span>,
    },
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
            <h2>Industry Category</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button color="primary" onClick={() => setShowCategroy(true)}>
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
              Add Category
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
      <Modal
        isOpen={showCategroy}
        toggle={() => setShowCategroy(false)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowCategroy(false)}
        >
          <span><h4>Add Category</h4> </span>
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-2">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    placeholder="Category Name"
                    id="hotel"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    // invalid={display && hotelName === ""}
                  />
                  {/* {display && !hotelName ? (
                    <span className="error_msg_lbl">Enter Product Name </span>
                  ) : null} */}
                </Col>
              </Row>
              <Row>
                <Col md="12 text-lg-end text-md-center mt-1">
                  <Button className="me-1" color="primary">
                    Add Category
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    // onClick={() => {
                    //     setShow(!show)
                    // }}
                    onClick={() => setShowCategroy(false)}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
      </Modal>

      {/***** Delete Modal *****/}
      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Category
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

      {/********* Update Modal *******/}
      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-lg"
        // backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span className=" mb-1">Update Industry Category </span>
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Category Id
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    id="hotel"
                    placeholder="Category Id"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    // invalid={display && hotelName === ""}
                  />
                  {/* {display && !hotelName ? (
                    <span className="error_msg_lbl">Enter Product Name </span>
                  ) : null} */}
                </Col>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="address">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Category Name"
                    // value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    // invalid={display && address === ""}
                  />
                  {/* {display && !address ? (
                    <span className="error_msg_lbl">Enter Product Code </span>
                  ) : null} */}
                </Col>
              </Row>
              <Row>
                {/* <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Product Category <span className="text-danger">*</span>
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Select Category"
                    // options={countryList}
                    onChange={(e) => {
                      setCountryId(e.value);
                      setCountryCode(e.CountryCode);
                      setCountry(e.label);
                    }}
                    invalid={display && country === ''}
                  />
                  {display && !country ? (
                    <span className="error_msg_lbl">Enter Category </span>
                  ) : null}
                </Col> */}
                {/* <Col lg="6" className="mb-1">
                  <Label className="form-label" for="address">
                    Creation Time <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    // value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    // invalid={display && address === ""}
                  /> */}
                {/* {display && !address ? (
                    <span className="error_msg_lbl">
                      Enter Product Description{" "}
                    </span>
                  ) : null} */}
                {/* </Col> */}
              </Row>

              <Row>
                <Col md="12 text-lg-end text-md-center mt-1">
                  <Button
                    className="me-1"
                    color="primary"
                    // onClick={handleSubmit}
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
      {show && (
        <NewHotelModal
          show={show}
          handleShowModal={handleShowModal}
          getAllHotelList={getAllHotelList}
        />
      )}
      {/* {showCategroy && (
        <NewHotelModal
          show={showCategroy}
          handleShowModal={handleShowModalCategory}
          getAllHotelList={getAllHotelList}
        />
      )} */}
      {/* {showUpdate && ( */}
      {/* <EditHotelModal
        // showEdit={showEdit}
        // handleEditModal={handleEditModal}
        handleShowModalUpdate={handleShowModalUpdate}
        showUpdate={showUpdate}
        hotels={hotels}
        id={selected_hotel}
        // show={show}
      /> */}
      {/* )} */}
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

export default ProductCategory;
