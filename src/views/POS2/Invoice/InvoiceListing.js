import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, Edit, Trash2 } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "../../../API/axios";
import toast from "react-hot-toast";
import { openLinkInNewTab } from "../../../common/commonMethods";
import { store } from "@store/store";
import { setPosInvoiceID } from "../../../redux/voucherSlice";
import ReleaseBill from "./ReleaseBill";

const statusOptions = [
  { value: "Active", label: "ACTIVE" },
  { value: "Inactive", label: "INACTIVE" },
];

const InvoiceListing = () => {
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;

  const navigate = useNavigate();
  const { name, id } = useParams();

  const [tdata, setTdata] = useState([]);
  const [holddata, setHolddata] = useState([]);

  const [posOrderID, setPosOrderID] = useState('');

  const [holdBill, setHoldBill] = useState(false)
  const handleHold = () => setHoldBill(!holdBill)

  const getInvoiceListing = async () => {
    try {
      const res = await axios.get("/pos_orders/all", {
        params: {
          LoginID,
          Token,
          PoSID: id,
        },
      });
      console.log('InvoiceDataaaaa', res)
      let invoiceData = res?.data[0].filter(a => a.status === "Invoiced")
      let holdData = res?.data[0].filter(a => a.status === "Hold")
      setTdata(invoiceData);
      setHolddata(holdData);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getInvoiceListing();
  }, []);

  const [active, setActive] = useState(1);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const tableColumns = [
    {
      name: "Invoice Id",
      sortable: true,
      width: '250px',
      selector: (row) => row.invoiceID,
    },
    {
      name: "Inv. No.",
      sortable: true,
      selector: (row) => row.invoiceNumber,
    },
    {
      name: "Booking Id",
      sortable: true,
      width: '250px',
      selector: (row) => row.bookingID,
    },
    {
      name: "Room No",
      sortable: true,
      width: '150px',
      selector: (row) => row.roomNo,
    },
    {
      name: "Order Id",
      sortable: true,
      width: '250px',
      selector: (row) => row.poSOrderID,
    },

    {
      name: "Amount",
      sortable: true,
      selector: (row) => row.totalDue,
    },
    {
      name: "Invoice",
      minWidth: "180px",
      selector: (row) => {
        return (
          <Button.Ripple
            color="primary"
            onClick={() => {
              openLinkInNewTab("/posInvoice");
              store.dispatch(setPosInvoiceID(row.invoiceID));
            }}
          >
            View
          </Button.Ripple>
        );
      },
    },
  ];
  const tableColumns1 = [
    // {
    //   name: "Invoice Id",
    //   sortable: true,
    //   width: '250px',
    //   selector: (row) => row.InvoiceID,
    // },
    // {
    //   name: "Inv. No.",
    //   sortable: true,
    //   selector: (row) => row.InvoiceNumber,
    // },
    {
      name: "Booking Id",
      sortable: true,
      width: '250px',
      selector: (row) => row.bookingID,
    },
    {
      name: "Order Id",
      sortable: true,
      width: '250px',
      selector: (row) => row.poSOrderID,
    },
    {
      name: "Room No",
      sortable: true,
      width: '150px',
      selector: (row) => row.roomNo,
    },
    {
      name: "Amount",
      sortable: true,
      selector: (row) => row.totalDue,
    },
    {
      name: "Invoice",
      minWidth: "180px",
      selector: (row) => {
        return (
          <Button.Ripple
            color="primary"
            onClick={() => {
              handleHold()
              setPosOrderID(row.poSOrderID)
              console.log('hold');
            }}
          >
            Release
          </Button.Ripple>
        );
      },
    },
  ];

  return (
    <>
      <div className="d-flex">
        <Button
          className="mb-1 "
          size="sm"
          color="primary"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={25} color="#FFF" />
        </Button>
        <span className="fs-3 mx-auto">{name} - POS Invoices Listing</span>
      </div>
      <Card>
        <CardHeader>
          {/* <CardTitle>POS Table added for {name}</CardTitle> */}
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <Nav tabs >
                <NavItem key={1} className="col-lg-6 fs-3 col-md-6 col-sm-6">
                  <NavLink
                    active={active === 1}
                    onClick={() => {
                      toggle(1)
                    }}
                  >Invoice</NavLink>
                </NavItem>
                <NavItem key={2} className="col-lg-6 fs-3 col-md-6 col-sm-6">
                  <NavLink
                    active={active === 2}
                    onClick={() => {
                      toggle(2)
                    }}>
                    Holding Bill

                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={active} >
                <TabPane tabId={1}>
                  <Col className="react-dataTable">
                    <DataTable
                      noHeader
                      pagination
                      data={tdata}
                      columns={tableColumns}
                      className="react-dataTable"
                      sortIcon={<ChevronDown size={10} />}
                      paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                  </Col>
                </TabPane>
                <TabPane tabId={2} >
                  <Col className="react-dataTable">
                    <DataTable
                      noHeader
                      pagination
                      data={holddata}
                      columns={tableColumns1}
                      className="react-dataTable"
                      sortIcon={<ChevronDown size={10} />}
                      paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                  </Col>
                </TabPane>

              </TabContent>
            </Col>

          </Row>
        </CardBody>
      </Card>
      {holdBill && <ReleaseBill holdBill={holdBill} handleHold={handleHold} id={posOrderID} getInvoiceListing={getInvoiceListing} />}
    </>
  );
};

export default InvoiceListing;
