import Select from 'react-select'
import { useState } from 'react'
import Flatpickr from 'react-flatpickr'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import { Row, Col, Label, Input, Button, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'
// import Rooms from './SingleReservation/Rooms'
import * as yup from 'yup'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import GroupReservation from './GroupReservation/GroupReservation'

const colourOptions = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' }
]

const labelStyle = {
  fontSize: '18px'
}

const SecondPage = () => {
  const [data] = useState(null)
  const SignupSchema = yup.object().shape({
    email: yup.string().email().required(),
    lastName: yup.string().min(3).required(),
    firstName: yup.string().min(3).required(),
    password: yup.string().min(6).required()
  })
  const {
    control,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema) })
  const [picker, setPicker] = useState(new Date())
  return (
    <>
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
        <Col md='6' sm='12'>
          <Row>
            <Col className='d-flex align-middle' md='12' sm='12'>
              <Label style={labelStyle} className='form-label w-50' for='helperText'>
                Guest Lookup
              </Label>
              <Input type='text' placeholder='Enter Cust Mobile or Name' />
            </Col>
          </Row>
          <Row className='pt-3'>
            <Col md='6' sm='12'>
              <Label style={labelStyle} className='form-label'>Title</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col md='6' sm='12'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                First Name<span className='text-danger'>*</span>
              </Label>
              {/* <Input type='text'  placeholder='First Name' /> */}

              <Controller
                id='firstName'
                name='firstName'
                defaultValue=''
                control={control}
                render={({ field }) => <Input {...field} placeholder='Name' invalid={errors.firstName && true} />}
              />
              {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
            </Col>

            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                Last Name<span className='text-danger'>*</span>
              </Label>
              {/* <Input type='text'  placeholder='Last Name' /> */}
              <Controller
                id='lastName'
                name='lastName'
                defaultValue=''
                control={control}
                render={({ field }) => <Input {...field} placeholder='Last Name' invalid={errors.lastName && true} />}
              />
              {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
            </Col>

            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label'>Nationality<span className='text-danger'>*</span></Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>


            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label'>Gender<span className='text-danger'>*</span></Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                DOB
              </Label>
              <Flatpickr className='form-control w-75' value={picker} onChange={date => setPicker(date)} id='dob' />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                Email-Id<span className='text-danger'>*</span>
              </Label>
              {/* <Input type='text'  placeholder='Email' /> */}

              <Controller
                id='email'
                name='email'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <Input {...field} type='email' placeholder='Email' invalid={errors.email && true} />
                )}
              />
              {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                Mobile<span className='text-danger'>*</span>
              </Label>
              {/* <Input type='text'  placeholder='Mobile' /> */}
              <InputGroup className='input-group-merge'>
                <InputGroupText
                  className={classnames({
                    'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
                  })}
                >
                </InputGroupText>
                <Controller
                  id='phone-number'
                  name='phoneNumber'
                  control={control}
                  placeholder='1 234 567 8900'
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      className={classnames('form-control', {
                        'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
                      })}
                      options={{ phone: true, phoneRegionCode: 'US' }}
                    />
                  )}
                />
              </InputGroup>
            </Col>
            <Col md='12' sm='12' className='mt-2'>
              <h2>Address And Contact Details</h2>
            </Col>
            <Col md='12' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                Address
              </Label>
              <Input type='textarea' placeholder='Address Line' />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label'>Country</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label'>State</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label'>City</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </Col>
            <Col md='6' sm='12' className='mt-2'>
              <Label style={labelStyle} className='form-label' for='helperText'>
                Pincode
              </Label>
              <Input type='text' placeholder='Pincode' />
            </Col>
            <Col md='12' sm='12' className='mt-2 text-center'>
              <Button.Ripple color='primary'>Save & Add More</Button.Ripple>
            </Col>
          </Row>
        </Col>
        <Col md='6' sm='12'>
          <h1>Stay Details</h1>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Check In
            </Label>
            <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='default-picker' />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Check Out
            </Label>
            <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='default-picker' />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Duration
            </Label>
            <Input type='text' />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Purpose
            </Label>
            <Input type='text' placeholder='Enter Purpose' />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50'>Source</Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50'>Booking Through<span className='text-danger'>*</span></Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex justify-content-between'>
            <h2>Arrival</h2>
            <h2>Departure</h2>
          </Col>
          <Col md='12' sm='12' className='mt-2'>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Arrival Flight
            </Label>
            <Input type='text' placeholder='Enter Flight Name' />
          </Col>
          <Col md='12' sm='12' className='mt-2 d-flex'>
            <Label style={labelStyle} className='form-label w-50' for='helperText'>
              Arrival Time
            </Label>
            <Input type='text' className='w-50' />
            <Select
              theme={selectThemeColors}
              className='react-select w-50'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col md='12' sm='12' className='mt-2 '>
            <h2>Credit Card</h2>
            <div className='d-flex'>
              <Input type='text' placeholder='Date Of Birth' className='w-50 me-2' />
              <Select
                theme={selectThemeColors}
                className='react-select w-50'
                classNamePrefix='select'
                defaultValue={colourOptions[0]}
                options={colourOptions}
                isClearable={false}
              />
            </div>
            <div className='d-flex mt-2'>
              <div className='d-flex'>
                <Label style={labelStyle} className='form-label w-50' for='helperText'>
                  Expiry
                </Label>
                <Input type='text' placeholder='Month' className='w-50 me-2' />
                <Input type='text' placeholder='Year' className='w-50 me-2' />
              </div>
              <div className='d-flex'>
                <Label style={labelStyle} className='form-label w-50' for='helperText'>
                  CVV
                </Label>
                <Input type='text' placeholder='CVV' className='w-50 me-2' />
              </div>
            </div>
          </Col>
          <Col md='12' sm='12' className='mt-2 '>
            <h2>Deposit Details</h2>
            <div className='d-flex ju mt-2'>
              <div>
                <Label className='form-label' for='helperText'>
                  Received Date
                </Label>
                <Flatpickr className='form-control w-75' value={picker} onChange={date => setPicker(date)} id='default-picker' />
              </div>
              <div>
                <Label className='form-label' for='helperText'>
                  Received Mode
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={colourOptions[0]}
                  options={colourOptions}
                  isClearable={false}
                />
              </div>
              <div>
                <Label className='form-label' for='helperText'>
                  Advanced Received
                </Label>
                <Input type='text' className='me-2 w-75' />
              </div>
            </div>
          </Col>
        </Col>
      </Row>
      {/* <Rooms/> */}

      <hr />
      <GroupReservation />
    </>
  )
}

export default SecondPage
