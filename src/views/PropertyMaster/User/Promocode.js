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
import { useSelector } from "react-redux";

const initialPromocodeData = [
  {
    id: 1,
    promo: "SAVE20",
    type: "Short Term",
    volume: "Unlimited Usage",
  },
  {
    id: 2,
    promo: "WELCOME10",
    type: "Long Term",
    volume: "Limited Availability",
  },
];

const tenureTypeOptions = [
  { value: "short_term", label: "Short Term" },
  { value: "long_term", label: "Long Term" },
  { value: "fixed_tenure", label: "Fixed Tenure" },
  { value: "flexible_tenure", label: "Flexible Tenure" },
];

const modalFooterStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  justifyContent: "flex-end",
};

const modalActionButtonStyles = {
  flex: "1 1 160px",
};

const headerGroupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "nowrap",
  gap: "0.75rem",
  width: "100%",
};

const headerButtonStyles = {
  flex: "0 1 clamp(150px, 28vw, 210px)",
  padding: "clamp(0.35rem, 1vw, 0.5rem) clamp(0.6rem, 1.8vw, 1rem)",
  fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
  whiteSpace: "nowrap",
};

const Promocode = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Products";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { UserRole } = getUserData;

  const [promoData, setPromoData] = useState(initialPromocodeData);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [tenureType, setTenureType] = useState(null);
  const [unitVolume, setUnitVolume] = useState("");
  const [display, setDisplay] = useState(false);

  const resetForm = () => {
    setPromoCode("");
    setTenureType(null);
    setUnitVolume("");
    setDisplay(false);
    setSelectedPromoId(null);
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

  const handleCancelOpen = () => setCancelOpen(!cancelOpen);

  const validateForm = () => {
    setDisplay(true);

    if (!promoCode.trim() || !tenureType || !unitVolume.trim()) {
      toast.error("please enter required fields!", {
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const isPromocodeFormComplete =
    !!promoCode.trim() && !!tenureType && !!unitVolume.trim();

  const buildPromoPayload = () => ({
    id: selectedPromoId || Date.now(),
    promo: promoCode.trim(),
    type: tenureType.label,
    volume: unitVolume.trim(),
  });

  const handleAddPromocode = () => {
    if (!validateForm()) {
      return;
    }

    const payload = buildPromoPayload();
    setPromoData((prev) => [...prev, payload]);
    toast.success("Promocode added successfully", {
      position: "top-center",
    });
    handleShowModal();
  };

  const handleEditClick = (row) => {
    setSelectedPromoId(row.id);
    setPromoCode(row.promo);
    setTenureType(
      tenureTypeOptions.find((item) => item.label === row.type) || null,
    );
    setUnitVolume(row.volume);
    setDisplay(false);
    setShowUpdate(true);
  };

  const handleUpdatePromocode = () => {
    if (!validateForm() || !selectedPromoId) {
      return;
    }

    const payload = buildPromoPayload();
    setPromoData((prev) =>
      prev.map((item) => (item.id === selectedPromoId ? payload : item)),
    );
    toast.success("Promocode updated successfully", {
      position: "top-center",
    });
    handleShowModalUpdate();
  };

  const handleDeletePromocode = () => {
    if (!selectedPromoId) {
      return;
    }

    setPromoData((prev) => prev.filter((item) => item.id !== selectedPromoId));
    toast.success("Promocode deleted successfully", {
      position: "top-center",
    });
    setSelectedPromoId(null);
    setCancelOpen(false);
  };

  const hotelTable = [
    {
      name: "Promo Code",
      sortable: true,
      minWidth: "120px",
      cell: (row) => <span>{row.promo}</span>,
    },
    {
      name: "Tenure Type",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Unit Volume",
      sortable: true,
      minWidth: "160px",
      cell: (row) => <span>{row.volume}</span>,
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
            onClick={() => handleEditClick(row)}
            size={15}
          />
          <Trash
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              setSelectedPromoId(row.id);
              handleCancelOpen();
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
          <div style={headerGroupStyles}>
            <CardTitle className="mb-0">
              <h2 className="mb-0">Promocode</h2>
            </CardTitle>
            {UserRole === "SuperAdmin" ? (
              <Button
                color="primary"
                onClick={handleShowModal}
                style={headerButtonStyles}
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
                Add Promocode
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardBody>
          <Row className="my-1">
            <Col>
              <div style={{ overflowX: "auto" }}>
                <DataTable
                  noHeader
                  data={promoData}
                  columns={hotelTable}
                  className="react-dataTable"
                  responsive
                />
              </div>
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
          Delete Promo Code
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">Are you sure you want to delete?</h3>
          <Col className="text-center">
            <Button className="m-1" color="primary" onClick={handleCancelOpen}>
              Cancel
            </Button>
            <Button
              className="m-1"
              color="danger"
              onClick={handleDeletePromocode}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModal}>
          <span>
            <h4>Add Promocode</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Promo Code <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  invalid={display && promoCode.trim() === ""}
                />
                {display && !promoCode.trim() ? (
                  <span className="error_msg_lbl">Enter Promo Code </span>
                ) : null}
              </Col>

              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Tenure Type <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Tenure Type"
                  options={tenureTypeOptions}
                  value={tenureType}
                  onChange={setTenureType}
                />
                {display && !tenureType ? (
                  <span className="error_msg_lbl">Enter Tenure Type </span>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Unit Volume <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Unit Volume"
                  value={unitVolume}
                  onChange={(e) => setUnitVolume(e.target.value)}
                  invalid={display && unitVolume.trim() === ""}
                />
                {display && !unitVolume.trim() ? (
                  <span className="error_msg_lbl">Enter Unit Volume </span>
                ) : null}
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-1" />
          <Col xs="12" className="pb-2">
            <div style={modalFooterStyles}>
            <Button
              className="btn btn-danger"
              color="secondary"
              outline
              onClick={handleShowModal}
              style={modalActionButtonStyles}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddPromocode}
              disabled={!isPromocodeFormComplete}
              style={modalActionButtonStyles}
            >
              Add Promocode
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>

      <Modal
        isOpen={showUpdate}
        toggle={handleShowModalUpdate}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader className="bg-transparent" toggle={handleShowModalUpdate}>
          <span>
            <h4>Update Promocode</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Promo Code <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  invalid={display && promoCode.trim() === ""}
                />
              </Col>

              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Tenure Type <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Tenure Type"
                  options={tenureTypeOptions}
                  value={tenureType}
                  onChange={setTenureType}
                />
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label">
                  Unit Volume <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Unit Volume"
                  value={unitVolume}
                  onChange={(e) => setUnitVolume(e.target.value)}
                  invalid={display && unitVolume.trim() === ""}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1 px-sm-2">
          <hr className="mt-1" />
          <Col xs="12" className="pb-2">
            <div style={modalFooterStyles}>
            <Button
              className="btn btn-danger"
              color="secondary"
              outline
              onClick={handleShowModalUpdate}
              style={modalActionButtonStyles}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleUpdatePromocode}
              style={modalActionButtonStyles}
            >
              Submit
            </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Promocode;
