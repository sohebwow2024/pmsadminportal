import { createSlice } from "@reduxjs/toolkit";

export const reserveSlice = createSlice({
    name: 'reserve',
    initialState: {
        iDate: '',
        oDate: '',
        selRoomArr: [],
        cost: '',
        gst: '',
        total: '',
        discount: '',
        discountType: '',
        disAmt: '',
        sourceId: '',
        sourceTypeId: '',
        customerId: '',
        GuestFName: '',
        GuestLName: '',
        GuestMail: '',
        GuestMobileNo: '',
        paymentTypeId: '',
        paymentTypeName: '',
        paymentModeId: '',
        partialAmt: 0,
        specialNote: '',
        booker: ''
    },
    reducers: {
        setIDate: (state, action) => { state.iDate = action.payload },
        setODate: (state, action) => { state.oDate = action.payload },
        setSelRoomArr: (state, action) => { state.selRoomArr = action.payload },
        setPrice: (state, action) => {
            state.cost = action.payload.netTotal
            state.gst = action.payload.gTax
            state.total = action.payload.gTotal
            state.discount = action.payload.discount
            state.discountType = action.payload.discountType
            state.disAmt = action.payload.disAmt
        },
        setSrcId: (state, action) => { state.sourceId = action.payload },
        setSrcTypeId: (state, action) => { state.sourceTypeId = action.payload },
        setGuestId: (state, action) => { state.customerId = action.payload },
        setGuestFName: (state, action) => { state.GuestFName = action.payload },
        setGuestLName: (state, action) => { state.GuestLName = action.payload },
        setGuestMobileNo: (state, action) => { state.GuestMobileNo = action.payload },
        setGuestMail: (state, action) => { state.GuestMail = action.payload },
        setPytTypeId: (state, action) => { state.paymentTypeId = action.payload },
        setPaymentTypeName: (state, action) => { state.paymentTypeName = action.payload },
        setPytModeId: (state, action) => { state.paymentModeId = action.payload },
        setSpecialNote: (state, action) => { state.specialNote = action.payload },
        setBookedBy: (state, action) => { state.booker = action.payload },
        setPartialAmt: (state, action) => { state.partialAmt = action.payload },
        disposeNewStore: (state, action) => {
            if (action.payload) {
                state.iDate = ''
                state.oDate = ''
                state.selRoomArr = []
                state.cost = ''
                state.gst = ''
                state.total = ''
                state.discount = ''
                state.discountType = ''
                state.disAmt = ''
                state.sourceId = ''
                state.sourceTypeId = ''
                state.customerId = ''
                state.GuestFName = ''
                state.GuestLName = ''
                state.GuestMail = ''
                state.GuestMobileNo = ''
                state.paymentTypeId = ''
                state.paymentTypeName = ''
                state.paymentModeId = ''
                state.partialAmt = 0
                state.specialNote = ''
                state.booker = ''
            }
        }
    }
})

export const {
    setIDate,
    setODate,
    setSelRoomArr,
    setPrice,
    setSrcId,
    setSrcTypeId,
    setGuestId,
    setGuestFName,
    setGuestLName,
    setGuestMail,
    setGuestMobileNo,
    setPytTypeId,
    setPaymentTypeName,
    setPytModeId,
    setSpecialNote,
    setBookedBy,
    setPartialAmt,
    disposeNewStore
} = reserveSlice.actions

export default reserveSlice.reducer