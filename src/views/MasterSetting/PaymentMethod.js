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

const PaymentMethod = () => {
  const [paymentMethod, SetpaymentMethod] = useState(false)
  const [edit, SetEdit] = useState(false)
  const paymentMethodTable = [
    {
      name: 'Ref ID',
      selector: row => row.id
    },
    {
      name: 'Type',
      selector: row => row.name
    },
    {
      name: 'Description',
      selector: row => row.name
    },
    {
      name: 'Payment Mode',
      selector: row => row.name
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
      name: 'Action Items',
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
            <h2>Payment Method Master</h2>
            <Button color='primary' onClick={() => SetpaymentMethod(true)}>Cashiering setup: Payment Method</Button>
          </CardTitle>
          <DataTable
            noHeader
            data={data}
            columns={paymentMethodTable}  
            className='react-dataTable'
            pagination
          />
        </CardBody>
      </Card>
      <Modal
        isOpen={paymentMethod}
        toggle={() => SetpaymentMethod(!paymentMethod)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader className='bg-transparent' toggle={() => SetpaymentMethod(!paymentMethod)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='mb-1 border-bottom'>Cashiering setup: Payment Method</h1>
          <Row>
            <Col md='6'>
              <Label>Type</Label>
              <Input type='text' />
            </Col>
            <Col md='6'>
              <Label>Description</Label>
              <Input type='text' />
            </Col>
          </Row>
          <Row>
            <Col sm='12' className='d-flex border-bottom pb-50'>
              <Form>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>
                    <Input type="radio" value="Cash" name="pm1" defaultChecked />
                    <Label className='form-check-label'>Cash</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="CreditCard" name="pm2" />
                    <Label className='form-check-label'>Credit Card</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="DebitCard" name="pm3" />
                    <Label className='form-check-label'>Debit Card</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="Debtoraccount" name="pm4" />
                    <Label className='form-check-label'>Debtor account</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="Other" name="pm5" />
                    <Label className='form-check-label'>Other</Label>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
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
          <h1 className='mb-1 border-bottom'>Cashiering setup: Payment Method</h1>
          <Row>
            <Col md='6'>
              <Label>Type</Label>
              <Input type='text' placeholder='BTC' />
            </Col>
            <Col md='6'>
              <Label>Description</Label>
              <Input type='text' placeholder='BILL TO COMPANY' />
            </Col>
          </Row>
          <Row>
            <Col sm='12' className='d-flex border-bottom pb-50'>
              <Form>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>
                    <Input type="radio" value="Cash" name="pm1" defaultChecked />
                    <Label className='form-check-label'>Cash</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="CreditCard" name="pm2" />
                    <Label className='form-check-label'>Credit Card</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="DebitCard" name="pm3" />
                    <Label className='form-check-label'>Debit Card</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="Debtoraccount" name="pm4" />
                    <Label className='form-check-label'>Debtor account</Label>
                  </div>
                  <div className='form-check'>
                    <Input type="radio" value="Other" name="pm5" />
                    <Label className='form-check-label'>Other</Label>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
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

export default PaymentMethod