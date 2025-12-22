import React, { useState, useEffect, useRef } from 'react'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import DataTable from 'react-data-table-component'
import { CheckSquare, ChevronDown } from 'react-feather'
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap'
import AddRoomGuestDetailsModal from './AddRoomGuestDetailsModal'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import TransferHistoryModal from './TransferHistoryModal'

const RoomAssignGuestDetails = ({ roomList, bookerDetailsAvail, LoginID, Token, handleRoomAssigned }) => {
    console.log('roomList11', roomList)


    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(!openModal)

    const [data, setData] = useState()

    const [openTransferModal, setOpenTransferModal] = useState(false)
    const handleOpenTransferModal = () => setOpenTransferModal(!openTransferModal)

    const [selBookingID, setSelBookingID] = useState('')

    const optionsCache = useRef({})
    
    const AssignRoomNo = ({ row }) => {
        const [assigned, setAssigned] = useState(false)
        const [opt, setOpt] = useState([])
        const [selFloorId, setSelFloorId] = useState('')
        const [selRoomId, setSelRoomId] = useState('')
        const [selFloorNo, setSelFloorNo] = useState('')
        const [assignedRoomNo, setAssignedRoomNo] = useState('')

        useEffect(() => {
            if (row.floorID && row.roomNo !== ("" || null)) {
                setSelFloorId(row.floorID)
                setSelRoomId(row.roomID)
                setSelFloorNo(row.floorNo)
                setAssignedRoomNo(row.roomNo)
                setAssigned(true)
            }
        }, [handleRoomAssigned])

        const getOptions = async () => {
            try {
                const cacheKey = row.roomAllocationID
                // return cached mapped options (value/label) if available
                if (cacheKey && optionsCache.current[cacheKey]) {
                    setOpt(optionsCache.current[cacheKey])
                    return
                }
                const res = await axios.get('ddlv2/booking/roomassigndropdown', {
                    params: {
                        LoginID,
                        Token,
                        RoomAllocationID: row.roomAllocationID
                    }
                })
                const respArr = res?.data?.responseData || []
                const mapped = respArr.map(r => {
                    const repair = r.repairRequired === 'Yes' ? 'Repair Required' : ''
                    return {
                        value: r.roomID ?? r.roomNo,
                        label: `Room No - ${r.roomNo}, Floor No - ${r.floorNo} - ${r.cleaningStatus} ${repair} ${r.roomStatus}`,
                        roomID: r.roomID,
                        roomNo: r.roomNo,
                        floorID: r.floorID,
                        floorNo: r.floorNo,
                        cleaningStatus: r.cleaningStatus,
                        roomStatus: r.roomStatus,
                        ...r
                    }
                })

                // cache mapped options so future reads work for Select
                if (cacheKey) optionsCache.current[cacheKey] = mapped
                setOpt(mapped)
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong, Try again!')
            }
        }

        // fetch when the select menu opens (lazy load) or when external refresh fires
        const handleMenuOpen = () => {
            if (!opt || opt.length === 0) getOptions()
        }

        useEffect(() => {
            const onRefresh = e => {
                try {
                    const targetId = e?.detail?.roomAllocationID
                    if (targetId && targetId === row.roomAllocationID) {
                        // invalidate cache for this row and re-fetch once
                        if (optionsCache.current[row.roomAllocationID]) delete optionsCache.current[row.roomAllocationID]
                        getOptions()
                    }
                } catch (err) {
                    console.warn('refresh event handler', err)
                }
            }
            window.addEventListener('roomAssignDropdownRefresh', onRefresh)
            return () => window.removeEventListener('roomAssignDropdownRefresh', onRefresh)
        }, [row.roomAllocationID, opt])

        
        const isThisRoomCheckedOut = row.allocationType === "CheckedOut";

        return (
            <>
                {
                    assigned ? (
                        <>
                            <Col>
                                <h5 className='mb-0'>Assigned Room:</h5>
                                <p className='mb-0'>{row.roomType},</p>
                                <p className='mb-0'>Floor No - {selFloorNo},</p>
                                <p className='mb-0'>Room No - {assignedRoomNo}.</p>
                            </Col>
                        </>
                    ) : (
                        <Select
                            isDisabled={assigned && bookerDetailsAvail}
                            placeholder='Select a Room'
                            menuPlacement='bottom'
                            theme={selectThemeColors}
                            className='react-select w-100'
                            classNamePrefix='select'
                            options={opt}
                            value={opt.filter(c => c.floorID === selFloorId)}
                            onChange={c => {
                                setSelFloorId(c.floorID)
                                setSelRoomId(c.roomID)
                            }}
                            onMenuOpen={handleMenuOpen}
                        />
                    )
                }

                {
                    assigned === false && (
                        <>

                            <CheckSquare
                                //style={{ cursor: 'pointer' }}
                                style={{ cursor: isThisRoomCheckedOut  ? 'not-allowed' : 'pointer' }}
                                color='green'
                                className='mx-1'
                                disabled={isThisRoomCheckedOut}
                                id='assign'
                                onClick={async () => {
                                    if (isThisRoomCheckedOut) return;
                                    if (selFloorId && selRoomId !== '') {
                                        let obj = {
                                            LoginID,
                                            Token,
                                            BookingID: row.bookingID,
                                            RoomAllocationID: row.roomAllocationID,
                                            FloorID: selFloorId,
                                            RoomID: selRoomId,
                                            Seckey: "abc"
                                        }
                                        try {
                                            const res = await axios.post('/booking/RoomAssign', obj)
                                            console.log('assign_res', res)
                                            if (res.data[0][0].status === "Success") {
                                                setAssigned(true)
                                                handleRoomAssigned()
                                                toast.success('Room Assigned!')
                                            } else {
                                                toast.error('Something went wrong, Try again!')
                                            }
                                        } catch (err) {
                                            console.log(err)
                                        }
                                    } else {
                                        toast.error("Select a Room from the dropdown first!")
                                    }
                                }}
                            />
                            <UncontrolledTooltip placement='top' target={'assign'} className="bg-success">
                            {isThisRoomCheckedOut  ? "Cannot assign: Room Checked Out" : "Assign Room"}
                                {/* Assign Room */}
                            </UncontrolledTooltip>
                        </>
                    )
                }
            </>
        )
    }

    const checkinColumns = [
        {
            name: 'Room No',
            minWidth: '20rem',
            cell: row => <AssignRoomNo row={row} />
        },
        {
            name: 'Room Type',
            selector: row => row.roomType
            // selector: row => row.RoomDisplayName
        },
        {
            name: 'Allocation Type',
            minWidth: 'fit-content',
            selector: row => {
                console.log('row', row)
                return (
                    <>
                        <Col className='d-flex flex-row flex-wrap align-items-center'>
                            <h5 className='mb-0 mx-1'>{row.roomNo ? row.allocationType : "Empty"}</h5>
                            <div>
                                {
                                    row.allocationType === "Transferred" ? (
                                        <Button
                                            size='sm'
                                            color='secondary'
                                            onClick={() => (setSelBookingID(row.bookingID), handleOpenTransferModal())}
                                        >
                                            View History
                                        </Button>
                                    ) : <></>
                                }
                            </div>
                        </Col>
                    </>
                )
            }
        },
        {
            name: 'Status',
            selector: row => row.status
            // selector: row => row.RoomDisplayName
        },
        {
            name: 'Action',
            width: 'fit-content',
            selector: row => {
                return (
                    <>
                        <Button
                            color='primary'
                            disabled={row.roomNo === '' || row.roomNo === null}
                            onClick={() => (handleOpenModal(), setData(row))}
                        >
                            Upload/View Guest Info
                        </Button>
                    </>
                )
            }
        }
    ]

    return (
        <>
            <Row>
                <Col className='react-dataTable'>
                    <DataTable
                        noHeader
                        pagination
                        data={roomList}
                        columns={checkinColumns}
                        disabled={bookerDetailsAvail === false}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Col>
            </Row>
            {openModal && <AddRoomGuestDetailsModal openModal={openModal} handleOpenModal={handleOpenModal} data={data} LoginID={LoginID} Token={Token} />}
            {openTransferModal && <TransferHistoryModal open={openTransferModal} handleOpenTransferModal={handleOpenTransferModal} bookingID={selBookingID} />}
        </>
    )
}

export default RoomAssignGuestDetails