import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { ChevronDown, Edit, Trash } from 'react-feather'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, CardHeader, Badge } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const ExtraBedType = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Extra Bed Type"
    
        return () => {
          document.title = prevTitle
        }
      }, [])

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData

    const [show, setShow] = useState(false)
    const handleModal = () => setShow(!show)

    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)

    const [selected_extraBedType, setSelected_extraBedType] = useState()

    const [del, setDel] = useState(false)

    const [extraBedTypes, setExtraBedTypes] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loader, setLoader] = useState(false)

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

    // const userId = localStorage.getItem('user-id')

    const extraBedTypeList = () => {
        setLoader(true)
        const extraBedTypeBody = {
            LoginID,
            Token,
            Seckey: "abc",
            Event: 'selectall'
        }
        try {
            axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeBody)
                .then(response => {
                    setExtraBedTypes(response.data[0])
                    setLoader(false)
                })
            if (extraBedTypes === []) { setRefresh(!refresh) }
        } catch (error) {
            setLoader(false)
            console.log("ExtraBedTypeError", error.message)
        }
    }
    useEffect(() => {
        extraBedTypeList()
    }, [refresh])

    const NewExtraBedTypeModal = () => {
        const [ExtraBedType, setExtraBedType] = useState('')
        const [ExtraBedTypeDesc, setExtraBedTypeDesc] = useState('')
        const [ExtraBedCharges, setExtraBedCharges] = useState('')
        const [display, setDisplay] = useState(false)

        const addExtraBedType = () => {

            const extraBedTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'insert',
                ExtraBedType,
                ExtraBedTypeDesc,
                ExtraBedCharges
            }
            try {
                axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeBody)
                    .then((res) => {
                        // window.location.reload();
                        // extraBedTypeList()
                        setRefresh(res);
                    })
            } catch (error) {
                console.log("ExtraBedTypeError", error.message)
            }
        }

        const handleSubmit = () => {
            setDisplay(true)
            if (ExtraBedType && ExtraBedCharges !== '') {
                addExtraBedType()
                handleModal()
                toast.success('Extra Bed Type Added!', { position: "top-center" })
            }
        }

        return (
            <Modal
                isOpen={show}
                toggle={handleModal}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleModal}>
                    Add Extra Bed Type
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Form>
                            <Row className='mb-1'>
                                <Col lg='4' className='mb-md-1'>
                                    <Label for='bedType'><span className='text-danger'>*</span>Extra Bed Type</Label>
                                    <Input
                                        type='text'
                                        name='extraBedType'
                                        placeholder='Extra Bed Type name'
                                        value={ExtraBedType}
                                        onChange={e => setExtraBedType(e.target.value)}
                                        invalid={display && ExtraBedType === ''}
                                    />
                                    {display === true && !ExtraBedType ? <span className='error_msg_lbl'>Extra Bed Type Required </span> : <></>}
                                </Col>
                                <Col lg='4' className='mb-md-1'>
                                    <Label for='bedTypeDesc'>Bed Type Description</Label>
                                    <Input
                                        type='text'
                                        name='ExtraBedTypeDesc'
                                        placeholder='Enter Description'
                                        value={ExtraBedTypeDesc}
                                        onChange={e => setExtraBedTypeDesc(e.target.value)}
                                    />
                                </Col>
                                <Col lg='4'>
                                    <Label for='ExtraBedCharges'><span className='text-danger'>*</span>Extra Bed Charges</Label>
                                    <Input
                                        type='number'
                                        name='ExtraBedCharges'
                                        value={ExtraBedCharges}
                                        onChange={e => setExtraBedCharges(e.target.value)}
                                        invalid={display && ExtraBedCharges === ''}
                                    />
                                    {display === true && !ExtraBedCharges ? <span className='error_msg_lbl'>Extra Bed Charges Required </span> : <></>}
                                </Col>
                            </Row>
                            <Row tag='form' >
                                <Col className='text-lg-end text-md-center text-sm-center mt-1' lg='12'>
                                    <Button className='me-1' color='primary' onClick={handleSubmit}> CREATE EXTRA BED TYPE</Button>
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
                    </>
                </ModalBody>
            </Modal>
        )
    }

    const EditExtraBedTypeModal = ({ id }) => {
        const extraBedTypeData = extraBedTypes.filter(extraBedType => extraBedType.extraBedTypeID === id)
        console.log('extraBedTypeData', extraBedTypeData)
        const [editStatusId] = useState(extraBedTypeData[0]?.statusID)

        const [editExtraBedType, setEditExtraBedType] = useState(extraBedTypeData[0]?.extraBedType)
        const [editExtraBedTypeDesc, setEditExtraBedTypeDesc] = useState(extraBedTypeData[0]?.extraBedTypeDesc)
        const [editExtraBedCharges, setEditExtraBedCharges] = useState(extraBedTypeData[0]?.extraBedCharges)
        const [editExtraBedTypeStatus, setEditExtraBedTypeStatus] = useState(extraBedTypeData[0]?.status)
        const [editDisplay, setEditDisplay] = useState(false)

        const editExtBedType = () => {

            const extraBedTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'update',
                ExtraBedTypeID: id,
                ExtraBedType: editExtraBedType,
                ExtraBedTypeDesc: editExtraBedTypeDesc,
                Status: editExtraBedTypeStatus,
                ExtraBedCharges: editExtraBedCharges
            }
            try {
                axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeBody)
                    .then((res) => {
                        // extraBedTypeList()
                        window.location.reload();
                        setRefresh(res);
                    })
            } catch (error) {
                console.log("ExtraBedTypeError", error.message)
            }
        }
        const editHandleSubmit = () => {
            setEditDisplay(true)
            // setRefresh(!refresh)
            if (editExtraBedType && editExtraBedCharges !== '') {
                editExtBedType()
                handleEditModal()
                toast.success('Extra Bed Type Edited Succesfully!', { position: "top-center" })
            }
        }

        return (
            <Modal
                isOpen={showEdit}
                toggle={handleEditModal}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                    Edit Extra Bed Type
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Form>
                            <Row className='mb-1'>
                                <Col lg='4' className='mb-md-1'>
                                    <Label for='bedType'><span className='text-danger'>*</span>Extra Bed Type</Label>
                                    <Input
                                        type='text'
                                        name='bedType'
                                        placeholder='Bed Type name'
                                        value={editExtraBedType}
                                        onChange={e => setEditExtraBedType(e.target.value)}
                                        invalid={editDisplay && editExtraBedType === ''}
                                    />
                                    {editDisplay === true && !editExtraBedType ? <span className='error_msg_lbl'>Extra Bed Type Required </span> : <></>}
                                </Col>
                                <Col lg='4' className='mb-md-1'>
                                    <Label for='bedTypeDesc'>Bed Type Description</Label>
                                    <Input
                                        type='text'
                                        name='bedTypeDesc'
                                        placeholder='Enter Description'
                                        value={editExtraBedTypeDesc}
                                        onChange={e => setEditExtraBedTypeDesc(e.target.value)}
                                    />
                                </Col>
                                <Col lg='4'>
                                    <Label for='ExtraBedCharges'><span className='text-danger'>*</span>Extra Bed Charges</Label>
                                    <Input
                                        type='number'
                                        name='ExtraBedCharges'
                                        value={editExtraBedCharges}
                                        onChange={e => setEditExtraBedCharges(e.target.value)}
                                        invalid={editDisplay && editExtraBedCharges === ''}
                                    />
                                    {editDisplay === true && !editExtraBedCharges ? <span className='error_msg_lbl'>Extra Bed Charges Required </span> : <></>}
                                </Col>
                            </Row>
                            <Row tag='form' >
                                <Col lg='6'>
                                    <Label className='form-label'>Extra Bed Status</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select w-100'
                                        classNamePrefix='select'
                                        placeholder='Select Room status'
                                        options={statusOptions}
                                        value={statusOptions?.filter(c => c.value === editExtraBedTypeStatus)}
                                        onChange={e => setEditExtraBedTypeStatus(e.value)}
                                    />
                                    {editDisplay && editExtraBedTypeStatus === '' && <span className='text-danger'>Extra Bed Status is required</span>}
                                </Col>
                                <Col className='d-flex flex-row align-items-end justify-content-lg-end justify-content-center mt-1' lg='6'>
                                    <Button className='me-1' color='primary' onClick={editHandleSubmit}> Submit </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={handleEditModal}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                </ModalBody>
            </Modal>
        )

    }

    const DeleteExtraBedTypeModal = ({ id }) => {

        const deleteExtraBedType = () => {

            const extraBedTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'delete',
                ExtraBedTypeID: id
            }
            try {
                axios.post(`/getdata/bookingdata/extrabedtype`, extraBedTypeBody)
                    .then((res) => {
                        // extraBedTypeList()
                        // window.location.reload();
                        setRefresh(res);
                    })
            } catch (error) {
                console.log("ExtraBedTypeError", error.message)
            }
        }
        const handleDeleteExtraBedType = () => {
            deleteExtraBedType()
            // setRefresh(!refresh)
            setDel(!del)
        }

        return (
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
                            <Button color='danger' className='m-1' onClick={handleDeleteExtraBedType}>
                                Delete
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.extraBedTypeID.toLowerCase().includes(query.toLowerCase()) ||
            item.extraBedType.toLowerCase().includes(query.toLowerCase()) 
            // item.ExtraBedCharges.toLowerCase().includes(query.toLowerCase())
        )
    }


    const extraBedTypeTable = [
        {
            name: 'ID',
            sortable: true,
            selector: row => row.extraBedTypeID
        },
        {
            name: 'Extra Bed Type',
            sortable: true,
            selector: row => row.extraBedType
        },
        {
            name: 'Description',
            selector: row => row.extraBedTypeDesc
        },
        {
            name: 'Extra Bed Charges',
            selector: row => row.extraBedCharges
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => row.status,
            cell: row => {
                return (
                    <>
                        {
                            row.Status === 'Active' ? (
                                <Badge color='light-success'> {row.status}</Badge>
                            ) : (
                                <Badge color='light-danger'> {row.status}</Badge>
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
            selector: row => (
                <>
                    <Col>
                        <Edit className='me-50 pe-auto' onClick={() => {
                            setShowEdit(true)
                            setSelected_extraBedType(row.extraBedTypeID)
                        }} size={15} />
                        <Trash className='me-50' size={15} onClick={() => {
                            setDel(true)
                            setSelected_extraBedType(row.extraBedTypeID)
                        }} />
                    </Col>

                </>
            )
        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Extra Bed Type
                    </CardTitle>
                    <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                    <Button color='primary' onClick={handleModal}>Add Extra Bed Type</Button>
                </CardHeader>
                <CardBody>
                    <Row className='my-1'>
                        <Col>
                            <DataTable
                                noHeader
                                data={search(extraBedTypes)}
                                columns={extraBedTypeTable}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                pagination
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                progressPending={loader}
                            />
                        </Col>
                    </Row>
                    <div>
                        <Button className='me-2' color='primary' onClick={extraBedTypeList}>Reload</Button>
                    </div>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md='12'>
                    <Card>
                        <CardBody>
                            <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                                <h2>Extra Bed Type</h2>
                                <Button color='primary' onClick={handleModal}>Add Extra Bed Type</Button>
                            </CardTitle>
                            <CardText>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col className='react-dataTable'>
                                                <DataTable
                                                    noHeader
                                                    data={extraBedTypes}
                                                    columns={extraBedTypeTable}
                                                    className='react-dataTable'
                                                    pagination
                                                    progressPending={loader}
                                                />
                                            </Col>
                                        </Row>
                                        <div>
                                            <Button className='me-2' color='primary' onClick={extraBedTypeList}>Reload</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
            {show ? <NewExtraBedTypeModal /> : <></>}
            {showEdit ? <EditExtraBedTypeModal id={selected_extraBedType} /> : <></>}
            {del ? <DeleteExtraBedTypeModal id={selected_extraBedType} /> : <></>}
            {
                show | showEdit | del ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )

}

export default ExtraBedType