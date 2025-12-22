import React, { useState } from 'react'
import { Button, Col, Form, Input, Label, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useDispatch, useSelector } from 'react-redux'
import { LaundryInvoiceDetails } from '../../redux/voucherSlice'
import { openLinkInNewTab } from '../../common/commonMethods'
import { store } from '@store/store'
import { setInvoiceID, } from '../../redux/voucherSlice'
const agentOptions = [
    { value: 'bank transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' }
]

const GuestDetailForm = ({ inResto, option, guest, laudryTxnId, orderTotal, guestDetails, setLaundryData, transactionId, bookingId }) => {
    console.log('option', option, orderTotal);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const guestDetailsData = useSelector(state => state.voucherSlice.laundryDetails)

    const { LoginID, Token, UserID } = getUserData
    const dispatch = useDispatch()
    const [invoicecreated, setInvoiceCreated] = useState(false)


    const onDownloadInvoice = () => {
        try {
            const body = {
                "LoginID": LoginID,
                "Token": Token,
                "Seckey": "abc",
                "Event": "insert_generateinvoice",
                "TotalDue": orderTotal + "",
                "LaundryTransactionID": laudryTxnId,
                "PaymentMode": option,
                "PaymentCollectorsName": UserID,
                "BillGSTNo": null,
                "TransactionId": transactionId,
                "BookingID": bookingId
            }
            console.log('test', body);
            dispatch(LaundryInvoiceDetails(body))
            openLinkInNewTab('/laundryInvoice')
            setInvoiceCreated(true)
            store.dispatch(setInvoiceID(body.LaundryTransactionID))
            setLaundryData([])
        } catch (e) { console.log(e) }
    }
    return (
        <>
            <Row>
                <Col>
                    <Form>
                        {
                            guestDetails?.guestName !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Guest Name</Label>
                                        <Input
                                            type='text'
                                            name='name'
                                            value={guestDetails?.guestName || ""}
                                        />
                                    </Col>
                                </Row>
                            )
                        }
                        {
                            guestDetails?.guestEmail !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Guest Email</Label>
                                        <Input
                                            type='email'
                                            name='email'
                                            value={guestDetails?.guestEmail || ""}
                                        />
                                    </Col>
                                </Row>
                            )
                        }
                        {
                            guestDetails?.guestMobileNumber !== '' && (
                                <Row className='mb-1'>
                                    <Col>
                                        <Label>Mobile Number</Label>
                                        <Input
                                            type='text'
                                            name='mobile'
                                            value={guestDetails?.guestMobileNumber || ""}
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
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
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
                                            </>
                                        ) : option === 'card' ? (
                                            <>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
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
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        option === 'cash' ? (
                                            <>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
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
                                                            value={guestDetails?.guestName || ""}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : option === 'card' ? (
                                            <>
                                                {/* <Row className='mb-1'>
                                                    <Col>
                                                        <Label>Payment Collectors Name</Label>
                                                        <Input
                                                            type='text'
                                                            name='payment collector'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-1'>
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
                                                            value={guestDetails?.guestName || ""}
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
                                                            value={guestDetails?.guestName || ""}
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
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        <Row className='mt-1'>
                            <Col className='text-center'>
                                {!invoicecreated ? <Button color='success' onClick={onDownloadInvoice}>Create Invoice</Button> : <Link target={"_blank"} to={'/laundryInvoice'}>View Invoice</Link>}
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    )
}


export default GuestDetailForm