import React, { useState, useEffect } from 'react'
import {
  Badge, Card, CardTitle, CardBody, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody,
  Button, Spinner
} from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, MoreVertical, Edit, FileText, Archive, Trash, Eye, EyeOff } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { left } from '@popperjs/core'

const cleanOptions = [
  { value: 'Dirty', label: 'Dirty' },
  { value: 'Clean', label: 'Clean' }
]

const roomStatusOptions = [
  { value: 'Occupied', label: 'Occupied' },
  { value: 'Empty', label: 'Empty' }
]

const yes_no_options = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
]

const Status = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Housekeeping Status"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData
  // const userId = localStorage.getItem('user-id')
  // const userToken = localStorage.getItem('user-token')

  const [original_data, setOriginal_data] = useState([])
  console.log("Original_Data===>",original_data)
  const [data, setData] = useState([])
  const [roomCategoryList, setRoomCategoryListlist] = useState([])
  const [cleanStatusList, setCleanStatusList] = useState([])
  const [repairStatusList, setRepairStatusList] = useState([])
  const [maintainStatusList, setMaintainStatusList] = useState([])
  const [roomStatusList, setRoomStatusList] = useState([])
  const [delUser, setDelUser] = useState(false)
  const [repair, setRepair] = useState(false)
  const [maintainModal, setMaintainModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [cardType, setCardType] = useState('')
  const [searchName, setSearchName] = useState("")
  const [searchCleanStatus, setSearchCleanStatus] = useState('')
  const [searchRepair, setSearchRepairRequire] = useState('')
  const [searchRoomNumber, setSearchRoomNo] = useState('')
  const [searchRoomStatus, setSearchSRoom] = useState('')
  const [Maintains, setMaintains] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [sel_id, setSel_id] = useState()
  const repairRequired = () => setRepair(!repair)
  const handleCleanRoom = () => setDelUser(!delUser)
  const handleMaintainRoom = () => setMaintainModal(!maintainModal)

  const [roomCatId, setRoomCatId] = useState(null)
  const [roomNo, setRoomNo] = useState(null)
  const [cleaningStatus, setCleaningStatus] = useState(null)
  const [repRequired, setRepRequired] = useState(null)
  const [handleMaintains, setHandleMaintains] = useState(null)
  const [roomStatus, setRoomStatus] = useState(null)

  // console.log('roomCatId', roomCatId, roomNo, cleaningStatus, repRequired, handleMaintains, roomStatus);



  const getRoomStatus = async () => {
    setDataLoading(true)
    try {
      const postData = {
        LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select"
      }
      await axios.post("/housekeeping", postData).then((res) => {
        console.log('response housekeeping', res);
        setData(res.data[5])
        setOriginal_data(res?.data[5])
        setRoomCategoryListlist(res?.data[0]?.map(function (item) {
          return { value: item.roomTypeID, label: item.roomCategory }
        }))
        const cleaningStatus = res?.data[1].length > 0 && [...new Set(res.data[1]?.map(label => label.status))]
        setCleanStatusList(cleaningStatus?.map(function (item) {
          return { value: item, label: item }
        }))
        setRepairStatusList(res?.data[2]?.map(function (item) {
          return { value: item.status, label: item.status }
        }))

        setMaintainStatusList(res?.data[3]?.map(function (item) {
          return { value: item.status, label: item.status }
        }))
        const roomStatus = res?.data[4].length > 0 && [...new Set(res.data[4]?.map(label => label.status))]
        setRoomStatusList(roomStatus?.map(function (item) {
          return { value: item, label: item }
        }))
      })
      setDataLoading(false)
    } catch (error) {
      console.log("file: Status.js:60  getRoomStatus  error", error)
      setDataLoading(false)
    }
  }
  const clearAll = () => {
    setRoomCatId(null)
    setRoomNo(null)
    setCleaningStatus(null)
    setRepRequired(null)
    setHandleMaintains(null)
    setRoomStatus(null)
    getRoomStatus()
  }
  const roomUpdate = async (props) => {
    console.log('props Update', props)
    setLoading(true)
    try {
      // const { HouseKeepingID, RoomCategoryID, ClosedDueToMaintenance, RepairRequired, RoomID, FloorID, CleaningStatusId, RoomStatus, StatusID } = props
      // console.log('props Update', props)
      const updateData = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "update",
        HouseKeepingID: props.HouseKeepingID,
        RoomID: props.RoomID,
        FloorID: props.FloorID,
        CleaningStatus: props.CleaningStatus,
        RepairRequired: props.RepairRequired,
        ClosedDueToMaintenance: props.ClosedDueToMaintenance,
        RoomStatus: props.RoomStatus,
        // RoomCategoryID, //should be RoomCategory? Do we need to send this?
        // StatusID //we don't need this too?
      }
      // console.log(updateData)
      await axios.post("housekeeping", updateData).then((res) => {
        setLoading(false)
        if (props.modelRes === 'clean') {
          handleCleanRoom()
          getRoomStatus()
          clearAll()
        } else if (props.modelRes === 'repair') {
          repairRequired()
          getRoomStatus()
          clearAll()
        } else if (props.modelRes === 'maintain') {
          handleMaintainRoom()
          getRoomStatus()
          clearAll()
        }
        // console.log("file: Status.js:67  awaitaxios.post  res", res)
      })
    } catch (error) {
      setLoading(false)
      console.log("file: Status.js:74  roomUpdate  error", error)
    }

  }
  const CombinationFilter = async () => {
    try {
      // const { HouseKeepingID, RoomCategoryID, ClosedDueToMaintenance, RepairRequired, RoomID, FloorID, CleaningStatusId, RoomStatus, StatusID } = props
      // console.log('props Update', props)
      const updateData = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "select",
        HouseKeepingID: '',
        RoomID: roomNo,
        FloorID: '',
        CleaningStatus: cleaningStatus,
        RepairRequired: repRequired,
        ClosedDueToMaintenance: handleMaintains,
        RoomStatus: roomStatus,
        RoomCategoryID: roomCatId
        // StatusID //we don't need this too?
      }
      console.log('file: Status.js:67  awaitaxios.post  res', updateData)
      await axios.post("housekeeping", updateData).then((res) => {

        console.log("file: Status.js:67  awaitaxios.post  res", res)
        setData(res.data[5])
        setOriginal_data(res.data[5])
      })
    } catch (error) {
      console.log("file: Status.js:67  awaitaxios.post  res", error)
    }

  }

  const bunldeUpdate = async (event) => {
    const postData = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: event
    }
    try {
      await axios.post("/housekeeping", postData)
        .then((res) => {
          console.log(res)
          setShow(!show)
          getRoomStatus()
          toast.success(res.data[0][0].message)
        }).catch(function (error) {
          toast.error(error.response.data.message)
        })
    } catch (error) {
      console.log("file: Status.js:151  bundleUpdate  error", error)
    }
  }

  const filter_obj = {
    RoomCategory: searchName,
    CleaningStatus: searchCleanStatus,
    RoomNo: searchRoomNumber,
    RepairRequired: searchRepair,
    RoomStatus: searchRoomStatus,
    ClosedDueToMaintenance: Maintains
  }

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchName?.length > 0 ||
      searchCleanStatus?.length > 0 ||
      searchRoomNumber.length > 0 ||
      searchRepair?.length > 0 ||
      searchRoomStatus?.length > 0 ||
      Maintains?.length > 0
    ) {
      let filtered_data = []

      const finale = Object.keys(filter_obj).map((filter, index) => {
        console.log('indexxxxx', filter, index);
        if (filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {


          return filtered_data = original_data.filter(item => {

            console.log('filter===>', filter, filter_obj[filter], index)
            // try {
            //   // const { HouseKeepingID, RoomCategoryID, ClosedDueToMaintenance, RepairRequired, RoomID, FloorID, CleaningStatusId, RoomStatus, StatusID } = props
            //   // console.log('props Update', props)
            //   const updateData = {
            //     LoginID: LoginID,
            //     Token: Token,
            //     Seckey: "abc",
            //     Event: "update",
            //     HouseKeepingID: '123',
            //     RoomID: '123',
            //     FloorID: '123',
            //     CleaningStatus: item.CleaningStatus,
            //     RepairRequired: item.RepairRequired,
            //     ClosedDueToMaintenance: item.ClosedDueToMaintenance,
            //     RoomStatus: item.RoomStatus,
            //     // RoomCategoryID, //should be RoomCategory? Do we need to send this?
            //     // StatusID //we don't need this too?
            //   }
            //   console.log(updateData)
            //   axios.post("housekeeping", updateData).then((res) => {
            //     setLoading(false)
            //     setData(res.data[5])
            //     setOriginal_data(res.data[5])
            //     console.log("file: Status.js:67  awaitaxios.post  res", res)
            //   })
            // } catch (error) {
            //   setLoading(false)
            //   console.log("file: Status.js:74  roomUpdate  error", error)
            // }
            if (index === 0 && filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {

              return item?.roomCategory?.toLowerCase().includes(filter_obj[filter]?.toLowerCase())

            } else if (index === 1 && filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {

              return item?.cleaningStatus?.toLowerCase() === (filter_obj[filter]?.toLowerCase())

            }
            else if (index === 2 && filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {

              return item?.roomNo?.toLowerCase().includes(filter_obj[filter]?.toLowerCase())

            } else if (index === 3 && filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {

              return item?.repairRequired?.toLowerCase().includes(filter_obj[filter]?.toLowerCase())

            } else if (index === 4 && filter_obj[filter] !== '' && filter_obj[filter] !== undefined) {

              return item?.roomStatus?.toLowerCase().includes(filter_obj[filter]?.toLowerCase())

            } else {

              return item?.closedDueToMaintenance?.toLowerCase().includes(filter_obj[filter]?.toLowerCase())

            }

          })


        }
      })

      // console.log('finale', finale)
      // const newFinal = finale.flat()
      // let theFinal = [...new Set(newFinal)].filter(i => i !== undefined)
      // console.log('theFinal', theFinal)
      // console.log('filtered_data', filtered_data)
      // // return filtered_data
      // return theFinal

    } else {
      return original_data
    }
  }

  const handleNameFilter = e => {
    const value = e?.value
    console.log('value==>', value)
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length ||
    //     searchCleanStatus?.length ||
    //     searchRoomNumber.length ||
    //     searchRepair?.length ||
    //     searchRoomStatus?.length ||
    //     Maintains?.length) {

    //     return filteredData
    //   } else {
    //     return data
    //   }
    // }
    setSearchName(value)
    if (value?.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        // const startsWith = item?.RoomCategory.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.roomCategory?.toLowerCase().includes(value.toLowerCase())
        // if (startsWith) {
        //   return startsWith
        // } else
        if (includes) {
          return includes
        } else return []
      })
      setData(updatedData)
      // setFilteredData(updatedData)
      // setSearchName(value)
    }
  }

  const handleMaitains = e => {
    const value = e?.value
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length || searchRoomNumber.length || searchCleanStatus?.length || searchRepair?.length || Maintains?.length || searchRoomStatus?.length) {
    //     return [...filteredData]
    //   } else {
    //     return data
    //   }
    // }
    setMaintains(value)
    if (value?.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        // const startsWith = item.ClosedDueToMaintenance.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.closedDueToMaintenance?.toLowerCase().includes(value.toLowerCase())

        // if (startsWith) {
        //   return startsWith
        // } else 
        if (includes) {
          return includes
        } else return []
      })
      setData(updatedData)
      // setFilteredData([...updatedData])
      // setMaintains(value)
    }
  }
  // ** Function to handle RepairRequired filter
  const handleRepairRequired = e => {
    const value = e?.value
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length || searchRoomNumber.length || searchCleanStatus?.length || searchRepair?.length || Maintains?.length || searchRoomStatus?.length) {
    //     console.log('filteredData', filteredData)
    //     return [...filteredData]
    //   } else {
    //     console.log('data', data)
    //     return data
    //   }
    // }

    setSearchRepairRequire(value)
    if (value?.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        const startsWith = item?.repairRequired?.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.repairRequired?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return []
      })
      setData(updatedData)
      // setFilteredData([...updatedData])
      // setSearchRepairRequire(value)
    }
  }
  // ** Function to handle email filter
  const handleRoomNumber = e => {
    const value = e.target?.value
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length || searchRoomNumber.length || searchCleanStatus?.length || searchRepair?.length || Maintains?.length || searchRoomStatus?.length) {
    //     return [...filteredData]
    //   } else {
    //     return data
    //   }
    // }
    setSearchRoomNo(value)
    if (value.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        console.log('item.RoomNo', item.roomNo)
        const startsWith = item?.roomNo?.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.roomNo?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return []
      })
      setData(updatedData)
      // setFilteredData([...updatedData])
      // setSearchRoomNo(value)
    }
  }

  const handleCleaningStatus = e => {
    const value = e?.value
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length || searchRoomNumber.length || searchCleanStatus?.length || searchRepair?.length || Maintains?.length || searchRoomStatus?.length) {
    //     return [...filteredData]
    //   } else {
    //     return data
    //   }
    // }
    setSearchCleanStatus(value)
    if (value?.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        const startsWith = item?.cleaningStatus?.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.cleaningStatus?.toLowerCase().includes(value.toLowerCase())
        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return []
      })
      setData(updatedData)
      // setFilteredData([...updatedData])
      // setSearchCleanStatus(value)
    }
  }

  // ** Function to handle RoomStatus filter
  const handleRoomStatus = e => {
    const value = e?.value
    let updatedData = []
    // const dataToFilter = () => {
    //   if (searchName?.length || searchRoomNumber.length || searchCleanStatus?.length || searchRepair?.length || Maintains?.length || searchRoomStatus?.length) {
    //     return [...filteredData]
    //   } else {
    //     return data
    //   }
    // }

    setSearchSRoom(value)
    if (value?.length) {
      // updatedData = dataToFilter().filter(item => {
      updatedData = original_data.filter(item => {
        const startsWith = item?.roomStatus?.toLowerCase().startsWith(value.toLowerCase())
        const includes = item?.roomStatus?.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return []
      })
      setData(data)
      // setFilteredData([...updatedData])
      // setSearchSRoom(value)
    }
  }


  useEffect(() => {
    getRoomStatus()
  }, [])

  const columns = [
    {
      name: 'Room Name',
      sortable: true,
      minWidth: '18rem',
      sortable: row => row.roomDisplayName,
      selector: row => row.roomDisplayName
    },
    {
      name: 'Room Category',
      sortable: true,
      minWidth: '18rem',
      sortable: row => row.roomCategory,
      selector: row => row.roomCategory
    },
    {
      name: 'Booking ID',
      sortable: true,
      minWidth: '200px',
      sortable: row => row.bookingId,
      selector: row => row.bookingId
    },
    {
      name: 'Room Number',
      sortable: true,
      minWidth: '150px',
      sortable: row => +row.roomNo,
      selector: row => row.roomNo
    },
    {
      name: 'Cleaning Status',
      sortable: true,
      minWidth: '160px',
      sortable: row => row.cleaningStatus,
      selector: row => {
        return (
          <Badge color={row.cleaningStatus === 'Clean' ? 'light-success' : 'light-danger'} pill>
            {row.cleaningStatus}
          </Badge>
        )
      }
    },
    {
      name: 'Repair Required',
      sortable: true,
      minWidth: '160px',
      sortable: row => row.repairRequired,
      selector: row => {
        return (
          <Badge color={row.repairRequired === 'No' ? 'light-success' : 'light-danger'} pill>
            {row.repairRequired}
          </Badge>
        )
      }
    },
    {
      name: 'Closed Due to Maintains?',
      sortable: true,
      minWidth: '210px',
      sortable: row => row.closedDueToMaintenance,
      selector: row => {
        return (
          <Badge color={row.closedDueToMaintenance === 'No' ? 'light-success' : 'light-danger'} pill>
            {row.closedDueToMaintenance}
          </Badge>
        )
      }
    },
    {
      name: 'Room Status',
      sortable: true,
      minWidth: '140px',
      sortable: row => row.roomStatus,
      selector: row => {
        return (
          <Badge color={row.roomStatus === 'Occupied' ? 'light-danger' : 'light-success'} pill>
            {row.roomStatus}
          </Badge>
        )
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <UncontrolledDropdown>
              <DropdownToggle className='pe-1' tag='span'>
                <MoreVertical size={15} style={{ cursor: "pointer" }} />
              </DropdownToggle>
              <DropdownMenu style={{ zIndex: 10 }}>
                <DropdownItem className='w-100' onClick={() => {
                  handleCleanRoom()
                  setSel_id(row)
                  console.log(row)
                }}>
                  <CleaningConfirm
                    modelRes='clean'
                    FloorID={sel_id?.floorID}
                    RoomID={sel_id?.roomID}
                    RoomStatus={sel_id?.roomStatus}
                    open={delUser}
                    handleCleanRoom={handleCleanRoom}
                    HouseKeepingID={sel_id?.houseKeepingID}
                    CleaningStatus={sel_id?.cleaningStatus === "Clean" ? "Dirty" : "Clean"}
                    // CleaningStatusId={sel_id?.CleaningStatusID === "Clean" ? "Dirty" : "Clean"}
                    // RepairRequired={sel_id?.RepairRequiredID}
                    RepairRequired={sel_id?.repairRequired}
                    // ClosedDueToMaintenance={sel_id?.ClosedDueToMaintenanceID}
                    ClosedDueToMaintenance={sel_id?.closedDueToMaintenance}
                  />
                  <FileText size={15} />
                  <span className='align-middle ms-50'> Mark As {row?.cleaningStatus === 'Clean' ? 'Dirty' : 'Clean'} </span>
                </DropdownItem>

                <DropdownItem className='w-100' onClick={() => {
                  repairRequired()
                  setSel_id(row)
                  console.log("file: Status.js:372  Status  row", row)
                }}>
                  <RepairRequider
                    modelRes='repair'
                    FloorID={sel_id?.floorID}
                    RoomID={sel_id?.roomID}
                    RoomStatus={sel_id?.roomStatus}
                    open={repair}
                    repairRequired={repairRequired}
                    HouseKeepingID={sel_id?.houseKeepingID}
                    // rapairStatus={sel_id?.RepairRequired}
                    // CleaningStatusId={sel_id?.CleaningStatusID}
                    CleaningStatus={sel_id?.cleaningStatus}
                    // RepairRequired={sel_id?.RepairRequiredID === "No" ? "Yes" : "No"}
                    RepairRequired={sel_id?.repairRequired === "No" ? "Yes" : "No"}
                    ClosedDueToMaintenance={sel_id?.closedDueToMaintenance}
                  // ClosedDueToMaintenance={sel_id?.ClosedDueToMaintenanceID}
                  />
                  <Archive size={15} />
                  <span className='align-middle ms-50'>Repair Work {row.repairRequider === 'No' ? 'Required' : 'Done'}</span>
                </DropdownItem>

                <DropdownItem className='w-100' onClick={() => {
                  handleMaintainRoom()

                  setSel_id(row)
                  console.log(row)
                }}>
                  <MaintainConfirm
                    modelRes='maintain'
                    FloorID={sel_id?.floorID}
                    RoomID={sel_id?.roomID}
                    RoomStatus={sel_id?.roomStatus}
                    open={maintainModal}
                    handleMaintainRoom={handleMaintainRoom}
                    HouseKeepingID={sel_id?.houseKeepingID}
                    // maintainStatus={sel_id?.ClosedDueToMaintenance}
                    // CleaningStatusId={sel_id?.CleaningStatusID}
                    CleaningStatus={sel_id?.cleaningStatus}
                    // RepairRequired={sel_id?.RepairRequiredID}
                    RepairRequired={sel_id?.repairRequired}
                    ClosedDueToMaintenance={sel_id?.closedDueToMaintenance === "No" ? "Yes" : "No"}
                  />
                  <Trash size={15} />
                  <span className='align-middle ms-50'>{row.closedDueToMaintenance === 'No' ? 'Close/Under Maintenance' : 'Open/Maintenance Done'}</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )
      }
    }
  ]

  const CleaningConfirm = (props) => {
    return (
      <>
        <Modal
          isOpen={props.open}
          toggle={props.handleCleanRoom}
          className='modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader toggle={props.handleCleanRoom}></ModalHeader>
          <ModalBody>
            <Row>
              <Col className='text-center'>
                <h5>Please confirm again if you want to make this room as {props.CleaningStatus} ?</h5>
              </Col>
            </Row>
            <Row>
              <Col className='text-center'>
                <Button className='mx-1' color='success' onClick={() => roomUpdate(props)}>{loading ? <div> <Spinner size="small" /></div> : "Confirm"}</Button>
                <Button className='mx-1' color='danger' onClick={props.handleCleanRoom}>Cancel</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

      </>
    )
  }
  const RepairRequider = (props) => {

    return (
      <>
        <Modal
          isOpen={props.open}
          toggle={props.repairRequired}
          className='modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader toggle={props.repairRequired}></ModalHeader>
          <ModalBody>
            <Row>
              <Col className='text-center'>
                <h5>Please confirm again if you want to make this room repair status as {props.repairRequired} ?</h5>
              </Col>
            </Row>
            <Row>
              <Col className='text-center'>
                <Button className='mx-1' color='success' onClick={() => roomUpdate(props)}>{loading ? <div> <Spinner size="small" /></div> : "Confirm"}</Button>
                <Button className='mx-1' color='danger' onClick={props.repairRequired}>Cancel</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

      </>
    )
  }
  const MaintainConfirm = (props) => {

    return (
      <>
        <Modal
          isOpen={props.open}
          toggle={props.handleMaintainRoom}
          className='modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader toggle={props.handleMaintainRoom}></ModalHeader>
          <ModalBody>
            <Row>
              <Col className='text-center'>
                <h5>Please confirm again if you want to make this room maintain status as {props.closedDueToMaintenance} ?</h5>
              </Col>
            </Row>
            <Row>
              <Col className='text-center'>
                <Button className='mx-1' color='success' onClick={() => roomUpdate(props)}>{loading ? <div> <Spinner size="small" /></div> : "Confirm"}</Button>
                <Button className='mx-1' color='danger' onClick={props.handleMaintainRoom}>Cancel</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

      </>
    )
  }

  const customStyles = {
    rows: {
      style: {
        minHeight: '172px', // override the row height
      },
    }
  };

  return (
    <>
      {console.log('data', data)}
      <Card>
        <CardHeader className='d-flex justify-content-between'>
          <CardTitle>Housekeeping Status</CardTitle>
          <Col className='mb-1 justify-content-center text-center'>

          </Col>
          <Button color='primary' onClick={(e) => {
            e.preventDefault()
            setShow(!show)
          }}>Bundle Operation</Button>
        </CardHeader>
        <CardBody>
          <div>
            <p style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={clearAll}>CLEAR ALL ENTRIES</p>
          </div>
          <Row className='mt-1 mb-50'>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='room'>
                Room Category:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={roomCategoryList}
                name='clear'
                onChange={(c) => setRoomCatId(c.value)}
                value={roomCategoryList?.filter(c => c.value === roomCatId)}
              // isClearable={true}
              />
              {console.log('searchName', searchName)}
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='number'>
                Room Number:
              </Label>
              <Input
                type='number'
                id='number'
                placeholder='enter number'
                // onChange={handleRoomNumber}
                onChange={(c) => setRoomNo(c.target.value)}
                value={roomNo}
              />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='CleaningStatus'>
                Cleaning Status:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                name='clear'
                options={cleanOptions}
                // isClearable={true}
                onChange={(c) => setCleaningStatus(c.value)}
                // onChange={handleCleaningStatus}
                value={cleanOptions?.filter(c => c.value === cleaningStatus)}
              />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='RepairRequired'>
                Repair Required:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={yes_no_options}
                // isClearable={true}
                // onChange={handleRepairRequired}
                onChange={(c) => setRepRequired(c.value)}
                value={yes_no_options?.filter(c => c.value === repRequired)}
              />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='RoomStatus'>
                Closed Due to Maintains?:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={yes_no_options}
                // isClearable={true}
                // onChange={handleMaitains}
                onChange={(c) => setHandleMaintains(c.value)}
                value={yes_no_options?.filter(c => c.value === handleMaintains)}
              />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='RoomStatus'>
                Room Status:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={roomStatusOptions}
                // isClearable={true}
                onChange={(c) => setRoomStatus(c.value)}
                // onChange={handleRoomStatus}
                value={roomStatusOptions?.filter(c => c.value === roomStatus)}
              />
            </Col>
            <Button color='primary' style={{ width: '150px', marginLeft: 'auto', marginRight: '15px' }} onClick={(e) => {
              e.preventDefault()
              CombinationFilter()
            }}>Search</Button>
          </Row>

          <div style={{ zIndex: 100 }}>
            {dataLoading ? <div style={{ textAlign: 'center', marginTop: "3rem" }}> <h2 style={{ text: 'center' }}>Loading...</h2></div> : (
              <DataTable
                noHeader
                pagination
                columns={columns}
                paginationPerPage={7}
                sortIcon={<ChevronDown size={10} />}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                data={original_data}
                clearSelectedRows={true}
                customStyles={original_data?.length === 1 ? customStyles : ''}
              // style={{ zIndex: 100 }}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* model here */}

      <Modal
        isOpen={show}
        toggle={() => {
          setShow(!show)
        }}
        className='modal-dialog-centered'
        onClosed={() => setCardType('')}
        size='sm'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent border-bottom' toggle={() => {
          setShow(!show)
        }}>
          <p>Bundle Operation</p>
        </ModalHeader>
        <ModalBody className='rate_inventry'>
          {cardType !== '' && cardType !== 'unknown' ? (
            <InputGroupText className='p-25'>
              <span className='add-card-type'>
                <img height='24' alt='card-type' src={cardsObj[cardType]} />
              </span>
            </InputGroupText>
          ) : null}
          <Row>
            <Col className='pt-1' lg='12' md='12' xl='12'>
              <Button color='success' className='w-100' onClick={() => bunldeUpdate("update_markallasclean")} >Mark All Room As Clean</Button>
            </Col>
            <Col className='pt-1' lg='12' md='12' xl='12'>
              <Button color='danger' className='w-100' onClick={() => bunldeUpdate("update_markallasdirty")}>Mark All Room As Dirty</Button>
            </Col>
            <Col className='pt-1' lg='12' md='12' xl='12'>
              <Button color='info' className='w-100' onClick={() => bunldeUpdate("update_markallasempty")}>Mark All Room As Empty</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {
        show || repair || delUser ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default Status