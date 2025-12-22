import { React, useState, useEffect } from 'react'
import { Button, Input, Row, Col, Label, Form, FormFeedback, ModalBody, ModalFooter, Modal, ModalHeader } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import axios from '../../../API/axios'
import { RiBillLine } from "react-icons/ri"
import { AiFillPrinter } from "react-icons/ai"
import { useSelector } from 'react-redux'
import moment from 'moment'
import { PlusCircle, Trash2 } from 'react-feather'
import toast from 'react-hot-toast'

const CreatePO = ({ handleShow }) => {

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [vendorData, setVendorData] = useState([])
  const [selVendorId, setSelVendorId] = useState('')
  const [vendorName, setVendorName] = useState('')

  const [categoryData, setCategoryData] = useState([])
  const [selCat, setSelCat] = useState('')

  const [productData, setProductData] = useState([])
  const [selProduct, setSelProduct] = useState('')

  const [rate, setRate] = useState(0)
  const [qty, setQty] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [famt, setFamt] = useState(0)

  const [save, setSave] = useState(false)
  const [poNo, setPoNo] = useState('')
  const [poDate, setPoDate] = useState(new Date())
  const [gtotal, setGtotal] = useState(0)
  const [gtax, setGtax] = useState(0)
  const [remark, setRemark] = useState('')
  const [display, setDisplay] = useState(false)
  const [itemArr, setItemArr] = useState([])
  console.log('itemArr', itemArr);
  const getAllVendorData = async () => {
    try {
      const res = await axios.get(`/inventory/po?PropertyID=${PropertyID}&Status&LoginID=${LoginID}&Token=${Token}`)
      console.log('res', res)
      let result = res?.data[1]
      if (result.length > 0) {
        let arr = result.map(r => {
          return { value: r.userID, label: `${r.firstName}, ${r.lastName}`, ...r }
        })
        setVendorData(arr)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getAllCategoryData = async () => {
    try {
      const res = await axios.get(`/inventory/product/categoryall?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
      console.log('cat_res', res)
      let arr = res.data[0].map(i => {
        return { "value": i.categoryID, "label": i.categoryName, ...i }
      })
      setCategoryData(arr)
    } catch (error) {
      console.log('error', error)
    }
  }

  const getAllProductData = async () => {
    try {
      const res = await axios.get(`/inventory/product_all?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
      // console.log('res====> ', res)
      let result = res?.data[0]
      if (result.length > 0) {
        let arr = result.map(r => {
          return { "value": r.productID, "label": r.productName, ...r }
        })
        setProductData(arr)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getAllVendorData()
    getAllCategoryData()
    getAllProductData()
  }, [])

  const handleTotal = () => {
    if (qty > 0 && discount >= 0 && tax >= 0) {
      let new_total_amt = rate * qty
      let discount_amt = (discount / 100) * new_total_amt
      let cal_total = new_total_amt - discount_amt
      let tax_amt = cal_total * (tax / 100)
      setTotal(cal_total)
      setFamt((cal_total + tax_amt))
    }
  }

  useEffect(() => {
    handleTotal()
  }, [qty, discount, tax])

  const resetPOItem = () => {
    setSelCat('')
    setSelProduct('')
    setRate(0)
    setQty(0)
    setDiscount(0)
    setTotal(0)
    setTax(0)
    setFamt(0)
  }

  const addItem = () => {
    setSave(true)
    if (rate > 0 && qty > 0 && discount >= 0 && tax >= 0) {
      let item_obj = {
        LoginID,
        Token,
        Seckey: "abc",
        POItemID: "",
        POID: "0",
        ProductCategoryID: selCat,
        ProductID: selProduct,
        Discount: discount,
        Quantity: qty,
        TotalAmount: famt,
        TotalTax: tax,
        SGST: tax / 2,
        CGST: tax / 2,
        IGST: tax,
        Rate: rate,
        EntryType: "I"
      }
      // console.log('item_obj', item_obj)
      setItemArr([...itemArr, item_obj])
      setSave(false)
      resetPOItem()
    } else {
      toast.error('Fill all fields!')
    }
  }

  const deleteItem = (obj) => {
    let new_arr = itemArr.filter(i => i !== obj)
    setItemArr(new_arr)
  }

  const POItemForm = () => {
    return (
      <Form>
        <Row className='d-flex flex-row justify-content-center align-items-center'>
          <Col md='2'>
            <Label>Product Category  <span className='text-danger'>*</span></Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              options={categoryData}
              value={categoryData.filter(c => c.value === selCat)}
              onChange={e => {
                setSelCat(e.value)
                setSelProduct('')
                setRate(0)
              }}
            />
          </Col>
          <Col md='2'>
            <Label>Product Name  <span className='text-danger'>*</span></Label>
            <Select
              isDisabled={selCat === ''}
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              options={productData.filter(c => c.categoryID === selCat)}
              value={productData.filter(c => c.value === selProduct)}
              onChange={e => {
                setSelProduct(e.value)
                setRate(e.purchasePrice)
              }}
            />
          </Col>
          <Col>
            <Label>Rate  <span className='text-danger'>*</span></Label>
            <Input
              type='number'
              value={rate}
              onChange={e => setRate(e.target.value)}
              invalid={save && rate === ''}
            />
            {save && rate === '' && <FormFeedback>Rate is required</FormFeedback>}
          </Col>
          <Col>
            <Label>Quantity  <span className='text-danger'>*</span></Label>
            <Input
              type='number'
              value={qty}
              onChange={e => setQty(e.target.value)}
            // invalid={save && qty === ''}
            />
            {save && qty === '' && <FormFeedback>Quantity is required</FormFeedback>}
          </Col>
          <Col>
            <Label>Discount(%)</Label>
            <Input
              type='number'
              value={discount}
              onChange={e => setDiscount(e.target.value)}
            />
          </Col>
          <Col>
            <Label>Total Amt.</Label>
            <Input
              type='number'
              value={total}
              disabled
            />
          </Col>
          <Col>
            <Label>Tax(%)</Label>
            <Input
              type='number'
              value={tax}
              onChange={e => setTax(e.target.value)}
            />
          </Col>
          <Col>
            <Label>Final Amt.</Label>
            <Input
              type='number'
              value={famt}
              disabled
            />
          </Col>
        </Row>
      </Form>
    )
  }

  const handleGtotal = () => {
    let final_total = itemArr.reduce((acc, obj) => { return acc + obj.TotalAmount }, 0)
    let final_tax = itemArr.reduce((acc, obj) => { return acc + obj.TotalTax }, 0)
    console.log('final_total', (final_total))
    setGtotal(final_total)
    setGtax(final_tax)
  }

  useEffect(() => {
    handleGtotal()
  }, [itemArr])

  const handleSave = async () => {
    setDisplay(true)
    if (selVendorId && poDate) {
      try {
        let obj = {
          LoginID,
          Token,
          Seckey: "abc",
          POID: "0",
          VendorName: vendorName,
          VendorID: selVendorId,
          // PONumber: poNo,
          PODate: moment(poDate).format('YYYY-MM-DD'),
          Remarks: remark,
          TotalAmount: gtotal,
          TotalTax: gtax,
          SGST: "0.0",
          CGST: "0.0",
          IGST: "0.0",
          DueAmount: "0.0",
          PropertyID,
          POItems: itemArr
        }
        // console.log('objPO', obj)
        const res = await axios.post(`/inventory/po`, obj, {
          headers: {
            LoginID,
            Token
          }
        })
        console.log('res', res)
        if (res?.data[0][0].status === "Success") {
          toast.success(res?.data[0][0].message)
          handleShow()
        }
      } catch (error) {
        console.log('error', error)
        toast.error('Something went wrong, Try again!')
      }
    } else {
      toast.error("Please enter required fileds!")
    }
  }

  return (
    <>
      <Row>
        <Col md='12' className='mb-1'>
          <Row>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Vendor  <span className='text-danger'>*</span></Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={vendorData}
                onChange={e => (setSelVendorId(e.value), setVendorName(e.label))}
                invalid={display && selVendorId === ''}
              />
              {display && !selVendorId ? <span className='error_msg_lbl'>Enter Vendor </span> : null}
            </Col>
            {/* <Col md='4' className='mb-1'>
              <Label className='form-label'>PO Number</Label>
              <Input
                type='text'
                placeholder='Insert PO Number'
                value={poNo}
                onChange={e => setPoNo(e.target.value)}
                invalid={save && poNo === ''}
              />
              {save && poNo === '' && <span className='text-danger'>PO number is required</span>}
            </Col> */}
            <Col md='4' className='mb-1'>
              <Label className='form-label'>PO Date  <span className='text-danger'>*</span></Label>
              <Flatpickr
                id='startDate'
                placeholder='Select PO Date'
                className='form-control'
                options={{
                  altInput: true,
                  altFormat: 'd-m-y',
                  dateFormat: 'd-m-y',
                  // minDate: moment(new Date()).subtract(1, 'days')
                }}
                value={moment(poDate).toISOString()}
                onChange={date => setPoDate(date[0])}
              />
              {save && poDate === '' && <span className='text-danger'>PO Date is required</span>}
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Total Amount</Label>
              <Input
                type='number'
                value={(gtotal).toFixed(3)}
                disabled />
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Remark</Label>
              <Input
                type='text'
                placeholder='Enter Remark'
                value={remark}
                onChange={e => setRemark(e.target.value)}
              />
            </Col>
            {/* <Col md='4' className='d-flex flex-row flex-wrap justify-content-md-end justify-content-center align-items-center'>
              <Button
                size='sm'
                color='primary me-2'
                disabled={itemArr.length === 0}
                onClick={() => handleInvoice()}
              >
                <RiBillLine size={17} /> Invoice
              </Button>
              <Button
                size='sm'
                color='primary'
                className='me-2'
                disabled={itemArr.length === 0}
              >
                <AiFillPrinter size={17} /> Print Bill
              </Button>
            </Col> */}
          </Row>
          {
            itemArr.length > 0 && (
              itemArr.map((i, index) => {
                let total = i.TotalAmount - ((i.TotalTax * 100) / i.TotalAmount)
                return (
                  <>
                    <Row key={index + 1} className='mb-1 d-flex flex-row justify-content-center align-items-center'>
                      <Col md='2'>
                        {index === 0 && <Label>Product Category   </Label>}
                        <Select
                          isDisabled
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          // options={categoryData}
                          value={categoryData.filter(c => c.value === i.productCategoryID)}
                        // onChange={e => {
                        //   setSelCat(e.value)
                        //   setSelProduct('')
                        //   setRate(0)
                        // }}
                        />
                      </Col>
                      <Col md='2'>
                        {index === 0 && <Label>Product Name  </Label>}
                        <Select
                          isDisabled
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          // options={productData.filter(c => c.CategoryID === selCat)}
                          value={productData.filter(c => c.value === i.productID)}
                        // onChange={e => {
                        //   setSelProduct(e.value)
                        //   setRate(e.PurchasePrice)
                        // }}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Rate  </Label>}
                        <Input
                          type='number'
                          value={i.Rate}
                          disabled
                        // onChange={e => setRate(e.target.value)}
                        // invalid={save && rate === ''}
                        />
                        {/* {save && rate === '' && <FormFeedback>Rate is required</FormFeedback>} */}
                      </Col>
                      <Col>
                        {index === 0 && <Label>Quantity  </Label>}
                        <Input
                          type='number'
                          value={i.Quantity}
                          disabled
                        // onChange={e => setQty(e.target.value)}
                        // invalid={save && qty === ''}
                        />
                        {/* {save && qty === '' && <FormFeedback>Quantity is required</FormFeedback>} */}
                      </Col>
                      <Col>
                        {index === 0 && <Label>Discount(%)</Label>}
                        <Input
                          type='number'
                          value={i.Discount}
                          disabled
                        // onChange={e => setDiscount(e.target.value)}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Total Amt.</Label>}
                        <Input
                          type='number'
                          value={Math.round(total)}
                          disabled
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Tax(%)</Label>}
                        <Input
                          type='number'
                          value={i.TotalTax}
                          disabled
                        // onChange={e => setTax(e.target.value)}
                        />
                      </Col>
                      <Col className='d-flex flex-row align-items-end'>
                        <div>
                          {index === 0 && <Label>Final Amt.</Label>}
                          <Input
                            type='number'
                            value={(i.TotalAmount).toFixed(3)}
                            disabled
                          />
                        </div>
                        <Trash2 onClick={() => deleteItem(i)} className='cursor-pointer' color='red' size={35} />
                      </Col>
                    </Row>
                  </>
                )
              })
            )
          }
          <hr />
          <Row className='my-1'>
            <Col>
              {/* <POItemForm /> */}
              {POItemForm()}
            </Col>
          </Row>
          <Row className='text-end'>
            <Col>
              {/* <Button size='sm' color='info'><PlusCircle size={17} /> Add Item</Button> */}
              <Button
                size='sm'
                color='warning'
                onClick={() => addItem()}
                disabled={selCat === '' || selProduct === '' || qty <= 0}
              ><PlusCircle size={17} /> ITEM</Button>
            </Col>
          </Row>
          <Row>
            <Col className='text-center'>
              <Button
                className='mx-1 mt-1 mb-0'
                color='primary'
                disabled={itemArr.length === 0}
                onClick={() => handleSave()}
              >
                Save
              </Button>
              {/* <Button
                className='mx-1 mt-1 mb-0'
                color='success'
                disabled={itemArr.length === 0}
                onClick={() => handleInvoice()}
              >
                Invoice
              </Button> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default CreatePO