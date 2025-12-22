// // ** React Imports
// import { Fragment, useState } from 'react'

// // ** Utils
// import { selectThemeColors } from '@utils'

// ** Third Party Components
import { ArrowLeft, ArrowRight } from 'react-feather'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup, InputGroupText, Table } from 'reactstrap'
// const colourOptions = [
//     { value: '-', label: '-' },
//     { value: 'ocean', label: 'Ocean' },
//     { value: 'blue', label: 'Blue' },
//     { value: 'purple', label: 'Purple' },
//     { value: 'red', label: 'Red' },
//     { value: 'orange', label: 'Orange' }
// ]

const Preferences = () => {
    // const [picker, setPicker] = useState(new Date())

    return (
        <>
            <h1>Page under development!</h1>
        </>
    )

    //   return (
    //     <Fragment>
    //       <div className='content-header '>
    //         <h5 className='mb-0'>Preferences</h5>
    //       </div>
    //       <Form >
    //         <Row>
    //                 <Col md='12' sm='12' className='mt-2'>
    //                     <Input type='textarea' />
    //                 </Col>
    //                 <Col md='12' sm='12' className=' mb-2 d-flex justify-content-between'>
    //                     <h5>Notes</h5>
    //                     <a href='#/'>Add Notes</a>
    //                 </Col>
    //                 <Col md='12' sm='12' className='mt-2 mb-2'>
    //                     <h2>Split Reservation</h2>
    //                 </Col>

    //                 <Table responsive>
    //                     <thead>
    //                         <tr>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Room Type
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Rate Type
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 System Rate
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Agreed Rate
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Date
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Nights
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Tax
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Price
    //                             </th>
    //                             <th scope='col' className='text-nowrap'>
    //                                 Including Tax
    //                             </th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         <tr>
    //                             <td className='text-nowrap'>
    //                                 <Select
    //                                     theme={selectThemeColors}
    //                                     className='react-select'
    //                                     classNamePrefix='select'
    //                                     defaultValue={colourOptions[0]}
    //                                     options={colourOptions}
    //                                     isClearable={false}
    //                                 /></td>
    //                             <td className='text-nowrap'>
    //                                 <Select
    //                                     theme={selectThemeColors}
    //                                     className='react-select'
    //                                     classNamePrefix='select'
    //                                     defaultValue={colourOptions[0]}
    //                                     options={colourOptions}
    //                                     isClearable={false}
    //                                 /></td>
    //                             <td className='text-nowrap'><Input type='text' /></td>
    //                             <td className='text-nowrap'><Input type='text' /></td>
    //                             <td className='text-nowrap px-0'>
    //                                 <Flatpickr className='form-control mb-2 w-100' value={picker} onChange={date => setPicker(date)} id='default-picker' />
    //                                 <Flatpickr className='form-control w-100' value={picker} onChange={date => setPicker(date)} id='default-picker' /></td>
    //                             <td className='text-nowrap'>
    //                             <span className='align-middle fw-bold'>1</span>
    //                             </td>
    //                             <td className='text-nowrap'>
    //                                 <Input type='text' />
    //                             </td>
    //                             <td className='text-nowrap'>
    //                                 <Input type='text' />
    //                             </td>
    //                             <td className='text-nowrap'>
    //                                  <div className='form-check form-check-inline ms-2'>
    //                                     <Input type='checkbox' id='basic-cb-unchecked' />
    //                                 </div></td>
    //                         </tr>
    //                     </tbody>
    //                 </Table>

    //         </Row>
    //         <div className='d-flex justify-content-between mt-2'>
    //           <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
    //             <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
    //             <span className='align-middle d-sm-inline-block d-none'>Previous</span>
    //           </Button>
    //           <Button color='secondary' className='btn-prev' outline disabled>
    //             <span className='align-middle d-sm-inline-block d-none'>Next</span>
    //             <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
    //           </Button>
    //         </div>
    //       </Form>
    //     </Fragment>
    //   )
}

export default Preferences

