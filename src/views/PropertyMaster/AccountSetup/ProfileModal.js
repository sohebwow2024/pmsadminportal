import React from 'react'
// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Third Party Components
import {
    User,
    Mail,
    CheckSquare,
    MessageSquare,
    Settings,
    CreditCard,
    HelpCircle,
    Power,
    Lock
} from "react-feather"


import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import {
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    Row,
    Col,
    Label,
    Input,
    InputGroup,
    Button,
    Card,
    CardTitle,
    CardBody,
    CardHeader
} from "reactstrap"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/user.png"
import { useDispatch, useSelector } from "react-redux"
// import { userDataStorage } from "../../../../../redux/usermanageReducer"
import axios from "../../../API/axios"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import moment from "moment"



const ProfileModal = ({ showEdit, setShowEdit, handleEditModal }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const titleOptions = [
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Mrs.', label: 'Mrs.' }
    ]
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

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ]

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]



    const [accounts, setAccounts] = useState([])
    const [flag, setFlag] = useState(false)
    const handleFlag = () => setFlag(!flag)
    const { LoginID, Token } = getUserData

    console.log("userRedux: ", getUserData)

    const fetchAccountDetails = async () => {
        try {
            const res = await axios.get('/accountsetting/userdetailbyid', {
                headers: {
                    LoginID,
                    Token,
                    SecKey: '123'
                },
                params: {
                    userId: getUserData?.UserID
                }
            })
            console.log('res---', res)
            // setRoomAvailArr(res?.data[0])
            setAccounts(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        fetchAccountDetails()
    }, [])
    const accountData = accounts
    console.log('accountData', accountData[0]?.firstName)

    const [editTitle, setEditTitle] = useState(accountData[0]?.Title)
    const [editAccountType, setEditAccountType] = useState(accountData[0]?.accountType)
    const [editFirstName, setEditFirstName] = useState(accountData[0]?.firstName)
    const [editMidName, setEditMidName] = useState(accountData[0]?.middleName)
    const [editLastName, setEditLastName] = useState(accountData[0]?.lastName)
    const [editPrefName, setEditPrefName] = useState(accountData[0]?.preferredName)
    const [editGender, setEditGender] = useState(accountData[0]?.gender)
    const [editAadhaar, setEditAadhaar] = useState(accountData[0]?.aadharNumber)
    const [editPicker, setEditPicker] = useState(accountData[0]?.dateOfBirth)
    const [editAge, setEditAge] = useState(accountData[0]?.age)
    const [editAddress, setEditAddress] = useState(accountData[0]?.address)
    const [editMobile, setEditMobile] = useState(accountData[0]?.phoneNumber)
    const [editEmail, setEditEmail] = useState(accountData[0]?.email)
    const [editGst, setEditGst] = useState(accountData[0]?.gst)
    const [editStatus, setEditStatus] = useState(accountData[0]?.status)
    const [editDisplay, setEditDisplay] = useState(false)

    console.log('editFirstName', editFirstName);


    useEffect(() => {
        setEditTitle(accountData[0]?.title)
        setEditFirstName(accountData[0]?.firstName);
        setEditMidName(accountData[0]?.middleName)
        setEditLastName(accountData[0]?.lastName)
        setEditPrefName(accountData[0]?.preferredName)
        setEditGender(accountData[0]?.gender)
        setEditAadhaar(accountData[0]?.aadharNumber)
        setEditPicker(accountData[0]?.dateOfBirth)
        setEditAge(accountData[0]?.age)
        setEditAddress(accountData[0]?.address)
        setEditMobile(accountData[0]?.phoneNumber)
        setEditEmail(accountData[0]?.email)
        setEditGst(accountData[0]?.gst)
        setEditStatus(accountData[0]?.status)
    }, [accountData]);

    const ageCalculator = (date) => {
        const ageDiff = Date.now() - date[0]
        const ageDate = new Date(ageDiff)
        setEditAge(Math.abs(ageDate.getUTCFullYear() - 1970))
    }
    const editHandleSubmit = async () => {

        try {
            setEditDisplay(true)
            console.log('editAccount: ')
            // if (editAccountType && editFirstName && editGender && editAadhaar && editMobile && editEmail) {
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
            console.log('obj', obj);
            // const updateResponse = await userDataApi(obj)
            // const updateResponse = await axios.post('/setting/updateUserDetails', obj, {
            const updateResponse = await axios.post('/accountsetting/updateuserdetails', obj, {
                headers: {
                    LoginID,
                    Token,
                    SecKey: '123'
                }
            })
            console.log('res', updateResponse)
            if (updateResponse.data[0][0].status === "Success") {
                handleFlag()
                setEditDisplay(false)
                toast.success('Account Edited Successfully!', { position: "top-center" })
            }
            // }
        } catch (e) {
            // setShowEdit(false)
            console.log(e.response.data.message);
            toast.error(e.response.data.message, { position: "top-center" })
        }
    }
    return (
        <>

            <Card>
                <CardHeader>
                    <CardTitle>Booking Report</CardTitle>
                </CardHeader>
                <CardBody className='text-center'>
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
                            {/* <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    value={accountTypes.filter(c => c.value === editAccountType)}
                                    options={accountTypes}
                                    isClearable={false}
                                    disabled
                                    aria-readonly
                                    //value={editAccountType}
                                    onChange={e => setEditAccountType(e.value)}
                                    invalid={editDisplay && editAccountType === ''}
                                /> */}
                            <Input type="text" value={accountData[0]?.AccountType} disabled />
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
                                placeholder='Enter Mobile Num' name='mobile' id='mobile' value={editMobile}
                                onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                }}
                                onChange={e => setEditMobile(e.target.value)} invalid={editDisplay && editMobile === ''} />
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
                            {/* <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                disabled
                                classNamePrefix='select'
                                placeholder='Select Room status'
                                options={statusOptions}
                                value={statusOptions?.filter(c => c.value === editStatus)}
                                onChange={e => setEditStatus(e.value)}
                            /> */}
                            <Input type='text' name='gst' id='gst' value={editStatus} disabled />
                            {/* {editDisplay && editStatus === '' && <span className='text-danger'>Account Status is required</span>} */}
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
                </CardBody>
            </Card>
        </>
    )

}


export default ProfileModal
