import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  Input,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import axios from "../../../API/axios";
import { useSelector } from "react-redux";

const initialPlanRateData = [
  {
    id: 1,
    tenureType: { value: "short_term", label: "Short Term" },
    dprate: "40000",
    sellingprice: "50000",
    isdiscount: true,
  },
  {
    id: 2,
    tenureType: { value: "long_term", label: "Long Term" },
    dprate: "40000",
    sellingprice: "50000",
    isdiscount: false,
  },
];

const PlanRate = () => {
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
  const [show, setShow] = useState(false);
  const [planRates, setPlanRates] = useState(initialPlanRateData);

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedPlanRateId, setSelectedPlanRateId] = useState(null);

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
  }, []);

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
      name: "Tenure Type",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.tenureType?.label || "-"}</span>,
    },
    {
      name: "Dp Rate",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.dprate}</span>,
    },
    {
      name: "Selling Price",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.sellingprice}</span>,
    },
    {
      name: "isDiscountable",
      sortable: true,
      minWidth: "120px",
      cell: (row) => <span>{row.isdiscount ? "Yes" : "No"}</span>,
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
              setSelectedPlanRateId(row.id);
              setTenureTypeValue(row.tenureType);
              setDpRate(row.dprate);
              setSellingPrice(row.sellingprice);
              setIsDiscountable(row.isdiscount);
              setDisplay(false);
              setShowUpdate(true);
            }}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              setSelectedPlanRateId(row.id);
              handleCancelOpen();
            }}
          />
        </>
      ),
    },
  ];
  const [dpRate, setDpRate] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [tenureTypeValue, setTenureTypeValue] = useState(null);
  const [isDiscountable, setIsDiscountable] = useState(false);
  const [display, setDisplay] = useState(false);

  const tenureType = [
    { value: "short_term", label: "Short Term" },
    { value: "long_term", label: "Long Term" },
    { value: "fixed", label: "Fixed Tenure" },
    { value: "flexible", label: "Flexible Tenure" },
  ];

  const resetForm = () => {
    setTenureTypeValue(null);
    setDpRate("");
    setSellingPrice("");
    setIsDiscountable(false);
    setDisplay(false);
    setSelectedPlanRateId(null);
  };

  const handleShowModal = () => {
    if (!show) {
      resetForm();
    }
    setShow(!show);
  };

  const handleShowModalUpdate = () => {
    if (showUpdate) {
      resetForm();
    }
    setShowUpdate(!showUpdate);
  };

  const validateForm = () => {
    setDisplay(true);

    if (!tenureTypeValue || !dpRate.trim() || !sellingPrice.trim()) {
      toast.error("please enter required fields!", {
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const isPlanRateFormComplete =
    !!tenureTypeValue && !!dpRate.trim() && !!sellingPrice.trim();

  const buildPlanRatePayload = () => ({
    id: selectedPlanRateId || Date.now(),
    tenureType: tenureTypeValue,
    dprate: dpRate.trim(),
    sellingprice: sellingPrice.trim(),
    isdiscount: isDiscountable,
  });

  const handleAddPlanRate = () => {
    if (!validateForm()) {
      return;
    }

    const payload = buildPlanRatePayload();
    setPlanRates((prev) => [...prev, payload]);
    toast.success("Plan rate added", {
      position: "top-center",
    });
    handleShowModal();
  };

  const handleUpdatePlanRate = () => {
    if (!validateForm() || !selectedPlanRateId) {
      return;
    }

    const payload = buildPlanRatePayload();
    setPlanRates((prev) =>
      prev.map((item) => (item.id === selectedPlanRateId ? payload : item)),
    );
    toast.success("Plan rate updated", {
      position: "top-center",
    });
    handleShowModalUpdate();
  };

  const handleDeletePlanRate = () => {
    if (!selectedPlanRateId) {
      return;
    }

    setPlanRates((prev) => prev.filter((item) => item.id !== selectedPlanRateId));
    toast.success("Plan rate deleted", {
      position: "top-center",
    });
    setSelectedPlanRateId(null);
    setCancelOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Plan Rate</h2>
          </CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button color="primary" onClick={handleShowModal}>
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
              Add Plan Rate
            </Button>
          ) : null}
        </CardHeader>
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={planRates}
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
          Delete Plan Rate
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
              onClick={handleDeletePlanRate}
            >
              Confirm
            </Button>
            
          </Col>
        </ModalBody>
      </Modal>

      {/********* Edit Modal ********/}

      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-lg"
        // backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span>
            <h4>Update Plan Rate</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Tenure Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Select Tenure Type"
                    options={tenureType}
                    value={tenureTypeValue}
                    onChange={setTenureTypeValue}
                  />
                  {display && !tenureTypeValue ? (
                    <span className="error_msg_lbl">Enter Tenure Type </span>
                  ) : null}
                </Col>

                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Dp Rate <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Dp Rate"
                    id="dprate"
                    value={dpRate}
                    onChange={(e) => setDpRate(e.target.value)}
                    invalid={display && dpRate === ""}
                  />
                  {display && !dpRate ? (
                    <span className="error_msg_lbl">Enter Dp Rate </span>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Selling Price <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="hotel"
                    placeholder="Selling Price"
                    id="selling"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    invalid={display && sellingPrice === ""}
                  />
                  {display && !sellingPrice ? (
                    <span className="error_msg_lbl">Enter Selling Price </span>
                  ) : null}
                </Col>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="address">
                    isDiscountable{" "}
                  </Label>
                  <Col>
                    <Input
                      type="checkbox"
                      name="address"
                      placeholder="isDiscountable"
                      id="address"
                      checked={isDiscountable}
                      onChange={(e) => setIsDiscountable(e.target.checked)}
                    />
                  </Col>
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <Row className="px-1">
          <hr></hr>
          <Col md="12 text-lg-end text-md-center pb-2">
            <Button
              className="me-1 btn btn-danger"
              color="secondary"
              outline
              // onClick={() => {
              //     setShow(!show)
              // }}
              onClick={handleShowModalUpdate}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleUpdatePlanRate}>
              Submit
            </Button>
          </Col>
        </Row>
      </Modal>

      {/********* Add Modal ********/}
      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModal}>
          <span>
            <h4>Add Plan Rate</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <>
            <Form>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Tenure Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Select Tenure Type"
                    options={tenureType}
                    value={tenureTypeValue}
                    onChange={setTenureTypeValue}
                  />
                  {display && !tenureTypeValue ? (
                    <span className="error_msg_lbl">Enter Tenure Type </span>
                  ) : null}
                </Col>

                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="hotel">
                    Dp Rate <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="Dp Rate"
                    id="dprate"
                    value={dpRate}
                    onChange={(e) => setDpRate(e.target.value)}
                    invalid={display && dpRate === ""}
                  />
                  {display && !dpRate ? (
                    <span className="error_msg_lbl">Enter Dp Rate </span>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="countries">
                    Selling Price <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="hotel"
                    placeholder="Selling Price"
                    id="selling"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    invalid={display && sellingPrice === ""}
                  />
                  {display && !sellingPrice ? (
                    <span className="error_msg_lbl">Enter Selling Price </span>
                  ) : null}
                </Col>
                <Col lg="6" className="mb-1">
                  <Label className="form-label" for="address">
                    isDiscountable{" "}
                  </Label>
                  <Col>
                    <Input
                      type="checkbox"
                      name="address"
                      placeholder="isDiscountable"
                      id="address"
                      checked={isDiscountable}
                      onChange={(e) => setIsDiscountable(e.target.checked)}
                    />
                  </Col>
                </Col>
              </Row>
            </Form>
          </>
        </ModalBody>
        <Row className="px-1">
          <hr></hr>
          <Col md="12 text-lg-end text-md-center pb-2">
            <Button
              className="me-1 btn btn-danger"
              color="secondary"
              outline
              // onClick={() => {
              //     setShow(!show)
              // }}
              onClick={handleShowModal}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddPlanRate}
              disabled={!isPlanRateFormComplete}
            >
              Add Plan Rate
            </Button>
          </Col>
        </Row>
      </Modal>
      {show ? <div className="modal-backdrop fade show"></div> : null}

    </>
  );
};

export default PlanRate;
