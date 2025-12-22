import React from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Trash2 } from 'react-feather'
import moment from 'moment'
import { Col, Row } from 'reactstrap'

const ExtraServiceTable = () => {

    const date_new = new Date()

    const data = [
        {
            date: `${moment(date_new).format('L')}`
        }
    ]

    const extraServiceColumns = [
        {
            name: '#',
            maxWidth: '50px',
            selector: row => {
                return (
                    <>
                        {row.id}
                        < Trash2 size={14} />
                    </>
                )
            }
        },
        {
            name: 'Date',
            sortable: true,
            selector: row => row.date
        },
        {
            name: 'Service Name',
            sortable: true,
            selector: row => row.name
        },
        {
            name: 'Amount',
            sortable: true,
            selector: row => row.amount
        },
        {
            name: 'Taxes',
            sortable: true,
            selector: row => row.taxes
        },
        {
            name: 'Tax',
            sortable: true,
            selector: row => row.tax
        },
        {
            name: 'Discount',
            sortable: true,
            selector: row => row.discount
        },
        {
            name: 'Discount',
            sortable: true,
            selector: row => row.referenceText
        },
        {
            name: 'Grand Total',
            sortable: true,
            selector: row => row.grandTotal
        }
    ]

    return (
        <>
            <Row className='my-1 d-flex flex-column'>
                <hr />
                <Col className='text-center p-1'>
                    <u><h3>Added Extra Service</h3></u>
                </Col>
                <Col>
                    <DataTable
                        noHeader
                        pagination
                        data={data}
                        columns={extraServiceColumns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Col>
                <Col className='fw-bolder fs-5 d-flex flex-row justify-content-between align-items-center'>
                    <h5>Total Amount:</h5>
                    <h5>₹ 0.00</h5>
                </Col>
            </Row>
        </>
    )
}

export default ExtraServiceTable