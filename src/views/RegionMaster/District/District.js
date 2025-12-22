import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, Spinner, CardHeader } from 'reactstrap'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import EditDistrictModal from './EditDistrictModal'
import { useSelector } from 'react-redux'

const District = () => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [selected_district, setSelected_district] = useState('')
  const [selectDisName, setSelectDisName] = useState('')
  const [selectStateId, setSelectStateId] = useState('')
  const [selectDisDec, setSelectDisDec] = useState('')
  const [selectDisStatus, setSelectDisStatus] = useState('')
  const [loader, setLoader] = useState(false)

  const [del, setDel] = useState(false)

  const [districts, setDistricts] = useState([])
  const [districtStatus, setDistrictStatus] = useState(false)

  const [stateList, setStateList] = useState([])
  // const [status, setStatus] = useState(false)
  // const [isRecordUpdate, setIsRecordUpdate] = useState(false)

  // const [editDataField, setEditDataField] = useState([])

  const [dropdownLoader, setDropdownLoader] = useState(false)

  // const userId = localStorage.getItem('user-id')

  const getDistList = () => {
    setLoader(true)
    try {
      const districtBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall"
      }
      axios.post(`/getdata/regiondata/districtdetails`, districtBody)
        .then(response => {
          setDistricts(response?.data[0])
          console.log('response?.data[0]', response?.data[0])
          if (districts === []) { setDistrictStatus(true) }
          setLoader(false)
        })
    } catch (error) {
      setLoader(false)
      console.log("District Error", error.message)
    }
  }

  useEffect(() => {
    getDistList()
  }, [districtStatus, showEdit])

  const stateListResponce = () => {
    setDropdownLoader(true)
    try {
      const stateListBody = {
        LoginID,
        Token,
        Seckey: "abc",
        // CountryID: "COD001",
        Event: "selectall"
      }
      axios.post(`/getdata/regiondata/statedetails`, stateListBody)
        .then(stateDropDownResponse => {
          setStateList(stateDropDownResponse?.data[0])
          setDropdownLoader(false)
        })
    } catch (error) {
      setDropdownLoader(false)
      console.log(error)
    }
  }
  const stateOptions = stateList?.length > 0 && stateList[0]?.StateName ? stateList?.map(function (state) {
    return { value: state.StateID, label: state.StateName }
  }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  useEffect(() => {
    stateListResponce()
  }, [])

  const NewDistrictModal = () => {
    const [DistrictName, setDistrictName] = useState('')
    const [StateID, setStateID] = useState('')
    const [DistrictDesc, setDistrictDesc] = useState('')
    const [display, setDisplay] = useState(false)

    const handleStateList = (value) => {
      if (value === 'reload') {
        stateListResponce()
      }
      setStateID(value)
    }

    const districtPost = () => {

      const districtPostBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "insert",
        StateID,
        DistrictName,
        DistrictDesc
      }
      console.log('districtPostBody', districtPostBody)
      try {
        axios.post(`/getdata/regiondata/districtdetails`, districtPostBody)
          .then(() => {
            setDistrictStatus(!districtStatus)
          })
      } catch (error) {
        console.log("District Post error", error.message)
      }
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (DistrictName && StateID !== '') {
        districtPost()
        handleModal()
        toast.success('District Added!', { position: "top-center" })
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
            Add District
          </ModalHeader>
          {
            !dropdownLoader ? (
              <>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                  <Form>
                    <Row>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='DistrictName'>
                          <span className='text-danger'>*</span>District Name
                        </Label>
                        <Input type='text' sname='DistrictName' id='DistrictName' value={DistrictName} onChange={e => setDistrictName(e.target.value)} invalid={display && DistrictName.trim() === ''} />
                        {display && DistrictName.trim() === '' ? <span className='error_msg_lbl'>Enter District </span> : null}
                      </Col>
                      <Col lg='6' className='mb-1'>
                        <Label className='form-label' for='StateID'>
                          <span className='text-danger'>*</span>State
                        </Label>
                        <Select
                          theme={selectThemeColors}
                          className='react-select w-100'
                          classNamePrefix='select'
                          options={stateOptions}
                          isClearable={false}
                          value={stateOptions?.filter(c => c.value === StateID)}
                          onChange={e => {
                            handleStateList(e.value)
                          }}
                          invalid={display && StateID === ''}
                        />
                        {display && !StateID ? <span className='error_msg_lbl'>Select State </span> : null}
                      </Col>
                      <Col lg='12' className='mb-1'>
                        <Label className='form-label' for='DistrictDesc'>
                          District Description
                        </Label>
                        <Input type='textarea' name='DistrictDesc' id='DistrictDesc' value={DistrictDesc} onChange={e => setDistrictDesc(e.target.value)} />
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

  const DeleteDistrictModal = ({ id }) => {
    console.log(id)
    const districtDel = () => {
      const districtDelBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "delete",
        DistrictID: id
      }
      try {
        axios.post(`/getdata/regiondata/districtdetails`, districtDelBody)
          .then(() => {
            setDistrictStatus(!districtStatus)
          })
      } catch (error) {
        console.log("District Del error", error.message)
      }
    }

    const handleDeleteDistrict = () => {
      setDistricts(districts.filter(districts => districts.DistrictID !== id))
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
                <Button color='danger' className='m-1' onClick={handleDeleteDistrict}>
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

  const districtTable = [
    {
      name: 'ID',
      sortable: true,
      selector: row => row.DistrictID
    },
    {
      name: 'District Name',
      sortable: true,
      width: '200px',
      selector: row => row.DistrictName
    },
    {
      name: "District Description",
      width: '200px',
      selector: row => row.DistrictDesc
    },
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
              setSelected_district(row.DistrictID)
              setSelectDisName(row.DistrictName)
              setSelectStateId(row.StateID)
              setSelectDisDec(row.DistrictDesc)
              setSelectDisStatus(row.Status)
            }} size={15} />
            <Trash className='me-50' size={15} onClick={() => {
              setDel(true)
              setSelected_district(row.DistrictID)
            }} />
          </Col>
          {/* <EditDistrictModal id={selected_district} /> */}
          {/* <DeleteDistrictModal id={row.DistrictID} /> */}
        </>
      )
    }
  ]
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            District
          </CardTitle>
          <Button color='primary' onClick={() => {
            setShow(true)
            stateListResponce()
          }}>Add District</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={districts}
                columns={districtTable}
                className='react-dataTable'
                pagination
                progressPending={loader}
              />
            </Col>
          </Row>
          <div>
            <Button className='me-2' color='primary' onClick={getDistList}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {/* <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardBody>
              <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                <h2>District</h2>
                <Button color='primary' onClick={() => {
                  setShow(true)
                  stateListResponce()
                }}>Add District</Button>
              </CardTitle>
              <CardText>
                <DataTable
                  noHeader
                  data={districts}
                  columns={districtTable}
                  className='react-dataTable'
                  pagination
                  progressPending={loader}
                />
              </CardText>
              <div>
                <Button className='me-2' color='primary' onClick={getDistList}>Reload</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {show ? <NewDistrictModal /> : <></>}
      {showEdit ? <EditDistrictModal id={selected_district} showEdit={showEdit} handleEditModal={handleEditModal} stateOptions={stateOptions} selectDisName={selectDisName} selectStateId={selectStateId} selectDisDec={selectDisDec} getDistList={getDistList} dropdownLoader={dropdownLoader} stateList={stateList} selectDisStatus={selectDisStatus} /> : <></>}
      {del ? <DeleteDistrictModal id={selected_district} /> : <></>}
    </>
  )
}

export default District