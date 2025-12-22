import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Button, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'

const NewRoomTransferDetails = ({checkInDate,checkOutDate, setSelRoom, selRoomObj, handleRoomTransferFlag }) => {
    console.log('selRoomObj', selRoomObj);

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [transferFlag, setTransferFlag] = useState(false)

    const [roomTypeOptions, setRoomTypeOptions] = useState([])
    const [selRoomType, setSelRoomType] = useState('')
    const [selRoomTypeObj, setSelRoomTypeObj] = useState([])
    const [roomNoOptions, setRoomNoOptions] = useState([])
    const [selRoomNo, setSelRoomNo] = useState('')
    const [selRoomNoObj, setSelRoomNoObj] = useState([])
    const [newRate, setNewRate] = useState('')
    const [noOfGuest, setNoOfGuest] = useState(0)

    const [newAgreedRate, setNewAgreedRate] = useState(0)
    const [agreedRate, setAgreedRate] = useState(0)
    const [dateRate, setDateRate] = useState([])

    const [upgrade, setUpgrade] = useState('free')

    const [loader, setLoader] = useState(false)


    console.log('');

    const getNewRoomRate = async (roomid) => {
        // let newArr = arr.map(r => r.RoomID)
        // let unique = [...new Set(newArr)]
        // // console.log('arr', unique)
        try {
            let obj = {
                fromDate: moment(new Date(checkInDate)).format(),
                toDate: moment(checkOutDate).format(),
                roomID: roomid
            }
            // const res = await axios.post(`/booking/GetRoomRate`, obj, {
            const res = await axios.post(`/bookingv2/getroomrate`, obj, {
                headers: {
                    LoginID,
                    Token
                }
            })

            console.log("Type of daily:", typeof res?.data?.daily);
            // let rate = res?.data[0].filter(r => r.ratePlanID === selRoomObj.ratePlan && r.ROOMID === roomid)
            const dailyObj = res?.data?.daily;
            const dailyArr = Object.values(dailyObj || {});
           const rate = dailyArr.filter(r => r.ratePlanID == selRoomObj.ratePlan && r.roomID == roomid);
           console.log('rate', rate, rate[0]?.roomRate, selRoomObj.RatePlan, roomid);
            // setDateRate(res?.data[1])
            // setAgreedRate(rate[0]?.ROOMRATE)
            setAgreedRate(rate[0]?.roomRate)

        } catch (error) {
            console.log('new rate error', error)
        }


    }


    const getRoomTypeOptions = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                CheckInDate: moment(new Date()).format(),
                CheckOutDate: moment(checkOutDate).format()
            }
            const res = await axios.post(`/getdata/bookingdata/roomavailability`, obj)
            if (res.data[0].length > 0) {
                let rooms = res.data[0]
                console.log('roomavail', rooms)
                let options = rooms.map(r => { return { value: r.roomID, label: r.roomDisplayName, ...r } })
                setRoomTypeOptions(options)
            } else {
                setRoomTypeOptions([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getRoomTypeOptions()
        // getNewRoomRate()
    }, [])



    const getRoomNos = async () => {
        try {
            const res = await axios.get('/roomtransfer/roomnumber/GetByRoomType', {
                params: {
                    LoginID,
                    Token,
                    RoomID: selRoomTypeObj.roomID,
                    CheckInTime: moment(new Date()).format('YYYY-MM-DD'),
                    CheckOutTime: moment(checkOutDate).format('YYYY-MM-DD')
                }
            })
            console.log('getRoomNosres', res)
            res?.data[0].length ? (
                setRoomNoOptions(res?.data[0].map(r => {
                    // return { value: r.RoomNo, label: `Room No - ${r.RoomNo}, Floor No - ${r.FloorNo} (${r.Description})`, ...r }
                    let repair = r.repairRequired === 'Yes' ? 'Repair Required' : ''
                    return { value: r.roomNo, label: `Room No - ${r.roomNo}, Floor No - ${r.floorNo} - ${r.cleaningStatus} ${(repair)} `, ...r }
                }))
            ) : (
                setRoomNoOptions([{ value: 0, label: 'NO ROOMS AVAILABLE' }])
            )
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRoomNos()
    }, [selRoomType])

    useEffect(() => {
        if (upgrade === 'free') {
            setNewRate(selRoomObj.roomRate)
        } else {
            setNewRate(selRoomTypeObj.roomRate)
        }
    }, [upgrade, selRoomType])


    const handleRoomTransfer = async (e) => {
        e.preventDefault()
        console.log('hit');
        setLoader(true)
        setTransferFlag(true)
        if (upgrade === 'paid') {
            if (newAgreedRate === 0) {
                toast.error('Agreed Rate Could Not Be Zero')
                setLoader(false)
                return

            }
        }
        if (selRoomNo === '' && selRoomType === '') {
            toast.error('please enter required fields!')
        } else {
            try {
                const obj = {
                    LoginID,
                    Token,
                    Seckey: 'abc',
                    RoomAllocationID: selRoomObj.roomAllocationID,
                    OldSystemRate: upgrade === 'free' ? 0 : selRoomObj.roomRate,
                    OldAgreedRate: upgrade === 'free' ? 0 : selRoomObj.roomRate,
                    NewSystemRate: upgrade === 'free' ? 0 : agreedRate,
                    NewAgreedRate: upgrade === 'free' ? 0 : newAgreedRate,
                    Persons: noOfGuest,
                    Remark: "Transfer by API",
                    UpgradeType: upgrade,
                    RoomID: selRoomNoObj.roomID,
                    FloorID: selRoomNoObj.floorID
                }

                console.log('objjjjjj', obj)
                const res = await axios.post('/roomtransfer/insert', obj)
                console.log('roomTransfer->res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success('Room transferred successfully!')
                    handleRoomTransferFlag()
                    setSelRoomType('')
                    setSelRoomNo('')
                    setNewRate('')
                    setSelRoom('')
                }

            } catch (error) {
                console.log(error)
                toast.error('Something went wrong, Try again!')
            }
        }
    }

    const closeTransfer = () => {
        setSelRoomType('')
        setNewRate('')
        setSelRoom('')
        handleRoomTransferFlag()
    }

    return (
        <>
            {console.log('selRoomNoObj', selRoomNoObj)}
            {console.log('selRoomNoty', selRoomNoObj)}
            <Form onSubmit={e => handleRoomTransfer(e)}>
                <Row className='m-1'>
                    <Col sm='6' className='mb-1'>
                        <div className='form-check'>
                            <Input
                                type='radio'
                                id='ex1-active'
                                name='ex1'
                                value="paid"
                                checked={upgrade === 'paid'}
                                onChange={(e) => setUpgrade(e.target.value)}
                            />
                            <Label className='form-check-label' for='ex1-active'>
                                Paid Upgrade
                            </Label>
                        </div>
                    </Col>
                    <Col sm='6' className='mb-1'>
                        <div className='form-check'>
                            <Input
                                type='radio'
                                id='ex2-active'
                                name='ex2'
                                value="free"
                                checked={upgrade === 'free'}
                                onChange={(e) => setUpgrade(e.target.value)}
                            />
                            <Label className='form-check-label' for='ex2-active'>
                                Free Upgrade
                            </Label>
                        </div>
                    </Col>
                </Row>
                <CardTitle style={{ backgroundColor: '#c3bdbd', padding: '10px' }}>
                    Selected Room Information
                </CardTitle>
                <Row>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label'>
                            New Room Type <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            isDisabled={roomTypeOptions.length === 0}
                            placeholder='Select a Room Category'
                            menuPlacement='bottom'
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={roomTypeOptions}
                            value={roomTypeOptions.filter(c => c.value === selRoomType)}
                            onChange={c => {
                                console.log('dropdown', c)
                                getNewRoomRate(c.value)
                                setSelRoomType(c.value)
                                setSelRoomTypeObj(c)
                            }}
                        />
                        {loader && (selRoomType === '' || selRoomType === undefined) && <p className='text-danger'> New Room Type is required</p>}
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label'>
                            New Room Number <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            isDisabled={roomTypeOptions.length === 0}
                            placeholder='Select a Room Number'
                            menuPlacement='bottom'
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={roomNoOptions}
                            value={roomNoOptions.filter(c => c.value === selRoomNo)}
                            onChange={c => {
                                console.log('dropdown', c)
                                setSelRoomNo(c.value)
                                setSelRoomNoObj(c)
                            }}
                        />
                        {loader && (selRoomType === '' || selRoomType === undefined) && <p className='text-danger'>New Room Number is required</p>}
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label'>
                            Agreed Rate
                        </Label>
                        <Input
                            disabled={upgrade === 'free'}
                            type='number'
                            name='text'
                            placeholder='Agreed Rate'
                            value={upgrade === 'free' ? 0 : newAgreedRate}
                            onChange={e => setNewAgreedRate(e.target.value)}
                        />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label'>
                            System Rate
                        </Label>
                        <Input
                            disabled={upgrade !== ''}
                            type='text'
                            name='text'
                            placeholder='System Rate'
                            value={agreedRate}
                        />
                    </Col>
                    <Col sm='4' className='mb-1'>
                        <Label className='form-label'>
                            No. of Guest Transfered (Optional)
                        </Label>
                        <Input
                            type='number'
                            placeholder='Transfer Person'
                            value={noOfGuest}
                            // invalid={transferFlag && noOfGuest === ''}
                            onChange={e => setNoOfGuest(e.target.value)}
                        />
                        {/* {transferFlag && noOfGuest === '' && <FormFeedback>No. of Guest is required!</FormFeedback>} */}
                    </Col>
                </Row>
                <Button
                    className='me-2'
                    color='primary'
                    style={{ marginTop: '24px' }}
                    disabled={upgrade === ''}
                    type='submit'
                >
                    Transfer Room 
                </Button>
                <Button
                    className='me-2'
                    color='warning'
                    style={{ marginTop: '24px' }}
                    onClick={() => {
                        setTransferFlag(false)
                        closeTransfer()
                    }}>
                    Close
                </Button>
            </Form>
        </>
    )
}

export default NewRoomTransferDetails