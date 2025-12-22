import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft, Edit, PlusCircle, Trash2 } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import CatModal from '../Category/CatModal'
import ProductList from '../Menu/ProductList'
import NewProductModal from './NewProductModal'
import EditProductModal from './EditProductModal'
import DeleteProductModal from './DeleteProductModal'

const PosProducts = () => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const navigate = useNavigate()

    const { name, id } = useParams()

    const [prData, setPrData] = useState([])
    console.log('prDataTable', prData)
    const [selPr, setSelPr] = useState([])

    const [catOpen, setCatOpen] = useState(false)
    const handleCatOpen = () => setCatOpen(!catOpen)

    const [prOpen, setPrOpen] = useState(false)
    const handlePrOpen = () => setPrOpen(!prOpen)

    const [updatePr, setUpdatePr] = useState(false)
    const handleUpdatePr = () => setUpdatePr(!updatePr)

    const [delPr, setDelPr] = useState(false)
    const handleDelPr = () => setDelPr(!delPr)

    const [listOpen, setListOpen] = useState(false)
    const handleListOpen = () => setListOpen(!listOpen)

    const getProductData = async () => {
        try {
            const res = await axios.get('/pos_product', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('Productres', res)
            setPrData(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getProductData()
    }, [catOpen, prOpen, updatePr, delPr])

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.posProductID.toLowerCase().includes(query.toLowerCase()) ||
            item.posProductName.toLowerCase().includes(query.toLowerCase())
            // item.ProductCategoryName.toLowerCase().includes(query.toLowerCase())
            // item.Price.toLowerCase().includes(query.toLowerCase())
        )
    }

    const productColumns = [
        {
            name: 'ID',
            sortable: true,
            minWidth: '17rem',
            selector: row => row.posProductID
        },
        {
            name: 'Product',
            sortable: true,
            minWidth: '17rem',
            selector: row => row.posProductName
        },
        {
            name: 'Price',
            selector: row => `₹ ${row.price}`
        },
        {
            name: 'Category',
            sortable: true,
            selector: row => row.productCategoryName
        },
        {
            name: 'Status',
            sortable: true,
            minWidth: '9rem',
            selector: row => {
                return (
                    <>
                        {
                            row.status === "Active" ? (
                                <Badge color='light-success'>
                                    Available
                                </Badge>
                            ) : (
                                <Badge color='light-warning'>
                                    Not Available
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
                                setSelPr(row)
                                handleUpdatePr()
                            }} />
                            <Trash2 className='ms-1 cursor-pointer' size={20} onClick={() => {
                                setSelPr(row)
                                handleDelPr()
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
                <span className='fs-3 mx-auto'>{name} - POS Products</span>
            </div>
            <Row>
                <Col>
                    <Card>
                        <CardHeader className='d-flex flex-row flex-wrap justify-content-around align-items-center'>
                            <Button className='m-1' color='primary' onClick={handleCatOpen}><PlusCircle className='mx-1' size={15} />Add/View Category</Button>
                            <Button className='m-1' color='primary' onClick={handlePrOpen}><PlusCircle className='mx-1' size={15} />Add New Product</Button>
                            <Button className='m-1' color='primary' onClick={() => navigate(`/posProductList/${name}/${id}`)}><PlusCircle className='mx-1' size={15} />Product List</Button>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>POS Products added for {name}</CardTitle>
                            <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className='react-dataTable'>
                                    <DataTable
                                        noHeader
                                        pagination
                                        data={search(prData)}
                                        columns={productColumns}
                                        className='react-dataTable'
                                        sortIcon={<ChevronDown size={10} />}
                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {catOpen && <CatModal open={catOpen} handleCatOpen={handleCatOpen} id={id} />}
            {/* <PrModal open={prOpen} handlePrOpen={handlePrOpen} /> */}
            {/* {listOpen && <ProductList open={listOpen} handleListOpen={handleListOpen} />} */}
            {prOpen && <NewProductModal open={prOpen} handlePrOpen={handlePrOpen} id={id} />}
            {updatePr && <EditProductModal open={updatePr} handleUpdatePr={handleUpdatePr} data={selPr} id={id} />}
            {delPr && <DeleteProductModal open={delPr} handleOpen={handleDelPr} data={selPr} />}
        </>
    )
}

export default PosProducts