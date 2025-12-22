import React, { useState } from 'react'
import Select from 'react-select'
import toast from "react-hot-toast"
import { selectThemeColors } from '@utils'
import { Button, Col, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'

const roomSize = [
    { value: 'sqft', label: 'sq ft' },
    { value: 'sqm', label: 'sq m' }
]

const UpdateRoom = ({
    open,
    handleUpdate,
    roomTypes,
    id,
    roomDetailsList,
    roomTypeDropDownOptions,
    bedTypeDropDownOptions,
    extraBedTypeDropDownOptions,
    roomViewOptions,
    statusOptions,
    dropdownLoader,
    handleRoomType,
    // editRoomTypeID, 
    handleBedType,
    // editBedTypeID, 
    handleExtraBedType,
    // editExtraBedTypeID, 
    handleRoomView,
    // editRoomViewID, 
    handleRoomStatus
}) => {
console.log('roomTypes in update',     extraBedTypeDropDownOptions)
    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token, PropertyID } = getUserData

    console.log('roomViewOptions', roomViewOptions)
    const data = roomTypes?.filter(roomDetail => roomDetail.roomID === id)
    console.log('dataroom', data)
    const [roomDesc] = useState(data[0]?.roomDesc)

    const [editRoomTypeID, setEditRoomTypeID] = useState(data[0]?.roomTypeID)
    const [editRoomDisplayName, SetEditRoomDisplayName] = useState(data[0]?.roomDisplayName)
    const [editBedTypeID, setEditBedTypeID] = useState(data[0].bedTypeID)
    const [editRoomViewID, setEditRoomViewID] = useState(data[0]?.roomViewID)
    const [editExtraBedTypeID, setEditExtraBedTypeID] = useState(data[0]?.extraBedTypeID)
    const [editRoomRate, setEditRoomRate] = useState(data[0]?.roomRate)
    const [editCgst, setEditCgst] = useState(data[0]?.cgsT_P)
    const [editSgst, setEditSgst] = useState(data[0]?.sgsT_P)
    const [editIgst, setEditIgst] = useState(data[0]?.igsT_P)
    const [editSubmit, setEditSubmit] = useState(false)
    const sizeArray = data[0]?.roomSize ? data[0]?.roomSize.split(" ") : ''
    const [editRoomSizeInput, setEditRoomSizeInput] = useState(sizeArray[0])
    const [editRoomSizeSelect, setEditRoomSizeSelect] = useState(sizeArray.length > 1 ? sizeArray[1] : "")
    const [editAdultBase, setEditAdultBase] = useState(data[0]?.adultBase)
    const [editChildBase, setEditChildBase] = useState(data[0]?.childBase)
    const [editAdultMax, setEditAdultMax] = useState(data[0]?.adultMax)
    const [editChildMax, setEditChildMax] = useState(data[0]?.childMax)
    const [editInfantMax, setEditInfantMax] = useState(data[0]?.infantMax)
    const [editGuestMax, setEditGuestMax] = useState(data[0]?.guestMax)
    const [editExtraAdultPrice, setEditExtraAdultPrice] = useState(data[0]?.extraAdultPrice)
    const [editExtraChildPrice, setEditExtraChildPrice] = useState(data[0]?.extraChildPrice)
    const [editTotalAmount, setEditTotalAmount] = useState(data[0]?.totalAmount)
    const [editRoomStatus, setEditRoomStatus] = useState(data[0]?.status)

    // const userId = localStorage.getItem('user-id')

    // let gstRate = 0
    // if (editRoomRate >= 0 && editRoomRate <= 999) {
    //     gstRate = 0
    // } else if (editRoomRate >= 1000 && editRoomRate <= 7499) {
    //     gstRate = 12
    // } else if (editRoomRate >= 7500) {
    //     gstRate = 18
    // }

    // const halfGst = gstRate / 2


    // const editTotalTax = editRoomRate * gstRate / 100

    // const editTotalAmount = +editTotalTax + +editRoomRate

    // const RoomSize = roomSizeInput.concat(`!@$${roomSizeSelect}`)

    const editRoomDetails = async () => {
        const editRoomSize = editRoomSizeInput?.concat(` ${editRoomSizeSelect}`)
        const editRoomDetailsBody = {
            LoginID,
            Token,
            Seckey: "abc",
            Event: "update",
            RoomID: id,
            RoomTypeID: editRoomTypeID,
            RoomViewID: editRoomViewID,
            BedTypeID: editBedTypeID,
            ExtraBedTypeID: editExtraBedTypeID,
            Amenities: "AC, Bathtub",
            Location: null,
            RoomRate: editRoomRate,
            CGST_P: editCgst,
            SGST_P: editSgst,
            IGST_P: editIgst,
            // TotalTax: editTotalTax,
            TotalAmount: editTotalAmount,
            Status: editRoomStatus,
            RoomDesc: roomDesc,
            RoomDisplayName: editRoomDisplayName,
            RoomSize: editRoomSize,
            AdultBase: editAdultBase,
            AdultMax: editAdultMax,
            InfantMax: editInfantMax,
            ChildBase: editChildBase,
            ChildMax: editChildMax,
            GuestMax: editGuestMax,
            ExtraAdultPrice: editExtraAdultPrice,
            ExtraChildPrice: editExtraChildPrice,
            // RoomStatusID: editRoomStatusID,
            CompanyID: "COM001",
            PropertyID
        }
        try {
            const response = await axios.post(`/getdata/bookingdata/roomdetails`, editRoomDetailsBody)
            console.log("update response", response?.data[0])
            if (response.data[0][0].status === "Success") {
                roomDetailsList()
                toast.success("Room Details Updated Successfully")
            }
        } catch (error) {
            console.log("Room Details Update Error")
            toast.error("Something went wrong, try again!")
        }
        // if (editCgst && editSgst && editIgst && editRoomTypeID && editRoomViewID && editBedTypeID && editExtraBedTypeID && editRoomRate && editRoomStatus &&
        //     editRoomDisplayName &&
        //     editAdultBase &&
        //     editChildBase &&
        //     editGuestMax !== (null || "")) {
        //     try {
        //         const response = await axios.post(`/getdata/bookingdata/roomdetails`, editRoomDetailsBody)
        //         console.log("update response", response?.data[0])
        //         // if(response.data)
        //         // roomDetailsList()
        //         // toast.success("Room Details Updated Successfully")
        //     } catch (error) {
        //         console.log("Room Details Update Error")
        //         toast.error("Something went wrong, try again!")
        //     }
        // } else {
        //     toast.error("Fill all Fields")
        // }
    }

    const updateRoomEdit = () => {
        setEditSubmit(!editSubmit)
        console.log('details', editRoomTypeID, editRoomDisplayName, editBedTypeID, editExtraBedTypeID, editRoomViewID, editRoomRate, editRoomSizeInput)
        if (editRoomTypeID && editRoomDisplayName.trim() && editBedTypeID && editExtraBedTypeID && editRoomViewID && editRoomSizeInput !== '') {
            console.log('hittttttt')
            editRoomDetails()
            handleUpdate()
            setEditSubmit(!editSubmit)
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleUpdate}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleUpdate}>
                    Edit Room Details
                </ModalHeader>
                {
                    !dropdownLoader ? (
                        <>
                            <ModalBody className='px-sm-2 mx-50 pb-5'>
                                <Row>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Category<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={roomTypeDropDownOptions}
                                            // defaultInputValue={data[0]?.RoomType}
                                            value={roomTypeDropDownOptions?.filter(c => c.value === editRoomTypeID)}
                                            onChange={data => {
                                                setEditRoomTypeID(data.value)
                                                handleRoomType(data.value)
                                            }}
                                            invalid={editSubmit && editRoomTypeID === ''}
                                        />
                                        {editSubmit && editRoomTypeID === "" && <p className='text-danger'>Room Category is required</p>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Display Name<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='text'
                                            placeholder='Display Name goes here'
                                            value={editRoomDisplayName}
                                            onChange={e => SetEditRoomDisplayName(e.target.value)}
                                            invalid={editSubmit && editRoomDisplayName.trim() === ''}
                                        />
                                        {editSubmit && editRoomDisplayName.trim() === '' && <FormFeedback>Display Name is required</FormFeedback>}
                                    </Col>
                                </Row>
                                <Row>
                                    {console.log('bedTypeDropDownOptions', editBedTypeID, bedTypeDropDownOptions?.filter(c => c.value === editBedTypeID && c.status === "Active").length > 0)}
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Bed Type<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            aria-readonly
                                            options={bedTypeDropDownOptions}
                                            // defaultInputValue={data[0]?.BedType}
                                            //checking if the current returned option is Active or Inactive and depending upon the result showing the desired result
                                            value={bedTypeDropDownOptions?.filter(c => c.value === editBedTypeID && c.status === "Active").length > 0 ? bedTypeDropDownOptions?.filter(c => c.value === editBedTypeID) : { value: data[0].BedTypeID, label: `${data[0].BedType} (Inactive)` }}
                                            isOptionDisabled={(option) => option.status === 'Inactive'}
                                            onChange={e => {
                                                setEditBedTypeID(e.value)
                                                handleBedType(e.value)
                                            }}
                                            invalid={editSubmit && editBedTypeID === ''}
                                        />
                                        {editSubmit && editBedTypeID === '' && <p className='text-danger'>Bed Type is required</p>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Extra Bed Type<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            options={extraBedTypeDropDownOptions}
                                            aria-readonly
                                            // defaultInputValue={data[0]?.ExtraBedType}
                                            value={extraBedTypeDropDownOptions?.filter(c => c.value === editExtraBedTypeID)}
                                            onChange={e => {
                                                setEditExtraBedTypeID(e.value)
                                                handleExtraBedType(e.value)
                                            }}
                                            invalid={editSubmit && editExtraBedTypeID === ''}
                                        />
                                        {editSubmit && editExtraBedTypeID === '' && <p className='text-danger'>Extra Bed Type is required</p>}
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
                                            // defaultInputValue={data[0]?.RoomView}
                                            value={roomViewOptions?.filter(c => c.value === editRoomViewID)}
                                            onChange={e => {
                                                setEditRoomViewID(e.value)
                                                handleRoomView(e.value)
                                            }}
                                            invalid={editSubmit && editRoomViewID === ''}
                                        />
                                        {editSubmit && editRoomViewID === '' && <p className='text-danger'>Room View is required</p>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Rate</Label>
                                        <Input
                                            type='number'
                                            disabled='true'
                                            placeholder='Enter Room Rate'
                                            value={editRoomRate}
                                            onChange={e => {
                                                e.target.value <= 0 ? setEditRoomRate('') : setEditRoomRate(e.target.value)
                                            }}
                                        // invalid={editSubmit && editRoomRate === ''}
                                        />
                                        {/* {editSubmit && editRoomRate === '' && <FormFeedback>Room Rate is required</FormFeedback>} */}
                                    </Col>
                                    <Col lg="12" className="d-flex flex-row justify-content-between align-items-center">
                                        <div>
                                            <Label className='form-label' for="cgst">CGST(%) <span className='text-danger'>*</span></Label>
                                            <Input
                                                name="cgst"
                                                type="number"
                                                value={editCgst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setEditCgst('') : setEditCgst(e.target.value)
                                                }}
                                                invalid={editSubmit && editCgst === ''}
                                            />
                                            {editSubmit && cgst === '' && <FormFeedback>CGST is required</FormFeedback>}
                                        </div>
                                        <div>
                                            <Label className='form-label' for="sgst">SGST(%) <span className='text-danger'>*</span></Label>
                                            <Input
                                                name="sgst"
                                                type="number"
                                                value={editSgst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setEditSgst('') : setEditSgst(e.target.value)
                                                }}
                                                invalid={editSubmit && editSgst === ''}
                                            />
                                            {editSubmit && editSgst === '' && <FormFeedback>SGST is required</FormFeedback>}
                                        </div>
                                        <div>
                                            <Label className='form-label' for="igst">IGST(%) <span className='text-danger'>*</span></Label>
                                            <Input
                                                name="igst"
                                                type="number"
                                                value={editIgst}
                                                onChange={e => {
                                                    e.target.value < 0 ? setEditIgst('') : setEditIgst(e.target.value)
                                                }}
                                                invalid={editSubmit && editIgst === ''}
                                            />
                                            {editSubmit && editIgst === '' && <FormFeedback>IGST is required</FormFeedback>}
                                        </div>
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ExtraAdultPrice'>Extra Adult Price</Label>
                                        <Input type='text' name='ExtraAdultPrice' id='ExtraAdultPrice' value={editExtraAdultPrice} disabled='true'
                                            onChange={e => {
                                                e.target.value < 0 ? setEditExtraAdultPrice('') : setEditExtraAdultPrice(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='ExtraChildPrice'>Extra Child Price</Label>
                                        <Input type='text' name='ExtraChildPrice' id='ExtraChildPrice' value={editExtraChildPrice} disabled='true'
                                            onChange={e => {
                                                e.target.value < 0 ? setEditExtraChildPrice('') : setEditExtraChildPrice(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Size<span className='text-danger'>*</span></Label>
                                        <div className='d-flex'>
                                            <div>
                                                <Input type='number' placeholder='Enter size' className='me-2' value={editRoomSizeInput}
                                                    onChange={e => {
                                                        e.target.value <= 0 ? setEditRoomSizeInput('') : setEditRoomSizeInput(e.target.value)
                                                    }} invalid={editSubmit && editRoomSizeInput === ''} />
                                                {editSubmit && editRoomSizeInput === '' && <FormFeedback>Room Size is required</FormFeedback>}
                                            </div>
                                            <Select
                                                theme={selectThemeColors}
                                                className='react-select w-100'
                                                classNamePrefix='select'
                                                defaultValue={roomSize[0]}
                                                aria-readonly
                                                options={roomSize}
                                                isClearable={false}
                                                value={roomSize?.filter(c => c.value === editRoomSizeSelect)}
                                                onChange={e => setEditRoomSizeSelect(e.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label'>Room Status<span className='text-danger'>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select w-100'
                                            classNamePrefix='select'
                                            placeholder='Select Room status'
                                            aria-readonly
                                            options={statusOptions}
                                            // defaultInputValue={data[0]?.RoomStatus}
                                            value={statusOptions?.filter(c => c.value === editRoomStatus)}
                                            onChange={e => {
                                                setEditRoomStatus(e.value)
                                                handleRoomStatus(e.value)
                                            }}
                                        />
                                        {editSubmit && editRoomStatus === '' && <span className='text-danger'>Room Status is required</span>}
                                    </Col>
                                </Row>
                                <Row>
                                    <h2 className=' mb-1'>Room Occupancy</h2>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='adultsBase'>Adults (Base)<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='number'
                                            name='editAdultBase'
                                            id='editAdultBase'
                                            value={editAdultBase}
                                            onChange={e => {
                                                e.target.value < 0 ? setEditAdultBase('') : setEditAdultBase(e.target.value)
                                            }}
                                            invalid={editSubmit && editAdultBase === ''}
                                        />
                                        {editSubmit && editAdultBase === '' && <span className='text-danger'>Adult(Base) is required</span>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='childBase'>Child (Base)<span className='text-danger'>*</span></Label>
                                        <Input
                                            type='number'
                                            name='editChildBase'
                                            id='editChildBase'
                                            value={editChildBase}
                                            onChange={e => {
                                                e.target.value < 0 ? setEditChildBase('') : setEditChildBase(e.target.value)
                                            }}
                                            invalid={editSubmit && editChildBase === ''}
                                        />
                                        {editSubmit && editChildBase === '' && <span className='text-danger'>Child(Base) is required</span>}
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='adultsMax'>Adults (Max)</Label>
                                        <Input type='number' name='editAdultMax' id='editAdultMax' value={editAdultMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setEditAdultMax('') : setEditAdultMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='childMax'>Child (Max)</Label>
                                        <Input type='number' name='editChildMax' id='editChildMax' value={editChildMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setEditChildMax('') : setEditChildMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='infantMax'>Infant (Max)</Label>
                                        <Input type='number' name='editInfantMax' id='editInfantMax' value={editInfantMax}
                                            onChange={e => {
                                                e.target.value < 0 ? setEditInfantMax('') : setEditInfantMax(e.target.value)
                                            }} />
                                    </Col>
                                    <Col lg='6' className='mb-2'>
                                        <Label className='form-label' for='guestMax'>Guest (Max)<span className='text-danger'>*Should always be greater than Adult(Max)</span></Label>
                                        <Input
                                            type='number'
                                            name='editGuestMax'
                                            id='editGuestMax'
                                            value={editGuestMax}
                                            onChange={e => {
                                                e.target.value <= 0 ? setEditGuestMax('') : setEditGuestMax(e.target.value)
                                            }}
                                            invalid={editSubmit && editGuestMax === ''}
                                        />
                                        {editSubmit && editGuestMax === '' && <span className='text-danger'>Guest(Max) is required</span>}
                                    </Col>
                                </Row>
                                <Row tag='form' className='gy-1 gx-2 mt-75' >
                                    <Col className='text-center mt-1' xs={12}>
                                        <Button className='me-1' color='primary' onClick={updateRoomEdit}>
                                            Submit
                                        </Button>
                                        <Button
                                            color='secondary'
                                            outline
                                            onClick={() => handleUpdate()}
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
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default UpdateRoom