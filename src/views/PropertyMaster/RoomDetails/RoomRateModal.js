import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'
import { CheckSquare, Edit3, X } from 'react-feather'
import RoomRateCheckbox from './RoomRateCheckbox'

const RoomRateModal = ({ open, handleOpenRateModal, roomData }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    console.log('roomData in modal', roomData)
    const { LoginID, Token } = getUserData

    const [mealOptions, setMealOptions] = useState([])
    console.log('mealOptions', mealOptions)
    const [existRatePlan, setExistRatePlan] = useState([])
    const [checkedMeals, setCheckedMeals] = useState([])

    const [edit, setEdit] = useState(false)
    const handleEdit = () => setEdit(true)

    const [changed, setChanged] = useState(false)
    const handleChange = () => setChanged(!changed)

    const getRoomRatePlans = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "RatePlan",
                status: "Active",
                RoomID: roomData.roomID
            }

            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            // console.log('res', res.data[0])
            if (res?.data[0].length > 0) {
                // setExistRatePlan(res?.data[0])
                setCheckedMeals(res?.data[0].map(m => m?.mealID))
            }
        } catch (error) {
            console.log('roomRatePlan', error)
        }
    }

    const getMealOptions = async () => {
        try {
            const mealDetailsListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select",
                RoomID: roomData.roomID
            }
            let res = await axios.post('/getdata/mealdetails', mealDetailsListBody)
            console.log('res', res)
            console.log('mealSSSS', res?.data[0])
            if (res?.data[0].length > 0) {
                setMealOptions(res?.data[0])
            }
        } catch (error) {
            console.log("meal options", error)
        }
    }

    const handleAddRatePlan = async (mealID, roomID) => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "addRatePlan",
                RoomID: roomID,
                MealID: mealID
            }
            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            if (res.data[0][0].status === "Success") {
                toast.success("Meal Plan added to Rate Plan")
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    const handleRemoveRatePlan = async (mealID, roomID) => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "removeRatePlan",
                RoomID: roomID,
                MealID: mealID
            }
            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            // console.log('res--remove', res)
            if (res.data[0][0].status === "Success") {
                toast.success("Meal Plan removed from Rate Plan")
                getMealOptions()
                getRoomRatePlans()
                handleChange()
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    const handleCheckUncheck = (e, mealID, roomID) => {
        let result = e.target.checked
        if (result) {
            handleAddRatePlan(mealID, roomID)
            setCheckedMeals([...checkedMeals, mealID])
        } else {
            handleRemoveRatePlan(mealID, roomID)
            setCheckedMeals(checkedMeals.filter(i => i.mealID === mealID))
        }
        handleChange()
    }

    useEffect(() => {
        getMealOptions()
        getRoomRatePlans()
    }, [changed])

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpenRateModal}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={handleOpenRateModal}>
                    Add/Edit Rate Plans
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <h3>Select/Unselect Meal plans for:</h3>
                            <h4>{roomData.roomID} - {roomData.roomDisplayName}</h4>
                            {
                                mealOptions.length > 0 && (
                                    mealOptions.map((meal, index) => {
                                        return (
                                            <RoomRateCheckbox
                                                meal={meal}
                                                index={index}
                                                roomData={roomData}
                                                existRatePlan={existRatePlan}
                                                edit={edit}
                                                handleEdit={handleEdit}
                                                handleRemoveRatePlan={handleRemoveRatePlan}
                                                handleChange={handleChange}
                                            />
                                        )
                                    })
                                )
                            }
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default RoomRateModal