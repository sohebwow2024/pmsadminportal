// ** React Imports
import { Fragment, useState } from 'react'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import { ArrowLeft, ArrowRight, MoreVertical, Edit, Trash } from 'react-feather'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup, InputGroupText, Table,  UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
const colourOptions = [
  { value: '-', label: '-' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' }
]
const labelStyle = {
  fontSize: '16px'
}
const Roomshares = ({ stepper }) => {
  const [picker, setPicker] = useState(new Date())


  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Room shares</h5>
      </div>
      <Form >
        <Row>
          <Col md='6' className='mb-1'>
            <Label style={labelStyle} className='form-label w-50'>Adults</Label>
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
            <Label style={labelStyle} className='form-label w-50'>Child</Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Table responsive>
                    <thead>
                        <tr>
                            <th scope='col' className='text-nowrap'>
                                ID
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Name
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Date
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Nights
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Types
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Charge
                            </th>
                            <th scope='col' className='text-nowrap'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-nowrap'>
                            <span className='align-middle fw-bold'>1</span></td>
                            <td className='text-nowrap'>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={colourOptions[0]}
                                    options={colourOptions}
                                    isClearable={false}
                                /></td>
                            <td className='text-nowrap px-0'>
                                <Flatpickr className='form-control mb-2 w-100' value={picker} onChange={date => setPicker(date)} id='default-picker' />
                                <Flatpickr className='form-control w-100' value={picker} onChange={date => setPicker(date)} id='default-picker' /></td>
                            <td className='text-nowrap'>
                            <span className='align-middle fw-bold'>1</span>
                            </td>
                            <td className='text-nowrap'>
                            <span className='align-middle fw-bold'>Adult</span>
                            </td>
                            <td className='text-nowrap'>
                            <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={colourOptions[0]}
                                    options={colourOptions}
                                    isClearable={false}
                                />
                            </td>
                            <td className='text-nowrap'>
                            <UncontrolledDropdown>
                                     <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                                         <MoreVertical size={15} />
                                     </DropdownToggle>
                                     <DropdownMenu>
                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                             <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                                         </DropdownItem>
                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                             <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                                         </DropdownItem>
                                     </DropdownMenu>
                                 </UncontrolledDropdown>
                                 </td>
                        </tr>
                    </tbody>
                </Table>
          
        </Row>
        <div className='d-flex justify-content-between mt-2'>
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

export default Roomshares

