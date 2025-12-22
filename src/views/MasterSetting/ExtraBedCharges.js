import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Trash } from 'react-feather'
import { GrFormView } from "react-icons/gr"

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

const ExtraBedCharges = () => {
  const extraBedMasterTable = [
    {
      name:'Sr No',
      selector: row => row.id
    },
    {
      name: 'Bed Count',
      selector: row => row.name
    },
    {
      name: 'Bed Charges',
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
        <CardTitle tag='h1' className='fw-bold fs-2 mb-3'>Extra Bed Master</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md='4 d-flex mb-2'>
            <Label>Bed Count</Label>
            <Input type='text' placeholder='Bed-4'></Input>
          </Col>
          <Col md='4 d-flex mb-2'>
            <Label>Bed Charges</Label>
            <Input type='text' placeholder='1600.00'></Input>
          </Col>
          <Col md='4 mb-2'>
            <Button color='primary'>Submit</Button>
            <Button className='ms-2' outline color='secondary'>Cancel</Button>
          </Col>
        </Row>
        <DataTable 
          noHeader
          data={data}
          columns={extraBedMasterTable}
          className='react-dataTable'
        />
      </CardBody>
    </Card>
  )
}

export default ExtraBedCharges