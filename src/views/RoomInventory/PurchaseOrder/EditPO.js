import { React, useState, useEffect } from 'react'
import { Button, Input, Row, Col, Label, InputGroupText, InputGroup, Form } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"
import DataTable from 'react-data-table-component'
import { RiBillLine } from "react-icons/ri"
import { AiFillPrinter } from "react-icons/ai"
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
import moment from 'moment'
import { CheckSquare, Edit3, PlusCircle, Trash2, Upload, X } from 'react-feather'
import toast from 'react-hot-toast'
import InvoiceModal from './InvoiceModal'
import { openLinkInNewTab } from '../../../common/commonMethods'

const EditPO = ({ POID, handleShowEdit }) => {
  console.log('POID in editpo', POID);
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [vendorData, setVendorData] = useState([])
  console.log("resvendorData", vendorData);

  const [selVendorId, setSelVendorId] = useState('')
  const [vendorName, setVendorName] = useState('')

  const [categoryData, setCategoryData] = useState([])
  console.log(categoryData , "categoryData");
  
  const [selCat, setSelCat] = useState('')

  const [productData, setProductData] = useState([])
    console.log(productData , "productData");

  const [selProduct, setSelProduct] = useState('')

  const [rate, setRate] = useState(0)
  const [qty, setQty] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [famt, setFamt] = useState(0)

  const [save, setSave] = useState(false)
  const [poStatus, setPoStatus] = useState('')
  const [poId, setPoId] = useState('')
  const [poNo, setPoNo] = useState('')
  const [poDate, setPoDate] = useState()
  const [gtotal, setGtotal] = useState(0)
  const [gtax, setGtax] = useState(0)
  const [dueAmt, setDueAmt] = useState(0)
  const [remark, setRemark] = useState('')

  const [poInfo, setPOInfo] = useState('')
  const [poItems, setPOItems] = useState([])
  const [editInfo, setEditInfo] = useState(false)
  const [editItem, setEditItem] = useState(false)
  const [editItemId, setEditItemId] = useState('')
  console.log('editItemId', editItemId);
  const [openInvoice, setOpenInvoice] = useState(false)
  const handleInvoice = () => setOpenInvoice(!openInvoice)

  const [flag, setFlag] = useState(false)
  const handleFlag = () => setFlag(!flag)

  const getPOdetails = async () => {
    try {
      // const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${POID}`)
      const res = await axios.get(`/inventory/po?LoginID=${LoginID}&Token=${Token}&poid=${POID}&PropertyID=${PropertyID}`)
      console.log('singlePOres', res)
      if (res?.data.length > 0) {
        setPOInfo(res.data[0])
        setPOItems(res.data[1])
      } else {
        setPOInfo([])
        setPOItems([])
      }
    } catch (error) {
      console.log('podetailserror', error)
    }
  }

  const getAllVendorData = async () => {
    try {
      const res = await axios.get(`/inventory/po?PropertyID=${PropertyID}&Status&LoginID=${LoginID}&Token=${Token}`)
      console.log('resgetAllVendorData', res)
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
      console.log('cat_resproduct', res)
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
      console.log('resproduct_all', res)
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
    getPOdetails()
    getAllVendorData()
    getAllCategoryData()
    getAllProductData()
  }, [editInfo, flag])

  useEffect(() => {
    setSelVendorId(poInfo[0]?.vendorID)
    setVendorName(poInfo[0]?.vendorName)
    setPoStatus(poInfo[0]?.status)
    setPoId(poInfo[0]?.poid)
    setPoNo(poInfo[0]?.poNumber)
    setPoDate(poInfo[0]?.poDate)
    setGtotal(poInfo[0]?.totalAmount)
    setGtax(poInfo[0]?.totalTax)
    setRemark(poInfo[0]?.remarks)
    setDueAmt(poInfo[0]?.dueAmount)
  }, [poInfo])

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

  const addItem = async () => {
    setSave(true)
    if (qty > 0 && discount >= 0 && tax >= 0) {
      let item_obj = {
        LoginID,
        Token,
        Seckey:"abc",
        POID,
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
      }
      console.log('addItemobj', item_obj)
      try {
        const res = await axios.post(`/inventory/po/item`, item_obj)
        console.log('addItemres', res)
        if (res?.data[0][0].status === "Success") {
          toast.success(res?.data[0][0].message)
          setSave(false)
          resetPOItem()
          handleFlag()
        }
      } catch (error) {
        console.log('error', error)
        toast.error('Something went wrong, Try again!')
      }
    } else {
      toast.error('Fill all fields!')
    }
  }

  const POItemForm = () => {
    return (
      <Form>
        <Row className='d-flex flex-row justify-content-center align-items-center'>
          <Col md='2'>
            <Label>Product Category</Label>
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
            <Label>Product Name</Label>
            <Select
              isDisabled={selCat === ''}
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              options={productData.filter(c => c.categoryID === selCat)}
              value={productData.filter(c => c.value === selProduct)}
              onChange={e => {
                setSelProduct(e.value)
                setRate(e.PurchasePrice)
              }}
            />
          </Col>
          <Col>
            <Label>Rate</Label>
            <Input
              type='number'
              value={rate}
              onChange={e => setRate(e.target.value)}
              invalid={save && rate === ''}
            />
            {save && rate === '' && <FormFeedback>Rate is required</FormFeedback>}
          </Col>
          <Col>
            <Label>Quantity</Label>
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

  const deleteItem = async (id) => {
    try {
      const res = await axios.post(`/inventory/po/delete_item/${id}?LoginID=${LoginID}&Token=${Token}`)
      console.log('itemDelres', res)
      if (res?.data[0][0].status === "Success") {
        toast.success(res?.data[0][0].message)
        handleFlag()
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong, Try again!')
    }
  }

  const updateInfo = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        VendorName: vendorName,
        VendorID: selVendorId,
        PONumber: poNo,
        PODate: moment(poDate).format('YYYY-MM-DD'),
        Remarks: remark,
        TotalAmount: gtotal,
        TotalTax: gtax,
        SGST: "0.0",
        CGST: "0.0",
        IGST: "0.0",
        DueAmount: dueAmt,
        PropertyID
      }
      console.log('Edit obj', obj)
      const res = await axios.post(`/inventory/update_po?POID=${POID}`, obj)
      console.log('updateInfores', res)
      if (res?.data[0][0].status === "Success") {
        toast.success(res?.data[0][0].message)
        setEditInfo(false)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong, Try again!')
    }
  }

  const updateItem = async (obj) => {
    if (
      obj.Quantity > 0 &&
      obj.Quantity !== '' &&
      obj.Rate > 0 &&
      obj.Rate !== '' &&
      obj.Discount >= 0 &&
      obj.Discount !== '' &&
      obj.TotalTax >= 0 &&
      obj.TotalTax !== ''
    ) {
      try {
        let item_obj = {
          LoginID,
          Token,
          ProductCategoryID: obj.ProductCategoryID,
          ProductID: obj.ProductID,
          Discount: obj.Discount,
          Quantity: obj.Quantity,
          TotalAmount: obj.TotalAmount,
          TotalTax: obj.TotalTax,
          SGST: obj.TotalTax / 2,
          CGST: obj.TotalTax / 2,
          IGST: obj.TotalTax,
          Rate: obj.Rate
        }
        const res = await axios.post(`/inventory/po/update_item?POItemID=${obj.POItemID}`, item_obj)
        console.log('itemUpdateres', res)
        if (res?.data[0][0].status === "Success") {
          toast.success(res?.data[0][0].message)
          setEditItem(false)
          setEditItemId('')
          handleFlag()
        }
      } catch (error) {
        console.log('itemUpdate', error)
        toast.error('Something went wrong, Try again!')
      }
    } else {
      toast.error('Make sure Quantity, Rate, Discount and Tax are not blank values!')
    }
  }

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

  const changeTotal = (id, new_arr) => {
    console.log('hit')
    let updated_arr = new_arr.map(i => {
      if (i.POItemID === id && i.Quantity > 0 && i.Discount >= 0 && i.TotalTax >= 0) {
        console.log('hit2')
        let new_total_amt = i.Rate * i.Quantity
        console.log('new_total_amt', new_total_amt)
        let discount_amt = (i.Discount / 100) * new_total_amt
        let cal_total = new_total_amt - discount_amt
        let tax_amt = cal_total * (i.TotalTax / 100)
        i.TotalAmount = cal_total + tax_amt
      }
      return i
    })
    setPOItems(updated_arr)
  }

  const changeCatId = (id, catId) => {
    let new_arr = poItems.map(i => {
      if (i.POItemID === id) {
        i.ProductCategoryID = catId
        i.ProductID = ''
        i.Rate = 0
        i.Quantity = 0
        i.TotalAmount = 0
      }
      return i
    })
    setPOItems(new_arr)
  }

  const changeProId = (id, prId) => {
    let new_arr = poItems.map(i => {
      if (i.POItemID === id) {
        i.ProductID = prId
      }
      return i
    })
    setPOItems(new_arr)
  }

  const changeRate = (id, rate) => {
    let new_arr = poItems.map(i => {
      if (i.poItemID === id) {
        i.rate = rate
      }
      return i
    })
    // setPOItems(new_arr)
    changeTotal(id, new_arr)
  }

  const changeQty = (id, qty) => {
    let new_arr = poItems.map(i => {
      if (i.poItemID === id) {
        i.quantity = qty
      }
      return i
    })
    // setPOItems(new_arr)
    changeTotal(id, new_arr)
  }

  const changeDiscount = (id, discount) => {
    let new_arr = poItems.map(i => {
      if (i.poItemID === id) {
        i.discount = discount
      }
      return i
    })
    // setPOItems(new_arr)
    changeTotal(id, new_arr)
  }

  const changeTax = (id, tax) => {
    let new_arr = poItems.map(i => {
      if (i.poItemID === id) {
        i.totalTax = tax
      }
      return i
    })
    // setPOItems(new_arr)
    changeTotal(id, new_arr)
  }

  return (
    <>
      <Row>
        <Col md='12' className='mb-1'>
          <Row>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Vendor</Label>
              <Select
                isDisabled={!editInfo}
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={vendorData}
                value={vendorData.filter(i => i.value === selVendorId)}
                onChange={e => {
                  setSelVendorId(e.value)
                  setVendorName(e.label)
                }}
              />
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>PO Number</Label>
              <Input
                type='text'
                value={poNo}
                disabled={!editInfo}
                onChange={e => setPoNo(e.target.value)}
                invalid={editInfo && poNo === ''}
              />
              {editInfo && poNo === '' && <span className='text-danger'>PO number is required</span>}
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>PO Date</Label>
              <Flatpickr
                id='startDate'
                className='form-control'
                options={{
                  altInput: true,
                  altFormat: 'd-m-y',
                  dateFormat: 'd-m-y',
                }}
                value={moment(poDate).toISOString()}
                onChange={date => setPoDate(date[0])}
              />
              {editInfo && poDate === '' && <span className='text-danger'>PO Date is required</span>}
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Total Amount</Label>
              <Input
                type='text'
                value={gtotal}
                disabled />
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>Remark</Label>
              <Input
                type='text'
                disabled={!editInfo}
                value={remark}
                onChange={e => setRemark(e.target.value)}
              />
            </Col>
            <Col md='4' className='d-flex flex-row flex-wrap justify-content-md-end justify-content-center align-items-center'>
              {
                poStatus !== "Invoiced" && (
                  <>
                    {editInfo ? (
                      <Button size='sm' color='warning' className='me-1' onClick={() => updateInfo()}><Upload size={17} /> Update</Button>
                    ) : (
                      <Button size='sm' color='primary' className='me-1' onClick={() => setEditInfo(true)}><Edit3 size={17} /> Edit</Button>
                    )}
                    <Button size='sm' color='primary' className='me-1' disabled={poItems.length === 0} onClick={() => handleInvoice()}><RiBillLine size={17} /> Invoice</Button>

                  </>
                )
              }
              <Button size='sm' color='primary' className='me-1' disabled={poItems.length === 0}
                onClick={() => openLinkInNewTab(`/purchaseOrderInvoice/${POID}`)}
              >
                <AiFillPrinter size={17} /> Print Bill
              </Button>
            </Col>
            {/* {
              poStatus !== "Invoiced" && (
                <Col md='4' className='d-flex flex-row flex-wrap justify-content-md-end justify-content-center align-items-center'>
                  {editInfo ? (
                    <Button size='sm' color='warning' className='me-1' onClick={() => updateInfo()}><Upload size={17} /> Update</Button>
                  ) : (
                    <Button size='sm' color='primary' className='me-1' onClick={() => setEditInfo(true)}><Edit3 size={17} /> Edit</Button>
                  )}
                  <Button size='sm' color='primary' className='me-1' disabled={poItems.length === 0} onClick={() => handleInvoice()}><RiBillLine size={17} /> Invoice</Button>
                  <Button size='sm' color='primary' className='me-1' disabled={poItems.length === 0}><AiFillPrinter size={17} /> Print Bill</Button>
                </Col>
              )
            } */}

          </Row>
          {
            poItems.length > 0 && (
              poItems.map((i, index) => {
                console.log('i===>', i)
                let total = i?.TotalAmount - ((i?.totalTax * 100) / i?.totalAmount)
                return (
                  <>
                    <Row key={index + 1} className='mb-1 d-flex flex-row justify-content-center align-items-center'>
                      <Col md='2'>
                        {index === 0 && <Label>Product Category s</Label>}
                        <Select
                          isDisabled={i.poItemID === editItemId ? false : true}
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          options={categoryData}
                          // value={categoryData.filter(c => c.value === i.productCategoryID)}
                          value={categoryData.find(c => c.value === i.productCategoryID)}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeCatId(i.poItemID, e.value)
                            }
                          }}
                        />
                      </Col>
                      <Col md='2'>
                        {index === 0 && <Label>Product Name</Label>}
                        <Select
                          isDisabled={i.poItemID === editItemId ? false : true}
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          options={productData.filter(c => c.categoryID === i.productCategoryID)}
                          value={productData.filter(c => c.value === i.productID)}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeProId(i.poItemID, e.value)
                              changeRate(i.poItemID, e.purchasePrice)
                            }
                          }}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Rate</Label>}
                        <Input
                          type='number'
                          value={i.rate}
                          disabled={i.poItemID === editItemId ? false : true}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeRate(i.poItemID, e.target.value)
                            }
                          }}
                          invalid={editItem && rate === ''}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Quantity</Label>}
                        <Input
                          type='number'
                          value={i.quantity}
                          disabled={i.poItemID === editItemId ? false : true}
                          // onChange={e => setQty(e.target.value)}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeQty(i.poItemID, e.target.value)
                            }
                          }}
                          invalid={editItem && qty === ''}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Discount(%)</Label>}
                        <Input
                          type='number'
                          value={i.discount}
                          disabled={i.poItemID === editItemId ? false : true}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeDiscount(i.poItemID, e.target.value)
                            }
                          }}
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
                          value={i.totalTax}
                          disabled={i.poItemID === editItemId ? false : true}
                          onChange={e => {
                            if (i.poItemID === editItemId) {
                              changeTax(i.poItemID, e.target.value)
                            }
                          }}
                        />
                      </Col>
                      <Col>
                        {index === 0 && <Label>Final Amt.</Label>}
                        <Input
                          type='number'
                          // value={(i.totalAmount).toFixed(3)} is line ko baad me uncomment kerna hai 
                          value={(i.totalAmount)} //or isko comment
                          disabled
                        />
                      </Col>
                      {
                        poStatus !== 'Invoiced' && (
                          <Col>
                            {
                              editItem && i.poItemID === editItemId ? (
                                <>
                                  <CheckSquare className='cursor-pointer me-1' color='green' size={20} onClick={() => updateItem(i)} />
                                  <X className='cursor-pointer me-1' color='grey' size={20}
                                    onClick={() => {
                                      setEditItem(false)
                                      setEditItemId('')
                                    }} />
                                </>
                              ) : (
                                <>
                                  <Edit3 className='cursor-pointer me-1' color='blue' size={20} onClick={() => {
                                    setEditItem(true)
                                    setEditItemId(i.poItemID)
                                  }} />
                                  <Trash2 onClick={() => deleteItem(i.poItemID)} className='cursor-pointer' color='red' size={20} />
                                </>
                              )
                            }
                          </Col>
                        )
                      }

                    </Row>
                  </>
                )
              })
            )
          }
          <hr />
          <Row className='my-1'>
            <Col>
              {POItemForm()}
            </Col>
          </Row>
          {
            poStatus !== "Invoiced" && (
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
            )
          }
          {
            poStatus !== "Invoiced" && (
              <Row>
                <Col className='text-center'>
                  {/* <Button
                className='mx-1 mt-1 mb-0'
                color='primary'
                disabled={itemArr.length === 0}
                onClick={() => handleSave()}
              >
                Save
              </Button> */}
                  <Button
                    className='mx-1 mt-1 mb-0'
                    color='success'
                    onClick={() => handleInvoice()}
                  >
                    Invoice
                  </Button>
                </Col>
              </Row>
            )
          }
        </Col>
      </Row>
      {openInvoice && <InvoiceModal openInvoice={openInvoice} handleInvoice={handleInvoice} POID={poId} handleShowEdit={handleShowEdit} />}
    </>


  )
}

export default EditPO