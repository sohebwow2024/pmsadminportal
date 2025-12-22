import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Trash } from 'react-feather'
import { GrFormView } from "react-icons/gr"

const buttonPink = {
  background: '#FF69B4',
  color: '#fff'
}

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

const Discount = () => {
  const discountMasterTable = [
    {
      name:'Sr No',
      selector: row => row.id
    },
    {
      name: 'Discount Name',
      selector: row => row.name
    },
    {
      name: 'Discount (%)',
      selector: row => row.id
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <Trash className='me-50' name={row.age} size={15} />
          <GrFormView className='me-50' size={25}/>
        </>
      )
    }
  ]
  return (
    <Card>
      <CardHeader>
      <CardTitle tag='h1' className='fw-bold fs-2 mb-3'>Discount Master</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md='4 d-flex mb-2'>
            <Label>Discount Name</Label>
            <Input type='text' placeholder='Senior Citizen'></Input>
          </Col>
          <Col md='4 d-flex mb-2'>
            <Label>Discount (%)</Label>
            <Input type='text' placeholder='15'></Input>
          </Col>
          <Col md='4 mb-2'>
            <Button color='info'>Submit</Button>
            <Button className='ms-2' color='' style={buttonPink}>Cancel</Button>
          </Col>
        </Row>
        <DataTable 
          noHeader
          data={data}
          columns={discountMasterTable}
          className='react-dataTable'
        />
      </CardBody>
    </Card>
  )
}

export default Discount