import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const NewAddOnServiceModal = ({ show, handleModal }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [serviceName, setServiceName] = useState('')
    const [serviceDesc, setServiceDesc] = useState('')
    const [serviceCharge, setServiceCharge] = useState('')
    const [serviceGst, setServiceGst] = useState('')
    const [serviceType, setServiceType] = useState('')

    const [display, setDisplay] = useState(false)

    const handleSubmit = async () => {
        setDisplay(true)
        // if (serviceName && serviceCharge && serviceGst && serviceType !== '') {
        //   setAddOnServices([...addOnServices, addOnServiceObj])
        //   handleModal()
        //   toast.success('Service Added!', { position: "top-center" })
        // }
        if (serviceName && serviceDesc && serviceCharge && serviceGst && serviceType !== '') {
            try {
                const obj = {
                    ServiceDesc: serviceName,
                    ServiceName: serviceName,
                    ServiceCharge: serviceCharge,
                    ServiceTax: serviceGst,
                    ServiceType: serviceType,
                    TaxName: "GST"
                }
                const res = await axios.post('/master/extraservice', obj, {
                    headers: {
                        LoginID,
                        Token,
                        Seckey: "123"
                    }
                })
                if (res.data[0][0].Status === "Success") {
                    setDisplay(false)
                    handleModal()
                    toast.success('Service Added!')
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }
        } else toast.error("Fill all details!")
    }

    const reset = () => {
        setDisplay(false)
        setServiceName('')
        setServiceDesc('')
        setServiceCharge('')
        setServiceGst('')
        setServiceType('')
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
                    Add Service
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Row>
                            <Col lg='3' className='mb-lg-2'>
                                <Label className='form-label' for='serviceName'>
                                    <span className='text-danger'>*</span>Service Name</Label>
                            </Col>
                            <Col lg='9' className='mb-2'>
                                <Input
                                    type='text'
                                    placeholder='Service Name'
                                    name='serviceName'
                                    id='serviceName'
                                    value={serviceName}
                                    onChange={e => setServiceName(e.target.value)}
                                    invalid={display && serviceName === ''}
                                />
                                {display === true && !serviceName ? <span className='error_msg_lbl'>Enter Service Name </span> : <></>}
                            </Col>
                            <Col lg='3' className='mb-lg-2'>
                                <Label className='form-label' for='serviceName'>
                                    <span className='text-danger'>*</span>Service Description</Label>
                            </Col>
                            <Col lg='9' className='mb-2'>
                                <Input
                                    type='textarea'
                                    placeholder='Service Description'
                                    name='serviceDesc'
                                    id='serviceDesc'
                                    value={serviceDesc}
                                    onChange={e => setServiceDesc(e.target.value)}
                                    invalid={display && serviceName === ''}
                                />
                                {display === true && !serviceName ? <span className='error_msg_lbl'>Enter Service Description </span> : <></>}
                            </Col>
                            <Col lg='3' className='mb-lg-2'>
                                <Label className='form-label' for='serviceCharge'>
                                    <span className='text-danger'>*</span>Service Charge</Label>
                            </Col>
                            <Col lg='9' className='mb-2'>
                                <Input
                                    type='number'
                                    placeholder='Service Charge'
                                    name='serviceCharge'
                                    id='serviceCharge'
                                    value={serviceCharge}
                                    onChange={e => setServiceCharge(e.target.value)}
                                    invalid={display && serviceCharge === ''}
                                />
                                {display === true && !serviceCharge ? <span className='error_msg_lbl'>Enter Service Charge </span> : <></>}
                            </Col>
                            <Col lg='3' className='mb-lg-2'>
                                <Label className='form-label' for='serviceGst'>
                                    <span className='text-danger'>*</span>Service GST</Label>
                            </Col>
                            <Col lg='9' className='mb-2'>
                                <Input
                                    type='number'
                                    placeholder='Service GST'
                                    name='serviceGst'
                                    id='serviceGst'
                                    value={serviceGst}
                                    onChange={e => setServiceGst(e.target.value)}
                                    invalid={display && serviceGst === ''}
                                />
                                {display === true && !serviceGst ? <span className='error_msg_lbl'>Enter GST </span> : <></>}
                            </Col>
                            <Col lg='3' className='mb-lg-2'>
                                <Label className='form-label' for='serviceType'>
                                    <span className='text-danger'>*</span>Service Type</Label>
                            </Col>
                            <Col lg='9' className='mb-2'>
                                <div>
                                    <Input
                                        type='radio'
                                        name='serviceType'
                                        id='perNight'
                                        value="Night"
                                        checked={serviceType === "Night"}
                                        onChange={e => setServiceType(e.target.value)}
                                    />
                                    <Label className='ms-1' for='perNight'>
                                        Per Night
                                    </Label>
                                    <Input
                                        type='radio'
                                        className='ms-3'
                                        name='serviceType'
                                        id='perPerson'
                                        value="Person"
                                        checked={serviceType === "Person"}
                                        onChange={e => setServiceType(e.target.value)} />
                                    <Label className='ms-1' for='perPerson'>
                                        Per Person
                                    </Label>
                                </div>
                                {display === true && !serviceType ? <span className='error_msg_lbl'>Please Select Something </span> : <></>}
                            </Col>
                        </Row>
                        <Row tag='form' >
                            <Col className='text-lg-end text-md-center mt-1' lg='12'>
                                <Button className='me-1' color='primary' onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button
                                    color='secondary'
                                    outline
                                    onClick={() => {
                                        setShow(!show)
                                        reset()
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </>
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

export default NewAddOnServiceModal