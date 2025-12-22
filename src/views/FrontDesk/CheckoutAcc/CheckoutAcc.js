import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "../../../API/axios";
import { useNavigate } from "react-router-dom";
import BillSplitModal from "./BillSplitModal";
import { store } from '@store/store'
import { disposeSplit } from "../../../redux/splitBill";
import { openLinkInNewTab } from "../../../common/commonMethods";

const haveGstOptions = [
  { value: "yes", label: "YES" },
  { value: "no", label: "NO" },
];

const houseKeepOption = [
  { value: "Dirty", label: "DIRTY" },
  { value: "Clean", label: "CLEAN" },
];

const CheckoutAcc = ({
  bookingID,
  BookingDetails,
  payment_details,
  handleOpen,
}) => {
  console.log("BookingDetails", BookingDetails);
  console.log("payment_details", payment_details[0]?.pendingAmount);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;

  const [submit, setSubmit] = useState(false);
  const [hasGst, setHasGst] = useState("");
  const [roomMark, setRoomMark] = useState("");
  const [manager, setManager] = useState("");
  const [spcmt, setSpcmt] = useState("");
  const [CompanyGST, setCompanyGST] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [CompanyAddress, setCompanyAddress] = useState("");
  const [billStatus, setBillStatus] = useState('Paid')

  const [checked, setChecked] = useState(false);
  const handleChange = () => setChecked(!checked);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setSubmit(true);
    if (manager !== "" && roomMark !== "") {
      setSubmit(false);
      setOpen(!open)
    } else {
      toast.error('Fill all fields!')
    }
  }

  useEffect(() => {
    if (BookingDetails[0]?.isCompany) {
      setHasGst("yes");
      setCompanyGST(BookingDetails[0].companyGST);
      setCompanyName(BookingDetails[0].companyName);
      setCompanyAddress(BookingDetails[0].companyAddress);
    }
  }, [BookingDetails]);

  const resetSplitSlice = () => {
    if (open === false) {
      store.dispatch(disposeSplit(true))
    }
  }

  useEffect(() => {
    resetSplitSlice()
  }, [open])

  const handleCheckout = async (split_arr) => {
    setSubmit(true);
    console.log('payment_details', payment_details[0]?.pendingAmount, billStatus, payment_details[0]?.pendingAmount > 0 && billStatus === 'Credit');
    if (payment_details[0]?.pendingAmount > 0 && billStatus === 'Paid') {
      toast.error(`Pending Amount to be collected:${payment_details[0]?.pendingAmount}`)
    } else if (manager !== "" && roomMark !== "") {
      try {
        let obj = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "insert",
          BookingID: bookingID,
          OnDuty: manager,
          SpecialNote: spcmt,
          CleaningStatus: roomMark,
          isCompany: hasGst === "yes" ? true : false,
          BillStatus: billStatus,
          CompanyName,
          CompanyGST,
          CompanyAddress,
          JSON_SplitBill: split_arr && split_arr.length > 0 ? JSON.stringify(split_arr) : null
        };
            console.log('Splitt Bill',obj);

        const res = await axios.post("/getdata/bookingdata/checkout", obj);

        if (res.data[0][0].status === "Success") {
          toast.success("Checked Out Successfully!")
          window.open("/invoice1", "_blank", "noreferrer");
          setSubmit(false);
          handleOpen();
          handleModalOpen()
        } else {
          toast.error(res.data[0][0].message);
        }
      } catch (error) {
        console.log("error", error);
        toast.error("Something went wrong, Try again!");
        // setSubmit(false);
      }
    } else {
      toast.error("Fill all Fields");
    }
  };

  return (
    <>
      <Row>
        <Form>
          <Row className="d-flex flex-row justify-content-around align-items-center">
            {!BookingDetails[0]?.isCompany && (
              <Col>
                <Label>Have GST</Label>
                <Select
                  placeholder=""
                  menuPlacement="auto"
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={haveGstOptions}
                  onChange={(e) => setHasGst(e.value)}
                />
              </Col>
            )}
            <Col>
              <Label>
                On Duty Manager<span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                name="manager"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                invalid={submit && manager === ""}
              />
              {submit && manager === "" && (
                <FormFeedback>Manager Name is required!</FormFeedback>
              )}
            </Col>
            <Col>
              <Label>Special Comment</Label>
              <Input
                type="text"
                name="special comment"
                value={spcmt}
                onChange={(e) => setSpcmt(e.target.value)}
              />
            </Col>
            <Col>
              <Label>
                Room Cleaning Status<span className="text-danger">*</span>
              </Label>
              <Select
                placeholder=""
                menuPlacement="auto"
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                isSearchable={false}
                options={houseKeepOption}
                value={houseKeepOption.filter((c) => c.value === roomMark)}
                onChange={(e) => {
                  setRoomMark(e.value);
                }}
              />
              {submit && roomMark === "" && (
                <span className="text-danger">Select Status for room!</span>
              )}
            </Col>
          </Row>
          {hasGst === "yes" && (
            <Row className="my-1">
              <Col lg="4" md="12" sm="12" className="mb-md-1 mb-sm-1">
                <Label className="fw-bold fs-5">Company GST</Label>
                <Input
                  type="text"
                  name="company gst"
                  value={CompanyGST}
                  onChange={(e) => setCompanyGST(e.target.value)}
                  disabled={hasGst && BookingDetails[0]?.isCompany}
                />
              </Col>
              <Col lg="4" md="12" sm="12" className="mb-md-1 mb-sm-1">
                <Label className="fw-bold fs-5">Company Name</Label>
                <Input
                  type="text"
                  name="company name"
                  value={CompanyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={hasGst && BookingDetails[0]?.isCompany}
                />
              </Col>
              <Col lg="4" md="12" sm="12">
                <Label className="fw-bold fs-5">Company Address</Label>
                <Input
                  type="text"
                  name="company address"
                  value={CompanyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  disabled={hasGst && BookingDetails[0]?.isCompany}
                />
              </Col>
            </Row>
          )}
          <Row className="mt-1 text-center d-flex  justify-content-between align-items-center ">
            <Col>
              <Label className=" px-2 fs-5 ">
                <Input
                  type="checkbox"
                  className="mx-1"
                  checked={billStatus === 'Credit'}
                  onChange={e => {
                    if (e.target.checked) {
                      setBillStatus('Credit')
                    } else {
                      setBillStatus('Paid')
                    }
                  }}
                />
                Credit
              </Label>
            </Col>
            {
              BookingDetails[0]?.TotalGuest > 1 && (
                <Col>
                  <Label className="fs-5">
                    <Input
                      type="checkbox"
                      className="mx-1"
                      onClick={handleChange}
                    />
                    Split Bill
                  </Label>
                </Col>
              )
            }
            <Col>
              {
                !checked ?
                  (
                    <Button
                      color="primary"
                      // type="submit"
                      onClick={() => handleCheckout()}
                    >
                      Checkout & Generate Invoice
                    </Button>
                  )
                  :
                  (
                    <Button
                      color="primary"
                      onClick={handleModalOpen}
                    >
                      Split Bill & Checkout
                    </Button>
                  )
              }
            </Col>
          </Row>
        </Form>
      </Row>
      <BillSplitModal
        open={open}
        handleModalOpen={handleModalOpen}
        bookingID={bookingID}
        BookingDetails={BookingDetails}
        handleCheckout={handleCheckout}
      />
    </>
  );
};


export default CheckoutAcc;
