import React, { useState } from 'react'
import {
  Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody,
  Button, Form, Alert
} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { data, columns } from './Data'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { MoreVertical, Edit, Trash, ChevronDown } from 'react-feather'
import Cleave from 'cleave.js/react'

const POS = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const handlePagination = page => setCurrentPage(page.selected)

  const dataToRender = () => {
    return data
  }
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
  const colourOptions = [
    { value: 'room no.', label: 'Search By Room No' },
    { value: 'name', label: 'Search By Name' },
    { value: 'mobile', label: 'Search By Mobile No.' }
  ]
  const colourOptions1 = [
    { value: '201', label: '201' },
    { value: '202', label: '202' },
    { value: '203', label: '203' }
  ]
  const optionsTime = { time: true, timePattern: ['h', 'm', 's'] }
  return (
    <>
      <Card>
        <CardHeader className='border-bottom'><h2>Food Order</h2></CardHeader>
        <CardBody>
          <CardTitle>Add</CardTitle>
          <Row>
            <Col sm='4' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Select Search Option :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col sm='4' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Select Room No. :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={colourOptions1[0]}
                options={colourOptions1}
                isClearable={false}
              />
            </Col>
          </Row>
          <CardTitle>Add Filter</CardTitle>
          <Row>
            <Col sm='3' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Select Food Category :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col sm='3' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Menu Name :
              </Label>
              <Input type='text' placeholder='Enter Menu Name' />
            </Col>
            <Col sm='3' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Enable Food Code :
              </Label>
              <Input type='text' placeholder='Enter Food Code' />
            </Col>
            <Col sm='3' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Happy Houres :
              </Label>
              <Cleave className='form-control' placeholder='12:00:00' options={optionsTime} id='time' />
            </Col>
          </Row>
          <div className='react-dataTable mt-50'>
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
    </>
  )
}

export default POS