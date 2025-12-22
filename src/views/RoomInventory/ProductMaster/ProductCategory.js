import { React, useState, useEffect } from 'react'
import { Row, Col, Button, Input, Modal, ModalHeader, ModalBody, Label, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import axios from '../../../API/axios'
import { ChevronDown, Edit, Trash } from 'react-feather'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'



const category = [
  { value: '-', label: '-' },
  { value: 'abc', label: 'abc' },
  { value: 'xyz', label: 'xyz' }
]

const ProductCategory = ({ refresh }) => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Product Master"

    return () => {
      document.title = prevTitle
    }
  }, [])


  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [productCategory, setProductCategory] = useState([])
  const [editProductCategory, setEditProductCategory] = useState([])
  // console.log('editProductCategory', editProductCategory);
  const [productPrice, setProductPrice] = useState('')
  const [selectedCategoryID, setSelecctedCategoryID] = useState('')
  const [editCatData, setEditCatData] = useState('')
  // console.log(editCatData);
  const [productSellingPrice, setProductSellingPrice] = useState('')
  const [initialDeleteItem, setInitialDeleteItem] = useState('')
  // console.log('initialDeleteItem', initialDeleteItem);
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [categoryData, setCategoryData] = useState('')
  // console.log(categoryData);
  const [addNewProduct, setAddNewProduct] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [del, setDel] = useState(false)
  const [display, setDisplay] = useState(false)
  const getAllProductData = async () => {
    try {
      const res = await axios.get(`/inventory/product_all?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
      console.log('res', res)
      let result = res?.data[0]
      if (result.length > 0) {
        let arr = result.map(r => {
          return { "value": r.productName, "label": r.productName, ...r }
        })
        setProductCategory(arr)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getAllCategoryData = () => {
    axios.get(`/inventory/product/categoryall?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`).then(res => {
      // console.log('responseDta: ', res)
      let arr = res.data[0].map(i => {
        return { "value": i.categoryName, "label": i.categoryName, ...i }
      })
      setCategoryData(arr)
    }).catch(e => {
      console.log(e)
    })
  }

  const getSingleProductData = (id) => {
    axios.get(`/inventory/product?LoginID=${LoginID}&Token=${Token}&ProductID=${id}`).then(res => {
      setEditProductCategory(res.data[0])
      let data = res.data[0]
      // console.log(data[0]?.CategoryID);
      setEditCatData(data[0]?.categoryID)
      setProductCode(data[0].productCode)
      setProductName(data[0].productName)
      setProductPrice(data[0].purchasePrice)
      setProductSellingPrice(data[0].sellingPrice)
    }).catch(e => {
      console.log(e)
    })

  }

  useEffect(() => {
    getAllProductData()
    getAllCategoryData()
  }, [refresh, addNewProduct, showEdit, del])

  const submitNewProduct = async () => {
    setDisplay(true)
    if (productCategory && productCode && productName && productPrice && productSellingPrice) {
      try {
        let obj = {
          LoginID,
          Token,
          Seckey:"abc",
          PropertyID,
          CategoryID: selectedCategoryID,
          ProductName: productName,
          ProductCode: productCode,
          PurchasePrice: productPrice,
          SellingPrice: productSellingPrice,
        }
        const res = await axios.post('/inventory/product', obj, {
          headers: {
            LoginID,
            Token
          }
        })
        console.log('res', res)
        toast.success(res.data[0][0].message)
        setAddNewProduct(false)
        getAllProductData()
      } catch (error) {
        console.log('error', error?.response)
        toast.error(error?.response?.data?.message)
      }
    } else {
      toast.error("Please enter required fileds!")
    }

  }

  const onEditSubmit = () => {
    setDisplay(true)
    if (editCatData && productCode && productName && productPrice && productSellingPrice) {
      axios.post('/inventory/update_product', {
        "LoginID": LoginID,
        "Token": Token,
        "ProductID": initialDeleteItem,
        "CategoryID": editCatData || editProductCategory[0]?.categoryID,
        "ProductCode": productCode || editProductCategory[0]?.productCode,
        "ProductName": productName || editProductCategory[0]?.productName,
        "PurchasePrice": productPrice || editProductCategory[0]?.purchasePrice,
        "SellingPrice": productSellingPrice || editProductCategory[0]?.sellingPrice
      }).then(res => {
        // console.log(res);
        if (res.data[0][0].status == "Success") {
          toast.success(res.data[0][0].message, { position: 'top-right' })
          setShowEdit(!showEdit)
          getAllProductData()
        }
      }).catch(e => {
        toast.error(e.response.data.message, { position: 'top-right' })
        showEdit(!showEdit)
      })
    } else {
      toast.error("Please enter required fileds!")
    }
  }

  const onDeleteItem = () => {
    axios.post(`/inventory/delete_product/${initialDeleteItem}?LoginID=${LoginID}&Token=${Token}`).then(res => {
      if (res.data[0][0].status == "Success") {
        toast.success(res.data[0][0].message, { position: 'top-right' })
        setDel(!del)
        getAllProductData()
      }
    }).catch(e => {
      toast.error(e.response.data.message, { position: 'top-right' })
      setDel(!del)
    })

  }

  const productCategoryTable = [
    // {
    //   name: 'Ref ID',
    //   width: '17rem',
    //   selector: row => row.ProductID,
    //   style: {
    //     color: 'black'
    //   }
    // },
    {
      name: 'Code',
      width: '17rem',
      selector: row => row.productCode,
      style: {
        color: 'black'
      }
    },
    {
      name: "Product Name",
      width: '22rem',
      selector: row => row.productName
    },
    {
      name: 'Category',
      width: '15rem',
      selector: row => categoryData && categoryData?.map(c => {
        if (c.categoryID === row.categoryID) {
          return c.label
        }
      })
    },
    {
      name: "Purchase Price",
      selector: row => row.purchasePrice,
      width: '10rem'
    },
    {
      name: "Selling  Price",
      selector: row => row.sellingPrice,
      width: '10rem'
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return (
          <>
            {
              row.status === 'Active' ? (
                <Badge color='light-success'> {row.status}</Badge>
              ) : (
                <Badge color='light-danger'> {row.status}</Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Action',
      selector: row => row.age,
      cell: row => (
        <>
          <Edit className='me-50 pe-auto' onClick={() => { getSingleProductData(row.productID), setInitialDeleteItem(row.productID), setShowEdit(true) }} size={15} />
          <Trash className='me-50' onClick={() => { setInitialDeleteItem(row.productID), setDel(true) }} name={row.age} size={15} />
        </>
      )

    }
  ]

  // var productData = productCategory.map(i => { return ({ "value": i.ProductName, "label": i.ProductName }) })
  // var categoryDataID = productCategory.map(i => { return ({ "value": i.CategoryID, "label": i.CategoryID }) })
  var categoryList = categoryData && categoryData?.filter(i => i.status == "Active").map(i => { return ({ value: i.categoryID, label: i.categoryName }) })

  return (
    <>
      {console.log('ccat', categoryData)}
      {console.log('Pcat', productCategory)}
      <Row className='d-flex flex-row align-items-center'>
        <Col className='mb-1'>
          <Label>Filter products by Category</Label>
          <Select
            theme={selectThemeColors}
            className='react-select w-100'
            classNamePrefix='select'
            onChange={e => e === null ? setSelecctedCategoryID('') : setSelecctedCategoryID(e.value)}
            options={categoryList}
            isClearable
          />
        </Col>
        <Col className='mb-1 text-end'>
          <Button color='primary me-1' onClick={() => setAddNewProduct(true)}>Add New Product</Button>
        </Col>
      </Row>
      {/* {console.log(selectedCategoryID)}
      {/* productCategory.filter(i => i.Status === "Active" && i.CategoryID === selectedCategoryID) */}
      {console.log('productCategory', productCategory)}
      <DataTable
        noHeader
        data={selectedCategoryID === '' ? productCategory.filter(i => i.status === "Active") : productCategory.filter(i => i.categoryID === selectedCategoryID)}
        columns={productCategoryTable}
        className='react-dataTable'
        pagination
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}

      />

      {/* New Product Modal */}
      <Modal
        isOpen={addNewProduct}
        toggle={() => setAddNewProduct(!addNewProduct)}
        className='modal-dialog-centered modal-lg'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setAddNewProduct(!addNewProduct)}>
          Product Details
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Category <span className='text-danger'>*</span></Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                // defaultInputValue={category[0]?.label || "select"}
                options={categoryList}
                isClearable={false}
                onChange={e => setSelecctedCategoryID(e.value)}
                invalid={display && selectedCategoryID === ''}
              />
              {display && !selectedCategoryID ? <span className='error_msg_lbl'>Enter Category </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Product Code <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Code' invalid={display && productCode === ''} onChange={e => setProductCode(e.target.value)} />
              {display && !productCode ? <span className='error_msg_lbl'>Enter Product Code </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Product Name <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Product Name' onChange={e => setProductName(e.target.value)} invalid={display && productName === ''} />
              {display && !productName ? <span className='error_msg_lbl'>Enter Product Name </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Purchase Price <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Purchase Price' onChange={e => setProductPrice(e.target.value)} invalid={display && productPrice === ''} />
              {display && !productPrice ? <span className='error_msg_lbl'>Enter Purchase Price </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Selling Price <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Selling Price' onChange={e => setProductSellingPrice(e.target.value)} invalid={display && productSellingPrice === ''} />
              {display && !productSellingPrice ? <span className='error_msg_lbl'>Enter Selling Price </span> : null}
            </Col>

          </Row>
          <Row>
            <Col md='12 text-end mt-3'>
              <Button.Ripple color='primary' className='me-2' onClick={submitNewProduct}>Submit</Button.Ripple>
              <Button.Ripple color='secondary' outline onClick={() => setAddNewProduct(!addNewProduct)}>Cancel</Button.Ripple>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEdit}
        toggle={() => setShowEdit(!showEdit)}
        className='modal-dialog-centered modal-lg'
        backdrop={false}
      >
        {/* {console.log('editProductCategory', editProductCategory)} */}
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
          Edit Product Category {editProductCategory[0]?.productName}
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <Row>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Category <span className='text-danger'>*</span></Label>
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
              {display && !editCatData ? <span className='error_msg_lbl'>Enter Category </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Product Code <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Code' value={productCode} invalid={display && productCode === ''} onChange={e => setProductCode(e.target.value)} />
              {display && !productCode ? <span className='error_msg_lbl'>Enter Product Code </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Product Name <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Product Name' value={productName} invalid={display && productName === ''} onChange={e => setProductName(e.target.value)} />
              {display && !productName ? <span className='error_msg_lbl'>Enter Product Name </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Purchase Price <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Purchase Price' value={productPrice} invalid={display && productPrice === ''} onChange={e => setProductPrice(e.target.value)} />
              {display && !productPrice ? <span className='error_msg_lbl'>Enter Purchase Price </span> : null}
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label'>Selling Price <span className='text-danger'>*</span></Label>
              <Input type='text' placeholder='Enter Selling Price' value={productSellingPrice} invalid={display && productSellingPrice === ''} onChange={e => setProductSellingPrice(e.target.value)} />
              {display && !productSellingPrice ? <span className='error_msg_lbl'>Enter Selling Price </span> : null}
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

      {/* Delete Product Modal */}
      <Modal
        isOpen={del}
        toggle={() => setDel(!del)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
          Are you sure to delete this permanently?
        </ModalHeader>
        <ModalBody>
          <Row className='text-center'>
            <Col xs={12}>
              <Button color='danger' className='m-1' onClick={onDeleteItem}>
                Delete
              </Button>
              <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {
        addNewProduct | showEdit | del ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default ProductCategory