import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Row, Col, Label, Input, Form } from 'reactstrap'
import axios from '../../../API/axios'
import NewRoomTransferDetails from './NewRoomTransferDetails'

const RoomTransfer = ({ roomList, checkOutDate, handleRoomTransfer,checkInDate }) => {
    console.log('roomList', roomList);
    const getUserData = () => useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData()

    const assignedRoomOptions = roomList.length > 0 && roomList[0].roomNo !== (null || '' || undefined) ? roomList.map(r => {
        return { value: r.roomAllocationID, label: `${r.roomNo} - ${r.roomType}`, ...r }
    }) : [{ value: 0, label: 'No rooms checked In' }]

    const [selRoom, setSelRoom] = useState('')
    const [selRoomObj, setSelRoomObj] = useState('')
    const [gDetails, setGDetails] = useState('')

    const getGuestDetails = async () => {
        try {
            const res = await axios.get('/booking/CheckInGuest/GetByID', {
                params: {
                    LoginID,
                    Token,
                    RoomAllocationID: selRoom !== '' ? selRoom : 0
                }
            })
            { console.log("bookingggg", res) }
            if (res.data[0].length > 0) {
                console.log('roomtransfer', res.data[0][0]);
                setGDetails(res.data[0][0])
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGuestDetails()
    }, [selRoom])


    return (
        <>
            {console.log('roomobj', selRoomObj)}
            {
                selRoom === '' ? (
                    <>
                        <Row>
                            <Col>
                                <Select
                                    isDisabled={assignedRoomOptions.length === 0}
                                    placeholder='Select a Room'
                                    menuPlacement='bottom'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={assignedRoomOptions}
                                    value={assignedRoomOptions.filter(c => c.roomAllocationID === selRoom)}
                                    onChange={c => {
                                        setSelRoom(c.value)
                                        setSelRoomObj(c)
                                    }}
                                />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <Col>
                            <Select
                                isDisabled={assignedRoomOptions.length === 0}
                                placeholder='Select a Room'
                                menuPlacement='bottom'
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                options={assignedRoomOptions}
                                value={assignedRoomOptions.filter(c => c.roomAllocationID === selRoom)}
                                onChange={c => {
                                    console.log('select', c)
                                    setSelRoom(c.value)
                                    setSelRoomObj(c)
                                }}
                            />
                        </Col>
                        <Form className='border-bottom'>
                            <Row>
                                <Col sm='4' className='mb-1'>
                                    <Label className='form-label'>
                                        Guest Name
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='name'
                                        placeholder='Guest Name'
                                        value={gDetails.nameAsPerIDProof}
                                    />
                                </Col>
                                <Col sm='4' className='mb-1'>
                                    <Label className='form-label'>
                                        Old Room Category
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='text'

                                        placeholder='Old Room Catogory'
                                        value={selRoomObj.roomDisplayName}
                                    />
                                </Col>
                                <Col sm='4' className='mb-1'>
                                    <Label className='form-label'>
                                        Room Number
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='text'
                                        placeholder='Room Number'
                                        value={selRoomObj.roomNo}
                                    />
                                </Col>
                                <Col sm='4' className='mb-1'>
                                    <Label className='form-label'>
                                        Rate
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='text'
                                        placeholder='Rate'
                                        value={selRoomObj.roomRate}
                                    />
                                </Col>
                                <Col sm='4' className='mb-1'>
                                    <Label className='form-label'>
                                        Rate Plan
                                    </Label>
                                    <Input
                                        disabled
                                        type='text'
                                        name='text'
                                        placeholder='Rate'
                                        value={selRoomObj.ratePlan}
                                    />
                                </Col>
                            </Row>
                        </Form>
                        <NewRoomTransferDetails
                            checkOutDate={checkOutDate}
                            checkInDate={checkInDate}
                            setSelRoom={setSelRoom}
                            selRoomObj={selRoomObj}
                            handleRoomTransferFlag={handleRoomTransfer}
                        />
                    </>
                )
            }
        </>
    )
}

export default RoomTransfer