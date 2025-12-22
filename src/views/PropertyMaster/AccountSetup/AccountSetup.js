import { React, useState, useEffect } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Input, Row, Col, Modal, ModalHeader, ModalBody, Label, InputGroupText, InputGroup, CardHeader, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash } from 'react-feather'
//import toast from 'react-hot-toast'
import AccountSetupModal from './AccountSetupModal'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import { userDataApi } from '../../../common/commonMethods'
import toast from 'react-hot-toast'
import moment from 'moment'
import { use } from 'i18next'
import { useDispatch } from 'react-redux'
import { storeAccountList } from '../../../redux/usermanageReducer'

const titleOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Ms.', label: 'Ms.' },
    { value: 'Mrs.', label: 'Mrs.' }
]

//------------WRONG OPTIONS------------
// const accountTypes = [
//     { value: 'HouseKeeping', label: 'HouseKeeping' },
//     { value: 'FoodBeverage', label: 'Food & Beverage' },
//     { value: 'FrontOffice', label: 'Front Office' },
//     { value: 'KitchenService', label: 'Kitchen Service' },
//     { value: 'Accounts', label: 'Accounts' },
//     { value: 'Purchase', label: 'Purchase' },
//     { value: 'SalesMarketing', label: 'Sales & Marketing' },
//     { value: 'Vendor', label: 'Vendor' },
//     { value: 'Debtor Account', label: 'Debtor Account' },
//     { value: 'Travel Agent', label: 'Travel Agent' }
// ]
const accountTypes = [
    { value: 'HouseKeeping', label: 'HouseKeeping' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Front Office', label: 'Front Office' },
    { value: 'Kitchen Service', label: 'Kitchen Service' },
    { value: 'Accounts', label: 'Accounts' },
    { value: 'Purchase', label: 'Purchase' },
    { value: 'Sales & Marketing', label: 'Sales & Marketing' },
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Debtor Account', label: 'Debtor Account' },
    { value: 'Travel Agent', label: 'Travel Agent' },
    // { value: '11',label:'Laundry'}
]
console.log('accountTypes',accountTypes);
const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
]

const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

const AccountSetup = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Account Setup"
    
        return () => {
          document.title = prevTitle
        }
      }, [])


    const dispatch = useDispatch()

    const [flag, setFlag] = useState(false)
    const handleFlag = () => setFlag(!flag)

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    /*Account Flag
    0 - Read view users
    1  - Insert USer
    2 - Update User
    3 - Delete
    */
    const [isAccountFlag, setIsAccountFlag] = useState(1)
    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)

    const [selected_account, setSelected_account] = useState()
    const getAccountUserList = useSelector(state => state.userManageSlice.userLists)

    const [del, setDel] = useState(false)

    const [accounts, setAccounts] = useState([])

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    console.log("userRedux: ", getUserData)

    const fetchAccountDetails = async () => {
        console.log('hittttttttttttttttttttttttttttttttttttttttttt');
        const { LoginID, Token } = getUserData
        let obj = {
            LoginID,
            Token,
            "Seckey": "abc",
            Event: "selectall"
        }
        dispatch(storeAccountList(obj))
        const res = await axios.post("/getdata/userdata/userdetails", obj)
        console.log("res: ", res)
        console.log("getdata: ", res)
        if (res?.data[0].length > 0) {
            let arr = [];
            res?.data[0].map((v, i) => {
                // console.log("v: ", v)
                arr.push({
                    id: i + 1, ...v
                })
            })
            console.log("array", arr)
            setAccounts(arr)
        } else {
            setAccounts([])
        }
        // if (getAccountUserList.data[0].length > 0) {
        //     let arr = [];
        //     getAccountUserList.data[0].map((v, i) => {
        //         console.log("v: ", v)
        //         arr.push({
        //             id: i + 1, ...v
        //         })
        //     })
        //     console.log("array", arr)
        //     setAccounts(arr)
        // }
    }

    const EditAccountModal = ({ id }) => {

        const accountData = accounts.filter(account => account.id === id)
        console.log('accountData', accountData)

        const [editTitle, setEditTitle] = useState(accountData[0]?.title)
        const [editAccountType, setEditAccountType] = useState(accountData[0]?.accountType)
        const [editFirstName, setEditFirstName] = useState(accountData[0]?.firstName)
        const [editMidName, setEditMidName] = useState(accountData[0]?.middleName)
        const [editLastName, setEditLastName] = useState(accountData[0]?.lastName)
        const [editPrefName, setEditPrefName] = useState(accountData[0]?.preferredName)
        const [editGender, setEditGender] = useState(accountData[0]?.gender)
        const [editAadhaar, setEditAadhaar] = useState(accountData[0]?.aadharNumber)
        const [editPicker, setEditPicker] = useState(accountData[0]?.dateOfBirth)
        const [editAge, setEditAge] = useState(accountData[0]?.Age)
        const [editAddress, setEditAddress] = useState(accountData[0]?.address)
        const [editMobile, setEditMobile] = useState(accountData[0]?.phoneNumber)
        const [editEmail, setEditEmail] = useState(accountData[0]?.email)
        const [editGst, setEditGst] = useState(accountData[0]?.GST)
        const [editStatus, setEditStatus] = useState(accountData[0]?.status)
        const [editDisplay, setEditDisplay] = useState(false)

        const ageCalculator = (date) => {
            const ageDiff = Date.now() - date[0]
            const ageDate = new Date(ageDiff)
            setEditAge(Math.abs(ageDate.getUTCFullYear() - 1970))
        }

        const editHandleSubmit = async () => {
            try {
                setEditDisplay(true)
                console.log('editAccount: ', id)
                if (editAccountType && editFirstName && editGender && editAadhaar && editMobile && editEmail) {

                    let obj = {
                        LoginID,
                        Token,
                        Seckey: "abc",
                        Event: "update",
                        FirstName: editFirstName,
                        LastName: editLastName,
                        Gender: editGender.substring(0, 1),
                        Age: editAge,
                        Email: editEmail,
                        PhoneNumber: parseInt(editMobile),
                        UserID: accountData[0].userID,
                        Title: editTitle,
                        // AccountType: accountTypes.findIndex((i => i.value === editAccountType)) + 1,
                        AccountType: editAccountType,
                        MiddleName: editMidName,
                        PreferredName: editPrefName,
                        AadharNumber: editAadhaar,
                        DateOfBirth: moment(editPicker[0]).format('yyy-MM-DD'),
                        Address: editAddress,
                        GST: editGst,
                        Status: editStatus
                    }
                    handleEditModal()
                    const updateResponse = await userDataApi(obj)
                    console.log('res', updateResponse)
                    if (updateResponse.data[0][0].status === "Success") {
                        handleFlag()
                        setEditDisplay(false)
                        toast.success('Account Edited Successfully!', { position: "top-center" })
                    }
                }
            } catch (e) {
                setShowEdit(false)
                console.log(e);
                toast.error('Account Edit Failed!', { position: "top-center" })
            }
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
                        Edit Account Details
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <Row>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='title'>Title</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    // defaultValue={titleOptions[0]}
                                    value={titleOptions.filter(c => c.value === editTitle)}
                                    options={titleOptions}
                                    isClearable={false}
                                    // value={editTitle}
                                    onChange={e => setEditTitle(e.value)}
                                />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='accountType'>
                                    <span className='text-danger'>*</span>Account Type
                                </Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    value={accountTypes.filter(c => c.value === editAccountType)}
                                    options={accountTypes}
                                    isClearable={false}
                                    aria-readonly
                                    //value={editAccountType}
                                    onChange={e => setEditAccountType(e.value)}
                                    invalid={editDisplay && editAccountType === ''}
                                />
                                {editDisplay && !editAccountType ? <span className='error_msg_lbl'>Enter Account Type </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='firstName'>
                                    <span className='text-danger'>*</span>First Name
                                </Label>
                                <Input type='text' placeholder='Enter First Name' name='firstName' id='firstName' value={editFirstName} onChange={e => setEditFirstName(e.target.value)} invalid={editDisplay && editFirstName === ''} />
                                {editDisplay && !editFirstName ? <span className='error_msg_lbl'>Enter First Name </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='midName'>Middle Name</Label>
                                <Input type='text' placeholder='Enter Middle Name' name='midName' id='midName' value={editMidName} onChange={e => setEditMidName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='lastName'>Last Name</Label>
                                <Input type='text' placeholder='Enter Last Name' name='lastName' id='lastName' value={editLastName} onChange={e => setEditLastName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='prefName'>Preferred Name</Label>
                                <Input type='text' placeholder='Enter Name' name='prefName' id='prefName' value={editPrefName} onChange={e => setEditPrefName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='gender'>Gender<span className='text-danger'>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    options={genderOptions}
                                    value={genderOptions.filter(c => c.value === editGender)}
                                    //value={editGender}
                                    onChange={e => setEditGender(e.value)}
                                />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='aadhaar'>
                                    <span className='text-danger'>*</span>Aadhaar Number
                                </Label>
                                <Input type='text' placeholder='Enter Aadhaar Num'
                                    maxLength={12}
                                    name='aadhaar' id='aadhaar' value={editAadhaar} onChange={e => setEditAadhaar(e.target.value)} invalid={editDisplay && editAadhaar === ''} />
                                {editDisplay && !editAadhaar ? <span className='error_msg_lbl'>Enter Aadhaar Number </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label'>Date of Birth</Label>
                                <InputGroup className='input-group-merge'>
                                    <Flatpickr className='form-control' value={editPicker} onChange={date => {
                                        setEditPicker(date)
                                        ageCalculator(date)
                                    }} id='startDate' />
                                </InputGroup>
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='age'>Age</Label>
                                <Input type='text' disabled placeholder='Enter Age' name='age' id='age' value={editAge} />
                            </Col>
                            <h3>Address Details</h3>
                            <Col lg='12' className='mb-2'>
                                <Label className='form-label' for='address'>Address</Label>
                                <Input type='textarea' placeholder='Enter Address' name='address' id='address' value={editAddress} onChange={e => setEditAddress(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='mobile'>
                                    <span className='text-danger'>*</span>Mobile Number
                                </Label>
                                <Input type='number'
                                    maxLength={10}

                                    placeholder='Enter Mobile Num' name='mobile' id='mobile' value={editMobile} onChange={e => setEditMobile(e.target.value)} invalid={editDisplay && editMobile === ''} />
                                {editDisplay && !editMobile ? <span className='error_msg_lbl'>Enter Mobile Number </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='email'>
                                    <span className='text-danger'>*</span>Email ID
                                </Label>
                                <Input type='text' placeholder='Enter Email' name='email' id='email' value={editEmail} onChange={e => setEditEmail(e.target.value)} invalid={editDisplay && editEmail === ''} />
                                {editDisplay && !editEmail ? <span className='error_msg_lbl'>Enter Email </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='gst'>GST</Label>
                                <Input type='text' name='gst' id='gst' value={editGst} onChange={e => setEditGst(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label'>Account Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    placeholder='Select Room status'
                                    options={statusOptions}
                                    value={statusOptions?.filter(c => c.value === editStatus)}
                                    onChange={e => setEditStatus(e.value)}
                                />
                                {editDisplay && editStatus === '' && <span className='text-danger'>Account Status is required</span>}
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-center mt-1' xs={12}>
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

    const DeleteAccountModal = ({ id }) => {
        console.log("id: ", id)

        const data = accounts.filter(accounts => accounts.id === id)
        console.log('sel', data);
        const handleDeleteAccount = async () => {
            try {
                let obj = { LoginID, Token, Seckey: "abc", Event: "delete", UserID: data[0].userID }
                console.log('delobj', obj)
                const deleteResponseData = await userDataApi(obj)
                console.log('deleteResponseData', deleteResponseData);
                if (deleteResponseData.status === 200) {
                    setDel(!del)
                    handleFlag()
                    toast.success('Account Deleted Successfully!', { position: "top-center" })
                }

            } catch (e) {
                setDel(!del)
                toast.error('Delete operation failed!', { position: "top-center" })
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
                        Are you sure to delete "{data[0]?.firstName}" permanently?
                        "{data[0]?.FirstName}" login details will also be deactivated, are you sure?
                    </ModalHeader>
                    <ModalBody>
                        <Row className='text-center'>
                            <Col xs={12}>
                                <Button color='danger' className='m-1' onClick={handleDeleteAccount}>
                                    Delete
                                </Button>
                                <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
                {
                    del ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }

    // useEffect(() => {
    //     fetchAccountDetails()
    // }, [show, showEdit, del])
    useEffect(() => {
        fetchAccountDetails()
    }, [flag])

    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.userID.toLowerCase().includes(query.toLowerCase()) ||
            item.firstName.toLowerCase().includes(query.toLowerCase()) ||
            // item.PhoneNumber.toLowerCase().includes(query.toLowerCase()) ||
            item.email.toLowerCase().includes(query.toLowerCase())
        )
    }

    const accountSetUpTable = [
        {
            name: 'ID',
            width: '16rem',
            sortable: true,
            selector: row => row.userID
        },
        {
            name: "Emp Name",
            sortable: true,
            selector: row => row.firstName
        },
        {
            name: 'Mobile Number',
            selector: row => row.phoneNumber
        },
        {
            name: 'Email Id',
            selector: row => row.email
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => row.status,
            cell: row => {
                return (
                    <>
                        {
                            row.Status === 'Active' ? (
                                <Badge color='light-success'> {row.status}</Badge>
                            ) : (
                                <Badge color='light-danger'> {row.status}</Badge>
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
                            setSelected_account(row.id)
                        }} size={15} />
                        <Trash className='me-50' size={15} onClick={() => {
                            console.log('roe', row)
                            setDel(true)
                            setSelected_account(row.id)
                        }} />
                    </Col>
                    {/* <EditAccountModal id={selected_account} />
                    <DeleteAccountModal id={selected_account} /> */}
                </>
            )

        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Account Setup
                    </CardTitle>
                    <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
                    <Button color='primary' onClick={() => setShow(true)}>Add New Account</Button>
                </CardHeader>
                <CardBody>
                    <Row className='my-1'>
                        <Col>
                            <DataTable
                                noHeader
                                data={search(accounts)}
                                columns={accountSetUpTable}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                pagination
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </Col>
                    </Row>
                    <div>
                        <Button className='me-2' color='primary' onClick={() => fetchAccountDetails()}>Reload</Button>
                    </div>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md='12' className='mb-1'>
                    <Card>
                        <CardBody>
                            <CardTitle tag='h1' className='fw-bold fs-2 d-flex justify-content-between'>
                                <h2>Account Setup</h2>
                                <Button color='primary' onClick={() => setShow(true)}>Add New Account</Button>
                            </CardTitle>
                            <CardText>
                                <DataTable
                                    noHeader
                                    data={accounts}
                                    columns={accountSetUpTable}
                                    className='react-dataTable'
                                />
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
            {show ? <AccountSetupModal
                open={show}
                setOpen={setShow}
                handleFlag={handleFlag}
                accounts={accounts}
                setAccounts={setAccounts}
            /> : <></>
            }
            {/* <EditAccountModal />  */}
            {/* <DeleteAccountModal /> */}
            {/* {show ? <AccountSetupModal open={show} setOpen={setShow}
                accounts={accounts}
                setAccounts={setAccounts} /> : <></>} */}
            {showEdit ? <EditAccountModal id={selected_account} /> : <></>}
            {del ? <DeleteAccountModal id={selected_account} /> : <></>}
            {
                show | showEdit | del ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default AccountSetup