import React, { useState } from 'react'
import moment from 'moment'
import { FaArrowLeft, FaUserTie } from 'react-icons/fa'
import { Alert, Badge, Card, UncontrolledTooltip } from 'reactstrap'
import { ArrowLeft, ChevronLeft, ChevronRight, PlusCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { store } from '@store/store'
import QuickBookingModal from './QuickBookingModal'
import { setCheckInDate, setCheckOutDate, setRoomData } from "../../redux/quickBookingSlice"



const RoomData = (props) => {
    const navigate = useNavigate()
    const [quickModalOpen, setQuickModalOpen] = useState(false)
    // const roomId = props.roomId
    // console.log('roomId', roomId)
    // console.log('The Data> ', props.data)

    const roomData = props.data;
    // console.log('roomData', roomData)
    const sortedRoom = roomData?.sort((a, b) => b.FloorNo - a.FloorNo)
    // const MakeMyBooking = (checkinDate, room) => {
    //     store.dispatch(setCheckInDate(checkinDate))
    //     navigate(`/reservation`) // TODO - need to preset the checkin date and highlight the room type 
    //     log(room, checkinDate)
    // }
    const handleModalOpen = () => {
        setQuickModalOpen(!quickModalOpen)
    }
    const openQuickBookModal = (date, roomItem) => {
        let selectedDate = new Date(date)
        store.dispatch(setCheckInDate(selectedDate))
        console.log("selectedDate: ", new Date(selectedDate).fp_incr(1))
        console.warn("roomItem", roomItem)
        store.dispatch(setRoomData(roomItem))
        if (roomItem) {
            handleModalOpen()
        }
    }

    return (
        <>
            <tr key={`roomitem_row_${props.roomId}`} className="bg-light-primary">
                <th className='bg-primary text-light'>{props.roomName}</th>
                {
                    props.datesArr?.map((dte) => {
                        const thisdate = moment(dte).format('l')
                        const count = roomData.filter(rmItem => (rmItem.CheckInDate && moment(rmItem.CheckInDate).format('l') === thisdate)
                            || (rmItem.CheckInDate && rmItem.CheckOutDate && moment(dte).isBetween(moment(rmItem.CheckInDate), moment(rmItem.CheckOutDate)))
                            || (rmItem.CheckOutDate && moment(rmItem.CheckOutDate).format('l') === thisdate)).length
                        return (
                            <td>{count}</td>
                        )
                    })
                }
            </tr>
            {
                sortedRoom?.map((roomItem, index) => {
                    let totalcolspan = 0
                    let colsprint = props.datesArr?.length
                    const colLength = props.datesArr?.length
                    //let columns = props.datesArr?.length
                    return (
                        <>

                            <tr key={`roomitemrow_${index}`} >
                                <th><FaUserTie /> × {` ${roomItem.FloorNo ? "Fl " + roomItem.FloorNo + "-" : ''}  ${roomItem.RoomNo && roomItem.FloorNo ? "#" + roomItem.RoomNo : ''}`}</th>
                                {

                                    props.datesArr?.map((dte, indx) => {
                                        //const showData = roomData.filter(elem => moment(moment(date).format('l')).isBetween(moment(moment(elem.CheckInDate).format('l')), moment(moment(elem.CheckOutDate).format('l'))) || moment(date).format('l') === moment(elem.CheckInDate).format('l') || moment(date).format('l') === moment(elem.CheckOutDate).format('l')) 
                                        //console.log('in format == ', roomItem.CheckInDate)-
                                        let dispStartDate = roomItem.CheckInDate
                                        const dispEndDate = roomItem.CheckOutDate
                                        const doDate = moment(dte).format('l')
                                        let left = false
                                        let more = false
                                        let days = false
                                        if (indx === 0 && dispStartDate && dispEndDate && moment(dte).isAfter(moment(dispStartDate)) && moment(dte).isBefore(moment(dispEndDate))) {
                                            left = true
                                            days = moment(dte).diff(moment(roomItem.CheckInDate), 'days') + 1
                                            dispStartDate = doDate
                                        }

                                        if (dispStartDate && doDate === moment(dispStartDate).format('l')) {

                                            // console.log('rm - - ', roomItem)
                                            const colspan = moment(roomItem?.CheckOutDate).diff(dispStartDate, 'day') + 1
                                            totalcolspan = totalcolspan + colspan
                                            colsprint = colsprint - colspan

                                            if ((indx + colspan) > colLength) {
                                                more = true
                                                days = indx + colspan - colLength
                                            }
                                            const posid = roomItem.RoomAllocationID
                                            return (
                                                <td key={`roomitemtd_${index}_${indx}`} colSpan={colspan}>

                                                    <Alert className='my-50' id={posid} style={{ cursor: 'pointer' }} color='success' onClick={() => (props.setOpenRoomAllocationID(roomItem.RoomAllocationID), props.handleOpen())}>
                                                        {
                                                            left ? <span className='position-absolute start-0' >{days}<ChevronLeft style={{ scale: '0.75' }} /></span> : null
                                                        }
                                                        <h6 className='text-success m-0 fw-bolder p-25' title={`${roomItem.GuestName} (${roomItem.GuestMobileNumber})`} >{roomItem.GuestName}</h6>
                                                        <sup>{roomItem.GuestMobileNumber}</sup>
                                                        {/* <sup>{roomItem.RoomID}</sup> */}
                                                        {
                                                            more ? <span className='position-absolute end-0 top-0' ><ChevronRight style={{ scale: '0.75' }} />{days}</span> : null
                                                        }
                                                    </Alert>
                                                    <UncontrolledTooltip placement='top' target={posid} className="bg-success">
                                                        <div>{roomItem.GuestName} </div>
                                                        <div>({roomItem.GuestMobileNumber})</div>
                                                    </UncontrolledTooltip>
                                                </td>
                                            )

                                        } else {
                                            if (colsprint < indx) {

                                            } else {
                                                return (
                                                    <td key={`roomitemtd_${index}_${indx}`} className='empty-booking'>
                                                        <Badge id={`roomitemtd_${index}_${indx}`} onClick={() => openQuickBookModal(dte, roomItem)} className={`px-75 me-25 mb-25 cursor-pointer booking-btn badge-glow d-none transparent`} color={'light-primary'} pill><PlusCircle /> Book</Badge>
                                                        <UncontrolledTooltip placement='top' target={`roomitemtd_${index}_${indx}`} className="bg-success">
                                                            <div>Checkin date: {moment(dte).format('DD-MM-YYYY')} </div>
                                                            <div>Room No: {roomItem.RoomNo}</div>
                                                        </UncontrolledTooltip>
                                                        {/*totalcolspan*/}
                                                    </td>
                                                )
                                            }

                                        }

                                    })
                                }
                            </tr>

                        </>
                    )
                })

            }

            <QuickBookingModal open={quickModalOpen} handleOpen={handleModalOpen} handleRefresh={props.handleRefresh} />

        </>
    )
}

export default RoomData