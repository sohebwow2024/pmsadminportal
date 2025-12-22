import { data } from 'jquery'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { Button } from 'reactstrap'
import axios from '../../API/axios'
import { setInvoiceID, } from '../../redux/voucherSlice'
import { store } from '@store/store'
const moment = require('moment')

const LaundryTemplate = () => {
  const [invoiceData, setInvoiceData] = useState([])
  console.log('invoice', invoiceData);
  const TransId = useSelector(state => state.voucherSlice.invoiceID)
  console.log('data', TransId)
  const componentRef = useRef()
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const getSearchData = async () => {
    console.log('hit');
    try {
      const objc1 = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "invoice",
        LaundryTransactionID: TransId
      };
      console.log('objc1', objc1)
      const res = await axios.post("laundry/invoice", objc1);
      setInvoiceData(res.data)
      console.log('responsenewss', res.data)
    } catch (error) {
      console.log("Error", error);
    }
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })


  useEffect(() => {
    getSearchData()
  }, [])

  return (
    <div className=' m-5 border'>
      <div ref={componentRef} className='px-2'>
        {invoiceData[0]?.map((r, i) => {
          console.log(r)
          return (
            <div key={i}>
              <h3>{r.hotelName}</h3>
              <p>{r.addressLine}</p>
              <p>{r.cityName}</p>
              <p>PinCode: {r.postalCode}</p>
              <p>{r.phoneNumber}</p>
            </div>
          )
        })}
        {invoiceData[1]?.map((r, i) => {
          return (
            <div key={i}>
              <h3>Guest Details</h3>
              <div className='d-flex flex-row'>
                <p >{`Guest Name: `}</p>
                <p className='mx-1'>{r.guestName}</p>
              </div>

              <p>Mobile: {r.guestMobileNumber}</p>
            </div>
          )
        })}
        {invoiceData[2]?.map((r, i) => {
          return (
            <div key={i}>
              <p>{`Date: ${moment(r.date).format('DD/MM/YYYY')}`}</p>
              <p>Invoice Number: {r.invoiceNo}</p>
            </div>
          )
        })}

        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Qty</th>
              <th>Description</th>
              <th>Service</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData[3]?.map((r, i) => {
              const description = r.description.split(", ")
              const services = r.services.split(", ")
              const charges = r.charges
              return (
                <tr key={i}>
                  <td >{moment(r.date).format("DD/MM/YYYY")}</td>
                  <td >{r.quantity}</td>
                  <td>{description.map((r, i) => {
                    return <p key={i}>{r}</p>
                  })}</td>
                  <td>{services.map((r, i) => {
                    return <p key={i}>{r}</p>
                  })}</td>
                  <td><p>{charges * r.quantity}</p></td>
                  {/* <td>{charges.map((r, i) => {
                    return <p key={i}>{r}</p>
                  })}</td> */}
                </tr>
              )

            })}
          </tbody>
        </table>
        <table className='table table-bordered'>
          {invoiceData[4]?.map((r, i) => {
            // console.log(r);
            return (
              <tbody key={i}>
                <tr>
                  <td width={'70%'} rowSpan={7}>Notes</td>
                  <td width={'15%'}>Subtotal Charges</td>
                  <td width={'15%'}>{r.Total}</td>
                </tr>
                <tr>
                  <td width={'15%'}>Tax</td>
                  <td width={'15%'}>+ {r.totalTax}</td>
                </tr>
                <tr>
                  <td width={'15%'}>Discount</td>
                  <td width={'15%'}>- {r.discount}</td>
                </tr>
                <tr>
                  <td width={'15%'}>Total Charges</td>
                  <td width={'15%'}>{r.totalDue}</td>
                </tr>
                {/* <tr>
                  <td width={'15%'}>Deposit paid</td>
                  <td width={'15%'}>150/-</td>
                </tr>
                <tr>
                  <td width={'15%'}>Balance</td>
                  <td width={'15%'}>50/-</td>
                </tr> */}
              </tbody>
            )
          })}
        </table>
      </div>
      <Button color='success' onClick={handlePrint} style={{ float: 'right', margin: 10 }}>Print</Button>
    </div >

  )
}

export default LaundryTemplate
