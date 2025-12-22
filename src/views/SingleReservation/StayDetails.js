// ** React Imports
import { Fragment, useState } from 'react'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import { ArrowLeft, ArrowRight } from 'react-feather'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
// import { useForm, Controller } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'
const colourOptions = [
  { value: '-', label: '-' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' }
]
const arrivalMedium = [
  { value: '-', label: '-' },
  { value: 'Flight', label: 'Flight' },
  { value: 'Vehicle', label: 'Vehicle' },
  { value: 'Train', label: 'Train' }
]
const bookingMedium = [
  { value: '-', label: '-' },
  { value: 'Walkin', label: 'Walkin' },
  { value: 'Booking Engine', label: 'Booking Engine' },
  { value: 'Travel Agent', label: 'Travel Agent' },
  { value: 'Other Medium', label: 'Other Medium' }
]

const labelStyle = {
  fontSize: '16px'
}
const FlightComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Flight Info</Label>
        <Input type='text' placeholder='Enter Flight Info' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Flight Source</Label>
        <Input type='text' placeholder='Enter Flight Source' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Flight Destination</Label>
        <Input type='text' placeholder='Enter Flight Destination' />
      </Col>
    </Row>
  )
}
const VehicleComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Vehicle Details</Label>
        <Input type='text' placeholder='Enter Vehicle Details' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Vehicle Source</Label>
        <Input type='text' placeholder='Enter Vehicle Source' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Vehicle Destination</Label>
        <Input type='text' placeholder='Enter Vehicle Destination' />
      </Col>
    </Row>
  )
}
const TrainComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Train Details</Label>
        <Input type='text' placeholder='Enter Train Details' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Train Source</Label>
        <Input type='text' placeholder='Enter Train Source' />
      </Col>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Train Destination</Label>
        <Input type='text' placeholder='Enter Train Destination' />
      </Col>
    </Row>
  )
}
const WalkinComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Walkin Details</Label>
        <Input type='text' placeholder='Enter Walkin Details' />
      </Col>
    </Row>
  )
}
const BookingEngineComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Booking Engine Details</Label>
        <Input type='text' placeholder='Enter Booking Engine Details' />
      </Col>
    </Row>
  )
}
const TravelAgentComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Travel Agent Details</Label>
        <Input type='text' placeholder='Enter Travel Agent Details' />
      </Col>
    </Row>
  )
}
const OtherComponents = () => {
  return (
    <Row>
      <Col md='6' className='mb-1'>
        <Label style={labelStyle} className='form-label'>Other Details</Label>
        <Input type='text' placeholder='Enter Other Details' />
      </Col>
    </Row>
  )
}


const StayDetails = ({ stepper }) => {
  const [picker, setPicker] = useState(new Date())

  //   const {
  //     handleSubmit,
  //     formState: { errors }
  // } = useForm({
  //     resolver: yupResolver(SignupSchema)
  // })
  const [ArrivalMedium, setArrivalMedium] = useState('Select Arrival Medium')
  const handleOnChange = selctedOption => {
    setArrivalMedium(selctedOption.value)
    console.log(selctedOption.value)
  }
  const [BookingMedium, setBookingMedium] = useState('Select Booking Medium')
  const handleOnChange1 = selctedOption => {
    setBookingMedium(selctedOption.value)
    console.log(selctedOption.value)
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Booking Details</h5>
      </div>
      <Form >
        <Row>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Check In</Label>
            <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='dob' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Check Out</Label>
            <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='dob' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Room Category</Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Arrival Time</Label>
            <Input type='text' placeholder='Enter Arrival Time' />
          </Col>
          <Col md='12' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Arrival Medium</Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={ArrivalMedium}
              options={arrivalMedium}
              isClearable={false}
              // value = {cardValue}
              onChange={handleOnChange}
            />
          </Col>
          <Col md='12' className='mb-1'>
            {ArrivalMedium === "Flight" ? (<>
              <FlightComponents />
            </>) : (<>
              {ArrivalMedium === 'Vehicle' ? (<>
                <VehicleComponents />
              </>) : (<>
                {ArrivalMedium === 'Train' ? (<>
                  <TrainComponents />
                </>) : (<>
                </>)}
              </>)}

            </>)}
          </Col>
          <Col md='12' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Booking Medium</Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={BookingMedium}
              options={bookingMedium}
              isClearable={false}
              // value = {cardValue}
              onChange={handleOnChange1}
            />
          </Col>
          <Col md='12' className='mb-1'>
            {BookingMedium === "Walkin" ? (<>
              <WalkinComponents />
            </>) : (<>
              {BookingMedium === 'Booking Engine' ? (<>
                <BookingEngineComponents />
              </>) : (<>
                {BookingMedium === 'Travel Agent' ? (<>
                  <TravelAgentComponents />
                </>) : (<>
                  {BookingMedium === 'Other Medium' ? (<>
                    <OtherComponents />
                  </>) : (<>
                  </>)}
                </>)}
              </>)}
            </>)}
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Rate Type</Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
              // value = {cardValue}
              onChange={handleOnChange}
            />
          </Col>
          <Col md='12' className='my-2'>
            <h2>Additional Amenities Booked</h2>
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Total No. of Amenities Booked</Label>
            <Input type='text' placeholder='Amenities Count' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Types of Amenities Booked</Label>
            <Input type='text' placeholder='Amenities Type' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Other Info</Label>
            <Input type='text' placeholder='Other Info' />
          </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Duration of Stay</Label>
            <Input type='text' placeholder='Add Duration' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>No. of Guest Members</Label>
            <Input type='text' placeholder='Add Number' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label'>Age group of Guests</Label>
            <Input type='text' placeholder='Add Age' />
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default StayDetails

