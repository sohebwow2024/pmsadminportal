// ** React Imports
import { Fragment, useState } from 'react'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import { ArrowLeft, ArrowRight } from 'react-feather'
import Select from 'react-select'
// import Flatpickr from 'react-flatpickr'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button } from 'reactstrap'
const colourOptions = [
  { value: '-', label: '-' },
  { value: 'Tax Exempt', label: 'Tax Exempt' },
  { value: 'Tax with GST', label: 'Tax with GST' },
  { value: 'Tax without GST', label: 'Tax without GST' }
]
const payMed = [
  { value: '-', label: '-' },
  { value: 'Payment Gateway', label: 'Payment Gateway' },
  { value: 'Cash', label: 'Cash' }
]
const payType = [
  { value: '-', label: '-' },
  { value: 'Card', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank', label: 'Bank' },
  { value: 'Other', label: 'Other' }
]
const labelStyle = {
  fontSize: '16px'
}
const CardComponents = () => {
  return (
  <Row>
    <Col md='4' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Card Number</Label>
      <Input type='text' placeholder='Enter Card Number' />
    </Col>
    <Col md='4' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Expiry Date</Label>
      <Input type='text' placeholder='Enter Expiry Date' />
    </Col>
    <Col md='4' className='mb-1'>
      <Label style={labelStyle} className='form-label'>CVV</Label>
      <Input type='text' placeholder='CVV' />
    </Col>
  </Row>
  )
}
const UpiComponents = () => {
  return (
  <Row>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>UPI Verification</Label>
      <Input type='text' placeholder='UPI' />
    </Col>
  </Row>
  )
}
const BankComponents = () => {
  return (
  <Row>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Bank Name</Label>
      <Input type='text' placeholder='Enter Bank Name' />
    </Col>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Bank Account Number</Label>
      <Input type='text' placeholder='Enter Bank Account Number' />
    </Col>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Bank Code</Label>
      <Input type='text' placeholder='Enter Bank Code' />
    </Col>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Bank IFSC Code</Label>
      <Input type='text' placeholder='Enter Bank IFSC Code' />
    </Col>
  </Row>
  )
}
const OtherComponents = () => {
  return (
  <Row>
    <Col md='6' className='mb-1'>
      <Label style={labelStyle} className='form-label'>Other Details</Label>
      <Input type='text' placeholder='Enter Other Details' />
    </Col>
  </Row>
  )
}
const CreditDetails = ({ stepper }) => {
  // const [picker, setPicker] = useState(new Date())

  const [payValue, setPayValue] = useState('Select Card Type')
  const handleOnChange = selctedOption => {
    setPayValue(selctedOption.value)
    console.log(selctedOption.value)
  }
  const [payTypeSelect, setpayTypeSelect] = useState('Select Card Type')
  const handleOnChange1 = selctedOption => {
    setpayTypeSelect(selctedOption.value)
    console.log(selctedOption.value)
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Payment Medium</h5>
      </div>
      <Form >
        <Row>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Payment Medium</Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={payValue}
              options={payMed}
              isClearable={false}
              // value = {cardValue}
              onChange={handleOnChange}
            />
          </Col>
          <Col md='6' className='mb-1'>
            {payValue === "Payment Gateway" ? (<>
              <Label style={labelStyle} className='form-label'>Payment Type</Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={payTypeSelect}
                options={payType}
                isClearable={false}
                // value = {cardValue}
                onChange={handleOnChange1}
              /></>) : (<>
                {payValue === 'Cash' ? (<></>) : (<>
                </>)}

              </>)}
          </Col>
          <Col md='12' className='mb-1'>
            {payTypeSelect === "Card" ? (<>
              <CardComponents />
            </>) : (<>
              {payTypeSelect === 'UPI' ? (<>
                <UpiComponents /></>) : (<>
              </>)}
              {payTypeSelect === 'Bank' ? (<>
                <BankComponents /></>) : (<>
              </>)}
              {payTypeSelect === 'Other' ? (<>
                <OtherComponents /></>) : (<>
              </>)}

            </>)}
          </Col>

        </Row>
        <Row>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Total Amount</Label>
      <Input type='text' placeholder='Enter Amount' />
        </Col>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Advance Payment</Label>
      <Input type='text' placeholder='Enter Advance Payment' />
        </Col>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Balance Amount</Label>
      <Input type='text' placeholder='Enter Balance Amount' />
        </Col>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Full Payment</Label>
      <Input type='text' placeholder='Enter Full Payment' />
        </Col>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Tax</Label>
        <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
        </Col>
        <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Additional Charges</Label>
      <Input type='text' placeholder='Enter Additional Charges' />
        </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default CreditDetails

