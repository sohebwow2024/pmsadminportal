import React, { useState, useEffect } from "react";
import { Button, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import Select, { useStateManager } from "react-select";
import { selectThemeColors } from "@utils";
import DataTable from "react-data-table-component";
import { ChevronDown, Trash2 } from "react-feather";
import { useSelector } from "react-redux";
import axios from "../../../API/axios";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import toast from "react-hot-toast";
import DeleteFolioModal from "./DeleteFolioModal";
import RazorPay from "../../../utility/Razorpay/RazorPay";
import PaymentModal from "./PaymentModal";
import moment from "moment";

const PaymentsFolio = ({ bookingID, BookingDetails, handlePfolio }) => {
  console.log("BookingDetails", BookingDetails);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, PropertyID, PaymentFolioID } = getUserData;

  const [existPaymentData, setExistPaymentData] = useState([]);
  const Domainurl = window.location.origin
  // const getExistPaymentData = async () => {
  //   try {
  //     const res = await axios.get("/booking/folio/all", {
  //       params: {
  //         LoginID,
  //         Token,
  //         TransactionID:
  //         BookingDetails.length > 0 ? BookingDetails[0]?.transactionID : "",
  //       },
  //     });
  //     console.log("existres", res);
  //     setExistPaymentData(res.data[0]);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  
  // uppar wala code mai value sahi se set nhi ho rahe the
  const getExistPaymentData = async () => {
    // TransactionID safely nikaalo
    const transactionID = BookingDetails?.[0]?.transactionID;

    // Agar TransactionID hi nahi hai → API call mat karo
    if (!transactionID) {
      console.warn("TransactionID not available, API call skipped");
      return;
    }

    try {
      const res = await axios.get("/booking/folio/all", {
        params: {
          LoginID,
          Token,
          TransactionID: transactionID, // TransactionID sahi se milena ke liye 
        },
      });

      console.log("existres", res);

      // 3️⃣ Correct data access
      setExistPaymentData(res.data?.[0]?.[0] || null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };


  useEffect(() => {
    getExistPaymentData();
  }, [BookingDetails]);

  const [submit, setSubmit] = useState(false);

  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
  const [paymentModeOptions, setPaymentModeOptions] = useState([]);
  // const [payFull, setPayFull] = useState("");
  const [loader, setLoader] = useState(false);
  const [pType, setPType] = useState("");
  const [pMode, setPMode] = useState("");
  // const [amt, setAmt] = useState("");
  const [rDate, setRDate] = useState(new Date());
  const [rText, setRText] = useState("");
  const [deletePFO, setDeletePFO] = useState("");
  const [getPaymo, setGetPaymo] = useState("");
  const [emailPut, setEmailPut] = useState("");
  // const [payModal, setPayModal] = useState(false);
  // const handlePayModal = () => setPayModal(!payModal);
  const [delModal, setDelModal] = useState(false);
  const handleDelModal = () => setDelModal(!delModal);

  const [isInputDisabled, setInputDisabled] = useState(true);
  const [emailInput, setEmailInput] = useState(true);
  const [emailValue, setEmailValue] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(true)

  console.log('rDate', rDate);
  const paymentTypeList = async () => {
    try {
      const ptypeobj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      const res = await axios.post(
        `/getdata/bookingdata/paymenttype`,
        ptypeobj
      );
      console.log("ptyperes", res);
      let data = res?.data[0];
      const filteredData = data.filter((pt) => pt.paymentType === "Prepaid");
      if (filteredData?.length > 0) {
        setPaymentTypeOptions(
          filteredData.map((paymentType) => {
            return {
              value: paymentType?.paymentTypeID,
              label: paymentType?.paymentType,
            };
          })
        );
      } else {
        setPaymentTypeOptions([
          { value: "reload", label: "Error loading, click to reload again" },
        ]);
      }
    } catch (error) {
      console.log("Payment Type List Error", error.message);
      setPaymentTypeOptions([
        { value: "reload", label: "Error loading, click to reload again" },
      ]);
    }
  };

  const paymentModeList = async () => {
    try {
      const pmodeobj = {
        LoginID,
        Token,
        Seckey: "abc",
        PaymentTypeID: pType,
        Event: "select",
      };
      const res = await axios.post(
        `/getdata/bookingdata/paymentmode`,
        pmodeobj
      );
      console.log("pmoderes", res);
      let data = res?.data[0];
      if (data?.length > 0 && data[0].paymentMode) {
        setPaymentModeOptions(
          data.map((paymentMode) => {
            return {
              value: paymentMode?.paymentModeID,
              label: paymentMode?.paymentMode,
            };
          })
        );
      } else {
        setPaymentModeOptions([]);
      }
    } catch (error) {
      setPaymentModeOptions([]);
      console.log("Payment Mode List Error", error.message);
    }
  };

  //get a payment detail from booking modal
  useEffect(() => {
    if (bookingID) {
      try {
        const paymentAmou = {
          LoginID: LoginID,
          Token: Token,
          Seckey: "abc",
          BookingID: bookingID,
          // Event: "select"
        };
        axios
          .post(`/getdata/bookingdetailsbybookingid`, paymentAmou) // TODO - Why
          .then((response) => {
            console.log("bookingdetailsbybookingid", response?.data);
            setEmailPut(response?.data[0]);
            // seTransId(response?.data[1]);
            setGetPaymo(response?.data[2]);
          })
          .catch((err) => {
            console.log("err on request", err);
            toast.error("Something went wrong, check Console!");
          });
      } catch (error) {
        console.log("Bookings Error=====", error.message);
      }
    }
  }, [inputValue]);

  const handleRadioClick = () => {
    setInputDisabled(true);
    const value = getPaymo[0]?.pendingAmount;
    setInputValue(value);
  };

  useEffect(() => { }, [getPaymo[0]?.pendingAmount]);

  const handleRadioClick2 = () => {
    setInputDisabled(false);
    const value1 = "";
    setInputValue(value1);
  };

  const handleEmailInput = () => {
    setEmailInput(false);
    const email = emailPut[0]?.guestEmail;
    setEmailValue(email);
  };
  const handleEmailInput2 = () => {
    setEmailInput(true);
    if (pMode !== "PMID20230220AA00004") {
      const email1 = "";
      setEmailValue(email1);
    }
  };

  useEffect(() => {
    paymentTypeList();
    paymentModeList();
  }, [pType]);

  const [buttonDisabled0, setButtonDisabled0] = useState(false);
  // const [payFoId, setPayFoId] = useState()

  // const paymentLink = async () => {
  //   console.log("ssssssssssssssssssss",paymentLink())

  // };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmit(true);
    if (pType && pMode && inputValue && rDate && rText !== "") {
      try {
        const obj = {
          LoginID,
          Token,
          Seckey: "abc",
          TransactionID: BookingDetails[0]?.transactionID,
          PaymentType: pType,
          PaymentDate: rDate,  //check krna hai backend me 
          AdditionType: pMode,
          ReferenceID: bookingID,
          PaidAmount: inputValue,
          ReferenceText: rText,
          CollectorName: "",
          Status: selectedRadio === "sendLink" ? "Pending" : "Active",
        };
        console.log("objrctttttttt", obj);
        const res = await axios.post("/booking/folio/Save", obj);
        // setPayFoId(res?.data[0][0].PaymentFolioID)
        console.log("ressssssssssssssssssssss", res);
        if (res?.data[0][0].status === "Success" || pMode !== "PMID20230220AA00004") {
          toast.success("Payment Folio added");
          setTimeout(() => {
            setButtonDisabled0(false);
          }, 2000);
          setPMode("");
          setPType("");
          setInputValue("");
          setRText("");
          setRDate("");
          setSubmit(false);
          getExistPaymentData();
          handlePfolio();
          // paymentLink();
          const details = {
            url: window.location.origin,
            // "BookingID":bookingID,
            TransactionID: BookingDetails[0]?.transactionID,
            PaymentFolioID: res?.data[0][0]?.paymentFolioID,
            PropertyID: PropertyID,
            EmailAddress: emailValue,
            PaymentAmount: inputValue,
          };
          console.log("detalsssssssssssssssss", details);
          try {
            setButtonDisabled0(true); // Disable the button

            if (pMode === "PMID20230220AA00004" || selectedRadio === "sendLink") {
              const res = await axios.post("/paymentlink/new", details, {
                headers: {
                  LoginID,
                  Token,
                },
              });
              console.log('emaikl', res);
              toast.success("Email Sent Successfully");
              setButtonDisabled0(false);
            }
            console.log("resultTTTTTTTTTTTTTTTT", res);
          } catch (error) {
            setButtonDisabled0(false); // Enable the button
            console.log(error.message);
            console.log(error);
          }
        }
      } catch (error) {
        console.log("error", error);
        toast.error("Something went wrong, Try again!");
      }
    } else toast.error("Fill all Fields!");
  };

  const reset = () => {
    setPMode("");
    setPType("");
    setInputValue("");
    setRText("");
    setRDate("");
    setSubmit(false);
  };

  // const [buttonDisabled0, setButtonDisabled0] = useState(false);

  // const paymentLink = async () => {
  //   const details={
  //     "url":window.location.origin,
  //     // "BookingID":bookingID,
  //     "TransactionID":BookingDetails[0]?.TransactionID,
  //     "PaymentFolioID": PaymentFolioID,
  //     "PropertyID":PropertyID,
  //     "EmailAddress": emailValue,
  //   }
  //   console.log("detalsssssssssssssssss",details);
  //   try {

  //     setButtonDisabled0(true); // Disable the button

  //         const res = await axios.post('/paymentlink/new',details,{
  //           headers:{
  //             LoginID,
  //             Token,
  //           }
  //         } );

  //     toast.success("Email Sent Successfully");
  //     console.log("resultTTTTTTTTTTTTTTTT", res);

  //   } catch (error) {
  //     setButtonDisabled0(false); // Enable the button
  //         console.log(error.message);
  //         console.log(error);
  //   }
  // };

  const columns = [
    {
      name: "ID",
      minWidth: "18rem",
      selector: (row) => row.paymentFolioID,
    },
    // {
    //     name: 'Booking ID',
    //     minWidth: '15rem',
    //     selector: row => row.ReferenceID
    // },
    {
      name: "Reference",
      minWidth: "10rem",
      selector: (row) => row.referenceText,
    },
    {
      name: "Amount",
      selector: (row) => row.paidAmount,
    },
    {
      name: "Status",
      selector: (row) => {
        return <> {row.status === "Active" ? "Paid" : <a style={{ textDecoration: 'underline' }} target='blank' href={`${Domainurl}/paylink?xn=${Token}&lid=${LoginID}&lnk=${row.paymentLinkID}`}>Pending</a>}</>;
      },
    },
    {
      name: "Received Date",
      selector: (row) => moment(row.paymentDate).format('DD-MM-YYYY'),
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <>
            <Trash2
              color="red"
              size="20"
              onClick={() => {
                setDeletePFO(row.paymentFolioID);
                handleDelModal();
              }}
            />
          </>
        );
      },
    },
  ];

  const [selectedRadio, setSelectedRadio] = useState("");
  const [radioDis, setRadioDis] = useState(true);

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  return (
    <>
      {console.log("existPaymentData", existPaymentData)}
      {console.log("pending amount", getPaymo[0]?.pendingAmount)}
      <Form onSubmit={(e) => handlePayment(e)}>
        {/* <Row className='text-center p-1'>
                    <Col className='d-flex flex-row flex-wrap justify-content-center align-items-center'>
                        <Label className='fs-4 me-1'>Pending Amount:</Label>
                        <Input
                            className='w-25'
                            disabled
                            type='text'
                            name='Pendingamount'
                        />
                    </Col>
                </Row> */}
        <Row>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>
              Payment Type<span className="text-danger">*</span>
            </Label>
            <Select
              placeholder="Select a Payment Type"
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={paymentTypeOptions}
              value={paymentTypeOptions?.filter((c) => c.value === pType)}
              onChange={(val) => {
                setPType(val.value);
              }}
              invalid={pType === "" && submit}
            />
            {pType === "" && submit && (
              <span className="text-danger">Payment is required</span>
            )}
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>
              Payment Mode
              {paymentModeOptions.length !== 0 && (
                <span className="text-danger">*</span>
              )}
            </Label>
            <Select
              isDisabled={pType === "" || paymentModeOptions.length === 0}
              placeholder={pType === "" ? "" : "Select a Payment Mode"}
              menuPlacement="auto"
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={paymentModeOptions}
              value={paymentModeOptions?.filter((c) => c.value === pMode)}
              onChange={(val) => {
                setPMode(val.value);
              }}
              invalid={pMode === "" && submit}
            />
            {pType !== "" && pMode === "" && submit && (
              <span className="text-danger">Select a Payment Mode!</span>
            )}
          </Col>
          <Col
            lg="3"
            md="12 mb-1"
            sm="12 mb-1"
            className="d-flex align-items-center text-center"
          >
            <Col className="mt-2">
              <div>
                <Input
                  type="radio"
                  name="payFull"
                  id="fullAmount"
                  value="Yes"
                  onClick={handleRadioClick}
                // checked={payFull === "Yes"}
                // onChange={(e) => (
                //   setPayFull(e.target.value),
                //   setAmount(quickBookingStore.total)
                // )}
                />
                <Label className="Amount" for="fullAmount">
                  Full Amount
                </Label>
                <Input
                  type="radio"
                  className="ms-2"
                  name="payFull"
                  id="partialAmount"
                  value="No"
                  onClick={handleRadioClick2}
                // checked={payFull === "No"}
                // onChange={(e) => (
                //   setPayFull(e.target.value),
                //   setAmount(quickBookingStore.total === amount ? 0 : amount)
                // )}
                />
                <Label className="Amount" for="partialAmount">
                  Partial Amt
                </Label>
              </div>
            </Col>
            {/* {payFull === "" && loader && (
              <Label className="text-danger">Payment Type is required!</Label>
            )} */}
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>Amount</Label>
            <Input
              type="number"
              name="amount"
              value={inputValue}
              disabled={isInputDisabled}
              onChange={(e) => setInputValue(e.target.value)}
              invalid={submit && inputValue === ""}
            />
            {submit && inputValue === "" && (
              <FormFeedback>Amount is required</FormFeedback>
            )}
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>Received Date</Label>
            <Flatpickr
              id="checkIn_date"
              name="checkIn_date"
              placeholder="Select Check-In Date"
              options={{
                altInput: true,
                altFormat: "d-m-Y",
                dateFormat: "d-m-Y",
              }}
              value={rDate}
              onChange={(date) => setRDate(date[0])}
            />
            {console.log("Received Date", rDate)}
            {submit && rDate === "" && (
              <span className="text-danger">Date is required</span>
            )}
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>Reference text</Label>
            <Input
              type="text"
              name="ref text"
              placeholder="Reference Text"
              value={rText}
              onChange={(e) => setRText(e.target.value)}
              invalid={submit && rText === ""}
            />
            {submit && rText === "" && (
              <FormFeedback>Reference text is required</FormFeedback>
            )}
          </Col>
          <Col
            lg="3"
            md="12 mb-1"
            sm="12 mb-1"
            className=" d-flex align-items-center text-center"
          >
            <Col className="mt-2">
              <div>{
                pMode === "PMID20230220AA00004" && show ?

                  (<><Input
                    type="radio"
                    name="Send"
                    id="Amount"
                    checked={selectedRadio === "sendLink"}
                    onClick={handleEmailInput}
                    value="sendLink"
                    disabled={pMode !== "PMID20230220AA00004"}
                    onChange={handleRadioChange}
                    required
                  />
                    <Label className="Amount" for="Amount">Send Link</Label>
                  </>
                  ) : (
                    <>
                      <Input
                        type="radio"
                        className="ms-2"
                        name="Send"
                        id="Amount"
                        disabled={pMode === "PMID20230220AA00004"}
                        checked={selectedRadio === "Paid"}
                        onClick={handleEmailInput2}
                        value="Paid"
                        onChange={handleRadioChange}
                        required
                      />
                      <Label className="Amount" for="Amount">Paid</Label>
                    </>)
              }
              </div>
              {submit &&
                selectedRadio === "sendLink" &&
                (selectedRadio === "Paid") === "" && (
                  <FormFeedback>Please Select Any One Option</FormFeedback>
                )}
            </Col>
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1">
            <Label>Email</Label>
            <Input
              type="text"
              name="amount"
              value={emailValue}
              disabled={emailInput}
              onChange={(e) => setEmailValue(e.target.value)}
            />
          </Col>
          <Col lg="3" md="12 mb-1" sm="12 mb-1" className="mt-lg-2 text-center">
            {selectedRadio === "Paid" ? (
              <Button
                color="primary"
                className="me-1"
                disabled={buttonDisabled0}
              >
                Add Payment
              </Button>
            ) : (
              <Button
                color="primary"
                className="me-1"
                //  onClick={() => handlePayment()}
                disabled={buttonDisabled0}
              >
                Add Payment
              </Button>
            )}

            <Button color="warning" onClick={reset}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
      {/* <RazorPay
        buttName="Get Full Payment"
        amountPy={getPaymo[0]?.PendingAmount}
      />
      <Button color="primary" className="me-1" onClick={() => handlePayModal()}>
        Partial Payment
      </Button> */}
      {existPaymentData.length > 0 && (
        <DataTable
          noHeader
          data={existPaymentData}
          columns={columns}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          pagination
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
      {delModal && (
        <DeleteFolioModal
          LoginID={LoginID}
          Token={Token}
          open={delModal}
          handleDelModal={handleDelModal}
          id={deletePFO}
          getExistPaymentData={getExistPaymentData}
          handlePfolio={handlePfolio}
        />
      )}
      {/* partial payment modal */}
      {/* {payModal && (
        <PaymentModal
          open={payModal}
          handleOpen={handlePayModal}
          handleModalOpen={handlePayModal}
        />
      )} */}
    </>
  );
};

export default PaymentsFolio;