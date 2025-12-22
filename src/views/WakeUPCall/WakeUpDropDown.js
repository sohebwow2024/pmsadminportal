import React, { useState } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Label } from 'reactstrap'

const userRoles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Super Admin', label: 'Super Admin' }
]

const WakeUpDropDown = () => {
    const [userRole, setUserRole] = useState('')

    return (
        <>
            <Label>{userRole}</Label>
            <Select
                theme={selectThemeColors}
                className='react-select w-100 me-1'
                classNamePrefix='select'
                // defaultValue={userRoles[0]}
                options={userRoles}
                isClearable={false}
                onChange={e => setUserRole(e.value)}
            />
        </>
    )
}

export default WakeUpDropDown