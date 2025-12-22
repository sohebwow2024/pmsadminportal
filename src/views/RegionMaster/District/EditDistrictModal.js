import React, { useEffect, useState } from 'react'
import { Button, Input, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, Spinner } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const EditDistrictModal = ({ id, showEdit, handleEditModal, stateOptions, selectDisName, selectStateId, selectDisDec, getDistList, dropdownLoader, selectDisStatus }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData
    // const logInId = localStorage.getItem('user-id')

    const [editDistrictName, setEditDistrictName] = useState(selectDisName)
    const [editStateID, setEditStateID] = useState(selectStateId)
    const [editDistrictDesc, setEditDistrictDesc] = useState(selectDisDec)
    const [editDistrictStatus] = useState(selectDisStatus)
    const [editDisplay, setEditDisplay] = useState(false)


    const [editModelData, setEditModelData] = useState()

    const handleStateList = (value) => {
        if (value === 'reload') {
            stateListResponce()
        }
        setEditStateID(value)
    }

    const districtPut = () => {
        const districtPutBody = {
            LoginID,
            Token,
            Seckey: "abc",
            Event: "update",
            DistrictID: id,
            DistrictName: editDistrictName,
            DistrictDesc: editDistrictDesc,
            StateID: editStateID,
            Status: editDistrictStatus
        }
        try {
            axios.post(`/getdata/regiondata/districtdetails`, districtPutBody)
                .then(response => {
                    console.log("District Update Response", response)
                    // getDistList()
                })
        } catch (error) {
            console.log("District Update error", error.message)
        }
    }

    // const editData = () => {

    //     const districtEditBody = {
    //         LoginID,
    //         Token,
    //         Seckey: "abc",
    //         StateID: "",
    //         Event: "selectone",
    //         DistrictID: id
    //     }
    //     try {
    //         axios.post(`/getdata/regiondata/districtdetails`, districtEditBody)
    //             .then(response => {
    //                 setEditModelData(response.data[0])
    //                 console.log('setEditModelData', editModelData)
    //             })
    //     } catch (error) {
    //         console.log("District Edit Data", error.message)
    //     }
    // }

    // useEffect(() => {
    //     editData()

    // }, [editModelData])


    const editHandleSubmit = () => {
        setEditDisplay(true)
        districtPut()
        if (editDistrictName.trim() && editStateID !== '') {
            handleEditModal()
            toast.success('District Edited Successfully!', { position: "top-center" })
            // getDistList()
        } else {
            toast.error('Fill All Fields!', {
                position: "top-center",
                style: {
                    minWidth: '250px'
                },
                duration: 3000
            })
        }
    }

    return (
        <>
            {
                // editModelData.length > 0 &&
                <>
                    <Modal
                        isOpen={showEdit}
                        toggle={handleEditModal}
                        className='modal-dialog-centered modal-lg'
                        backdrop={false}
                    >
                        <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                            Edit District
                        </ModalHeader>
                        {
                            !dropdownLoader ? (
                                <>
                                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                                        <Form>
                                            <Row>
                                                <Col lg='6' className='mb-1'>
                                                    <Label className='form-label' for='DistrictName'>
                                                        <span className='text-danger'>*</span>District Name
                                                    </Label>
                                                    <Input type='text' name='DistrictName' id='DistrictName' value={editDistrictName} onChange={e => setEditDistrictName(e.target.value)} invalid={editDisplay && editDistrictName.trim() === ''} />
                                                    {editDisplay && !editDistrictName.trim() ? <span className='error_msg_lbl'>Enter District </span> : null}
                                                </Col>
                                                <Col lg='6' className='mb-1'>
                                                    <Label className='form-label' for='StateID'>
                                                        <span className='text-danger'>*</span>State
                                                    </Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        className='react-select w-100'
                                                        classNamePrefix='select'
                                                        options={stateOptions}
                                                        isClearable={false}
                                                        value={stateOptions?.filter(c => c.value === editStateID)}
                                                        onChange={e => {
                                                            handleStateList(e.value)
                                                        }}
                                                        invalid={editDisplay && editStateID === ''}
                                                    />
                                                    {editDisplay && !editStateID ? <span className='error_msg_lbl'>Select State </span> : null}
                                                </Col>
                                                <Col lg='12' className='mb-1'>
                                                    <Label className='form-label' for='DistrictDesc'>
                                                        District Description
                                                    </Label>
                                                    <Input type='textarea' name='DistrictDesc' id='DistrictDesc' value={editDistrictDesc} onChange={e => setEditDistrictDesc(e.target.value)} />
                                                </Col>
                                            </Row>
                                            <Row className='gy-1 gx-2 mt-75' >
                                                <Col className='text-lg-end text-md-center mt-1' lg='12'>
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
                                        </Form>
                                    </ModalBody>
                                </>
                            ) : (
                                <div style={{ height: '150px' }}>
                                    <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
                                </div>
                            )
                        }
                    </Modal>
                    {
                        showEdit ? (
                            <div className="modal-backdrop fade show" ></div>
                        ) : null
                    }
                </>

            }
        </>

    )
}

export default EditDistrictModal
