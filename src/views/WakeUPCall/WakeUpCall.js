import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Edit3, Trash } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { store } from '@store/store'
import { handleFlag } from '../../redux/navbar'

const options = [
  { value: 'completed', label: 'Completed' },
  // { value: 'delete', label: 'Delete' },
  { value: 'NotAnswered', label: 'Not Answered' },
  { value: 'canceled', label: 'Cancelled' },
  // { value: 'active', label: 'Active' }
]

const WakeUpCall = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Wake-Up Call"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [roomNoData, setRoomNoData] = useState([])
  const [existWData, setExistWData] = useState([])
  console.log('existWData', existWData);
  const getRoomNoData = async () => {
    try {
      const res = await axios.get('/pos_orders/rooms', {
        params: {
          LoginID,
          Token
        }
      })
      let result = res?.data[0]
      console.log('result', result)
      let roomNo
      if (result.length > 0) {
        roomNo = result.filter(r => r.bookingID !== null).map(r => {
          return { value: r.floorID, label: r.roomNo, ...r }
        })
        setRoomNoData(roomNo)
      } else {
        setRoomNoData([])
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getExistWakeupCalls = async () => {
    try {
      const res = await axios.get(`/wakeupcall/get`, {
        headers: {
          LoginID,
          Token
        },
        params: {
          LoginID,
          Token,
          PropertyID
        }
      })
      let calls = res?.data[0]
      // console.log('cal', calls)
      if (calls.length > 0) {
        setExistWData(calls)
      } else {
        setExistWData([])
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [status, setStatus] = useState(false)
  const handleStatus = () => setStatus(!status)

  const [selected_wakeUpCall, setSelected_wakeUpCall] = useState()

  const [del, setDel] = useState(false)

  useEffect(() => {
    getExistWakeupCalls()
    getRoomNoData()
    store.dispatch(handleFlag())
  }, [show, showEdit, status, del])

  const NewWakeUpCallModal = () => {

    const [selRoom, setSelRoom] = useState([])
    const [guestName, setGuestName] = useState('')
    const [roomNo, setRoomNo] = useState('')
    const [floorNo, setFloorNo] = useState('')
    const [fid, setFid] = useState('')
    const [gid, setGid] = useState('')
    const [wakeUpDate, setWakeUpDate] = useState('')
    const [wakeUpTime, setWakeUpTime] = useState('')
    const [remark, setRemark] = useState('')
    const [display, setDisplay] = useState(false)

    const wakeUpCallObj = {
      id: Math.floor(Math.random() * 100),
      guestName,
      roomNo,
      wakeUpDate,
      wakeUpTime,
      option: 'Pending'
    }

    const handleSubmit = async () => {
      setDisplay(true)
      if (guestName && roomNo && wakeUpDate && wakeUpTime !== '') {
        try {
          let obj = {
            LoginID: LoginID,
            Token: Token,
            Seckey: 'abc',
            RoomNo: roomNo,
            FloorNo: floorNo,
            FloorID: fid,
            GuestID: gid,
            WakeUpDate: moment(wakeUpDate).format('YYYY-MM-DD'),
            WakeUpTime: `${moment(wakeUpDate).format('YYYY-MM-DD')} ${wakeUpTime}`,
            Remarks: remark
          }
          console.log('obj', obj)
          const res = await axios.post('/wakeupcall/add', obj, {
            headers: {
              LoginID,
              Token,
              Seckey: 'abc'
            }
          })
          console.log('res', res)
          if (res?.data[0][0].status === "Success") {
            toast.success('WakeUp Call Added!', { position: "top-center" })
            handleModal()
          }
        } catch (error) {
          console.log('error', error)
          toast.error("Something went wrong, Try again!")
        }
      } else {
        toast.error('Fill all Fields')
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
            Arrange new Wake-Up Call
          </ModalHeader>
          <ModalBody>
            <>
              <Row>
                <Col lg='12'>
                  <Label>Select Room for call</Label>
                  <Select
                    name='rooms'
                    id='rooms'
                    key='rooms'
                    placeholder=''
                    menuPlacement='auto'
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    options={roomNoData}
                    onChange={e => {
                      setSelRoom(e)
                      setGuestName(e.guestName)
                      setRoomNo(e.roomNo)
                      setFid(e.floorID)
                      setFloorNo(e.floorNo)
                      setGid(e.guestID)
                    }}
                  />
                </Col>
              </Row>
              <Row className='my-1'>
                <Form>
                  <Row className='mb-1 d-flex flex-md-row flex-column flex-wrap'>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='guestName'>
                        <span className='text-danger'>*</span>Guest name
                      </Label>
                      <Input
                        type='text'
                        name='guestName'
                        id='guestName'
                        value={guestName}
                        disabled
                      />
                    </Col>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='roomNo'>
                        <span className='text-danger'>*</span>Room No.
                      </Label>
                      <Input
                        type='text'
                        name='roomNo'
                        id='roomNo'
                        value={roomNo}
                        disabled
                      />
                    </Col>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='wakeUpDate'>
                        <span className='text-danger'>*</span>Wake-up Call Date
                      </Label>
                      <Input
                        type='date'
                        name='wakeUpDate'
                        id='wakeUpDate'
                        value={wakeUpDate}
                        onChange={e => setWakeUpDate(e.target.value)}
                        invalid={display ? wakeUpDate === '' : false}
                      />
                      {display === true && !wakeUpDate ? <span className='error_msg_lbl'>Enter WakeUp Date </span> : <></>}
                    </Col>
                    <Col lg='3'>
                      <Label for='wakeUpTime'>
                        <span className='text-danger'>*</span>Wake-up Call Time
                      </Label>
                      <Input
                        type='time'
                        name='wakeUpTime'
                        value={wakeUpTime}
                        onChange={e => setWakeUpTime(e.target.value)}
                        invalid={display ? wakeUpTime === '' : false}
                      />
                      {display === true && !wakeUpTime ? <span className='error_msg_lbl'>Enter WakeUp Time </span> : <></>}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for='remark'>Remark</Label>
                      <Input type='text' name='remark' value={remark} onChange={e => setRemark(e.target.value)} />
                    </Col>
                  </Row>
                  <Row className='d-flex flex-row justify-content-center align-items-center'>
                    <Col className='text-center'>
                      <Button className='m-1' color='primary' onClick={handleSubmit}>Arrange Call</Button>
                    </Col>
                    <Col className='text-center'>
                      <Button className='m-1' color='danger' onClick={handleModal}>Cancel</Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </>
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

  const EditWakeUpCallModal = ({ id }) => {
    const data = existWData.filter(wakeUpCall => wakeUpCall.wakeUpCallID === id)
    console.log('data', data)

    const [editGuestName] = useState(data[0]?.guestName)
    const [editRoomNo] = useState(data[0]?.roomNo)
    const [editWakeUpDate, setEditWakeUpDate] = useState(data[0]?.wakeUpDate)
    const [editWakeUpTime, setEditWakeUpTime] = useState(data[0]?.wakeUpTime)
    const [editRemark, setEditRemark] = useState(data[0]?.wakeUpRemarks ? data[0]?.wakeUpRemarks : '')
    const [editDisplay, setEditDisplay] = useState(false)

    const editHandleSubmit = async () => {
      setEditDisplay(true)
      if (editWakeUpDate && editWakeUpTime !== '') {
        try {
          let obj = {
            LoginID,
            Token,
            Seckey: 'abc',
            WakeUpDate: moment(editWakeUpDate).format('YYYY-MM-DD'),
            WakeUpTime: `${moment(editWakeUpDate).format('YYYY-MM-DD')} ${editWakeUpTime}`,
            Remarks: editRemark
          }
          const res = await axios.post(`/wakeupcall/update/${id}`, obj, {
            headers: {
              LoginID,
              Token,
              Seckey: 'abc'
            }
          })
          console.log('res', res)
          if (res?.data[0][0].status === 'Success') {
            // toast.success('WakeUp Call Edited Succesfully!', { position: "top-center" })
            toast.success(res?.data[0][0].message, { position: "top-center" })
            handleEditModal()
          }
        } catch (error) {
          console.log('error', error)
          toast.error('Something went wrong, Try again!')
        }
      } else {
        toast.error('Fill All Fields!')
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
            Edit Wake-Up Call
          </ModalHeader>
          <ModalBody>
            <>
              <Row className='my-1'>
                <Form>
                  <Row className='mb-1 d-flex flex-md-row flex-column flex-wrap'>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='guestName'>
                        <span className='text-danger'>*</span>Guest name
                      </Label>
                      <Input
                        type='text'
                        name='guestName'
                        id='guestName'
                        value={editGuestName}
                        disabled
                      />
                    </Col>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='roomNo'>
                        <span className='text-danger'>*</span>Room No.
                      </Label>
                      <Input
                        type='text'
                        name='roomNo'
                        id='roomNo'
                        value={editRoomNo}
                        disabled
                      />
                    </Col>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='wakeUpDate'>
                        <span className='text-danger'>*</span>Wake-up Call Date
                      </Label>
                      <Input
                        type='date'
                        name='wakeUpDate'
                        id='wakeUpDate'
                        value={moment(editWakeUpDate).format('YYYY-MM-DD')}
                        onChange={e => setEditWakeUpDate(e.target.value)}
                        invalid={editDisplay ? editWakeUpDate === '' : false}
                      />
                      {editDisplay === true && !editWakeUpDate ? <span className='error_msg_lbl'>Enter WakeUp Date </span> : <></>}
                    </Col>
                    <Col lg='3' className='mb-md-1 mb-sm-1'>
                      <Label for='wakeUpTime'>
                        <span className='text-danger'>*</span>Wake-up Call Time
                      </Label>
                      <Input
                        type='time'
                        name='wakeUpTime'
                        value={editWakeUpTime.length > 5 ? moment(editWakeUpTime).format('HH:mm') : editWakeUpTime}
                        onChange={e => setEditWakeUpTime(e.target.value)}
                        invalid={editDisplay ? editWakeUpTime === '' : false}
                      />
                      {editDisplay === true && !editWakeUpTime ? <span className='error_msg_lbl'>Enter WakeUp Time </span> : <></>}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for='remark'>Remark</Label>
                      <Input type='text' name='remark' value={editRemark} onChange={e => setEditRemark(e.target.value)} />
                    </Col>
                  </Row>
                  <Row className='d-flex flex-row justify-content-center align-items-center'>
                    <Col className='text-center'>
                      <Button className='m-1' color='primary' onClick={editHandleSubmit}>Update Call</Button>
                    </Col>
                    <Col className='text-center'>
                      <Button className='m-1' color='danger' onClick={handleEditModal}>Cancel</Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </>
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

  const StatusModal = ({ id }) => {
    const statusValueData = existWData?.filter(wakeUpCall => wakeUpCall.wakeUpCallID === id)
    const [newOption, setNewOption] = useState(statusValueData[0]?.status)
    const [optionDisplay, setOptionDisplay] = useState(false)
    const [remark, setRemark] = useState('')

    const statusHandleSubmit = async () => {
      setOptionDisplay(true)
      if (newOption !== '' && newOption !== 'Completed' || newOption !== 'completed' && remark !== '') {
        try {
          const res = await axios.post(`/wakeupcall/${newOption}`, {}, {
            headers: {
              LoginID,
              Token,
              Seckey: 'abc'
            },
            params: {
              WakeUpCallID: id,
              Remarks: remark
            }
          })
          console.log('res', res)
          if (res?.data[0][0].status === 'Success') {
            toast.success('Status Changed!', { position: "top-center" })
            setOptionDisplay(false)
            handleStatus()
          }
        } catch (error) {
          console.log('error', error)
          toast.error('Something went wrong, Try again!')
        }
      } else {
        try {
          const res = await axios.post(`/wakeupcall/${newOption}`, {}, {
            headers: {
              LoginID,
              Token,
              Seckey: 'abc'
            },
            params: {
              WakeUpCallID: id,
              Remarks: remark
            }
          })
          console.log('res', res)
          if (res?.data[0][0].Status === 'Success') {
            toast.success('Status Changed!', { position: "top-center" })
            setOptionDisplay(false)
            handleStatus()
          }
        } catch (error) {
          console.log('error', error)
          toast.error('Something went wrong, Try again!')
        }
      }

    }

    return (
      <>
        <Modal
          isOpen={status}
          toggle={handleStatus}
          className='modal-dialog-centered modal-sm'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleStatus}>
            <span className='text-danger'>*</span>Status
          </ModalHeader>
          <ModalBody>
            <>
              <Form>
                <Row>
                  <Col md='12' className='mb-1'>
                    <Select
                      theme={selectThemeColors}
                      className='react-select w-100 me-1'
                      classNamePrefix='select'
                      options={options}
                      value={options?.filter(c => c.value.toLowerCase() === newOption.toLowerCase())}
                      onChange={e => setNewOption(e.value)}
                      invalid={optionDisplay && newOption === ''}
                    />
                    {optionDisplay && newOption === '' ? <span className='error_msg_lbl'>Please Select Status </span> : <></>}
                  </Col>
                  {
                    newOption === 'Completed' || newOption === 'completed' ? null : (
                      <Col>
                        <Label for='remark'>Remark</Label>
                        <Input
                          type='text'
                          name='remark'
                          value={remark}
                          onChange={e => setRemark(e.target.value)}
                          invalid={optionDisplay && newOption !== 'completed' && remark === ''}
                        />
                        {optionDisplay && newOption !== 'completed' && remark === '' && <span className='text-danger'>Remark is required!</span>}
                      </Col>
                    )
                  }
                </Row>
                <Row className='d-flex flex-row justify-content-center align-items-center'>
                  <Col className='text-center'>
                    <Button className='m-1' color='success' onClick={statusHandleSubmit}>Save</Button>
                  </Col>
                  <Col className='text-center'>
                    <Button className='m-1' color='danger' onClick={handleStatus}>Cancel</Button>
                  </Col>
                </Row>
              </Form>
            </>
          </ModalBody>
        </Modal>
        {
          status ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const DeleteWakeUpCallModal = ({ id }) => {

    const data = existWData?.filter(wakeUpCall => wakeUpCall.wakeUpCallID === id)
    console.log('wakeupdata', data)

    const [remark, setRemark] = useState('')
    const [submit, setSubmit] = useState(false)

    const handleDeleteWakeUpCall = async () => {
      setSubmit(true)
      if (remark !== '') {
        try {
          const res = await axios.post(`/wakeupcall/delete`, {}, {
            headers: {
              LoginID,
              Token,
              Seckey: 'abc'
            },
            params: {
              WakeUpCallID: id,
              Remarks: remark
            }
          })
          console.log('res', res)
          if (res?.data[0][0].Status === 'Success') {
            toast.success('Wakeupcall Deleted!')
            setDel(!del)
            setSubmit(false)
          }
        } catch (error) {
          console.log('error', error)
          toast.error('Something went wrong, Try again!')
        }
      } else {
        toast.error('Fill all fields!')
      }
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
            Are you sure, you want to delete wake up call for Room No. - {data[0]?.roomNo} permanently?
          </ModalHeader>
          <ModalBody>
            <Row className='text-center'>
              <Col>
                <Label for='remark'>Remark</Label>
                <Input
                  type='text'
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  invalid={submit && remark === ''}
                />
                {submit && remark === '' && <span className='text-danger'>Remark is required</span>}
              </Col>
              <Col xs={12}>
                <Button color='danger' className='m-1' onClick={handleDeleteWakeUpCall}>
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

  const wakeUpColumns = [
    {
      name: 'ID',
      sortable: true,
      width: '17rem',
      selector: row => row.wakeUpCallID
    },
    {
      name: 'Guest Name',
      sortable: true,
      width: '10rem',
      selector: row => row.guestName
    },
    {
      name: 'Room No.',
      sortable: true,
      width: '8rem',
      selector: row => row.roomNo
    },
    {
      name: 'Wake-up Date',
      sortable: true,
      width: '10rem',
      selector: row => moment(row.wakeUpDate).format('DD-MM-YYYY')
    },
    {
      name: 'Wake-up Time',
      sortable: true,
      width: '12rem',
      selector: row => moment(row.wakeUpTime).format('LT')
    },
    {
      name: 'Remarks',
      sortable: true,
      width: '15rem',
      selector: row => row.wakeUpRemarks
    },
    {
      name: 'Status',
      sortable: true,
      width: '15rem',
      selector: row => row.status,
      cell: row => {
        return (
          <>
            <Row className='d-flex flex-column'>
              <Col>
                <Edit3 title='Change Status' className='me-1 pe-auto cursor-pointer'
                  onClick={() => {
                    setSelected_wakeUpCall(row.wakeUpCallID)
                    setStatus(true)
                  }} size={15} /> <Badge color={row.status === 'Active' ? 'light-success' : row.status === 'NotAnswered' ? 'info' : row.status === "Completed" ? 'success' : row.status === 'Cancelled' || 'Canceled' ? 'danger' : 'warning'}>{row.status}</Badge>
              </Col>
              {row.Status !== 'Completed' && <Col>
                Remark - {row.closeRemarks}
              </Col>}
            </Row>
          </>
        )
      }
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
              setSelected_wakeUpCall(row.wakeUpCallID)
            }} size={15} />
            <Trash className='me-50' size={15} onClick={() => {
              setDel(true)
              setSelected_wakeUpCall(row.wakeUpCallID)
            }} />
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
            Wake-Up Calls
          </CardTitle>
          <Button color='primary' onClick={() => setShow(true)}>New Wake-Up Call</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                className='react-dataTable'
                data={existWData}
                columns={wakeUpColumns}
                sortIcon={<ChevronDown size={10} />}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {show && <NewWakeUpCallModal />}
      {showEdit && <EditWakeUpCallModal id={selected_wakeUpCall} />}
      {del && <DeleteWakeUpCallModal id={selected_wakeUpCall} />}
      {status && <StatusModal id={selected_wakeUpCall} />}
    </>
  )
}

export default WakeUpCall