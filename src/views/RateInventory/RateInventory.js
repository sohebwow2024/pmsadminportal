import React, { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col,
  Label,
  Table,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Input,
} from "reactstrap";
import Inventory from "./Pages/Inventory";
import Rate from "./Pages/Rate";
// import Restrictions from './Pages/Restriction'
import ScynOTA from "./Pages/ScynOTA";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import moment from "moment";
import TableDetails from "./Pages/TableDetails";
import { FaUserTie } from "react-icons/fa";
import "./RateInventry.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "../../API/axios";
import { useSelector } from "react-redux";

const RateInventory = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Rate & Inventory";

    return () => {
      document.title = prevTitle;
    };
  }, []);
  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const { LoginID, Token } = getUserData;
  let roleType = getUserData?.UserRoleType;
  const [RoomTypeID, setRoomType] = useState("");
  const [count, setCount] = useState([]);
  const [open, setOpen] = useState(1);
  const [rateRefresh, setRateRefresh] = useState(false);
  const [typeRefresh, setTypeRefresh] = useState(false);
  const [selected_date, setSelected_date] = useState(new Date());
  const [mealPlanArr, setMealPlanArr] = useState([]);
  const [selMeal, setSelMeal] = useState("");

  const [roomTypeDropdown, setRoomTypeDropdown] = useState([]);
  const [rateInventory, setRateInventory] = useState([]);

  const [flag, setFlag] = useState(false);
  const handleFlag = () => setFlag(!flag);

  const toggle = (id) => {
    open === id ? setOpen("") : setOpen(id);
  };
  useEffect(() => {
    const localcount = [];
    for (let i = 0; i < 15; i++) {
      console.log("for called, ", i);
      if (i === 0) {
        localcount.push(moment(selected_date).format("ddd D MMM YY"));
      } else {
        localcount.push(
          moment(selected_date).add(i, "days").format("ddd D MMM YY")
        );
      }
    }
    setCount(localcount);
    console.log("count-", count);
  }, [selected_date]);

  // const userId = localStorage.getItem('user-id')
  // console.log('User Id = ', userId)
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);

  const roomTypeDropdownBody = () => {
    setRoomTypeDropdown([]);
    try {
      const roomTypeBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      console.log("roomtypebody - ", roomTypeBody);
      axios
        .post("/getdata/bookingdata/roomdetails", roomTypeBody)
        .then((response) => {
          const roomTypeData = response?.data[0];
          if (
            roomTypeData &&
            roomTypeData?.length > 0 &&
            roomTypeData[0]?.roomID
          ) {
            setRoomTypeDropdown(roomTypeData);
            console.log("Room Category api Response", response?.data[0]);
          } else {
            console.log("Room Category hard coded response", roomTypeDropdown);
            console.log("Room Category wrong response", roomTypeData);
          }
        });
    } catch (error) {
      console.log("Room Category Dropdown Error", error.message);
    }
    if (roomTypeDropdown.length === 0) {
      setTypeRefresh(true);
      console.log("type...r..e..f..r..e..s..h..i..n..g");
    }
  };

  useEffect(() => {
    roomTypeDropdownBody();
    console.log("ddown - ", roomTypeDropdown);
  }, [typeRefresh, flag]);

  useEffect(() => {
    setRoomTypeOptions(
      roomTypeDropdown?.map((roomType) => {
        return {
          value: roomType.roomID,
          label: `${roomType.roomDisplayName} - ${roomType.ratePlanID}`,
        };
      })
    );
    console.log("ddown ops - ", roomTypeOptions);
  }, [roomTypeDropdown]);

  const rateInventoryList = () => {
    setRateInventory([]);
    try {
      const rateInventoryBody = {
        LoginID,
        Token,
        Seckey: "abc",
        FromDate: moment(selected_date).format("y-MM-DD HH:mm:ss"),
        Todate: moment(selected_date)
          .add(15, "days")
          .format("y-MM-DD HH:mm:ss"),
        RatePlanID: selMeal,
      };
      console.log("rateInventoryBody - ", rateInventoryBody);

      axios
        .post("/getdata/rateinventory", rateInventoryBody)
        .then((response) => {
          console.log("Rateres", response);
          const rateInventoryData = response?.data[0];
          if (
            rateInventoryData &&
            rateInventoryData?.length > 0 &&
            rateInventoryData[0].priceValidOnDate
          ) {
            setRateInventory((prev) => [...prev, rateInventoryData]);
            console.log("Rate inventory api response > ", response?.data[0]);
          } else {
            console.log("Hard Coded Rate Inventory response", rateInventory);
            console.log("wrong Rate Inventory response", rateInventoryData);
          }
        });
    } catch (error) {
      console.log("Rate Inventory Error", error.message);
    }
    if (rateInventory.length === 0) {
      setRateRefresh(true);
      console.log("r..e..f..r..e..s..h..i..n..g");
    }
  };

  useEffect(() => {
    rateInventoryList();
  }, [selected_date, rateRefresh, selMeal, flag]);

  const getMealPlans = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall",
      };
      const res = await axios.post(`/getdata/mealdetails`, obj);
      console.log("resRate", res);
      let result = res?.data[0];
      if (result.length > 0) {
        let arr = result.map((m) => {
          return { value: m.ratePlanID, label: m.ratePlan, ...m };
        });
        setMealPlanArr(arr);
        setSelMeal(arr[0].value);
      } else {
        setMealPlanArr([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getMealPlans();
  }, []);

  const dataArr = () => {
    if (RoomTypeID !== "") {
      return roomTypeDropdown
        .filter((r) => r.roomID === RoomTypeID)
        .filter((r) => r.ratePlanID === selMeal);
    } else {
      return roomTypeDropdown.filter((r) => r.ratePlanID === selMeal);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          {/* <CardTitle></CardTitle> */}
          <div>
            <h4>Notifications</h4>
            <p>System alerts and important updates</p>
          </div>
        </CardHeader>
        <CardBody>
          <Row md={12} className="d-flex justify-content-center notifcation-container">
            <div className="notifications d-flex justify-content-center">
              <div className="svg d-flex flex-column align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="text-success mx-auto mb-1"
                >
                  <path
                    d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                    opacity="0.2"
                  ></path>
                  <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
                <p>No notifications at this time</p>
              </div>
            </div>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default RateInventory;
