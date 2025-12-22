import React from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Input, Row, Col, Label } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Edit, Trash } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})
const labelStyle = {
  fontSize: '17px'
}


const IdCard = () => {
  const idCard = [
    { value: '...', label: '...' },
    { value: 'def', label: 'def' },
    { value: 'ghi', label: 'ghi' },
    { value: 'jkl', label: 'jkl' },
    { value: 'lmn', label: 'lmn' }
  ]

  const idCardTable = [
    {
      name: 'Sr No',
      selector: row => row.id
    },
    {
      name: "Id Type",
      selector: row => row.name
    },
    {
      name: 'Action',
      selector: row => row.age,
      cell: row => (
        <>
          <Edit className='me-50 pe-auto' size={15} />
          <Trash className='me-50' name={row.age} size={15} />
        </>
      )

    }
  ]
  return (
    <>
      <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardBody>
              <CardTitle tag='h1' className='fw-bold fs-2 mb-3'>Card Type Master</CardTitle>
              <Row>
                <Col md='6 d-flex mb-3'>
                  <Label style={labelStyle} className='w-50'>Card Type</Label>
                  <Input className='me-5' type='text' placeholder='Enter Card Type'></Input>
                </Col>
                <Col md='6 d-flex mb-3'>
                  <Button color='primary me-1' >Submit</Button>
                  <Button className='me-1' >Cancel</Button>
                </Col>
              </Row>
              <Row>
                <Col md='12 d-flex'>
                  <Label style={labelStyle} className='w-50'>Deleted Records of Category 18</Label>
                  </Col>
                  <Col md='12 w-25 mb-2'>
                  <Select
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    defaultValue={idCard[0]}
                    options={idCard}
                    isClearable={false}
                  />
                </Col>
              </Row>
              <CardText>
                <DataTable
                  noHeader
                  data={data}
                  columns={idCardTable}
                  className='react-dataTable'
                />
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default IdCard