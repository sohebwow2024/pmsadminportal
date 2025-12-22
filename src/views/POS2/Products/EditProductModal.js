import { useState, useEffect } from "react"
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from "../../../API/axios"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const unitOptions = [
    { value: 'bottle', label: 'Bottle' },
    { value: 'bowl', label: 'Bowl' },
    { value: 'cup', label: 'Cup' },
    { value: 'plate', label: 'Plate' },
    { value: 'person', label: 'Person' }
]

const statusOptions = [
    { value: "Active", label: 'Available' },
    { value: "Not Available", label: 'Not Available' }
]

const EditProductModal = ({ open, handleUpdatePr, data, id }) => {
    console.log('data', data);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [catOptions, setCatOptions] = useState([])

    const getCatOptions = async () => {
        try {
            const res = await axios.get('/pos_category', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('catres', res)
            let result = res?.data[0]
            let CatOptions
            if (result.length > 0) {
                CatOptions = result.map(r => {
                    return { value: r.productCategoryID, label: r.productCategoryName, ...r }
                })
                setCatOptions(CatOptions)
            } else {
                setCatOptions([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getCatOptions()
    }, [open])

    const [submit, setSubmit] = useState(false)
    const [up_pr_name, setUp_Pr_name] = useState(data.posProductName)
    const [up_pr_price, setUp_Pr_price] = useState(data.price)
    const [up_pr_per, setUp_Pr_per] = useState(data.unit)
    const [up_pr_qty, setUp_Pr_qty] = useState(data.quantity)
    const [up_pr_descp, setUp_Pr_descp] = useState(data.description)
    const [up_pr_cat, setUp_Pr_cat] = useState(data.productCategoryID)
    const [up_pr_status, setUp_Pr_Status] = useState(data.status)

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSubmit(true)
        if (up_pr_status === "Not Available") {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Status: up_pr_status,
                }
                const res = await axios.post(`/pos_product/status?id=${data.posProductID}`, obj)
                console.log('status res', res)
                toast.success("Product Updated!")
                handleUpdatePr()
            } catch (error) {
                console.log('status-error', error)
            }
        } else if (up_pr_name && up_pr_price !== '' && up_pr_status === "Active") {
            let obj = {
                LoginID,
                Token,
                POSProductName: up_pr_name,
                ProductCategoryID: up_pr_cat,
                Price: up_pr_price,
                Unit: up_pr_per,
                Quantity: up_pr_qty,
                Description: up_pr_descp,
                Seckey: ""
            }
            try {
                const res = await axios.post('/pos_product/update', obj, {
                    params: {
                        id: data.posProductID
                    }
                })
                console.log('res', res)
                if (res?.data[0][0].status === "Success") {
                    toast.success("Product Updated!")
                    handleUpdatePr()
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }

        } else {
            toast.error("Fill all Fields")
        }
    }

    return (
        <>
            <Modal isOpen={open} toggle={handleUpdatePr} className='modal-dialog-centered modal-lg' backdrop={false}>
                <ModalHeader toggle={handleUpdatePr}>Update Product</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => handleUpdate(e)}>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter category name'
                                    value={up_pr_name}
                                    onChange={e => setUp_Pr_name(e.target.value)}
                                    invalid={submit && up_pr_name === ''}
                                />
                                {submit && up_pr_name === '' && <FormFeedback>Name cannot be Blank</FormFeedback>}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Price<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter category name'
                                    value={up_pr_price}
                                    onChange={e => setUp_Pr_price(e.target.value)}
                                    invalid={submit && up_pr_price === ''}
                                />
                                {submit && up_pr_price === '' && <FormFeedback>Enter a valid price</FormFeedback>}
                            </Col>
                            <Col>
                                <Label>Per</Label>
                                <Select
                                    placeholder='Select unit'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={unitOptions}
                                    value={unitOptions.filter(c => c.value === up_pr_per)}
                                    onChange={e => setUp_Pr_per(e.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Quantity</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter category name'
                                    value={up_pr_qty}
                                    onChange={e => setUp_Pr_qty(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='text'
                                    name='descp'
                                    placeholder='Enter description'
                                    value={up_pr_descp}
                                    onChange={e => setUp_Pr_descp(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Category</Label>
                                <Select
                                    placeholder='Select unit'
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={catOptions}
                                    value={catOptions.filter(c => c.value === up_pr_cat)}
                                    onChange={e => setUp_Pr_cat(e.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Status</Label>
                                <Select
                                    placeholder=''
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={statusOptions}
                                    value={statusOptions.filter(c => c.value === up_pr_status)}
                                    onChange={e => setUp_Pr_Status(e.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <Button type="submit" color='primary'>Update Product</Button>
                            </Col>
                        </Row>
                    </Form>
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

export default EditProductModal