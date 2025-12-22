import { React } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Input, Row, Col, Label } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Edit, Trash } from 'react-feather'

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

const labelStyle = {
  fontSize: '18px'
}


const Note = () => {
  const noteTable = [
    {
      name: 'Sr No',
      selector: row => row.id
    },
    {
      name: "Notes Type",
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
              <CardTitle tag='h1' className='fw-bold fs-2 mb-3'>Notes Master</CardTitle>
              <Row>
                <Col md='6 d-flex mb-2'>
                  <Label style={labelStyle} className='w-50'>Notes Type</Label>
                  <Input className='me-5' type='text' placeholder='Enter Notes Type'></Input>
                </Col>
                <Col md='6 d-flex mb-2'>
                  <Button color='primary me-1' >Submit</Button>
                  <Button className='me-1' >Cancel</Button>
                </Col>
              </Row>
              <CardText>
                <DataTable
                  noHeader
                  data={data}
                  columns={noteTable}
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

export default Note