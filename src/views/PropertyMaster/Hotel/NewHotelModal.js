import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import axios, { Image_base_uri } from "../../../API/axios";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";

let currency = [
  { value: "INR", label: "INR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const productModalHeaderStyles = {
  display: "block",
  position: "relative",
  padding: "2.8rem 2.5rem 0.75rem",
  borderBottom: 0,
  textAlign: "center",
};

const productModalBodyStyles = {
  maxWidth: "560px",
  width: "100%",
  margin: "0 auto",
  padding: "0.25rem 1rem 1rem",
};

const productModalTitleStyles = {
  margin: 0,
  fontSize: "1.35rem",
  fontWeight: 700,
};

const productModalSubtitleStyles = {
  marginTop: "0.85rem",
  marginBottom: 0,
  color: "#6b6f82",
  fontSize: "0.95rem",
};

const productModalFieldStyles = {
  minHeight: "38px",
  borderRadius: "0.357rem",
};

const productModalTextareaStyles = {
  minHeight: "108px",
  borderRadius: "0.357rem",
};

const productModalFooterStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "0.75rem",
  padding: "0.5rem 1rem 2.6rem",
};

const productModalFooterButtonStyles = {
  minWidth: "108px",
};

const productModalCloseButtonStyles = {
  position: "absolute",
  top: "-0.45rem",
  right: "-0.45rem",
  width: "28px",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "4px",
  background: "#fff",
  color: "#6e6b7b",
  fontSize: "1.25rem",
  lineHeight: 1,
  boxShadow: "0 4px 12px rgba(34, 41, 47, 0.12)",
};

const NewHotelModal = ({
  setShow,
  show,
  handleShowModal,
  getAllHotelList,
  onAddProduct,
}) => {
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, CompanyID } = getUserData;

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");

  const getCountryData = async () => {
    try {
      const countryListBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      const res = await axios.post(
        `/getdata/regiondata/countrydetails`,
        countryListBody,
      );
      console.log("countryres", res);
      let data = res?.data[0];
      if (data.length > 0) {
        const options = data.map((c) => {
          return { value: c.countryID, label: c.countryName, ...c };
        });
        setCountryList(options);
      }
    } catch (error) {
      console.log("Country List Error", error);
    }
  };

  const getStateData = async () => {
    try {
      const stateDetailsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        CountryID: countryId,
        Event: "select",
      };
      const res = await axios.post(
        `/getdata/regiondata/statedetails`,
        stateDetailsBody,
      );
      console.log("stateres", res);
      let data = res?.data[0];
      if (data.length > 0) {
        const options = data.map((s) => {
          return { value: s.stateID, label: s.stateName };
        });
        setStateList(options);
      }
    } catch (error) {
      console.log("State List Error", error);
    }
  };

  const getCityData = async () => {
    try {
      const cityListBody = {
        LoginID,
        Token,
        Seckey: "abc",
        DistrictID: stateId,
        StateID: stateId,
        Event: "select",
      };
      const res = await axios.post(
        `/getdata/regiondata/citydetails`,
        cityListBody,
      );
      console.log("cityres", res);
      let data = res?.data[0];
      if (data.length > 0) {
        const options = data.map((ci) => {
          return { value: ci.cityID, label: ci.cityName };
        });
        setCityList(options);
      } else setCityList([]);
    } catch (error) {
      console.log("City List Error", error);
    }
  };

  useEffect(() => {
    getCountryData();
    getStateData();
    getCityData();
  }, [countryId, stateId, cityId]);

  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [noOfFloor, setNoOfFloor] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [acc_startDate, setAcc_startDate] = useState("");
  const [acc_endDate, setAcc_endDate] = useState("");
  const [gst, setGst] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [pincode, setPincode] = useState("");
  const [surname, setSurname] = useState("");
  const [personName, setPersonName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [propertydescription, setPropertydescription] = useState("");
  const [display, setDisplay] = useState(false);
  const [productCategoryValue, setProductCategoryValue] = useState("");
  const [industryCategoryValue, setIndustryCategoryValue] = useState("");

  const isAddDisabled =
    !hotelName?.trim() ||
    !productCategoryValue?.trim() ||
    !industryCategoryValue?.trim();

  const hotelObj = {
    id: Math.floor(Math.random() * 100),
    hotelName,
    address,
    noOfFloor,
    country,
    state,
    city,
    contact,
    email,
    baseCurrency,
    acc_startDate,
    acc_endDate,
    gst,
    bankName,
    accountNumber,
    branch,
    ifsc,
    website,
    logo,
  };

  const productcategory = [
    { value: "private_limited", label: "Private Limited Company" },
    { value: "public_limited", label: "Public Limited Company" },
    { value: "partnership", label: "Partnership Firm" },
    { value: "startup", label: "Startup" },
    { value: "enterprise", label: "Enterprise" },
  ];

  const industryCategory = [
    { value: "private_limited", label: "Private Limited Company" },
    { value: "public_limited", label: "Public Limited Company" },
    { value: "government", label: "Government Organization" },
    { value: "ngo", label: "Non-Profit Organization (NGO)" },
  ];

  const handleSubmit = async () => {
    // Products page: add locally without API (keeps modal UI unchanged)
    if (typeof onAddProduct === "function") {
      setDisplay(true);
      if (!hotelName || !productCategoryValue || !industryCategoryValue) {
        toast.error("please enter required fields!", {
          position: "top-center",
        });
        return;
      }

      const wasAdded = onAddProduct({
        name: hotelName,
        category: productCategoryValue,
        industry: industryCategoryValue,
        desc: address,
      });

      if (!wasAdded) {
        return;
      }

      handleShowModal();
      setHotelName("");
      setAddress("");
      setProductCategoryValue("");
      setIndustryCategoryValue("");
      setDisplay(false);
      return;
    }

    let uploadedImage;
    if (logo !== "") {
      let imageformData = new FormData();
      imageformData.append("File", logo);
      imageformData.append("CompanyID", CompanyID);
      console.log("imageformData", imageformData);
      try {
        const res = await axios({
          method: "post",
          baseURL: `${Image_base_uri}`,
          url: "/api/property/hotel/uploadlogo",
          data: imageformData,
          headers: {
            "Content-Type": "multipart/form-data",
            LoginID,
            Token,
          },
        });
        console.log("res", res);
        if (res.data.FileName) {
          // setNewPoslogo(res.data.FileName)
          // handleRefresh()
          // setUploadImgStatus(true)
          uploadedImage = res.data.FileName;
        }
      } catch (error) {
        console.log("error", error);
        // setUploadImgStatus(false)
        return 0;
      }
    }
    console.log(uploadedImage);
    try {
      const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/;
      const lonRegex = /^-?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/;
      const phoneregex = /^\+\d{1,3}\d{9,10}$/;
      setDisplay(true);
      // console.log(CompanyID);
      if (
        hotelName &&
        address &&
        noOfFloor &&
        country &&
        pincode &&
        latitude &&
        longitude &&
        personName &&
        state &&
        city &&
        email &&
        baseCurrency &&
        gst &&
        bankName &&
        accountNumber &&
        branch &&
        ifsc !== ""
      ) {
        if (
          latRegex.test(latitude) &&
          latitude >= -90 &&
          latitude <= 90 &&
          lonRegex.test(longitude) &&
          longitude >= -180 &&
          longitude <= 180
        ) {
          if (phoneregex.test(contact)) {
            if (
              CompanyID !== "" &&
              CompanyID !== "null" &&
              CompanyID !== null
            ) {
              const long = Number(longitude);
              const lat = Number(latitude);
              const body = {
                LoginID: LoginID,
                Token: Token,
                CompanyID: CompanyID,
                HotelName: hotelName,
                HotelType: "Hotel",
                HotelTypeCode: "1",
                PropertyDesc: propertydescription,
                FloorCount: noOfFloor,
                AddressLine: address,
                CityID: cityId,
                CityName: city,
                CountryCode: countryCode,
                CountryName: country,
                PostalCode: pincode,
                Longitude: long.toFixed(10),
                Latitude: lat.toFixed(10),
                TimeZone: "Asia/Kolkata",
                LanguageCode: "en",
                CurrencyCode: baseCurrency,
                PropertyLicenseNumber: licenseNumber,
                LogoFile: uploadedImage, // need to send the file content as well
                WebSIte: website,
                BankName: bankName,
                AccountNumber: accountNumber,
                Branch: branch,
                IFSC: ifsc,
                GSTNumber: gst,
                ContactPersonName: personName,
                Surname: surname,
                PhoneNumber: contact,
                Email: email,
                Seckey: "abc",
              };
              console.log("body", body);
              const res = await axios.post("/property/hotel", body);
              console.log("response: ", res.data[0]);
              if (res.data[0][0].status === "Success") {
                handleShowModal();
                toast.success(res.data[0][0].message, {
                  position: "top-center",
                });
                getAllHotelList();
              }
            } else {
              toast.error("Company Id Cannot be null!", {
                position: "top-center",
              });
            }
          } else {
            toast.error(
              "please enter correct Phone Number with country code!",
              { position: "top-center" },
            );
          }
        } else {
          toast.error("please enter correct Longitude and Latitude value!", {
            position: "top-center",
          });
        }
      } else {
        toast.error("please enter required fields!", {
          position: "top-center",
        });
      }
    } catch (e) {
      toast.error(e.response.data.message, { position: "top-center" });

      console.log(e);
      handleShowModal();
    }
  };

  return (
    <>
      <Modal
        isOpen={show}
        toggle={handleShowModal}
        className="modal-dialog-centered modal-lg"
        contentClassName="border-0 rounded-3"
        backdrop={false}
      >
        <ModalHeader
          className="bg-transparent"
          close={
            <button
              type="button"
              aria-label="Close"
              onClick={handleShowModal}
              style={productModalCloseButtonStyles}
            >
              ×
            </button>
          }
          style={productModalHeaderStyles}
        >
          <h4 style={productModalTitleStyles}>Add Product</h4>
          <p style={productModalSubtitleStyles}>
            Add product details for this page
          </p>
        </ModalHeader>
        <ModalBody style={productModalBodyStyles}>
          <Form>
            <Row>
              <Col xs="12" className="mb-1">
                <Label className="form-label" for="hotel">
                  Product Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="hotel"
                  placeholder="Product Name"
                  id="hotel"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  invalid={display && hotelName === ""}
                  style={productModalFieldStyles}
                />
                {display && !hotelName ? (
                  <span className="error_msg_lbl">Enter Product Name </span>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6" className="mb-1">
                <Label className="form-label" for="countries">
                  Product Category <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Product Category"
                  options={productcategory}
                  value={
                    productcategory.find(
                      (o) => o.label === productCategoryValue,
                    ) || null
                  }
                  onChange={(e) => {
                    setProductCategoryValue(e?.label || "");
                    setCountryId(e.value);
                    setCountryCode(e.CountryCode);
                    setCountry(e.label);
                  }}
                  invalid={display && productCategoryValue === ""}
                />
                {display && !productCategoryValue ? (
                  <span className="error_msg_lbl">Select Product Category </span>
                ) : null}
              </Col>
              <Col xs="12" md="6" className="mb-1">
                <Label className="form-label" for="industry-category">
                  Industry Category <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  inputId="industry-category"
                  placeholder="Select Industry Category"
                  options={industryCategory}
                  value={
                    industryCategory.find(
                      (o) => o.label === industryCategoryValue,
                    ) || null
                  }
                  onChange={(e) => {
                    setIndustryCategoryValue(e?.label || "");
                    setCountryId(e.value);
                    setCountryCode(e.CountryCode);
                    setCountry(e.label);
                  }}
                />
                {display && !industryCategoryValue ? (
                  <span className="error_msg_lbl">
                    Select Industry Category{" "}
                  </span>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-0">
                <Label className="form-label" for="address">
                  Product Description{" "}
                </Label>
                <Input
                  type="textarea"
                  name="address"
                  placeholder="Enter Product Description"
                  id="address"
                  onChange={(e) => setAddress(e.target.value)}
                  style={productModalTextareaStyles}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <div style={productModalFooterStyles}>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={isAddDisabled}
            style={productModalFooterButtonStyles}
          >
            Add Product
          </Button>
          <Button
            color="secondary"
            onClick={handleShowModal}
            style={productModalFooterButtonStyles}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      {show ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default NewHotelModal;
