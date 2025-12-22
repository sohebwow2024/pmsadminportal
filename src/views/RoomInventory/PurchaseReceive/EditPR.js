import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Row, Label } from 'reactstrap'
import axios from '../../../API/axios'
import Flatpickr from 'react-flatpickr'
import EditItemDisplay from './EditItemDisplay'
import moment from 'moment'
import { CheckSquare, Edit3, X } from 'react-feather'
import toast from 'react-hot-toast'
import { openLinkInNewTab } from '../../../common/commonMethods'
import { AiFillPrinter } from 'react-icons/ai'

const EditPR = ({ selPr, showEdit, handleShowEdit }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [flag, setFlag] = useState(false)
    const handleFlag = () => setFlag(!flag)

    const [edit, setEdit] = useState(false)
    const handleEdit = () => setEdit(!edit)

    const [prInfo, setPrInfo] = useState([])
    const [prItems, setPrItems] = useState([])
    const [save, setSave] = useState(false)
    const [poid, setPoid] = useState('')
    const [poNo, setPoNo] = useState('')
    const [receivedBy, setReceivedBy] = useState('')
    const [rDate, setRDate] = useState('')
    const [remark, setRemark] = useState('')

    const getPRInfo = async () => {
        try {
            const res = await axios.get(`/inventory/purchase_receive/${selPr}?LoginID=${LoginID}&Token=${Token}`)
            console.log('respurchase_receive', res)
            setPrInfo(res?.data[0])
            setPoid(res?.data[0][0].poid)
            setReceivedBy(res?.data[0][0].receivedBy)
            setRDate(res?.data[0][0].receivedDate)
            setRemark(res?.data[0][0].remarks)
            setPrItems(res?.data[1])
        } catch (error) {
            console.log('prInfoError', error)
        }
    }

    const getPoNumber = async () => {
        try {
            // const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${poid}`)
            const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${poid}&PropertyID=${PropertyID}`)
            console.log('res', res)
            setPoNo(res?.data[0][0]?.poNumber)
        } catch (error) {
            console.log('ponoError', error)
        }
    }

    useEffect(() => {
        getPRInfo()
    }, [flag])

    useEffect(() => {
        getPoNumber()
    }, [poid])

    const handleRemarkUpdate = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                POID: poid,
                ReceivedDate: rDate,
                ReceivedBy: receivedBy,
                Remarks: remark,
                // ReceivedItems: ""
            }
            const res = await axios.post(`/inventory/update_purchase_receive?id=${selPr}`, obj)
            console.log('infoUpdateres', res)
            if (res?.data[0][0]?.status === "Success") {
                toast.success(res?.data[0][0]?.message)
                handleEdit()
                handleFlag()
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Something went wrong, Try again!")
        }
    }

    return (
        <Modal
            isOpen={showEdit}
            toggle={handleShowEdit}
            className='modal-dialog-centered modal-xl'
            backdrop={false}
        >
            <ModalHeader className='bg-transparent' toggle={handleShowEdit}>
                Edit Purchase Receive
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col className='mb-1'>
                        <Label className='form-label'>PO ID</Label>
                        <Input
                            type='text'
                            value={poid}
                            disabled
                        />
                    </Col>
                    <Col className='mb-1'>
                        <Label className='form-label'>PO Number</Label>
                        <Input
                            type='text'
                            value={poNo}
                            disabled
                        />
                    </Col>
                    <Col className='mb-1'>
                        <Label className='form-label'>Received By<span className='text-danger'>*</span></Label>
                        <Input
                            type='text'
                            placeholder='Receiver name'
                            value={receivedBy}
                            onChange={e => setReceivedBy(e.target.value)}
                            invalid={save && receivedBy === ''}
                            disabled
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md='3' className='mb-1'>
                        <Label className='form-label'>Date</Label>
                        <Flatpickr
                            id='startDate'
                            className='form-control'
                            options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                // minDate: moment(new Date()).subtract(1, 'days')
                            }}
                            value={moment(rDate).toISOString()}
                            onChange={date => setRDate(date[0])}
                        />
                    </Col>
                    <Col className='mb-1'>
                        <div>
                            <Label className='form-label'>Remark</Label>
                            {
                                edit ? (
                                    <span>
                                        <CheckSquare className='cursor-pointer ms-1' color='green' size={15} onClick={() => handleRemarkUpdate()} />
                                        <X className='cursor-pointer ms-1' color='grey' size={15} onClick={() => (handleEdit(), setRemark(prInfo[0].Remarks))} />
                                    </span>
                                ) : (
                                    <span className='cursor-pointer form-label text-primary' onClick={() => handleEdit()}>
                                        (<Edit3 color='blue' size={15} /> Edit)
                                    </span>
                                )
                            }
                        </div>
                        <Input
                            type='text'
                            placeholder='Remark goes here...'
                            value={remark}
                            disabled={edit === false}
                            onChange={e => setRemark(e.target.value)}
                        />
                    </Col>
                    <Col sm='2' className='d-flex justify-content-center align-items-center'>
                        <Button size='sm' color='primary' className='me-1' disabled={prItems.length === 0}
                            onClick={() => openLinkInNewTab(`/purchaseReceiveInvoice/${selPr}`)}
                        >
                            <AiFillPrinter size={17} /> Print Bill
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            prItems.length > 0 && (
                                prItems.map((i, index) => {
                                    return (
                                        <EditItemDisplay
                                            key={index + 1}
                                            index={index}
                                            curr_item={i}
                                            handleFlag={handleFlag}
                                        // items={prItems}
                                        // setItems={setPrItems}
                                        />
                                    )
                                })
                            )
                        }
                    </Col>
                </Row>
                {/* <Row>
                    <Col className='text-center'>
                        <Button
                            color='primary'
                            size='lg'
                            disabled={receivedBy === ''}
                        // onClick={() => handlePR()}
                        >Save</Button>
                    </Col>
                </Row> */}
            </ModalBody>
        </Modal>
    )
}

export default EditPR