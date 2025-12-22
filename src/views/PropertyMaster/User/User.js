import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash, Users } from 'react-feather'
import { AiOutlinePlusSquare } from "react-icons/ai"
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, CardHeader, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import AccountSetupModal from '../AccountSetup/AccountSetupModal'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import { cipherPasswordFunc, usersRoleDataApi } from '../../../common/commonMethods'

const userRoles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Basic', label: 'Basic' }
]

// const usersType = [
//     // { value: 'Employee1', label: 'Employee1' },
//     // { value: 'Employee2', label: 'Employee2' },
//     // { value: 'Employee3', label: 'Employee3' },
//     // { value: 'Employee4', label: 'Employee4' }
// ]

// let dat
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })

const User = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-User"

        return () => {
            document.title = prevTitle
        }
    }, [])

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

    const [open, setOpen] = useState(false)
    const [usersType, setUsersType] = useState([])
console.log('usersTypeCheck', usersType)
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    // console.log('getUserData', getUserData)

    const [show, setShow] = useState(false)
    const handleModal = () => setShow(!show)

    const getAccountUserList = useSelector(state => state.userManageSlice.userLists)

    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)

    const [selected_user, setSelected_user] = useState()

    const [del, setDel] = useState(false)

    const [users, setUsers] = useState([])

    let URLs = ["/authentication/userauthentication/loginauthentication", "/getdata/userdata/userdetails"]

    useEffect(() => {
        // get users from api       let obj = {
        fetchPromise(URLs)

        // Promise.all([ axios.get('https://jsonplaceholder.typicode.com/todos'), axios.get('https://jsonplaceholder.typicode.com/users')]).the(res=>console.log(res))
    }, [])

    const fetchPromise = async (URLs) => {
        const userResponse = await getAllData(URLs)
        console.log('userResponse', userResponse)
        if (userResponse[0].success && userResponse[0]?.data[0]?.length > 0) {

            let arr = []

            userResponse[0]?.data[0]?.map((v, i) => {
                arr.push({
                    id: i + 1,
                    loginId: v.loginID,
                    userId: v.userID,
                    user: v.firstName + " " + v.lastName,
                    roleType: v.userRoleType,
                    userRole: v.userRole,
                    userName: v.username,
                    email: v.email,
                    Status: v.status
                })
                setUsers(arr)
            })
            console.log('setUsers', arr);
        }
        if (userResponse[1].success && userResponse[1]?.data[0]?.length > 0) {
            console.log('userTypeData11', userResponse[1]?.data[0]);
            let arr = []

            userResponse[1]?.data[0]?.map(v => {
                arr.push({
                    value: v.userID,
                    label: v.firstName + " " + v.lastName + " (" + v.email + ")",
                    roleType: v.accountTYpe,
                    Status: v.status
                })
                setUsersType(arr)
            })
            console.log('UsersType', arr);
        }
    }

    const getAllData = (URLs) => {
        return Promise.all(URLs.map(fetchData));
    }

    const fetchData = (URL) => {
        let obj = {
            LoginID,
            Token,
            Seckey: "abc",
            Event: "select"
        }
        return axios
            .post(URL, obj)
            .then((response) => {
                console.log('response', response)
                return {
                    success: true,
                    data: response.data
                };
            })
            .catch(function (error) {
                return { success: false };
            });
    }

    useEffect(() => { fetchPromise(URLs) }, [show, showEdit, del])


    const NewUserModal = () => {

        const [user, setUser] = useState('')
        const [userId, setUserId] = useState('')
        const [userRole, setUserRole] = useState('')
        const [roleType, setRoleType] = useState('')
        const [userName, setUserName] = useState('')
        const [password, setPassword] = useState('')
        const [email, setEmail] = useState('')

        const [display, setDisplay] = useState(false)

        const userObj = {
            id: Math.floor(Math.random() * 100),
            user,
            userId,
            userRole,
            roleType,
            userName,
            password,
            email
        }
        console.log('getAccountUserList', getAccountUserList)
        const handleSubmit = async () => {
            setDisplay(true)
            if (user && userRole && userName && password !== '') {
                console.log('userRole: ', user.split(" "))
                let cipherPassword = cipherPasswordFunc(password)
                let obj = {
                    "Username": userName,
                    "Password": password,
                    "Event": "insert",
                    "LoginID": getUserData.LoginID,
                    "UserID": userId, //getAccountUserList.data[0].find(i=>i.Email == user.split(" ")[3]).UserID,
                    //"UserRoleID": "URO001",
                    "UserRole": userRole,
                    "Token": getUserData.Token
                }
                console.log('user obj', obj);
                // usersRoleDataApi()

                const loginnResponse = await axios.post('/authentication/userauthentication/loginauthentication', obj)
                    .then(response => {
                        console.log('res', response)
                        if (response.status === 200) {
                            setUsers([...users, userObj])
                            // handleModal()
                            toast.success('User Added Successfully!', { position: "top-center" })
                        }
                    }).catch(function (error) {
                        console.log("User Login Error=====", error?.response?.data?.Message)
                        toast.error(error?.response?.data?.Message)
                    })

            }
            fetchPromise(URLs)
            // else {
            //     toast.error('Fill All Fields!', {
            //         position: "top-center",
            //         style: {
            //             minWidth: '250px'
            //         },
            //         duration: 3000
            //     })
            // }
        }

        return (
            <>
                <Modal
                    isOpen={show}
                    toggle={handleModal}
                    className='modal-dialog-centered modal-lg'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={handleModal}>
                        <span className=' mb-1'>Add User</span>
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <>
                            <Form>
                                <Row>
                                    <Col lg='6' className='mb-md-1'>
                                        <Label className='form-label' for='user'>
                                            <span className='text-danger'>*</span>Users</Label>
                                        <AiOutlinePlusSquare className='ms-1' size={15} onClick={() => setOpen(true)}
                                        />
                                        <AccountSetupModal
                                            handleMainModal={handleModal}
                                            open={open}
                                            setOpen={setOpen}
                                            accounts={[]}
                                            setAccounts={[]}
                                            flag={1}
                                        />
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100 me-1'
                                            classNamePrefix='select'
                                            // defaultValue={users[0]}
                                            options={usersType}
                                            isClearable={false}
                                            onChange={e => (setUser(e.label.split('(')[0]), setUserId(e.value), console.log(''), setRoleType(e.roleType), setEmail(e.label.split('(')[1].replace(")", "")))}
                                            invalid={display ? user === '' : false}
                                        />
                                        {display === true && !user ? <span className='error_msg_lbl'>Please Select User </span> : <></>}
                                    </Col>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='userRole'>
                                            <span className='text-danger'>*</span>User Roles
                                        </Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100 me-1'
                                            classNamePrefix='select'
                                            // defaultValue={userRoles[0]}
                                            options={userRoles}
                                            isClearable={false}
                                            onChange={e => setUserRole(e.value)}
                                            invalid={display ? userRole === '' : false}
                                        />
                                        {display === true && !userRole ? <span className='error_msg_lbl'>Please Select User Role </span> : <></>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='userName'>
                                            <span className='text-danger'>*</span>Username
                                        </Label>
                                        <Input type='text' name='userName' id='userName' value={userName} onChange={e => setUserName(e.target.value)} invalid={display ? userName === '' : false} />
                                        {display === true && !userName ? <span className='error_msg_lbl'>Enter User Id </span> : <></>}
                                    </Col>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='password'>
                                            <span className='text-danger'>*</span>Password
                                        </Label>
                                        <Input type='text' name='password' id='password' value={password} onChange={e => setPassword(e.target.value)} invalid={display ? password === '' : false} />
                                        {display === true && !password ? <span className='error_msg_lbl'>Enter Password </span> : <></>}
                                    </Col>
                                </Row>
                            </Form>
                            <Row tag='form' className='gy-1 gx-2 mt-75' >
                                <Col className='text-lg-end text-md-center mt-1' xs={12}>
                                    <Button className='me-1' color='primary' onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={() => {
                                            setShow(!show)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    </ModalBody>
                </Modal>
                {
                    show ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const EditUserModal = ({ id }) => {

        const userData = users.filter(user => user.id === id)

        const [editUser, setEditUser] = useState(userData[0]?.userId)
        const [editUserRole, setEditUserRole] = useState(userData[0]?.userRole)
        const [edituserName, setEditUserName] = useState(userData[0]?.userName)
        const [editPassword, setEditPassword] = useState(userData[0]?.password)
        const [editStatus, setEditStatus] = useState(userData[0]?.Status)
        console.log('userData_pass', userData[0]?.password)

        const [editDisplay, setEditDisplay] = useState(false)

        const editHandleSubmit = () => {
            setEditDisplay(true)
            if (editUser && editUserRole && edituserName && editPassword !== '') {
                let cipherPassword = cipherPasswordFunc(editPassword)
                users.map(user => {
                    if (user.id === id) {
                        user.userId = editUser
                        user.userRole = editUserRole
                        user.userName = edituserName
                        user.password = editPassword === null ? undefined : editPassword
                        user.Status = editStatus
                    }
                })
                const edited_user_body = users.filter(c => c.id === id)
                console.log('edited_user_body', edited_user_body)

                let edit_obj = {
                    LoginID: getUserData.LoginID,
                    Token: "123",
                    Seckey: "abc",
                    Event: "update",
                    Username: edited_user_body[0].userName,
                    Password: edited_user_body[0].password === undefined ? null : edited_user_body[0].password,
                    UserRole: edited_user_body[0].userRole,
                    UserLoginID: edited_user_body[0].loginId,
                    UserRoleType: edited_user_body[0].roleType,
                    Status: edited_user_body[0].Status

                }
                console.log('edit_obj', edit_obj)
                try {
                    axios.post('/authentication/userauthentication/loginauthentication', edit_obj)
                        .then((res) => {
                            console.log('res', res)
                            toast.success('User Edited Succesfully!', { position: "top-center" })
                            // getAllData()
                        })
                } catch (error) {
                    console.log('error', error)
                    toast.error(error)
                }
                handleEditModal()

            }
            // else {
            //     toast.error('Fill All Fields!', {
            //         position: "top-center",
            //         style: {
            //             minWidth: '250px'
            //         },
            //         duration: 3000
            //     })
            // }
        }

        return (
            <>
                <Modal
                    isOpen={showEdit}
                    toggle={handleEditModal}
                    className='modal-dialog-centered modal-lg'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                        <span className=' mb-1'>Edit User</span>
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <>
                            <Form>
                                <Row>
                                    <Col lg='6' className='mb-md-1'>
                                        <Label className='form-label' for='user'>
                                            <span className='text-danger'>*</span>Users</Label>
                                        <Select
                                            isDisabled
                                            theme={selectThemeColors}
                                            className='react-select w-100 me-1'
                                            classNamePrefix='select'
                                            // defaultValue={users[0]}
                                            options={usersType}
                                            value={usersType.filter(c => c.value === editUser)}
                                            isClearable={false}
                                            onChange={e => setEditUser(e.value)}
                                            invalid={editDisplay ? editUser === '' : false}
                                        />
                                        {editDisplay === true && !editUser ? <span className='error_msg_lbl'>Please Select User </span> : <></>}
                                    </Col>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='userRole'>
                                            <span className='text-danger'>*</span>User Roles
                                        </Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100 me-1'
                                            classNamePrefix='select'
                                            // defaultValue={userRoles[0]}
                                            options={userRoles}
                                            value={userRoles.filter(c => c.value === editUserRole)}
                                            isClearable={false}
                                            onChange={e => setEditUserRole(e.value)}
                                            invalid={editDisplay ? editUserRole === '' : false}
                                        />
                                        {editDisplay === true && !editUserRole ? <span className='error_msg_lbl'>Please Select User Role </span> : <></>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='userName'>
                                            <span className='text-danger'>*</span>userName
                                        </Label>
                                        <Input disabled type='text' name='userName' id='userName' value={edituserName} onChange={e => setEditUserName(e.target.value)} invalid={editDisplay ? edituserName === '' : false} />
                                        {editDisplay === true && !edituserName ? <span className='error_msg_lbl'>Enter User Name </span> : <></>}
                                    </Col>
                                    <Col lg='6' className='mb-1'>
                                        <Label className='form-label' for='password'>
                                            <span className='text-danger'>*</span>Password
                                        </Label>
                                        <Input type='text' name='password' id='password' value={editPassword} onChange={e => setEditPassword(e.target.value)} />
                                        {/* {editDisplay === true && !editPassword ? <span className='error_msg_lbl'>Enter Password </span> : <></>} */}
                                    </Col>
                                    <Col>
                                        <Label className='form-label'>User Status</Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            placeholder='Select Room status'
                                            options={statusOptions}
                                            value={statusOptions?.filter(c => c.value === editStatus)}
                                            onChange={e => setEditStatus(e.value)}
                                        />
                                        {editDisplay && editStatus === '' && <span className='text-danger'>Room Status is required</span>}
                                    </Col>
                                </Row>
                            </Form>
                            <Row tag='form' className='gy-1 gx-2 mt-75'>
                                <Col className='text-lg-end text-md-center mt-1' xs={12}>
                                    <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={handleEditModal}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    </ModalBody>
                </Modal>
                {
                    showEdit ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    const DeleteUserModal = ({ id }) => {

        const data = users.filter(user => user.id === id)

        console.log('data', data)

        const handleDeleteUser = async () => {
            let obj = {
                // LoginID: getUserData.LoginID,
                LoginID,
                Token,
                Seckey: "abc",
                DeleteLoginID: data[0].loginId,
                Event: "delete"
            }
            const deleteUserResponse = await axios.post('/authentication/userauthentication/loginauthentication', obj)
            console.log('deleteUserResponse', deleteUserResponse)
            if (deleteUserResponse.data[0][0].status == "Success") {
                toast.success(deleteUserResponse.data[0][0].message)
                setUsers(users.filter(user => user.id !== id))
                setDel(!del)
            }

        }

        return (
            <>
                <Modal
                    isOpen={del}
                    toggle={() => setDel(!del)}
                    className='modal-dialog-centered'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
                        Are you sure to delete  {data[0]?.employee} permanently?
                    </ModalHeader>
                    <ModalBody>
                        <Row className='text-center'>
                            <Col xs={12}>
                                <Button color='danger' className='m-1' onClick={handleDeleteUser}>
                                    Delete
                                </Button>
                                <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>{
                    del ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    console.log('usersType', usersType)

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.user.toLowerCase().includes(query.toLowerCase()) ||
            item.roleType.toLowerCase().includes(query.toLowerCase()) ||
            item.userRole.toLowerCase().includes(query.toLowerCase()) ||
            item.userName.toLowerCase().includes(query.toLowerCase())
        )
    }

    const userTable = [
        {
            name: '#',
            width: '100px',
            sortable: true,
            selector: row => row.id
        },
        {
            name: "Users",
            sortable: true,
            selector: row => row.user,
            cell: row => (
                <>
                    <div className='wrap-text'>{row.user + " (" + row.email + ")"}</div>
                </>
            )
        },
        {
            name: "Department",
            sortable: true,
            selector: row => row.roleType
        },
        {
            name: "User Roles",
            sortable: true,
            selector: row => row.userRole
        },
        {
            name: "Username",
            selector: row => row.userName
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => row.Status,
            cell: row => {
                return (
                    <>
                        {
                            row.Status === 'Active' ? (
                                <Badge color='light-success'> {row.Status}</Badge>
                            ) : (
                                <Badge color='light-danger'> {row.Status}</Badge>
                            )
                        }
                    </>
                )
            }
        },
        {
            name: 'Action',
            sortable: true,
            center: true,
            selector: row => (
                <>
                    <Col>
                        <Edit className='me-50 pe-auto' onClick={() => {
                            setShowEdit(true)
                            setSelected_user(row.id)
                        }} size={15} />
                        <Trash className='me-50' size={15} onClick={() => {
                            setDel(true)
                            setSelected_user(row.id)
                        }} />
                    </Col>
                    {/* <EditUserModal id={selected_user} />
                    <DeleteUserModal id={selected_user} /> */}

                </>
            )
        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        User
                    </CardTitle>
                    <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                    <Button color='primary' onClick={() => setShow(true)}>Add User</Button>
                </CardHeader>
                <CardBody>
                    <Row className='my-1'>
                        <Col>
                            <DataTable
                                noHeader
                                pagination
                                data={search(users)}
                                columns={userTable}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                User
                            </CardTitle>
                            <Button color='primary' onClick={() => setShow(true)}>Add User</Button>
                            <CardText>
                                <DataTable
                                    noHeader
                                    data={users}
                                    columns={userTable}
                                    className='react-dataTable'
                                />
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
            <NewUserModal />
            <EditUserModal id={selected_user} />
            <DeleteUserModal id={selected_user} />

        </>
    )
}

export default User