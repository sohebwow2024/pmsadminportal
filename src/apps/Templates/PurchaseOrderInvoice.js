import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import { useParams } from 'react-router-dom'
import { Button, Col, Container, Row, Table } from 'reactstrap'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'

const PurchaseOrderInvoice = () => {
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        // onAfterPrint: () => { setTimeout(() => window.close(), 1000) }
    })

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID } = getUserData

    const { id } = useParams()

    const [data, setData] = useState([])
    const [prdData, setPrdData] = useState([])
    const [catData, setCatdata] = useState([])
    const [poInfo, setPoinfo] = useState([])
    const [poItem, setPoitem] = useState([])

    const getPOData = async () => {
        try {
            const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${id}`)
            // console.log('res', res)
            setData(res?.data)
            setPoinfo(res?.data[0][0])
            setPoitem(res?.data[1])
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!', { duration: 10000 })
        }
    }

    const getAllCategoryData = async () => {
        try {
            const res = await axios.get(`/inventory/product/categoryall?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
            console.log('cat_res', res)
            let arr = res.data[0].map(i => {
                return { "value": i.CategoryID, "label": i.CategoryName, ...i }
            })
            setCatdata(arr)
        } catch (error) {
            console.log('error', error)
        }
    }

    const getAllProductData = async () => {
        try {
            const res = await axios.get(`/inventory/product_all?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
            console.log('res', res)
            let result = res?.data[0]
            if (result.length > 0) {
                let arr = result.map(r => {
                    return { "value": r.ProductID, "label": r.ProductName, ...r }
                })
                setPrdData(arr)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getPOData()
        getAllCategoryData()
        getAllProductData()
    }, [])

    const poColumns = [
        {
            name: 'ID',
            width: '16rem',
            selector: row => row.POItemID
        },
        {
            name: 'Category',
            width: '12rem',
            selector: row => {
                let arr = catData.filter(c => c.value === row.ProductCategoryID)
                return arr[0].label
            }
        },
        {
            name: 'Product',
            width: '12rem',
            selector: row => {
                let arr = prdData.filter(c => c.value === row.ProductID)
                return arr[0].label
            }
        },
        {
            name: 'Rate',
            width: '8rem',
            selector: row => row.Rate
        },
        {
            name: 'Quantity',
            width: '8rem',
            selector: row => row.Quantity
        },
        {
            name: 'Discount(%)',
            width: '8rem',
            selector: row => row.Discount
        },
        {
            name: 'Tax(%)',
            width: '8rem',
            selector: row => row.TotalTax
        },
        {
            name: 'Total Amount',
            // width: '8rem',
            selector: row => row.TotalAmount
        },
    ]

    return (
        <>
            {console.log('poinfo', poInfo)}
            {console.log('poitem', poItem)}
            <div className='d-flex justify-content-end py-1'>
                <Button className='m-1' color='success' onClick={handlePrint} >
                    Print PO
                </Button>
            </div>
            {
                data.length > 0 && (
                    <Container>
                        <div className='m-1' ref={componentRef}>
                            <Row>
                                <Col className='text-center'>
                                    <h2>Purchase Order ID - {poInfo.POID}</h2>
                                </Col>
                            </Row>
                            <Row className='my-3 d-flex flex-row justify-content-around'>
                                <Col className='align-items-center'>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>PO Date -</span> {moment(poInfo.PODate).format('ddd')}, {moment(poInfo.PODate).format('LL')}</h5>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>PO No -</span> {poInfo.PONumber}</h5>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Property ID -</span> {poInfo.PropertyID}</h5>
                                </Col>
                                <Col>
                                    <h5 className='mx-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Vendor -</span> {poInfo.VendorName}</h5>
                                    <h5 className='mx-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Status -</span> {poInfo.Status}</h5>
                                    <h5 className='mx-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Remark -</span> {poInfo.Remarks}</h5>
                                </Col>
                                <Col>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Tax -</span> {poInfo.TotalTax}</h5>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Amount -</span> {poInfo.TotalAmount}</h5>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Due -</span> {poInfo.DueAmount}</h5>
                                </Col>
                            </Row>
                            {/* <Row>
                                        <DataTable
                                            className='react-dataTable'
                                            noHeader
                                            columns={poColumns}
                                            data={data[1]}
                                        />
                                    </Row> */}
                            <Row>
                                <Col>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Category</th>
                                                <th>Product</th>
                                                <th>Rate</th>
                                                <th>Quantity</th>
                                                <th>Discount(%)</th>
                                                <th>Tax(%)</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                poItem.map((i, index) => {
                                                    let catname = catData.filter(c => c.value === i.ProductCategoryID)
                                                    let pname = prdData.filter(c => c.value === i.ProductID)
                                                    return (
                                                        <tr key={index + 1}>
                                                            <td>{i.POItemID}</td>
                                                            <td>{catname[0]?.label}</td>
                                                            <td>{pname[0]?.label}</td>
                                                            <td>{i.Rate}</td>
                                                            <td>{i.Quantity}</td>
                                                            <td>{i.Discount}</td>
                                                            <td>{i.TotalTax}</td>
                                                            <td>{i.TotalAmount}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                )
            }
        </>
    )
}

export default PurchaseOrderInvoice