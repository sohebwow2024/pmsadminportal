import { useEffect, useState } from "react";
// ** Reactstrap Imports
import { Row, Col, Form, Label, Button, Spinner, Input } from "reactstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-hot-toast";
import axios from "../../../API/axios";

// ** Utils
import { selectThemeColors } from "@utils";
import { ArrowLeft, ArrowRight, Edit3 } from "react-feather";

// ** Store & Actions
import { store } from "@store/store";
// import {
//     setGuest,
//     setBookingSourceStore,
//     setSourceTypeStore,
//     setPaymentTypeDropdownStore,
//     setPaymentModeDropdownStore,
//     setCustomerIdStore,
//     setLoaderStore,
//     setBookingSourceDropdownStore,
//     setGuestDetailDropdownStore,
//     setSpecialNote
// } from '@store/booking'

import {
  setSrcId,
  setSrcTypeId,
  setGuestId,
  setSpecialNote,
} from "../../../redux/reserve";

import { useSelector } from "react-redux";
import NewRegisterGuest from "./NewRegisterGuest";
import NewRegisterAgency from "./NewRegisterAgency";
import NewEditGuest from "./NewEditGuest";

const NewGuestDetails = ({ stepper }) => {
  console.log('guest');

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  let roleType = getUserData?.UserRoleType
  const reserveStore = useSelector((state) => state.reserveSlice);

  const [display, setDisplay] = useState(false);
  const [loader, setLoader] = useState(false);

  //** For New User Registeration
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [editGuest, setEditGuest] = useState(false);
  const handleEditGuest = () => setEditGuest(!editGuest);

  const [openAgency, setOpenAgency] = useState(false);
  const handleOpenAgency = () => setOpenAgency(!openAgency);

  const [bookSrcOpt, setBookSrcOpt] = useState([]);
  const [bookSrcTypOpt, setBookSrcTypOpt] = useState([]);
  const [guestOptions, setGuestOptions] = useState([]);

  const [bookingSourceId, setBookingSourceId] = useState(
    reserveStore?.sourceId !== "" ? reserveStore.sourceId : roleType === 'Travel Agent' ? 'BSID20230220AA00001' : ''
  );
  const [selSourceType, setSelSourceType] = useState(
    reserveStore?.sourceTypeId !== "" ? reserveStore.sourceTypeId : ""
  );
  const [selGuestId, setSelGuestId] = useState(
    reserveStore?.customerId !== "" ? reserveStore.customerId : ""
  );
console.log("selGuestId", selGuestId);
  const [note, setNote] = useState(
    reserveStore?.specialNote !== "" ? reserveStore.specialNote : ""
  );

  const getBookSrcOpt = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      const res = await axios.post(`/getdata/bookingdata/bookingsource`, obj);
      console.log("bookSrcres", res);
      let result = res?.data[0];
      if (result.length > 0) {
        let newArr = result.map((s) => {
          return { value: s.bookingSourceID, label: s.bookingSource };
        });
        setBookSrcOpt(newArr);
      } else {
        setBookSrcOpt([]);
      }
    } catch (error) {
      console.log("BookSrcOptErr", error);
    }
  };

  const getBookSrcTypOpt = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        BookingSourceID: roleType === 'Travel Agent' ? 'BSID20230220AA00001' : bookingSourceId,
        Event: "select",
      };
      const res = await axios.post("/getdata/bookingdata/sourcetype", obj);
      console.log("bookSrcTypres", res);
      let result = res?.data[0];
      if (result.length > 0) {
        let newArr = result.map((s) => {
          return { value: s?.sourceTypeID, label: s?.sourceType };
        });
        setBookSrcTypOpt(newArr);
      } else {
        setBookSrcTypOpt([]);
      }
    } catch (error) {
      console.log("BookTypOpt", error);
    }
  };

  const handleGuestOptions = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        SearchPhrase: null,
        Event: "select",
      };
      const res = await axios.post(`/getdata/bookingdata/guestdetails`, obj);
      console.log("Guest data - OK > ", res);
      let result = res?.data[0];
      let arr = result.map((r) => {
        return {
          value: r?.guestID,
          label: `${r.guestName} : ${r.guestEmail} : ${r.guestMobileNumber}`,
          ...r,
        };
      });
      console.log("Array==>", arr);
      setGuestOptions(arr);
    } catch (error) {
      console.log("guesterror", error);
    }
  };

  useEffect(() => {
    getBookSrcOpt();
    handleGuestOptions();
  }, []);

  useEffect(() => {
    getBookSrcTypOpt();
  }, [bookingSourceId, openAgency]);

  const onSubmit = (e) => {
    e.preventDefault();
    setDisplay(true);
    setLoader(true);
    if (
      bookingSourceId !== "" &&
      selGuestId !== "" &&
      bookSrcTypOpt.length === 0) {
      store.dispatch(setSpecialNote(note));
      stepper.next();
      setLoader(false);
    } else if (
      bookingSourceId !== "" &&
      selGuestId !== "" &&
      bookSrcTypOpt.length > 0 &&
      selSourceType !== ""
    ) {
      store.dispatch(setSpecialNote(note));
      stepper.next();
      setLoader(false);
    } else {
      toast.error("Fill all Fields!");
      setLoader(false);
    }
  };

  useEffect(() => {
    handleGuestOptions();
  }, [open, editGuest]);
  { roleType === 'Travel Agent' ? store.dispatch(setSrcId('BSID20230220AA00001')) : '' }
  return (
    <>
      {console.log("bookSrcTypOpt", bookSrcTypOpt, bookingSourceId)}
      <Form onSubmit={(e) => onSubmit(e)}>
        <Row className="d-flex flex-column">
          <Col className="d-flex flex-md-row flex-column justify-content-around align-items-center ">
            <div className="me-md-1 me-0 my-1  w-100">
              <Label>
                Booking Source<span className="text-danger">*</span>
              </Label>
              <Select
                placeholder=""
                menuPlacement="auto"
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                isDisabled={roleType === 'Travel Agent' ? true : false}
                options={bookSrcOpt}
                value={bookSrcOpt?.filter((c) => roleType === 'Travel Agent' ? c.label === 'Travel Agent' : c.value === bookingSourceId)}
                onChange={(e) => {
                  setBookingSourceId(e.value);
                  store.dispatch(setSrcId(e.value));
                  setSelSourceType("");
                  store.dispatch(setSrcTypeId(""));
                  console.log('click', roleType === 'Travel Agent');
                }}
                invalid={display && bookingSourceId === ""}
              />
              {display && !bookingSourceId ? (
                <Label className="text-danger">select Booking Source !</Label>
              ) : null}
            </div>
            <div className="ms-md-1 ms-0 w-100">
              <Label className="form-label" for="sourceType">
                Source Type{<span className="text-danger">*</span>}
                {bookingSourceId !== "" && bookSrcTypOpt.length === 0 && (
                  <span className="text-danger">
                    Create Source Type in Masters!
                  </span>
                )}
              </Label>
              <CreatableSelect
                // isDisabled={bookSrcTypOpt.length === 0 && bookingSourceId !== "BSID20230220AA00001" && bookingSourceId !== "BSID20230220AA00002"}
                placeholder=""
                menuPlacement="auto"
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={bookSrcTypOpt}
                value={bookSrcTypOpt?.filter((c) => c.value === selSourceType)}
                onChange={(e) => {
                  setSelSourceType(e.value);
                  store.dispatch(setSrcTypeId(e.value));
                }}
                onCreateOption={handleOpenAgency}
                invalid={
                  display && bookSrcTypOpt.length !== 0 && selSourceType === ""
                }
              />
              {display && bookSrcTypOpt.length !== 0 && selSourceType === "" ? (
                <Label className="text-danger">Select a Source Type!</Label>
              ) : null}
            </div>
          </Col>
          <Col className="my-1">
            <Label className="form-label" for="guestDetails">
              Guest Details (Search With Name, Email, Mobile)
              <span className="text-danger">*</span>
              {selGuestId ? (
                <span onClick={handleEditGuest} className="mx-1 cursor-pointer">
                  (<Edit3 color="blue" size={15} /> Edit Guest details)
                </span>
              ) : null}
            </Label>
            <CreatableSelect
              placeholder=""
              menuPlacement="auto"
              menuPortalTarget={document.body}
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={guestOptions}
              formatCreateLabel={(userInput) =>
                `Create new Guest '${userInput}'`
              }
              value={guestOptions?.filter((c) => c.value === selGuestId)}
              onChange={(e) => {
                setSelGuestId(e.value);
                store.dispatch(setGuestId(e.value));
              }}
              onFocus={() => {
                handleGuestOptions();
                console.log("called guest result");
              }}
              onCreateOption={handleOpen}
              invalid={display && selGuestId === ""}
            />
            {display && !selGuestId ? (
              <Label className="text-danger">select guest details !</Label>
            ) : null}
          </Col>
          <Col className="my-1">
            <Label className="form-label" for="specialNote">
              Special Note
            </Label>
            
            <Input
                type="textarea"
                value={note}
                onChange={(e) => {
                  // Filter out non-alphanumeric characters
                  const filteredValue = e.target.value.replace(/[^a-zA-Z0-9/ ]/g, '');
                  
                  // If the filtered value is different from the current value, update the note
                  if (filteredValue !== note) {
                    setNote(filteredValue);
                    store.dispatch(setSpecialNote(filteredValue));
                  }
                }}
              />
          </Col>
        </Row>
        <div className="mt-1 d-flex justify-content-between">
          <Button
            color="secondary"
            className="btn-prev"
            outline
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button
            type="submit"
            color="primary"
            className="btn-next"
            onClick={onSubmit}
            disabled={bookSrcTypOpt.length === 0}
          >
            <span className="align-middle d-sm-inline-block d-none">
              {loader ? <Spinner color="#FFF" /> : "Book Rooms"}
            </span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
      {open && <NewRegisterGuest open={open} handleOpen={handleOpen} handleGuestOptions={handleGuestOptions} />}
      {editGuest && (
        <NewEditGuest
          open={editGuest}
          handleOpen={handleEditGuest}
          guestData={selGuestId}
        />
      )}
      {openAgency && (
        <NewRegisterAgency
          open={openAgency}
          handleOpenAgency={handleOpenAgency}
          sourceID={bookingSourceId}
        />
      )}
    </>
  );
};

export default NewGuestDetails;
