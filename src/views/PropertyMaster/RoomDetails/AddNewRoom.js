import { useState } from "react"
import Select from 'react-select'
import toast from "react-hot-toast"
import { selectThemeColors } from '@utils'
import { Button, Col, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap"
import axios from '../../../API/axios'
import { useSelector } from "react-redux"

const roomSize = [
    { value: 'sq ft', label: 'sq ft' },
    { value: 'sq m', label: 'sq m' }
]

const AddNewRoom = ({ open, handleNewRoom, roomDetailsList, roomTypeDropDownOptions, bedTypeDropDownOptions, extraBedTypeDropDownOptions, roomViewOptions, statusOptions, dropdownLoader, handleRoomType, setRoomTypeID, RoomTypeID, handleBedType, setBedTypeID, BedTypeID, handleExtraBedType, setExtraBedTypeID, ExtraBedTypeID, handleRoomView, setRoomViewID, RoomViewID, handleRoomStatus, setRoomStatusID, RoomStatusID }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token, PropertyID } = getUserData
    // const [RoomTypeID, setRoomTypeID] = useState("")
    const [RoomDisplayName, SetRoomDisplayName] = useState("")
    // const [BedTypeID, setBedTypeID] = useState("")
    // const [RoomViewID, setRoomViewID] = useState("")
    // const [ExtraBedTypeID, setExtraBedTypeID] = useState("")
    const [RoomRate, setRoomRate] = useState("")
    const [cgst, setCgst] = useState('')
    const [sgst, setSgst] = useState('')
    const [igst, setIgst] = useState('')
    const [submit, setSubmit] = useState(false)
    const [roomSizeInput, setRoomSizeInput] = useState('')
    const [roomSizeSelect, setRoomSizeSelect] = useState('')
    const [AdultBase, setAdultBase] = useState('')
    const [ChildBase, setChildBase] = useState('')
    const [AdultMax, setAdultMax] = useState('')
    const [ChildMax, setChildMax] = useState('')
    const [InfantMax, setInfantMax] = useState('')
    const [GuestMax, setGuestMax] = useState('')
    const [ExtraAdultPrice, setExtraAdultPrice] = useState('')
    const [ExtraChildPrice, setExtraChildPrice] = useState('')
    // const [RoomStatusID, setRoomStatusID] = useState('')

    // const userId = localStorage.getItem('user-id')

    // let gstRate = 0
    // if (RoomRate >= 0 && parseFloat(RoomRate).toFixed(2) <= 999) {
    //     gstRate = 0
    // } else if (parseFloat(RoomRate).toFixed(2) >= 1000 && parseFloat(RoomRate).toFixed(2) <= 7499) {
    //     gstRate = 12
    // } else if (parseFloat(RoomRate).toFixed(2) >= 7500) {
    //     gstRate = 18
    // }
    // let totalAmount = 0
    // const halfGst = gstRate / 2
    // console.log("halfgst:  ", halfGst)

    // let totalTax = ((gstRate / 100) * parseInt(RoomRate))
    // totalTax = isFinite(totalTax) ? totalTax : 0
    // console.log("room tax: ", RoomRate)
    // totalAmount = totalTax > 0 ? (totalTax + Number(RoomRate)) : Number(RoomRate)
    // console.log("total amount: ", totalAmount)

    const RoomSize = roomSizeInput.concat(` ${roomSizeSelect}`)

    const reset = () => {
        setRoomTypeID('')
        SetRoomDisplayName('')
        setBedTypeID('')
        setRoomViewID('')
        setExtraBedTypeID('')
        setRoomRate('')
        setCgst('')
        setSgst('')
        setIgst('')
        setRoomSizeInput('')
        setRoomSizeSelect('')
        setAdultBase('')
        setChildBase('')
        setAdultMax('')
        setChildMax('')
        setInfantMax('')
        setGuestMax('')
        setExtraAdultPrice('')
        setExtraChildPrice('')
        setRoomStatusID('')
        // setSubmit(false)
    }

    const roomDetailsInsert = () => {

        const roomDetailsInsertBody = {
            LoginID,
            Token,
            Seckey: "abc",
            Event: "insert",
            RoomTypeID,
            RoomViewID,
            BedTypeID,
            ExtraBedTypeID,
            Amenities: "AC, Bathtub",
            Location: null,
            RoomRate: RoomRate,
            CGST_P: cgst,
            SGST_P: sgst,
            IGST_P: igst,
            // TotalTax: totalTax,
            // TotalAmount: totalAmount,
            RoomDesc: "abc",
            RoomDisplayName,
            RoomSize,
            AdultBase,
            AdultMax,
            InfantMax,
            ChildBase,
            ChildMax,
            GuestMax,
            ExtraAdultPrice,
            ExtraChildPrice,
            Status: RoomStatusID,
            CompanyID: "COM001",
            PropertyID
        }

        // if (cgst &&
        //     sgst &&
        //     igst &&
        //     RoomTypeID &&
        //     RoomViewID &&
        //     BedTypeID &&
        //     RoomDisplayName &&
        //     AdultBase &&
        //     ChildBase &&
        //     GuestMax &&
        //     ExtraBedTypeID &&
        //     RoomStatusID === '') {
        try {
            console.log("room obj adata: ", roomDetailsInsertBody)
            axios.post(`/getdata/bookingdata/roomdetails`, roomDetailsInsertBody)
                .then((res) => {
                    console.log('res', res)
                    if (res.status === 200) {
                        roomDetailsList()
                    } else {
                        toast.error("Something went wrong, try again!")
                    }
                }).catch(function (error) {
                    console.log(error)
                    toast.error(error.message)
                })
        } catch (error) {
            console.log("Room Details Error", error.message)
        }
        // } else {
        //     toast.error("Fill all Fields")
        // }
    }

    const handleAddRoom = () => {
        setSubmit(true)
        if (RoomTypeID && RoomDisplayName.trim() && BedTypeID && RoomViewID && AdultBase && ChildBase && roomSizeInput !== '') {
            roomDetailsInsert()
            handleNewRoom()
            toast.success("New Room Details Added", { position: 'top-center' })
            // setSubmit(false)
            reset()
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => {
                    handleNewRoom()
                }}>
                    Room Details
                </ModalHeader>
                {
                    !dropdownLoader ? (
                        <>
                            <ModalBody className='px-sm-2 mx-50 pb-5'>
                                {
                                    // !(roomTypeDropDown && bedTypeDropDown && extraBedTypeDropDown && roomViewsList) ? (
                                    //     <span color="danger">Error fetching dropdown data</span>
                                    // ) : <></>
                                }
                                <Row>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Category<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={roomTypeDropDownOptions}
                                            value={roomTypeDropDownOptions?.filter(c => c.value === RoomTypeID)}
                                            onChange={data => {
                                                handleRoomType(data.value)
                                            }}
                                            invalid={submit && RoomTypeID === ''}
                                        />
                                        {submit && RoomTypeID === "" && <p className='text-danger'>Room Category is required</p>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Display Name<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='text'
                                            placeholder='Display Name goes here'
                                            value={RoomDisplayName}
                                            onChange={e => SetRoomDisplayName(e.target.value)}
                                            invalid={submit && RoomDisplayName.trim() === ''}
                                        />
                                        {submit && RoomDisplayName.trim() === '' && <FormFeedback>Display Name is required</FormFeedback>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Bed Type<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={bedTypeDropDownOptions}
                                            value={bedTypeDropDownOptions?.filter(c => c.value === BedTypeID)}
                                            onChange={e => {
                                                handleBedType(e.value)
                                            }}
                                            invalid={submit && BedTypeID === ''}
                                        />
                                        {submit && BedTypeID === '' && <p className='text-danger'>Bed Type is required</p>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Extra Bed Type<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={extraBedTypeDropDownOptions}
                                            value={extraBedTypeDropDownOptions?.filter(c => c.value === ExtraBedTypeID)}
                                            onChange={e => {
                                                handleExtraBedType(e.value)
                                            }}
                                            invalid={submit && ExtraBedTypeID === ''}
                                        />
                                        {submit && ExtraBedTypeID === '' && <p className='text-danger'>Extra Bed Type is required</p>}
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room view<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={roomViewOptions}
                                            value={roomViewOptions?.filter(c => c.value === RoomViewID)}
                                            onChange={e => {
                                                handleRoomView(e.value)
                                            }}
                                            invalid={submit && RoomViewID === ''}
                                        />
                                        {submit && RoomViewID === '' && <p className='text-danger'>Room View is required</p>}
                                    </Col>
                                    <Col lg='6' className="mb-md-1">
                                        <Label className='form-label'>Room Rate</Label>
                                        <Input
                                            type='number'
                                            disabled={true}
                                            placeholder='Enter Room Rate'
                                            value={RoomRate}
                                            onChange={e => {
                                                e.target.value <= 0 ? setRoomRate('') : setRoomRate(e.target.value)
                                            }}
                                        // invalid={submit && RoomRate.trim() === ''}
                                        />
                                        {/* {submit && RoomRate.trim() === '' && <FormFeedback>Room Rate is required</FormFeedback>} */}
                                    </Col>
                                    <Col lg="12" className="d-flex flex-row justify-content-between align-items-center">
                                        <div>
                                            <Label className='form-label' for="cgst">CGST(%)<span className='text-danger'>*</span></Label>
                                            <Input
                                                name="cgst"
                                                type="number"
                                                value={cgst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setCgst('') : setCgst(e.target.value)
                                                }}
                                                invalid={submit && cgst === ''}
                                            />
                                            {submit && cgst === '' && <p className='text-danger'>CGST is required</p>}
                                        </div>
                                        <div>
                                            <Label className='form-label' for="sgst">SGST(%)<span className='text-danger'>*</span></Label>
                                            <Input
                                                name="sgst"
                                                type="number"
                                                value={sgst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setSgst('') : setSgst(e.target.value)
                                                }}
                                                invalid={submit && sgst === ''}
                                            />
                                            {submit && sgst === '' && <p className='text-danger'>SGST is required</p>}
                                        </div>
                                        <div>
                                            <Label className='form-label' for="igst">IGST(%)<span className='text-danger'>*</span></Label>
                                            <Input
                                                name="igst"
                                                type="number"
                                                value={igst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setIgst('') : setIgst(e.target.value)
                                                }}
                                                invalid={submit && igst === ''}
                                            />
                                            {submit && igst === '' && <p className='text-danger'>IGST is required</p>}
                                        </div>
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ExtraAdultPrice'>Extra Adult Price</Label>
                                        <Input type='text' name='ExtraAdultPrice' id='ExtraAdultPrice' value={ExtraAdultPrice} disabled='true'
                                            onChange={e => {
                                                e.target.value < 0 ? setExtraAdultPrice('') : setExtraAdultPrice(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ExtraChildPrice'>Extra Child Price</Label>
                                        <Input type='text' name='ExtraChildPrice' id='ExtraChildPrice' value={ExtraChildPrice} disabled='true'
                                            onChange={e => {
                                                e.target.value < 0 ? setExtraChildPrice('') : setExtraChildPrice(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Size<span className='text-danger'>*</span></Label>
                                        <div className='d-flex'>
                                            <div>
                                                <Input type='number' placeholder='Enter size' className='me-2' value={roomSizeInput}
                                                    onChange={e => {
                                                        e.target.value <= 0 ? setRoomSizeInput('') : setRoomSizeInput(e.target.value)
                                                    }} invalid={submit && roomSizeInput === ''} />
                                                {submit && roomSizeInput === '' && <FormFeedback>Room Size is required</FormFeedback>}
                                            </div>
                                            <Select
                                                theme={selectThemeColors}
                                                className='react-select w-100'
                                                classNamePrefix='select'
                                                aria-readonly
                                                // defaultValue={roomSize[0]}
                                                options={roomSize}
                                                isClearable={false}
                                                value={roomSize?.filter(c => c.value === roomSizeSelect)}
                                                onChange={e => setRoomSizeSelect(e.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg='6' className="mb-2">
                                        <Label className='form-label'>Room Status<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            placeholder='Select Room status'
                                            aria-readonly
                                            options={statusOptions}
                                            value={statusOptions?.filter(c => c.value === RoomStatusID)}
                                            onChange={e => {
                                                handleRoomStatus(e.value)
                                            }}
                                        />
                                        {submit && RoomStatusID === '' && <span className='text-danger'>Room Status is required</span>}
                                    </Col>
                                    <h2 className=' mb-1'>Room Occupancy</h2>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='AdultBase'>Adults (Base)<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='number'
                                            name='AdultBase'
                                            d='AdultBase'
                                            value={AdultBase}
                                            onChange={e => {
                                                e.target.value <= 0 ? setAdultBase('') : setAdultBase(e.target.value)
                                            }}
                                            invalid={submit && AdultBase === ''}
                                        />
                                        {submit && AdultBase === '' && <span className='text-danger'>Number for Adult Base is required</span>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ChildBase'>Child (Base)<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='number'
                                            name='ChildBase'
                                            id='ChildBase'
                                            value={ChildBase}
                                            onChange={e => {
                                                e.target.value < 0 ? setChildBase('') : setChildBase(e.target.value)
                                            }}
                                            invalid={submit && ChildBase === ''}
                                        />
                                        {submit && ChildBase === '' && <span className='text-danger'>Number for Child Base is required</span>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='AdultMax'>Adults (Max)</Label>
                                        <Input type='text' name='AdultMax' id='AdultMax' value={AdultMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setAdultMax('') : setAdultMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ChildMax'>Child (Max)</Label>
                                        <Input type='text' name='ChildMax' id='ChildMax' value={ChildMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setChildMax('') : setChildMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='InfantMax'>Infant (Max)</Label>
                                        <Input type='text' name='InfantMax' id='InfantMax' value={InfantMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setInfantMax('') : setInfantMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='GuestMax'>Guest(Max)<span className='text-danger'>*Should always be greater than Adult(Max)</span></Label>
                                        <Input
                                            type='text'
                                            name='GuestMax'
                                            id='GuestMax'
                                            value={GuestMax}
                                            onChange={e => {
                                                e.target.value <= 0 ? setGuestMax('') : setGuestMax(e.target.value)
                                            }}
                                            invalid={submit && GuestMax === ''}
                                        />
                                        {submit && GuestMax === '' && <span className='text-danger'>Number for Guest Max is required</span>}
                                    </Col>
                                </Row>
                                <Row tag='form' className='gy-1 gx-2 mt-75' >
                                    <Col className='text-center mt-1' xs={12}>
                                        <Button className='me-1' color='primary' onClick={handleAddRoom}>
                                            Submit
                                        </Button>
                                        <Button
                                            color='secondary'
                                            outline
                                            onClick={() => {
                                                handleNewRoom()
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </>
                    ) : (

                        <div style={{ height: '150px' }}>
                            <Spinner color="primary" style={{ marginTop: '50px', marginLeft: '50%' }} />
                        </div>
                    )

                }

            </Modal>
        </>
    )
}

export default AddNewRoom