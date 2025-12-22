// // ** Custom Components
// import Avatar from '@components/avatar'
// import React from 'react'
// // ** Third Party Components
// // import axios from 'axios'
// import { MoreVertical, Edit, FileText, Archive, Trash, Eye, EyeOff } from 'react-feather'

// // ** Reactstrap Imports
// import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
// import NoShowReservation from './pages/NoShowReservation'
// import PaymentDetail from './pages/PaymentDetail'

// // ** Vars
// const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']


// export const data = [
//     {
//         id: 1,
//         full_name: 'alam khan',
//         email: 'khanalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'check out',
//         paid_amount: 2000,
//         refund_amount: 500,
//         total_paid_amount: 2500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     },
//     {
//         id: 2,
//         full_name: 'alam khan',
//         email: 'mohdalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'check in',
//         paid_amount: 2000,
//         refund_amount: 500,
//         total_paid_amount: 2500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     },
//     {
//         id: 3,
//         full_name: 'alam khan',
//         email: 'mohdalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'cancelled',
//         paid_amount: 2000,
//         refund_amount: 500,
//         total_paid_amount: 2500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     },
//     {
//         id: 4,
//         full_name: 'alam khan',
//         email: 'mohdalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'group booking',
//         paid_amount: 2000,
//         refund_amount: 500,
//         total_paid_amount: 2500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     },
//     {
//         id: 5,
//         full_name: 'bhai',
//         email: 'mohdalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'reserved',
//         paid_amount: 2000,
//         refund_amount: 500,
//         total_paid_amount: 2500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     },
//     {
//         id: 6,
//         full_name: 'bhai',
//         email: 'mohdalam165@gmail.com',
//         post: 'web developer',
//         age: '25',
//         status: 'reserved',
//         paid_amount: 3000,
//         refund_amount: 500,
//         total_paid_amount: 3500,
//         mode: 'online',
//         code: 'pay12456',
//         date: '05/02/2022',
//         time: '11:13 am',
//         registration: 'HVP010638',
//         guest: 'seleman',
//         room_type: 'deluxe',
//         folip: 1,
//         registration_type: 'confirm',
//         arrival_date: '09/22/2022',
//         departure_date: '09/23/2022',
//         deposite_amount: 500,
//         reason: ''
//     }
// ]
// export const ContactlessData = [
//     {
//         code: 'HVPO10638',
//         full_name: 'alam khan',
//         email: 'khanalam165@gmail.com',
//         is_request: 'no',
//         rate_plan: 'Room Only',
//         mobile_number: 7276765423,
//         room_type: 'Deluxe',
//         start_date: '08/25/2022',
//         status: 'confirm',
//         room: '205'
//     },
//     {
//         code: 'HVPO10639',
//         full_name: 'alam khan',
//         email: 'mohdalam165@gmail.com',
//         is_request: 'yes',
//         rate_plan: 'Room Only',
//         mobile_number: 8149180058,
//         room_type: 'Deluxe',
//         start_date: '08/25/2022',
//         status: 'reject',
//         room: '206'
//     },
//     {
//         code: 'HVPO10640',
//         full_name: 'alam khan',
//         email: 'mohdalam165@gmail.com',
//         is_request: 'no',
//         rate_plan: 'Room Only',
//         mobile_number: 7276765423,
//         room_type: 'Standered',
//         start_date: '08/25/2022',
//         status: 'confirm',
//         room: '207'
//     },
//     {
//         code: 'HVPO10641',
//         full_name: 'bhai',
//         email: 'mohdalam165@gmail.com',
//         is_request: 'yes',
//         rate_plan: 'Breakfast Included',
//         mobile_number: 8149180058,
//         room_type: 'Executive',
//         start_date: '08/30/2022',
//         status: 'pending',
//         room: '208'
//     }
// ]
// export const PaymentData = [
//     {
//         mode: '',
//         code: '',
//         description: 'Paid Amount',
//         amount: 10000,
//         date: '',
//         time: ''
//     },
//     {
//         mode: '',
//         code: '',
//         description: 'Refund Amount',
//         amount: 10000,
//         date: '',
//         time: ''
//     },
//     {
//         mode: '',
//         code: '',
//         description: 'Total Paid Amount',
//         amount: 10000,
//         date: '',
//         time: ''
//     }
// ]

// // ** Get initial Data
// // axios.get('/api/datatables/initiPaymentData').then(response => {
// //     data = response.data
// // })

// // ** Table Common Column
// export const columns = [
//     {
//         name: 'Booking Thruogh',
//         minWidth: '135px',
//         sortable: row => row.full_name,
//         cell: row => (
//             <div className='d-flex align-items-center'>
//                 {row.avatar === '' ? (
//                     <Avatar color={`light-${states[row.status]}`} content={row.full_name} initials />
//                 ) : (
//                     <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />
//                 )}
//             </div>
//         )
//     },
//     {
//         name: 'Booking ID',
//         sortable: true,
//         minWidth: '120px',
//         selector: row => row.id
//     },
//     {
//         name: 'Booking Date',
//         sortable: true,
//         minWidth: '140px',
//         selector: row => row.start_date
//     },
//     {
//         name: 'Guest Name',
//         sortable: true,
//         minWidth: '140px',
//         selector: row => row.full_name
//     },
//     {
//         name: 'Cust. Details',
//         sortable: true,
//         minWidth: '150px',
//         cell: row => (
//             <div className='d-flex align-items-center'>
//                 <Button className='me-1' color='success' type='submit' onClick={(e) => {
//                     e.preventDefault()
//                 }} key={row.id} size='sm'>
//                     View Details
//                 </Button>
//             </div>
//         )
//     },

//     {
//         name: 'Room',
//         sortable: true,
//         minWidth: '100px',
//         selector: row => row.salary
//     },
//     {
//         name: 'Check-In',
//         sortable: true,
//         minWidth: '130px',
//         selector: row => row.age
//     },
//     {
//         name: 'Check-Out',
//         sortable: true,
//         minWidth: '130px',
//         selector: row => row.age
//     },
//     {
//         name: 'Price',
//         sortable: true,
//         minWidth: '130px',
//         selector: row => row.age
//     },
//     {
//         name: 'Payment Status',
//         minWidth: '150px',
//         sortable: row => row.status.title,
//         cell: row => (
//             <div className='d-flex align-items-center'>
//                 <PaymentDetail id={row.id} paidAmount={row.paid_amount} refundAmount={row.refund_amount} totalAmount={row.total_paid_amount} mode={row.mode} code={row.code} date={row.date} time={row.time} />
//             </div>
//         )
//     },
//     {
//         name: 'Booking Status',
//         sortable: true,
//         minWidth: '150px',
//         cell: row => (
//             <div>
//                 {row.status === 'confirm' || row.status === 'check in' || row.status === 'group booking' ? <Badge color="light-success">{row.status}</Badge> : row.status === 'pending' || row.status === 'check out' ? <Badge color="light-danger" >{row.status}</Badge> : row.status === 'cancelled' ? <Badge color="light-danger" >{row.status}</Badge> : <Badge color="light-warning" >{row.status}</Badge>}
//             </div>
//         )
//     },
//     {
//         name: 'Actions',
//         allowOverflow: true,
//         cell: row => {
//             return (
//                 <div className='d-flex justify-content-between'>
//                     <p className='m-0'><Edit style={{ cursor: 'pointer' }} size={20} /></p>
//                     <NoShowReservation
//                         id={row.id}
//                         registration={row.registration}
//                         guest={row.guest}
//                         roomType={row.room_type}
//                         totalAmount={row.total_paid_amount}
//                         deposit={row.deposite_amount}
//                         folip={row.folip}
//                         registrationType={row.registration_type}
//                         arrivalDate={row.arrival_date}
//                         departureDate={row.departure_date}
//                     />
//                 </div>
//             )
//         }
//     }
// ]
// // registration: 'HVP010638',
// // guest: 'seleman',
// // room_type:'deluxe',
// // folip:1,
// // registration_type:'confirm',
// // arrival_date: '09/22/2022',
// // departure_date: '09/23/2022',
// // reason:''
// export const PaymentColumn = [
//     {
//         name: 'Paymode',
//         minWidth: '120px',
//         sortable: row => row.mode,
//         selector: row => row.mode
//     },
//     {
//         name: 'Code',
//         sortable: true,
//         minWidth: '100px',
//         selector: row => row.code
//     },
//     {
//         name: 'Description',
//         sortable: true,
//         minWidth: '165px',
//         selector: row => row.description
//     },
//     {
//         name: 'Amount',
//         sortable: true,
//         minWidth: '140px',
//         selector: row => row.amount
//     },
//     {
//         name: 'Date',
//         sortable: true,
//         minWidth: '130px',
//         selector: row => row.date
//     },

//     {
//         name: 'Time',
//         sortable: true,
//         minWidth: '100px',
//         selector: row => row.time
//     }
// ]
// export const ContactlessColumn = [
//     {
//         name: 'Booking Code',
//         minWidth: '140px',
//         sortable: row => row.code,
//         selector: row => row.code
//     },
//     {
//         name: 'Customer Name',
//         sortable: true,
//         minWidth: '160px',
//         sortable: row => row.full_name,
//         selector: row => row.full_name
//     },
//     {
//         name: 'Mobile Number',
//         sortable: true,
//         minWidth: '160px',
//         sortable: row => row.mobile_number,
//         selector: row => row.mobile_number
//     },
//     {
//         name: 'Email',
//         sortable: true,
//         minWidth: '200px',
//         sortable: row => row.email,
//         selector: row => row.email
//     },
//     {
//         name: 'Room Number',
//         sortable: true,
//         minWidth: '150px',
//         sortable: row => row.room,
//         selector: row => row.room
//     },

//     {
//         name: 'isRequest',
//         sortable: true,
//         minWidth: '100px',
//         sortable: row => row.is_request,
//         selector: row => row.is_request
//     },
//     {
//         name: 'Room Type',
//         sortable: true,
//         minWidth: '130px',
//         sortable: row => row.room_type,
//         selector: row => row.room_type
//     },
//     {
//         name: 'Rate Plan',
//         sortable: true,
//         minWidth: '200px',
//         selector: row => row.rate_plan
//     }
// ]

