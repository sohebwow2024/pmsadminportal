import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Row, Table } from 'reactstrap'
// ** Store & Actions
import { store } from '@store/store'
import { setSplit } from '../../../redux/splitBill'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const NewBillSplitForm = ({ data }) => {
    // console.log('data', data)

    const finalBill = useSelector(state => state.splitSlice.split)
    console.log('finalBill', finalBill)

    const [checkList, setChecklist] = useState([])
    const [roomTotal, setRoomTotal] = useState(data.NetAmount ?? 0)
    const [posTotal, setPostTotal] = useState(data.PSTotalAmount ?? 0)
    const [laundaryTotal, setLaundaryTotal] = useState(data.LSTotalAmount ?? 0)
    const [extraTotal, setExtraTotal] = useState(data.ESTotalAmount ?? 0)
    const [equalDistribution, setEqualDistribution] = useState('')
    const [equalDistributionLaundary, setEqualDistributionLaundary] = useState('')
    const [equalDistributionPos, setEqualDistributionPos] = useState('')
    const [equalDistributionExtra, setEqualDistributionExtra] = useState('')
    const [refresh, setRefresh] = useState(false)
    const handleRefresh = () => setRefresh(!refresh)
    const [flag, setFlag] = useState(false)
    const handleFlag = () => setFlag(!flag)

    const handleSinglGuest = () => {
        let is_added = finalBill.includes(g => g.RoomNo === data.RoomNo)
        // console.log('is_added', is_added)
        if (is_added === false && data.Adult === 1) {
            let obj = {
                ...data.GUEST[0],
                ROOM: {
                    CGST_P: data.CGST_P,
                    SGST_P: data.SGST_P,
                    IGST_P: data.IGST_P,
                    ApplyGST: data.ApplyGST,
                    AMT: data.NetAmount
                },
                POS: {
                    NAME: data.PSServiceName,
                    DISCOUNT: data.PSDiscount ?? 0,
                    TAX: data.PSDiscount ?? 0,
                    AMT: data.PSTotalAmount ?? 0
                },
                LAUNDARY: {
                    NAME: data.LSServiceName,
                    DISCOUNT: data.LSDiscount ?? 0,
                    TAX: data.LSTaxAmount ?? 0,
                    AMT: data.LSTotalAmount ?? 0
                },
                EXTRA: {
                    NAME: data.ESServiceName,
                    DISCOUNT: data.ESDiscount ?? 0,
                    TAX: data.ESTaxAmount ?? 0,
                    AMT: data.ESTotalAmount ?? 0
                }
            }
            let finalArr = [...finalBill, obj]
            store.dispatch(setSplit(finalArr))
        }
    }

    // *** FUNCTIONS FOT ROOM ***

    const handleRoomTotalForExistData = () => {
        let filter_arr = finalBill.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let room_split_total = filter_arr.reduce((acc, obj) => { return acc + (obj.ROOM.AMT ?? 0) }, 0)
            setRoomTotal(Number(data.NetAmount - room_split_total).toFixed(2))
        }
    }

    const handleRoomTotal = (arr) => {
        // console.log('hit', arr)
        let filter_arr = arr.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let room_split_total = filter_arr?.reduce((acc, obj) => { return acc + (obj.ROOM.AMT ?? 0) }, 0)
            setRoomTotal(Number(data.NetAmount - room_split_total).toFixed(2))
        }
    }
    const totalGuests = data.GUEST.length;
    const equalAmountRoom = roomTotal / totalGuests;
    const equalAmountPos = posTotal / totalGuests;
    const equalAmountService = extraTotal / totalGuests;
    const equalAmountLaundary = laundaryTotal / totalGuests;
    const handleRoomAmt = (e, id) => {
        // console.log('finalBill', data);
        if (e.target.value >= 0) {
            let amt_exist = finalBill.filter(g => g.CheckInGuestID === id)
            if (amt_exist.length > 0) {
                // console.log('finalBill1');
                let clone = structuredClone(amt_exist[0])
                clone.ROOM.AMT = Number(e.target.value)
                clone.ROOM.CGST_P = data.CGST_P
                clone.ROOM.SGST_P = data.SGST_P
                clone.ROOM.IGST_P = data.IGST_P
                clone.ApplyGST = data.ApplyGST
                let filteredArr = finalBill.filter(g => g.CheckInGuestID !== id)
                let finalArr = [...filteredArr, clone]
                store.dispatch(setSplit(finalArr))
                handleRoomTotal(finalArr)
            } else {
                // console.log('finalBill2');
                let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)
                let obj = {
                    ...GUEST[0],
                    ROOM: {
                        CGST_P: data.CGST_P,
                        SGST_P: data.SGST_P,
                        IGST_P: data.IGST_P,
                        ApplyGST: data.ApplyGST,
                        AMT: Number(e.target.value)
                    },
                    POS: {},
                    LAUNDARY: {},
                    EXTRA: {}
                }
                let finalArr = [...finalBill, obj]
                store.dispatch(setSplit(finalArr))
                handleRoomTotal(finalArr)
            }
        } else {
            toast.error('Enter correct amount!')
        }
    }

    const handleRoomAmountEqually = (e) => {
        console.log('data', data.GUEST);
        if (e.target.name === 'Room') {
            let arr = []
            let guestId = []
            data.GUEST.map(g => {
                // setChecklist(...checkList, g.CheckInGuestID)
                let obj = {
                    ...g,
                    ROOM: {
                        CGST_P: g.CGST_P ?? 0,
                        SGST_P: g.SGST_P ?? 0,
                        IGST_P: g.IGST_P ?? 0,
                        ApplyGST: g.ApplyGST,
                        AMT: Number(equalAmountRoom)
                    },
                    POS: {},
                    LAUNDARY: {},
                    EXTRA: {}
                }
                arr.push(obj)
                guestId.push(g.CheckInGuestID)
            })
            // arr.map(i => setChecklist(...checkList, i.CheckInGuestID))
            console.log(arr);
            let finalArr = [...finalBill, ...arr]
            console.log('finalArr', finalArr, checkList);
            store.dispatch(setSplit(finalArr))
            setChecklist(...checkList, guestId)
            handleRefresh()
            handleRoomTotal(finalArr)
        }
        // let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)


    }

    // const getRoomValue = id => {
    //     if (finalBill.length > 0) {
    //         finalBill.map(b => {
    //             if (b.CheckInGuestID === id) {
    //                 console.log('bbbbb', b.ROOM.AMT, id);
    //                 const roomAmt = b.ROOM.AMT
    //                 console.log(roomAmt);
    //                 return roomAmt
    //             } else {
    //                 return 0
    //             }
    //         })
    //     } else {
    //         return 0
    //     }
    // }

    const getRoomValue = id => {
        console.log('ID:', id); // Check if 'id' is being received correctly
        if (finalBill.length > 0) {
            for (const b of finalBill) {
                if (b.CheckInGuestID === id) {
                    console.log('Found matching ID:', id);
                    const roomAmt = b.ROOM.AMT;
                    console.log('Room Amount:', roomAmt);
                    return roomAmt;
                }
            }
            console.log('No matching ID found');
            return 0;
        } else {
            console.log('finalBill is empty');
            return 0;
        }
    };

    // *** FUNCTIONS FOR POS ***

    const handlePosTotalForExistData = () => {
        let filter_arr = finalBill.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let pos_split_total = filter_arr.reduce((acc, obj) => { return acc + (obj.POS.AMT ?? 0) }, 0)
            setPostTotal(Number(data.PSTotalAmount - pos_split_total).toFixed(2))
        }
    }

    const handlePosTotal = (arr) => {
        let filter_arr = arr.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let pos_split_total = filter_arr?.reduce((acc, obj) => { return acc + (obj.POS.AMT ?? 0) }, 0)
            setPostTotal(Number(data.PSTotalAmount - pos_split_total).toFixed(2))
        }
    }

    const handlePosAmt = (e, id) => {
        if (e.target.value >= 0) {
            let amt_exist = finalBill.filter(g => g.CheckInGuestID === id)
            if (amt_exist.length > 0) {
                let clone = structuredClone(amt_exist[0])
                clone.POS.AMT = Number(e.target.value)
                clone.POS.NAME = data.PSServiceName
                clone.POS.DISCOUNT = data.PSDiscount ?? 0
                clone.POS.TAX = data.PSTaxAmount ?? 0
                let filteredArr = finalBill.filter(g => g.CheckInGuestID !== id)
                let finalArr = [...filteredArr, clone]
                store.dispatch(setSplit(finalArr))
                handlePosTotal(finalArr)
            } else {
                let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)
                let obj = {
                    ...GUEST[0],
                    ROOM: {},
                    POS: {
                        NAME: data.PSServiceName,
                        DISCOUNT: data.PSDiscount ?? 0,
                        TAX: data.PSTaxAmount ?? 0,
                        AMT: Number(e.target.value)
                    },
                    LAUNDARY: {},
                    EXTRA: {}
                }
                let finalArr = [...finalBill, obj]
                store.dispatch(setSplit(finalArr))
                handlePosTotal(finalArr)
            }
        } else {
            toast.error('Enter correct amount!')
        }
    }



    const handlePosAmountEqually = (e) => {
        console.log('data', data.GUEST);
        if (e.target.name === 'pos') {
            let arr = []
            let guestId = []
            data.GUEST.map(g => {
                // setChecklist(...checkList, g.CheckInGuestID)
                let obj = {
                    ...g,
                    ROOM: {},
                    POS: {
                        NAME: g.PSServiceName,
                        DISCOUNT: g.PSDiscount ?? 0,
                        TAX: g.PSTaxAmount ?? 0,
                        AMT: Number(equalAmountPos)
                    },
                    LAUNDARY: {},
                    EXTRA: {}
                }
                arr.push(obj)
                guestId.push(g.CheckInGuestID)
            })
            // arr.map(i => setChecklist(...checkList, i.CheckInGuestID))
            console.log(arr);
            let finalArr = [...finalBill, ...arr]
            console.log('finalArr', finalArr, checkList);
            store.dispatch(setSplit(finalArr))
            setChecklist(...checkList, guestId)
            handleRefresh()
            handlePosTotal(finalArr)
        }
        // let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)


    }


    const getPosValue = id => {
        console.log('ID:', id); // Check if 'id' is being received correctly
        if (finalBill.length > 0) {
            for (const b of finalBill) {
                if (b.CheckInGuestID === id) {
                    console.log('Found matching ID:', id);
                    const posAmt = b.POS.AMT;
                    console.log('Room Amount:', posAmt);
                    return posAmt;
                }
            }
            console.log('No matching ID found');
            return 0;
        } else {
            console.log('finalBill is empty');
            return 0;
        }
    };
    // *** FUNCTIONS FOR LAUNDARY ***

    const handleLaundaryTotalForExistData = () => {
        let filter_arr = finalBill.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let laundary_split_total = filter_arr.reduce((acc, obj) => { return acc + (obj.LAUNDARY.AMT ?? 0) }, 0)
            setLaundaryTotal(Number(data.LSTotalAmount - laundary_split_total).toFixed(2))
        }
    }

    const handleLaundaryTotal = arr => {
        let filter_arr = arr.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let laundary_split_total = filter_arr?.reduce((acc, obj) => { return acc + (obj.LAUNDARY.AMT ?? 0) }, 0)
            setLaundaryTotal(Number(data.LSTotalAmount - laundary_split_total).toFixed(2))
        }
    }

    const handleLaundaryAmt = (e, id) => {
        if (e.target.value >= 0) {
            let amt_exist = finalBill.filter(g => g.CheckInGuestID === id)
            if (amt_exist.length > 0) {
                let clone = structuredClone(amt_exist[0])
                clone.LAUNDARY.AMT = Number(e.target.value)
                clone.LAUNDARY.NAME = data.LSServiceName
                clone.LAUNDARY.DISCOUNT = data.LSDiscount ?? 0
                clone.LAUNDARY.TAX = data.LSTaxAmount ?? 0
                let filteredArr = finalBill.filter(g => g.CheckInGuestID !== id)
                let finalArr = [...filteredArr, clone]
                store.dispatch(setSplit(finalArr))
                handleLaundaryTotal(finalArr)
            } else {
                let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)
                let obj = {
                    ...GUEST[0],
                    ROOM: {},
                    POS: {},
                    LAUNDARY: {
                        NAME: data.LSServiceName,
                        DISCOUNT: data.LSDiscount ?? 0,
                        TAX: data.LSTaxAmount ?? 0,
                        AMT: Number(e.target.value)
                    },
                    EXTRA: {}
                }
                let finalArr = [...finalBill, obj]
                store.dispatch(setSplit(finalArr))
                handleLaundaryTotal(finalArr)
            }
        } else {
            toast.error('Enter correct amount!')
        }
    }



    const handleLaundaryAmountEqually = (e) => {
        console.log('data', data.GUEST);
        if (e.target.name === 'laundary') {
            let arr = []
            let guestId = []
            data.GUEST.map(g => {
                // setChecklist(...checkList, g.CheckInGuestID)
                let obj = {
                    ...g,
                    ROOM: {},
                    POS: {
                    },
                    LAUNDARY: {
                        NAME: g.LSServiceName,
                        DISCOUNT: g.LSDiscount ?? 0,
                        TAX: g.LSTaxAmount ?? 0,
                        AMT: Number(equalAmountLaundary)
                    },
                    EXTRA: {}
                }
                arr.push(obj)
                guestId.push(g.CheckInGuestID)
            })
            // arr.map(i => setChecklist(...checkList, i.CheckInGuestID))
            console.log(arr);
            let finalArr = [...finalBill, ...arr]
            console.log('finalArr', finalArr, checkList);
            store.dispatch(setSplit(finalArr))
            setChecklist(...checkList, guestId)
            handleRefresh()
            handleLaundaryTotal(finalArr)
        }
        // let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)


    }





    const getLaundaryValue = id => {
        console.log('ID:', id); // Check if 'id' is being received correctly
        if (finalBill.length > 0) {
            for (const b of finalBill) {
                if (b.CheckInGuestID === id) {
                    console.log('Found matching ID:', id);
                    const laundaryAmt = b.LAUNDARY.AMT;
                    console.log('Room Amount:', laundaryAmt);
                    return laundaryAmt;
                }
            }
            console.log('No matching ID found');
            return 0;
        } else {
            console.log('finalBill is empty');
            return 0;
        }
    };

    // *** FUNCTIONS FOR EXTRA ***

    const handleExtraServiceTotalForExistData = () => {
        let filter_arr = finalBill.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let extra_split_total = filter_arr?.reduce((acc, obj) => { return acc + (obj.EXTRA.AMT ?? 0) }, 0)
            setExtraTotal(Number(data.ESTotalAmount - extra_split_total).toFixed(2))
        }
    }

    const handleExtraServiceTotal = arr => {
        let filter_arr = arr.filter(g => g.RoomNo === data.RoomNo)
        if (filter_arr.length > 0) {
            let extra_split_total = filter_arr?.reduce((acc, obj) => { return acc + (obj.EXTRA.AMT ?? 0) }, 0)
            setExtraTotal(Number(data.ESTotalAmount - extra_split_total).toFixed(2))
        }
    }

    const handleExtraServiceAmt = (e, id) => {
        if (e.target.value >= 0) {
            let amt_exist = finalBill.filter(g => g.CheckInGuestID === id)
            if (amt_exist.length > 0) {
                let clone = structuredClone(amt_exist[0])
                clone.EXTRA.AMT = Number(e.target.value)
                clone.EXTRA.NAME = data.ESServiceName
                clone.EXTRA.DISCOUNT = data.ESDiscount ?? 0
                clone.EXTRA.TAX = data.ESTaxAmount ?? 0
                let filteredArr = finalBill.filter(g => g.CheckInGuestID !== id)
                let finalArr = [...filteredArr, clone]
                store.dispatch(setSplit(finalArr))
                handleExtraServiceTotal(finalArr)
            } else {
                let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)
                let obj = {
                    ...GUEST[0],
                    ROOM: {},
                    POS: {},
                    LAUNDARY: {},
                    EXTRA: {
                        NAME: data.ESServiceName,
                        DISCOUNT: data.ESDiscount ?? 0,
                        TAX: data.ESTaxAmount ?? 0,
                        AMT: Number(e.target.value)
                    }
                }
                let finalArr = [...finalBill, obj]
                store.dispatch(setSplit(finalArr))
                handleExtraServiceTotal(finalArr)
            }
        } else {
            toast.error('Enter correct amount!')
        }
    }




    const handleExtraServiceAmountEqually = (e) => {
        console.log('data', data.GUEST);
        if (e.target.name === 'extraservice') {
            let arr = []
            let guestId = []
            data.GUEST.map(g => {
                // setChecklist(...checkList, g.CheckInGuestID)
                let obj = {
                    ...g,
                    ROOM: {},
                    POS: {
                    },
                    LAUNDARY: {
                    },
                    EXTRA: {
                        NAME: g.ESServiceName,
                        DISCOUNT: g.ESDiscount ?? 0,
                        TAX: g.ESTaxAmount ?? 0,
                        AMT: Number(equalAmountService)
                    }
                }
                arr.push(obj)
                guestId.push(g.CheckInGuestID)
            })
            // arr.map(i => setChecklist(...checkList, i.CheckInGuestID))
            console.log(arr);
            let finalArr = [...finalBill, ...arr]
            console.log('finalArr', finalArr, checkList);
            store.dispatch(setSplit(finalArr))
            setChecklist(...checkList, guestId)
            handleRefresh()
            handleExtraServiceTotal(finalArr)
        }
        // let GUEST = data.GUEST.filter(g => g.CheckInGuestID === id)


    }

    // const getExtraServiceValue = id => {
    //     if (finalBill.length > 0) {
    //         finalBill.map(b => {
    //             if (b.CheckInGuestID === id) {
    //                 return b.EXTRA.AMT
    //             } else {
    //                 return 0
    //             }
    //         })
    //     } else {
    //         return 0
    //     }
    // }

    const getExtraServiceValue = id => {
        console.log('ID:', id); // Check if 'id' is being received correctly
        if (finalBill.length > 0) {
            for (const b of finalBill) {
                if (b.CheckInGuestID === id) {
                    console.log('Found matching ID:', id);
                    const extraAmt = b.EXTRA.AMT;
                    console.log('Room Amount:', extraAmt);
                    return extraAmt;
                }
            }
            console.log('No matching ID found');
            return 0;
        } else {
            console.log('finalBill is empty');
            return 0;
        }
    };


    // *** FUNCTION FOR WHEN GUEST IS UNCHECKED ***
    const handleFinalBillFilter = (id) => {
        let filtered_arr = finalBill.filter(i => i.CheckInGuestID !== id)
        store.dispatch(setSplit(filtered_arr))
        handleFlag()
    }

    useEffect(() => {
        handleSinglGuest()
        handleRoomTotalForExistData()
        handlePosTotalForExistData()
        handleLaundaryTotalForExistData()
        handleExtraServiceTotalForExistData()
    }, [flag])

    // let equalAmount = roomTotal / data.GUEST.length
    // { console.log('equalAmount', data.GUEST.length, roomTotal, equalAmount) }


    // console.log();
    return (
        <>
            {console.log('checkList', checkList)}
            {console.log('includes', checkList.includes('CNGD20230926AA00324'))}
            {
                (data.Adult > 1 && data.GUEST.length > 0) && (data.Adult == data.GUEST?.length) ? (
                    <Table size='sm' bordered responsive>
                        <thead>
                            <tr className='text-center'>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Equal Distribution</th>
                                {
                                    data.GUEST.map(g => {
                                        return (
                                            <th key={g.CheckInGuestID} style={{ width: 'max-content' }}>
                                                <Col>
                                                    <Input
                                                        className='me-1'
                                                        type='checkbox'
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                setChecklist([...checkList, g.CheckInGuestID])

                                                            } else {
                                                                let newList = checkList.filter(c => c !== g.CheckInGuestID)
                                                                setChecklist(newList)
                                                                handleFinalBillFilter(g.CheckInGuestID)
                                                            }
                                                        }}
                                                    />{g.Name}
                                                </Col>
                                            </th>

                                        )
                                    })
                                }
                                {console.log('checkList', checkList)}
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Room</td>
                                <td>{data.NetAmount}</td>
                                <td><Input
                                    className='me-1'
                                    type='checkbox'
                                    name='Room'
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setEqualDistribution('checked')
                                            handleRoomAmountEqually(e)
                                        } else {
                                            setEqualDistribution('')
                                        }
                                    }}
                                /></td>



                                {
                                    data.GUEST.map(g => {
                                        { console.log(checkList.includes(g.CheckInGuestID) ? getRoomValue(g.CheckInGuestID) : 1, checkList) }
                                        return (
                                            <td key={g.CheckInGuestID}>

                                                <Input
                                                    size='sm'
                                                    type='number'
                                                    // value={checkList.includes(g.CheckInGuestID) ? getRoomValue(g.CheckInGuestID) : equalDistribution === 'checked' ? equalAmount : 0}
                                                    value={checkList.includes(g.CheckInGuestID) ? getRoomValue(g.CheckInGuestID) : 0}
                                                    disabled={!checkList.includes(g.CheckInGuestID)}
                                                    onChange={e => handleRoomAmt(e, g.CheckInGuestID)}
                                                />
                                                {/* {console.log('gg', getRoomValue(g.CheckInGuestID))} */}
                                            </td>
                                        )
                                    })
                                }
                                <td><span className={roomTotal == 0 ? 'text-success' : 'text-danger'}>{roomTotal}</span></td>
                            </tr>
                            {
                                data.PSTotalAmount && data.PSTotalAmount > 0 ? (
                                    <tr>
                                        <td>POS</td>
                                        <td>{data.PSTotalAmount}</td>
                                        <td><Input
                                            className='me-1'
                                            type='checkbox'
                                            name='pos'
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setEqualDistributionPos('checked')
                                                    handlePosAmountEqually(e)
                                                } else {
                                                    setEqualDistributionPos('')
                                                }
                                            }}
                                        /></td>
                                        {
                                            data.GUEST.map(g => {
                                                return (
                                                    <td key={g.CheckInGuestID}>
                                                        <Input
                                                            size='sm'
                                                            type='number'
                                                            // value={checkList.includes(g.CheckInGuestID) ? getPosValue(g.CheckInGuestID) : 0}
                                                            value={checkList.includes(g.CheckInGuestID) ? getPosValue(g.CheckInGuestID) : 0}
                                                            disabled={!checkList.includes(g.CheckInGuestID)}
                                                            onChange={e => handlePosAmt(e, g.CheckInGuestID)}
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                        <td><span className={posTotal == 0 ? 'text-success' : 'text-danger'}>{posTotal}</span></td>
                                    </tr>
                                ) : null
                            }
                            {
                                data.LSTotalAmount && data.LSTotalAmount > 0 ? (
                                    <tr>
                                        <td>LAUNDARY</td>
                                        <td>{data.LSTotalAmount}</td>
                                        <td><Input
                                            className='me-1'
                                            type='checkbox'
                                            name='laundary'
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setEqualDistributionLaundary('checked')
                                                    handleLaundaryAmountEqually(e)
                                                } else {
                                                    setEqualDistributionLaundary('')
                                                }
                                            }}
                                        /></td>
                                        {
                                            data.GUEST.map(g => {
                                                return (
                                                    <td key={g.CheckInGuestID}>
                                                        <Input
                                                            size='sm'
                                                            type='number'
                                                            // value={checkList.includes(g.CheckInGuestID) ? getLaundaryValue(g.CheckInGuestID) : 0}
                                                            value={checkList.includes(g.CheckInGuestID) ? getLaundaryValue(g.CheckInGuestID) : 0}
                                                            disabled={!checkList.includes(g.CheckInGuestID)}
                                                            onChange={e => handleLaundaryAmt(e, g.CheckInGuestID)}
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                        <td><span className={laundaryTotal == 0 ? 'text-success' : 'text-danger'}>{laundaryTotal}</span></td>
                                    </tr>
                                ) : null
                            }
                            {
                                data.ESTotalAmount && data.ESTotalAmount > 0 ? (
                                    <tr>
                                        <td>EXTRA SERVICE</td>
                                        <td>{data.ESTotalAmount}</td>
                                        <td><Input
                                            className='me-1'
                                            type='checkbox'
                                            name='extraservice'
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setEqualDistributionExtra('checked')
                                                    handleExtraServiceAmountEqually(e)
                                                } else {
                                                    setEqualDistributionExtra('')
                                                }
                                            }}
                                        /></td>
                                        {
                                            data.GUEST.map(g => {
                                                return (
                                                    <td key={g.CheckInGuestID}>
                                                        <Input
                                                            size='sm'
                                                            type='number'
                                                            // value={checkList.includes(g.CheckInGuestID) ? getExtraServiceValue(g.CheckInGuestID) : 0}
                                                            value={checkList.includes(g.CheckInGuestID) ? getExtraServiceValue(g.CheckInGuestID) : 0}
                                                            disabled={!checkList.includes(g.CheckInGuestID)}
                                                            onChange={e => handleExtraServiceAmt(e, g.CheckInGuestID)}
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                        <td><span className={extraTotal == 0 ? 'text-success' : 'text-danger'}>{extraTotal}</span></td>
                                    </tr>
                                ) : null
                            }
                        </tbody>
                    </Table>
                ) : data.Adult == 1 && (data.Adult == data.GUEST?.length) ? (
                    <h3 className='fw-light fs-4 text-center'>Bill cannot be Split in room with Single guest.</h3>
                ) : data.GUEST?.length == 0 || data.Adult !== data.GUEST?.length ? (
                    <h3 className='fw-light fs-4 text-center'>Fill all guest details for the room</h3>
                ) : null
            }
        </>
    )
}

export default NewBillSplitForm