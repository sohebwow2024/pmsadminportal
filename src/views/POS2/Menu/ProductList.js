import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const ProductList = ({ open, handleListOpen }) => {
    const { id, name } = useParams()
    console.log('id', id);
    const [productList, setProductList] = useState([])
    const [catList, setCatList] = useState([])
    console.log(catList, productList);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const getPosCatData = async () => {
        try {
            const res = await axios.get(`/pos_product/?LoginID=${LoginID}&Token=${Token}&PoSID=${id}`, {
            })
            setProductList(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    const getPosProductList = async () => {
        try {
            const res = await axios.get(`/pos_category?LoginID=${LoginID}&Token=${Token}&PoSID=${id}`, {
            })
            setCatList(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getPosCatData()
        getPosProductList()
    }, [open])
    return (
        <>
            <h1 className='text-center pt-2'>{name}</h1>
            <div className='p-1 m-2 border border-dark border-2 '>
                <div className=' border border-3 border-dark p-2'>
                    {catList.map((item, index) => {
                        const catName = item.roductCategoryName
                        return (
                            <div key={index} className='border-bottom py-1'>
                                <h2 style={{ color: 'black' }} className='pb-1'>{item.productCategoryName}</h2>
                                {productList.map((item, index) => {
                                    return (
                                        catName === item.ProductCategoryName ?
                                            <div className='productDetail d-flex justify-content-between pb-1' key={index}>
                                                <span className='fs-4 fw-bold'>{item.posProductName}</span>
                                                <span className='fs-4 fw-bolder' >₹ {item.price}/-</span>
                                            </div> : ''
                                    )
                                })}

                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ProductList
