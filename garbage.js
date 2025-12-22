// // import React, { Component } from 'react'
// import { Row, Col, Label, Input, Button, Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
// import Select from 'react-select'
// import { selectThemeColors } from '@utils'
// import Flatpickr from 'react-flatpickr'
// import { useState } from 'react'
// // ** Custom Components
// import AvatarGroup from '@components/avatar-group'

// // ** Images
// // import react from '@src/assets/images/icons/react.svg'
// // import vuejs from '@src/assets/images/icons/vuejs.svg'
// // import angular from '@src/assets/images/icons/angular.svg'
// // import bootstrap from '@src/assets/images/icons/bootstrap.svg'
// // import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
// // import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
// // import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'

// // ** Icons Imports
// import { MoreVertical, Edit, Trash } from 'react-feather'
// // const avatarGroupData1 = [
// //     {
// //       title: 'Lilian',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Alberto',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Bruce',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData2 = [
// //     {
// //       title: 'Diana',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Rey',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'James',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData3 = [
// //     {
// //       title: 'Lee',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Mario',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Oswald',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData4 = [
// //     {
// //       title: 'Christie',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Barnes',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Arthur',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// const colourOptions = [
//     { value: 'ocean', label: 'Ocean' },
//     { value: 'blue', label: 'Blue' },
//     { value: 'purple', label: 'Purple' },
//     { value: 'red', label: 'Red' },
//     { value: 'orange', label: 'Orange' }
// ]
// const labelStyle = {
//     fontSize: '18px'
// }
// const Rooms = () => {
//     const [picker, setPicker] = useState(new Date())
//     return (
//         <>
//             <Row>
//                 <Col md='12' sm='12' className='mt-2 mb-2'>
//                     <h2>Room Shares</h2>
//                 </Col>
//                 <Col md='6' sm='12'>
//                     <Label style={labelStyle} className='form-label'>Adults</Label>
//                     <Select
//                         theme={selectThemeColors}
//                         className='react-select'
//                         classNamePrefix='select'
//                         defaultValue={colourOptions[0]}
//                         options={colourOptions}
//                         isClearable={false}
//                     />
//                 </Col>
//                 <Col md='6' sm='12'>
//                     <Label style={labelStyle} className='form-label' for='helperText'>
//                         Child
//                     </Label>
//                     <Select
//                         theme={selectThemeColors}
//                         className='react-select'
//                         classNamePrefix='select'
//                         defaultValue={colourOptions[0]}
//                         options={colourOptions}
//                         isClearable={false}
//                     />
//                 </Col>
//                 <Table responsive className='mt-3'>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Date</th>
//                             <th>Nights</th>
//                             <th>Types</th>
//                             <th>Charge</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>
//                                 <span className='align-middle fw-bold'>1</span>
//                             </td>
//                             <td>Peter Charles</td>
//                             <td>
//                                 <span className='align-middle fw-bold'>Jul 15</span>
//                             </td>
//                             <td>
//                                 <span className='align-middle fw-bold'>1</span>
//                             </td>
//                             <td>
//                                 <span className='align-middle fw-bold'>Adult</span>
//                             </td>
//                             <td>
//                                 <Select
//                                     theme={selectThemeColors}
//                                     className='react-select'
//                                     classNamePrefix='select'
//                                     defaultValue={colourOptions[0]}
//                                     options={colourOptions}
//                                     isClearable={false}
//                                 />
//                             </td>
//                             <td>
//                                 <UncontrolledDropdown>
//                                     <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
//                                         <MoreVertical size={15} />
//                                     </DropdownToggle>
//                                     <DropdownMenu>
//                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
//                                             <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
//                                         </DropdownItem>
//                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
//                                             <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
//                                         </DropdownItem>
//                                     </DropdownMenu>
//                                 </UncontrolledDropdown>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </Table>
//                 <Col md='12' sm='12' className='mt-2 mb-2 d-flex justify-content-between'>
//                     <h2>Preference</h2>
//                     <h2>Message (0)/ Tasks (0)</h2>
//                 </Col>
//                 <Col md='12' sm='12' className='mt-2'>
//                     <Input type='textarea' />
//                 </Col>
//                 <Col md='12' sm='12' className=' mb-2 d-flex justify-content-between'>
//                     <h5>Notes</h5>
//                     <h5>Add Notes</h5>
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


//                 <Col md='12' sm='12' className='mt-3'>
//                     <h2 className='mb-2'>Payment Details</h2>
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Room Tariff</h6>
//                         <span>0</span>
//                     </div>
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Room Tax(es)</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Total</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Amount Paid</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Balance</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                 </Col>
//                 <Col md='12' sm='12' className='mt-2 text-center'>
//                     <Button.Ripple color='primary'>Reserve</Button.Ripple>
//                 </Col>
//             </Row>
//         </>
//     )
// }

// export default Rooms
// // import React, { Component } from 'react'
// import { Row, Col, Label, Input, Button, Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
// import Select from 'react-select'
// import { selectThemeColors } from '@utils'
// import Flatpickr from 'react-flatpickr'
// import { useState } from 'react'
// // ** Custom Components
// import AvatarGroup from '@components/avatar-group'

// // ** Images
// // import react from '@src/assets/images/icons/react.svg'
// // import vuejs from '@src/assets/images/icons/vuejs.svg'
// // import angular from '@src/assets/images/icons/angular.svg'
// // import bootstrap from '@src/assets/images/icons/bootstrap.svg'
// // import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
// // import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
// // import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'

// // ** Icons Imports
// import { MoreVertical, Edit, Trash } from 'react-feather'
// // const avatarGroupData1 = [
// //     {
// //       title: 'Lilian',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Alberto',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Bruce',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData2 = [
// //     {
// //       title: 'Diana',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Rey',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'James',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData3 = [
// //     {
// //       title: 'Lee',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Mario',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Oswald',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// //   const avatarGroupData4 = [
// //     {
// //       title: 'Christie',
// //       img: avatar1,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Barnes',
// //       img: avatar2,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     },
// //     {
// //       title: 'Arthur',
// //       img: avatar3,
// //       imgHeight: 26,
// //       imgWidth: 26
// //     }
// //   ]

// const colourOptions = [
//     { value: 'ocean', label: 'Ocean' },
//     { value: 'blue', label: 'Blue' },
//     { value: 'purple', label: 'Purple' },
//     { value: 'red', label: 'Red' },
//     { value: 'orange', label: 'Orange' }
// ]
// const labelStyle = {
//     fontSize: '18px'
// }
// const Rooms = () => {
//     const [picker, setPicker] = useState(new Date())
//     return (
//         <>
//             <Row>
//                 <Col md='12' sm='12' className='mt-2 mb-2'>
//                     <h2>Room Shares</h2>
//                 </Col>
//                 <Col md='6' sm='12'>
//                     <Label style={labelStyle} className='form-label'>Adults</Label>
//                     <Select
//                         theme={selectThemeColors}
//                         className='react-select'
//                         classNamePrefix='select'
//                         defaultValue={colourOptions[0]}
//                         options={colourOptions}
//                         isClearable={false}
//                     />
//                 </Col>
//                 <Col md='6' sm='12'>
//                     <Label style={labelStyle} className='form-label' for='helperText'>
//                         Child
//                     </Label>
//                     <Select
//                         theme={selectThemeColors}
//                         className='react-select'
//                         classNamePrefix='select'
//                         defaultValue={colourOptions[0]}
//                         options={colourOptions}
//                         isClearable={false}
//                     />
//                 </Col>
//                 <Table responsive className='mt-3'>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Date</th>
//                             <th>Nights</th>
//                             <th>Types</th>
//                             <th>Charge</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>
//                                 <span className='align-middle fw-bold'>1</span>
//                             </td>
//                             <td>Peter Charles</td>
//                             <td>
//                                 <span className='align-middle fw-bold'>Jul 15</span>
//                             </td>
//                             <td>
//                                 <span className='align-middle fw-bold'>1</span>
//                             </td>
//                             <td>
//                                 <span className='align-middle fw-bold'>Adult</span>
//                             </td>
//                             <td>
//                                 <Select
//                                     theme={selectThemeColors}
//                                     className='react-select'
//                                     classNamePrefix='select'
//                                     defaultValue={colourOptions[0]}
//                                     options={colourOptions}
//                                     isClearable={false}
//                                 />
//                             </td>
//                             <td>
//                                 <UncontrolledDropdown>
//                                     <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
//                                         <MoreVertical size={15} />
//                                     </DropdownToggle>
//                                     <DropdownMenu>
//                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
//                                             <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
//                                         </DropdownItem>
//                                         <DropdownItem href='/' onClick={e => e.preventDefault()}>
//                                             <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
//                                         </DropdownItem>
//                                     </DropdownMenu>
//                                 </UncontrolledDropdown>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </Table>
//                 <Col md='12' sm='12' className='mt-2 mb-2 d-flex justify-content-between'>
//                     <h2>Preference</h2>
//                     <h2>Message (0)/ Tasks (0)</h2>
//                 </Col>
//                 <Col md='12' sm='12' className='mt-2'>
//                     <Input type='textarea' />
//                 </Col>
//                 <Col md='12' sm='12' className=' mb-2 d-flex justify-content-between'>
//                     <h5>Notes</h5>
//                     <h5>Add Notes</h5>
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


//                 <Col md='12' sm='12' className='mt-3'>
//                     <h2 className='mb-2'>Payment Details</h2>
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Room Tariff</h6>
//                         <span>0</span>
//                     </div>
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Room Tax(es)</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Total</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Amount Paid</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                     <div className='d-flex justify-content-between mb-2 px-3'>
//                         <h6>Balance</h6>
//                         <span>0</span>
//                     </div>
//                     <hr />
//                 </Col>
//                 <Col md='12' sm='12' className='mt-2 text-center'>
//                     <Button.Ripple color='primary'>Reserve</Button.Ripple>
//                 </Col>
//             </Row>
//         </>
//     )
// }

// export default Rooms
