import React, { useState, useEffect } from 'react'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import Timeline from '@components/timeline'

const TransferHistoryModal = ({ open, handleOpenTransferModal, bookingID }) => {

    console.log('bookingID', bookingID)

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData

    const [historyData, setHistoryData] = useState([])

    const getRoomHistory = async () => {
        try {
            let res = await axios.get('/roomtransfer/booking', {
                params: {
                    LoginID,
                    Token,
                    BookingId: bookingID
                }
            })
            console.log('res--history', res)
            if (res?.data[0].length > 0) {
                let result = res?.data[0]
                setHistoryData(result.map(r => {
                    return {
                        title: r.roomTypeDesc,
                        content: `${r.roomDisplayName}, Floor No. - ${r.floorNo}, Room No. - ${r.roomNo}`,
                        meta: r.status, color: r.status === "Active" ? 'success' : 'primary'
                    }
                }))
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    useEffect(
        () => {
            getRoomHistory()
        }, [open, bookingID]
    )

    const historyColumns = [
        {
            name: 'Sr. No',
            width: '150px',
            selector: (row, index) => index + 1
        },
        {
            name: 'FROM',
            width: '300px',
            selector: row => {
                return (
                    <>
                        <Row>
                            <h5 className='text-danger'>Room Category - {row.fromRoomTypeDesc}</h5>
                            <h5 className='text-danger'>Room Name -{row.fromRoomDisplayName}</h5>
                            <h5 className='text-danger'>Floor No. -{row.fromFloorNo}</h5>
                            <h5 className='text-danger'>Room No. -{row.fromRoomNo}</h5>
                        </Row>
                    </>
                )
            }
        },
        {
            name: 'TO',
            width: 'min-content',
            selector: row => {
                return (
                    <>
                        <Row>
                            <h5 className='text-success'>Room Category - {row.toRoomTypeDesc}</h5>
                            <h5 className='text-success'>Room Name -{row.toRoomDisplayName}</h5>
                            <h5 className='text-success'>Floor No. -{row.toFloorNo}</h5>
                            <h5 className='text-success'>Room No. -{row.toRoomNo}</h5>
                        </Row>
                    </>
                )
            }
        },
    ]

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpenTransferModal}
                className='modal-md'
                backdrop
            >
                <ModalHeader toggle={handleOpenTransferModal}>Room Transfer History</ModalHeader>
                <ModalBody>
                    <Col>
                        <Timeline data={historyData} />
                    </Col>
                </ModalBody>
            </Modal>
        </>
    )
}

export default TransferHistoryModal