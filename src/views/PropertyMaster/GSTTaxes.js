import React,{useEffect} from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'

// const gstRulesStyles = {
//   headCells: {
//     style: {
//       fontSize: '15px',
//       fontWeight: '1000',
//       height: '50px',
//       marginLeft: '10px'
//     }
//   }
// }

const GSTTaxes = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-GST Taxes"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const gstRulesTable = [
    {
      name: 'No.',
      selector: row => row.id,
      width: '120px'
    },
    {
      name: "Tax Details",
      cell: row => (
        <>
          <ul name={row.name}>
            <li className='mt-1'>Greater than or equal  to &#8377;0 and less than or equal to &#8377;999 : GST Rate 0%</li>
            <li className='mt-1'>Greater than or equal  to &#8377;1000 and less than or equal to &#8377;7499 : GST Rate 12%</li>
            <li className='mt-1'>Greater than or equal  to &#8377;7500 : GST Rate 18%</li>
          </ul>
        </>
      ),
      width: '400px'
    },
    // {
    //   name: 'Status',
    //   cell: row => (
    //     <>
    //       <Input className='ms-4' type="checkbox" id="email" name={row.email} value="Greater" />
    //     </>
    //   ),
    //   width: '300px'
    // }
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          GST Rules
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className='my-1'>
          <Col>
            <DataTable
              noHeader
              data={[{ id: 1 }]}
              columns={gstRulesTable}
              className='react-dataTable'
            // customStyles={gstRulesStyles}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default GSTTaxes