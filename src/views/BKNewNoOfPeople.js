
import React, { useState, useEffect } from 'react'
import { Badge, Col, Label } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { store } from '@store/store'
import { setSelRoomArr } from '../redux/reserve'

const BKNewNoOfPeople = ({ arr, roomRateArr, ratePlans, newRatePlans, dateRate, handleRefresh }) => {
    console.log('arr', arr)
    console.log('newRatePlans', newRatePlans)
    console.log('dateRate', dateRate)

    const reservedRooms = useSelector(state => state.reserveSlice.selRoomArr)
    console.log('room', reservedRooms)

    const existRoomData = reservedRooms?.filter(c => c.ID === arr.ID)
    console.log('existRoomData', existRoomData);
    const newRoomRate = newRatePlans.filter(c => c.ROOMID === arr.RoomID)
    console.log('sorted', newRoomRate)

    const no_of_person_options = (value) => {
        let arr = []
        for (let i = 0; i <= value; i++) {
            arr.push({ value: i, label: `${i}` })
        }
        return arr
    }

    // const [total, setTotal] = useState(existRoomData.length > 0 && existRoomData[0].TOTAL ? existRoomData[0].TOTAL : arr.RoomRate)
    const [total, setTotal] = useState(existRoomData.length > 0 && existRoomData[0].TOTAL ? existRoomData[0].TOTAL : newRoomRate[0]?.ROOMRATE)
    const [tax, setTax] = useState(existRoomData.length > 0 && existRoomData[0].TAX ? existRoomData[0].TAX : 0)
    const [selAdult, setSelAdult] = useState(existRoomData.length > 0 && existRoomData[0].SEL_ADULT ? existRoomData[0].SEL_ADULT : 0)
    const [selChild, setSelChild] = useState(existRoomData.length > 0 && existRoomData[0].SEL_CHILD ? existRoomData[0].SEL_CHILD : 0)
    const [selInfant, setSelInfant] = useState(existRoomData.length > 0 && existRoomData[0].SEL_INFANT ? existRoomData[0].SEL_INFANT : 0)
    const [extraAdultPrice, setExtraAdultPrice] = useState(0)
    const [extraChildPrice, setExtraChildPrice] = useState(0)
    const [extraInfantPrice, setExtraInfantPrice] = useState(0)
    const [selRatePlan, setSelRatePlan] = useState(newRoomRate[0])
    // const [selMeal, setSelMeal] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEAL ? existRoomData[0].SEL_MEAL : '')
    const [selMeal, setSelMeal] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEAL ? existRoomData[0].SEL_MEAL : newRoomRate[0]?.MealID)
    const [selMealPrice, setSelMealPrice] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEALPRICE ? existRoomData[0].SEL_MEALPRICE : 0)
    const [selArrDateRate, setSelArrDateRate] = useState([])

    const [ratePlanOpt, setRatePlanOpt] = useState([])

    const getRoomRatePlans = () => {
        let ratesPlanArr = ratePlans?.filter(plan => plan.RoomID === arr.RoomID)
        setRatePlanOpt(ratesPlanArr)
    }

    const handleCalc = () => {
        // let newTotal = arr.RoomRate + extraAdultPrice + extraChildPrice + extraInfantPrice + selMealPrice
        let newTotal = selRatePlan.ROOMRATE + extraAdultPrice + extraChildPrice
        // let newTotal = selRatePlan.ROOMRATE + selRatePlan.EXTRAADULTRATE + selRatePlan.EXTRACHILDRATE
        setTotal(newTotal)
        let newTax = newTotal * (arr.IGST_P / 100)
        setTax(newTax)
        let newReservedArr = reservedRooms.filter(r => r.ID !== arr.ID)
        store.dispatch(setSelRoomArr(
            [...newReservedArr,
            {
                ...arr,
                TOTAL: newTotal,
                TAX: newTax,
                SEL_MEAL: selMeal,
                SEL_MEALPRICE: selMealPrice,
                SEL_ADULT: selAdult,
                SEL_CHILD: selChild,
                SEL_INFANT: selInfant,
                DISCOUNT_AMT: 0
            }
            ]
        ))
        handleRefresh()
    }

    useEffect(() => {
        getRoomRatePlans()
    }, [])

    useEffect(() => {
        handleCalc()
    }, [selAdult, selChild, selInfant, selMeal, selMealPrice])


    return (
        <>
            <tr>
                <td className='text-center'>
                    <h5>{arr.RoomDisplayName}</h5>
                    <div style={{ minWidth: '25rem', margin: 'auto' }}>
                        {/* <div style={{ width: '25rem', margin: 'auto' }}> */}
                        {/* {
                            roomRateArr.length > 0 && (
                                roomRateArr.filter(j => j.ROOMID === arr.RoomID).map((i, ridx) => {
                                    return (
                                        <Badge className='me-1' key={ridx} color='light-secondary' >
                                            <Col>{moment(i.ROOMDATE).format('DD-MM')}</Col>
                                            <Col>₹ {i.ROOMRATE}</Col>
                                        </Badge>
                                    )
                                })
                            )
                        } */}
                        {
                            dateRate.length > 0 && (
                                dateRate.filter(r => r.ROOMID === arr.RoomID && r.MealID === selMeal).map((i, ridx) => {
                                    return (
                                        <Badge className='me-1' key={ridx} color='light-secondary' >
                                            <Col>{moment(i?.Date).format('DD-MM')}</Col>
                                            <Col>₹ {i?.ROOMRATE}</Col>
                                        </Badge>
                                    )
                                })
                            )
                        }
                    </div>
                    <div className='my-1'>Cost - {total} </div>
                </td>
                <td style={{ height: 'max-content' }} className='d-flex flex-row flex-wrap justify-content-center align-items-center'>
                    <div className='my-md-2 my-1 mx-1'>
                        <Label>Adults</Label>
                        <Select
                            placeholder='No. of Adults'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={no_of_person_options(arr.AdultMax).filter(c => c.value === selAdult)}
                            options={no_of_person_options(arr.AdultMax)}
                            onChange={e => {
                                setSelAdult(e.value)
                                if (e.value > arr.AdultBase) {
                                    // setExtraAdultPrice((e.value - arr.AdultBase) * arr.ExtraAdultPrice)
                                    setExtraAdultPrice((e.value - arr.AdultBase) * selRatePlan.EXTRAADULTRATE)
                                } else {
                                    setExtraAdultPrice(0)
                                }
                            }}
                        />
                    </div>
                    <div className='my-md-2 my-1 mx-1'>
                        <Label>Child</Label>
                        <Select
                            placeholder='No. of childrens'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={no_of_person_options(arr.ChildMax).filter(c => c.value === selChild)}
                            options={no_of_person_options(arr.ChildMax)}
                            onChange={e => {
                                setSelChild(e.value)
                                if (e.value > arr.ChildBase) {
                                    // setExtraChildPrice((e.value - arr.ChildBase) * arr.ExtraChildPrice)
                                    setExtraChildPrice((e.value - arr.ChildBase) * selRatePlan.EXTRACHILDRATE)
                                } else {
                                    setExtraChildPrice(0)
                                }
                            }}
                        />
                    </div>
                    <div className='my-md-2 my-1 mx-1'>
                        <Label>Infant</Label>
                        <Select
                            placeholder='No. of infant'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={no_of_person_options(arr.InfantMax).filter(c => c.value === selInfant)}
                            options={no_of_person_options(arr.InfantMax)}
                            onChange={e => {
                                setSelInfant(e.value)
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
                            // options={ratePlanOpt}
                            options={newRoomRate}
                            // value={ratePlanOpt?.filter(c => c.MealID === selMeal)}
                            value={newRoomRate?.filter(c => c.MealID === selMeal)}
                            onChange={e => {
                                setSelRatePlan(e)
                                setSelMeal(e.MealID)
                                // setSelMealPrice(e.value)
                            }}
                        />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default BKNewNoOfPeople