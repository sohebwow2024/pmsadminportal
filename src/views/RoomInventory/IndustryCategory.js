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

  const INDUSTRY_CATEGORY_STORAGE_KEY = "industry_category_table_rows";

  const defaultData = [
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

  const formatCreationTime = (date) => {
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = `${date.getDate()}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day},${year}`;
  };

  const loadRows = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(INDUSTRY_CATEGORY_STORAGE_KEY),
      );
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (e) {
      // ignore
    }
    return defaultData;
  };

  const [data, setData] = useState(loadRows);
  const [selectedRow, setSelectedRow] = useState(null);

  const persistRows = (next) => {
    setData(next);
    localStorage.setItem(INDUSTRY_CATEGORY_STORAGE_KEY, JSON.stringify(next));
  };

  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => {
    setCancelOpen(!cancelOpen);
    if (cancelOpen) setSelectedRow(null);
  };

  const [showCategroy, setShowCategroy] = useState(false);
  const handleShowModalCategory = () => setShowCategroy(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleShowModalUpdate = () => setShowUpdate(!showUpdate);

  const [selected_hotel, setSelected_hotel] = useState();

  const [del, setDel] = useState(false);
  const handleDelModal = () => setDel(!del);

  // const [OTA, SetOTA] = useState(false);
  // const handleOTA = () => SetOTA(!OTA);

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

  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [noOfFloor, setNoOfFloor] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [logo, setLogo] = useState("");
  const [display, setDisplay] = useState(false);

  const resetAddCategoryForm = () => {
    setHotelName("");
    setDisplay(false);
  };

  const handleCloseAddModal = () => {
    resetAddCategoryForm();
    setSelectedRow(null);
    setShowCategroy(false);
  };

  const resetUpdateForm = () => {
    setHotelName("");
    setAddress("");
    setDisplay(false);
  };

  const handleCloseUpdateModal = () => {
    resetUpdateForm();
    setSelectedRow(null);
    setShowUpdate(false);
  };

  const toastOptions = { position: "top-right" };

  const handleSubmit = async () => {
    setDisplay(true);

    const isUpdate = showUpdate === true;
    const nameValue = isUpdate ? address : hotelName;
    const trimmedName = (nameValue || "").trim();

    if (!trimmedName) {
      toast.error("Please enter category name", toastOptions);
      return;
    }

    const exists = data.some((c) => {
      const sameName =
        `${c?.name || ""}`.trim().toLowerCase() === trimmedName.toLowerCase();
      if (!sameName) return false;
      if (!isUpdate) return true;
      return `${c?.id}` !== `${selectedRow?.id}`;
    });

    if (exists) {
      toast.error("Category already exists", toastOptions);
      return;
    }

    if (isUpdate) {
      if (!selectedRow?.id) return;

      const next = data.map((c) =>
        `${c.id}` === `${selectedRow.id}` ? { ...c, name: trimmedName } : c,
      );
      persistRows(next);
      toast.success("Category updated", { position: "top-center" });
      handleCloseUpdateModal();
      return;
    }

    const newRow = {
      id: `${Date.now()}`,
      name: trimmedName,
      dates: formatCreationTime(new Date()),
      action: "btns",
    };
    persistRows([newRow, ...data]);
    toast.success("Category added", { position: "top-center" });
    handleCloseAddModal();
  };

  const handleDeleteCategory = () => {
    if (!selectedRow?.id) {
      toast.error("Please select a category to delete", { position: "top-center" });
      return;
    }
    const next = data.filter((c) => `${c.id}` !== `${selectedRow.id}`);
    persistRows(next);
    toast.success("Category deleted", { position: "top-center" });
    setSelectedRow(null);
    setCancelOpen(false);
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
              setSelectedRow(row);
              setAddress(row?.name || "");
              handleShowModalUpdate(true);
              // setGuestId(row.guestID);
            }}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              setSelectedRow(row);
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
            <Button
              color="primary"
              onClick={() => {
                resetAddCategoryForm();
                setSelectedRow(null);
                setShowCategroy(true);
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
                keyField="id"
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Modal
        isOpen={showCategroy}
        toggle={handleCloseAddModal}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCloseAddModal}>
          <span>
            <h4>Add Category</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="category"
                    placeholder="Category Name"
                    id="category"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    invalid={display && hotelName === ""}
                  />
                  {display && !hotelName ? (
                    <span className="error_msg_lbl">Enter Category Name </span>
                  ) : null}
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <Row className={"px-1"}>
          <hr className="mt-1"></hr>
          <Col md="12 text-lg-end text-md-center mt-1 pb-2">
            <Button
              className="me-1 btn btn-danger"
              color="secondary"
              outline
              // onClick={() => {
              //     setShow(!show)
              // }}
              onClick={handleCloseAddModal}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={handleSubmit}
              disabled={!hotelName.trim()}
            >
              Add Category
            </Button>
          </Col>
        </Row>
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
              color="primary"
              onClick={() => handleCancelOpen()}
            >
              Cancel
            </Button>
            <Button
              className="m-1"
              color="danger"
              // onClick={() => handleCancelBooking(id)}
              onClick={handleDeleteCategory}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      {/********* Update Modal *******/}
      <Modal
        isOpen={showUpdate}
        toggle={handleCloseUpdateModal}
        className="modal-dialog-centered modal-lg"
        // backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleCloseUpdateModal}>
          <span className=" mb-1">
            <h4>Update Industry Category</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <>
            <Form>
              <Row>
                {/* <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Category Id
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    // id="hotel"
                    placeholder="Category Id"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    invalid={display && hotelName === ""}
                  />
                  {display && !hotelName ? (
                    <span className="error_msg_lbl">Enter Category Id </span>
                  ) : null}
                </Col> */}
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="address">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Category Name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    invalid={display && address === ""}
                  />
                  {display && !address ? (
                    <span className="error_msg_lbl">Enter Category Name </span>
                  ) : null}
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <Row className={"px-1"}>
          <hr className="mt-1"></hr>
          <Col md="12 text-lg-end text-md-center mt-1 pb-2">
            <Button
              className="me-1 btn btn-danger"
              color="secondary"
              outline
              // onClick={() => {
              //     setShow(!show)
              // }}
              onClick={handleCloseUpdateModal}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={!address.trim()}
            >
              Submit
            </Button>
          </Col>
        </Row>
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
