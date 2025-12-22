import { React, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { Trash } from 'react-feather'
import axios from 'axios'

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

const buttonPink = {
  background: '#FF69B4',
  color: '#fff'
}

const DebtorAccount = () => {
  const [debtorAccount, SetDebtorAccount] = useState(false)
  const [accountName, SetAccountName] = useState(false)
  const debtorAccountTable = [
    {
      name: 'Ref ID',
      selector: row => row.id
    },
    {
      name: 'Short Name'
    },
    {
      name: 'Account Name',
      cell: row => (
        <>
          <div onClick={() => SetAccountName(true)}>
            {row.name}
          </div>
        </>
      )
    },
    {
      name: 'Type'
    },
    {
      name: 'Limit',
      selector: row => row.id
    },
    {
      name: 'Contact Name'
    },
    {
      name: 'Status',
      cell: row => (
        <>
          <Input type="checkbox" className='me-50' name={row.email} />
          <Trash className='me-50' name={row.age} size={18} />
        </>
      )
    }
  ]
  return (
    <>
      <Card>

        <CardBody>
          <CardTitle className='fw-bold fs-2 d-flex justify-content-between'>
            <h2>Debtor Account Setup</h2>
            <Button color='primary' onClick={() => SetDebtorAccount(true)}>Debtor Account Setup</Button>
          </CardTitle>
          <DataTable
            noHeader
            data={data}
            columns={debtorAccountTable}
            className='react-dataTable'
            pagination
          />
        </CardBody>
      </Card>
      <Modal
        isOpen={debtorAccount}
        toggle={() => SetDebtorAccount(!debtorAccount)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader className='bg-transparent' toggle={() => SetDebtorAccount(!debtorAccount)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='border-bottom pb-50'>
            <h1 className='mb-1 border-bottom'>Debtor Account Details: </h1>
            <Row>
              <Col md='6 mb-2'>
                <Label>Short Name</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Account Name</Label>
                <Input type='text' />
              </Col>
            </Row>
            <Row>
              <Col md='6 mb-2'>
                <Label>Type</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact Name</Label>
                <Input type='text' />
              </Col>
            </Row>
            <Row>
              <h3 className='mb-1border-bottom'>Other Details: </h3>
              <Row>
                <Col md='12 mb-2'>
                  <Label>Address</Label>
                  <Input type='text' />
                </Col>
              </Row>
              <Col md='6 mb-2'>
                <Label>Country</Label>
                <Input type='text' placeholder='India(IN)' />
              </Col>
              <Col md='6 mb-2'>
                <Label>State</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>City</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Zip</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact # 1</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact # 2</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Email</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Mobile Number</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST State</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST Number</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Remark</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Group Type</Label>
                <Input type='text' placeholder='Firm' />
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
        isOpen={accountName}
        toggle={() => SetAccountName(!accountName)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader className='bg-transparent' toggle={() => SetAccountName(!accountName)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
        <div className='border-bottom pb-50'>
            <h1 className='mb-1 border-bottom'>Debtor Account Details: </h1>
            <Row>
              <Col md='6 mb-2'>
                <Label>Short Name</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Account Name</Label>
                <Input type='text' placeholder='Internet Booking Engine' />
              </Col>
            </Row>
            <Row>
              <Col md='6 mb-2'>
                <Label>Type</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact Name</Label>
                <Input type='text' />
              </Col>
            </Row>
            <Row>
              <h3 className='mb-1border-bottom'>Other Details: </h3>
              <Row>
                <Col md='12 mb-2'>
                  <Label>Address</Label>
                  <Input type='text' />
                </Col>
              </Row>
              <Col md='6 mb-2'>
                <Label>Country</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>State</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>City</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Zip</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact # 1</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Contact # 2</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Email</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Mobile Number</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST State</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>GST Number</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Remark</Label>
                <Input type='text' />
              </Col>
              <Col md='6 mb-2'>
                <Label>Group Type</Label>
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

export default DebtorAccount