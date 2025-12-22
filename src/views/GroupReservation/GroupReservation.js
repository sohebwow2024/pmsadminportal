import React, { Component } from 'react'
import { Row, Col, Label, Input } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
const labelStyle = {
  fontSize: '18px'
}
const colourOptions = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' }
]
const GroupReservation = () => {
  return (
    <>
      <h2>GroupReservation</h2>
      <Row className='pb-3'>
        <Col className='mb-1 d-flex align-middle' md='4' sm='12'>
          <Label style={labelStyle} className='form-label '>Room Category</Label>
          <Select
            theme={selectThemeColors}
            className='react-select ms-2'
            classNamePrefix='select'
            defaultValue={colourOptions[0]}
            options={colourOptions}
            isClearable={false}
          />
        </Col>
        <Col className='mb-1 d-flex' md='4' sm='12'>
          <Label style={labelStyle} className='form-label'>Available Room:-</Label>
          <p className='ms-2'>2</p>
        </Col>
        <Col className='mb-1 d-flex' md='4' sm='12'>
          <Label style={labelStyle} className='form-label'>Send Greetings Mail</Label>
          <div className='form-check form-check-inline ms-2'>
            <Input type='checkbox' id='basic-cb-unchecked' />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md='6' sm='12'></Col>
        <Col md='6' sm='12'></Col>
      </Row>
    </>
  )
}

export default GroupReservation
