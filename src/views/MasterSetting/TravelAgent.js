import { React, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { Edit, Trash } from 'react-feather'
import axios from 'axios'

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

const buttonPink = {
  background: '#FF69B4',
  color: '#fff'
}

const TravelAgent = () => {
  const [travelAgent, SetTravelAgent] = useState(false)
  const [edit, SetEdit] = useState(false)
  const travelAgentTable = [
    {
      name: 'Ref ID',
      selector: row => row.id
    },
    {
      name: 'Agent Code'
    },
    {
      name: 'Company Name',
      selector: row => row.name
    },
    {
      name: 'Discount Amount',
      selector: row => row.name
    },
    {
      name: 'Password'
    },
    {
      name: 'Is Active',
      cell: row => (
        <>
          <Input type="checkbox" name={row.email} />
        </>
      )
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <Edit className='me-50 pe-auto' onClick={() => SetEdit(true)} size={15} />
          <Trash className='me-50' name={row.age} size={15} />
        </>
      )
    }
  ]
  return (
    <>
      <Card>

        <CardBody>
          <CardTitle className='fw-bold fs-2 d-flex justify-content-between'>
            <h2>Travel Agent</h2>
            <Button color='primary' onClick={() => SetTravelAgent(true)}>Travel Agent Setup</Button>
          </CardTitle>
          <DataTable
            noHeader
            data={data}
            columns={travelAgentTable}
            className='react-dataTable'
            pagination
          />
        </CardBody>
      </Card>
      <Modal
        isOpen={travelAgent}
        toggle={() => SetTravelAgent(!travelAgent)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader className='bg-transparent' toggle={() => SetTravelAgent(!travelAgent)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='border-bottom pb-50'>
            <h1 className='mb-1 border-bottom'>Travel Agent Details: </h1>
            <Row>
              <Col md='6 mb-2'>
                <Label>Contact Name<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Company Name<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
            </Row>
            <Row>
              <h3 className='mb-1border-bottom'>Other Details: </h3>
              <Col md='6 mb-2'>
                <Label>Email<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Mobile Number<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Address</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>ZipCode<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST Number<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Discount Type<span className='text-danger'>*</span></Label>
                <Form>
                  <div className='form-check mb-1'>
                    <Input type="radio" value="Flat Amount" name="flatAmount" defaultChecked />
                    <Label className='form-check-label'>Flat Amount</Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input type="radio" value="Percentage" name="percentage" />
                    <Label className='form-check-label'>Percentage</Label>
                  </div>
                  <div className='d-flex'>
                    <Input type='text' className='w-25 me-1' />
                    <h1>&#8377;</h1>
                  </div>
                </Form>
              </Col>
              <Col md='6 mb-2'>
                <Label>Password<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
            </Row>
          </div>
          <Row>
            <Col md='12 text-end mt-2'>
              <Button color='primary' className='me-2'>Save</Button>
              <Button color='' style={buttonPink}>Close</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={edit}
        toggle={() => SetEdit(!edit)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader className='bg-transparent' toggle={() => SetEdit(!edit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='border-bottom pb-50'>
            <h1 className='mb-1 border-bottom'>Travel Agent Details: </h1>
            <Row>
              <Col md='6 mb-2'>
                <Label>Contact Name<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Company Name<span className='text-danger'>*</span></Label>
                <Input type='text' placeholder='Internet Booking Engine' />
              </Col>
            </Row>
            <Row>
              <h3 className='mb-1border-bottom'>Other Details: </h3>
              <Col md='6 mb-2'>
                <Label>Email<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Mobile Number<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Address</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>ZipCode<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST Number<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Discount Type<span className='text-danger'>*</span></Label>
                <Form>
                  <div className='form-check mb-1'>
                    <Input type="radio" value="Flat Amount" name="flatAmount" defaultChecked />
                    <Label className='form-check-label'>Flat Amount</Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input type="radio" value="Percentage" name="percentage" />
                    <Label className='form-check-label'>Percentage</Label>
                  </div>
                  <div className='d-flex'>
                    <Input type='text' className='w-25 me-1' placeholder='0.00' />
                    <h1>&#8377;</h1>
                  </div>
                </Form>
              </Col>
              <Col md='6 mb-2'>
                <Label>Password<span className='text-danger'>*</span></Label>
                <Input type='text' />
              </Col>
            </Row>
          </div>
          <Row>
            <Col md='12 text-end mt-2'>
              <Button color='primary' className='me-2'>Save</Button>
              <Button color='' style={buttonPink}>Close</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </>
  )
}

export default TravelAgent