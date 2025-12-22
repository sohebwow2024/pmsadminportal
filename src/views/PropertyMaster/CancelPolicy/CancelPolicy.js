import { React, useState } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Input, Row, Col, Modal, ModalHeader, ModalBody, Label, Badge, InputGroup, Form, CardHeader } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'

// let data
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })

const statusOptions = [
    { value: true, label: 'ACTIVE' },
    { value: false, label: 'INACTIVE' }
]

const CancelPolicy = () => {

    const [show, setShow] = useState(false)
    const handleModal = () => setShow(!show)

    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)

    const [selected_cancelpolicy, setSelected_cancelpolicy] = useState()

    const [del, setDel] = useState(false)

    const [cancelPolicies, setCancelPolicies] = useState([
        {
            id: "1",
            from: "2022-10-20",
            to: "2022-10-27",
            type: "Room Level",
            cancellationCharges: "1000",
            cancellationAfterCheckIn: "Flat Amount",
            cancellationAfterCheckInAmount: "3000",
            status: true
        }
    ])

    const NewCancelPolicyModel = () => {
        const [from, setFrom] = useState('')
        const [to, setTo] = useState('')
        const [type, setType] = useState('')
        const [cancellationCharges, setCancellationCharges] = useState('')
        const [cancellationAfterCheckIn, setCancellationAfterCheckIn] = useState('')
        const [cancellationAfterCheckInAmount, setCancellationAfterCheckInAmount] = useState('')

        const [display, setDisplay] = useState(false)

        const Type = (e) => {
            setType(e.target.value)
        }

        const cancelPolicyObj = {
            id: Math.floor(Math.random() * 100),
            from,
            to,
            type,
            cancellationCharges,
            cancellationAfterCheckIn,
            cancellationAfterCheckInAmount,
            status: true
        }

        const handleSubmit = () => {
            setDisplay(true)
            if (from && to && type && cancellationCharges && cancellationAfterCheckIn && cancellationAfterCheckInAmount !== '') {
                setCancelPolicies([...cancelPolicies, cancelPolicyObj])
                handleModal()
                toast.success('Cancel Policy Added!', { position: "top-center" })
            }
            // else {
            //     toast.error('Fill All Fields!', {
            //         position: "top-center",
            //         style: {
            //             minWidth: '250px'
            //         },
            //         duration: 3000
            //     })
            // }
        }

        return (
            <>
                <Modal
                    isOpen={show}
                    toggle={handleModal}
                    className='modal-dialog-centered modal-lg'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={handleModal}>
                        Add New Policy
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <Form>
                            <Row>
                                <h4>Date Range</h4>
                                <Col lg='6' className='mb-2'>
                                    <Label className='form-label' for='from'>
                                        <span className='text-danger'>*</span>From
                                    </Label>
                                    <Input type='date' name='from' id='from' value={from} onChange={e => setFrom(e.target.value)} />
                                    {display && !from ? <span className='error_msg_lbl'>Enter From </span> : null}
                                </Col>
                                <Col lg='6' className='mb-2'>
                                    <Label className='form-label' for='to'>
                                        <span className='text-danger'>*</span>To
                                    </Label>
                                    <Input type='date' name='to' id='to' value={to} onChange={e => setTo(e.target.value)} />
                                    {display && !to ? <span className='error_msg_lbl'>Enter To </span> : null}
                                </Col>
                                <Col lg='6' className='mb-2'>
                                    <Label className='form-label' for='type'>
                                        <span className='text-danger'>*</span>Type
                                    </Label>
                                    <div className='form-check'>
                                        <Input type='radio' name='type' id='hotelLevel' value="Hotel Level" checked={type === "Hotel Level"} onChange={(e) => {
                                            Type(e)
                                        }} />
                                        <Label className='form-check-label' for='hotelLevel'>
                                            Hotel Level
                                        </Label>
                                        <br />
                                        <Input type='radio' className='mt-1' name='type' id='roomLevel' value="Room Level" checked={type === "Room Level"} onChange={(e) => {
                                            Type(e)
                                        }} />
                                        <Label className='form-check-label mt-1' for='roomLevel' >
                                            Room Level
                                        </Label>
                                    </div>
                                    {display && !type ? <span className='error_msg_lbl'>Please select something </span> : null}
                                </Col>
                                <Col lg='6' className='mb-2'>
                                    <Label className='form-label' for='cancellationCharges'>
                                        <span className='text-danger'>*</span>Cancellation Charges
                                    </Label>
                                    <Input type='text' name='cancellationCharges' id='cancellationCharges' placeholder='Free Cancelltion upto no of days' value={cancellationCharges} onChange={e => setCancellationCharges(e.target.value)} invalid={display && cancellationCharges === ''} />
                                    {display && !cancellationCharges ? <span className='error_msg_lbl'>Enter Cancellation Charges </span> : null}
                                </Col>
                                <Col lg='6' className='mb-2'>
                                    <Label className='form-label' for='cancellationAfterCheckIn'>
                                        <span className='text-danger'>*</span>Cancellation After Checkin Date
                                    </Label>
                                    <div className='form-check'>
                                        <Input type='radio' name='cancellationAfterCheckIn' id='flatAmt' value="Flat Amount" checked={cancellationAfterCheckIn === "Flat Amount"} onChange={e => setCancellationAfterCheckIn(e.target.value)} />
                                        <Label className='form-check-label' for='flatAmt'>
                                            Flat Amount
                                        </Label>
                                        <br />
                                        <Input type='radio' className='mt-1' name='cancellationAfterCheckIn' id='percentage' value="Percentage" checked={cancellationAfterCheckIn === "Percentage"} onChange={e => setCancellationAfterCheckIn(e.target.value)} />
                                        <Label className='form-check-label mt-1' for='percentage' >
                                            Percentage
                                        </Label>
                                    </div>
                                    {display && !cancellationAfterCheckIn ? <span className='error_msg_lbl mb-2'>Please select something </span> : null}
                                    <Input type='text' className='mt-1' placeholder='Amount' name='cancellationAfterCheckInAmount' id='cancellationAfterCheckInAmount' value={cancellationAfterCheckInAmount} onChange={e => setCancellationAfterCheckInAmount(e.target.value)} invalid={display && cancellationAfterCheckInAmount === ''} />
                                    {display && !cancellationAfterCheckInAmount ? <span className='error_msg_lbl'>Enter Amount </span> : null}
                                </Col>
                            </Row>
                            <Row className='gy-1 gx-2 mt-75' >
                                <Col className='text-center mt-1' xs={12}>
                                    <Button className='me-1' color='primary' onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={() => {
                                            setShow(!show)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
                {
                    show ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const EditCancelPolicyModal = ({ id }) => {
        const cancelPolicyData = cancelPolicies.filter(cancelPolicy => cancelPolicy.id === id)

        const [editFrom, setEditFrom] = useState(cancelPolicyData[0]?.from)
        const [editTo, setEditTo] = useState(cancelPolicyData[0]?.to)
        const [editType, setEditType] = useState(cancelPolicyData[0]?.type)
        const [editCancellationCharges, setEditCancellationCharges] = useState(cancelPolicyData[0]?.cancellationCharges)
        const [editCancellationAfterCheckIn, setEditCancellationAfterCheckIn] = useState(cancelPolicyData[0]?.cancellationAfterCheckIn)
        const [editCancellationAfterCheckInAmount, setEditCancellationAfterCheckInAmount] = useState(cancelPolicyData[0]?.cancellationAfterCheckInAmount)
        const [newStatus, setNewStatus] = useState(cancelPolicyData[0]?.status)

        const [editDisplay, setEditDisplay] = useState(false)

        const EditType = (e) => {
            setEditType(e.target.value)
        }

        const editHandleSubmit = () => {
            setEditDisplay(true)
            if (editFrom && editTo && editType && editCancellationCharges !== '') {
                cancelPolicies.map(cancelPolicy => {
                    if (cancelPolicy.id === id) {
                        cancelPolicy.from = editFrom
                        cancelPolicy.to = editTo
                        cancelPolicy.type = editType
                        cancelPolicy.cancellationCharges = editCancellationCharges
                        cancelPolicy.cancellationAfterCheckIn = editCancellationAfterCheckIn
                        cancelPolicy.cancellationAfterCheckInAmount = editCancellationAfterCheckInAmount
                        if (newStatus === true) {
                            cancelPolicy.status = true
                        } else {
                            cancelPolicy.status = false
                        }
                    }
                })
                handleEditModal()
                toast.success('Cancel Policy Edited Succesfully!', { position: "top-center" })
            }
            // else {
            //     toast.error('Fill All Fields!', {
            //         position: "top-center",
            //         style: {
            //             minWidth: '250px'
            //         },
            //         duration: 3000
            //     })
            // }
        }

        return (
            <>
                <Modal
                    isOpen={showEdit}
                    toggle={handleEditModal}
                    className='modal-dialog-centered modal-lg'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                        Edit New Policy
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <Row>
                            <h4>Date Range</h4>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='from'>
                                    <span className='text-danger'>*</span>From
                                </Label>
                                <Input type='date' name='from' id='from' value={editFrom} onChange={e => setEditFrom(e.target.value)} invalid={editDisplay && editFrom === ''} />
                                {editDisplay && !editFrom ? <span className='error_msg_lbl'>Enter From </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='to'>
                                    <span className='text-danger'>*</span>To
                                </Label>
                                <Input type='date' name='to' id='to' value={editTo} onChange={e => setEditTo(e.target.value)} invalid={editDisplay && editTo === ''} />
                                {editDisplay && !editTo ? <span className='error_msg_lbl'>Enter To </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='type'>
                                    <span className='text-danger'>*</span>Type
                                </Label>
                                <div className='form-check'>
                                    <Input type='radio' name='type' id='hotelLevel' value="Hotel Level" checked={editType === "Hotel Level"} onChange={(e) => {
                                        EditType(e)
                                    }} />
                                    <Label className='form-check-label' for='hotelLevel'>
                                        Hotel Level
                                    </Label>
                                    <br />
                                    <Input type='radio' className='mt-1' name='type' id='roomLevel' value="Room Level" checked={editType === "Room Level"} onChange={(e) => {
                                        EditType(e)
                                    }} />
                                    <Label className='form-check-label mt-1' for='roomLevel' >
                                        Room Level
                                    </Label>
                                </div>
                                {editDisplay && !editType ? <span className='error_msg_lbl'>Please select something </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='cancellationCharges'>
                                    <span className='text-danger'>*</span>Cancellation Charges
                                </Label>
                                <Input type='text' name='cancellationCharges' id='cancellationCharges' placeholder='Free Cancelltion upto no of days' value={editCancellationCharges} onChange={e => setEditCancellationCharges(e.target.value)} invalid={editDisplay && editCancellationCharges === ''} />
                                {editDisplay && !editCancellationCharges ? <span className='error_msg_lbl'>Enter Cancellation Charges </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='cancellationAfterCheckIn'>
                                    <span className='text-danger'>*</span>Cancellation After Checkin Date
                                </Label>
                                <div className='form-check'>
                                    <Input type='radio' name='cancellationAfterCheckIn' id='flatAmt' value="Flat Amount" checked={editCancellationAfterCheckIn === "Flat Amount"} onChange={e => setEditCancellationAfterCheckIn(e.target.value)} />
                                    <Label className='form-check-label' for='flatAmt'>
                                        Flat Amount
                                    </Label>
                                    <br />
                                    <Input type='radio' className='mt-1' name='cancellationAfterCheckIn' id='percentage' value="Percentage" checked={editCancellationAfterCheckIn === "Percentage"} onChange={e => setEditCancellationAfterCheckIn(e.target.value)} />
                                    <Label className='form-check-label mt-1' for='percentage' >
                                        Percentage
                                    </Label>
                                </div>
                                <Input type='text' className='mt-1' placeholder='Amount' name='cancellationAfterCheckInAmount' id='cancellationAfterCheckInAmount' value={editCancellationAfterCheckInAmount} onChange={e => setEditCancellationAfterCheckInAmount(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label'>Select Status</Label>
                                <Select
                                    placeholder=''
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={statusOptions}
                                    onChange={e => setNewStatus(e.value)}
                                />
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-center mt-1' xs={12}>
                                <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                                    Submit
                                </Button>
                                <Button
                                    color='secondary'
                                    outline
                                    onClick={handleEditModal}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
                {
                    showEdit ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const DeleteCancelPolicyModal = ({ id }) => {

        const handleDeleteCancelPolicy = () => {
            setCancelPolicies(cancelPolicies.filter(cancelPolicies => cancelPolicies.id !== id))
            setDel(!del)
        }

        return (
            <>
                <Modal
                    isOpen={del}
                    toggle={() => setDel(!del)}
                    className='modal-dialog-centered'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
                        Are you sure to delete this permanently?
                    </ModalHeader>
                    <ModalBody>
                        <Row className='text-center'>
                            <Col xs={12}>
                                <Button color='danger' className='m-1' onClick={handleDeleteCancelPolicy}>
                                    Delete
                                </Button>
                                <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
                {
                    del ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const roomAvailabilityTable = [
        {
            name: 'ID',
            width: '120px',
            sortable: true,
            selector: row => row.id
        },
        {
            name: "From Date",
            sortable: true,
            selector: row => row.from
        },
        {
            name: 'To Date',
            sortable: true,
            selector: row => row.to
        },
        {
            name: 'Type',
            sortable: true,
            selector: row => row.type
        },
        {
            name: 'Cancellation Charges',
            sortable: true,
            selector: row => row.cancellationCharges
        },
        {
            name: 'Cancellation After Check-in Date',
            selector: row => row.cancellationAfterCheckIn
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => {
                return (
                    <>
                        {
                            row.status ? (
                                <Badge color='light-success'>
                                    ACTIVE
                                </Badge>
                            ) : (
                                <Badge color='light-danger'>
                                    INACTIVE
                                </Badge>
                            )
                        }
                    </>
                )
            }
        },
        {
            name: 'Action',
            sortable: true,
            center: true,
            selector: row => (
                console.log(row),
                <>
                    <Col>
                        <Edit className='me-50 pe-auto' onClick={() => {
                            setShowEdit(true)
                            setSelected_cancelpolicy(row.id)
                        }} size={15} />
                        <Trash className='me-50' size={15} onClick={() => {
                            setDel(true)
                            setSelected_cancelpolicy(row.id)
                        }} />
                    </Col>
                    <EditCancelPolicyModal id={selected_cancelpolicy} />
                    <DeleteCancelPolicyModal id={selected_cancelpolicy} />
                </>
            )

        }
    ]
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Cancel Policy
                    </CardTitle>
                    <Button color='primary' onClick={() => setShow(true)}>Add New Cancel Policy</Button>
                </CardHeader>
                <CardBody>
                    <Row className='my-1'>
                        <Col>
                            <DataTable
                                noHeader
                                data={cancelPolicies}
                                columns={roomAvailabilityTable}
                                className='react-dataTable'
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardBody>
                            <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                                <h2>Cancel Policy</h2>
                                <Button color='primary' onClick={() => setShow(true)}>Add New Cancel Policy</Button>
                            </CardTitle>
                            <CardText>
                                <DataTable
                                    noHeader
                                    data={cancelPolicies}
                                    columns={roomAvailabilityTable}
                                    className='react-dataTable'
                                />
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
            <NewCancelPolicyModel />
            {/* <EditCancelPolicyModal /> */}
            <DeleteCancelPolicyModal />
        </>
    )
}

export default CancelPolicy