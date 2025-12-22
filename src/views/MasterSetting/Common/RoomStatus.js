import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { Edit } from 'react-feather'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

// let data
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })


const RoomStatus = ({ roomsStatusList, refreshList, loader }) => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [selected_roomStatus, setSelected_roomStatus] = useState()

  //const [statusListChanged, setStatusListChanged] = useState(false)

  const [Status, setStatus] = useState('')
  const [StatusDescription, setStatusDescription] = useState('')

  const [display, setDisplay] = useState(false)

  // const userId = localStorage.getItem('user-id')

  const roomStatusInsert = () => {
    const roomStatusInsertBody = {
      LoginID,
      Token,
      Seckey: "abc",
      Event: "insert",
      Status,
      StatusDescription
    }
    try {
      axios.post(`/getdata/bookingdata/roomstatus`, roomStatusInsertBody)
        .then(response => {
          console.log("Room Status Insert Response", response?.data[0])
          setStatus('')
          setStatusDescription('')
          setDisplay(false)
          refreshList()
          //toast.success('Room Status Added!', { position: "top-center" })
          toast.success(response?.data[0][0].Message)
        }).catch(function (error) {
          toast.error(error.response.data.Message)
        })
    } catch (error) {
      console.log("Room Status Insert Error", error.message)
    }
  }

  const handleSubmit = () => {
    setDisplay(true)
    if (Status && StatusDescription !== '') {
      roomStatusInsert()
    }
  }
  const roomStatusTable = [
    {
      name: 'ID',
      selector: row => row.statusID
    },
    {
      name: 'Name',
      selector: row => row.status
    },
    {
      name: 'Description',
      selector: row => row.statusDescription
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <Edit className='me-50 pe-auto' size={15} onClick={() => {
            setShowEdit(true)
            setSelected_roomStatus(row.statusID)
          }} />
          {/* <Trash className='me-50' size={15} onClick={() => {
            setDel(true)
            setSelected_roomStatus(row.StatusID)
          }} /> */}
          {/* <DeleteRoomStatusModal id={selected_roomStatus} /> */}
        </>
      )
    }
  ]

  const EditRoomStatusModal = ({ id }) => {
    const roomStatusData = roomsStatusList.filter(roomStatus => roomStatus.statusID === id)
    const [editStatus, setEditStatus] = useState(roomStatusData[0]?.status)
    const [editStatusDescription, setEditStatusDescription] = useState(roomStatusData[0]?.status)

    const [editDisplay, setEditDisplay] = useState(false)

    const roomStatusEdit = () => {
      const roomStatusEditBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        StatusID: id,
        Status: editStatus,
        StatusDescription: editStatusDescription
      }
      try {
        axios.post(`/getdata/bookingdata/roomstatus`, roomStatusEditBody)
          .then(response => {
            console.log("Room Status Edit Response", response?.data[0])
            refreshList()
            toast.success(response?.data[0][0].message)
            handleEditModal()
          }).catch(function (error) {
            toast.error(error.response.data.message)
          })
      } catch (error) {
        console.log("Room Status Edit Error", error.message)
      }
    }

    const editHandleSubmit = () => {
      if (editStatus && editStatusDescription !== '') {
        setEditDisplay(true)
        roomStatusEdit()
        //toast.success('Room Status Edited Successfully!', { position: "top-center" })
      }
    }

    return (
      <>
        <Modal
          isOpen={showEdit}
          // toggle={handleEditModal}
          className='modal-dialog-centered modal-lg'
        // backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleEditModal}>
            <h1 className=' mb-1'>Edit Room Status</h1>
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <>
              <Form>
                <Row>
                  <Col lg='12'>
                    <Row className='mb-1'>
                      <Col md='2 mt-md-50'>
                        <Label for='editStatus'>
                          <span className='text-danger'>*</span>Name
                        </Label>
                      </Col>
                      <Col md='8'>
                        <Input
                          type='text'
                          name='editStatus'
                          id='editStatus'
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          invalid={editDisplay && editStatus === ''}
                        />
                        {editDisplay === true && !editStatus ? <span className='error_msg_lbl'>Name is required </span> : <></>}
                      </Col>
                    </Row>
                    <Row>
                      <Col md='2 mt-md-50'>
                        <Label for='editStatusDescription'>
                          <span className='text-danger'>*</span>Description</Label>
                      </Col>
                      <Col md='8'>
                        <Input
                          type='text'
                          name='editStatusDescription'
                          id='editStatusDescription'
                          value={editStatusDescription}
                          onChange={e => setEditStatusDescription(e.target.value)}
                          invalid={editDisplay && editStatusDescription === ''}
                        />
                        {editDisplay === true && !editStatusDescription ? <span className='error_msg_lbl'>Description is required </span> : <></>}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg='12' className='text-center mt-1 pt-1 pt-lg-0'>
                    <Button className='me-2' color='primary' onClick={editHandleSubmit}>Submit</Button>
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
      </>
    )
  }

  // const DeleteRoomStatusModal = ({ id }) => {

  //   const data = roomsStatus.filter(roomStatus => roomStatus.id === id)

  //   const handleDeleteRoomStatus = () => {
  //     setRoomsStatus(roomsStatus.filter(roomStatus => roomStatus.id !== id))
  //     setDel(!del)
  //   }

  //   return (
  //     <>
  //       <Modal
  //         isOpen={del}
  //         toggle={() => setDel(!del)}
  //         className='modal-dialog-centered'
  //         backdrop={false}
  //       >
  //         <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
  //           Are you sure to delete  {data[0]?.Status} permanently?
  //         </ModalHeader>
  //         <ModalBody>
  //           <Row className='text-center'>
  //             <Col xs={12}>
  //               <Button color='danger' className='m-1' onClick={handleDeleteRoomStatus}>
  //                 Delete
  //               </Button>
  //               <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
  //                 Cancel
  //               </Button>
  //             </Col>
  //           </Row>
  //         </ModalBody>
  //       </Modal>
  //       {
  //         del ? (
  //           <div className="modal-backdrop fade show" ></div>
  //         ) : null
  //       }
  //     </>
  //   )
  // }

  return (
    <>
      <Card>
        <Card className='bg-light mb-0'>
          <CardBody>
            <Row>
              <Col lg='9'>
                <Row>
                  <Col md='2 text-md-end mt-md-50'>
                    <Label for='Status'>
                      <span className='text-danger'>*</span>Name
                    </Label>
                  </Col>
                  <Col md='4'>
                    <Input
                      type='text'
                      name='Status'
                      id='Status'
                      value={Status}
                      onChange={e => setStatus(e.target.value)}
                      invalid={display && Status === ''}
                    />
                    {display === true && !Status ? <span className='error_msg_lbl'>Name is required </span> : null}
                  </Col>
                  <Col md='2 text-md-end mt-md-50'>
                    <Label for='StatusDescription'>
                      <span className='text-danger'>*</span>Description
                    </Label>
                  </Col>
                  <Col md='4'>
                    <Input
                      type='text'
                      name='StatusDescription'
                      id='StatusDescription'
                      value={StatusDescription}
                      onChange={e => setStatusDescription(e.target.value)}
                      invalid={display && StatusDescription === ''}
                    />
                    {display === true && !StatusDescription ? <span className='error_msg_lbl'>Description is required </span> : null}
                  </Col>
                </Row>
              </Col>
              <Col lg='3' className='pt-1 pt-md-0 text-md-start text-center'>
                <Button color='primary' onClick={handleSubmit}>Submit</Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <CardBody>
          <div className='text-center'>
            {
              <DataTable
                noHeader
                data={roomsStatusList}
                columns={roomStatusTable}
                className='react-dataTable'
                pagination
                progressPending={loader}
              />
            }
          </div>
          <div>
            <Button className='me-2' color='primary' onClick={refreshList}>Reload</Button>
          </div>
        </CardBody>
      </Card>
      {showEdit ? <EditRoomStatusModal id={selected_roomStatus} /> : <></>}
    </>
  )
}

export default RoomStatus