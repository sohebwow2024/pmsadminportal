import { useState, useEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import '../HouseKeeping.scss'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, ListGroupItem, Input, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Trash } from "react-feather"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const CheckList = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-HouseKeeping Checklist"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const [checkList1, setCheckList1] = useState([])
  console.log("CheckList===>111",checkList1)
  const [roomTypeList, setRoomTypeList] = useState([])
  const [roomTypeName, setRoomTypeName] = useState('')
  const [roomTypeId, setRoomTypeId] = useState('')
  const [filterString, setFilterString] = useState('')

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  // const userId = localStorage.getItem('user-id')
  // const userToken = localStorage.getItem('user-token')

  const checkListDetailsList = () => {
    try {
      const checkListBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post(`/housekeeping/checklist`, checkListBody)
        .then(response => {
          // console.log("CheckList Response", response.data[0])
          setCheckList1(response.data[0])
        })

    } catch (error) {
      console.log("CheckList Error", error.message)
    }
  }

  const roomTypeListDropDown = () => {
    try {
      const roomTypeListBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post(`/getdata/bookingdata/roomtype`, roomTypeListBody)
        .then(response => {
          setRoomTypeList(response?.data[0])
          console.log("file: CheckList.js:58  roomTypeListDropDown  response", response?.data[0])
        })
    } catch (error) {
      console.log("Room Type Error", error.message)
    }
  }

  const roomTypeListOptions = roomTypeList?.length > 0 && roomTypeList[0]?.roomType ? roomTypeList?.map((roomTypeList) => {
    return { value: roomTypeList.roomTypeID, label: roomTypeList.roomType }
  }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  const handleRoomType = (label, value) => {
    if (label === 'reload') {
      roomTypeListDropDown()
      return
    }
    setRoomTypeName(label)
    setRoomTypeId(value)

  }

  useEffect(() => {
    checkListDetailsList()
    roomTypeListDropDown()
  }, [])

  const roomtypefilter = checkList1?.filter(function (roomTypeList) {
    return roomTypeList.roomType === roomTypeName
  })

  const NewCheckListModal = () => {
    const [RoomTypeId, setRoomTypeId] = useState('')
    const [roomTypeName, setRoomTypeName] = useState('')
    const [ItemName, setItemName] = useState('')

    const [display, setDisplay] = useState(false)

    const addNewCheckList = async () => {
      const addCheckListBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "insert",
        RoomTypeID: RoomTypeId,
        RoomType: roomTypeName,
        ItemName
      }
      console.log("file: CheckList.js:102  addNewCheckList  addCheckListBody", addCheckListBody)
      try {
        await axios.post(`/housekeeping/checklist`, addCheckListBody)
          .then(() => {
            checkListDetailsList()
            handleModal()
            toast.success('New Item Added!', { position: "top-center" })
          })
      } catch (error) {
        console.log("CheckList Insert Error", error.message)
      }
    }

    const handleSubmit = () => {
      setDisplay(true)
      if (roomTypeName?.trim() && RoomTypeId?.trim() && ItemName?.trim() !== '') {
        addNewCheckList()
      }
    }

    return (
      <Modal
        isOpen={show}
        className='modal-dialog-centered modal-lg '
      >
        <ModalHeader className='bg-transparent' toggle={handleModal}>
          Add New Items
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <Row>
            <Col lg='4' className='mb-2'>
              <Label className='form-label' for='roomTypeName'>
                <span className='text-danger'>*</span>Select Room Category
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={roomTypeListOptions}
                isClearable={false}
                value={roomTypeListOptions?.filter(c => c?.value === RoomTypeId)}
                onChange={e => {
                  setRoomTypeId(e?.value)
                  setRoomTypeName(e?.label)
                }}
              />
              {display && !RoomTypeId?.trim() ? <span className='error_msg_lbl'>Enter Item to Add</span> : null}
            </Col>
            {/* <Col lg='4' className='mb-2'>
              <Label className='form-label' for='roomTypeName'>
                <span className='text-danger'>*</span>Room Type ID
              </Label>
              <Input type='text' name='roomTypeName' id='roomTypeName' value={roomTypeName} onChange={e => setRoom(e.target.value)} invalid={display && roomTypeName.trim() === ''} />
              {display && !roomTypeName.trim() ? <span className='error_msg_lbl'>Enter Room Type ID</span> : null}
            </Col>
            <Col lg='4' className='mb-2'>
              <Label className='form-label' for='RoomType'>Room Type</Label>
              <Input type='text' name='RoomType' id='RoomType' value={RoomType} onChange={e => setRoomType(e.target.value)} invalid={display && RoomType.trim() === ''} />
              {display && !RoomType.trim() ? <span className='error_msg_lbl'>Enter Room Type</span> : null}
            </Col> */}

            <Col lg='4' className='mb-2'>
              <Label className='form-label' for='ItemName'>Item Name</Label>
              <Input type='text' name='ItemName' id='RoomType' value={ItemName} onChange={e => setItemName(e.target?.value)} invalid={display && ItemName.trim() === ''} />
              {display && !ItemName.trim() ? <span className='error_msg_lbl'>Enter Item to Add</span> : null}
            </Col>
          </Row>
          <Row tag='form'>
            <Col className='text-center mt-1' xs={12}>
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
        </ModalBody>
      </Modal>
    )
  }


  const DeleteList2 = (id) => {
    try {
      const checkListDeleteBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "delete",
        HouseKeepingChecklistID: id
      }
      axios.post(`/housekeeping/checklist`, checkListDeleteBody)
        .then(() => {
          checkListDetailsList()
        })
    } catch (error) {
      console.log("CheckList Delete", error.message)
    }
  }
  const onDragNewCheckList = async (itemName) => {
    if (roomTypeId === "" || roomTypeName === "" || itemName === "") {
      toast.error("please select a room type")
      return
    }
    const addCheckListBody = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "insert",
      RoomTypeID: roomTypeId,
      RoomType: roomTypeName,
      itemName
    }
    console.log("file: CheckList.js:102  addNewCheckList  addCheckListBody", addCheckListBody)
    try {
      await axios.post(`/housekeeping/checklist`, addCheckListBody)
        .then(() => {
          checkListDetailsList()
          toast.success('New Item Added!', { position: "top-center" })
        })
    } catch (error) {
      console.log("CheckList Insert Error", error.message)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Services For Rooms</CardTitle>
      </CardHeader>
      <CardBody>
        {/* <CardText>
          Add handle to your items using <code>handle</code> prop.
        </CardText> */}
        <Row id='dd-with-handle'>
          <Col md='6' sm='12'>
            <h4 className='my-1'>CHECK LIST ITEMS</h4>
            <Row>
              <Col className='my-1 text-center' md='10' sm='12'>
                <Input
                  type='text'
                  placeholder='Search'
                  value={filterString}
                  onChange={e => setFilterString(e.target.value)} />
              </Col>
              <Col md='2' className='my-1 ms-0 ps-0'>
                <Button color='primary' onClick={() => setShow(true)}>Add</Button>
              </Col>
            </Row>
            <ReactSortable
              tag='ul'
              className='list-group sortable'
              group='shared-handle-group'
              handle='.handle'
              list={checkList1}
              setList={setCheckList1}
              animation={100}
              onEnd={(e) => {
                onDragNewCheckList(e.item?.innerText.slice(1))
              }}
            >
              {/* {checkList1?.filter(qt => qt.itemName.toLowerCase().includes(filterString.toLowerCase())).map((item) => { */}
              {checkList1?.filter(qt => {
                  const name = (qt?.itemName ?? '')
                  return filterString?.trim() === '' ? true : name.toLowerCase().includes(filterString.toLowerCase())
                }).map((item) => {
                return (
                  <ListGroupItem className='draggable d-flex align-item-center justify-content-between' key={item.houseKeepingChecklistID}>
                    <div>
                      <span className='handle'>+</span>
                      {item.itemName}
                    </div>
                    <div>
                      <Trash size={15} className='cursor-pointer' onClick={() => DeleteList2(item.houseKeepingChecklistID)} />
                    </div>
                  </ListGroupItem>
                )
              })
              }
              {/* {checkList1 ? (checkList1.map(item => {
                return (
                  <ListGroupItem className='draggable d-flex align-item-center justify-content-between' key={item.HouseKeepingChecklistID}>
                    <div>
                      <span className='handle'>+</span>
                      {item.ItemName}
                    </div>
                    <div>
                      <Trash size={15} className='cursor-pointer' onClick={() => DeleteList2(item.HouseKeepingChecklistID)} />
                    </div>
                  </ListGroupItem>
                )
              })) : (
                <h1>No results found!</h1>
              )
              } */}
            </ReactSortable>
          </Col>
          <Col md='6' sm='12'>
            <Row>
              <Col md='12' sm='12'>
                <Label>Room Category</Label>
              </Col>
              <Col md='12' sm='12'>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={roomTypeListOptions}
                  isClearable={false}
                  value={roomTypeListOptions?.filter(c => c.value === roomTypeId)}
                  onChange={e => {
                    handleRoomType(e.label, e.value)
                  }}
                />
              </Col>
              <Col md='12' sm='12'>
                <h4 className='my-1'>{roomTypeName}</h4>

                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle=".handle"
                  list={roomtypefilter}
                  setList={setCheckList1}
                  animation={150}

                >
                  {roomtypefilter ? (roomtypefilter.map(item => {
                    return (
                      <ListGroupItem className='draggable d-flex align-item-center justify-content-between' key={item.houseKeepingChecklistID}>
                        <div className=''>
                          <span className='handle'>+</span>
                          {item.itemName}
                        </div>
                        <div>
                          <Trash size={15} className='cursor-pointer' onClick={() => DeleteList2(item.houseKeepingChecklistID)} />
                        </div>
                      </ListGroupItem>
                    )
                  })) : <Col className='drop_here' md='12' sm='12'>
                    <span>Drop Services Here</span>
                  </Col>
                  }
                </ReactSortable>
              </Col>
            </Row>

          </Col>
        </Row>
      </CardBody >
      {show ? <NewCheckListModal /> : <></>}
    </Card >
  )
}

export default CheckList