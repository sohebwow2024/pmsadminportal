import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, Spinner, CardHeader } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'

const State = () => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)
  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)
  const [selected_state, setSelected_state] = useState()
  const [del, setDel] = useState(false)
  const [states, setStates] = useState([])
  const [country, setCountry] = useState([])
  const [loader, setLoader] = useState(false)

  const [dropdownLoader, setDropdownLoader] = useState(false)

  // const userId = localStorage.getItem('user-id')

  const stateList = () => {
    setLoader(true)
    try {
      const stateDetailsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall"
      }
      axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
        .then(response => {
          setStates(response.data[0])
          setLoader(false)
        })
    } catch (error) {
      setLoader(false)
      console.log("State Error", error.message)
    }
  }

  const countryList = () => {
    setDropdownLoader(true)
    try {
      const stateDetailsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post(`/getdata/regiondata/countrydetails`, stateDetailsBody)
        .then(response => {
          setCountry(response.data[0])
          setDropdownLoader(false)
        })
    } catch (error) {
      setDropdownLoader(false)
      console.log("State Error", error.message)
    }
  }
  const countryOptions = country?.length > 0 && country[0]?.CountryName ? country?.map(function (state) {
    return { value: state.CountryID, label: state.CountryName }
  }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  useEffect(() => {
    stateList()
  }, [])

  const NewStateModal = () => {
    const [CountryID, setCountryID] = useState('')
    const [StateName, setStateName] = useState('')
    const [Region, setRegion] = useState('')
    const [StateDesc, setStateDesc] = useState('')
    const [display, setDisplay] = useState(false)

    const handleCountryList = (value) => {
      if (value === 'reload') {
        countryList()
      }
      setCountryID(value)
    }

    const statePost = () => {

      const statePostBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "insert",
        CountryID,
        StateName,
        Region,
        StateDesc
      }
      try {
        axios.post(`/getdata/regiondata/statedetails`, statePostBody)
          .then(() => {
            stateList()
            toast.success('state Added!', { position: "top-center" })
            // console.log("state Post Response", response)
          })
      } catch (error) {
        console.log("state Post error", error.message)
      }
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (CountryID.trim() !== "" && StateName.trim() !== "" && Region.trim() !== '') {
        statePost()
        handleModal()
      }
    }

    return (
      <Modal
        isOpen={show}
        // toggle={handleModal}
        className='modal-dialog-centered modal-lg'
      // backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={handleModal}>
          Add State
        </ModalHeader>
        {
          !dropdownLoader ? (
            <>
              <ModalBody className='px-sm-2 mx-50 pb-5'>
                <Form>
                  <Row>
                    <Col lg='6' className='mb-1'>
                      <Label className='form-label' for='Region'>
                        <span className='text-danger'>*</span>Select Country
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className='react-select w-100'
                        classNamePrefix='select'
                        options={countryOptions}
                        isClearable={false}
                        value={countryOptions?.filter(c => c.value === CountryID)}
                        onChange={(e) => {
                          handleCountryList(e.value)
                        }}
                      />
                      {/* <Select name='Region' id='Region' value={Region} onChange={e => setRegion(e.target.value)} invalid={display && Region.trim() === ''} />
                {display && !Region.trim() ? <span className='error_msg_lbl'>Enter Region </span> : null} */}
                    </Col>
                    <Col lg='6' className='mb-1'>
                      <Label className='form-label' for='StateName'>
                        <span className='text-danger'>*</span>State Name
                      </Label>
                      <Input type='text' name='StateName' id='StateName' value={StateName} onChange={e => setStateName(e.target.value)} invalid={display && StateName.trim() === ''} />
                      {display && !StateName.trim() ? <span className='error_msg_lbl'>Enter State </span> : null}
                    </Col>
                    <Col lg='12' className='mb-1'>
                      <Label className='form-label' for='Region'>
                        <span className='text-danger'>*</span>Region
                      </Label>
                      <Input type='text' name='Region' id='Region' value={Region} onChange={e => setRegion(e.target.value)} invalid={display && Region.trim() === ''} />
                      {display && !Region.trim() ? <span className='error_msg_lbl'>Enter Region </span> : null}
                    </Col>
                    <Col lg='12' className='mb-1'>
                      <Label className='form-label' for='StateDesc'>State Description</Label>
                      <Input type='textarea' name='StateDesc' id='StateDesc' value={StateDesc} onChange={e => setStateDesc(e.target.value)} />
                      {/* {display && !StateDesc.trim() ? <span className='error_msg_lbl'>Enter State Description </span> : null} */}
                    </Col>
                  </Row>
                  <Row>
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
    )
  }

  const EditStateModal = ({ id }) => {
    const stateData = states.filter(state => state.StateID === id)

    const [editStateName, setEditStateName] = useState(stateData[0]?.StateName)
    const [editRegion, setEditRegion] = useState(stateData[0]?.Region)
    const [editStateDesc, setEditStateDesc] = useState(stateData[0]?.StateDesc)
    const [status] = useState(stateData[0]?.Status)
    const [editDisplay, setEditDisplay] = useState(false)


    const stateEdit = () => {

      const stateEditBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        StateID: id,
        StateName: editStateName,
        Region: editRegion,
        StateDesc: editStateDesc,
        Status: status
      }
      try {
        axios.post(`/getdata/regiondata/statedetails`, stateEditBody)
          .then(() => {
            stateList()
            // console.log("state Post Response", response)
          })
      } catch (error) {
        console.log("state Post error", error.message)
      }
    }
    const editHandleSubmit = () => {
      setEditDisplay(true)
      if (editStateName.trim() && editRegion.trim() !== '') {
        stateEdit()
        handleEditModal()
        toast.success('State Edited Successfully!', { position: "top-center" })
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
            Edit State
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <Row>
              <Col lg='6' className='mb-1'>
                <Label className='form-label' for='StateName'>
                  <span className='text-danger'>*</span>State Name
                </Label>
                <Input type='text' name='StateName' id='StateName' value={editStateName} onChange={e => setEditStateName(e.target.value)} invalid={editDisplay && editStateName.trim() === ''} />
                {editDisplay && !editStateName.trim() ? <span className='error_msg_lbl'>Enter State </span> : null}
              </Col>
              <Col lg='6' className='mb-1'>
                <Label className='form-label' for='Region'>
                  <span className='text-danger'>*</span>Region
                </Label>
                <Input type='text' name='Region' id='Region' value={editRegion} onChange={e => setEditRegion(e.target.value)} invalid={editDisplay && editRegion.trim() === ''} />
                {editDisplay && !editRegion.trim() ? <span className='error_msg_lbl'>Enter Region </span> : null}
              </Col>
              <Col lg='12' className='mb-1'>
                <Label className='form-label' for='editStateDesc'>State Description</Label>
                <Input type='textarea' name='editStateDesc' id='editStateDesc' value={editStateDesc} onChange={e => setEditStateDesc(e.target.value)} />
              </Col>
            </Row>
            <Row tag='form' className='gy-1 gx-2 mt-75' >
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
          </ModalBody>
        </Modal>
        {
          showEdit ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )

  }

  const DeleteStateModal = ({ id }) => {

    const stateDel = () => {
      const cityDelBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "delete",
        StateID: id
      }
      try {
        axios.post(`/getdata/regiondata/statedetails`, cityDelBody)
          .then(() => {
            stateList()
            // console.log("state Del Response", response)
          })
      } catch (error) {
        console.log("state Del error", error.message)
      }
    }
    const handleDeleteState = () => {
      stateDel()
      setStates(states.filter(state => state.StateID !== id))
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
                <Button color='danger' className='m-1' onClick={handleDeleteState}>
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

  const stateTable = [
    {
      name: 'ID',
      sortable: true,
      selector: row => row.StateID
    },
    {
      name: 'State Name',
      sortable: true,
      selector: row => row.StateName
    },
    {
      name: "Region",
      sortable: true,
      selector: row => row.Region
    },
    {
      name: "State Description",
      selector: row => row.StateDesc
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
              setSelected_state(row.StateID)
            }} size={15} />
            <Trash className='me-50' size={15} style={{ color: 'gray' }}
            // onClick={() => {
            //   setDel(true)
            //   setSelected_state(row.StateID)
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
            State
          </CardTitle>
          <Button color='primary' disabled onClick={() => {
            setShow(true)
            countryList()
          }}>Add State</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={states}
                columns={stateTable}
                className='react-dataTable'
                pagination
                progressPending={loader}
              />
            </Col>
          </Row>
          <div>
            <Button className='me-2' color='primary' onClick={stateList}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {/* <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardBody>
              <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                <h2>State</h2>
                <Button color='primary' onClick={() => {
                  setShow(true)
                  countryList()
                }}>Add State</Button>
              </CardTitle>
              <CardText>
                <DataTable
                  noHeader
                  data={states}
                  columns={stateTable}
                  className='react-dataTable'
                  pagination
                  progressPending={loader}
                />
              </CardText>
              <div>
                <Button className='me-2' color='primary' onClick={stateList}>Reload</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      {show ? <NewStateModal /> : <></>}
      {showEdit ? <EditStateModal id={selected_state} /> : <></>}
      {del ? <DeleteStateModal id={selected_state} /> : <></>}

    </>
  )
}

export default State