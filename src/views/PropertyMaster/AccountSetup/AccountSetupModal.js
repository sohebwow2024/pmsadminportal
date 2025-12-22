import { React, useState, useEffect } from 'react'
import { Button, Input, Row, Col, Modal, ModalHeader, ModalBody, Label, InputGroup } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast'
import { userDataApi } from '../../../common/commonMethods'
import { useSelector } from 'react-redux'
import moment from 'moment'

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
    // { value: '11', label: 'Laundry' }
]

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
]

const AccountSetupModal = ({ open, setOpen, handleFlag, accounts, setAccounts, flag, accountFlag, handleMainModal }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [title, setTitle] = useState('Mr.')
    const [accountType, setAccountType] = useState('')
    const [firstName, setFirstName] = useState('')
    const [midName, setMidName] = useState('')
    const [lastName, setLastName] = useState('')
    const [prefName, setPrefName] = useState('')
    const [gender, setGender] = useState('')
    const [aadhaar, setAadhaar] = useState('')
    const [picker, setPicker] = useState('')
    const [age, setAge] = useState('')
    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [gst, setGst] = useState('')
    const [submitDisableFlag, setSubmitDisableFlag] = useState(false);
    const [userData, setUserData] = useState({});

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        let userData = localStorage.getItem("userData");
        setUserData(userData);
        console.log("userData", userData);

    }, [])

    const reset = () => {
        setTitle('Mr.')
        setAccountType('')
        setFirstName('')
        setMidName('')
        setLastName('')
        setPrefName('')
        setGender('')
        setAadhaar('')
        setPicker('')
        setAge('')
        setAddress('')
        setMobile('')
        setEmail('')
        setGst('')
        setDisplay(false)
        handleFlag()
    }
    const ageCalculator = (date) => {
        const ageDiff = Date.now() - date[0]
        const ageDate = new Date(ageDiff)
        setAge(Math.abs(ageDate.getUTCFullYear() - 1970))
    }

    const addAccountDetails = async () => {
        console.log("event: ", "insert")
        try {
            let status = false;

            const obj = {
                Title: title,
                AccountType: accountType,
                FirstName: firstName,
                Token,
                Seckey: "abc",
                MiddleName: midName,
                LastName: lastName,
                DateOfBirth: moment(picker).toISOString(),
                Age: age,
                PhoneNumber: parseInt(mobile),
                Address: address,
                Email: email,
                PreferredName: prefName,
                AadharNumber: aadhaar,
                Gender: gender,
                GST: gst,
                LoginID,
                Event: "insert",
                UserID: userData[0].UserID,
                // "StatusID": userData[0].StatusID,
            }
            console.log("body data: ", JSON.stringify(obj))
            console.log("body data obj", obj)
            const userResponseData = await userDataApi(obj)

            console.log("addAccountDetails response", userResponseData);
            if (userResponseData.status == 200) {
                setOpen(false)
                reset()
                toast.success('Account Added!', { position: "top-center" })
            } else {
                toast.error('Account creation Failed!', { position: "top-center" })
            }
            return status;
        } catch (error) {
            console.log("addAccountDetails Error=====", error.message, error)
            toast.error(`Account creation Failed!- ${error.response.data.Message}`)
        }
    }


    const handleSubmit = () => {
        setSubmitDisableFlag(true);
        if (flag === 0) {
            console.log(flag);
            setDisplay(true)
            if (accountType && firstName && gender && aadhaar && mobile && email !== '') {
                setOpen(false)
                reset()
                toast.success('Account Added!', { position: "top-center" })
            }
        } else {
            setDisplay(true)
            if (accountType && firstName && gender && aadhaar && mobile && email !== '') {
                addAccountDetails();
            }
            setSubmitDisableFlag(false);
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={() => setOpen(!open)}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={() => setOpen(!open)}>
                    Account Details
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
                                value={titleOptions.filter(c => c.value === title)}
                                options={titleOptions}
                                isClearable={false}
                                onChange={e => setTitle(e.value)}
                            />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='accountType'>
                                Account Type<span className='text-danger'> *</span>
                            </Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                classNamePrefix='select'
                                // defaultValue={accountTypes}
                                options={accountTypes}
                                isClearable={false}
                                value={accountTypes.filter(c => c.value === accountType)}
                                onChange={e => (setAccountType(e.value), console.log(e.value))}
                                invalid={display && accountType === ''}
                            />
                            {display && !accountType ? <span className='error_msg_lbl'>Enter Account Type </span> : null}
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='firstName'>
                                <span className='text-danger'>*</span>First Name
                            </Label>
                            <Input type='text' placeholder='Enter First Name' name='firstName' id='firstName' value={firstName} onChange={e => setFirstName(e.target.value)} invalid={display && firstName === ''} />
                            {display && !firstName ? <span className='error_msg_lbl'>Enter First Name </span> : null}
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='midName'>Middle Name</Label>
                            <Input type='text' placeholder='Enter Middle Name' name='midName' id='midName' value={midName} onChange={e => setMidName(e.target.value)} />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='lastName'>Last Name</Label>
                            <Input type='text' placeholder='Enter Last Name' name='lastName' id='lastName' value={lastName} onChange={e => setLastName(e.target.value)} />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='prefName'>Preferred Name</Label>
                            <Input type='text' placeholder='Enter Name' name='prefName' id='prefName' value={prefName} onChange={e => setPrefName(e.target.value)} />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='gender'>Gender<span className='text-danger'>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select w-100'
                                classNamePrefix='select'
                                defaultValue={genderOptions[0]}
                                options={genderOptions}
                                isClearable={false}
                                aria-readonly
                                value={genderOptions.filter(c => c.value === gender)}
                                onChange={e => setGender(e.value)}
                            />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='aadhaar'>
                                <span className='text-danger'>*</span>Aadhaar Number
                            </Label>
                            <Input type='number'
                                // maxLength={12}
                                // pattern="\d{12}"
                                onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                                }}
                                placeholder='Enter Aadhaar Num' name='aadhaar' id='aadhaar' value={aadhaar} onChange={e => setAadhaar(e.target.value)} invalid={display && aadhaar === ''} />
                            {display && !aadhaar ? <span className='error_msg_lbl'>Enter Aadhaar Number </span> : null}
                            {/* {display && aadhaar && aadhaar.length != 12 ? <span className='error_msg_lbl'>Enter Valid Aadhaar Number </span> : null} */}
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label'>Date of Birth</Label>
                            <InputGroup className='input-group-merge'>
                                <Flatpickr className='form-control' value={picker} onChange={date => {
                                    setPicker(date)
                                    ageCalculator(date)
                                }} id='startDate'
                                />
                            </InputGroup>
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='age'>Age</Label>
                            <Input type='number' disabled placeholder='Enter Age' name='age' id='age' value={age} />
                        </Col>
                        <h3>Address Details</h3>
                        <Col lg='12' className='mb-2'>
                            <Label className='form-label' for='address'>Address</Label>
                            <Input type='textarea' placeholder='Enter Address' name='address' id='address' value={address} onChange={e => setAddress(e.target.value)} />
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='mobile'>
                                <span className='text-danger'>*</span>Mobile Number
                            </Label>
                            <Input type='number'
                                // maxLength={10}
                                onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                                }}
                                placeholder='Enter Mobile Num' name='mobile' id='mobile' value={mobile} onChange={e => setMobile(e.target.value)} invalid={display && mobile === ''} />
                            {display && !mobile ? <span className='error_msg_lbl'>Enter Mobile Number </span> : null}
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='email'>
                                <span className='text-danger'>*</span>Email ID
                            </Label>
                            <Input type='text' placeholder='Enter Email' name='email' id='email' value={email} onChange={e => setEmail(e.target.value)} invalid={display && email === ''} />
                            {display && !email ? <span className='error_msg_lbl'>Enter Email </span> : null}
                        </Col>
                        <Col lg='6' className='mb-2'>
                            <Label className='form-label' for='gst'>GST</Label>
                            <Input type='text' name='gst' id='gst' value={gst} onChange={e => setGst(e.target.value)} />
                        </Col>
                    </Row>
                    <Row tag='form' className='gy-1 gx-2 mt-75' >
                        <Col className='text-center mt-1' xs={12}>
                            <Button className='me-1' color='primary' onClick={handleSubmit} disabled={submitDisableFlag}>
                                Submit
                            </Button>
                            <Button
                                color='secondary'
                                outline
                                onClick={() => (reset(), setOpen(!open))}
                            >
                                Cancel
                            </Button>
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
export default AccountSetupModal