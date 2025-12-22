import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, Spinner, CardHeader } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const City = () => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData
  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [selected_city, setSelected_city] = useState()

  const [del, setDel] = useState(false)

  const [stateList, setStateList] = useState([])
  // const [status, setStatus] = useState(false)
  const [loader, setLoader] = useState(false)

  const [dropdownLoader, setDropdownLoader] = useState(false)

  // const userId = localStorage.getItem('user-id')

  // const districtDropdownList = () => {
  //   setDropdownLoader(true)
  //   try {
  //     const districtDropdownBody = {
  //       LoginID,
  //       Token,
  //       Seckey: "abc",
  //       Event: "selectall"
  //     }
  //     axios.post(`/getdata/regiondata/districtdetails`, districtDropdownBody)
  //       .then(districtResponse => {
  //         setDistrictList(districtResponse?.data[0])
  //         setDropdownLoader(false)
  //       })
  //   } catch (error) {
  //     setDropdownLoader(false)
  //     console.log("District Dropdown Error", error.message)
  //   }
  // }
  // const districtOptions = districtList?.length > 0 && districtList[0]?.DistrictName ? districtList?.map(function (district) {
  //   return { value: district.DistrictID, label: district.DistrictName }
  // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  // useEffect(() => {
  //   districtDropdownList()
  // }, [])

  const getStateData = async () => {
    try {
      const stateDetailsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall"
      }
      const res = await axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
      console.log('stateres', res)
      let data = res?.data[0]
      if (data.length > 0) {
        const options = data.map(s => {
          return { value: s.StateID, label: s.StateName }
        })
        setStateList(options)
      } else setStateList([])
    } catch (error) {
      console.log("State List Error", error)
    }
  }

  useEffect(() => {
    getStateData()
  }, [])

  const [cities, setCities] = useState([])
  const [refresh, setRefresh] = useState(false)

  const getCityAll = () => {
    setLoader(true)
    try {
      const citiesBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall"
      }
      axios.post(`/getdata/regiondata/citydetails`, citiesBody)
        .then(response => {
          setCities(response.data[0])
          console.log('response.data[0]', response.data[0])
          if (cities !== []) { setRefresh(true) }
          setLoader(false)
        })
    } catch (error) {
      setLoader(false)
      console.log("Cities Error", error.message)
    }
  }

  useEffect(() => {
    getCityAll()
  }, [refresh])

  const NewCityModal = () => {
    const [CityName, setCityName] = useState('')
    // const [Pincode, setPinCode] = useState('')
    const [CityDesc, setCityDesc] = useState('')
    const [stateID, setStateID] = useState('')
    // const [DistrictID, setDistrictID] = useState('')
    const [display, setDisplay] = useState(false)

    const handleStateList = (value) => {
      if (value === 'reload') {
        // districtDropdownList()
        getStateData()
      }
      setStateID(value)
      // setDistrictID(value)
    }

    const cityPost = () => {

      const cityPostBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "insert",
        DistrictID: stateID,
        StateID: stateID,
        CityName,
        CityDesc
      }
      try {
        axios.post(`/getdata/regiondata/citydetails`, cityPostBody)
          .then(() => {
            getCityAll()
            // console.log("city Post Response", response)
          })
      } catch (error) {
        console.log("city Post error", error.message)
      }
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (CityName.trim() && stateID !== '') {
        cityPost()
        handleModal()
        toast.success('City Added!', { position: "top-center" })
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
            Add City
          </ModalHeader>
          {
            !dropdownLoader ? (
              <>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                  <Form>
                    <Row>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='CityName'>
                          <span className='text-danger'>*</span>City Name
                        </Label>
                        <Input type='text' name='CityName' id='CityName' value={CityName} onChange={e => setCityName(e.target.value)} invalid={display && CityName.trim() === ''} />
                        {display && !CityName.trim() ? <span className='error_msg_lbl'>Enter City </span> : null}
                      </Col>
                      {/* <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='Pincode'>
                          <span className='text-danger'>*</span>Pin Code
                        </Label>
                        <Input type='text' name='Pincode' id='Pincode' maxLength={6} value={Pincode} onChange={e => setPinCode(e.target.value)} invalid={display && Pincode.trim() === ''} />
                        {display && !Pincode.trim() ? <span className='error_msg_lbl'>Enter Pin Code </span> : null}
                      </Col> */}
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='CityDesc'>
                          City Description</Label>
                        <Input type='textarea' name='CityDesc' id='CityDesc' value={CityDesc} onChange={e => setCityDesc(e.target.value)} />
                      </Col>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label'>
                          <span className='text-danger'>*</span>State
                        </Label>
                        <Select
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          options={stateList}
                          isClearable={false}
                          value={stateList?.filter(c => c.value === stateID)}
                          onChange={e => {
                            handleStateList(e.value)
                          }}
                          invalid={display && stateID === ''}
                        />
                        {display && !stateID ? <span className='error_msg_lbl'>Select District</span> : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col className='text-lg-end text-md-center mt-1' lg='12'>
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
                  </Form>
                </ModalBody>
              </>
            ) : (
              <div style={{ height: '150px' }}>
                <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
              </div>
            )
          }

        </Modal>
        {
          show ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const EditCityModal = ({ id }) => {
    const cityData = cities?.filter(city => city.CityID === id)

    if (cities.length === 0) return

    const [editCityName, setEditCityName] = useState(cityData[0]?.CityName)
    // const [editPinCode, setEditPinCode] = useState(cityData[0]?.Pincode)
    const [editCityDesc, setEditCityDesc] = useState(cityData[0]?.CityDesc)
    // const [editDistrictID, setEditDistrictID] = useState(cityData[0]?.DistrictID)
    const [editStateID, setEditStateID] = useState(cityData[0]?.StateID)
    const [editStatus] = useState(cityData[0]?.Status)
    const [editDisplay, setEditDisplay] = useState(false)

    const handleStateList = (value) => {
      if (value === 'reload') {
        // districtDropdownList()
        getStateData()
      }
      setEditDistrictID(value)
      // setDistrictID(value)
    }
    // const handleDistrictList = (value) => {
    //   if (value === 'reload') {
    //     districtDropdownList()
    //   }
    //   setEditDistrictID(value)
    // }

    const updateCities = () => {
      const cityPostBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        CityID: id,
        DistrictID: editStateID,
        StateID: editStateID,
        CityName: editCityName,
        CityDesc: editCityDesc,
        Status: editStatus
      }
      try {
        axios.post(`/getdata/regiondata/citydetails`, cityPostBody)
          .then(response => {
            getCityAll()
            console.log("city Post Response", response)
          })
      } catch (error) {
        console.log("city Post error", error.message)
      }
    }

    const editHandleSubmit = () => {
      setEditDisplay(true)
      if (editCityName.trim() && editStateID !== '') {
        updateCities()
        handleEditModal()
        toast.success('City Edited Successfully!', { position: "top-center" })
      } else {
        toast.error('Fill All Fields!', {
          position: "top-center",
          style: {
            minWidth: '250px'
          },
          duration: 3000
        })
      }
    }

    return (
      <>
        <Modal
          isOpen={showEdit}
          toggle={handleEditModal}
          className='modal-dialog-centered modal-lg'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleEditModal}>
            Edit City
          </ModalHeader>
          {
            !dropdownLoader ? (
              <>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                  <Form>
                    <Row>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='CityName'>
                          <span className='text-danger'>*</span>City Name
                        </Label>
                        <Input type='text' name='CityName' id='CityName' value={editCityName} onChange={e => setEditCityName(e.target.value)} invalid={editDisplay && editCityName.trim() === ''} />
                        {editDisplay && !editCityName.trim() ? <span className='error_msg_lbl'>Enter City </span> : null}
                      </Col>
                      {/* <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='Pincode'>
                          <span className='text-danger'>*</span>Pin Code
                        </Label>
                        <Input type='text' name='Pincode' id='Pincode' maxLength={6} value={editPinCode} onChange={e => setEditPinCode(e.target.value)} invalid={editDisplay && editPinCode.trim() === ''} />
                        {editDisplay && !editPinCode.trim() ? <span className='error_msg_lbl'>Enter Pin Code </span> : null}
                      </Col> */}
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='CityDesc'>
                          City Description</Label>
                        <Input type='textarea' name='CityDesc' id='CityDesc' value={editCityDesc} onChange={e => setEditCityDesc(e.target.value)} />
                      </Col>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label'>
                          <span className='text-danger'>*</span>State
                        </Label>
                        <Select
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          options={stateList}
                          isClearable={false}
                          value={stateList?.filter(c => c.value === editStateID)}
                          onChange={e => {
                            handleStateList(e.value)
                          }}
                          invalid={editDisplay && editStateID === ''}
                        />
                        {editDisplay && !editStateID ? <span className='error_msg_lbl'>Select District</span> : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col className='text-lg-end text-md-center mt-1' lg='12'>
                        <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                          Submit
                        </Button>
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
                </ModalBody>
              </>
            ) : (
              <div style={{ height: '150px' }}>
                <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
              </div>
            )
          }

        </Modal>
        {
          showEdit ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const DeleteCityModal = ({ id }) => {

    const districtDel = () => {
      const cityDelBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "delete",
        CityID: id
      }
      try {
        axios.post(`/getdata/regiondata/citydetails`, cityDelBody)
          .then(response => {
            console.log("District Del Response", response)
          })
      } catch (error) {
        console.log("District Del error", error.message)
      }
    }
    const handleDeleteCity = () => {
      setCities(cities.filter(cities => cities.CityID !== id))
      districtDel()
      setDel(!del)
    }

    return (
      <>
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
                <Button color='danger' className='m-1' onClick={handleDeleteCity}>
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
          del ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const cityTable = [
    {
      name: 'ID',
      selector: row => row.CityID
    },
    {
      name: 'City Name',
      selector: row => row.CityName
    },
    {
      name: "City Description",
      selector: row => row.CityDesc
    },
    // {
    //   name: "Pin Code",
    //   sortable: true,
    //   selector: row => row.Pincode
    // },
    {
      name: "State",
      sortable: true,
      selector: row => row.StateName
    },
    {
      name: 'Action',
      sortable: true,
      center: true,
      selector: row => (
        <>
          <Col>
            <Edit className='me-50 pe-auto' onClick={() => {
              setShowEdit(true)
              setSelected_city(row.CityID)
            }} size={15} />
            <Trash className='me-50' size={15} style={{ color: 'gray' }}
            // onClick={() => {
            //   setDel(true)
            //   setSelected_city(row.CityID)
            // }} 
            />
          </Col>

        </>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            City
          </CardTitle>
          <Button color='primary' disabled onClick={() => {
            setShow(true)
            // setStatus(!status)
            getStateData()
          }}>Add City</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={cities}
                columns={cityTable}
                className='react-dataTable'
                pagination
                progressPending={loader}
              />
            </Col>
          </Row>
          <div>
            <Button className='me-2' color='primary' onClick={getCityAll}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {/* <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardBody>
              <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                City
                <Button color='primary' onClick={() => {
                  setShow(true)
                  // setStatus(!status)
                  districtDropdownList()
                }}>Add City</Button>
              </CardTitle>
              <CardText>
                <DataTable
                  noHeader
                  data={cities}
                  columns={cityTable}
                  className='react-dataTable'
                  pagination
                  progressPending={loader}
                />
              </CardText>
              <div>
                <Button className='me-2' color='primary' onClick={getCityAll}>Reload</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {show ? <NewCityModal /> : <></>}
      {showEdit ? <EditCityModal id={selected_city} /> : <></>}
      {del ? <DeleteCityModal id={selected_city} /> : <></>}
    </>
  )
}

export default City