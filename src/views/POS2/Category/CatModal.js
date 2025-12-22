import { useState, useEffect } from "react"
import axios from "../../../API/axios"
import DataTable from 'react-data-table-component'
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { Badge, Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { ChevronDown, Edit, Trash2 } from "react-feather"
import EditCat from "./EditCat"

const CatModal = ({ open, handleCatOpen, id }) => {
console.log("CatModalId==>",id)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [del, setDel] = useState(false)
    const [posId, setPosId] = useState('')
    const [catdata, setCatData] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const getPosCatData = async () => {
        try {
            const res = await axios.get(`/pos_category/all?LoginID=${LoginID}&Token=${Token}&PoSID=${id}`, {
            })
            console.log("getPosCatData",res)
            setCatData(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getPosCatData()
    }, [open, del])

    const onDeleteItem = async () => {
        console.log(posId)
        try {
            const res = await axios.post(`/pos_category/delete/${posId}?LoginID=${LoginID}&Token=${Token}`, {
            })
            toast.success(res.data[0][0].message, { position: 'top-right' })
            setDel(!del)
            getPosCatData()
        } catch (error) {
            setDel(!del)
            toast.error(error.response.data.message, { position: 'top-right' })
            console.log(error)
        }

    }

    const catColumns = [
        {
            name: '#',
            selector: row => row.productCategoryID
        },
        {
            name: 'Category Name',
            selector: row => row.productCategoryName
        },
        {
            name: 'Description',
            selector: row => row.description
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
            name: 'Action',
            right: true,
            selector: row => {
                return (
                    <>
                        <Row>
                            <Col>
                                <Edit className='me-50 pe-auto' onClick={() => { setPosId(row.productCategoryID), setShowEdit(true) }} size={15} />
                                <Trash2 size={20} onClick={() => { setPosId(row.productCategoryID), row.status === 'Active' ? setDel(true) : '' }} />
                            </Col>
                        </Row>
                    </>
                )
            }
        }
    ]
    const [cat_name, setCat_name] = useState('')
    const [cat_descp, setCat_descp] = useState('')
    const onSubmitCategory = () => {
        if (cat_name) {
            axios.post("/pos_category", {
                LoginID,
                Token,
                Seckey:"abc",
                ProductCategoryName: cat_name,
                Description: cat_descp,
                PoSID: id
            }).then(res => {
                if (res != null) {
                    toast.success(res.data[0][0].message, { position: 'top-right' })
                    getPosCatData()
                    setCat_name('')
                    setCat_descp('')
                }
            })
        } else {
            toast.error("Please Add Category Name", { position: 'top-center' })
        }

    }
    useEffect(() => {
        getPosCatData()
    }, [])

    return (
        <>
            <Modal isOpen={open} toggle={handleCatOpen} className='modal-dialog-centerd modal-lg' backdrop={false}>
                <ModalHeader toggle={handleCatOpen}>Categories</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter category name'
                                    value={cat_name}
                                    onChange={e => setCat_name(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='text'
                                    name='descp'
                                    placeholder='Enter description'
                                    value={cat_descp}
                                    onChange={e => setCat_descp(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <Button color='primary' onClick={e => onSubmitCategory()}>Add Category</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col className='react-dataTable'>
                            <DataTable
                                noHeader
                                pagination
                                data={catdata}
                                columns={catColumns}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }

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
                            <Button color='danger' className='m-1' onClick={onDeleteItem}>
                                Delete
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <EditCat showEdit={showEdit} setShowEdit={setShowEdit} posId={posId} getPosCatData={getPosCatData} />
        </>
    )
}


export default CatModal