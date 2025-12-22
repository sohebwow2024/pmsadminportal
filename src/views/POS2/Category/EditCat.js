import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'

const EditCat = ({ showEdit, setShowEdit, posId, getPosCatData }) => {
    console.log("postId",posId)
    const [cat_name, setCat_name] = useState('')
    const [cat_descp, setCat_descp] = useState('')
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const getCatData = async () => {
        try {
            const res = await axios.get(`/pos_category?LoginID=${LoginID}&Token=${Token}&PoSID=${posId}`)
            console.log('res', res?.data[0])
            // setData(res?.data[0])
            if (res?.data[0].length > 0) {
                let data = res?.data[0]
                setCat_name(data[0].productCategoryName)
                setCat_descp(data[0].description)
            }
        } catch (error) {
            console.log('error', error)
        }
    }


    const onEditSubmit = () => {
        if (cat_name) {
            axios.post(`/pos_category/update?id=${posId}`, {
                LoginID,
                Token,
                ProductCategoryName: cat_name,
                Description: cat_descp,
            }).then(res => {
                console.log('category', res.data)
                if (res.data[0][0].status == "Success") {
                    toast.success(res.data[0][0].message, { position: 'top-right' })
                    setShowEdit(!showEdit)
                    getPosCatData()
                }
            }).catch(e => {
                setShowEdit(!showEdit)
                toast.error(e.response.data.message, { position: 'top-right' })
            })
        } else {
            toast.error("Please Add Category Name", { position: 'top-center' })
        }

    }
    useEffect(() => {
        getCatData()
    }, [showEdit])
    return (
        <>
            <Modal
                isOpen={showEdit}
                toggle={() => setShowEdit(!showEdit)}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
                    Edit {cat_name}
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
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
                    <Row tag='form' className='gy-1 gx-2 mt-75' >
                        <Col className='text-end mt-1' xs={12}>
                            <Button className='me-1' color='primary' onClick={onEditSubmit}>
                                Submit
                            </Button>
                            <Button
                                color='secondary'
                                outline
                                onClick={() => {
                                    setShowEdit(!showEdit)
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                showEdit ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default EditCat