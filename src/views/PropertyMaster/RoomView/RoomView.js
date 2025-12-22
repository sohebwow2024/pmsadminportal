import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Trash } from "react-feather";
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
  Spinner,
  CardHeader,
  Badge,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import axios from "../../../API/axios";
import { useSelector } from "react-redux";

const RoomView = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Room View";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const { LoginID, Token } = getUserData;

  const [show, setShow] = useState(false);
  const handleModal = () => setShow(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);
  const [loader, setLoader] = useState(false);
  const [selected_roomView, setSelected_roomView] = useState();

  const [del, setDel] = useState(false);

  const [roomViews, setRoomViews] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // const userId = localStorage.getItem('user-id')

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  const [roomViewDetails, setRoomViewDetails] = useState("");
  const roomViewList = () => {
    setLoader(true);
    try {
      const roomTypeDetails = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall",
      };
      axios
        .post(`/getdata/bookingdata/roomviewdetails`, roomTypeDetails)
        .then((response) => {
          setRoomViews(response.data[0]);
          setLoader(false);
        });
      if (roomViews === []) {
        setRefresh(!true);
      }
    } catch (error) {
      setLoader(false);
      console.log("RoomType Error", error.message);
    }
  };
  useEffect(() => {
    roomViewList();
  }, [refresh]);

  const NewRoomViewModal = () => {
    const [RoomView, setRoomView] = useState("");
    const [RoomViewDesc, setRoomViewDesc] = useState("");

    const [display, setDisplay] = useState(false);

    const addNewRoomView = () => {
      try {
        const roomTypeDetails = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "insert",
          RoomView,
          RoomViewDesc,
        };
        axios
          .post(`/getdata/bookingdata/roomviewdetails`, roomTypeDetails)
          .then((res) => {
            setRefresh(res);
            // roomViewList()
          });
      } catch (error) {
        console.log("RoomType Error", error.message);
      }
    };
    const handleSubmit = () => {
      setDisplay(true);
      if (RoomView.trim() && RoomViewDesc.trim() !== "") {
        addNewRoomView();
        handleModal();
        toast.success("Room View Added!", { position: "top-center" });
      }
    };

    return (
      <Modal
        isOpen={show}
        toggle={handleModal}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleModal}>
          Add Room View
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <>
            <Row className="mx-5">
              <Col md="12" className="mb-2">
                <Label className="form-label" for="roomView">
                  <span className="text-danger">*</span>Room View
                </Label>
                <Input
                  type="text"
                  name="roomView"
                  id="roomView"
                  value={RoomView}
                  onChange={(e) => setRoomView(e.target.value)}
                  invalid={display && RoomView.trim() === ""}
                />
                {display && !RoomView.trim() ? (
                  <span className="error_msg_lbl">Enter Room View </span>
                ) : null}
              </Col>
              <Col md="12" className="mb-2">
                <Label className="form-label" for="RoomViewDesc">
                  <span className="text-danger">*</span>Room View Description
                </Label>
                <Input
                  type="textarea"
                  name="RoomViewDesc"
                  id="RoomViewDesc"
                  value={RoomViewDesc}
                  onChange={(e) => setRoomViewDesc(e.target.value)}
                  invalid={display && RoomViewDesc.trim() === ""}
                />
                {display && !RoomViewDesc.trim() ? (
                  <span className="error_msg_lbl">
                    Enter Room View Description{" "}
                  </span>
                ) : null}
              </Col>
            </Row>
            <Row tag="form" className="gy-1 gx-2 mt-75">
              <Col className="text-lg-end text-md-center mt-1" xs={12}>
                <Button className="me-1" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button
                  color="secondary"
                  outline
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    );
  };

  const EditRoomViewModal = ({ id }) => {
    const roomViewData = roomViews.filter(
      (roomView) => roomView.roomViewID === id
    );
    console.log("roomViewData", roomViewData);

    const [editRoomView, setEditRoomView] = useState(roomViewData[0]?.roomView);
    const [editRoomViewDesc, setEditRoomViewDesc] = useState(
      roomViewData[0]?.roomViewDesc
    );
    const [editRoomViewStatus, setEditRoomViewStatus] = useState(
      roomViewData[0]?.status
    );

    const [editDisplay, setEditDisplay] = useState(false);

    const edtNewRoomView = () => {
      try {
        const roomTypeDetails = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "update",
          RoomViewID: id,
          RoomView: editRoomView,
          RoomViewDesc: editRoomViewDesc,
          Status: editRoomViewStatus,
        };
        axios
          .post(`/getdata/bookingdata/roomviewdetails`, roomTypeDetails)
          .then((res) => {
            // roomViewList()
            setRefresh(res);
          });
      } catch (error) {
        console.log("RoomType Error", error.message);
      }
    };
    const editHandleSubmit = () => {
      setEditDisplay(true);
      if (editRoomView.trim() && editRoomViewDesc.trim() !== "") {
        edtNewRoomView();
        handleEditModal();
        toast.success("Room View Edited Succesfully!", {
          position: "top-center",
        });
      }
    };

    return (
      <Modal
        isOpen={showEdit}
        toggle={handleEditModal}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={handleEditModal}>
          Edit Room View
        </ModalHeader>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <>
            <Row className="mx-5">
              <Col md="12" className="mb-2">
                <Label className="form-label" for="roomView">
                  <span className="text-danger">*</span>Room View
                </Label>
                <Input
                  type="text"
                  name="roomView"
                  id="roomView"
                  value={editRoomView}
                  onChange={(e) => setEditRoomView(e.target.value)}
                  invalid={editDisplay && editRoomView.trim() === ""}
                />
                {editDisplay && !editRoomView.trim() ? (
                  <span className="error_msg_lbl">Enter Room View </span>
                ) : null}
              </Col>
              <Col md="12" className="mb-2">
                <Label className="form-label" for="RoomViewDesc">
                  <span className="text-danger">*</span>Room View Description
                </Label>
                <Input
                  type="textarea"
                  name="RoomViewDesc"
                  id="RoomViewDesc"
                  value={editRoomViewDesc}
                  onChange={(e) => setEditRoomViewDesc(e.target.value)}
                  invalid={editDisplay && editRoomViewDesc.trim() === ""}
                />
                {editDisplay && !editRoomViewDesc.trim() ? (
                  <span className="error_msg_lbl">
                    Enter Room View Description{" "}
                  </span>
                ) : null}
              </Col>
            </Row>
            <Row tag="form" className="gy-1 gx-2 mt-75">
              <Col lg="6">
                <Label className="form-label">Bed Type Status</Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select w-100"
                  classNamePrefix="select"
                  placeholder="Select Room status"
                  options={statusOptions}
                  value={statusOptions?.filter(
                    (c) => c.value === editRoomViewStatus
                  )}
                  onChange={(e) => setEditRoomViewStatus(e.value)}
                />
                {editDisplay && editRoomViewStatus === "" && (
                  <span className="text-danger">Room Status is required</span>
                )}
              </Col>
              <Col className="text-lg-end text-md-center mt-1" xs={12}>
                <Button
                  className="me-1"
                  color="primary"
                  onClick={editHandleSubmit}
                >
                  Submit
                </Button>
                <Button color="secondary" outline onClick={handleEditModal}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    );
  };

  const DeleteRoomViewModal = ({ id }) => {
    const data = roomViews.filter((roomView) => roomView.roomViewID === id);

    const deleteNewRoomView = () => {
      try {
        const roomTypeDetails = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "delete",
          RoomViewID: id,
        };
        axios
          .post(`/getdata/bookingdata/roomviewdetails`, roomTypeDetails)
          .then((res) => {
            // roomViewList()
            setRefresh(res);
          });
      } catch (error) {
        console.log("RoomType Error", error.message);
      }
    };
    const handleDeleteRoomView = () => {
      deleteNewRoomView();
      setDel(!del);
    };

    return (
      <Modal
        isOpen={del}
        toggle={() => setDel(!del)}
        className="modal-dialog-centered"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={() => setDel(!del)}>
          Are you sure to delete {data[0]?.roomView} permanently?
        </ModalHeader>
        <ModalBody>
          <Row className="text-center">
            <Col xs={12}>
              <Button
                color="danger"
                className="m-1"
                onClick={handleDeleteRoomView}
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
    );
  };

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.roomViewID.toLowerCase().includes(query.toLowerCase()) ||
        item.roomView.toLowerCase().includes(query.toLowerCase())
    );
  };

  const roomViewTable = [
    {
      name: "ID",
      width: "150px",
      sortable: true,
      selector: (row) => row.roomViewID,
    },
    {
      name: "Room View",
      sortable: true,
      selector: (row) => row.roomView,
    },
    {
      name: "Room View Description",
      selector: (row) => row.roomViewDesc,
    },
    {
      name: "Status",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.Status === "Active" ? (
              <Badge color="light-success"> {row.status}</Badge>
            ) : (
              <Badge color="light-danger"> {row.status}</Badge>
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
                setSelected_roomView(row.roomViewID);
              }}
              size={15}
            />
            <Trash
              className="me-50"
              size={15}
              onClick={() => {
                setDel(true);
                setSelected_roomView(row.roomViewID);
              }}
            />
          </Col>
        </>
      ),
    },
  ];
  return (
    <>
      {console.log("roomViews", roomViews)}
      <Card>
        <CardHeader>
          <CardTitle>Room View</CardTitle>
          <input
            type="text"
            placeholder="search"
            className="form-control input-default w-50"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button color="primary" onClick={() => setShow(true)}>
            Add Room View
          </Button>
        </CardHeader>
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={search(roomViews)}
                columns={roomViewTable}
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                progressPending={loader}
              />
            </Col>
          </Row>
          <div>
            <Button className="me-2" color="primary" onClick={roomViewList}>
              Reload
            </Button>
          </div>
        </CardBody>
      </Card>
      {/* <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardBody>
                            <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                                <h2>Room View</h2>
                                <Button color='primary' onClick={() => setShow(true)}>Add Room View</Button>
                            </CardTitle>
                            <CardText>

                                <DataTable
                                    noHeader
                                    data={roomViews}
                                    columns={roomViewTable}
                                    className='react-dataTable'
                                    pagination
                                    progressPending={loader}
                                />

                            </CardText>
                            <div>
                                <Button className='me-2' color='primary' onClick={roomViewList}>Reload</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
      {show ? <NewRoomViewModal /> : <></>}
      {showEdit ? <EditRoomViewModal id={selected_roomView} /> : <></>}
      {del ? <DeleteRoomViewModal id={selected_roomView} /> : <></>}
      {show | showEdit | del ? (
        <div className="modal-backdrop fade show"></div>
      ) : null}
    </>
  );
};

export default RoomView;
