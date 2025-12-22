import React from 'react'
import { useState } from 'react'
import { CheckSquare, Edit3, Trash, Trash2, X } from 'react-feather'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Col, Input, Label, Row } from 'reactstrap'
import axios from '../../../API/axios'

const RoomRateCheckbox = ({ meal, index, roomData, existRatePlan, edit, handleEdit, handleRemoveRatePlan, handleChange }) => {
    console.log(meal)

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [submit, setSubmit] = useState(false)
    const [rate, setRate] = useState(meal.planRoomRate)
    const [eaRate, setEARate] = useState(meal.extraAdultRate)
    const [ecRate, setECRate] = useState(meal.extraChildRate)

    const [selId, setSelId] = useState('')

    const handleUpdate = async (mealID, roomID) => {
        setSubmit(true)
        if (rate > 0 && rate !== '' && eaRate !== '' && ecRate !== '') {
            try {
                const obj = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    Event: "addRatePlan",
                    RoomID: roomID,
                    MealID: mealID,
                    RoomRate: rate,
                    ExtraAdultPrice: eaRate,
                    ExtraChildPrice: ecRate
                }
                let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
                console.log('resinside', res)
                if (res.data[0][0].status === "Success") {
                    toast.success("Rate updated on Rate Plan")
                    setSubmit(false)
                    setSelId('')
                    handleChange()
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }
        } else {
            toast.error('Fill all correct values')
        }
    }

    return (
        <Row key={index + 1} className='mb-1'>

            <Col className='d-flex align-items-center'>
                <Label for={`${meal.mealID}`} className='fs-4'>{meal.mealType}({meal.ratePlanID})</Label>
                {/* <Input
                    id={`${meal.MealID}`}
                    className='m-1'
                    type='checkbox'
                    onChange={e => handleCheckUncheck(e, meal.MealID, roomData.RoomID)}
                    // checked={existRatePlan.find(m => m.MealID === meal.MealID)}
                    checked={meal.RoomRatePlanID !== ''}
                />
                <Label for={`${meal.MealID}`} className='fs-4'>{meal.MealType}</Label> */}
            </Col>

            <Col>
                <Label>Room Rate</Label>
                <Input
                    type='number'
                    disabled={selId !== meal.mealID}
                    value={rate}
                    invalid={submit && rate < 0}
                    onChange={e => setRate(e.target.value)}
                />
                {submit && rate < 0 && <span className='text-danger'>Value should be greater than '0'</span>}
            </Col>
            <Col>
                <Label>Extra Adult Rate</Label>
                <Input
                    type='number'
                    disabled={selId !== meal.mealID}
                    value={eaRate}
                    invalid={submit && eaRate === ''}
                    onChange={e => setEARate(e.target.value)}
                />
                {submit && eaRate === '' && <span className='text-danger'>Value should be greater than '0'</span>}
            </Col>
            <Col>
                <Label>Extra Child Rate</Label>
                <Input
                    type='number'
                    disabled={selId !== meal.mealID}
                    value={ecRate}
                    invalid={submit && ecRate === ''}
                    onChange={e => setECRate(e.target.value)}
                />
                {submit && ecRate === '' && <span className='text-danger'>Value should be greater than '0'</span>}
            </Col>
            <Col className='d-flex align-items-end'>
                {console.log('edit', edit && meal.mealID === selId, edit, meal.mealID, selId)}
                {
                    edit && meal.mealID === selId ? (
                        <>
                            <CheckSquare className='mx-1' color='green'
                                onClick={() => handleUpdate(meal.mealID, roomData.roomID)}
                            />
                            <X className='mx-1'
                                onClick={() => {
                                    handleEdit()
                                    setSelId('')
                                    setSubmit(false)
                                }} />
                        </>
                    ) : (
                        <>
                            <Edit3 className='mx-1' color='blue'
                                onClick={() => {
                                    handleEdit()
                                    setSelId(meal.mealID)
                                }}
                            />
                            {
                                meal.roomRatePlanID !== '' && (<Trash2 color='red' size={20} className='me-1' onClick={() => handleRemoveRatePlan(meal.mealID, roomData.roomID)} />)
                            }
                        </>
                    )
                }
            </Col>
        </Row>
    )
}

export default RoomRateCheckbox