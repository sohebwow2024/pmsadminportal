import React, { useState, useEffect } from 'react'
import { Badge, Col, Input, Label } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { store } from '@store/store'
import { setSelRoomArr } from '../../../redux/reserve'
import { CheckSquare, Edit } from 'react-feather'

const NewNoOfPeople = ({ arr, roomRateArr, ratePlans, newRatePlans, dateRate, setDateRate, handleRefresh, extraAdultPrice, setExtraAdultPrice,
    extraChildPrice, setExtraChildPrice,
    extraInfantPrice, setExtraInfantPrice }) => {
    console.log('arrTest', arr)
    console.log('newRatePlans', newRatePlans)
    console.log('dateRate', dateRate)
    console.log('ratePlans', ratePlans)

    const reservedRooms = useSelector(state => state.reserveSlice.selRoomArr)
    console.log('room', reservedRooms)

    const existRoomData = reservedRooms?.filter(c => c.ID === arr.ID)
    console.log('existRoomData', existRoomData);
    // debugger
    const newRoomRate = newRatePlans.filter(c => c.roomID === arr.roomID)
    console.log('sorted', newRoomRate)

    const no_of_person_options = (value) => {
        console.log('value', value)
        let arr = []
        for (let i = 0; i <= value; i++) {
            arr.push({ value: i, label: `${i}` })
        }
        return arr
    }

    // const [total, setTotal] = useState(existRoomData.length > 0 && existRoomData[0].TOTAL ? existRoomData[0].TOTAL : arr.RoomRate)
    const [total, setTotal] = useState(existRoomData.length > 0 && existRoomData[0].TOTAL ? existRoomData[0].TOTAL : newRoomRate[0]?.roomrate)
    const [tax, setTax] = useState(existRoomData.length > 0 && existRoomData[0].TAX ? existRoomData[0].TAX : 0)
    const [selAdult, setSelAdult] = useState(existRoomData.length > 0 && existRoomData[0].SEL_ADULT ? existRoomData[0].SEL_ADULT : 0)
    const [selChild, setSelChild] = useState(existRoomData.length > 0 && existRoomData[0].SEL_CHILD ? existRoomData[0].SEL_CHILD : 0)
    const [selInfant, setSelInfant] = useState(existRoomData.length > 0 && existRoomData[0].SEL_INFANT ? existRoomData[0].SEL_INFANT : 0)

    const [selRatePlan, setSelRatePlan] = useState(newRoomRate[0])
    console.log('selRatePlan', selRatePlan);
    // const [selMeal, setSelMeal] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEAL ? existRoomData[0].SEL_MEAL : '')
    const [selMeal, setSelMeal] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEAL ? existRoomData[0].SEL_MEAL : newRoomRate[0]?.mealID)
    const [selMealPrice, setSelMealPrice] = useState(existRoomData.length > 0 && existRoomData[0].SEL_MEALPRICE ? existRoomData[0].SEL_MEALPRICE : 0)
    const [selArrDateRate, setSelArrDateRate] = useState([])
    const [checked, setChecked] = useState(true)
    const [ratePlanOpt, setRatePlanOpt] = useState([])
    const [newTBTotal, setNewTBTotal] = useState(0)
    const [currentRoomId, setCurrentRoomId] = useState(0)
    const [currentRoomIdPlan, setCurrentRoomIdPlan] = useState(0)
    const [customValueUpdated, setCustomValueUpdated] = useState(false)
    const getRoomRatePlans = () => {
        let ratesPlanArr = ratePlans?.filter(plan => plan.roomID === arr.roomID)
        setRatePlanOpt(ratesPlanArr)
    }
    let targetValue = 0
    // let newTotal = rate
    // let CustomTotal = targetValue
    const handleCalc = (e) => {
        // debugger
        if (e !== undefined) {
            targetValue = e
        } else {
            targetValue = newTBTotal
        }

        let rate = selRatePlan.roomRate
        let CustomTotalLoop = 0
        {
            dateRate.length > 0 && (
                dateRate.filter(r => r.roomID === arr.roomID && r.mealID === selMeal).map((i, ridx) => {
                    console.log('jhds', i);
                    return (
                        // <>
                        // rate = (i?.ROOMRATE) + (selAdult > i.AdultBase ? ((selAdult - i.AdultBase) * i.EXTRAADULTRATE) : 0) + (selChild > i.ChildBase ? ((selChild - i.ChildBase) * i.EXTRACHILDRATE) : 0),
                        rate = (i?.roomRate) + (selAdult > i.adultBase ? ((selAdult - i.adultBase) * i.extraAdultRate) : 0) + (selChild > i.childBase ? ((selChild - i.childBase) * i.extraChildRate) : 0),
                        CustomTotalLoop = currentRoomId === i.roomID ? (Number(targetValue)) + (selAdult > i.adultBase ? ((selAdult - i.adultBase) * i.extraChildRate) : 0) + (selChild > i.childBase ? ((selChild - i.childBase) * i.extraChildRate) : 0) : 0
                        // </>
                    )
                })
            )
        }

        // let newTotal = arr.RoomRate + extraAdultPrice + extraChildPrice + extraInfantPrice + selMealPrice
        // let newTotal = selMealPrice === 0 ? selRatePlan.ROOMRATE + extraAdultPrice + extraChildPrice + extraInfantPrice : selMealPrice + extraAdultPrice + extraChildPrice + extraInfantPrice
        let newTotal = rate;
        let CustomTotal = CustomTotalLoop
        // const updatedTotal = newTotal || CustomTotal;
        // setTotal(updatedTotal)
        console.log('eeeeeeeeee', newTotal, CustomTotal, rate);
        // let newTotal = selRatePlan.ROOMRATE + selRatePlan.EXTRAADULTRATE + selRatePlan.EXTRACHILDRATE
        // e ? setTotal(e) : setTotal(newTotal)
        newTBTotal === 0 ? setTotal(newTotal) : setTotal(CustomTotal)
        console.log('newTBTotal === 0 ? newTotal : CustomTotal', newTBTotal === 0 ? newTotal : CustomTotal);
        let newTax = newTBTotal === 0 ? newTotal * (arr.igsT_P / 100) : CustomTotal * (arr.igsT_P / 100);
        setTax(newTax)
        // const rate = selRatePlan.MealID === "MLID20231005AA00001" ? selRatePlan.ROOMRATE : selMealPrice
        // console.log('myArrayFiltered', rate, selRatePlan.MealID === "MLID20231005AA00001" ? selRatePlan.ROOMRATE : selMealPrice);

        console.log('ratttttt', rate);
        let newReservedArr = reservedRooms.filter(r => r.ID !== arr.ID)
        store.dispatch(setSelRoomArr(
            [...newReservedArr,
            {
                ...arr,
                TOTAL: newTBTotal === 0 ? newTotal : CustomTotal,
                ROOM_RATE: newTBTotal === 0 ? rate : targetValue,
                FIXED_ROOM_RATE: customValueUpdated === true ? rate : selRatePlan.roomRate,
                CUSTOM_UPDATE: customValueUpdated,
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
        console.log('newReservedArr', newReservedArr);
    }

    useEffect(() => {
        getRoomRatePlans()
    }, [])



    useEffect(() => {
        handleCalc()
        // const updatedTotal = newTotal || CustomTotal;
        // setTotal(updatedTotal);
        // console.log('updatedTotal', updatedTotal);
    }, [selAdult, selChild, selInfant, selMeal, selMealPrice])


    // useEffect(() => {

    // }, []);

    return (
        <>
            <tr>
                <td className='text-center'>
                    <h5>{arr.roomDisplayName}</h5>
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
                                dateRate.filter(r => r.roomID === arr.roomID && r.mealID === selMeal).map((i, ridx) => {
                                // dateRate.filter(r => r.ROOMID === arr.roomID && r.mealID === selMeal).map((i, ridx) => {
                                    // console.log('rrrrr', r);
                                    return (
                                        <Badge className='me-1' key={ridx} color='light-secondary' >
                                            <Col>{moment(i?.Date).format('DD-MM')}</Col>
                                            {/* <Col>₹ {i?.ROOMRATE}</Col> */}
                                            <Col>₹ {i?.roomRate}</Col>
                                        </Badge>
                                    )
                                })
                            )
                        }
                    </div>
                    {/* <div className='my-1'>Cost - {total} </div> */}

                    <div className='my-1 d-flex justify-content-center align-items-center'>
                        Cost - <Input
                            className='discountField'
                            type='number'
                            max={100}
                            value={newTBTotal}
                            // placeholder='Enter discount here'
                            onChange={e => {
                                console.log('e.target.value', e)
                                setNewTBTotal(e.target.value)
                                handleCalc(e.target.value)
                                setCurrentRoomId(arr.roomID)
                                setCustomValueUpdated(true)
                            }}
                            disabled={checked === true}
                        />
                        {checked === true ? <Edit style={{ cursor: 'pointer' }}
                            color='green'
                            className="mx-1"
                            onClick={() => setChecked(false)} /> : <CheckSquare
                            style={{ cursor: 'pointer' }}
                            color='green'
                            className='mx-1'
                            id='assign'
                            onClick={async () => {
                                setChecked(true)
                            }}
                        />}


                    </div>

                </td>
                <td style={{ height: 'max-content' }} className='d-flex flex-row flex-wrap justify-content-center align-items-center mt-3'>
                    <div className='my-md-2 my-1 mx-1'>
                        <Label>Adults</Label>
                        <Select
                            placeholder='No. of Adults'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select adultsDropdown'
                            classNamePrefix='select'
                            value={no_of_person_options(arr.adultMax).filter(c => c.value === selAdult)}
                            options={no_of_person_options(arr.adultMax)}
                            onChange={e => {
                                { console.log('adult', e, arr) }
                                setSelAdult(e.value)
                                setCurrentRoomId(arr.roomID)
                                if (e.value > arr.adultBase) {
                                    // setExtraAdultPrice((e.value - arr.AdultBase) * arr.ExtraAdultPrice)
                                    setExtraAdultPrice((e.value - arr.adultBase) * selRatePlan.extraAdultRate)
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
                            value={no_of_person_options(arr.childMax).filter(c => c.value === selChild)}
                            options={no_of_person_options(arr.childMax)}
                            onChange={e => {
                                setSelChild(e.value)
                                setCurrentRoomId(arr.roomID)
                                if (e.value > arr.childBase) {
                                    // setExtraChildPrice((e.value - arr.ChildBase) * arr.ExtraChildPrice)
                                    setExtraChildPrice((e.value - arr.childBase) * selRatePlan.extraChildRate)
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
                            value={no_of_person_options(arr.infantMax).filter(c => c.value === selInfant)}
                            options={no_of_person_options(arr.infantMax)}
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
                            value={newRoomRate?.filter(c => c.mealID === selMeal)}
                            onChange={e => {
                                { console.log('mealplan', e) }
                                setSelRatePlan(e)
                                setSelMeal(e.mealID)
                                // setSelMealPrice(e.ROOMRATE)
                                setSelMealPrice(e.roomrate)
                                setNewTBTotal(0)
                                //setCurrentRoomId(0)
                                setCurrentRoomId(e.roomid)
                            }}
                        />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default NewNoOfPeople
