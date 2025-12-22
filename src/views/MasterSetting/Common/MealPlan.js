import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import { Edit, RefreshCcw, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import axios, { Staah } from '../../../API/axios'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import { selectThemeColors } from '@utils'
import CreatableSelect from 'react-select/creatable'
import MealOta from './MealOta'

const MealPlan = () => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token, PropertyID } = getUserData

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [mealNameOption, setMealNameOptions] = useState([])
  const [selected_mealPlan, setSelected_mealPlan] = useState()

  const [del, setDel] = useState(false)

  const [ota, setOta] = useState(false)
  const handleOta = () => setOta(!ota)

  const [MealLabel, setMealLabel] = useState('')
  const [MealType, setMealType] = useState('')
  const [MealCode, setMealCode] = useState('')
  const [RatePlan, setRatePlan] = useState('')
  const [Description, setDescription] = useState('')
  const [Price, setPrice] = useState('')

  const [display, setDisplay] = useState(false)

  const [meals, setMeals] = useState([])
  console.log('meals', meals)
  const [isData, setIsData] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)

  const getStaahCodes = async () => {
    try {
      const obj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "staahcodes"
      }
      const res = await axios.post('/getdata/mealdetails', obj)
      console.log('stahh res', res)
      if (res.data[0].length > 0) {
        let meals = res.data[0]
        setMealNameOptions(meals.map(m => {
          return { value: m.mealCode, label: m.mealType }
        }))
      }
    } catch (error) {
      console.log('stahh err', error)
    }
  }

  useEffect(() => {
    getStaahCodes()
  }, [])

  const mealDetailsList = () => {
    setLoader(true)
    try {
      const mealDetailsListBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post('/getdata/mealdetails', mealDetailsListBody)
        .then(response => {
          console.log('direct', response?.data[0])
          setMeals(response?.data[0])
          setLoader(false)
          if (meals !== []) { setIsData(true) }
        })
    } catch (error) {
      setLoader(false)
      console.log("State Error", error.message)
    }
  }

  useEffect(() => {
    mealDetailsList()
  }, [isData])

  const handleCreateMealNameOption = (e) => {
    console.log(e)
    let meal = e
    let newMeal = { value: 0, label: meal }
    setMealNameOptions(prev => [...prev, newMeal])
    setMealType(newMeal.value)
    setMealCode(newMeal.value)
    setMealLabel(newMeal.label)
  }

  const mealDetailsInsert = async () => {
    const mealDetailsInsertBody = {
      LoginID,
      Token,
      Seckey: "abc",
      Event: "insert",
      Description,
      MealCode,
      RatePlan,
      MealType: MealLabel,
      Price
    }
    console.log('mealDetailsInsertBody', JSON.stringify(mealDetailsInsertBody))
    try {
      let res = await axios.post(`/getdata/mealdetails`, mealDetailsInsertBody)
      if (res.status === 200) {
        mealDetailsList()
        setMealLabel('')
        setMealType('')
        setMealCode('')
        setRatePlan('')
        setDescription('')
        setPrice('')
        setDisplay(false)
        //toast.success('Meal Plan Added!', { position: "top-center" })
        toast.success(res.data[0][0].message)
      }
    } catch (error) {
      console.log("Meal Details Insert Error", error.message)
      toast.error(error.response.data.message)
    }
  }

  const handleSubmit = () => {
    console.log('hit')
    setDisplay(true)
    // console.log('MealLabel.trim()', MealLabel.trim())
    // console.log('MealCode.trim()', MealCode.trim())
    // console.log('RatePlan.trim()', RatePlan.trim())
    // console.log('Description.trim()', Description.trim())
    // console.log('Price.trim()', Price.trim())
    if (MealLabel.trim() && MealCode && RatePlan.trim() && Description.trim() && Price.trim() !== '') {
      mealDetailsInsert()
    }
  }

  const EditMealPlanModal = ({ id }) => {
    const mealData = meals?.filter(meal => meal.mealID === id)

    const [editMealId] = useState(mealData[0]?.mealID)
    const [editStatus] = useState(mealData[0]?.Status)
    const [editMealType, setEditMealType] = useState(mealData[0]?.mealType)
    const [editMealCode, setEditMealCode] = useState(mealData[0]?.mealCode)
    const [editRatePlan, setEditRatePlan] = useState(mealData[0]?.ratePlan)
    const [editDescription, setEditDescription] = useState(mealData[0]?.description)
    const [editPrice, setEditPrice] = useState(mealData[0]?.price)

    const [editDisplay, setEditDisplay] = useState(false)

    const mealDetailsEdit = () => {
      const mealDetailsEditBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "update",
        MealID: editMealId,
        Description: editDescription,
        MealCode: editMealCode,
        RatePlan: editRatePlan,
        MealType: editMealType,
        Price: editPrice,
        Status: editStatus
      }
      try {
        axios.post(`/getdata/mealdetails`, mealDetailsEditBody)
          .then((res) => {
            handleEditModal()
            //toast.success('Meal Plan Edited Successfully!', { position: "top-center" })
            mealDetailsList()
            toast.success(res.data[0][0].message)
          }).catch(function (error) {
            toast.error(error.response.data.message)
          })
      } catch (error) {
        console.log("Meal Plan Edit Error", error.message)
      }
    }

    const editHandleSubmit = () => {
      setEditDisplay(true)
      if (editMealType.trim() && editRatePlan.trim() && editDescription.trim() && editPrice !== '') {
        mealDetailsEdit()
        // handleEditModal()
        // toast.success('Meal Plan Edited Successfully!', { position: "top-center" })
      }
    }

    return (
      <Modal
        isOpen={showEdit}
        toggle={handleEditModal}
        className='modal-dialog-centered modal-lg'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={handleEditModal}>
          <span className=' mb-1'>Edit Meal Plan</span>
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <>
            <Form>
              {/* <Row>
                <Col lg='6' md='6 mb-2'>
                  <div className='d-flex'>
                    <Label for='bookingSourceName'>
                      <span className='text-danger'>*</span>Name
                    </Label>
                    <Input
                      className='ms-3'
                      type='text'
                      name='editMealType'
                      id='editMealType'
                      value={editMealType}
                      onChange={e => setEditMealType(e.target.value)}
                      invalid={editDisplay && editMealType.trim() === ''}
                    />
                  </div>
                  {editDisplay === true && !editMealType.trim() ? <span className='error_msg_lbl editMealType'>Name is required </span> : <></>}
                </Col>
                <Col lg='6' md='6 mb-2'>
                  <div className='d-flex'>
                    <Label className='mt-1' for='MealCode'>Code</Label>
                    <Input
                      className='ms-1'
                      type='text'
                      name='MealCode'
                      id='MealCode'
                      value={editMealCode}
                      onChange={e => setEditMealCode(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6' md='6 mb-2'>
                  <div className='d-flex'>
                    <Label className='mt-1' for='RatePlan'>
                      <span className='text-danger'>*</span>Rate Plan
                    </Label>
                    <Input
                      className='ms-1'
                      type='text'
                      name='RatePlan'
                      id='RatePlan'
                      value={editRatePlan}
                      onChange={e => setEditRatePlan(e.target.value)}
                      invalid={editDisplay && editRatePlan.trim() === ''}
                    />
                  </div>
                  {editDisplay === true && !editRatePlan.trim() ? <span className='error_msg_lbl editMealType'>Rate Plan is required </span> : null}
                </Col>
                <Col lg='3' md='3 mb-2'>
                  <div className='d-flex'>
                    <Label className='mt-1' for='Description'>
                      <span className='text-danger'>*</span>Description
                    </Label>
                    <Input
                      className='ms-5'
                      type='text'
                      name='Description'
                      id='Description'
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      invalid={editDisplay && editDescription.trim() === ''}
                    />
                  </div>
                  {editDisplay === true && !editDescription.trim() ? <span className='error_msg_lbl editDescription'>Description required</span> : null}
                </Col>
                <Col lg='3' md='3 mb-2'>
                  <div className='d-flex'>
                    <Label className='mt-1' for='Price'>
                      <span className='text-danger'>*</span>Price
                    </Label>
                    <Input
                      className='ms-1'
                      type='number'
                      name='Price'
                      id='Price'
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      invalid={editDisplay && editPrice === ''}
                    />
                  </div>
                  {editDisplay === true && !editPrice ? <span className='error_msg_lbl ms-5'>Price required </span> : null}
                </Col>
              </Row>
              <Row>
                <Col md='12 mb-2 text-center'>
                  <Button className='me-3' color='primary' onClick={editHandleSubmit}>Submit</Button>
                  <Button
                    color='secondary'
                    outline
                    onClick={handleEditModal}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row> */}
              <Row>
                <Col lg='4' md='12' sm='12' className='mb-lg-1'>
                  <Row>
                    <Col lg='2' md='12' sm='12'>
                      <Label for='bookingSourceName'>
                        <span className='text-danger'>*</span>Name
                      </Label>
                    </Col>
                    <Col lg='10' md='12' sm='12'>
                      <Input
                        className='w-100'
                        type='text'
                        name='editMealType'
                        id='editMealType'
                        value={editMealType}
                        onChange={e => setEditMealType(e.target.value)}
                        invalid={editDisplay && editMealType.trim() === ''}
                      />
                      {editDisplay === true && !editMealType.trim() ? <span className='error_msg_lbl'>Name is required </span> : <></>}
                    </Col>
                  </Row>
                </Col>
                <Col lg='4' md='12' sm='12' className='mb-lg-1'>
                  <Row>
                    <Col lg='2' md='12' sm='12'>
                      <Label className='mt-1' for='MealCode'>Code</Label>
                    </Col>
                    <Col lg='10' md='12' sm='12'>
                      <Input
                        className='ms-lg-1 mb-sm-1'
                        type='text'
                        name='MealCode'
                        id='MealCode'
                        value={editMealCode}
                        onChange={e => setEditMealCode(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg='4' md='12' sm='12' className='mb-lg-1'>
                  <Row>
                    <Col lg='2' md='12' sm='12'>
                      <Label for='RatePlan'>
                        <span className='text-danger'>*</span>Rate Plan
                      </Label>
                    </Col>
                    <Col lg='10' md='12' sm='12'>
                      <Input
                        // className='ms-1'
                        type='text'
                        name='RatePlan'
                        id='RatePlan'
                        value={editRatePlan}
                        onChange={e => setEditRatePlan(e.target.value)}
                        invalid={editDisplay && editRatePlan.trim() === ''}
                      />
                      {editDisplay === true && !editRatePlan.trim() ? <span className='error_msg_lbl'>Rate Plan is required </span> : null}
                    </Col>
                  </Row>
                </Col>
                <Col lg='4' md='12' sm='12'>
                  <Row>
                    <Col lg='2' md='12' sm='12'>
                      <Label for='Price'>
                        <span className='text-danger'>*</span>Price
                      </Label>
                    </Col>
                    <Col lg='10' md='12' sm='12' className='mb-sm-1'>
                      <Input
                        className='ms-lg-1'
                        type='number'
                        name='Price'
                        id='Price'
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        invalid={editDisplay && editPrice === ''}
                      />
                      {editDisplay === true && !editPrice ? <span className='error_msg_lbl ms-lg-1'>Price required </span> : null}
                    </Col>
                  </Row>
                </Col>

                <Col lg='8' md='12' sm='12'>
                  <Row>
                    <Col lg='3' md='4' sm='12'>
                      <Label className='mt-1' for='Description'>
                        <span className='text-danger'>*</span>Description
                      </Label>
                    </Col>
                    <Col lg='9' md='12' sm='12' className='mb-sm-1'>
                      <Input
                        className='ms-lg-1'
                        type='text'
                        name='Description'
                        id='Description'
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        invalid={editDisplay && editDescription.trim() === ''}
                      />
                      {editDisplay === true && !editDescription.trim() ? <span className='error_msg_lbl ms-lg-1'>Description req</span> : null}
                    </Col>
                  </Row>
                </Col>

              </Row>
              <Row>
                <Col md='12 mb-2 text-center'>
                  <Button className='me-3' color='primary' onClick={editHandleSubmit}>Submit</Button>
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
          </>
        </ModalBody>
      </Modal>
    )
  }

  const DeleteMealPlanModel = ({ id }) => {

    const data = meals?.filter(meal => meal.mealID === id)
    const [mealId] = useState(data[0]?.mealID)

    const mealDetailsDelete = () => {
      const mealDetailsDeleteBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "delete",
        MealID: mealId
      }
      try {
        axios.post(`/getdata/mealdetails`, mealDetailsDeleteBody)
          .then((res) => {
            mealDetailsList()

            toast.success(res.data[0][0].message)
          }).catch(function (error) {
            toast.error(error.response.data.message)
          })
      } catch (error) {
        console.log("Meal Details Delete Error", error.message)
      }
    }

    const handleDeleteMealPlan = () => {
      mealDetailsDelete()
      setDel(!del)
    }

    return (
      <Modal
        isOpen={del}
        toggle={() => setDel(!del)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
          Are you sure to delete  {data[0]?.mealType} permanently?
        </ModalHeader>
        <ModalBody>
          <Row className='text-center'>
            <Col xs={12}>
              <Button color='danger' className='m-1' onClick={handleDeleteMealPlan}>
                Delete
              </Button>
              <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    )
  }

  const handleSync = async () => {
    setLoading(true)
    try {
      const res = await Axios.post(`${Staah}/RatePlan/SyncAll?hotelid=${PropertyID}`, {}, {
        headers: {
          LoginID,
          Token,
          Seckey: '123'
        }
      })
      setLoading(false)
      console.log('res', res)
      if (res?.data?.code === 200) {
        toast.success(res?.data?.data)
      } else if (res?.data?.code === 500) {
        toast.error(res?.data?.data, { duration: 7000 })
      } else {
        toast.error('Something went wrong, Try again!')
      }
    } catch (error) {
      setLoading(false)
      console.log('error', error)
      toast.error('Something went wrong!')
    }
  }

  const mealPlanTable = [
    {
      name: 'ID',
      width: '250px',
      className: 'text-wrap',
      selector: row => row.mealID
    },
    {
      name: 'Meal Plan',
      width: '250px',
      selector: row => row.mealType
    },
    {
      name: 'Code',
      selector: row => row.mealCode
    },
    {
      name: 'Rate Plan',
      //width: '290px',
      selector: row => row.ratePlan
    },
    {
      name: 'Description',
      width: '200px',
      //style: 'white-space: normal;',
      selector: row => row.description
    },
    {
      name: 'Price',
      selector: row => row.price
    },
    {
      name: 'Action',
      width: '15rem',
      cell: row => (
        <>
          <Edit className='me-50 pe-auto' size={15} onClick={() => {
            setShowEdit(true)
            setSelected_mealPlan(row.mealID)
          }} />

          <Trash className='me-50' name={row.age} size={15} onClick={() => {
            setDel(true)
            setSelected_mealPlan(row.mealID)
          }} />
          <span className='me-50'>
            <Button
              size='sm'
              color='primary'
              outline
              onClick={() => {
                handleOta()
                setSelected_mealPlan(row.mealID)
              }}
            >
              <RefreshCcw size={15} /> OTA
            </Button>
          </span>
        </>
      )
    }
  ]

  return (
    <Card>
      <Card className='bg-light mb-0'>
        <CardBody>
          <Row>
            <Col lg='4' md='6 mb-50'>
              <Row>
                <Col md='3 text-md-end mt-md-50'>
                  <Label for='MealType'>
                    <span className='text-danger'>*</span>Name
                  </Label>
                </Col>
                <Col md='9'>
                  {/* <Input
                    type='text'
                    name='MealType'
                    id='MealType'
                    value={MealType}
                    onChange={e => setMealType(e.target.value)}
                    invalid={display && MealType.trim() === ''}
                  /> */}
                  <CreatableSelect
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder='Select or Create a Meal name'
                    options={mealNameOption}
                    onCreateOption={e => handleCreateMealNameOption(e)}
                    isClearable={false}
                    value={mealNameOption?.filter(c => c.value === MealType)}
                    onChange={e => {
                      setMealType(e.value)
                      setMealCode(e.value)
                      setMealLabel(e.label)
                    }}
                    invalid={display && MealType === ''}
                  />
                  {display === true && MealType === '' ? <span className='error_msg_lbl'>Name is required </span> : null}
                </Col>
              </Row>
            </Col>

            <Col lg='4' md='6 mb-50'>
              <Row>
                <Col md='3 text-md-end mt-md-50'>
                  <Label for='MealCode'><span className='text-danger'>*</span>Code</Label>
                </Col>
                <Col md='9'>
                  <Input
                    type='text'
                    name='MealCode'
                    id='MealCode'
                    value={MealCode}
                    onChange={e => setMealCode(e.target.value)}
                  />
                  {(display && MealCode === "") || MealCode === 0 ? <span className='error_msg_lbl'>Code is required and cannot be zero</span> : null}
                </Col>
              </Row>
            </Col>  
            <Col lg='4' md='6 mb-50'>
              <Row>
                <Col md='3 text-md-end mt-md-50'>
                  <Label for='Description'>
                    <span className='text-danger'>*</span>Description
                  </Label>
                </Col>
                <Col md='9'>
                  <Input
                    type='text'
                    name='Description'
                    id='Description'
                    value={Description}
                    onChange={e => setDescription(e.target.value)}
                    invalid={display && Description.trim() === ''}
                  />
                  {display === true && !Description.trim() ? <span className='error_msg_lbl'>Description is required </span> : null}
                </Col>
              </Row>
            </Col>

            <Col lg='4' md='6 mb-50'>
              <Row>
                <Col md='3 text-md-end mt-md-50 pe-lg-0'>
                  <Label for='RatePlan'>
                    <span className='text-danger'>*</span>Rate Plan
                  </Label>
                </Col>
                <Col md='9'>
                  <Input
                    type='text'
                    name='RatePlan'
                    id='RatePlan'
                    value={RatePlan}
                    onChange={e => setRatePlan(e.target.value)}
                    invalid={display && RatePlan.trim() === ''}
                  />
                  {display === true && !RatePlan.trim() ? <span className='error_msg_lbl'>Rate Plan is required </span> : null}
                </Col>
              </Row>
            </Col>

            <Col lg='4' md='6 mb-50'>
              <Row>
                <Col md='3 text-md-end mt-md-50'>
                  <Label for='Price'>
                    <span className='text-danger'>*</span>Price
                  </Label>
                </Col>
                <Col md='9'>
                  <Input
                    type='number'
                    name='Price'
                    id='Price'
                    value={Price}
                    onChange={e => setPrice(e.target.value)}
                    invalid={display && Price.trim() === ''}
                  />
                  {display === true && !Price.trim() ? <span className='error_msg_lbl'>Price is required </span> : null}
                </Col>

              </Row>
            </Col>

            <Col lg='4' md='6 mb-50 text-center'>

              <Button color='primary' className='mt-1 mt-sm-0' onClick={() => handleSubmit()}>Submit</Button>

            </Col>
          </Row>
        </CardBody>
      </Card>

      <CardBody>
        <Button className='me-1 float-end' color='primary' outline onClick={() => handleSync()} disabled={loading === true}> <RefreshCcw size={15} className='me-1' />{loading === true ? 'Loading' : 'SYNC ALL (OTA)'} </Button>
        <div className='text-center'>
          <DataTable
            noHeader
            data={meals}
            columns={mealPlanTable}
            className='react-dataTable'
            pagination
            progressPending={loader}
          />
        </div>
        <div>
          <Button className='me-2' color='primary' onClick={mealDetailsList}>Reload</Button>
        </div>
      </CardBody>
      {showEdit ? <EditMealPlanModal id={selected_mealPlan} /> : <></>}
      {del ? <DeleteMealPlanModel id={selected_mealPlan} /> : <></>}
      {
        showEdit | del ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
      {ota && <MealOta open={ota} handleOta={handleOta} id={selected_mealPlan} />}
    </Card>
  )
}

export default MealPlan