import { React, useState } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle, CardBody, Label, Input, Modal, ModalBody, ModalHeader, Form, FormFeedback, Badge } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash, Trash2 } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Styles
import '@styles/react/libs/editor/editor.scss'

const statusOptions = [
    { value: true, label: 'ACTIVE' },
    { value: false, label: 'INACTIVE' }
]
const roomStatus = [
    { value: '', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'In Active', label: 'In Active' }
]
const Users = () => {

    const [userData, setUserData] = useState([
        {
            id: 1,
            user_name: 'alam',
            user_email: 'abc@gmail.com',
            mobile_number: '7276765423',
            user_password: '124563',
            status: true
        }
    ])
    const [sel_id, setSel_id] = useState()
    // const [userModal, setUserModal] = useState(false)
    // const handleUserModal = () => setUserModal(!userModal)
    // const [updateUser, setUpdateUser] = useState(false)
    // const handleUpdateTc = () => setUpdateUser(!updateUser)

    const [delUser, setDelUser] = useState(false)
    const handleDeleteUser = () => setDelUser(!delUser)

    const [searchName, setSearchName] = useState('')
    const [searchMobileNumber, setSearchRoomNo] = useState('')
    const [searchUserStatus, setSearchSUserStatus] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const dataToRender = () => {
        if (
            searchName.length ||
            searchMobileNumber.length ||
            searchUserStatus.length
        ) {
            return filteredData
        } else {
            return userData
        }
    }

    // ** Function to handle name filter
    const handleNameFilter = e => {
        const value = e.target.value
        let updatedData = []
        const dataToFilter = () => {
            if (searchName.length || searchMobileNumber.length || searchUserStatus.length) {
                return filteredData
            } else {
                return userData
            }
        }

        setSearchName(value)
        console.log(value.length)
        if (value.length) {
            updatedData = dataToFilter().filter(item => {
                const startsWith = item.user_name.toLowerCase().startsWith(value.toLowerCase())
                console.log("file: Users.js:74  updatedData=dataToFilter  startsWith", startsWith)
                const includes = item.user_name.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchName(value)

        }
    }
    // ** Function to handle email filter
    const handleMobileNumber = e => {
        const value = e.target.value
        let updatedData = []
        const dataToFilter = () => {
            if (searchName.length || searchMobileNumber.length || searchUserStatus.length) {
                return filteredData
            } else {
                return userData
            }
        }

        setSearchRoomNo(value)
        if (value.length) {
            updatedData = dataToFilter().filter(item => {
                const startsWith = item.mobile_number.toLowerCase().startsWith(value.toLowerCase())
                const includes = item.mobile_number.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchRoomNo(value)
        }
    }

    // ** Function to handle room_status filter
    const handleRoomStatus = e => {
        const value = e.value
        let updatedData = []
        const dataToFilter = () => {
            if (searchName.length || searchMobileNumber.length || searchUserStatus.length) {
                return filteredData
            } else {
                return userData
            }
        }

        setSearchSUserStatus(value)
        if (value.length) {
            updatedData = dataToFilter().filter(item => {
                const startsWith = item.status.toLowerCase().startsWith(value.toLowerCase())
                console.log("file: Users.js:133  updatedData=dataToFilter  startsWith", startsWith)
                const includes = item.status.toLowerCase().includes(value.toLowerCase())
                console.log("file: Users.js:135  updatedData=dataToFilter  includes", includes)

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            console.log([updatedData])
            setFilteredData(updatedData)
            setSearchSUserStatus(value)
        }
    }

    // const NewTCModal = ({ open, handleUserModal }) => {
    //     const [submit, setSubmit] = useState(false)
    //     const [userName, setUserName] = useState("")
    //     const [email, setEmail] = useState('')
    //     const [number, setNumber] = useState('')
    //     const [password, setPassword] = useState('')

    //     const userObj = {
    //         id: Math.floor(Math.random() * 100),
    //         user_name: userName,
    //         user_email: email,
    //         mobile_number: number,
    //         user_password: password,
    //         status: true
    //     }

    //     const handleNewUser = (e) => {
    //         e.preventDefault()
    //         setSubmit(true)
    //         if (userName !== '' && email !== '' && number !== '' && password.length >= 6) {
    //             setUserData([...userData, userObj])
    //             handleUserModal()
    //             setSubmit(false)
    //         }

    //     }

    //     return (
    //         <>
    //             <Modal isOpen={open} toggle={handleUserModal} className='modal-dialog-centered modal-sm' backdrop={false}>
    //                 <ModalHeader toggle={handleUserModal}>
    //                     Add new User
    //                 </ModalHeader>
    //                 <ModalBody>
    //                     <Form onSubmit={e => handleNewUser(e)}>
    //                         <Row className='mb-1'>
    //                             <Col sm={12} md={12}>
    //                                 <Label className='form-label'>User Name</Label>
    //                                 <Input
    //                                     type='text'
    //                                     name='name'
    //                                     placeholder='Enter User Name'
    //                                     value={userName}
    //                                     onChange={e => setUserName(e.target.value)}
    //                                     invalid={submit && userName === ''}
    //                                 />
    //                                 {submit && userName === '' && <FormFeedback>User Name is required</FormFeedback>}
    //                             </Col>
    //                             <Col sm={12} md={12}>
    //                                 <Label className='form-label'>Email</Label>
    //                                 <Input
    //                                     type='email'
    //                                     name='email'
    //                                     placeholder='Enter Email ID'
    //                                     value={email}
    //                                     onChange={e => setEmail(e.target.value)}
    //                                     invalid={submit && email === ''}
    //                                 />
    //                                 {submit && email === '' && <FormFeedback>Email is required</FormFeedback>}
    //                             </Col>
    //                             <Col sm={12} md={12}>
    //                                 <Label className='form-label'>Mobile Number</Label>
    //                                 <Input
    //                                     type='number'
    //                                     name='mobile'
    //                                     placeholder='Enter Mobile Number'
    //                                     value={number}
    //                                     onChange={e => setNumber(e.target.value)}
    //                                     invalid={submit && number === ''}
    //                                 />
    //                                 {submit && number === '' && <FormFeedback>Mobile Number is required</FormFeedback>}
    //                             </Col>
    //                             <Col sm={12} md={12}>
    //                                 <Label className='form-label'>Password</Label>
    //                                 <Input
    //                                     type='password'
    //                                     name='password'
    //                                     placeholder='Enter Password'
    //                                     value={password}
    //                                     onChange={e => setPassword(e.target.value)}
    //                                     invalid={submit && password.length <= 6}
    //                                 />
    //                                 {submit && password.length <= 6 && <FormFeedback>Password Must be 6 Char</FormFeedback>}
    //                             </Col>
    //                         </Row>
    //                         <Row>
    //                             <Col className='text-center'>
    //                                 <Button color='primary' type='submit'>Create User</Button>
    //                             </Col>
    //                         </Row>
    //                     </Form>
    //                 </ModalBody>
    //             </Modal>
    //             {
    //                 open ? (
    //                     <div className="modal-backdrop fade show" ></div>
    //                 ) : null
    //             }
    //         </>
    //     )
    // }

    const UpdateTC = ({ open, handleUpdateTc, id }) => {

        const data = userData.filter(user => user.id === id)

        const [newName, setNewName] = useState(data[0]?.user_name)
        const [newEmail, setNewEmail] = useState(data[0]?.user_email)
        const [newNumber, setNewNumber] = useState(data[0]?.mobile_number)
        const [newPassword, setNewPassword] = useState(data[0]?.user_password)
        const [newStatus, setNewStatus] = useState(data[0]?.status)
        const [editSubmit, setEditSubmit] = useState(false)

        const updateUser = (e) => {
            e.preventDefault()
            setEditSubmit(true)
            if (newName !== '' || newEmail !== '') {
                userData.map(obj => {
                    if (obj.id === id) {
                        obj.user_name = newName
                        obj.user_email = newEmail
                        obj.mobile_number = newNumber
                        obj.user_password = newPassword
                        if (newStatus === true) {
                            obj.status = true
                        } else {
                            obj.status = false
                        }
                    }
                })
                setEditSubmit(false)
                handleUpdateTc()
            }
        }

        return (
            <>
                <Modal isOpen={open} toggle={handleUpdateTc} className='modal-dialog-centered modal-sm' backdrop={false}>
                    <ModalHeader toggle={handleUpdateTc}>
                        Edit User
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row className='mb-1'>
                                <Col sm={12} md={12}>
                                    <Label className='form-label'>User Name</Label>
                                    <Input
                                        type='text'
                                        name='tccategory'
                                        placeholder='Enter New Name'
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        invalid={editSubmit && newName === ''}
                                    />
                                    {editSubmit && newName === '' && <FormFeedback>User Name is required</FormFeedback>}
                                </Col>
                                <Col sm={12} md={12}>
                                    <Label className='form-label'>Email</Label>
                                    <Input
                                        type='text'
                                        name='tccategory'
                                        placeholder='Enter New Email'
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        invalid={editSubmit && newEmail === ''}
                                    />
                                    {editSubmit && newEmail === '' && <FormFeedback>Email required</FormFeedback>}
                                </Col>
                                <Col sm={12} md={12}>
                                    <Label className='form-label'>Mobile Number</Label>
                                    <Input
                                        type='text'
                                        name='tccategory'
                                        placeholder='Enter New Mobile Number'
                                        value={newNumber}
                                        onChange={e => setNewNumber(e.target.value)}
                                        invalid={editSubmit && newNumber === ''}
                                    />
                                    {editSubmit && newNumber === '' && <FormFeedback>Mobile Number is required</FormFeedback>}
                                </Col>
                                <Col sm={12} md={12}>
                                    <Label className='form-label'>Password</Label>
                                    <Input
                                        type='text'
                                        name='tccategory'
                                        placeholder='Enter New Password'
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        invalid={editSubmit && newPassword.length <= 6}
                                    />
                                    {editSubmit && newPassword.length <= 6 && <FormFeedback>Password is required</FormFeedback>}
                                </Col>
                                <Col sm={12} md={12}>
                                    <Label className='form-label'>Select Status</Label>
                                    <Select
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={statusOptions}
                                        onChange={e => setNewStatus(e.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className='text-center'>
                                    <Button color='primary' onClick={e => updateUser(e)}>Update</Button>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
                {
                    open ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const DeleteUser = ({ open, handleDeleteUser, id }) => {
        // const data = userData.filter(user => user.id === id)

        const handleDelete = () => {
            setUserData(userData.filter(user => user.id !== id))
            handleDeleteUser()
        }

        return (
            <>
                <Modal isOpen={open} toggle={handleDeleteUser} className='modal-dialog-centered' backdrop={false}>
                    <ModalHeader toggle={handleDeleteUser}></ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col className='text-center'>
                                <h5>hello user</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <Button className='mx-1' color='danger' onClick={handleDelete}>Delete</Button>
                                <Button className='mx-1' color='secondary' outline onClick={handleDeleteUser}>Cancel</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
                {
                    open ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const UsersColumns = [
        {
            name: 'User ID',
            sortable: true,
            selector: row => row.id
        },
        {
            name: 'Name',
            sortable: true,
            selector: row => row.user_name
        },
        {
            name: 'Email',
            sortable: true,
            selector: row => row.user_email
        },
        {
            name: 'Mobile Number',
            sortable: true,
            selector: row => row.mobile_number
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => {
                return (
                    <>
                        {
                            row.status ? (
                                <Badge color='light-success'>
                                    ACTIVE
                                </Badge>
                            ) : (
                                <Badge color='light-danger'>
                                    INACTIVE
                                </Badge>
                            )
                        }
                    </>
                )
            }
        },
        {
            name: 'Actions',
            sortable: true,
            center: true,
            selector: row => {
                return (
                    <>
                        <Col>
                            <Button color='primary' onClick={() => {
                                setSel_id(row.id)
                                handleDeleteUser()
                            }}>View</Button>
                        </Col>

                    </>
                )
            }
        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Users List</CardTitle>
                    {/* <Button color='primary' onClick={handleUserModal}>Add New User</Button> */}
                </CardHeader>
                <CardBody>
                    <Row className='mt-1 mb-50'>
                        <Col lg='4' md='6' className='mb-1'>
                            <Label className='form-label' for='room'>
                                Name:
                            </Label>
                            <Input
                                type='text'
                                id='name'
                                placeholder='Search User'
                                value={searchName}
                                onChange={handleNameFilter}
                            />
                        </Col>
                        <Col lg='4' md='6' className='mb-1'>
                            <Label className='form-label' for='number'>
                                Mobile Number:
                            </Label>
                            <Input
                                type='number'
                                id='number'
                                placeholder='Search mobile number'
                                value={searchMobileNumber}
                                onChange={handleMobileNumber}
                            />
                        </Col>
                        <Col lg='4' md='6' className='mb-1'>
                            <Label className='form-label' for='room_status'>
                                Status:
                            </Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                classNamePrefix='select'
                                defaultValue={roomStatus[0]}
                                options={roomStatus}
                                isClearable={false}
                                onChange={handleRoomStatus}
                            />
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <DataTable
                                noHeader
                                pagination
                                data={dataToRender()}
                                columns={UsersColumns}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* <NewTCModal open={userModal} handleUserModal={handleUserModal} /> */}
            {/* <UpdateTC open={updateUser} handleUpdateTc={handleUpdateTc} id={sel_id} /> */}
            <DeleteUser open={delUser} handleDeleteUser={handleDeleteUser} id={sel_id} />
        </>
    )
}

export default Users