import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { selectThemeColors } from '@utils'
import { useSelector } from 'react-redux'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import axios from '../../../API/axios'
import toast from 'react-hot-toast'
import DataTable from 'react-data-table-component'
import { ChevronDown, Trash2 } from 'react-feather'
import DeleteExtraServiceModal from './DeleteExtraServiceModal'
import NewAddOnServiceModal from '../../PropertyMaster/AddOnService/NewAddOnServiceModal'


const AddExtraService = ({ bookingID, roomList, handleExtraService, getBookingInfo }) => {
console.log('bookingID', bookingID);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [existingService, setExistingService] = useState([])

    const getExistService = async () => {
        try {
            const res = await axios.get('/booking/extraservice/GetByBookingId', {
                params: {
                    LoginID,
                    Token,
                    BookingID: bookingID
                }
            })
            console.log('existingService', res)
            setExistingService(res.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    const [extraServiceOptions, setExtraServiceOptions] = useState([])
    const [selService, setSelService] = useState('')
    const [selServiceObj, setSelServiceObj] = useState([])
    const [refText, setRefText] = useState('')
    const [taxAmt, setTaxAmt] = useState('')
    const [totalAmt, setTotalAmt] = useState('')

    const [newService, setNewService] = useState(false)
    const handleNewService = () => setNewService(!newService)

    const [deleteESID, setDeleteESID] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const handleDeleteModal = () => setDeleteModal(!deleteModal)

    const [submit, setSubmit] = useState(false)
    const [floorID, setFloorID] = useState('');


    const assignedRoomOptions = roomList.length > 0 && roomList[0].roomNo !== (null || '' || undefined) ? roomList.map(r => {
        return { value: r.roomAllocationID, label: `${r.roomNo} - ${r.roomType}`, floorID: r.floorID, ...r }
    }) : [{ value: 0, label: 'No rooms checked In' }]

    console.log('roomList', assignedRoomOptions);



    const [selRoom, setSelRoom] = useState('')
    const [selRoomObj, setSelRoomObj] = useState('')
    const [quantity, setQuantity] = useState('')



    useEffect(() => {
        getExistService()
    }, [handleExtraService, bookingID])

    const getExtraServiceOptions = async () => {
        try {
            const res = await axios.get(`/master/extraservice/all/Active`, {
                headers: {
                    LoginID,
                    Token,
                    Seckey: "123"
                }
            })
            console.log('servie', res)
            if (res.data[0].length > 0) {
                let result = res.data[0]
                setExtraServiceOptions(result.map(opt => {
                    return { value: opt.serviceID, label: opt.serviceName, ...opt }
                }))
            }
        } catch (error) {
            console.log('error', error)
        }
    }
console.log('selServiceObj', extraServiceOptions);
    useEffect(() => {
        getExtraServiceOptions()
    }, [newService])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmit(true)
        if (selService !== '') {
            try {
                const obj = {
                    LoginID,
                    Token,
                    Seckey: '123',
                    BookingID: bookingID,
                    ServiceID: selServiceObj.serviceID,
                    ServiceCharge: selServiceObj.serviceCharge,
                    Discount: "0",
                    DiscountType: "p",
                    TaxAmount: taxAmt,
                    Quantity: quantity,
                    TotalAmount: quantity === '' ? totalAmt : totalAmt * quantity,
                    ReferenceText: refText,
                    FloorID: selRoomObj.floorID,
                }
                console.log('refText', obj)
                const res = await axios.post('/booking/extraservice/save', obj)
                console.log('res', res)
                if (res.data[0][0].status === "Success") {
                    toast.success("Extra service is added")
                    reset()
                    getExistService()
                    getBookingInfo()
                }
            } catch (error) {
                console.log('error', error)
                toast.error("Something went wrong, Try again!")
            }
        }
    }

    const reset = () => {
        setSelService('')
        setSelServiceObj([])
        setRefText('')
        setTaxAmt('')
        setTotalAmt('')
        setSubmit(false)
    }
    console.log('reset', reset);

    const columns = [
        {
            name: 'ID',
            minWidth: '17rem',
            width: '250px',
            selector: row => row.extraServiceId ? row.extraServiceId : row.serviceId
        },
        {
            name: 'Service Name',
            minWidth: '12rem',
            selector: row => row.serviceName
        },
        {
            name: 'Service Type',
            minWidth: '10rem',
            selector: row => row.serviceType
        },
        {
            name: 'Amount',
            selector: row => row.totalAmount
        },
        {
            name: 'Reference Text',
            minWidth: '25rem',
            selector: row => row.referenceText
        }, {
            name: 'Room No',
            selector: row => row.roomNo
        },
        {
            name: 'Actions',
            selector: row => {
                console.log(row);
                return (
                    <>
                        {
                            row.extraServiceId.length > 0 && (
                                row.referenceText === 'Extend Departure' ? '' :
                                    <Trash2 color='red' size='20' onClick={() => {
                                        setDeleteESID(row.extraServiceId)
                                        handleDeleteModal()
                                    }}
                                    />
                            )
                        }

                    </>
                )
            }
        }
    ]

    return (
        <>
            {console.log('selServiceObj', selServiceObj)}
            <Form onSubmit={e => handleSubmit(e)}>

                <Row>
                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                        <Label>Room Details</Label>
                        <Select
                            isDisabled={assignedRoomOptions.length === 0}
                            placeholder='Select a Room'
                            menuPlacement='bottom'
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            options={assignedRoomOptions}
                            value={assignedRoomOptions.filter(c => c.roomAllocationID === selRoom)}
                            onChange={c => {
                                setSelRoom(c.value)
                                setSelRoomObj(c)
                                setFloorID(c.floorID);
                            }}
                        />
                        {/* <p>Selected Room's Floor ID: {floorID}</p> */}
                    </Col>
                </Row>
                <Row>
                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                        <Label>Extra Service Name</Label>
                        <CreatableSelect
                            aria-readonly
                            theme={selectThemeColors}
                            className='react-select w-100'
                            classNamePrefix='select'
                            placeholder='Select a Service'
                            options={extraServiceOptions}
                            value={extraServiceOptions?.filter(c => c.value === selService)}
                            onChange={e => {
                                console.log('eeeeee111', e)
                                setSelService(e.value)
                                setSelServiceObj(e)
                                setTaxAmt((e.serviceTax / 100) * e.serviceCharge)
                                setTotalAmt(e.serviceCharge + ((e.serviceTax / 100) * e.serviceCharge))
                            }}
                            onCreateOption={handleNewService}
                        />
                    </Col>

                    <Col lg='4' md='12 mb-1' sm='12 mb-1' className='d-flex flex-row'>
                        <div className='me-1'>
                            <Label>Tax Name(if Any)</Label>
                            <Input
                                disabled
                                type='text'
                                name='tax name'
                                placeholder='Tax Name(if Any)'
                                value={selServiceObj?.taxName ? selServiceObj.taxName : ''}
                            />
                        </div>
                        <div>
                            <Label>Tax Percentage</Label>
                            <Input
                                disabled
                                type='text'
                                name='tax name'
                                placeholder='Tax Name(if Any)'
                                value={selServiceObj?.serviceTax ? `${selServiceObj.someerviceTax}%` : ''}
                            />
                        </div>
                    </Col>
                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                        <Label>Reference text</Label>
                        <Input
                            type='text'
                            name='ref text'
                            placeholder='Reference Text'
                            value={refText}
                            onChange={e => setRefText(e.target.value)}
                        // invalid={submit && refText === ''}
                        />
                        {/* {submit && refText === '' && <FormFeedback>Reference text is required</FormFeedback>} */}
                    </Col>
                </Row>
                <Row>
                    <Col lg='4' md='12 mb-1' sm='12 mb-1'>
                        <Label>Amount Without Tax</Label>
                        <Input
                            disabled
                            type='text'
                            name='tax amount'
                            placeholder='Amount without tax'
                            value={selServiceObj?.serviceCharge ? selServiceObj.serviceCharge : ''}
                        />
                    </Col>
                    <Col lg='4' md='12 mb-1' sm='12 mb-1' className='d-flex flex-row'>
                        <div className='w-50 me-1'>
                            <Label>Tax(if Any)</Label>
                            <Input
                                disabled
                                type='text'
                                name='tax amount'
                                placeholder='Tax Amount(if Any)'
                                value={taxAmt}
                            />
                        </div>
                        <div className='w-50 me-1'>
                            <Label>Quantity</Label>
                            <Input
                                // disabled
                                type='text'
                                name='tax amount'
                                // placeholder='Q'
                                value={quantity}
                                onChange={e => {
                                    setQuantity(e.target.value)

                                }}
                            />
                        </div>
                        <div className='w-50'>
                            <Label>Total Amount</Label>
                            <Input
                                disabled
                                type='number'
                                name='tax amount'
                                placeholder='Tax Amount(if Any)'
                                value={quantity === '' ? totalAmt : totalAmt * quantity}
                            />
                        </div>
                    </Col>
                    <Col lg='4' md='12' sm='12 text-center' className='mt-lg-2'>
                        <Button color='primary' type='submit'> Add Extra Service</Button>
                        <Button color='warning' className='ms-1' onClick={reset}>Cancel</Button>
                    </Col>
                </Row>
            </Form>
            {
                existingService.length > 0 && (
                    <DataTable
                        noHeader
                        data={existingService}
                        columns={columns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        pagination
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                )
            }
            {
                deleteModal && (
                    <DeleteExtraServiceModal
                        open={deleteModal}
                        LoginID={LoginID}
                        Token={Token}
                        handleDeleteModal={handleDeleteModal}
                        deleteESID={deleteESID}
                        getExistService={getExistService}
                        handleExtraService={handleExtraService}
                    />
                )
            }
            {newService && <NewAddOnServiceModal show={newService} handleModal={handleNewService} />}
        </>
    )
}

export default AddExtraService