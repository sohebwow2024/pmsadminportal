import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
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
import Hotel from "../FrontDesk/Hotel.css";

const initialFormState = {
  type: "",
  size: "",
  industry: "",
  name: "",
  tax: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
};

const AddHotel = ({ open, handleOpen, onAddClient }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [display, setDisplay] = useState(false);

  const isAddDisabled =
    !formData.name.trim() ||
    !formData.size.trim() ||
    !formData.industry.trim() ||
    !formData.type.trim() ||
    !formData.tax.trim();

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setDisplay(false);
    handleOpen();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setDisplay(true);

    if (isAddDisabled) {
      return;
    }

    onAddClient(formData);
    handleReset();
  };

  return (
    <>
      {/* <Modal
        isOpen={open}
        toggle={() => handleOpen()}
        className="modal-dialog-centered modal-md"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={() => handleOpen()}><h3 className="fw-bolder"> New Hotel</h3>
          <p>Register a new hotel property</p></ModalHeader>
        <Form>
          <ModalBody>
            <Row className="d-flex flex-column justify-content-center align-items-center">
              <Col className="mt-1 d-flex flex-column">
                <Col className="mx-1">
                  <Label className="form-label" for="name">
                    Hotel Name <span className="text-danger">*</span>
                  </Label>
                  <input type="text" placeholder="e.g.,Grand plaza hotel" className="form-control input-default w-100" />

                </Col>

              </Col>

              <Col className="mt-1 d-flex flex-md-row flex-column">
                <Col className="mx-1">
                  <Label className="form-label" for="last_name">
                    Email<span className="text-danger">*</span>
                  </Label>
                  <input type="textarea" placeholder="Brief Description..." className="form-control input-default w-100" />
                </Col>

                <Col className="mx-1">
                  <Label className="form-label" for="last_name">
                    Phone<span className="text-danger">*</span>
                  </Label>
                  <input type="textarea" placeholder="Brief Description..." className="form-control input-default w-100" />
                </Col>

              </Col>
              <Row>
                <Col className="mx-1">
                  <Label className="form-label" for="dob">
                    Address
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
              </Row>


              <Col className="mt-1 d-flex flex-md-row flex-column">

                <Row>
                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      CIty<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Country<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>
                </Row>
                <Row>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Room Count<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Active users<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>
                </Row>



              </Col>
              <Col className="mt-1 d-flex flex-md-row flex-column">
                <Col className="mx-1">Add
                  <Label className="form-label" for="address">
                    Max Rooms<span className="text-danger">*</span>
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
                <Col className="mx-1">
                  <Label className="form-label" for="address">
                    Max Users<span className="text-danger">*</span>
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col xs={12} className="text-center">
              <Button className="me-1" color="primary" onClick={onSubmit}>
                Submit
              </Button>
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={() => handleReset()}
              >
                Discard
              </Button>
            </Col>
          </ModalFooter>
        </Form>
      </Modal> */}

      <Modal
        isOpen={open}
        toggle={handleReset}
        className="modal-dialog-centered modal-lg hotel-modal-header"
        backdrop={false}
      >
        {/* ---------- HEADER ---------- */}

        <ModalHeader className="bg-transparent" toggle={handleReset}>
          <span>
            <h4>Add Client</h4>
          </span>
        </ModalHeader>
        <hr className="m-0"></hr>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            {/* ---------- HOTEL NAME ---------- */}
            <Row className="mb-1">
              <Col md={12}>
                <Label className="form-label">
                  Company Name <span className="text-danger">*</span>
                </Label>
                <Input
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

              <Col md={6}>
                <Label className="form-label">
                  Tax Info <span className="text-danger">*</span>
                </Label>
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
          <ModalFooter className="justify-content-end">
            <Button className="btn btn-danger" outline onClick={handleReset}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isAddDisabled}>
              Add Client
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {open ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default AddHotel;
