import { React, useEffect, useState } from 'react'
import { Row, Col, Button, Input, Table, Modal, ModalHeader, ModalBody, Label, InputGroupText, InputGroup, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import axios from '../../../API/axios'
import { ChevronDown, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

let productItems = [
  { value: '-', label: '-' },
  { value: 'Vendor 1', label: 'Vendor 1' },
  { value: 'Vendor 2', label: 'Vendor 2' },
  { value: 'Vendor 3', label: 'Vendor 3' }
]

const Category = ({ handleRefresh }) => {

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [categoryName, setCategoryName] = useState('')

  const [initialDeleteItem, setInitialDeleteItem] = useState('')
  const [initialEditItem, setInitialEditItem] = useState('')

  const [editCategoryName, setEditCategoryName] = useState('')
  const [categoryData, setCategoryData] = useState([])

  const [showEdit, setShowEdit] = useState(false)
  const [del, setDel] = useState(false)

  const getAllCategoryData = async () => {
    try {
      const res = await axios.get(`/inventory/product/categoryall?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
      console.log('responseDta: ', res)
      setCategoryData(res.data[0])
      productItems = []
      res.data[0].map(i => productItems.push({ "value": i.categoryName, "label": i.categoryName }))
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getAllCategoryData()
  }, [showEdit, del])

  const categoryTable = [
    {
      name: 'Ref ID',
      selector: row => row.categoryID,
      style: {
        color: 'black'
      }
    },
    {
      name: "Category Name",
      selector: row => row.categoryName
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return (
          <>
            {
              row.Status === 'Active' ? (
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
          <Edit className='me-50 pe-auto' onClick={() => { setInitialDeleteItem(row.categoryID), setEditCategoryName(row.categoryName), setShowEdit(true) }} size={15} />
          <Trash className='me-50' onClick={() => { setInitialDeleteItem(row.categoryID), setDel(true) }} name={row.age} size={15} />
        </>
      )

    }
  ]

  const onEditSubmit = () => {
    axios.post('/inventory/product/update_category', {
      "LoginID": LoginID,
      "Token": Token,
      "Seckey": "abc",
      "CategoryName": editCategoryName,
      "CategoryID": initialDeleteItem,
      "Event": "update"
    }).then(res => {
      console.log('lalares__', res.data)
      if (res.data[0][0].status == "Success") {
        toast.success(res.data[0][0].message, { position: 'top-right' })
        setShowEdit(!showEdit)
        getAllCategoryData()
        handleRefresh()
      }
    }).catch(e => {
      setShowEdit(!showEdit)
      toast.error(e.response.data.Message, { position: 'top-right' })
    })

  }

  const onSubmitCategory = async () => {
    if (categoryName !== '') {
      try {
        let obj = {
          LoginID,
          Token,
          CategoryName: categoryName,
          PropertyID
        }
        const res = await axios.post(`/inventory/product/category`, obj)
        console.log('cataegorySubmitres', res)
        if (res?.data[0][0]?.status === "Success") {
          toast.success(res?.data[0][0]?.message)
          getAllCategoryData()
          setCategoryName('')
          handleRefresh()
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error?.response?.data?.Message)
      }
    } else {
      toast.error("Please enter category name")
    }
  }

  const onDeleteItem = () => {
    console.log(initialDeleteItem)
    axios.post(`/inventory/product/delete_category/${initialDeleteItem}?LoginID=${LoginID}&Token=${Token}`).then(res => {
      if (res.data[0][0].status === "Success") {
        toast.success(res.data[0][0].message, { position: 'top-right' })
        setDel(!del)
        getAllCategoryData()
        handleRefresh()
      }
    }).catch(e => {
      setDel(!del)
      toast.error(e.response.data.Message, { position: 'top-right' })
      console.log(e)
    })
  }

  return (
    <>
      <Row>
        <Col md='3' className='mb-1 d-flex justify-content-end align-items-center'>
          <h5>New Product Category</h5>
        </Col>
        <Col md='5' className='mb-1'>
          <Input type='text' placeholder='Enter Product Category' value={categoryName} onChange={e => setCategoryName(e.target.value)} />
        </Col>
        <Col md='4' className='mb-1'>
          <Button color='primary me-1' onClick={onSubmitCategory} >Submit</Button>
          {categoryName !== '' && <Button color='danger' onClick={() => setCategoryName('')}>Clear</Button>}
        </Col>
      </Row>
      <DataTable
        noHeader
        data={categoryData}
        columns={categoryTable}
        className='react-dataTable'
        pagination
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
      <Modal
        isOpen={showEdit}
        toggle={() => setShowEdit(!showEdit)}
        className='modal-dialog-centered modal-lg'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
          Edit Category
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <Row>
            <Col md='12' className='mb-2'>
              <Label className='form-label'>Product Category</Label>
              <Input type='text' placeholder='Enter Product Category' defaultValue={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
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
      {/* <Modal
        isOpen={del}
        toggle={() => setDel(!del)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
          Are you sure to delete this permanently?
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50'>
          <Row tag='form' className='gy-1 gx-2 mt-75' >
            <Col className='text-end mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary'>
                OK
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setDel(!del)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal> */}
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
        showEdit | del ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default Category