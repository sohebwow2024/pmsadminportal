import React, { useState, Fragment } from 'react'
import {
  Table, Badge, Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody,
  Button, Form, ButtonGroup
} from 'reactstrap'
import DataTable from 'react-data-table-component'
import { data, columns } from '../Data'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const roomCategory = [
  { value: '', label: 'All Rooms' },
  { value: 'executive', label: 'Executive Suite Room' },
  { value: 'swiss', label: 'Swiss Tent' },
  { value: 'mixed', label: 'Mixed Dorm' },
  { value: 'deluxe', label: 'Deluxe Room' },
  { value: 'superior', label: 'Superior Room' }
]
const cleanStatus = [
  { value: '', label: 'All Rooms' },
  { value: 'dirty', label: 'Dirty' },
  { value: 'clean', label: 'Clean' }
]
const repairStatus = [
  { value: '', label: 'All Rooms' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
]
const roomStatus = [
  { value: '', label: 'All Rooms' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'vacant', label: 'Vacant / Empty' }
]
const LogedUserAccess = () => {
  // model open 
  const [show, setShow] = useState(false)
  const [cardType, setCardType] = useState('')
  // ** States
  const [searchRoom, setSearchName] = useState('')
  const [searchCleanStatus, setSearchPost] = useState('')
  const [searchRepair, setSearchRepairRequire] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [searchRoomNumber, setSearchRoomNo] = useState('')
  const [searchRoomStatus, setSearchSRoom] = useState('')
  const [Maintains, setMaintains] = useState('')
  const [filteredData, setFilteredData] = useState([])

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchRoom.length ||
      searchCleanStatus.length ||
      searchRoomNumber.length ||
      searchRepair.length ||
      searchRoomStatus.length ||
      Maintains.length
    ) {
      return filteredData
    } else {
      return data
    }
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil(dataToRender().length / 7) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
    />
  )

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        return filteredData
      } else {
        return data
      }
    }

    setSearchName(value)
    console.log(value.length)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.room_category.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.room_category.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchName(value)

    }
  }
  const handleMaitains = e => {
    const value = e.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        console.log('filteredData', filteredData)
        return filteredData
      } else {
        console.log('data', data)
        return data
      }
    }

    setMaintains(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.close_dueto_maintains.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.close_dueto_maintains.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      setFilteredData(updatedData)
      setMaintains(value)
    }
  }
  // ** Function to handle repair_require filter
  const handleRepairRequired = e => {
    const value = e.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        console.log('filteredData', filteredData)
        return filteredData
      } else {
        console.log('data', data)
        return data
      }
    }

    setSearchRepairRequire(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.repair_require.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.repair_require.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchRepairRequire(value)
    }
  }
  // ** Function to handle email filter
  const handleCleanStatus = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        return filteredData
      } else {
        return data
      }
    }

    setSearchRoomNo(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.room_no.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.room_no.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchRoomNo(value)
    }
  }

  // ** Function to handle cleaning_status filter
  const handleCleaningStatus = e => {
    const value = e.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        return filteredData
      } else {
        return data
      }
    }

    setSearchPost(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.cleaning_status.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.cleaning_status.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchPost(value)
    }
  }

  // ** Function to handle room_status filter
  const handleRoomStatus = e => {
    const value = e.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length || searchRoomNumber.length || searchCleanStatus.length || searchRepair.length || Maintains.length || searchRoomStatus.length) {
        return filteredData
      } else {
        return data
      }
    }

    setSearchSRoom(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.room_status.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.room_status.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      console.log([updatedData])

      setFilteredData(updatedData)
      setSearchSRoom(value)
    }
  }


  return (
    <>
      <Card>
        <CardHeader className='d-flex justify-content-between'>
          <CardTitle>Search</CardTitle>
          <Button color='primary' onClick={(e) => {
            e.preventDefault()
            setShow(!show)
          }}>Bundle Operation</Button>
        </CardHeader>
        <CardBody>
          <Row className='mt-1 mb-50'>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='room'>
                Room Category:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={roomCategory[0]}
                options={roomCategory}
                isClearable={false}
                onChange={handleNameFilter}
              />
              {/* <Input id='name' placeholder='Bruce Wayne' value={searchRoom} onChange={handleNameFilter} /> */}
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='number'>
                Room Number:
              </Label>
              <Input
                type='number'
                id='number'
                placeholder='enter room number'
                value={searchRoomNumber}
                onChange={handleCleanStatus}
              />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='cleaning_status'>
                Cleaning Status:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={cleanStatus[0]}
                options={cleanStatus}
                isClearable={false}
                onChange={handleCleaningStatus}
              />
              {/* <Input id='cleaning_status' placeholder='Web Designer' value={searchCleanStatus} onChange={handleCleaningStatus} /> */}
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='repair_require'>
                Repair Required:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={repairStatus[0]}
                options={repairStatus}
                isClearable={false}
                onChange={handleRepairRequired}
              />
              {/* <Input id='repair_require' placeholder='San Diego' value={searchRepair} onChange={handleRepairRequired} /> */}
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='room_status'>
                Closed Due to Maintains:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={repairStatus[0]}
                options={repairStatus}
                isClearable={false}
                onChange={handleMaitains}
              />
              {/* <Input id='room_status' placeholder='10000' value={Maintains} onChange={handleMaitains} /> */}
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='room_status'>
                Room Status:
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={roomStatus[0]}
                options={roomStatus}
                isClearable={false}
                onChange={handleRoomStatus}
              />
              {/* <Input id='room_status' placeholder='10000' value={searchRoomStatus} onChange={handleRoomStatus} /> */}
            </Col>

          </Row>
          <CardTitle>EDITABLE TABLE</CardTitle>
          <div className='react-dataTable'>
            <DataTable
              noHeader
              pagination
              columns={columns}
              paginationPerPage={7}
              className='react-dataTable'
              sortIcon={<ChevronDown size={10} />}
              paginationDefaultPage={currentPage + 1}
              paginationComponent={CustomPagination}
              data={dataToRender()}
            />
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
              <Button color='success' className='w-100' >Mark All Room As Clean</Button>
            </Col>
            <Col className='pt-1' lg='12' md='12' xl='12'>
              <Button color='danger' className='w-100' >Mark All Room As Dirty</Button>
            </Col>
            <Col className='pt-1' lg='12' md='12' xl='12'>
              <Button color='info' className='w-100' >Mark All Room As Vacant</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default LogedUserAccess