// ** Third Party Components
import { PreviewA4 } from '@diagoriente/react-preview-a4'
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardBody, CardText, Row, Col, Table } from 'reactstrap'
import Avatar from "@components/avatar"
import axios from '../../API/axios';
import { useSelector } from "react-redux"
import moment from 'moment';



const PreviewCard = ({ data }) => {
  const componentRef = useRef();
  const [show, setShow] = useState(true)
  const bookingDetails = useSelector(state => state.voucherSlice.bookingDetails)
  console.log("bookingData", bookingDetails)
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { UserName } = getUserData


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => { setTimeout(() => window.close(), 1000) }
  });
  useEffect(() => {
    setShow(false)
    handlePrint()
  }, [])


  return show ? (
    <div ref={componentRef}>
      <Card className='invoice-preview-card'>
        <CardBody className='invoice-padding pb-0'>
          {/* Header */}
          <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
            <div>

              <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`)} />
              <h3 className='text-primary invoice-logo'>{bookingDetails?.CompanyDesc}</h3>

              <CardText className='mb-25'>{bookingDetails?.CompanyAddress}</CardText>
              {/* <CardText className='mb-25'>San Diego County, CA 91905, USA</CardText> */}
              <CardText className='mb-0'>{bookingDetails?.CompanyContact}</CardText>
            </div>
            <div className='mt-md-0 mt-2'>
              <h4 className='invoice-title'>
                Invoice <span className='invoice-number'>#{bookingDetails?.Invoice}</span>
              </h4>
              <div className='invoice-date-wrapper'>
                <p className='invoice-date-title'>Date Issued:</p>
                <p className='invoice-date'>{bookingDetails?.DateIssue || moment(new Date()).format('DD/MM/yyyy')} </p>
              </div>
              <div className='invoice-date-wrapper'>
                <p className='invoice-date-title'>Due Date:</p>
                <p className='invoice-date'>{bookingDetails?.DueDate || moment(new Date()).format('DD/MM/yyyy')}</p>
              </div>
            </div>
          </div>
          {/* /Header */}
        </CardBody>

        <hr className='invoice-spacing' />

        {/* Address and Contact */}
        <CardBody className='invoice-padding pt-0'>
          <Row className='invoice-spacing'>
            <Col className='p-0' lg='8'>
              <h6 className='mb-2'>Invoice To:</h6>
              <h6 className='mb-25'>{bookingDetails?.GuestName}</h6>
              <CardText className='mb-25'>{bookingDetails?.GuestAddress}</CardText>
              {/* <CardText className='mb-25'>{bookingDetails?.PaymentMode}{"dubai main road"}</CardText> */}
              <CardText className='mb-25'>{bookingDetails?.GuestMobileNumber}</CardText>
              <CardText className='mb-0'>{bookingDetails?.GuestEmail}</CardText>
            </Col>
            <Col className='p-0 mt-xl-0 mt-2' lg='4'>
              <h6 className='mb-2'>Payment Details:</h6>
              <table>
                <tbody>
                  <tr>
                    <td className='pr-1'>Payment Mode:</td>
                    <td>
                      <span className='font-weight-bolder'>{bookingDetails?.PaymentMode}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Payment Type:</td>
                    <td>{bookingDetails?.PaymentType}</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Total Amount:</td>
                    <td>Rs {bookingDetails?.TotalAmount}/-</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Paid:</td>
                    <td>Rs {bookingDetails?.RecievedAmount}/-</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Balance Amount:</td>
                    <td>Rs {bookingDetails?.PendingAmount}/-</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </CardBody>
        {/* /Address and Contact */}

        {/* Invoice Description */}
        <Table  >
          <thead>
            <tr>
              <th className='py-1'>Room category</th>
              <th className='py-1'>Adults</th>
              <th className='py-1'>Children</th>
              <th className='py-1'>Infant</th>
              <th className='py-1'>Room Price</th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails?.roomData.map(element => <tr className='width-100'>
              <td className='py-1  align-items-start '>
                <p className='card-text font-weight-bold mb-25 text-left'>{element.RoomDisplayName}</p>

              </td>
              <td className='py-1'>
                <span className='font-weight-bold'>{element.Adult}</span>
              </td>
              <td className='py-1'>
                <span className='font-weight-bold'>{element.Children}</span>
              </td>
              <td className='py-1'>
                <span className='font-weight-bold'>{element.Infant}</span>
              </td>
              <td className='py-1'>
                <span className='font-weight-bold'>{element.RoomRate}</span>
              </td>
            </tr>)}

          </tbody>
        </Table>
        {/* /Invoice Description */}

        {/* Total & Sales Person */}
        <CardBody className='invoice-padding pb-0'>
          <Row className='invoice-sales-total-wrapper'>
            <Col className='mt-md-0 mt-3' md='9' order={{ md: 1, lg: 2 }}>
              <CardText className='mb-0'>
                <span className='font-weight-bold'>Salesperson:</span> <span className='ml-75'>{UserName}</span>
              </CardText>
            </Col>
            <Col className='p-0 '>

              <table>
                <tbody>
                  <tr>
                    <td className='pr-1'>Subtotal:</td>
                    <td>
                      <span className='font-weight-bolder'>Rs {bookingDetails?.SubTotal}/-</span>
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Discount:</td>
                    <td>Rs {bookingDetails?.Discount}/-</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Tax:</td>
                    <td>Rs {bookingDetails?.TotalTax}/-</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Total:</td>
                    <td>Rs {bookingDetails?.TotalAmount}/-</td>
                  </tr>

                </tbody>
              </table>
            </Col>
          </Row>
        </CardBody>
        {/* /Total & Sales Person */}

        <hr className='invoice-spacing' />

        {/* Invoice Note */}
        <CardBody className='invoice-padding pt-0 '>
          <Row>
            <Col sm='12'>
              <span className='font-weight-bold'>Note: </span>
              <span>
                It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
                projects. Thank You!
              </span>
            </Col>
          </Row>
        </CardBody>
        {/* /Invoice Note */}
      </Card>

    </div>
  ) : null
}

export default PreviewCard
