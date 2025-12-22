import React, { useState, useEffect } from 'react'
import { Badge, Col, Label } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import moment from 'moment'

// const peopleAllowedOptions = [
//     { value: 0, label: '0' },
//     { value: 1, label: '1' },
//     { value: 2, label: '2' },
//     { value: 3, label: '3' },
//     { value: 4, label: '4' },
//     { value: 5, label: '5' },
//     { value: 6, label: '6' },
//     { value: 7, label: '7' },
//     { value: 8, label: '8' },
//     { value: 9, label: '9' },
//     { value: 10, label: '10' }
// ]

const NoOfPeople = ({ r, i, updateBookRoom, bookingData, rates }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    console.log('bookedrooms', r)
    console.log('mealSelect', r.selected_meal)
    console.log('booking data', bookingData)

    const [updated, setUpdated] = useState(false)
    const [adult, setAdult] = useState(r.adult_occ)
    console.log('adulte', adult)
    const [children, setChildren] = useState(r.child_occ)
    const [infant, setInfant] = useState(r.infant_occ)
    const [meal, setMeal] = useState(r.selected_meal)
    console.log('meal', meal);
    const [mealId, setMealId] = useState()
    console.log('mealid', mealId);
    const [roomRates, setRoomRates] = useState([])

    const [ratePlans, setRatePlans] = useState([])

    const getroomRatePlan = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "RatePlan",
                Status: "Active",
                RoomID: r.roomID
            }
            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)
            if (res.data[0].length > 0) {
                setRatePlans(res.data[0])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getRoomRates = () => {
        console.log('rates', typeof rates, rates, r.roomID);
        const result = rates?.filter(j => j.ROOMID === r.roomID)
        result.length > 0 ? setRoomRates(result) : setRoomRates([])
    }

    useEffect(() => {
        getroomRatePlan()
        getRoomRates()
    }, [])

    console.log('ROOMRATES', roomRates)

    const no_of_person_options = (value) => {
        let arr = []
        for (let i = 0; i <= value; i++) {
            arr.push({ value: i, label: `${i}` })
        }
        return arr
    }

    console.log('ratePlans', ratePlans)
    const mealsOptions = ratePlans?.map(function (meals) {
        return { value: meals.PlanRate, label: `${meals.RatePlanID} - ${meals.MealType}`, ...meals }
    })
    console.log('mealsOptions', mealsOptions)

    const bookingDetail =
    {
        RoomID: r.roomID,
        Adult: adult,
        Children: children,
        Infant: infant,
        MealID: mealId
    }
    bookingData[i] = bookingDetail

    const updateRoom = (MealPrice) => {
        const total = r.price + r.extra_adult_price + r.extra_child_price + r.selected_meal_price
        // const total = r.price + r.extra_adult_price + r.extra_child_price + MealPrice
        r.total_price = total
        r.gst = total * (r.gst_percentage / 100)
        updateBookRoom(r, i)
    }

    return (
        <>
            {console.log('mealsOptions', mealsOptions)}
            <tr key={i}>
                <td>
                    <h5>{r.roomCat}</h5>
                    <div style={{ width: '25rem', margin: 'auto' }}>
                        {
                            roomRates.length > 0 && (
                                roomRates.map((i, ridx) => {
                                    return (
                                        <Badge className='me-1' key={ridx} color='light-secondary' >
                                            <Col>{moment(i.ROOMDATE).format('DD-MM')}</Col>
                                            <Col>₹ {i.ROOMRATE}</Col>
                                        </Badge>
                                    )
                                })
                            )
                        }
                    </div>
                    <div className='my-1'>Cost - {r.total_price} </div>
                    {/* <div className='my-1'>Cost - {mealPrice !== '' ? Number(r.price + r.extra_adult_price + r.extra_child_price + mealPrice[0]?.Price).toLocaleString() : Number(r.price + r.extra_adult_price + r.extra_child_price).toLocaleString()}</div> */}
                </td>
                <td className='d-flex flex-row justify-content-center align-items-center'>
                    <div>
                        <Label>Adults</Label>
                        <Select
                            placeholder='No. of Adults'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={{ value: `${adult}`, label: `${adult}` }}
                            // options={peopleAllowedOptions.filter((o, index) => index <= (r.adultsAllowed) && index > 0)}
                            options={no_of_person_options(r.adultsAllowed)}
                            onChange={e => {
                                r.adult_occ = e.value
                                let extra = 0
                                if (r.adult_occ > r.adultBase) {
                                    extra = (r.adult_occ - r.adultBase) * r.per_extra_adult_price
                                }
                                r.extra_adult_price = extra
                                setUpdated(!updated)
                                setAdult(r.adult_occ)
                                updateRoom()
                            }}
                        />
                    </div>
                    <div className='m-1'>
                        <Label>Child</Label>
                        <Select
                            placeholder='No. of childrens'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={{ value: `${children}`, label: `${children}` }}
                            // options={peopleAllowedOptions.filter((o, index) => index <= (r.childrenAllowed))}
                            options={no_of_person_options(r.childrenAllowed)}
                            isDisabled={r.childrenAllowed === '0'}
                            onChange={e => {
                                r.child_occ = e.value
                                let extra = 0
                                if (r.child_occ > r.childBase) {
                                    extra = (r.child_occ - r.childBase) * r.per_extra_child_price
                                }
                                r.extra_child_price = extra
                                setUpdated(!updated)
                                setChildren(r.child_occ)
                                updateRoom()
                            }}
                        />
                    </div>
                    <div className='m-1'>
                        <Label>Infant</Label>
                        <Select
                            placeholder='No. of Infants'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            // options={peopleAllowedOptions.filter((o, index) => index <= (r.infantAllowed))}
                            options={no_of_person_options(r.infantAllowed)}
                            value={{ value: `${infant}`, label: `${infant}` }}
                            onChange={e => {
                                r.infant_occ = e.value
                                setUpdated(!updated)
                                setInfant(r.infant_occ)
                                updateRoom()
                            }}
                        />
                    </div>
                </td>
                <td>
                    <div>
                        <Select
                            menuPortalTarget={document.body}
                            menuPlacement='auto'
                            theme={selectThemeColors}
                            className='react-select mt-1 mealDropdown'
                            classNamePrefix='select'
                            placeholder='Select Rate Plan'
                            options={mealsOptions}
                            value={mealsOptions?.filter(c => c.value === meal)}
                            onChange={e => {
                                r.selected_meal = e.label
                                r.selected_meal_price = e.value
                                setMeal(e.value)
                                console.log('meal')
                                setMealId(e.MealID)
                                setUpdated(!updated)
                                updateRoom()
                            }}
                        />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default NoOfPeople