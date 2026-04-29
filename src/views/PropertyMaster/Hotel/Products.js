import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { Edit, Trash } from "react-feather";
import { AiOutlineCloudSync } from "react-icons/ai";
import {
  Button,
  Card,
  CardBody,
  Input,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  CardHeader,
  UncontrolledDropdown,
} from "reactstrap";
import toast from "react-hot-toast";
import axios, { Image_base_uri } from "../../../API/axios";
import avatarFive from "../../../assets/images/avatars/5.png";
import avatarSix from "../../../assets/images/avatars/6.png";
import avatarSeven from "../../../assets/images/avatars/7.png";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import NewHotelModal from "./NewHotelModal";
import EditHotelModal from "./EditHotelModal";
import DeleteHotelModal from "./DeleteHotelModal";
import HotelOTA from "./HotelOTA";
import Avatar from "@components/avatar";
import "./Products.css";

const Products = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Products";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, CompanyID, UserRole } = getUserData;

  const PRODUCTS_STORAGE_KEY = "products_table_products";

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

  const defaultProducts = [
    // {
    //   id: 1,
    //   type: "Basic",
    //   details: "something",
    //   dates: "22/8/2022",
    //   applicability: "all",
    //   action: "btns",
    // },
    {
      id: 1,
      name: "PMS",
      category: "Private",
      industry: "Pvt, Ltd Limited",
      desc: "Basic package details",
      action: "btns",
    },
    {
      id: 2,
      name: "LLM",
      category: "Public",
      industry: "Pvt, Ltd Limited",
      desc: "Basic package details",
      action: "btns",
    },
  ];

  const loadProducts = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.map((p, index) => ({
          id: p?.id ?? Date.now() + index,
          ...p,
        }));
      }
    } catch (e) {
      // ignore
    }
    return defaultProducts;
  };

  const [data, setData] = useState(loadProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const toastOptions = { position: "top-center" };

  const persistProducts = (next) => {
    setData(next);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
  };

  const normalizeValue = (value) =>
    value?.toString().trim().toLowerCase() || "";

  const isDuplicateProduct = (product, ignoreId = null) =>
    data.some(
      (item) =>
        item.id !== ignoreId &&
        normalizeValue(item.name) === normalizeValue(product.name) &&
        normalizeValue(item.category) === normalizeValue(product.category) &&
        normalizeValue(item.industry) === normalizeValue(product.industry),
    );

  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

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

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => {
    setCancelOpen(!cancelOpen);
    if (cancelOpen) setSelectedProduct(null);
  };

  const handleAddProduct = (product) => {
    if (isDuplicateProduct(product)) {
      toast.error("Product already exists", toastOptions);
      return false;
    }

    const next = [{ id: Date.now(), ...product, action: "btns" }, ...data];
    persistProducts(next);
    setCurrentPage(0);
    toast.success("Product added", toastOptions);
    return true;
  };

  const handleUpdateProduct = (updatedProduct) => {
    if (isDuplicateProduct(updatedProduct, updatedProduct.id)) {
      toast.error("Product already exists", toastOptions);
      return false;
    }

    const next = data.map((p) =>
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p,
    );
    persistProducts(next);
    toast.success("Product updated", toastOptions);
    return true;
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct?.id) {
      toast.error("Please select a product to delete", toastOptions);
      return;
    }
    const next = data.filter((p) => p.id !== selectedProduct.id);
    persistProducts(next);
    setSelectedProduct(null);
    setCancelOpen(false);
    setCurrentPage(0);
    toast.success("Product deleted", toastOptions);
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      [item.name, item.category, item.industry, item.desc]
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

  const handleSort = (column, direction) => {
    setSortField(column.sortField || column.selectorKey || "name");
    setSortDirection(direction);
    setCurrentPage(0);
  };

  const showingFrom = sortedData.length === 0 ? 0 : currentStartIndex + 1;
  const showingTo = Math.min(currentEndIndex, sortedData.length);
  const productAvatars = [avatarFive, avatarSix, avatarSeven];

  const getInitials = (value = "") =>
    value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("");

  const getProductAvatar = (row, index) =>
    productAvatars[Math.abs((row?.id ?? index) % productAvatars.length)];

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
      id: 1,
      name: "Product Name",
      sortable: true,
      minWidth: "80px",
      selector: (row) => row.name,
      sortField: "name",
      selectorKey: "name",
      cell: (row) => <span>{row.name}</span>,
    },

    {
      id: 2,
      name: "Product Category",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.category,
      sortField: "category",
      selectorKey: "category",
      cell: (row) => <span>{row.category}</span>,
    },
    {
      id: 3,
      name: "Industry Category",
      sortable: true,
      minWidth: "50px",
      selector: (row) => row.industry,
      sortField: "industry",
      selectorKey: "industry",
      cell: (row) => <span>{row.industry}</span>,
    },
    {
      id: 4,
      name: "Product Description",
      sortable: true,
      minWidth: "50px",
      selector: (row) => row.desc,
      sortField: "desc",
      selectorKey: "desc",
      cell: (row) => <span>{row.desc}</span>,
    },
    {
      id: 5,
      name: "Action",
      sortable: false,
      center: true,
      width: "9rem",

      selector: (row) => (
        <>
          <Edit
            className="me-1 cursor-pointer"
            onClick={() => {
              setSelectedProduct(row);
              handleShowModalUpdate(true);
              // setGuestId(row.guestID);
            }}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              setSelectedProduct(row);
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
      <Card className="products-page-card">
        <CardHeader>
          <CardTitle>
            <h2>Products</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button
              color="primary"
              onClick={() => {
                setSelectedProduct(null);
                setShow(true);
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
              Add Product
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
                  <table className="products-table table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Product Category</th>
                        <th>Users</th>
                        <th>Industry</th>
                        {/* <th>Status</th> */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {paginatedData.length ? (
                        paginatedData.map((row, index) => (
                          <tr key={row.id}>
                            <td>
                              <div className="product-name-block">
                                <span className="product-icon-badge">
                                  {getInitials(row.name) || "PR"}
                                </span>
                                <div>
                                  <span className="product-name-title">
                                    {row.name}
                                  </span>
                                  <span className="product-name-subtitle">
                                    {row.desc?.trim()
                                      ? row.desc
                                      : "Product details are available for this package."}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="product-category-badge">
                                {row.category}
                              </span>
                            </td>
                            <td>
                              <div className="product-users">
                                <img
                                  src={getProductAvatar(row, index)}
                                  alt="Product user"
                                  className="product-user-avatar"
                                />
                              </div>
                            </td>
                            <td>{row.industry}</td>
                            {/* <td>
                              <span className="product-status-badge">
                                Active
                              </span>
                            </td> */}
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
                                      setSelectedProduct(row);
                                      handleShowModalUpdate(true);
                                    }}
                                  >
                                    <Edit size={15} />
                                    <span>Edit</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="product-action-dropdown-item delete"
                                    onClick={() => {
                                      setSelectedProduct(row);
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
                          <td colSpan="6">
                            <div className="products-empty-state">
                              No products found.
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
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Product
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
              onClick={handleDeleteProduct}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      {show && (
        <NewHotelModal
          show={show}
          handleShowModal={handleShowModal}
          getAllHotelList={getAllHotelList}
          onAddProduct={handleAddProduct}
        />
      )}
      {/* {showUpdate && ( */}
      <EditHotelModal
        // showEdit={showEdit}
        // handleEditModal={handleEditModal}
        handleShowModalUpdate={handleShowModalUpdate}
        showUpdate={showUpdate}
        hotels={hotels}
        id={selected_hotel}
        product={selectedProduct}
        onUpdateProduct={handleUpdateProduct}
        // show={show}
      />
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

export default Products;
