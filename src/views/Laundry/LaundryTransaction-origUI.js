import React, { useState } from 'react'
import { ChevronLeft, Plus, ChevronDown, Trash2 } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import GuestDetailForm from './GuestDetailForm'

const roomOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card/POS' },
    { value: 'online', label: 'Online' },
    { value: 'checkout', label: 'Pay at Checkout' }
]

const LaundryTransaction = () => {
    const [paymentOption, setPaymnetOption] = useState('')
    const laundryData = [
        { id: 1, cloth_name: 'shirt', amount: 500, service: true },
        { id: 2, cloth_name: 'shirt', amount: 500, service: false },
        { id: 3, cloth_name: 'shirt', amount: 500, service: true }
    ]
    const navigate = useNavigate()

    const [active, setActive] = useState('1')

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const laundryColumns = [
        {
            name: 'Cloth',
            sortable: true,
            selector: row => row.cloth_name
        },
        {
            name: 'Services',
            minWidth: 200,
            sortable: true,
            selector: (row) => {
                return (
                    <>
                        <ServicesChange id={row.id} />
                    </>
                )
            }
        },
        {
            name: 'Amount',
            minWidth: 200,
            sortable: true,
            selector: row => row.amount
        },
        {
            name: 'Action',
            sortable: true,
            selector: (row) => {
                return (
                    <Button key={row.id} color='primary' size='sm' onClick={(e) => e.preventDefault()}>+</Button>
                )
            }
        }
    ]
    const laundryAddColumns = [
        {
            name: 'Cloth',
            sortable: true,
            selector: row => row.cloth_name
        },
        {
            name: 'Services',
            minWidth: 200,
            sortable: true,
            selector: (row) => {
                return (
                    <>
                        <ServicesChange id={row.id} />
                    </>
                )
            }
        },
        {
            name: 'Amount',
            minWidth: 200,
            sortable: true,
            selector: row => row.amount
        },
        {
            name: 'Action',
            sortable: true,
            selector: (row) => {
                return (
                    <Button key={row.id} color='primary' size='sm' onClick={(e) => e.preventDefault()}><Trash2 size={15} /></Button>
                )
            }
        }
    ]

    const ServicesChange = ({ id }) => {
        const data = laundryData.filter(user => user.id === id)
        const [service, setService] = useState(data[0]?.service)

        const updateLaundry = (e) => {
            setService(e.target.value)
            if (service !== '') {
                laundryData.map(obj => {
                    if (obj.id === id) {
                        obj.service = service
                    }
                })
            }
        }

        return (
            <>
                <div className='d-flex'>
                    <div className='form-check form-check-success'>
                        <Input key={id} type='radio' id='success-checkbox' value='washing' checked={service === 'washing'} onChange={updateLaundry} />
                    </div>
                    <div className='form-check form-check-warning'>
                        <Input type='radio' id='warning-checkbox' value='pressing' checked={service === 'pressing'} onChange={updateLaundry} />
                    </div>
                    <div className='form-check form-check-info'>
                        <Input type='radio' id='info-checkbox' value='dry cleaning' checked={service === 'dry cleaning'} onChange={updateLaundry} />
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Button className='mb-1' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button>
            <Row>
                <Col md={5}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Laundry List</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mb-1'>
                                <Col sm={4} lg={4}><Badge color='success'>Washing</Badge></Col>
                                <Col sm={4} lg={4}><Badge color='warning'>Pressing</Badge></Col>
                                <Col sm={4} lg={4}><Badge color='info'>Dry Cleaning</Badge></Col>
                            </Row>
                            <Row className='mb-1'>
                                <Col>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink active={active === '1'} onClick={() => toggle('1')}>
                                                All
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink active={active === '2'} onClick={() => toggle('2')}>
                                                Male
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink active={active === '3'} onClick={() => toggle('3')}>
                                                Female
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={active}>
                                        <TabPane tabId='1'>
                                            <DataTable
                                                noHeader
                                                data={laundryData}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                        <TabPane tabId='2'>
                                            <DataTable
                                                noHeader
                                                data={laundryData}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                        <TabPane tabId='3'>
                                            <DataTable
                                                noHeader
                                                data={laundryData}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mb-1 d-flex flex-column'>
                                <Col className='mb-1'>
                                    <DataTable
                                        noHeader
                                        data={laundryData}
                                        columns={laundryAddColumns}
                                        className='react-dataTable'
                                        sortIcon={<ChevronDown size={10} />}
                                    />
                                </Col>
                                <Col>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Total</Col>
                                                <Col className='text-end'>150</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>SGST @2.5%</Col>
                                                <Col className='text-end'>0</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>CGST @2.5%</Col>
                                                <Col className='text-end'>0</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Total (Incl All Taxes)</Col>
                                                <Col className='text-end'>₹ 150</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Rounding Off</Col>
                                                <Col className='text-end'>0</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Discount</Col>
                                                <Col className='text-end'>150</Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Total Due</Col>
                                                <Col className='text-end'>₹ 150</Col>
                                            </Row>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row className='mb-1'>
                                <Col>
                                    <Label className='fw-bold fs-5'>Payment Type</Label>
                                    <Select
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={roomOptions}
                                        onChange={e => setPaymnetOption(e.value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='mb-1'>
                                {
                                    paymentOption && <GuestDetailForm inResto={true} option={paymentOption} guest={'selectedGuest'} />
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default LaundryTransaction