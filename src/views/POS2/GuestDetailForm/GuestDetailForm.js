import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'
import { setPosInvoiceID } from '../../../redux/voucherSlice'
import { store } from '@store/store'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { openLinkInNewTab } from '../../../common/commonMethods'
const agentOptions = [
    { value: 'bank transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' }
]

const GuestDetailForm = ({ inResto, option, table, guest, orderData, setOrderItems, saveSecondary, roomNoData, selGuestObj }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const [collectorName, setCollectorName] = useState('')
    // const [guestName, setGuestName] = useState(inResto === true ? '' : roomNoData[0]?.GuestName)
    // const [guestEmail, setGuestEmail] = useState(inResto === true ? '' : roomNoData[0]?.GuestEmail)
    // const [guestNumber, setGuestNumber] = useState(inResto === true ? '' : roomNoData[0]?.GuestMobileNumber)
    const [guestName, setGuestName] = useState(inResto === true ? '' : selGuestObj?.guestName)
    const [guestEmail, setGuestEmail] = useState(inResto === true ? '' : selGuestObj?.guestEmail)
    const [guestNumber, setGuestNumber] = useState(inResto === true ? '' : selGuestObj?.guestMobileNumber)
    console.log('orderData', orderData);
    const onDownloadInvoice = () => {
        try {
            const body = {
                LoginID,
                Token,
                Seckey: "abc",
                PoSOrderID: orderData[0]?.poSOrderID,
                PaidAmount: orderData[0]?.totalDue,
                PaymentType: option,
                Remark: "Cash",
                GSTNo: null,
                PaymentReference: option,
                InvoiceDate: orderData[0]?.orderDate,
                CollectorName: collectorName,
                GuestID: '',
                GuestName: guestName,
                GuestEmail: guestEmail,
                GuestMobileNumber: guestNumber,
            }
            try {
                axios.post("/pos_orders/invoice", body).then((res) => {
                    console.log('invoice res', res);
                    console.log(res?.data[1][0].invoiceID , "posorderdata");
                    toast.success(`Invoice Generated`)
                    store.dispatch(setPosInvoiceID(res?.data[1][0]?.invoiceID))
                    openLinkInNewTab('/posInvoice')
                    saveSecondary()
                })
            } catch (e) {
                console.log(e);
                toast.error(e.response)
            }

        } catch (e) { console.log(e) }
    }

    return (
        <>
            <Row>
                <Col>
                    <Form>
                        {
                            guestName !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Guest Name</Label>
                                        <Input
                                            type='text'
                                            name='name'
                                            value={guestName}
                                            onChange={(e) => { setGuestName(e.target.value) }}
                                        />
                                    </Col>
                                </Row>
                            )
                        }
                        {
                            guestEmail !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Guest Email</Label>
                                        <Input
                                            type='email'
                                            name='email'
                                            value={guestEmail}
                                            onChange={(e) => { setGuestEmail(e.target.value) }}
                                        />
                                    </Col>
                                </Row>
                            )
                        }
                        {
                            guestNumber !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Mobile Number</Label>
                                        <Input
                                            type='text'
                                            name='mobile'
                                            value={guestNumber}
                                            onChange={(e) => { setGuestNumber(e.target.value) }}
                                        />
                                    </Col>
                                </Row>
                            )
                        }

                        {
                            inResto ? (
                                <>
                                    {
                                        option === 'cash' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                            value={collectorName}
                                                            onChange={(e) => { setCollectorName(e.target.value) }}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Table</Label>
                                                        <Input
                                                            type='text'
                                                            name='table'
                                                            value={table}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : option === 'card' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                            value={collectorName}
                                                            onChange={(e) => { setCollectorName(e.target.value) }}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Reference Number</Label>
                                                        <Input
                                                            type='text'
                                                            name='ref number'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Table</Label>
                                                        <Input
                                                            type='text'
                                                            name='table'
                                                            value={table}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : option === 'online' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Agent</Label>
                                                        <Select
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={agentOptions}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Table</Label>
                                                        <Input
                                                            type='text'
                                                            name='table'
                                                            value={table}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : (
                                            <>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Attending Staff</Label>
                                                        <Input
                                                            type='text'
                                                            name='staff name'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Table</Label>
                                                        <Input
                                                            type='text'
                                                            name='table'
                                                            value={table}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        option === 'cash' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                            value={collectorName}
                                                            onChange={(e) => { setCollectorName(e.target.value) }}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Guest</Label>
                                                        <Input
                                                            type='text'
                                                            name='guest'
                                                            value={guest}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : option === 'card' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                            value={collectorName}
                                                            onChange={(e) => { setCollectorName(e.target.value) }}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Reference Number</Label>
                                                        <Input
                                                            type='text'
                                                            name='ref number'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Guest</Label>
                                                        <Input
                                                            type='text'
                                                            name='guest'
                                                            value={guest}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : option === 'online' ? (
                                            <>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Agent</Label>
                                                        <Select
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={agentOptions}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Guest</Label>
                                                        <Input
                                                            type='text'
                                                            name='guest'
                                                            value={guest}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : (
                                            <>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Attending Staff</Label>
                                                        <Input
                                                            type='text'
                                                            name='staff name'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Bill GST No.</Label>
                                                        <Input
                                                            type='text'
                                                            name='bill gst no.'
                                                        />
                                                    </Col>
                                                </Row> */}
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Guest</Label>
                                                        <Input
                                                            type='text'
                                                            name='guest'
                                                            value={guest}
                                                        />
                                                    </Col>
                                                </Row> */}
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        <Row className='mt-1'>
                            <Col className='text-center'>
                                <Button color='success' onClick={onDownloadInvoice} disabled={orderData[0]?.status === "Hold"}>View Invoice</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default GuestDetailForm