import React, { useState } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Image_base_uri } from '../../API/axios'

const tableOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const NewPOSModal = ({ open, handleOpen, handleRefresh }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData

    const [submit, setSumbit] = useState(false)
    const [posname, setPosname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [poslogo, setPoslogo] = useState('')
    const [displayLogo, setDisplayLogo] = useState('')
    const [panno, setPanno] = useState('')
    const [cinno, setCinno] = useState('')
    const [fssai, setFssai] = useState('')
    const [posgst, setPosgst] = useState('')
    const [posgstpercent, setPosgstpercent] = useState('')
    const [address, setAddress] = useState('')
    const [descp, setDescp] = useState('')
    const [tables, setTables] = useState('')

    const reset = (e) => {
        // e.preventDefault()
        setPosname('')
        setEmail('')
        setPhone('')
        setPoslogo('')
        setPanno('')
        setCinno('')
        setFssai('')
        setPosgst('')
        setPosgstpercent('')
        setAddress('')
        setDescp('')
        setTables('')
        setSumbit(false)
        handleOpen()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSumbit(true)
        if (posname && tables && poslogo !== '') {
            let newPosData = new FormData()
            newPosData.append('Name', posname)
            newPosData.append('LogoFile', poslogo)
            newPosData.append('EmailID', email)
            newPosData.append('PhoneNumber', phone)
            newPosData.append('HasTables', tables)
            newPosData.append('PANNo', panno)
            newPosData.append('CINNo', cinno)
            newPosData.append('FSSAINo', fssai)
            newPosData.append('GSTNo', posgst)
            newPosData.append('GSTRate', posgstpercent === '' ? 0 : posgstpercent)
            newPosData.append('Address', address)
            newPosData.append('Description', descp)
            newPosData.append('PropertyID', PropertyID)
            newPosData.append('CompanyID', CompanyID)
            newPosData.append('HotelName', HotelName)

            console.log('CompanyID', CompanyID)
            console.log('HotelName', HotelName)

            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    url: "/api/pos/post",
                    // url: "/api/pos/logo_upload",
                    data: newPosData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        LoginID,
                        Token
                    },
                })
                console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success('POS Created')
                    setSumbit(false)
                    handleOpen()
                    reset()
                    handleRefresh()
                }
            } catch (error) {
                console.log('error', error)
                handleRefresh()
                toast.error("Something went wrong, Try again!")
            }

        } else {
            toast.error("Fill all required Fields")
        }
        console.log(tables)
    }

    const documentUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDisplayLogo(URL.createObjectURL(e.target.files[0]))
            setPoslogo(e.target.files[0])
            // console.log('posBlob', poslogo)
        }
    }

    return (
        <>
            <Modal isOpen={open}
                toggle={handleOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader toggle={handleOpen}>
                    Create New POS
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => handleSubmit(e)} onReset={reset}>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Name<span className='text-danger'>*</span></Label>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='POS name'
                                    value={posname}
                                    onChange={e => setPosname(e.target.value)}
                                    invalid={submit && posname === ''}
                                />
                                {submit && posname === '' && <FormFeedback>POS Name is required</FormFeedback>}
                            </Col>
                            <Col>
                                <Label>Tables<span className='text-danger'>*</span></Label>
                                <Col className='d-flex flex-row'>
                                    <Select
                                        placeholder=''
                                        menuPlacement='auto'
                                        aria-readonly
                                        theme={selectThemeColors}
                                        className='react-select w-100'
                                        classNamePrefix='select'
                                        options={tableOptions}
                                        value={tableOptions.filter(c => c.value === tables)}
                                        onChange={e => setTables(e.value)}
                                    />
                                </Col>
                                {submit && tables === '' && <Label className='text-danger'>Select an option for Tables</Label>}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Logo<span className='text-danger'>*</span></Label>
                                <Input
                                    type='file'
                                    name='file'
                                    placeholder='POS logo'
                                    accept='image/jpg, image/jpeg, image/webp, image/png'
                                    onChange={e => documentUpload(e)}
                                />
                                {submit && poslogo === '' && <Label className='text-danger'>Select Logo for POS </Label>}
                            </Col>
                            {
                                displayLogo && (
                                    <Col className='text-center'>
                                        <img src={displayLogo} alt='logo' width={100} height={100} />
                                    </Col>
                                )
                            }
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>Email Id</Label>
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='Email Id'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                // invalid={submit && email === ''}
                                />
                                {/* {submit && email === '' && <FormFeedback>Email is required</FormFeedback>} */}
                            </Col>
                            <Col>
                                <Label>Phone No</Label>
                                <Input
                                    type='phone'
                                    name='phone'
                                    minLength={10}
                                    maxLength={10}
                                    placeholder='Phone No'
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                // invalid={submit && phone === ''}
                                />
                                {/* {submit && phone === '' && phone.length >= 10 && <FormFeedback>Phone No. is required</FormFeedback>} */}
                            </Col>
                        </Row>
                        <Row className='mb-1'>
                            <Col>
                                <Label>PAN No</Label>
                                <Input
                                    type='text'
                                    name='pan'
                                    placeholder='PAN No'
                                    value={panno}
                                    onChange={e => setPanno(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>CIN No</Label>
                                <Input
                                    type='text'
                                    name='cin'
                                    placeholder='CIN No'
                                    value={cinno}
                                    onChange={e => setCinno(e.target.value)}
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
                                    value={fssai}
                                    onChange={e => setFssai(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>GST No</Label>
                                <Input
                                    type='text'
                                    name='gst'
                                    placeholder='GST No'
                                    value={posgst}
                                    onChange={e => setPosgst(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>GST %</Label>
                                <Input
                                    type='text'
                                    name='gstpercent'
                                    placeholder='GST %'
                                    value={posgstpercent}
                                    onChange={e => setPosgstpercent(e.target.value)}
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
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Label>Description</Label>
                                <Input
                                    type='textarea'
                                    name='descp'
                                    placeholder='Enter Description'
                                    value={descp}
                                    onChange={e => setDescp(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='my-1'>
                            <Col className='text-center'>
                                <Button color='primary' type='submit' className='m-1'>Create POS</Button>
                                <Button type='reset' className='m-1' outline>Cancel</Button>
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

export default NewPOSModal