import React, { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  FormFeedback,
  CardHeader,
  UncontrolledDropdown,
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
import "../PropertyMaster/Hotel/Products.css";

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
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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

  const toastOptions = { position: "top-center" };

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
      toast.success("Category updated", toastOptions);
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
    setCurrentPage(0);
    toast.success("Category added", toastOptions);
    handleCloseAddModal();
  };

  const handleDeleteCategory = () => {
    if (!selectedRow?.id) {
      toast.error("Please select a category to delete", toastOptions);
      return;
    }
    const next = data.filter((c) => `${c.id}` !== `${selectedRow.id}`);
    persistRows(next);
    setCurrentPage(0);
    toast.success("Category deleted", toastOptions);
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

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      [item.id, item.name, item.dates]
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
      <Card className="products-page-card category-page-card">
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
          <Row className="products-toolbar align-items-center justify-content-between gx-2 gy-1 mb-1">
            <Col md="6" className="d-flex align-items-center">
              <span className="me-50">Show</span>
              <Input
                type="select"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "80px" }}
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
                  <table className="products-table category-table table table-hover">
                    <colgroup>
                      <col className="category-column-id" />
                      <col className="category-column-name" />
                      <col className="category-column-date" />
                      <col className="category-column-actions" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="text-start">Category Id</th>
                        <th className="text-start">Category Name</th>
                        <th className="text-start">Creation Time</th>
                        <th className="product-action-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <span className="category-id-text">{row.id}</span>
                            </td>
                            <td>
                              <span className="category-name-title">
                                {row.name}
                              </span>
                            </td>
                            <td>
                              <span className="category-date-text">
                                {row.dates}
                              </span>
                            </td>
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
                                      setSelectedRow(row);
                                      setAddress(row?.name || "");
                                      handleShowModalUpdate(true);
                                    }}
                                  >
                                    <Edit size={15} />
                                    <span>Edit</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="product-action-dropdown-item delete"
                                    onClick={() => {
                                      setSelectedRow(row);
                                      handleCancelOpen();
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
                          <td colSpan="4">
                            <div className="products-empty-state">
                              No categories found.
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
