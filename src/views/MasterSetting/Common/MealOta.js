import React, { useState } from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios, { Staah } from '../../../API/axios'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { duration } from 'moment'

const MealOta = ({ open, handleOta, id }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token, PropertyID } = getUserData
    const [loading, setLoading] = useState(false)
    const [activeloading, setActiveLoading] = useState(false)
    const [inactiveloading, setInActiveLoading] = useState(false)
    const AddOTA = async () => {
        setLoading(true)
        try {
            const res = await Axios({
                method: "post",
                baseURL: `${Staah}`,
                url: `/RatePlan/Add?hotelid=${PropertyID}&rateid=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": '*',
                    "Content-Type": "application/json",
                    LoginID,
                    Token,
                    Seckey: '123'
                },
            })
            setLoading(false)
            console.log('res', res)
            if (res?.data?.code === 200) {
                toast.success(res?.data?.data)
            } else if (res?.data?.code === 500) {
                toast.error(res?.data?.data, { duration: 7000 })
            } else {
                toast.error('Something went wrong, Try again!')
            }
        } catch (error) {
            setLoading(false)
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }
    const ActivateOTA = async () => {
        setActiveLoading(true)
        try {
            const res = await Axios({
                method: "post",
                baseURL: `${Staah}`,
                url: `/RatePlan/Activate?hotelid=${PropertyID}&rateid=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": '*',
                    "Content-Type": "application/json",
                    LoginID,
                    Token,
                    Seckey: '123'
                },
            })
            setActiveLoading(false)
            console.log('res', res)
            if (res?.data?.code === 200) {
                toast.success(res?.data?.data)
            } else if (res?.data?.code === 500) {
                toast.error(res?.data?.data, { duration: 7000 })
            } else {
                toast.error("Something went wrong, Try again!")
            }
        } catch (error) {
            setActiveLoading(false)
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }
    const DeActivateOTA = async () => {
        setInActiveLoading(true)
        try {
            const res = await Axios({
                method: "post",
                baseURL: `${Staah}`,
                url: `/RatePlan/Deactivate?hotelid=${PropertyID}&rateid=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": '*',
                    "Content-Type": "application/json",
                    LoginID,
                    Token,
                    Seckey: '123'
                },
            })
            setInActiveLoading(false)
            console.log('res', res)
            if (res?.data?.code === 200) {
                toast.success(res?.data?.data)
            } else if (res?.data?.code === 500) {
                toast.error(res?.data?.data, { duration: 7000 })
            } else {
                toast.error("Something went wrong, Try again!")
            }
        } catch (error) {
            setInActiveLoading(false)
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal className='modal-dialog-centered' isOpen={open} toggle={handleOta} backdrop={false}>
                <ModalHeader className='bg-transparent text-center' toggle={handleOta}>
                    OTA Functions
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button className='m-1' style={{ width: '8rem' }} color='primary' onClick={AddOTA} disabled={loading === true}>{loading === true ? 'Loading' : 'Add'}</Button>
                            <Button className='m-1' style={{ width: '8rem' }} color='primary' outline onClick={ActivateOTA} disabled={activeloading === true}>{activeloading === true ? 'Loading' : 'Activate'} </Button>
                            <Button className='m-1' style={{ width: '8rem' }} color='danger' outline onClick={DeActivateOTA} disabled={inactiveloading === true}>{inactiveloading === true ? 'Loading' : 'DeActivate'} </Button>
                        </Col>
                    </Row>
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

export default MealOta