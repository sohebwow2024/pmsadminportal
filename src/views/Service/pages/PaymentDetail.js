import React, { useState } from 'react'
import { MoreVertical, Edit, Trash, ChevronDown } from 'react-feather'
import {
    Table, Badge, Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Modal, ModalHeader, ModalBody,
    Button
} from 'reactstrap'
import DataTable from 'react-data-table-component'

const PaymentDetail = (props) => {
    const [show, setShow] = useState(false)
    const [cardType, setCardType] = useState('')

    return (
        <>
            <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                e.preventDefault()
                setShow(!show)
            }} size='sm' >
                View Details
            </Button>

            <Modal
                isOpen={show}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
                    <p>Credit Voucher {props.id}</p>
                </ModalHeader>
                <ModalBody>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <div>
                        <Table
                        >
                            <thead>
                                <tr>
                                    <th>Paymode</th>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <td></td>
                                    <td>Paid Amount</td>
                                    <th>{props.paidAmount}</th>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td></td>
                                    <td>Refund Amount</td>
                                    <th>{props.refundAmount}</th>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td></td>
                                    <td>Total Paid Amount</td>
                                    <th>{props.totalAmount}</th>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="text-center m-50">
                        <Button className='me-1' color='primary' type='submit' onClick={(e) => {
                            e.preventDefault()
                            setShow(!show)
                        }} >
                            Close
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

        </>
    )
}

export default PaymentDetail