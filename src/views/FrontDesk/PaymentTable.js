import React from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Trash2 } from 'react-feather'
import moment from 'moment'
import { Col, Row } from 'reactstrap'

const PaymentTable = () => {
    const date_new = new Date()

    const data = [
        {
            date: `${moment(date_new).format('L')}`
        }
    ]

    const paymentColumns = [
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
            name: 'Added On',
            sortable: true,
            selector: row => row.date
        },
        {
            name: 'Payment Type',
            sortable: true,
            selector: row => row.ptype
        },
        {
            name: 'Received Date',
            sortable: true,
            selector: row => row.receivedDate
        },
        {
            name: 'Payment Amount',
            sortable: true,
            selector: row => row.paymentAmount
        }
    ]

    return (
        <>
            <Row className='my-1 d-flex flex-column'>
                <hr />
                <Col className='text-center p-1'>
                    <u><h3>Payment Received</h3></u>
                </Col>
                <Col>
                    <DataTable
                        noHeader
                        pagination
                        data={data}
                        columns={paymentColumns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Col>
                <Col className='fw-bolder fs-5 d-flex flex-row justify-content-between align-items-center'>
                    <h5>Total Amount Received:</h5>
                    <h5>₹ 0.00</h5>
                </Col>
            </Row>
        </>
    )
}

export default PaymentTable