import { useState, useEffect } from "react"
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import axios from "../../API/axios"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const NewBookingSrcTypeModal = ({ openModal, handleOpenModal, bookSrcOpt }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [submit, setSubmit] = useState(false)
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [otaList, setOtaList] = useState([])

    const getOtaList = async () => {
        try {
            const res = await axios.get(`/ota`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('otares', res)
            if (res?.data[0]?.length > 0) {
                let arr = res?.data[0].map(o => {
                    return { value: o.otaCode, label: `${o.OTA} - ${o.otaCode}` }
                })
                setOtaList(arr)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getOtaList()
    }, [])

    const handleSubmit = async () => {
        setSubmit(true)
        if (name && code !== '') {
            try {
                let obj = {
                    LoginID,
                    Token,
                    Seckey: "abc",
                    BookingSourceID: "BSID20230302AA00010",
                    Event: "insert",
                    SourceType: name,
                    Code: code
                }
                const res = await axios.post(`/getdata/bookingdata/sourcetype`, obj)
                console.log('res', res);
                if (res?.data[0][0].status === "Success") {
                    toast.success(res.data[0][0].message)
                    handleOpenModal()
                    setSubmit(false)
                }
            } catch (error) {
                console.log('error', error)
                toast.error('Something went wrong, Try again!')
            }
        } else {
            toast.error('Fill all fields!')
        }
    }

    return (
        <Modal
            isOpen={openModal}
            toggle={() => handleOpenModal()}
            className='modal-dialog-centered modal-md'
        >
            <ModalHeader toggle={() => handleOpenModal()}>Create New Booking Source Type</ModalHeader>
            <ModalBody>
                <Form>
                    <Row>
                        <Col>
                            <Label className='form-label' for='booking_source'>
                                Booking Source:
                            </Label>
                            {console.log('bookSrcOpt', bookSrcOpt)}
                            <Select
                                placeholder=''
                                menuPlacement='auto'
                                aria-readonly
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                value={bookSrcOpt?.filter(c => c.value === "BSID20230302AA00010")}
                                isDisabled
                                options={bookSrcOpt}
                            // onChange={val => {
                            //     setBookSrcId(val.value)
                            // }}
                            />
                        </Col>
                        <Col>
                            <Label className='form-label'>Name</Label>
                            <Input
                                type='text'
                                name='name'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                invalid={submit && name.trim() === ''}
                            />
                            {submit && !name.trim() && <FormFeedback>Name is required!</FormFeedback>}
                        </Col>
                        <Col>
                            <Label className='form-label'>Code</Label>
                            <Select
                                placeholder='Select OTA code'
                                menuPlacement='bottom'
                                aria-readonly
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                options={otaList}
                                value={otaList?.filter(c => c.value === code)}
                                onChange={val => {
                                    setCode(val.value)
                                }}
                            />
                            {submit && !code.trim() && <FormFeedback>Code is required!</FormFeedback>}
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Col className='text-center'>
                    <Button className='mx-1' color='primary' onClick={() => handleSubmit()}>Submit</Button>
                    <Button className='mx-1' color='secondary' onClick={() => handleOpenModal()} outline>Cancel</Button>
                </Col>
            </ModalFooter>
        </Modal>
    )
}

export default NewBookingSrcTypeModal