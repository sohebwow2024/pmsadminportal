import { React, useEffect, useState } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle, CardBody, Label, Input, Modal, ModalBody, ModalHeader, Form, FormFeedback, Badge } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

// const statusOptions = [
//   { value: true, label: 'ACTIVE' },
//   { value: false, label: 'INACTIVE' }
// ]

const TermsAndConditions = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Terms & Conditions"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token, CompanyID, PropertyID } = getUserData

  const [tandcs, setTandcs] = useState([])

  const [sel_id, setSel_id] = useState()

  const [tcModal, setTcModal] = useState(false)
  const handleTcModal = () => setTcModal(!tcModal)

  const [updateTC, setUpdateTC] = useState(false)
  const handleUpdateTc = () => setUpdateTC(!updateTC)

  const [delTC, setDelTC] = useState(false)

  // const userId = localStorage.getItem('user-id')

  const TCList = () => {
    try {
      const TCBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post(`/getdata/generaldata/termsandconditions`, TCBody)
        .then(response => {
          setTandcs(response?.data[0])
        })
    } catch (error) {
      console.log("TC List Error", error.message)
    }
  }
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    TCList()
  }, [])


  const NewTCModal = () => {

    const [submit, setSubmit] = useState(false)
    const [tcCat, setTcCat] = useState("")
    const [tcDescp, setTcDescp] = useState("")
    const [StatusID, setStatusID] = useState('Active')

    const TCInsert = () => {
      try {
        const TCInsertBody = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "insert",
          Others: null,
          TermsofUse: tcCat,
          StandardTermsandConditions: "",
          GeneralProvisions: tcDescp,
          CompanyID,
          PropertyID,
          // StatusID: "SDT001"
          Status: StatusID
        }
        axios.post(`/getdata/generaldata/termsandconditions`, TCInsertBody)
          .then(() => {
            if (res.status === 200) {
              TCList()
            } else {
              toast.error("Something went wrong, try again!")
            }
          })
      } catch (error) {
        console.log("Terms And Conditions Insert Error", error.message)
      }
    }

    const handleNewTC = (e) => {
      e.preventDefault()
      setSubmit(true)
      if (tcCat.trim() && tcDescp.trim() && StatusID !== '') {
        TCInsert()
        handleTcModal()
        setSubmit(false)
      }

    }

    return (
      <>
        <Modal
          isOpen={tcModal}
          className='modal-dialog-centered modal-xl'
        >
          <ModalHeader toggle={handleTcModal}>
            Add new Terms and Conditions
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => handleNewTC(e)}>
              <Row className='mb-1'>
                <Col lg='6'>
                  <Label className='fw-bold fs-5'>
                    <span className='text-danger'>*</span>Terms and Conditions</Label>
                  <Input
                    type='text'
                    name='tccategory'
                    className='mb-md-1 mb-sm-1'
                    placeholder='Add T&C...'
                    value={tcCat}
                    onChange={e => setTcCat(e.target.value)}
                    invalid={submit && tcCat.trim() === ''}
                  />
                  {submit && tcCat.trim() === '' && <FormFeedback>T&C is required</FormFeedback>}
                </Col>
                <Col lg='6'>
                  <Label className='form-label'>
                    <span className='text-danger'>*</span>Status</Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    placeholder='Select status'
                    options={statusOptions}
                    value={statusOptions?.filter(c => c.value === StatusID)}
                    onChange={e => setStatusID(e.value)}
                  />
                  {submit && StatusID === '' && <span className='text-danger'>Status is required</span>}
                </Col>
              </Row>
              <Row className='mb-1'>
                <Col lg='12'>
                  <Label className='fw-bold fs-5'>
                    <span className='text-danger'>*</span>Terms and Conditions Description</Label>
                  <Input
                    type='text'
                    name='tcDescp'
                    value={tcDescp}
                    onChange={e => setTcDescp(e.target.value)}
                    invalid={submit && tcDescp.trim() === ''}
                  />
                  {submit && tcDescp.trim() === '' && <FormFeedback>Description is required</FormFeedback>}
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <Button color='primary' type='submit'>Add T&C</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </>
    )
  }

  const UpdateTC = ({ id }) => {

    const data = tandcs.filter(tc => tc.termID === id)

    const [newTcCat, setNewTcCat] = useState(data[0]?.termsofUse)
    const [newTcDescp, setNewTcDescp] = useState(data[0]?.generalProvisions)
    const [editSubmit, setEditSubmit] = useState(false)
    const [editStatusID, setEditStatusID] = useState(data[0]?.Status)

    const editTC = () => {
      try {
        const editTCBody = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "update",
          Others: null,
          TermID: id,
          TermsofUse: newTcCat,
          StandardTermsandConditions: "",
          GeneralProvisions: newTcDescp,
          CompanyID: null,
          PropertyID: null,
          Status: editStatusID
        }
        axios.post(`/getdata/generaldata/termsandconditions`, editTCBody)
          .then(() => {
            TCList()
          })
      } catch (error) {
        console.log("Terms And Conditions Edit Error", error.message)
      }
    }

    const updateTC = () => {
      setEditSubmit(true)
      if (newTcCat.trim() && newTcDescp.trim() && editStatusID !== '') {
        editTC()
        setEditSubmit(false)
        handleUpdateTc()
      }
    }

    return (
      <>
        <Modal
          isOpen={updateTC}
          className='modal-dialog-centered modal-xl'
        >
          <ModalHeader toggle={handleUpdateTc}>
            Edit Terms and Conditions
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row className='mb-1'>
                <Col lg='6'>
                  <Label className='fw-bold fs-5'>
                    <span className='text-danger'>*</span>Terms and Conditions</Label>
                  <Input
                    type='text'
                    name='tccategory'
                    className='mb-md-1 mb-sm-1'
                    value={newTcCat}
                    onChange={e => setNewTcCat(e.target.value)}
                    invalid={editSubmit && newTcCat.trim() === ''}
                  />
                  {editSubmit && newTcCat.trim() === '' && <FormFeedback>T&C is required</FormFeedback>}
                </Col>
                <Col lg='6'>
                  <Label className='form-label'>
                    <span className='text-danger'>*</span>Status</Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    placeholder='Select status'
                    options={statusOptions}
                    value={statusOptions?.filter(c => c.value === editStatusID)}
                    onChange={e => setEditStatusID(e.value)}
                  />
                  {editSubmit && editStatusID === '' && <span className='text-danger'>Status is required</span>}
                </Col>
              </Row>
              <Row className='mb-1'>
                <Col lg='12'>
                  <Label className='fw-bold fs-5'>
                    <span className='text-danger'>*</span>Terms and Conditions Description</Label>
                  <Input
                    type='text'
                    name='newTcDescp'
                    value={newTcDescp}
                    onChange={e => setNewTcDescp(e.target.value)}
                    invalid={editSubmit && newTcDescp.trim() === ''}
                  />
                  {editSubmit && newTcDescp.trim() === '' && <FormFeedback>Description is required</FormFeedback>}
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <Button color='primary me-2' onClick={() => updateTC()}>Update T&C</Button>
                  <Button color='secondary' className='me-2' onClick={
                    () => {
                      setUpdateTC(handleUpdateTc)
                    }
                  }
                    outline>Cancel</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </>
    )
  }

  const DeleteTC = ({ id }) => {

    const deleteTC = () => {
      try {
        const deleteTCBody = {
          LoginID,
          Token,
          Seckey: "abc",
          Event: "delete",
          TermID: id
        }
        axios.post(`/getdata/generaldata/termsandconditions`, deleteTCBody)
          .then(() => {
            TCList()
          })
      } catch (error) {
        console.log("Delete Terms And Conditions Error", error.message)
      }
    }

    const handleDelete = () => {
      deleteTC()
      setDelTC(!delTC)
    }

    return (
      <>
        <Modal
          isOpen={delTC}
          className='modal-dialog-centered'
        >
          <ModalHeader toggle={() => setDelTC(!delTC)}>
            Are you sure to delete this Terms And Conditions permanently?
          </ModalHeader>
          <ModalBody>
            <Row className='text-center'>
              <Col xs={12}>
                <Button className='m-1' color='danger' onClick={() => handleDelete()}>Delete</Button>
                <Button className='mx-1' color='secondary' outline onClick={() => setDelTC(!delTC)}>Cancel</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </>
    )
  }

  const tcColumns = [
    {
      name: 'ID',
      sortable: true,
      width: '250px',
      selector: row => row.TermID
    },
    {
      name: 'Terms And Conditions',
      sortable: true,
      width: '500px',
      selector: row => row.TermsofUse + row.StandardTermsandConditions
    },
    {
      name: 'Terms And Conditions Description',
      sortable: true,
      width: '500px',
      selector: row => row.GeneralProvisions
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => {
        return (
          <>
            {
              row.Status === 'Active' ? (
                <Badge color='light-success'> {row.Status}</Badge>
              ) : (
                <Badge color='light-danger'> {row.Status}</Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Actions',
      sortable: true,
      center: true,
      selector: row => {
        return (
          <>
            <Col>
              <Edit
                className='me-50 pe-auto'
                size={15}
                onClick={() => {
                  setUpdateTC(true)
                  setSel_id(row.TermID)
                }}
              />
              <Trash
                className='me-50'
                size={15}
                onClick={() => {
                  setDelTC(true)
                  setSel_id(row.TermID)
                }}
              />
            </Col>
          </>
        )
      }
    }
  ]

  return (
    <>
      {console.log('tcsss', tandcs)}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
          <Button color='primary' onClick={handleTcModal}>Add New T&C</Button>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <DataTable
                noHeader
                pagination
                data={tandcs}
                columns={tcColumns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Col>
          </Row>
          <div>
            <Button className='me-2' color='primary' onClick={TCList}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {tcModal ? <NewTCModal /> : <></>}
      {updateTC ? <UpdateTC id={sel_id} /> : <></>}
      {delTC ? <DeleteTC id={sel_id} /> : <></>}
    </>
  )
}

export default TermsAndConditions