import React from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

const EditProductCategory = ({ showEdit, setShowEdit, editProductCategory, setProductCode, setProductName, setProductPrice, setProductSellingPrice, categoryList, onEditSubmit, setEditCatData, editCatData }) => {
    return (
        <>
            <Modal
                isOpen={showEdit}
                toggle={() => setShowEdit(!showEdit)}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                {/* {console.log('editProductCategory', editProductCategory)} */}
                <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
                    Edit Product Category
                    {/* {editProductCategory[0]?.ProductName} */}
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
                        <Col md='6' className='mb-2'>
                            <Label className='form-label'>Category</Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                classNamePrefix='select'
                                // defaultInputValue={category[0]?.label || "select"}
                                options={categoryList}
                                isClearable={false}
                                onChange={e => setEditCatData(e.value)}
                                value={categoryList && categoryList.filter(c => c.value === editCatData)}

                            />
                        </Col>
                        <Col md='6' className='mb-2'>
                            <Label className='form-label'>Product Code</Label>
                            <Input type='text' placeholder='Enter Code' defaultValue={editProductCategory[0]?.ProductCode} onChange={e => setProductCode(e.target.value)} />
                        </Col>
                        <Col md='6' className='mb-2'>
                            <Label className='form-label'>Product Name</Label>
                            <Input type='text' placeholder='Enter Product Name' defaultValue={editProductCategory[0]?.ProductName} onChange={e => setProductName(e.target.value)} />
                        </Col>
                        <Col md='6' className='mb-2'>
                            <Label className='form-label'>Purchase Price</Label>
                            <Input type='text' placeholder='Enter Purchase Price' defaultValue={editProductCategory[0]?.PurchasePrice} onChange={e => setProductPrice(e.target.value)} />
                        </Col>
                        <Col md='6' className='mb-2'>
                            <Label className='form-label'>Selling Price</Label>
                            <Input type='text' placeholder='Enter Selling Price' defaultValue={editProductCategory[0]?.SellingPrice} onChange={e => setProductSellingPrice(e.target.value)} />
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
        </>
    )
}

export default EditProductCategory