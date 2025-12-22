import React from 'react'
// ** Third Party Components
// import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash, Eye, EyeOff } from 'react-feather'
// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'

// ** Vars


export const data = [
    {
        id: 1,
        room_no: '504',
        room_category: 'Executive Suite Room',
        repair_require: 'no',
        cleaning_status: 'dirty',
        close_dueto_maintains: 'no',
        salary: 10000,
        room_status: 'vacant/empty',
        start_date: '08/25/2022',
        status: 'confirm'
    },
    {
        id: 2,
        room_no: '504',
        room_category: 'swiss tent',
        repair_require: 'no',
        cleaning_status: 'clean',
        close_dueto_maintains: 'yes',
        salary: 10000,
        room_status: 'occupied',
        start_date: '08/25/2022',
        status: 'reject'
    },
    {
        id: 3,
        room_no: '504',
        room_category: 'mixed',
        repair_require: 'yes',
        cleaning_status: 'clean',
        close_dueto_maintains: 'nhi',
        salary: 10000,
        room_status: 'occupied',
        start_date: '08/25/2022',
        status: 'confirm'
    },
    {
        id: 4,
        room_no: '505',
        room_category: 'deluxe',
        repair_require: 'no',
        cleaning_status: 'dirty',
        close_dueto_maintains: 'yes',
        salary: 10000,
        room_status: 'vacant/empty',
        start_date: '08/30/2022',
        status: 'pending'
    },
    {
        id: 5,
        room_no: '505',
        room_category: 'superior',
        repair_require: 'no',
        cleaning_status: 'dirty',
        close_dueto_maintains: 'yes',
        salary: 10000,
        room_status: 'vacant/empty',
        start_date: '08/30/2022',
        status: 'pending'
    },
    {
        id: 6,
        room_no: '505',
        room_category: 'superior',
        repair_require: 'yes',
        cleaning_status: 'dirty',
        close_dueto_maintains: 'yes',
        salary: 10000,
        room_status: 'vacant/empty',
        start_date: '08/30/2022',
        status: 'pending'
    }
]

export const columns = [

    {
        name: 'Room Catogry',
        sortable: true,
        minWidth: '140px',
        sortable: row => row.room_category,
        selector: row => row.room_category
    },
    {
        name: 'Room Number',
        sortable: true,
        minWidth: '150px',
        sortable: row => row.room_no,
        selector: row => row.room_no
    },
    {
        name: 'Cleaning Status',
        sortable: true,
        minWidth: '160px',
        sortable: row => row.cleaning_status,
        selector: row => {
            return (
                <Badge color={row.cleaning_status === 'clean' ? 'light-success' : 'light-danger'} pill>
                    {row.cleaning_status}
                </Badge>
            )
        }
    },
    {
        name: 'Repair Required',
        sortable: true,
        minWidth: '160px',
        sortable: row => row.repair_require,
        selector: row => {
            return (
                <Badge color={row.repair_require === 'no' ? 'light-success' : 'light-danger'} pill>
                    {row.repair_require}
                </Badge>
            )
        }
    },
    {
        name: 'Closed Due to Maintains',
        sortable: true,
        minWidth: '210px',
        sortable: row => row.close_dueto_maintains,
        selector: row => {
            return (
                <Badge color={row.close_dueto_maintains === 'no' ? 'light-success' : 'light-danger'} pill>
                    {row.close_dueto_maintains}
                </Badge>
            )
        }
    },
    {
        name: 'Room Status',
        sortable: true,
        minWidth: '140px',
        sortable: row => row.room_status,
        selector: row => {
            return (
                <Badge color={row.room_status === 'occupied' ? 'light-danger' : 'light-success'} pill>
                    {row.room_status}
                </Badge>
            )
        }
    },
    {
        name: 'Actions',
        allowOverflow: true,
        cell: (row) => {
            return (
                <div className='d-flex'>
                    <UncontrolledDropdown>
                        <DropdownToggle className='pe-1' tag='span'>
                            <MoreVertical size={15} />
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                                <FileText size={15} />
                                <span className='align-middle ms-50'>Mark As Clean</span>
                            </DropdownItem>
                            <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                                <Archive size={15} />
                                <span className='align-middle ms-50'>Repair Work Required</span>
                            </DropdownItem>
                            {row.cleaning_status === 'clean' && row.repair_require === 'no' && row.close_dueto_maintains === 'no' ? <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                                <Trash size={15} />
                                <span className='align-middle ms-50'>View Maintains Work</span>
                            </DropdownItem> : <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                                <Trash size={15} />
                                <span className='align-middle ms-50'>Close Room From Maintains Work</span>
                            </DropdownItem>}

                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        }
    }
]
