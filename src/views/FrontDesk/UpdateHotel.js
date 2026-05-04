import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import {
  cityOptions,
  companyIndustryOptions,
  companySizeOptions,
  companyTypeOptions,
  countryOptions,
  stateOptions,
} from "./clientFormOptions";
import "./Hotel.css";
import "../PropertyMaster/Hotel/Products.css";

const getInitialFormState = (selectedClient) => ({
  type: selectedClient?.type || "",
  size: selectedClient?.size || "",
  industry: selectedClient?.industry || "",
  name: selectedClient?.name || "",
  tax: selectedClient?.tax || "",
  email: selectedClient?.email || "",
  phone: selectedClient?.phone || "",
  address1: selectedClient?.address1 || selectedClient?.address || "",
  address2: selectedClient?.address2 || "",
  country: selectedClient?.country || "",
  state: selectedClient?.state || "",
  city: selectedClient?.city || "",
  pincode: selectedClient?.pincode || "",
});

const UpdateHotel = ({ showUpdate, handleUpdateHotel, selectedClient, onUpdateClient }) => {
  const [formData, setFormData] = useState(getInitialFormState(selectedClient));
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (showUpdate) {
      setFormData(getInitialFormState(selectedClient));
      setDisplay(false);
    }
  }, [selectedClient, showUpdate]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(getInitialFormState(selectedClient));
    setDisplay(false);
    handleUpdateHotel();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setDisplay(true);

    if (
      !formData.name.trim() ||
      !formData.size.trim() ||
      !formData.industry.trim() ||
      !formData.type.trim() ||
      !formData.tax.trim()
    ) {
      return;
    }

    onUpdateClient(formData);
    handleUpdateHotel();
  };

  return (
    <>
      <Modal
        isOpen={showUpdate}
        toggle={handleUpdateHotel}
        className="modal-dialog-centered product-modal-dialog"
        contentClassName="product-modal-content border-0"
      >
        <ModalHeader
          className="product-modal-header bg-transparent"
          toggle={handleUpdateHotel}
          close={
            <button
              type="button"
              aria-label="Close"
              onClick={handleUpdateHotel}
              className="product-modal-close"
            >
              x
            </button>
          }
        >
          <h4 className="product-modal-title">Update Client</h4>
          <p className="product-modal-subtitle">
            Update client details for this page
          </p>
        </ModalHeader>

        <Form onSubmit={onSubmit}>
          <ModalBody className="product-modal-body">
            {/* ---------- HOTEL NAME ---------- */}
            <Row className="mb-1">
              <Col md={12}>
                <Label className="form-label">
                  Company Type <span className="text-danger">*</span>
                </Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Type"
                  options={companyTypeOptions}
                  value={
                    companyTypeOptions.find(
                      (option) => option.label === formData.type,
                    ) || null
                  }
                  onChange={(option) => updateField("type", option?.label || "")}
                />
                {display && !formData.type.trim() ? (
                  <span className="error_msg_lbl">Select Company Type </span>
                ) : null}
              </Col>
            </Row>

            {/* ---------- EMAIL & PHONE ---------- */}
            <Row className="mb-1">
              <Col lg="6" className="mb-1">
                <Label className="form-label" for="countries">
                   Company Size <span className="text-danger">*</span>
                </Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Size"
                  options={companySizeOptions}
                  value={
                    companySizeOptions.find(
                      (option) => option.label === formData.size,
                    ) || null
                  }
                  onChange={(option) => updateField("size", option?.label || "")}
                />
                {display && !formData.size.trim() ? (
                  <span className="error_msg_lbl">Enter Category </span>
                ) : null}
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for="countries">
                 Company Industry <span className="text-danger">*</span>
                </Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Industry"
                  options={companyIndustryOptions}
                  value={
                    companyIndustryOptions.find(
                      (option) => option.label === formData.industry,
                    ) || null
                  }
                  onChange={(option) =>
                    updateField("industry", option?.label || "")
                  }
                />
                {display && !formData.industry.trim() ? (
                  <span className="error_msg_lbl">Enter Industry </span>
                ) : null}
              </Col>

              <Col md={6}>
                <Label className="form-label">Company Name <span className="text-danger">*</span></Label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                {display && !formData.name.trim() ? (
                  <span className="error_msg_lbl">Enter Company Name </span>
                ) : null}
              </Col>
              <Col md={6}>
                <Label className="form-label">Tax Info <span className="text-danger">*</span></Label>
                <input
                  type="text"
                  placeholder="xx-xxxx789"
                  className="form-control"
                  value={formData.tax}
                  onChange={(e) => updateField("tax", e.target.value)}
                />
                {display && !formData.tax.trim() ? (
                  <span className="error_msg_lbl">Enter Tax Info </span>
                ) : null}
              </Col>

              <Col md={6}>
                <Label className="form-label">Email</Label>
                <input
                  type="email"
                  placeholder="company@sales.com"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">Phone No.</Label>
                <input
                  type="text"
                  placeholder="Phone No."
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </Col>
              
            </Row>

            {/* ---------- ADDRESS ---------- */}
            <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">Address 1</Label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="form-control"
                  value={formData.address1}
                  onChange={(e) => updateField("address1", e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">Address 2</Label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="form-control"
                  value={formData.address2}
                  onChange={(e) => updateField("address2", e.target.value)}
                />
              </Col>
            </Row>

            {/* ---------- CITY & COUNTRY ---------- */}
            <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">Country</Label>
               <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Country"
                  options={countryOptions}
                  value={
                    countryOptions.find(
                      (option) => option.label === formData.country,
                    ) || null
                  }
                  onChange={(option) =>
                    updateField("country", option?.label || "")
                  }
                />
              </Col>

              <Col md={6}>
                <Label className="form-label">State</Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select State"
                  options={stateOptions}
                  value={
                    stateOptions.find(
                      (option) => option.label === formData.state,
                    ) || null
                  }
                  onChange={(option) => updateField("state", option?.label || "")}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">City</Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select City"
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (option) => option.label === formData.city,
                    ) || null
                  }
                  onChange={(option) => updateField("city", option?.label || "")}
                />
              </Col>
              <Col md={6}>
                <Label className="form-label">Pincode</Label>
                <input
                  type="text"
                  placeholder="Pincode"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                />
              </Col>
              
            </Row>

            {/* ---------- ROOM COUNT & ACTIVE USERS ---------- */}
            {/* <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">Room Count</Label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                />
              </Col>

              <Col md={6}>
                <Label className="form-label">Active Users</Label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                />
              </Col>
            </Row> */}
          </ModalBody>

          {/* ---------- FOOTER ---------- */}
          <div className="product-modal-footer">
            <Button
              color="primary"
              type="submit"
              className="product-modal-action"
            >
              Update
            </Button>
            <button
              type="button"
              onClick={handleReset}
              className="btn product-modal-action product-modal-cancel"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Modal>


      {/* {open ? <div className="modal-backdrop fade show"></div> : null} */}
    </>
  );
};

export default UpdateHotel;
