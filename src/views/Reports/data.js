import axios from 'axios'

export let data

axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
})

export const debtorsLedgerTable = [
  {
    name: 'ID',
    selector: row => row.id
    // width: '50px'
  },
  {
    name: "Debtor's Name",
    selector: row => row.name
  },
  {
    name: 'Details',
    selector: row => row.email
  },
  {
    name: '% Commission',
    selector: row => row.post
  },
  {
    name: 'Total No. Of Booking',
    selector: row => row.age
  },
  {
    name: 'Online Paid Bookings',
    selector: row => row.salary
  },
  {
    name: 'Pay At Hotel',
    selector: row => row.salary
  },
  {
    name: 'Total Business',
    selector: row => row.salary
  },
  {
    name: 'Commission Amount',
    selector: row => row.salary
  },
  {
    name: 'Amount to be collected from OTA',
    selector: row => row.salary
  },
  {
    name: 'Amount to be paid to the OTA',
    selector: row => row.salary
  }
]

export const roomAvailabilityTable = [
  {
    name: 'Room Category',
    selector: row => row.id
  },
  {
    name: "Fri 1/7/2022",
    selector: row => row.name
  },
  {
    name: 'Sat 2/7/2022',
    selector: row => row.email
  },
  {
    name: 'Sun 3/7/2022',
    selector: row => row.post
  },
  {
    name: 'Mon 4/7/2022',
    selector: row => row.age
  },
  {
    name: 'Tue 5/7/2022',
    selector: row => row.salary
  },
  {
    name: 'Wed 6/7/2022',
    selector: row => row.salary
  },
  {
    name: 'Thu 7/7/2022',
    selector: row => row.salary
  }
]
