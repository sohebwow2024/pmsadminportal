// ** Third Party Components
import { PreviewA4 } from '@diagoriente/react-preview-a4'
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardBody, CardText, Row, Col, Table } from 'reactstrap'
import Avatar from "@components/avatar"
import axios from '../../API/axios';
import { useSelector } from "react-redux"
import moment from 'moment';
import { Button } from 'reactstrap'


const PreviewCard2 = ({ data }) => {
  const componentRef = useRef();
  const [show, setShow] = useState(true)
  const bookingDetails = useSelector(state => state.voucherSlice.bookingDetails)
  console.log("bookingData", bookingDetails)
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { UserName } = getUserData


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: () => { setTimeout(() => window.close(), 1000) }
  });
  useEffect(() => {
    setShow(false)
    // handlePrint()
  }, [])


  return (
    <div >
         <div ref={ componentRef }>
      <div  className='d-flex w-100 justify-content-between mx-5 fs-5'>
     
        <div  >
          <Avatar img={ require(`../../assets/images/logo/hostynnist-logo.png`) } size='lg' />

          <h1>{ bookingDetails?.CompanyDesc }</h1>
          <p>{ bookingDetails?.CompanyAddress }</p>
          <p>{ bookingDetails?.CompanyContact }</p>

          <p>Email ID: abc@gmail.com</p>
        </div>
        <p style={ { marginRight: 62, marginTop: 10 } }>{ `Invoice no: ${bookingDetails?.Invoice}` }</p>
      </div>

      <div>


        <table striped bordered hover className='table  table-bordered mb-5'>
          <thead>
            <tr>

              <th className='font-weight-bold text-xl-center fs-5' colSpan={ 4 } style={ { fontSize: 16, textAlign: 'center' } }>Guest Details</th>



            </tr>
          </thead>
          <tbody className='py-1 fs-5'>
            <tr >
              <td>{ `Guest Name: ${bookingDetails?.GuestName}` }</td>

              <td>{ `Phone Number: ${bookingDetails?.GuestMobileNumber}` }</td>

              <td>{ `Address: ${bookingDetails?.GuestAddress} ${bookingDetails?.CityName}` }</td>
              <td>{ `Pincode: ${bookingDetails?.Pincode}` }</td>

            </tr>
          </tbody>

        </table>
        <table bordered className='mb-5 table  table-bordered'>

          <thead>
            <tr>

              <th colSpan={ 4 } className="text-xl-center" style={ { fontSize: 16 } }>Booking Details</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Booking Date</td>

              <td>Check In</td>

              <td>Check-Out:</td>
              <td>Total Stay Nights:</td>

            </tr>
            <tr>
              <td>Booking ID</td>

              <td>{ `Room Name: ${bookingDetails?.roomData[0]?.RoomDisplayName}` }</td>


              <td>{ `Total Occupants: ${parseInt(bookingDetails?.roomData[0]?.Adult + bookingDetails?.roomData[0]?.Children + bookingDetails?.roomData[0]?.Infant)}` }</td>
              <td>{ `Room No: ` }</td>

            </tr>
            <tr>
              <td colSpan={ 4 } className="text-left">{ `Special Notes: ${bookingDetails?.SpecialNote}` }</td>



            </tr>
          </tbody>

        </table>
        <table striped bordered hover className='table table-bordered mb-5'>

          <thead>
            <tr>

              <th className='text-xl-center' style={ { fontSize: 16 } } colSpan={ 4 }>Perfoma Invoice</th>

            </tr>
          </thead>
          <tbody>
            <tr >

              <td>Arrival Date</td>
              <td>Charge Code</td>
              <td>Charge Description</td>
              <td>Amount</td>
            </tr>
            <tr>
              <td rowSpan={ 3 }>{ '02/02/2023' }</td>
              <td rowSpan={ 3 }>{ '01144' }</td>
              <td >Room Charge</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>

              <td >CGST</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>

              <td >SGST</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>
            <td rowSpan={ 3 }>{ '07/02/2023' }</td>
              <td rowSpan={ 3 }>{ '01144' }</td>
              <td >Breakfast</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>
             
                <td >CGST</td>
                <td >{'1800'}</td>
      
              </tr>
              <tr>
             
             <td >SGST</td>
             <td >{'1800'}</td>
   
           </tr>
           <tr>
            <td rowSpan={ 3 }>{ '07/02/2023' }</td>
              <td rowSpan={ 3 }>{ '01144' }</td>
              <td >Main Course NON-Veg</td>
              <td >{ '1800/-' }</td>

            </tr>
            <tr>
             
                <td >CGST</td>
                <td >{'1800/-'}</td>
      
              </tr>
              <tr>
             
             <td >SGST</td>
             <td >{'1800'}</td>
   
           </tr>
           <tr>
            <td >{ '07/02/2023' }</td>
              <td >{ '01144' }</td>
              <td >Advance Payment for Room Charge</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>
            <td >{ '07/02/2023' }</td>
              <td >{ '01144' }</td>
              <td >Pending Payment for Room Charge</td>
              <td >{ '1800' }</td>

            </tr>
            <tr>
            <td >{'Total Nights: ' }</td>
              <td >{ '' }</td>
              <td >Total Balance Amount</td>
              <td >{ '1800' }</td>

            </tr>
          </tbody>

        </table>




      </div>
      </div>
      <div className='d-flex justify-content-end py-1'>
            <Button onClick={()=>  toast.error('Sorry! not implemented yet')} className='m-1 ' color='success'>
                               Send Via Email
                            </Button>
                            <Button className='m-1' color='primary' onClick={handlePrint} >
                               Download Invoice
                            </Button>

    </div>
    </div>
  )
}

export default PreviewCard2
