import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Token } from 'prismjs'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import toast from 'react-hot-toast'
import { Image_base_uri } from '../../API/axios'
const tableOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const statusOptions = [
    { value: "Active", label: 'ACTIVE' },
    { value: "Inactive", label: 'INACTIVE' }
]

const UpdatePosModal = ({ updateOpen, handleUpdateOpen, posID, handleRefresh }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID, HotelName,PropertyID } = getUserData
    console.log('posID in update modal', posID);
    // const [data, setData] = useState([])
    const [submit, setSumbit] = useState(false)
    const [newPosname, setNewPosname] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newPoslogo, setNewPoslogo] = useState('')
    const [newPtypeoff, setNewPtypeoff] = useState('')
    const [newPanno, setNewPanno] = useState('')
    const [newCinno, setNewCinno] = useState('')
    const [newFssai, setNewFssai] = useState('')
    const [newPosgst, setNewPosgst] = useState('')
    const [newPosgstpercent, setNewPosgstpercent] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const [newDescp, setNewDescp] = useState('')
    const [newTables, setNewTables] = useState('')
    const [newStatus, setNewStatus] = useState('')
    const [uploadedImg, setUploadedImg] = useState('')
    const [displayLogo, setDisplayLogo] = useState('')
    const [logo, setLogo] = useState('')
    console.log(logo);
    // const handleUpdate = (e) => {
    //     e.preventDefault()
    //     setSumbit(!submit)
    //     handleUpdateOpen()
    //     console.log(newTables)
    //     console.log(newStatus)
    // }

    const handleUploadedImage = (e) => {
        setUploadedImg(e.target.files[0])
        setDisplayLogo(URL.createObjectURL(e.target.files[0]))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSumbit(!submit)
        let uploadedImage
        if (uploadedImg !== '') {
            let imageformData = new FormData()
            imageformData.append('File', uploadedImg)
            imageformData.append('CompanyID', CompanyID)
            imageformData.append('HotelName', HotelName)
            console.log('imageformData', imageformData);
            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    url: "/api/pos/logo_upload",
                    data: imageformData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        LoginID,
                        Token
                    }
                })
                console.log('res', res);
                if (res.data.fileName) {
                    // setNewPoslogo(res.data.FileName)
                    handleRefresh()
                    // setUploadImgStatus(true)
                    uploadedImage = res.data.fileName
                }
            } catch (error) {
                console.log('error', error)
                // setUploadImgStatus(false)
                return 0
            }
        }
        // console.log('values', newAddress, newDescp, newTables, newStatus, newPosname, newEmail, newPhone, newPtypeoff, newPanno, newCinno, newFssai, newPosgst, newPosgstpercent,)
        // if (newAddress && newDescp && newTables && newStatus && guestEmail && guestDob && pinCode && address && countryId && stateId && cityId !== '') {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey:"abc",
                Name: newPosname,
                LogoFile: uploadedImg === '' ? logo : uploadedImage,
                EmailID: newEmail,
                PhoneNumber: newPhone,
                HasTables: newTables,
                PaymentType: newPtypeoff,
                PANNo: newPanno,
                CINNo: newCinno,
                FSSAINo: newFssai,
                GSTNo: newPosgst,
                GSTRate: newPosgstpercent,
                Address: newAddress,
                Description: newDescp,
                Status: newStatus,
                Seckey: ""
            }

            const res = await axios.post(`/pos/update?id=${posID}`, obj)
            console.log('res', res)
            if (res.data[0][0].status === "Success") {
                toast.success('POS details updated!')
                handleUpdateOpen()
                setSumbit(false)
                handleRefresh()
            } else {
                toast.error('Fill all fields')
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
        // }
    }
    const getPosData = async () => {
        try {
            // const res = await axios.get(`/pos?LoginID=${LoginID}&Token=${Token}&id=${posID}`)
            const res = await axios.get(`/pos/one?LoginID=${LoginID}&Token=${Token}&id=${posID}`)
            console.log('resget data', res?.data[0])
            // setData(res?.data[0])
            if (res?.data[0].length > 0) {
                let data = res?.data[0]
                setNewPosname(data[0].name)
                setNewEmail(data[0].emailID)
                setNewPhone(data[0].phoneNumber)
                setNewTables(data[0].hasTables)
                setNewStatus(data[0].status)
                setNewPtypeoff(data[0].paymentType)
                setNewPanno(data[0].panNo)
                setNewCinno(data[0].cinNo)
                setNewFssai(data[0].fssaiNo)
                setNewPosgst(data[0].gstNo)
                setNewPosgstpercent(data[0].gstRate)
                setNewAddress(data[0].address)
                setNewDescp(data[0].description)
                setNewPoslogo(data[0].fileURL)
                setLogo(data[0].logoFile)
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getPosData()
    }, [updateOpen])

    const documentUpload = (e) => {
        setNewPoslogo(URL.createObjectURL(e.target.files[0]))
        // console.log('posBlob', poslogo)
    }

    return (
        <>
            <Modal isOpen={updateOpen}
                toggle={handleUpdateOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader toggle={handleUpdateOpen}>
                    Update POS Info
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => handleUpdate(e)}>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='POS name'
                                    value={newPosname}
                                    onChange={e => setNewPosname(e.target.value)}
                                    invalid={submit && newPosname === ''}
                                />
                                {submit && newPosname === '' && <FormFeedback>POS Name is required</FormFeedback>}
                            </Col>
                            <Col>
                                <Label>Logo<span className='text-danger'>*</span></Label>
                                <Input
                                    type='file'
                                    name='file'
                                    placeholder='POS logo'
                                    accept='image/jpg, image/jpeg, image/webp, image/png'
                                    onChange={e => handleUploadedImage(e)}
                                    invalid={submit && newPoslogo === ''}
                                />
                                {submit && newPoslogo === '' && <FormFeedback>POS Logo is required</FormFeedback>}
                            </Col>

                        </Row>
                        <Row>
                            <Col className='text-center'>
                                {displayLogo && <Label>Old Image</Label>}
                                <img
                                    className='m-1 d-block m-auto'
                                    src={newPoslogo ? `${Image_base_uri}/${newPoslogo}` : `${Image_base_uri}/uploads/dummy.jpg`}
                                    alt='card-top'
                                    width={300}
                                    height={200}
                                />
                            </Col>
                            {displayLogo && <Col className='text-center'>
                                <Label>New Image</Label>
                                <img
                                    className='m-1'
                                    src={displayLogo}
                                    alt='card-top'
                                    width={300}
                                    height={200}
                                />
                            </Col>}
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Email Id</Label>
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='Email Id'
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    invalid={submit && newEmail === ''}
                                />
                                {submit && newEmail === '' && <FormFeedback>Email is required</FormFeedback>}
                            </Col>
                            <Col>
                                <Label>Phone No</Label>
                                <Input
                                    type='phone'
                                    name='phone'
                                    min={10}
                                    placeholder='Phone No'
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    invalid={submit && newPhone === ''}
                                />
                                {submit && newPhone === '' && newPhone.length >= 10 && <FormFeedback>Phone No. is required</FormFeedback>}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col className='d-flex flex-row'>
                                <Col>
                                    <Label>Tables<span className='text-danger'>*</span></Label>
                                    <Col className='d-flex flex-row'>
                                        <Select
                                            placeholder=''
                                            menuPlacement='auto'
                                            theme={selectThemeColors}
                                            className='react-select w-75'
                                            classNamePrefix='select'
                                            options={tableOptions}
                                            value={tableOptions?.filter(c => c.value === newTables)}
                                            onChange={e => setNewTables(e.value)}
                                        />
                                    </Col>
                                </Col>
                                <Col>
                                    <Label>Status</Label>
                                    <Col className='d-flex flex-row'>
                                        <Select
                                            placeholder=''
                                            menuPlacement='auto'
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            options={statusOptions}
                                            value={statusOptions?.filter(c => c.value === newStatus)}
                                            onChange={e => setNewStatus(e.value)}
                                        />
                                    </Col>
                                </Col>
                            </Col>
                            {/* <Col>
                                <Label>Payment Type: Complimentary (% Off)</Label>
                                <Input
                                    type='text'
                                    name='ptype'
                                    placeholder='Complimentary (% Off)'
                                    value={newPtypeoff}
                                    onChange={e => setNewPtypeoff(e.target.value)}
                                />
                            </Col> */}
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>PAN No</Label>
                                <Input
                                    type='text'
                                    name='pan'
                                    placeholder='PAN No'
                                    value={newPanno}
                                    onChange={e => setNewPanno(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>CIN No</Label>
                                <Input
                                    type='text'
                                    name='cin'
                                    placeholder='CIN No'
                                    value={newCinno}
                                    onChange={e => setNewCinno(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>FSSAI No</Label>
                                <Input
                                    type='text'
                                    name='fssai'
                                    placeholder='FSSAI No'
                                    value={newFssai}
                                    onChange={e => setNewFssai(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>GST No</Label>
                                <Input
                                    type='text'
                                    name='gst'
                                    placeholder='GST No'
                                    value={newPosgst}
                                    onChange={e => setNewPosgst(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>GST %</Label>
                                <Input
                                    type='text'
                                    name='gstpercent'
                                    placeholder='GST No'
                                    value={newPosgstpercent}
                                    onChange={e => setNewPosgstpercent(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Address</Label>
                                <Input
                                    type='textarea'
                                    name='address'
                                    placeholder='POS Address'
                                    value={newAddress}
                                    onChange={e => setNewAddress(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='textarea'
                                    name='descp'
                                    placeholder='Enter Description'
                                    value={newDescp}
                                    onChange={e => setNewDescp(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='my-1'>
                            <Col className='text-center'>
                                <Button color='primary' type='submit'>Update POS Info</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            {
                updateOpen ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default UpdatePosModal