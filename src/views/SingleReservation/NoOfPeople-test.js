import React, { useState } from 'react'
import { Label } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const peopleAllowedOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' }
]

const NoOfPeople = ({ r, i, getPrice, mealsList, updateBookRoom, bookingData }) => {

    console.log(r)
    console.log(bookingData)
    const [updated, setUpdated] = useState(false)
    const [adult, setAdult] = useState(r.adult_occ)
    const [children, setChildren] = useState(r.child_occ)
    // const [children, setChildren] = useState(r.childBase)
    const [infant, setInfant] = useState(r.infant_occ)
    console.log('mealsList', mealsList)
    const mealsOptions = mealsList?.map(function (meals) {
        return { value: meals.MealID, label: meals.MealDisplayName }
    })

    const getMealPriceById = (id) => {
        return mealsList?.filter(c => c.MealID === id)[0]?.Price
    }
    if (mealsOptions && !r.selected_meal) {
        r.selected_meal = mealsOptions[0]?.value
        r.selected_meal_price = getMealPriceById(r.selected_meal)
    }

    const [meal, setMeal] = useState(r.selected_meal)
    const [mealPrice, setMealPrice] = useState(r.selected_meal_price)

    const bookingDetail =
    {
        RoomID: r.roomID,
        Adult: adult,
        Children: children,
        Infant: infant,
        MealID: meal
    }

    //for (let index = 0; index < bookingDetail.length; index++) {
    bookingData.push(bookingDetail)
    //}

    const handle = () => {
        getPrice(mealPrice[0]?.Price)
    }

    const updateRoom = () => {
        const total = r.price + r.extra_adult_price + r.extra_child_price + r.selected_meal_price
        r.total_price = total
        updateBookRoom(r, i)
    }

    return (
        <>
            <tr key={i}>
                <td>
                    <h5>{r.roomCat}</h5>
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
                            options={peopleAllowedOptions.filter((o, index) => index <= (r.adultsAllowed) && index > 0)}
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
                        <Label>Children (6yrs & above)</Label>
                        <Select
                            placeholder='No. of childrens'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            value={{ value: `${children}`, label: `${children}` }}
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
                            options={peopleAllowedOptions.filter((o, index) => index <= (r.childrenAllowed))}
                            isDisabled={r.childrenAllowed === '0'}
                        />
                    </div>
                    <div className='m-1'>
                        <Label>Infant(Upto 5yrs)</Label>
                        <Select
                            placeholder='No. of Infants'
                            menuPlacement='auto'
                            menuPortalTarget={document.body}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            value={{ value: `${infant}`, label: `${infant}` }}
                            onChange={e => {
                                r.infant_occ = e.value
                                setUpdated(!updated)
                                setInfant(r.infant_occ)
                                updateRoom()
                            }}
                            options={peopleAllowedOptions.filter((o, index) => index <= (r.infantAllowed))}
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
                            // value={{ value: `${r.selected_meal}`, label: `${r.selected_meal}` }}
                            value={mealsOptions?.filter(c => c.value === r.selected_meal)}
                            onChange={e => {
                                r.selected_meal = e.value
                                r.selected_meal_price = mealsList?.filter(c => c.MealID === e.value)[0].Price
                                updateRoom()
                                setMeal(r.selected_meal)
                                // r.selected_meal = e.value
                                setMealPrice(mealsList?.filter(c => c.MealID === e.value))
                                // setMealsList(e.value)
                                setUpdated(!updated)
                                handle() // TODO - what it does ??
                            }}
                            options={mealsOptions}
                        />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default NoOfPeople