import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Label, Input, Button } from 'reactstrap'

const BankDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h1' className='fw-bold fs-2 mb-1'>Accounts Info</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md='6 d-flex mb-2'>
            <Label for='accountno' className='w-50'>Account No<span className='text-danger'>*</span></Label>
            <Input type='text' id='accountno'></Input>
          </Col>
          <Col md='6 d-flex mb-2'>
            <Label for='accountholder' className='w-50'>Account Holder Name<span className='text-danger'>*</span></Label>
            <Input type='text' id='accountholder'></Input>
          </Col>
          </Row>
          <Row>
          <Col md='6 d-flex mb-2'>
            <Label for='address' className='w-50'>Address</Label>
            <Input type='text' id='address'></Input>
          </Col>
          <Col md='6 d-flex mb-2'>
            <Label for='ifsccode' className='w-50'>IFSC Code<span className='text-danger'>*</span></Label>
            <Input type='text' id='ifsccode'></Input>
          </Col>
          </Row>
          <Row>
          <Col md='6 d-flex mb-2'>
            <Label for='branchcode' className='w-50'>Branch Code<span className='text-danger'>*</span></Label>
            <Input type='text' id='branchcode'></Input>
          </Col>
          <Col md='6 d-flex mb-2'>
            <Label for='bankname' className='w-50'>Bank Name<span className='text-danger'>*</span></Label>
            <Input type='text' id='bankname'></Input>
          </Col>
          </Row>
          <Row>
          <Col md='6 d-flex mb-2'>
            <Label for='bankcode' className='w-50'>Bank Code</Label>
            <Input type='text w-40' id='bankcode'></Input>
          </Col>
          <Col md='6 d-flex mb-2'>
            <Label for='panno' className='w-50'>PAN Number<span className='text-danger'>*</span></Label>
            <Input type='text' id='panno'></Input>
          </Col>
          </Row>
          <Row>
          <Col md='6 d-flex mb-2'>
            <Label for='panname' className='w-50'>Name On PAN Card</Label>
            <Input type='text' id='panname'></Input>
          </Col>
          <Col md='6 d-flex mb-2'>
            <Label for='servicetaxno' className='w-50'>Service TAX No</Label>
            <Input type='text' id='servicetaxno'></Input>
          </Col>
          </Row>
          <Row>
          <Col md='12 text-end my-1'>
            <Button color='info'>Save</Button>
          </Col>
          </Row>
      </CardBody >
    </Card >
  )
}

export default BankDetails