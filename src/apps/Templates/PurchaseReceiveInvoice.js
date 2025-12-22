import React, { useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import axios from '../../API/axios'
import { Button, Col, Container, Row, Table } from 'reactstrap'
import moment from 'moment'

const PurchaseReceiveInvoice = () => {

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
    const [prInfo, setPrinfo] = useState([])
    const [prItem, setPritem] = useState([])

    const getPRData = async () => {
        try {
            const res = await axios.get(`/inventory/purchase_receive/${id}?LoginID=${LoginID}&Token=${Token}`)
            console.log('res', res)
            setData(res?.data)
            setPrinfo(res?.data[0][0])
            setPritem(res?.data[1])
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
                return { "value": i.categoryID, "label": i.categoryName, ...i }
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
                    return { "value": r.productID, "label": r.productName, ...r }
                })
                setPrdData(arr)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getPRData()
        getAllCategoryData()
        getAllProductData()
    }, [])

    return (
        <>
            {console.log('prInfo', prInfo)}
            {console.log('prItem', prItem)}
            <div className='d-flex justify-content-end py-1'>
                <Button className='m-1' color='success' onClick={handlePrint} >
                    Print PR
                </Button>
            </div>
            {
                data.length > 0 && (
                    <Container>
                        <div className='m-1' ref={componentRef}>
                            <Row>
                                <Col className='text-center'>
                                    <h2>Purchase Receive ID - {prInfo.purchaseReceiveID}</h2>
                                </Col>
                            </Row>
                            <Row className='my-3 d-flex flex-row justify-content-around'>
                                <Col className='align-items-center'>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>PO Date -</span> {moment(prInfo.receivedDate).format('ddd')}, {moment(prInfo.pODate).format('LL')}</h5>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>PO ID -</span> {prInfo.POID}</h5>
                                    <h5 className='me-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Property ID -</span> {prInfo.propertyID}</h5>
                                </Col>
                                <Col>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Received By -</span> {prInfo.receivedBy}</h5>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Status -</span> {prInfo.status}</h5>
                                    <h5 className='ms-auto' style={{ width: 'fit-content' }}><span className='fw-light'>Remark -</span> {prInfo.remarks}</h5>
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
                                                <th>Product</th>
                                                <th>Product code</th>
                                                <th>PO Quantity</th>
                                                {/* <th>Received Earlier</th> */}
                                                <th>Received</th>
                                                {/* <th>Tax(%)</th> */}
                                                {/* <th>Total Amount</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                prItem.map((i, index) => {
                                                    return (
                                                        <tr key={index + 1}>
                                                            <td>{i.receivedItemID}</td>
                                                            <td>{i.productCode}</td>
                                                            <td>{i.productName}</td>
                                                            <td>{i.pO_Quantity}</td>
                                                            {/* <td>{i.Received_Earlier}</td> */}
                                                            <td>{i.quantity}</td>
                                                            {/* <td>{i.TotalTax}</td> */}
                                                            {/* <td>{i.TotalAmount}</td> */}
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

export default PurchaseReceiveInvoice