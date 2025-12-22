import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, CardHeader } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const Country = () => {

  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)
  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)
  const [selected_state, setSelected_state] = useState()
  const [del, setDel] = useState(false)
  const [states, setCountry] = useState([])
  const [loader, setLoader] = useState(false)

  // const userId = localStorage.getItem('user-id')

  const countryList = () => {
    setLoader(true)
    try {
      const countryDetailsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        // CountryID: "COD001",
        Event: "select"
      }
      axios.post(`/getdata/regiondata/countrydetails`, countryDetailsBody)
        .then(response => {
          setCountry(response.data[0])
          setLoader(false)
        })
    } catch (error) {
      setLoader(false)
      console.log("State Error", error.message)
    }
  }
  useEffect(() => {
    countryList()
  }, [])

  const NewCountryModal = () => {
    const [countryName, setCountryName] = useState('')
    const [countryDesc, setCountryDesc] = useState('')
    const [display, setDisplay] = useState(false)

    const statePost = () => {

      const countryPostBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "insert",
        countryName,
        countryDesc
      }
      try {
        axios.post(`/getdata/regiondata/countrydetails`, countryPostBody)
          .then(() => {
            countryList()
          })
      } catch (error) {
        console.log("state Post error", error.message)
      }
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (countryName.trim()) {
        statePost()
        handleModal()
        toast.success('state Added!', { position: "top-center" })
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
            Add Country
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <Form>
              <Row>
                <Col md='12' className='mb-1'>
                  <Label className='form-label' for='countryName'>
                    <span className='text-danger'>*</span>Country Name
                  </Label>
                  <Input type='text' name='countryName' id='countryName' value={countryName} onChange={e => setCountryName(e.target.value)} invalid={display && countryName.trim() === ''} />
                  {display && !countryName.trim() ? <span className='error_msg_lbl'>Enter Country </span> : null}
                </Col>
                <Col md='12' className='mb-lg-2'>
                  <Label className='form-label' for='countryDesc'>Country Description</Label>
                  <Input type='textarea' name='countryDesc' id='countryDesc' value={countryDesc} onChange={e => setCountryDesc(e.target.value)} />
                  {/* {display && !StateDesc.trim() ? <span className='error_msg_lbl'>Enter State Description </span> : null} */}
                </Col>
              </Row>
              <Row className='gy-1 gx-2 mt-75' >
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
        </Modal>
        {
          show ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const EditCountryModal = ({ id }) => {
    const countryData = states.filter(state => state.CountryID === id)

    const [editCountryName, setEditCountryName] = useState(countryData[0]?.CountryName)
    const [editCountryDesc, setEditCountryDesc] = useState(countryData[0]?.CountryDesc)
    const [statusId] = useState(countryData[0]?.Status)
    const [editDisplay, setEditDisplay] = useState(false)


    const stateEdit = () => {

      const countryEditBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        CountryID: id,
        CountryName: editCountryName,
        CountryDesc: editCountryDesc,
        Status: statusId
      }
      try {
        axios.post(`/getdata/regiondata/countrydetails`, countryEditBody)
          .then(() => {
            countryList()
            // console.log("state Post Response", response)
          })
      } catch (error) {
        console.log("state Post error", error.message)
      }
    }
    const editHandleSubmit = () => {
      setEditDisplay(true)
      if (editCountryName.trim()) {
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
            Edit Country
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label' for='StateName'>
                  <span className='text-danger'>*</span>Country Name
                </Label>
                <Input type='text' name='StateName' id='StateName' value={editCountryName} onChange={e => setEditCountryName(e.target.value)} invalid={editDisplay && editCountryName.trim() === ''} />
                {editDisplay && !editCountryName.trim() ? <span className='error_msg_lbl'>Enter Country </span> : null}
              </Col>
              <Col md='12' className='mb-2'>
                <Label className='form-label' for='editCountryDesc'>Country Description</Label>
                <Input type='textarea' name='editCountryDesc' id='editCountryDesc' value={editCountryDesc} onChange={e => setEditCountryDesc(e.target.value)} />
              </Col>
            </Row>
            <Row tag='form' className='gy-1 gx-2 mt-75' >
              <Col className='text-lg-end text-md-center mt-1' xs={12}>
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

  const DeleteCountryModal = ({ id }) => {

    const countryDel = () => {
      const countryDelBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "delete",
        CountryID: id
      }
      try {
        axios.post(`/getdata/regiondata/countrydetails`, countryDelBody)
          .then(() => {
            countryList()
          })
      } catch (error) {
        console.log("state Del error", error.message)
      }
    }
    const handleDeleteState = () => {
      countryDel()
      setCountry(states.filter(state => state.CountryID !== id))
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
      selector: row => row.CountryID
    },
    {
      name: 'Country Name',
      sortable: true,
      selector: row => row.CountryName
    },
    {
      name: "Country Description",
      selector: row => row.CountryDesc
    },
    {
      name: 'Action',
      sortable: true,
      center: true,
      selector: row => (
        <>
          <Col>
            <Edit className='me-50 pe-auto' onClick={() => {
              setSelected_state(row.CountryID)
              setShowEdit(true)
            }} size={15} />
            <Trash className='me-50' size={15} style={{ color: 'gray' }}
            // onClick={() => {
            //   setSelected_state(row.CountryID)
            //   setDel(true)
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
            Country
          </CardTitle>
          <Button color='primary' onClick={() => setShow(true)} disabled>Add Country</Button>
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
            <Button className='me-2' color='primary' onClick={countryList}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {/* <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardBody>
              <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                <h2>Country</h2>
                <Button color='primary' onClick={() => setShow(true)}>Add Country</Button>
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
                <Button className='me-2' color='primary' onClick={countryList}>Reload</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      {show ? <NewCountryModal /> : <></>}
      {showEdit ? <EditCountryModal id={selected_state} /> : <></>}
      {del ? <DeleteCountryModal id={selected_state} /> : <></>}

    </>
  )
}

export default Country