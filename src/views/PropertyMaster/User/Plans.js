import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Trash, Users } from "react-feather";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaArchive } from "react-icons/fa";
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
  CardHeader,
  Badge,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import AccountSetupModal from "../AccountSetup/AccountSetupModal";
import axios from "../../../API/axios";
import { useSelector } from "react-redux";
import {
  cipherPasswordFunc,
  usersRoleDataApi,
} from "../../../common/commonMethods";

const userRoles = [
  { value: "Admin", label: "Admin" },
  { value: "Basic", label: "Basic" },
];

// const usersType = [
//     // { value: 'Employee1', label: 'Employee1' },
//     // { value: 'Employee2', label: 'Employee2' },
//     // { value: 'Employee3', label: 'Employee3' },
//     // { value: 'Employee4', label: 'Employee4' }
// ]

// let dat
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })

const Plans = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Plans";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const [open, setOpen] = useState(false);
  const [usersType, setUsersType] = useState([]);
  console.log("usersTypeCheck", usersType);
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  // console.log('getUserData', getUserData)

  const [show, setShow] = useState(false);
  const handleModal = () => setShow(!show);

  const getAccountUserList = useSelector(
    (state) => state.userManageSlice.userLists,
  );

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

  const [selected_user, setSelected_user] = useState();

  const [del, setDel] = useState(false);

  const [users, setUsers] = useState([]);

  let URLs = [
    "/authentication/userauthentication/loginauthentication",
    "/getdata/userdata/userdetails",
  ];

  useEffect(() => {
    // get users from api       let obj = {
    fetchPromise(URLs);

    // Promise.all([ axios.get('https://jsonplaceholder.typicode.com/todos'), axios.get('https://jsonplaceholder.typicode.com/users')]).the(res=>console.log(res))
  }, []);

  const fetchPromise = async (URLs) => {
    const userResponse = await getAllData(URLs);
    console.log("userResponse", userResponse);
    if (userResponse[0].success && userResponse[0]?.data[0]?.length > 0) {
      let arr = [];

      userResponse[0]?.data[0]?.map((v, i) => {
        arr.push({
          id: i + 1,
          loginId: v.loginID,
          userId: v.userID,
          user: v.firstName + " " + v.lastName,
          roleType: v.userRoleType,
          userRole: v.userRole,
          userName: v.username,
          email: v.email,
          Status: v.status,
        });
        setUsers(arr);
      });
      console.log("setUsers", arr);
    }
    if (userResponse[1].success && userResponse[1]?.data[0]?.length > 0) {
      console.log("userTypeData11", userResponse[1]?.data[0]);
      let arr = [];

      userResponse[1]?.data[0]?.map((v) => {
        arr.push({
          value: v.userID,
          label: v.firstName + " " + v.lastName + " (" + v.email + ")",
          roleType: v.accountTYpe,
          Status: v.status,
        });
        setUsersType(arr);
      });
      console.log("UsersType", arr);
    }
  };

  const getAllData = (URLs) => {
    return Promise.all(URLs.map(fetchData));
  };

  const fetchData = (URL) => {
    let obj = {
      LoginID,
      Token,
      Seckey: "abc",
      Event: "select",
    };
    return axios
      .post(URL, obj)
      .then((response) => {
        console.log("response", response);
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(function (error) {
        return { success: false };
      });
  };

  useEffect(() => {
    fetchPromise(URLs);
  }, [show, showEdit, del]);

  const NewUserModal = () => {
    const [user, setUser] = useState("");
    const [userId, setUserId] = useState("");
    const [userRole, setUserRole] = useState("");
    const [roleType, setRoleType] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [display, setDisplay] = useState(false);

    const userObj = {
      id: Math.floor(Math.random() * 100),
      user,
      userId,
      userRole,
      roleType,
      userName,
      password,
      email,
    };
    console.log("getAccountUserList", getAccountUserList);

    const [hotelName, setHotelName] = useState("");
    const [address, setAddress] = useState("");
    const [noOfFloor, setNoOfFloor] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [contact, setContact] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [logo, setLogo] = useState("");

    const handleSubmit = async () => {
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
        const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
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
          categoryName &&
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
                  CategoryName: categoryName,
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

    const planIncluding = [
      { value: "breakfast", label: "Breakfast Included" },
      { value: "lunch", label: "Lunch Included" },
      { value: "dinner", label: "Dinner Included" },
      { value: "all_meals", label: "All Meals Included" },
      { value: "wifi", label: "Free WiFi" },
      { value: "parking", label: "Free Parking" },
    ];

    const planExcluding = [
      { value: "breakfast", label: "Breakfast Not Included" },
      { value: "lunch", label: "Lunch Not Included" },
      { value: "dinner", label: "Dinner Not Included" },
      { value: "wifi", label: "WiFi Not Included" },
      { value: "parking", label: "Parking Not Included" },
      { value: "airport_transfer", label: "Airport Transfer Not Included" },
    ];

    const planRates = [
      { value: "per_night", label: "Per Night" },
      { value: "four_person", label: "Four Person" },
      { value: "double_room", label: "Double Room" },
      { value: "per_day", label: "Per Day" },
      { value: "one_week", label: "One Week" },
    ];

    return (
      <>
        <Modal
          isOpen={show}
          toggle={handleModal}
          className="modal-dialog-centered modal-lg"
          backdrop={false}
        >
          <ModalHeader className="bg-transparent" toggle={handleModal}>
            <span>
              <h4>Add Plan</h4>
            </span>
          </ModalHeader>
          <hr className="m-0" />
          <ModalBody className="px-sm-2 pb-2">
            <>
              <Form>
                <Row>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="hotel">
                      Plan Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="hotel"
                      id="hotel"
                      placeholder="Plan Name"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      invalid={display && hotelName === ""}
                    />
                    {display && !hotelName ? (
                      <span className="error_msg_lbl">Enter Plan Name </span>
                    ) : null}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="hotel">
                      Title <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="hotel"
                      id="hotel"
                      placeholder="Title"
                      // value={hotelName}
                      // onChange={e => setHotelName(e.target.value)}
                      invalid={display && hotelName === ""}
                    />
                    {display && !hotelName ? (
                      <span className="error_msg_lbl">Enter Title </span>
                    ) : null}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Plan Including <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Plan Including"
                      options={planIncluding}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {display && !country ? (
                      <span className="error_msg_lbl">
                        Enter Plan Including
                      </span>
                    ) : null}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Plan Excluding <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Plan Excluding"
                      options={planExcluding}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {display && !country ? (
                      <span className="error_msg_lbl">
                        Enter Plan Excluding
                      </span>
                    ) : null}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Plan Rates <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Plan Rates"
                      options={planRates}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {display && !country ? (
                      <span className="error_msg_lbl">Enter Plan Rates </span>
                    ) : null}
                  </Col>
                  {/* <Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Duration</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col> */}
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="userName">
                      Promocode <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="userName"
                      placeholder="e.g. 20% OFF"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      invalid={display ? userName === "" : false}
                    />
                    {display === true && !userName ? (
                      <span className="error_msg_lbl">Enter Promocode </span>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Form>
            </>
          </ModalBody>
          <Row className="px-1">
            <hr className="mt-1"></hr>
            <Col className="text-lg-end text-md-center mt-1 pb-2" xs={12}>
              <Button
                className="me-1 btn btn-danger"
                color="secondary"
                outline
                onClick={() => {
                  setShow(false);
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Add Plan
              </Button>
            </Col>
          </Row>
        </Modal>
        {show ? <div className="modal-backdrop fade show"></div> : null}
      </>
    );
  };

  const EditUserModal = ({ id }) => {
    const userData = users.filter((user) => user.id === id);
    const [display, setDisplay] = useState(false);

    const [editUser, setEditUser] = useState(userData[0]?.userId);
    const [editUserRole, setEditUserRole] = useState(userData[0]?.userRole);
    const [edituserName, setEditUserName] = useState(userData[0]?.userName);
    const [editPassword, setEditPassword] = useState(userData[0]?.password);
    const [editStatus, setEditStatus] = useState(userData[0]?.Status);
    console.log("userData_pass", userData[0]?.password);

    const [editDisplay, setEditDisplay] = useState(false);

    const editHandleSubmit = () => {
      setEditDisplay(true);
      if (editUser && editUserRole && edituserName && editPassword !== "") {
        let cipherPassword = cipherPasswordFunc(editPassword);
        users.map((user) => {
          if (user.id === id) {
            user.userId = editUser;
            user.userRole = editUserRole;
            user.userName = edituserName;
            user.password = editPassword === null ? undefined : editPassword;
            user.Status = editStatus;
          }
        });
        const edited_user_body = users.filter((c) => c.id === id);
        console.log("edited_user_body", edited_user_body);

        let edit_obj = {
          LoginID: getUserData.LoginID,
          Token: "123",
          Seckey: "abc",
          Event: "update",
          Username: edited_user_body[0].userName,
          Password:
            edited_user_body[0].password === undefined
              ? null
              : edited_user_body[0].password,
          UserRole: edited_user_body[0].userRole,
          UserLoginID: edited_user_body[0].loginId,
          UserRoleType: edited_user_body[0].roleType,
          Status: edited_user_body[0].Status,
        };
        console.log("edit_obj", edit_obj);
        try {
          axios
            .post(
              "/authentication/userauthentication/loginauthentication",
              edit_obj,
            )
            .then((res) => {
              console.log("res", res);
              toast.success("User Edited Succesfully!", {
                position: "top-center",
              });
              // getAllData()
            });
        } catch (error) {
          console.log("error", error);
          toast.error(error);
        }
        handleEditModal();
      }
      // else {
      //     toast.error('Fill All Fields!', {
      //         position: "top-center",
      //         style: {
      //             minWidth: '250px'
      //         },
      //         duration: 3000
      //     })
      // }
    };

    const duration = [
      { value: "1_month", label: "1 Month" },
      { value: "3_months", label: "3 Months" },
      { value: "6_months", label: "6 Months" },
      { value: "1_year", label: "1 Year" },
    ];

    const priceList = [
      { value: "0-1000", label: "₹0 - ₹1,000" },
      { value: "1000-5000", label: "₹1,000 - ₹5,000" },
      { value: "5000-10000", label: "₹5,000 - ₹10,000" },
      { value: "10000-20000", label: "₹10,000 - ₹20,000" },
      { value: "20000+", label: "₹20,000+" },
    ];

    const billingCycle = [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "yearly", label: "Yearly" },
    ];

    const currency = [
      { value: "INR", label: "₹ INR (Indian Rupee)" },
      { value: "USD", label: "$ USD (US Dollar)" },
      { value: "EUR", label: "€ EUR (Euro)" },
      { value: "GBP", label: "£ GBP (British Pound)" },
    ];

    return (
      <>
        <Modal
          isOpen={showEdit}
          toggle={handleEditModal}
          className="modal-dialog-centered modal-lg"
          backdrop={false}
        >
          <ModalHeader className="bg-transparent" toggle={handleEditModal}>
            <span>
              <h4>Update Plan</h4>
            </span>
          </ModalHeader>
          <hr className="m-0" />
          <ModalBody className="px-sm-2 pb-2">
            <>
              <Form>
                <Row>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Plan Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="hotel"
                      id="hotel"
                      placeholder="Plan Name"
                      // value={hotelName}
                      // onChange={e => setHotelName(e.target.value)}
                      invalid={display && hotelName === ""}
                    />
                    {/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="hotel">
                      Product Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="hotel"
                      id="hotel"
                      placeholder="Product Name"
                      // value={hotelName}
                      // onChange={e => setHotelName(e.target.value)}
                      invalid={display && hotelName === ""}
                    />
                    {/* {display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null} */}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Price <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Price"
                      options={priceList}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Billing Cycle <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Billing Cycle"
                      options={billingCycle}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Currency <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Currency"
                      options={currency}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
                  </Col>
                  <Col lg="6" className="mb-1">
                    <Label className="form-label" for="countries">
                      Duration <span className="text-danger">*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Select Duration"
                      options={duration}
                      //   onChange={e => {
                      //     setCountryId(e.value)
                      //     setCountryCode(e.CountryCode)
                      //     setCountry(e.label)
                      //   }}
                      // invalid={display && country === ''}
                    />
                    {/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
                  </Col>
                </Row>
                <Row>
                  <Col lg="12" className="mb-1">
                    <Label className="form-label" for="userName">
                      Description
                    </Label>
                    <Input
                      type="textarea"
                      name="userName"
                      id="userName"
                      // value={userName}
                      // onChange={(e) => setUserName(e.target.value)}
                      // invalid={display ? userName === "" : false}
                    />
                    {/* {display === true && !userName ? (
											<span className="error_msg_lbl">Enter User Id </span>
										) : (
											<>
										)} */}
                  </Col>
                </Row>
              </Form>
            </>
          </ModalBody>
          <Row tag="form" className="px-1">
            <hr className="mt-2"></hr>
            <Col className="text-lg-end text-md-center mt-1 pb-2" xs={12}>
              <Button
                className="me-1 btn btn-danger"
                color="secondary"
                outline
                onClick={handleEditModal}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={editHandleSubmit}>
                Update
              </Button>
            </Col>
          </Row>
        </Modal>
        {showEdit ? <div className="modal-backdrop fade show"></div> : null}
      </>
    );
  };

  const DeleteUserModal = ({ id }) => {
    const data = users.filter((user) => user.id === id);

    console.log("data", data);

    const handleDeleteUser = async () => {
      let obj = {
        // LoginID: getUserData.LoginID,
        LoginID,
        Token,
        Seckey: "abc",
        DeleteLoginID: data[0].loginId,
        Event: "delete",
      };
      const deleteUserResponse = await axios.post(
        "/authentication/userauthentication/loginauthentication",
        obj,
      );
      console.log("deleteUserResponse", deleteUserResponse);
      if (deleteUserResponse.data[0][0].status == "Success") {
        toast.success(deleteUserResponse.data[0][0].message);
        setUsers(users.filter((user) => user.id !== id));
        setDel(!del);
      }
    };

    return (
      <>
        <Modal
          isOpen={del}
          toggle={() => setDel(!del)}
          className="modal-dialog-centered"
          backdrop={false}
        >
          <ModalHeader className="bg-transparent" toggle={() => setDel(!del)}>
            Are you sure to delete {data[0]?.employee} permanently?
          </ModalHeader>
          <ModalBody>
            <Row className="text-center">
              <Col xs={12}>
                <Button
                  color="danger"
                  className="m-1"
                  onClick={handleDeleteUser}
                >
                  Delete
                </Button>
                <Button
                  className="m-1"
                  color="secondary"
                  outline
                  onClick={() => setDel(!del)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {del ? <div className="modal-backdrop fade show"></div> : null}
      </>
    );
  };

  console.log("usersType", usersType);

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.user.toLowerCase().includes(query.toLowerCase()) ||
        item.roleType.toLowerCase().includes(query.toLowerCase()) ||
        item.userRole.toLowerCase().includes(query.toLowerCase()) ||
        item.userName.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const userTable = [
    {
      name: "#",
      width: "100px",
      sortable: true,
      selector: (row) => row.id,
    },
    {
      name: "Users",
      sortable: true,
      selector: (row) => row.user,
      cell: (row) => (
        <>
          <div className="wrap-text">{row.user + " (" + row.email + ")"}</div>
        </>
      ),
    },
    {
      name: "Department",
      sortable: true,
      selector: (row) => row.roleType,
    },
    {
      name: "User Roles",
      sortable: true,
      selector: (row) => row.userRole,
    },
    {
      name: "Username",
      selector: (row) => row.userName,
    },
    {
      name: "Status",
      sortable: true,
      selector: (row) => row.Status,
      cell: (row) => {
        return (
          <>
            {row.Status === "Active" ? (
              <Badge color="light-success"> {row.Status}</Badge>
            ) : (
              <Badge color="light-danger"> {row.Status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Action",
      sortable: true,
      center: true,
      selector: (row) => (
        <>
          <Col>
            <Edit
              className="me-50 pe-auto"
              onClick={() => {
                setShowEdit(true);
                setSelected_user(row.id);
              }}
              size={15}
            />
            <Trash
              className="me-50"
              size={15}
              onClick={() => {
                setDel(true);
                setSelected_user(row.id);
              }}
            />
          </Col>
          {/* <EditUserModal id={selected_user} />
                    <DeleteUserModal id={selected_user} /> */}
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Subscription Plan</h2>
          </CardTitle>

          <Button color="primary" onClick={() => setShow(true)}>
            Add Plan
          </Button>
        </CardHeader>
      </Card>

      <div className="d-flex justify-content-evenly align-items-stretch">
        <Card
          className="plan-card"
          style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
        >
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div className="mb-3">
                <h2>Monthly</h2>
                {/* <p className="mb-2 text-dark">
									Perfect for small hotels getting started
								</p> */}
              </div>
              <div>
                <span
                  className="border rounded bg-primary text-light px-1"
                  style={{ paddingTop: "2px", paddingBottom: "2px" }}
                >
                  Active
                </span>
              </div>
            </div>
            <div>
              <p className="fs-1 fw-bolder">$99.00</p>
              <p>per month</p>
            </div>
            <div className="pt-2 border-top">
              <div class="d-flex justify-content-between mb-1">
                <span>Duration</span>
                <span>30 Days</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Product </span>
                <span>PMS</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Description </span>
                <span>Basic plan for small hotels</span>
              </div>
            </div>
            <div
              className="pt-2 border-top mb-2"
              style={{ minHeight: "140px" }}
            >
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
              </div>
            </div>

            <div className="d-flex justify-content-between plan-actions">
              <Button
                color="primary"
                onClick={() => handleEditModal("starter")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
                Edit
              </Button>
              <Button color="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="me-1"
                >
                  <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                </svg>
                Clone
              </Button>
              <Button color="primary">
                <FaArchive />
              </Button>
            </div>
          </div>
        </Card>
        <Card
          className="plan-card"
          style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
        >
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div className="mb-3">
                <h2>Quarterly</h2>
                {/* <p className="mb-2 text-dark">
									Comprehensive solution for growing properties
								</p> */}
              </div>
              <div>
                <span
                  className="border rounded bg-primary text-light px-1"
                  style={{ paddingTop: "2px", paddingBottom: "2px" }}
                >
                  Active
                </span>
              </div>
            </div>
            <div>
              <p className="fs-1 fw-bolder">$299.00</p>
              <p>per month</p>
            </div>
            <div className="pt-2 border-top">
              <div class="d-flex justify-content-between mb-1">
                <span>Duration</span>
                <span>30 Days</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Product </span>
                <span>PMS</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Description </span>
                <span>Basic plan for small hotels</span>
              </div>
            </div>
            <div
              className="pt-2 border-top mb-2"
              style={{ minHeight: "140px" }}
            >
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1 flex-wrap">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
                <span className="px-1 border rounded">Pos</span>
                <span className="px-1 border rounded">Reports</span>
              </div>
            </div>
            <div className="d-flex justify-content-between plan-actions">
              <Button
                color="primary"
                onClick={() => handleEditModal("professional")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
                Edit
              </Button>
              <Button color="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="me-1"
                >
                  <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                </svg>
                Clone
              </Button>
              <Button color="primary">
                <FaArchive />
              </Button>
            </div>
          </div>
        </Card>
        <Card
          className="plan-card"
          style={{ width: "24rem", paddingTop: "20px" }}
        >
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div className="mb-3">
                <h2>Yearly</h2>
                {/* <p className="mb-2 text-dark">
									Perfect for small hotels getting started
								</p> */}
              </div>
              <div>
                <span
                  className="border rounded bg-primary text-light px-1"
                  style={{ paddingTop: "2px", paddingBottom: "2px" }}
                >
                  Active
                </span>
              </div>
            </div>
            <div>
              <p className="fs-1 fw-bolder">$2,999.00</p>
              <p>per 365 days</p>
            </div>
            <div className="pt-2 border-top">
              <div class="d-flex justify-content-between mb-1">
                <span>Duration</span>
                <span>30 Days</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Product </span>
                <span>PMS</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Description </span>
                <span>Basic plan for small hotels</span>
              </div>
            </div>
            <div
              className="pt-2 border-top mb-2"
              style={{ minHeight: "140px" }}
            >
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1 flex-wrap">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
                <span className="px-1 border rounded">Pos</span>
                <span className="px-1 border rounded">Reports</span>
                <span className="px-1 border rounded">Accounting</span>
                <span className="px-1 border rounded">Integrations</span>
              </div>
            </div>

            <div className="d-flex justify-content-between plan-actions">
              <Button
                color="primary"
                onClick={() => handleEditModal("enterprise")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
                Edit
              </Button>
              <Button color="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="me-1"
                >
                  <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                </svg>
                Clone
              </Button>
              <Button color="primary">
                <FaArchive />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <NewUserModal />
      <EditUserModal id={selected_user} />
      <DeleteUserModal id={selected_user} />
    </>
  );
};

export default Plans;
