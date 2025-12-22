import {
    Button,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import BillSplitAccordion from "./BillSplitAccordion";
import { useSelector } from "react-redux";
import axios from "../../../API/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BillSplitModal = ({ open, handleModalOpen, bookingID, BookingDetails, handleCheckout }) => {
    // console.log(BookingDetails)

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [rooms, setRooms] = useState([])
    const [guestData, setGuestData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [serviceData, setServiceData] = useState([])

    const [errFlag, setErrFlag] = useState(false)

    //State for Handling new Room object, to be looped over and presented in accordian.
    const [newRoomObj, setNewRoomObj] = useState([])

    const BillSplitData = async () => {
        try {
            const res = await axios.get(`/booking/BookingSplitBill?BookingId=${bookingID}&LoginID=${LoginID}&Token=${Token}`)
            console.log('SplitRres', res.data)
            if (res.data.length > 0) {
                setRooms(res?.data[0])
                setGuestData(res?.data[1])
                setRoomData(res?.data[2])
                setServiceData(res?.data[3])
                // setServiceData(res?.data[3].filter(s => s.ServiceName === "ExtraService"))
            }
        } catch (error) {
            console.log('BillSplitError', error)
        }
    }

    const handleRoomDataForSplit = () => {
        let NewRoomData = roomData?.map(r => {
            let guestArr = []
            guestData.map(g => {
                if (g.RoomNo === r.RoomNo) {
                    guestArr.push(g)
                }
            })
            return { ...r, GUEST: guestArr }
        })
        setNewRoomObj(NewRoomData)
    }

    useEffect(() => {
        BillSplitData()
    }, [open])

    useEffect(() => {
        if (guestData.length > 1 && roomData.length > 0) {
            handleRoomDataForSplit()
        }
    }, [roomData])

    const splitBillJson = useSelector(state => state.splitSlice.split)
    // console.log('splitBillJson', splitBillJson)

    const handleSplitJson = () => {
        if (splitBillJson.length > 0) {
            let room_split_total = splitBillJson.reduce((acc, obj) => { return acc + obj.ROOM.AMT }, 0)
            let pos_split_total = splitBillJson.reduce((acc, obj) => { return acc + (obj.POS.AMT ?? 0) }, 0)
            let laundary_split_total = splitBillJson.reduce((acc, obj) => { return acc + (obj.LAUNDARY.AMT ?? 0) }, 0)
            let extra_split_total = splitBillJson.reduce((acc, obj) => { return acc + (obj.EXTRA.AMT ?? 0) }, 0)

            let room_total = newRoomObj.reduce((acc, obj) => { return acc + obj.NetAmount }, 0)
            let pos_total = newRoomObj.reduce((acc, obj) => { return acc + obj?.PSTotalAmount }, 0)
            let laundary_total = newRoomObj.reduce((acc, obj) => { return acc + obj?.LSTotalAmount }, 0)
            let extra_total = newRoomObj.reduce((acc, obj) => { return acc + obj?.ESTotalAmount }, 0)

            // console.log('room', room_split_total, room_total)
            // console.log('pos', pos_split_total, pos_total)
            // console.log('laundary', laundary_split_total, laundary_total)
            // console.log('extra', extra_split_total, extra_total)

            if (room_split_total === room_total && pos_split_total === pos_total && laundary_split_total === laundary_total && extra_split_total === extra_total) {
                let json_with_details = [...splitBillJson, { roomData: roomData }, { guestData: guestData }, { serviceData: serviceData }]
                // handleCheckout(splitBillJson)
                handleCheckout(json_with_details)
                toast.success('Bill split successfull')
                setErrFlag(false)
            } else {
                toast.error('Bill Split incomplete!')
                setErrFlag(true)
            }
        }
    }


    return (
        <>
            {/* {console.log('rooms', rooms)}
            {console.log('guest', guestData)}
            {console.log('roomData', roomData)}
            {console.log('service', serviceData)}
            {console.log('newRoomObj', newRoomObj)} */}
            <Modal
                isOpen={open}
                toggle={handleModalOpen}
                className="modal-dialog-centered modal-xl"
                backdrop={true}
            >
                <ModalHeader
                    className="bg-transparent text-center"
                    toggle={handleModalOpen}
                >
                    Bill Split
                </ModalHeader>
                <ModalBody>
                    <>
                        <BillSplitAccordion
                            rooms={newRoomObj}
                            serviceData={serviceData}
                            errFlag={errFlag}
                        />
                    </>
                </ModalBody>
                <ModalFooter>
                    <Col className='mt-1  d-flex flex-row justify-content-center align-items-center'>
                        <Button className='mx-1' color='primary' onClick={() => handleSplitJson()}>Save</Button>
                        <Button className='mx-1' color='secondary' outline onClick={() => handleModalOpen()}>Cancel</Button>
                    </Col>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default BillSplitModal;
