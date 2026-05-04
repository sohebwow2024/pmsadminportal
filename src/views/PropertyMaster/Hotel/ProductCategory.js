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
import axios, { Image_base_uri } from "../../../API/axios";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import NewHotelModal from "./NewHotelModal";
import EditHotelModal from "./EditHotelModal";
import DeleteHotelModal from "./DeleteHotelModal";
import HotelOTA from "./HotelOTA";
import Avatar from "@components/avatar";
import api from "../../../api";
import "./Products.css";

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
  const CATEGORY_STORAGE_KEY = "product_category_table_rows";

  const defaultCategories = [
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

  const loadCategories = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (e) {
      // ignore
    }
    return defaultCategories;
  };

  const [data, setData] = useState(loadCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const persistCategories = (next) => {
    setData(next);
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next));
  };
  const newToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJTb2hlYkFwcmlsMTIzIiwiZW1haWwiOiJ0ZXN0MTIzNDU1MTIzQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTU0MDQyNSwiZXhwIjoxNzc1NjI2ODI1fQ.uEE7xILzv5E3J0xl-tS-g3eJIolnecPA0Tof8TbjrHY";
  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => {
    setCancelOpen(!cancelOpen);
    if (cancelOpen) setSelectedCategory(null);
  };

  const [showCategroy, setShowCategroy] = useState(false);
  const handleShowModalCategory = () => setShowCategroy(!show);

  const [categoryId, setCategoryId] = useState("");
  const [address, setAddress] = useState("");
  const [noOfFloor, setNoOfFloor] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [logo, setLogo] = useState("");

  // const handleAddCategory = async () => {
  //   console.log("==============>");

  //   if (!categoryName) {
  //     toast.error("Please enter category name", {
  //       position: "top-right",
  //     });
  //     return;
  //   }
  //   try {
  //     const payload = {
  //       category_name: categoryName,
  //       LoginID,
  //       Token,
  //     };
  //     console.log("payload", payload);

  //     const res = await api.post("/api/products/category", payload, {
  //       headers: {
  //         LoginID,
  //         Token,
  //         Authorization: `Bearer ${Token}`,
  //       },
  //     });

  //     if (res?.status === 200 || res?.status === 201) {
  //       toast.success("Category added successfully", {
  //         position: "top-right",
  //       });
  //       setCategoryName("");
  //       setShowCategroy(false);
  //     }
  //   } catch (error) {
  //     console.log("add category error", error);
  //     toast.error(error?.response?.data?.Message || "Failed to add category", {
  //       position: "top-right",
  //     });
  //   }
  // };

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleShowModalUpdate = () => setShowUpdate(!showUpdate);
  // const [handleSubmit] = useState(false);

  const [selected_hotel, setSelected_hotel] = useState();

  const [del, setDel] = useState(false);
  const handleDelModal = () => setDel(!del);
  const [display, setDisplay] = useState(false);

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
  // }, [categoryName])

  console.log("test");

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

  const handleSubmit = async () => {
    const trimmedName = (categoryName || "").trim();
    setDisplay(true);

    if (!trimmedName) {
      toast.error("Please enter category name", { position: "top-right" });
      return;
    }

    const nameExists = (nextName, excludeId = null) =>
      data.some(
        (c) =>
          `${c?.name || ""}`.trim().toLowerCase() ===
            nextName.trim().toLowerCase() && `${c?.id}` !== `${excludeId}`,
      );

    // Update Category
    if (showUpdate) {
      if (!selectedCategory?.id) return;

      if (nameExists(trimmedName, selectedCategory.id)) {
        toast.error("Category already exists", { position: "top-center" });
        return;
      }

      const next = data.map((c) =>
        `${c.id}` === `${selectedCategory.id}` ? { ...c, name: trimmedName } : c,
      );
      persistCategories(next);
      toast.success("Category updated", { position: "top-center" });
      setSelectedCategory(null);
      handleCloseUpdateModal();
      return;
    }

    // Add Category
    if (nameExists(trimmedName)) {
      toast.error("Category already exists", { position: "top-center" });
      return;
    }

    const newRow = {
      id: `${Date.now()}`,
      name: trimmedName,
      dates: formatCreationTime(new Date()),
      action: "btns",
    };

    persistCategories([newRow, ...data]);
    setCurrentPage(0);
    toast.success("Category added", { position: "top-center" });
    setSelectedCategory(null);
    handleCloseCategoryModal();
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory?.id) return;
    const next = data.filter((c) => `${c.id}` !== `${selectedCategory.id}`);
    persistCategories(next);
    setCurrentPage(0);
    toast.success("Category deleted", { position: "top-center" });
    setSelectedCategory(null);
    setCancelOpen(false);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryId("");
    setDisplay(false);
  };

  const handleCloseCategoryModal = () => {
    resetCategoryForm();
    setSelectedCategory(null);
    setShowCategroy(false);
  };

  const resetUpdateForm = () => {
    setCategoryId("");
    setCategoryName("");
    setDisplay(false);
  };

  const handleCloseUpdateModal = () => {
    resetUpdateForm();
    setSelectedCategory(null);
    setShowUpdate(false);
  };
  return (
    <>
      <Card className="products-page-card category-page-card">
        <CardHeader>
          <CardTitle>
            <h2>Category</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button
              color="primary"
              onClick={() => {
                resetCategoryForm();
                setSelectedCategory(null);
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
                                      setSelectedCategory(row);
                                      setCategoryId(row.id);
                                      setCategoryName(row.name);
                                      handleShowModalUpdate(true);
                                    }}
                                  >
                                    <Edit size={15} />
                                    <span>Edit</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="product-action-dropdown-item delete"
                                    onClick={() => {
                                      setSelectedCategory(row);
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
        toggle={handleCloseCategoryModal}
        className="modal-dialog-centered product-modal-dialog"
        contentClassName="product-modal-content border-0"
      >
        <ModalHeader
          className="product-modal-header bg-transparent"
          toggle={handleCloseCategoryModal}
          close={
            <button
              type="button"
              aria-label="Close"
              onClick={handleCloseCategoryModal}
              className="product-modal-close"
            >
              x
            </button>
          }
        >
          <h4 className="product-modal-title">Add Category</h4>
          <p className="product-modal-subtitle">
            Add category details for this page
          </p>
        </ModalHeader>
        <ModalBody className="product-modal-body">
          <>
            <Form>
              <Row>
                <Col xs="12" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    placeholder="Category Name"
                    id="hotel"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    invalid={display && categoryName === ""}
                    requrired
                  />
                  {display && !categoryName ? (
                    <span className="error_msg_lbl">Enter Category Name </span>
                  ) : null}
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <div className="product-modal-footer">
          <Button
            color="primary"
            type="button"
            onClick={handleSubmit}
            disabled={!categoryName.trim()}
            className="product-modal-action"
          >
            Add Category
          </Button>
          <button
            type="button"
            onClick={handleCloseCategoryModal}
            className="btn product-modal-action product-modal-cancel"
          >
            Cancel
          </button>
        </div>
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
        className="modal-dialog-centered product-modal-dialog"
        contentClassName="product-modal-content border-0"
        // backdrop={false}
      >
        <ModalHeader
          className="product-modal-header bg-transparent"
          toggle={handleCloseUpdateModal}
          close={
            <button
              type="button"
              aria-label="Close"
              onClick={handleCloseUpdateModal}
              className="product-modal-close"
            >
              x
            </button>
          }
        >
          <h4 className="product-modal-title">Update Category</h4>
          <p className="product-modal-subtitle">
            Update category details for this page
          </p>
        </ModalHeader>
        <ModalBody className="product-modal-body">
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
                    id="hotel"
                    placeholder="Category Id"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    invalid={display && categoryId === ""}
                  />
                  {display && !categoryId ? (
                    <span className="error_msg_lbl">Enter Category Id </span>
                  ) : null}
                </Col> */}
                <Col xs="12" className="mb-1">
                  <Label className="form-label" for="address">
                    Category Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    invalid={display && categoryName === ""}
                  />
                  {display && !categoryName ? (
                    <span className="error_msg_lbl">Enter Category Name </span>
                  ) : null}
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <div className="product-modal-footer">
          <Button
            type="button"
            color="primary"
            onClick={handleSubmit}
            className="product-modal-action"
          >
            Submit
          </Button>
          <button
            type="button"
            onClick={handleCloseUpdateModal}
            className="btn product-modal-action product-modal-cancel"
          >
            Cancel
          </button>
        </div>
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
