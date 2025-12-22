
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../API/axios'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const NewFaqModal = ({ show, setShow, handleModal, getFAQ, category }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [display, setDisplay] = useState(false)
    const [categoryId, setCategoryId] = useState('')

    const reset = () => {
        setTitle('')
        setDescription('')
        setCategoryId('')
    }

    const handleSubmit = async () => {
        // getFAQCat()
        setDisplay(true)
        console.log('title', title, 'description', description, 'categoryId', categoryId);
        if (title && description && categoryId !== '') {
            const res = await axios.post('/faq/save', {}, {
                headers: {
                    LoginID,
                    Token
                },
                params: {
                    FAQCatId: categoryId,
                    FAQTitle: title,
                    Description: description
                }
            })
                .then(response => {
                    console.log('res', response)
                    getFAQ()
                    setShow(!show)
                    toast.success('FAQ Added Successfully!', { position: "top-center" })
                    reset()
                    setDisplay(false)
                }).catch(function (error) {
                    console.log("User Login Error=====", error?.response?.data?.message)
                    toast.error(error?.response?.data?.message)
                })
        } else {
            toast.error('Please fill all the fields')
        }
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
                    <span className=' mb-1'>Add FAQ</span>
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Form>

                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='userName'>
                                        <span className='text-danger'>*</span>Category
                                    </Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder="Select Category"
                                        options={category}
                                        onChange={e => {
                                            setCategoryId(e.value)
                                        }}
                                    // invalid={display && country === ''}
                                    />
                                    {display === true && !categoryId ? <span className='error_msg_lbl'>Select Category </span> : <></>}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='userName'>
                                        <span className='text-danger'>*</span>Title
                                    </Label>
                                    <Input type='text' name='userName' id='userName' value={title} onChange={e => setTitle(e.target.value)} invalid={display ? title === '' : false} />
                                    {display === true && !title ? <span className='error_msg_lbl'>Enter Title </span> : <></>}
                                </Col>
                                <Col lg='12' className='mb-1'>
                                    <Label className='form-label' for='password'>
                                        <span className='text-danger'>*</span>Description
                                    </Label>
                                    {/* <Input type='textarea' name='password' id='password' value={description} onChange={e => setDescription(e.target.value)} invalid={display ? description === '' : false} /> */}
                                    <ReactQuill theme="snow" value={description} onChange={setDescription} />
                                    {display === true && !description ? <span className='error_msg_lbl'>Enter Description </span> : <></>}
                                </Col>
                            </Row>
                        </Form>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-lg-end text-md-center mt-1' xs={12}>
                                <Button className='me-1' color='primary' onClick={handleSubmit}>
                                    Submit
                                </Button>
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

export default NewFaqModal



