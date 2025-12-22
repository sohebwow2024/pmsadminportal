import { React, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

// ** Styles
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "../FrontDesk/table.scss";
import moment from "moment";
import { AiOutlineStop } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "../../API/axios";

const QuickBlockModal = ({ open1, handleOpen1, blockDate, blockRoom }) => {

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { UserName, CompanyID, PropertyID, HotelName, LoginID, Token } = getUserData

  console.log("gggg", blockDate);
  console.log("jjjjj", blockRoom);
  const [inDate] = useState(blockDate);
  const [outDate, setOutDate] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [reason, setReason] = useState("");
  const [blockBID, setBlockBID] = useState("")

  useEffect(() => {
    setOutDate(new Date(inDate).fp_incr(1));
  }, [inDate])

  const handleBlock = async () => {
    setShowErrors(true)
    if (outDate !== "" || reason !== "") {
      try {
        let obj = {
          LoginID,
          Token,
          FloorID: blockRoom?.floorID,
          PropertyID,
          RoomID: blockRoom?.roomID,
          FromDate: moment(inDate).format('YYYY-MM-DD'),
          ToDate: moment(outDate).format('YYYY-MM-DD'),
          BlockReason: reason
        }
        const res = await axios.post(`/booking/BlockRoom`, obj)
        console.log('Block res', res)
        if (res?.data[0][0]?.status === "Success") {
          setBlockBID(res?.data[0][0].bookingID)
          setShowErrors(false)
          toast.success(res?.data[0][0]?.message)
          setReason('')
          handleOpen1()
        }
      } catch (error) {
        console.log('blockError', error)
        toast.error("Something went wrong, Try again!")
      }
    } else {
      toast.error("Fill all fields!")
    }
  }

  return (
    <>
      <Modal
        isOpen={open1}
        toggle={handleOpen1}
        className="modal-dialog-centered modal-md"
        backdrop={false}
      >
        <ModalHeader toggle={handleOpen1}>
          Block Booking - {`Floor No: ${blockRoom.floorNo}, Room No: ${blockRoom.roomNo}`}
        </ModalHeader>
        <ModalBody className="pt-2">
          <Form>
            <Row>
              <Col>
                <Label> From Date:</Label>
                <Flatpickr
                  id="checkIn_date"
                  name="checkIn_date"
                  placeholder="Select From Date"
                  options={{
                    altInput: true,
                    altFormat: "d-m-y",
                    dateFormat: "m-d-yy",
                    minDate: moment(new Date()).subtract(0, "days"),
                    defaultDate: inDate,
                  }}
                  defaultValue={inDate}
                  value={inDate}
                  // onChange={(date) => {
                  //   setInDate(date[0]);
                  //   setLoader(false);
                  // }}
                  disabled
                />
              </Col>
              <Col>
                <Label> To Date:</Label>
                <Flatpickr
                  id="checkOut_date"
                  name="checkOut_date"
                  placeholder="Select To Date"
                  options={{
                    altInput: true,
                    altFormat: "d-m-y",
                    dateFormat: "d-m-y",
                    minDate: new Date(inDate).fp_incr(0),
                    defaultDate: outDate,
                  }}
                  value={outDate}
                  onChange={(date) => {
                    setOutDate(date[0]);
                  }}
                />
                {showErrors && outDate === "" && <p className="text-danger">To Date is required</p>}
              </Col>
              <Row>
                <Col>
                  <Label>Reason</Label>
                  <Input
                    type="textarea"
                    value={reason}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReason(value);
                    }}
                    invalid={showErrors && reason === ""}
                  />
                  {showErrors && reason === "" && <p className="text-danger">Reason is required</p>}
                </Col>
              </Row>
              <div className="d-flex p-3 justify-content-evenly">
                <Button color="dark" onClick={() => handleBlock()} disabled={reason === ''}>
                  Block
                </Button>
                <Button outline onClick={() => handleOpen1()}>
                  Cancel
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      {open ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default QuickBlockModal;
