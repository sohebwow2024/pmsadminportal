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

const QuickUnblockModal = ({ open, handleOpen, bookingID }) => {
    console.log('bookingID', bookingID);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [showErrors, setShowErrors] = useState(false);
    const [reason, setReason] = useState("")

    const handleBlock = async () => {
        setShowErrors(true)
        if (reason !== "") {
            try {
                let obj = {
                    LoginID,
                    Token,
                    BookingID: bookingID,
                    Comment: reason
                }
                console.log('onj', obj);
                const res = await axios.post(`/booking/UnblockRoom`, obj)
                console.log('UnBlock res', res)
                if (res?.data[0][0]?.Status === "Success") {
                    handleOpen()
                    setShowErrors(false)
                    toast.success(res?.data[0][0]?.Message)
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
                isOpen={open}
                toggle={handleOpen}
                className="modal-dialog-centered modal-md"
                backdrop={true}
            >
                <ModalHeader toggle={handleOpen}>
                    UnBlock Booking
                </ModalHeader>
                <ModalBody className="pt-2">
                    <Form>
                        <Row className="d-flex flex-column">
                            <Col>
                                <Label>Comment</Label>
                                <Input
                                    type="textarea"
                                    value={reason}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setReason(value);
                                    }}
                                    invalid={showErrors && reason === ""}
                                />
                                {showErrors && reason === "" && <p className="text-danger">Comment is required</p>}
                            </Col>
                            <Col className="d-flex p-3 justify-content-evenly">
                                <Button color="dark" onClick={() => handleBlock()}>
                                    UnBlock
                                </Button>
                                <Button outline onClick={() => handleOpen()}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
};

export default QuickUnblockModal;
