import { useState, useEffect } from "react"
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from "react-redux"
import axios from "../../../API/axios"
import toast from "react-hot-toast"

const unitOptions = [
    { value: 'bottle', label: 'Bottle' },
    { value: 'bowl', label: 'Bowl' },
    { value: 'cup', label: 'Cup' },
    { value: 'plate', label: 'Plate' },
    { value: 'person', label: 'Person' }
]


const NewProductModal = ({ open, handlePrOpen, id }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [catData, setCatData] = useState([])
    const getCatData = async () => {
        try {
            const res = await axios.get('/pos_category', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('res', res)
            let result = res?.data[0]
            let CatOptions
            if (result.length > 0) {
                CatOptions = result.map(r => {
                    return { value: r.productCategoryID, label: r.productCategoryName, ...r }
                })
                setCatData(CatOptions)
            } else {
                setCatData([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getCatData()
    }, [open])


    const [submit, setSubmit] = useState(false)
    const [pr_name, setPr_name] = useState('')
    const [pr_price, setPr_price] = useState('')
    const [pr_per, setPr_per] = useState('')
    const [pr_qty, setPr_qty] = useState('')
    const [pr_descp, setPr_descp] = useState('')
    const [pr_cat, setPr_cat] = useState('')

    const reset = () => {
        setPr_name('')
        setPr_price('')
        setPr_per('')
        setPr_qty('')
        setPr_descp('')
        setPr_cat('')
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        setSubmit(true)
        if (pr_name && pr_price !== '') {
            let obj = {
                LoginID,
                Token,
                Seckey:"abc",
                POSProductName: pr_name,
                ProductCategoryID: pr_cat,
                Price: pr_price,
                Unit: pr_per,
                Quantity: pr_qty,
                Description: pr_descp,
                PoSID: id
            }
            try {
                console.log('res', obj)
                const res = await axios.post('/pos_product', obj)
                if (res?.data[0][0].status === "Success") {
                    toast.success('New Product Created')
                    handlePrOpen()
                    setSubmit(false)
                    reset()
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try aain!")
            }
        } else {
            toast.error("Fill all Fields`")
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handlePrOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}>
                <ModalHeader toggle={handlePrOpen}>Products</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => handleAddProduct(e)}>
                        <Row>
                            <Col>
                                <Label>Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter new product name here'
                                    value={pr_name}
                                    onChange={e => setPr_name(e.target.value)}
                                    invalid={submit && pr_name === ''}
                                />
                                {submit && pr_name === '' && <FormFeedback>Name is required</FormFeedback>}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Price<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter price'
                                    value={pr_price}
                                    onChange={e => setPr_price(e.target.value)}
                                    invalid={submit && pr_price === ''}
                                />
                                {submit && pr_price === '' && <FormFeedback>Price is required</FormFeedback>}
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
                                    onChange={e => setPr_per(e.value)}

                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Quantity</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Enter quantity'
                                    value={pr_qty}
                                    onChange={e => setPr_qty(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Category</Label>
                                <Select
                                    placeholder='Select Category'
                                    menuPlacement='auto'
                                    aria-readonly
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={catData}
                                    onChange={e => setPr_cat(e.value)}

                                />
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='textarea'
                                    name='descp'
                                    placeholder='Enter product description'
                                    value={pr_descp}
                                    onChange={e => setPr_descp(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <Button color='primary' type="submit"> Add Product</Button>
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

export default NewProductModal