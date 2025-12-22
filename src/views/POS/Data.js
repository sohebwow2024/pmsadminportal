import React from 'react'
import { MoreVertical, Edit, FileText, Archive, Trash, Eye, EyeOff } from 'react-feather'
import { AiOutlinePlusCircle } from 'react-icons/ai'
// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Card, CardHeader, CardTitle, CardBody, Form, Label, Input } from 'reactstrap'

export const data = [
    { id: 1, food: 'checken biryani', code: '1001', name: 'jins', time: '03 : 50 PM', amount: 500 },
    { id: 2, food: 'checken biryani', code: '1001', name: 'jins', time: '03 : 50 PM', amount: 500 },
    { id: 3, food: 'checken biryani', code: '1001', name: 'jins', time: '03 : 50 PM', amount: 500 },
    { id: 4, food: 'checken biryani', code: '1001', name: 'jins', time: '03 : 50 PM', amount: 500 },
    { id: 5, food: 'checken biryani', code: '1001', name: 'jins', time: '03 : 50 PM', amount: 500 }
]
// ** Get initial Data
// axios.get('/api/datatables/initiPaymentData').then(response => {
//     data = response.data
// })

// ** Table Common Column
export const columns = [
    {
        name: 'Food Category',
        minWidth: '200px',
        sortable: row => row.food,
        selector: row => row.food
    },
    {
        name: 'Food Code: Name',
        sortable: true,
        minWidth: '200px',
        sortable: row => row.code,
        selector: row => `${row.code} : ${row.name}`
    },
    {
        name: 'Food Rate',
        sortable: true,
        minWidth: '200px',
        sortable: row => row.amount,
        selector: row => row.amount
    },
    {
        name: 'Happy Houre Rate',
        sortable: true,
        minWidth: '200px',
        selector: row => row.time
    },
    {
        name: 'Order',
        sortable: true,
        minWidth: '200px',
        cell: row => {
            return (
                <AiOutlinePlusCircle key={row.id} size={20} style={{ cursor: 'pointer', color: '#28c76f' }} />
            )
        }
    }
]

