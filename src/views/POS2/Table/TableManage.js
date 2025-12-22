import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronLeft, Edit, Trash2 } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'

const statusOptions = [
    { value: 'Active', label: 'ACTIVE' },
    { value: 'Inactive', label: 'INACTIVE' }
]

const TableManage = () => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const navigate = useNavigate()
    const { name, id } = useParams()

    const [tdata, setTdata] = useState([])
    const [submit, setSubmit] = useState(false)
    const [tname, setTname] = useState('')
    const [tdesc, setTdesc] = useState('')
    const [sel_id, setSel_id] = useState()

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)

    const [delOpen, setDelOpen] = useState(false)
    const handleDeleteModal = () => setDelOpen(!delOpen)

    const getTableData = async () => {
        try {
            const res = await axios.get('/pos_table/all', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('resData', res)
            setTdata(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getTableData()
    }, [submit, open, delOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmit(true)
        if (tname !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Seckey:"abc",
                    POSTableName: tname,
                    Description: tdesc,
                    PoSID: id,
                    Seckey: "abc"
                }
                const res = await axios.post('/pos_table', obj)
                console.log('res', res)
                if (res?.data[0][0].status === "Success") {
                    setTname('')
                    setTdesc('')
                    setSubmit(false)
                } else {
                    toast.error("Something went wrong, Try again!")
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }

        } else {
            toast.error("Fill all fields")
        }
    }

    const UpdateTable = ({ id }) => {

        const data = tdata.filter(table => table.posTableID === id)

        const [newName, setNewName] = useState(data[0]?.posTableName)
        const [newDesc, setNewDesc] = useState(data[0]?.description)
        const [newStatus, setNewStatus] = useState(data[0]?.status)
        const [editSubmit, setEditSubmit] = useState(false)

        const updateData = async (e) => {
            e.preventDefault()
            setEditSubmit(true)
            if (newName !== '') {
                try {
                    let obj = {
                        LoginID,
                        Token,
                        POSTableName: newName,
                        Description: newDesc,
                        Seckey: "abc"
                    }
                    const res = await axios.post('/pos_table/update', obj, {
                        params: {
                            id: data[0].posTableID
                        }
                    })
                    console.log('res', res)
                    if (res?.data[0][0].status === "Success") {
                        setEditSubmit(false)
                        toast.success('Table Info updated!')
                        handleOpen()
                    }
                } catch (error) {
                    console.log('error', error)
                    toast.error("Something went wrong, Try again!")
                }
            }
        }

        return (
            <>
                <Modal isOpen={open} toggle={handleOpen} backdrop={false} className='modal-dialog-centered'>
                    <ModalHeader toggle={handleOpen}>
                        Update Table Info
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={e => updateData(e)}>
                            <Row className='mb-1'>
                                <Col>
                                    <Label className='fw-bold fs-5'>Table Name<span className='text-danger'>*</span></Label>
                                    <Input
                                        type='text'
                                        name='table name'
                                        placeholder='Table name'
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        invalid={editSubmit && newName === ''}
                                    />
                                    {editSubmit && newName === '' && <FormFeedback>Table Name is required</FormFeedback>}
                                </Col>
                                <Col>
                                    <Label className='fw-bold fs-5'>Description</Label>
                                    <Input
                                        type='text'
                                        name='description'
                                        placeholder='Enter Description'
                                        value={newDesc}
                                        onChange={e => setNewDesc(e.target.value)}
                                    />
                                </Col>
                                {/* <Col>
                                    <Label className='fw-bold fs-5'>Select Status</Label>
                                    <Select
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={statusOptions}
                                        value={statusOptions.filter(c => c.value === newStatus)}
                                        onChange={e => setNewStatus(e.value)}
                                    />
                                </Col> */}
                            </Row>
                            <Row>
                                <Col className='text-center'>
                                    <Button color='primary' type='submit'>Update TABLE</Button>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
                {
                    open ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const DeleteModal = ({ id }) => {

        const data = tdata.filter(table => table.pOSTableID === id)
        console.log('delData', data)

        const handleDelete = async () => {
            try {
                const res = await axios.post(`/pos_table/delete/${id}`, {}, {
                    params: {
                        LoginID,
                        Token
                    }
                })
                console.log('res', res)
                if (res?.data[0][0].status === "Success") {
                    handleDeleteModal()
                    toast.success('Table Deleted!')
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }
        }

        return (
            <>
                <Modal isOpen={delOpen} toggle={handleDeleteModal} backdrop={false} className='modal-dialog-centered'>
                    <ModalHeader toggle={handleDeleteModal}>Delete {data[0]?.pOSTableName}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col className='text-center'>
                                <h5>Are you sure you want to delete Table - {data[0]?.pOSTableName}?</h5>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Col className='text-center'>
                            <Button className='mx-1' color='danger' onClick={handleDelete}>Delete</Button>
                            <Button className='mx-1' color='primary' outline onClick={handleDeleteModal}>Cancel</Button>
                        </Col>
                    </ModalFooter>
                </Modal>
                {
                    delOpen ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const tableColumns = [
        {
            name: 'Table Name',
            sortable: true,
            selector: row => row.posTableName
        },
        {
            name: 'Description',
            sortable: true,
            selector: row => row.description
        },
        {
            name: 'POS Point',
            sortable: true,
            selector: row => {
                return (
                    <Col>{name}</Col>
                )
            }
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => {
                return (
                    <>
                        {
                            row.status === "Active" ? (
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
            name: 'Actions',
            sortable: true,
            center: true,
            selector: row => {
                return (
                    <>
                        <Col>
                            <Edit className='me-1 cursor-pointer' size={20} onClick={() => {
                                handleOpen()
                                setSel_id(row.posTableID)
                            }} />
                            <Trash2 className='ms-1 cursor-pointer' size={20} onClick={() => {
                                handleDeleteModal()
                                setSel_id(row.posTableID)
                            }} />
                        </Col>
                    </>
                )
            }
        }
    ]


    return (
        <>
            <div className='d-flex'>
                <Button className='mb-1 ' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button>
                <span className='fs-3 mx-auto'>{name} - POS Manage Tables</span>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Add POS Table for {name}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={e => handleSubmit(e)}>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Table Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='table name'
                                    placeholder='Table name'
                                    value={tname}
                                    onChange={e => setTname(e.target.value)}
                                    invalid={submit && tname === ''}
                                />
                                {submit && tname === '' && <FormFeedback>Table Name is required</FormFeedback>}
                            </Col>
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='text'
                                    name='description'
                                    placeholder='Enter Description'
                                    value={tdesc}
                                    onChange={e => setTdesc(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <Button color='primary' type='submit'>CREATE TABLE</Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>POS Table added for {name}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col className='react-dataTable'>
                            <DataTable
                                noHeader
                                pagination
                                data={tdata}
                                columns={tableColumns}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {open && <UpdateTable open={open} handleOpen={handleOpen} id={sel_id} />}
            {delOpen && <DeleteModal open={delOpen} handleOpen={handleDeleteModal} id={sel_id} />}
        </>
    )
}

export default TableManage