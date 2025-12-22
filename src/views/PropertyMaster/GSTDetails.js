import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Label, Input, Button } from 'reactstrap'

const GSTDetails = () => {
  return (
        <Card>
          <CardHeader>
          <CardTitle tag='h1' className='fw-bold fs-2 mb-2'>GST Info</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md='6 d-flex mb-2'>
                <Label for='gstno' className='w-50'>GST Number<span className='text-danger'>*</span></Label>
                <Input type='text' id='gstno'></Input>
              </Col>
              <Col md='6 d-flex mb-2'>
                <Label for='name' className='w-50'>Name</Label>
                <Input type='text' id='name'></Input>
              </Col>
              </Row>
              <Row>
              <Col md='6 d-flex mb-2'>
                <Label for='address' className='w-50'>Address</Label>
                <Input type='text' id='address'></Input>
              </Col>
              <Col md='6 d-flex mb-2'>
                <Label for='state' className='w-50'>State<span className='text-danger'>*</span></Label>
                <Input type='text' id='state'></Input>
              </Col>
              </Row>
              <Row>
              <Col md='6 d-flex mb-2'>
                <Label for='pincode' className='w-50'>PIN Code</Label>
                <Input type='text' id='pincode'></Input>
              </Col>
              <Col md='6 d-flex mb-2'>
                <Label for='contactno' className='w-50'>Contact No.</Label>
                <Input type='text' id='contactno'></Input>
              </Col>
              </Row>
              <Row>
              <Col md='6 d-flex mb-2'>
                <Label for='email' className='w-50'>E-Mail</Label>
                <Input type='text w-40' id='email'></Input>
              </Col>
              <Col md='6 d-flex mb-2'>
                <Label for='statecode' className='w-50'>State Code</Label>
                <Input type='text' id='statecode'></Input>
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

export default GSTDetails