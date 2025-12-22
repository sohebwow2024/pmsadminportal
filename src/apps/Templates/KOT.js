import { data } from 'jquery'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { Button } from 'reactstrap'
import axios from '../../API/axios'
import { store } from '@store/store'
const moment = require('moment')

const KOT = () => {

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })
    const [invoicedata, setInvoicedata] = useState([])
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const Inid = useSelector(state => state.voucherSlice.posInvoiceID)
    console.log('Inid', Inid)
    const getInvoiceData = async () => {
        try {
            // const res = await axios.get('/pos_orders/invoice', {
            const res = await axios.get('/pos_orders', {
                params: {
                    LoginID,
                    Token,
                    // id: 'PSIN20230317AA00001'
                    OrderID: Inid
                }
            })
            console.log('res', res)
            setInvoicedata(res?.data)
            const response = await axios.post(`pos_orders/updatekotprint?POSOrderId=${Inid}`, {}, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('response', response);
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getInvoiceData()
    }, [])


    let sum = invoicedata[1]?.reduce((prev, current) => prev =
        prev + +current.Quantity
        , 0);
    return (
        <div className=' m-5 '>
            <div ref={componentRef} className='px-2 m-auto' style={{ width: '500px' }}>
                {invoicedata[2]?.map((item, index) => {
                    return (
                        <div className='text-center mb-1' key={index} style={{ borderBottom: '2px solid black' }}>
                            <h3 className='fw-bolder' style={{ color: 'black' }}>{item.HotelName}</h3>
                            <p>IFSC No - {item.IFSC}</p>
                        </div>
                    )
                })}
                {invoicedata[0]?.map((item, index) => {
                    return (
                        <div className='mb-5'>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Time:</p>
                                <p>{moment(item.InvoiceDate).format('LLL')}</p>
                            </div>

                            <div className='d-flex'>
                                <p className='w-25 fw-bolder ' style={{ color: 'black' }}>Order Id:</p>
                                <p>{item.PoSOrderID}</p>
                            </div>
                            {/* <div className='d-flex'>
                                <p className='w-25 fw-bolder ' style={{ color: 'black' }}>Payment Type:</p>
                                <p>{item.PaymentType}</p>
                            </div> */}
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder ' style={{ color: 'black' }}>Served At:</p>
                                <p>{item.ServedAt}</p>
                            </div>
                            {/* <div className='d-flex'>
                                <p className='w-25 fw-bolder ' style={{ color: 'black' }}>Server:</p>
                                <p>{item.ServerName}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder ' style={{ color: 'black' }}>Name:</p>
                                <p>{item.GuestName}</p>
                            </div> */}
                        </div>
                    )
                })}
                <table className='table mb-1'>
                    <thead>
                        <tr className='fw-bolder' style={{ color: 'black' }}>
                            <th >No</th>
                            <th>Item</th>
                            <th>QTY</th>
                        </tr>
                    </thead>
                    {invoicedata[1]?.map((item, index) => {
                        console.log('item.isKOTPrint', item)
                        const quantity = item.Quantity
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td> {item.isKOTPrint === null ? `${item.POSProductName} (New Product)` : item.POSProductName}</td>
                                <td>{item.Quantity}</td>
                            </tr>


                        )
                    })}
                </table>

                <div className='mb-1 border-top'>
                    <div className='d-flex justify-content-between '>
                        <p>Total Quantity</p>
                        {/* {invoicedata[1]?.map((item, index) => {
                            return ( */}
                        <p className='text-end' style={{ marginLeft: '60px' }}>{sum}</p>
                        {/* )
                        })} */}
                    </div>
                </div>
            </div>
            <Button color='success' onClick={handlePrint} style={{ float: 'right', margin: 10 }}>Print</Button>
        </div >

    )
}

export default KOT
