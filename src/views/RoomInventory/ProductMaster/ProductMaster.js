import { React, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, RefreshCcw, Trash } from "react-feather";
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
  FormFeedback,
  CardHeader,
} from "reactstrap";
import Category from "./Category";
import ProductCategory from "./ProductCategory";
const ProductMaster = () => {
  const [activeTab, setActiveTab] = useState("active");

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(!refresh);
  const data = [
    // {
    //   id: 1,
    //   type: "Basic",
    //   details: "something",
    //   dates: "22/8/2022",
    //   applicability: "all",
    //   action: "btns",
    // },
    {
      name: "Users",
      type: "Basic",
      details: "Basic package details",
      dates: "22/08/2022",
      applicability: "All Users",
      room: "100",
      disAmount: "10%",
    },
    {
      name: "Users",
      type: "Standard",
      details: "Standard package details",
      dates: "15/10/2023",
      applicability: "selected",
      room: "100",
      disAmount: "15%",
    },
  ];

  const hotelTable = [
    {
      name: "Subscription Pay Id",
      sortable: true,
      minWidth: "220px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Subscription Id",
      sortable: true,
      minWidth: "150px",
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Mode",
      sortable: true,
      minWidth: "250px",
      cell: (row) => <span>{row.details}</span>,
    },
    {
      name: "Amount",
      sortable: true,
      // minWidth: "50px",
      cell: (row) => <span>{row.dates}</span>,
    },
    {
      name: "Time",
      sortable: true,
      // minWidth: "250px",
      cell: (row) => <span>{row.applicability}</span>,
    },
    {
      // name: 'Discount Amount',
      name: "Product Id",
      sortable: true,
      // minWidth: "250px",
      cell: (row) => <span>{row.room}</span>,
    },
    {
      name: "Discount Amount",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.disAmount}</span>,
    },

    // {
    //   name: "Actions",
    //   center: true,
    //   minWidth: "80px",
    //   selector: (row) => {
    //     return (
    //       <>
    //         <Col>
    //           <Edit
    //             className="me-1 cursor-pointer"
    //             size={15}
    //             onClick={() => {
    //               handleUpdateOpen();
    //             //   setPromoId(row.promotionId);
    //             }}
    //           />
    //         </Col>
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Subscription Payment</h2>
            {/* <div className="d-flex gap-1 mt-2">
              <button
                className={`btn rounded-pill px-1 ${activeTab === "active" ? "btn-primary" : "btn-white shadow-sm fw-medium"
                }`}
                onClick={() => setActiveTab("active")}
              >
                All Subscription (2)
              </button>

              <button
                className={`btn rounded-pill px-1 ${activeTab === "archived" ? "btn-primary" : "btn-white shadow-sm fw-medium"
                }`}
                onClick={() => setActiveTab("archived")}
              >
                Active (0)
              </button>

              <button
                className={`btn rounded-pill px-1 ${activeTab === "expired" ? "btn-primary" : "btn-white shadow-sm fw-medium"
                }`}
                onClick={() => setActiveTab("expired")}
              >
                Expired (0)
              </button>
            </div> */}
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={hotelTable}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default ProductMaster;
