
import { useEffect, useState } from "react";
// ** Reactstrap Imports
import { Row, Col, Form, Label, Button, Spinner, Input } from "reactstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-hot-toast";
import axios from "../API/axios";

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
    setGuestFName,
    setGuestLName,
    setGuestMail,
    setGuestMobileNo,
    setSpecialNote,
} from "../redux/reserve";

import { useSelector } from "react-redux";
import NewRegisterGuest from "./NewReservation/Guest/NewRegisterGuest";
import NewEditGuest from "./NewReservation/Guest/NewEditGuest";
import NewRegisterAgency from "./NewReservation/Guest/NewRegisterAgency";
// import NewRegisterGuest from "./NewRegisterGuest";
// import NewRegisterAgency from "./NewRegisterAgency";
// import NewEditGuest from "./NewEditGuest";

const BKNewGuestDetails = ({ stepper }) => {
    console.log('guest');

    const getUserData = useSelector((state) => state.userManageSlice.userData);
    const { LoginID, Token } = getUserData;
    // let roleType = getUserData?.UserRoleType
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

    const [bookingSourceId, setBookingSourceId] = useState('BSID20230220AA00001');
    // const [bookingSourceId, setBookingSourceId] = useState(
    //     reserveStore?.sourceId !== "" ? reserveStore.sourceId : roleType === 'Travel Agent' ? 'BSID20230220AA00001' : ''
    // );
    const [selSourceType, setSelSourceType] = useState('STID20231005AA00009');
    // const [selSourceType, setSelSourceType] = useState(
    //     reserveStore?.sourceTypeId !== "" ? reserveStore.sourceTypeId : ""
    // );
    const [selGuestId, setSelGuestId] = useState(
        reserveStore?.customerId !== "" ? reserveStore.customerId : ""
    );
    const [GuestName, setGuestName] = useState('');
    const [GuesLasttName, setGuesLasttName] = useState('');
    const [GuestMobile, setGuestMobile] = useState('');
    const [GuestEmail, setGuestEmail] = useState('');
    const [note, setNote] = useState(
        reserveStore?.specialNote !== "" ? reserveStore.specialNote : ""
    );

    const getBookSrcOpt = async () => {
        try {
            let obj = {
                // LoginID: 'LGID001',
                // Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
                LoginID: LoginID,
                Token: Token,
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
                // LoginID: 'LGID001',
                // Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                BookingSourceID: bookingSourceId,
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
                // LoginID: 'LGID001',
                // Token: 'kM/VtisI20iV4TScJEk/Q5J2W8q4ZpGU',
                LoginID: LoginID,
                Token: Token,
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

    console.log(GuestName,
        GuesLasttName,
        GuestMobile,
        GuestEmail);

    const onSubmit = (e) => {
        e.preventDefault();
        setDisplay(true);
        setLoader(true);
        if (
            GuestName !== "" &&
            GuesLasttName !== '' &&
            GuestMobile !== '' &&
            GuestEmail !== ''
            // bookingSourceId !== "" &&
            // bookSrcTypOpt.length === 0
        ) {
            store.dispatch(setSpecialNote(note));
            stepper.next();
            setLoader(false);
        } else if (
            GuestName !== "" &&
            GuesLasttName !== '' &&
            GuestMobile !== '' &&
            GuestEmail !== ''
            // bookingSourceId !== "" &&
            // bookSrcTypOpt.length > 0 &&
            // selSourceType !== ""
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
    // { roleType === 'Travel Agent' ? store.dispatch(setSrcId('BSID20230220AA00001')) : '' }
    return (
        <>
            {console.log("bookSrcTypOpt", bookSrcTypOpt, bookingSourceId)}
            <Form onSubmit={(e) => onSubmit(e)}>
                <Row className="d-flex flex-column">
                    <Col className="d-flex flex-md-row flex-column justify-content-around align-items-center ">
                        {/* <div className="me-md-1 me-0 my-1  w-100">
                            <Label>
                                Booking Source<span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                disabled
                                value={'Booking Engine'}
                                onChange={(e) => {
                                    setBookingSourceId(BSID20231005AA00001)
                                }}
                            />
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
                            <Input
                                type="text"
                                disabled
                                value={'Booking Engine'}
                                onChange={(e) => {
                                    setSelSourceType(STID20231005AA00009)
                                }}
                            />
                        </div> */}
                    </Col>
                    <Col className="my-1">
                        {/* <Label className="form-label" for="guestDetails">
                            Guest Details
                        </Label> */}
                        <div className="row">
                            <div className="col-md-6">
                                <Label className="form-label" for="guestDetails">
                                    Guest Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    onChange={(e) => {
                                        setGuestName(e.target.value)
                                        store.dispatch(setGuestFName(e.target.value))
                                    }}
                                />
                            </div>
                            <div className="col-md-6">
                                <Label className="form-label" for="guestDetails">
                                    Guest Last Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    onChange={(e) => {
                                        setGuesLasttName(e.target.value)
                                        store.dispatch(setGuestLName(e.target.value))
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-md-6">
                                <Label className="form-label" for="guestDetails">
                                    Guest Mobile Number <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    // placeholder='XXXXX-XXXXX'
                                    id='mobile_number'
                                    type='phone'
                                    maxLength={10}
                                    onChange={e => {
                                        setGuestMobile(e.target.value)
                                        store.dispatch(setGuestMobileNo(e.target.value))
                                    }}
                                />
                            </div>
                            <div className="col-md-6">
                                <Label className="form-label" for="guestDetails">
                                    Guest Email <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    onChange={(e) => {
                                        setGuestEmail(e.target.value)
                                        store.dispatch(setGuestMail(e.target.value))
                                    }}
                                />
                            </div>
                        </div>
                        {/* <CreatableSelect
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
                        ) : null} */}
                    </Col>
                    <Col className="my-1">
                        <Label className="form-label" for="specialNote">
                            Special Note
                        </Label>
                        <Input
                            type="textarea"
                            value={note}
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    setNote(e.target.value);
                                    store.dispatch(setSpecialNote(e.target.value));
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
                    // disabled={bookSrcTypOpt.length === 0}
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

export default BKNewGuestDetails;
