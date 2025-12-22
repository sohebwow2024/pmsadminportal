// import { React, useState } from 'react'
// import { Button, Card, CardTitle, CardBody, CardText, CardSubtitle, CardLink, Input, Row, Col, Table, Modal, ModalHeader, ModalBody, Label, InputGroupText, InputGroup } from 'reactstrap'
// import Select from 'react-select'
// import { selectThemeColors } from '@utils'
// import Flatpickr from 'react-flatpickr'
// import { MdDateRange } from "react-icons/md"
// import DataTable from 'react-data-table-component'
// import axios from 'axios'
// import { Edit, Trash } from 'react-feather'
// // import { data, roomAvailabilityTable } from '../data'

// const venderOptions = [
//     { value: '-', label: '-' },
//     { value: 'Vendor 1', label: 'Vendor 1' },
//     { value: 'Vendor 2', label: 'Vendor 2' },
//     { value: 'Vendor 3', label: 'Vendor 3' }
// ]
// const genderOptions = [
//     { value: '-', label: '-' },
//     { value: 'Male', label: 'Male' },
//     { value: 'Female', label: 'Female' }
// ]
// const labelStyle = {
//     fontSize: '16px'
// }
// // const data = []
// let data
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })
// const VendorTable = () => {
//     const [show, setShow] = useState(false)
//     const [showEdit, setShowEdit] = useState(false)
//     const [picker, setPicker] = useState(new Date())
//     const roomAvailabilityTable = [
//         {
//             name: 'Emp ID',
//             selector: row => row.id,
//             style: {
//                 color: 'black'
//             }
//         },
//         {
//             name: "Emp Name",
//             selector: row => row.name
//         },
//         {
//             name: 'Mobile Number',
//             selector: row => row.email
//         },
//         {
//             name: 'Email Id',
//             selector: row => row.email
//         },
//         {
//             name: 'Action',
//             selector: row => row.age,
//             cell: row => (
//                 <>
//                     <Edit className='me-50 pe-auto' onClick={() => setShowEdit(true)} size={15} />
//                     <Trash className='me-50' name={row.age} size={15} />
//                 </>
//             )

//         }
//     ]
//     return (
//         <>
//             <Row>
//                 <Col md='12' className='mb-1'>
//                     <Card>
//                         <CardBody>
//                             <CardTitle tag='h1' className='fw-bold fs-2'>Vendor Master/Employee Master</CardTitle>
//                             <Button color='primary' onClick={() => setShow(true)}>Add New Vendor</Button>
//                             <CardText>
//                                 {/* <Table responsive className='mt-2'>
//                                     <thead>
//                                         <tr>
//                                             <th scope='col' className='text-nowrap'>
//                                                 Emp ID
//                                             </th>
//                                             <th scope='col' className='text-nowrap'>
//                                                 Emp Name
//                                             </th>
//                                             <th scope='col' className='text-nowrap'>
//                                                 Mobile Number
//                                             </th>
//                                             <th scope='col' className='text-nowrap'>
//                                                 Email Id
//                                             </th>
//                                             <th scope='col' className='text-nowrap'>
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td className='text-nowrap'>40</td>
//                                             <td className='text-nowrap'>Mr Nitin</td>
//                                             <td className='text-nowrap'>8967437896</td>
//                                             <td className='text-nowrap'>nitin@gmail.com</td>
//                                             <td className='text-nowrap'>
//                                                 <Button color='primary me-1' onClick={() => setShowEdit(true)}>Edit</Button>
//                                                 <Button color='danger'>Delete</Button>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td className='text-nowrap'>41</td>
//                                             <td className='text-nowrap'>Mr Nitin</td>
//                                             <td className='text-nowrap'>8967437896</td>
//                                             <td className='text-nowrap'>nitin@gmail.com</td>
//                                             <td className='text-nowrap'>
//                                                 <Button color='primary me-1' onClick={() => setShowEdit(true)}>Edit</Button>
//                                                 <Button color='danger'>Delete</Button>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td className='text-nowrap'>42</td>
//                                             <td className='text-nowrap'>Mr Nitin</td>
//                                             <td className='text-nowrap'>8967437896</td>
//                                             <td className='text-nowrap'>nitin@gmail.com</td>
//                                             <td className='text-nowrap'>
//                                                 <Button color='primary me-1' onClick={() => setShowEdit(true)}>Edit</Button>
//                                                 <Button color='danger'>Delete</Button>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </Table> */}

//                                 <DataTable
//                                     noHeader
//                                     data={data}
//                                     columns={roomAvailabilityTable}
//                                     className='react-dataTable'
//                                 // customStyles={roomAvailabilityStyles}
//                                 />
//                             </CardText>
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </Row>
//             <Modal
//                 isOpen={show}
//                 toggle={() => setShow(!show)}
//                 className='modal-dialog-centered modal-lg'
//             // onClosed={() => setCardType('')}
//             >
//                 <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
//                     <h1 className=' mb-1'>Vendor Details</h1>
//                 </ModalHeader>
//                 <ModalBody className='px-sm-2 mx-50 pb-5'>
//                     <Row>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Title</Label>
//                             <Select
//                                 theme={selectThemeColors}
//                                 className='react-select w-100'
//                                 classNamePrefix='select'
//                                 defaultValue={venderOptions}
//                                 options={venderOptions}
//                                 isClearable={false}
//                             />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>First Name</Label>
//                             <Input type='text' placeholder='Enter First Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Middle Name</Label>
//                             <Input type='text' placeholder='Enter Middle Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Last Name</Label>
//                             <Input type='text' placeholder='Enter Last Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Preferred Name</Label>
//                             <Input type='text' placeholder='Enter Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Gender</Label>
//                             <Select
//                                 theme={selectThemeColors}
//                                 className='react-select w-100'
//                                 classNamePrefix='select'
//                                 defaultValue={genderOptions[0]}
//                                 options={genderOptions}
//                                 isClearable={false}
//                             />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Adhaar Number</Label>
//                             <Input type='text' placeholder='Enter Adhaar Num' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Date of Birth</Label>
//                             <InputGroup className='input-group-merge'>
//                                 <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
//                                 <InputGroupText>
//                                     <MdDateRange size={15} />
//                                 </InputGroupText>
//                             </InputGroup>
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Age</Label>
//                             <Input type='text' placeholder='Enter Age' />
//                         </Col>
//                         <h2>Address Details</h2>
//                         <Col md='12' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Address</Label>
//                             <Input type='textarea' placeholder='Enter Address' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Mobile Number</Label>
//                             <Input type='text' placeholder='Enter Mobile Num' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Email ID</Label>
//                             <Input type='text' placeholder='Enter Email' />
//                         </Col>
//                     </Row>
//                     <Row tag='form' className='gy-1 gx-2 mt-75' >
//                         <Col className='text-center mt-1' xs={12}>
//                             <Button type='submit' className='me-1' color='primary'>
//                                 Submit
//                             </Button>
//                             <Button
//                                 color='secondary'
//                                 outline
//                                 onClick={() => {
//                                     setShow(!show)
//                                     // reset()
//                                 }}
//                             >
//                                 Cancel
//                             </Button>
//                         </Col>
//                     </Row>
//                 </ModalBody>
//             </Modal>
//             <Modal
//                 isOpen={showEdit}
//                 toggle={() => setShowEdit(!showEdit)}
//                 className='modal-dialog-centered modal-lg'
//             // onClosed={() => setCardType('')}
//             >
//                 <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
//                     <h1 className=' mb-1'>Edit Vendor Details</h1>
//                 </ModalHeader>
//                 <ModalBody className='px-sm-2 mx-50 pb-5'>
//                     <Row>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Title</Label>
//                             <Select
//                                 theme={selectThemeColors}
//                                 className='react-select w-100'
//                                 classNamePrefix='select'
//                                 defaultValue={venderOptions}
//                                 options={venderOptions}
//                                 isClearable={false}
//                             />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>First Name</Label>
//                             <Input type='text' placeholder='Enter First Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Middle Name</Label>
//                             <Input type='text' placeholder='Enter Middle Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Last Name</Label>
//                             <Input type='text' placeholder='Enter Last Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Preferred Name</Label>
//                             <Input type='text' placeholder='Enter Name' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Gender</Label>
//                             <Select
//                                 theme={selectThemeColors}
//                                 className='react-select w-100'
//                                 classNamePrefix='select'
//                                 defaultValue={genderOptions[0]}
//                                 options={genderOptions}
//                                 isClearable={false}
//                             />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Adhaar Number</Label>
//                             <Input type='text' placeholder='Enter Adhaar Num' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Date of Birth</Label>
//                             <InputGroup className='input-group-merge'>
//                                 <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
//                                 <InputGroupText>
//                                     <MdDateRange size={15} />
//                                 </InputGroupText>
//                             </InputGroup>
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Age</Label>
//                             <Input type='text' placeholder='Enter Age' />
//                         </Col>
//                         <h2>Address Details</h2>
//                         <Col md='12' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Address</Label>
//                             <Input type='textarea' placeholder='Enter Address' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Mobile Number</Label>
//                             <Input type='text' placeholder='Enter Mobile Num' />
//                         </Col>
//                         <Col md='6' className='mb-2'>
//                             <Label style={labelStyle} className='form-label'>Email ID</Label>
//                             <Input type='text' placeholder='Enter Email' />
//                         </Col>
//                     </Row>
//                     <Row tag='form' className='gy-1 gx-2 mt-75' >
//                         <Col className='text-center mt-1' xs={12}>
//                             <Button type='submit' className='me-1' color='primary'>
//                                 Submit
//                             </Button>
//                             <Button
//                                 color='secondary'
//                                 outline
//                                 onClick={() => {
//                                     setShowEdit(!showEdit)
//                                     // reset()
//                                 }}
//                             >
//                                 Cancel
//                             </Button>
//                         </Col>
//                     </Row>
//                 </ModalBody>
//             </Modal>

//         </>


//     )
// }

// export default VendorTable