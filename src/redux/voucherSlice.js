import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../API/axios';
import { arrayToObject } from '../common/commonMethods';

export const storeInvoiceDetails = createAsyncThunk(
    "invoiceDetails",
    async (obj) => {
        try {
            const { bookingID, LoginID, Token } = obj

            // We stopped unnecessary API calls ("BookingId se stop kar rahe h")
            if (!bookingID) {
                return rejectWithValue("BookingId missing");
            }

            const res = await axios.get(`/booking/BookingInvoice`, {
                params: {
                    LoginID,
                    Token,
                    BookingId: bookingID
                }
            })
            // console.log('ress', res);
            if (res?.data.length > 0) {
                return res.data
            }
        } catch (err) {
            console.log('voucherSliceErr', err)
        }
    }
)


// export const storeBookingDetails = createAsyncThunk(
//     "bookingDetails",
//     async (obj) => {
//         try {
//             const { BookingId, LoginID, Token } = obj;
//             console.log("BookingIdvoucher" , BookingId);

//             const params = "BookingId=" + BookingId +
//                 "&LoginId=" + LoginID +
//                 "&Token=" + Token;
//             const result = await axios.get("/booking/BookingVoucher?" + params);
//             console.log("BookingVoucherresult", result)
//             const data = arrayToObject(result.data.slice(0, 6));
//             data.roomData = result.data[4]
//             data.hotelData = result.data[0]
//             console.log('dattaaaaaaa', data)
//             return data;
//         }
//         catch (error) {
//             console.log(error)
//         }

//     }
// )


export const storeBookingDetails = createAsyncThunk(
    "bookingDetails",
    async (obj, { rejectWithValue }) => {
        try {
            const { BookingId, LoginID, Token } = obj;

            // We stopped unnecessary API calls ("BookingId se stop kar rahe h")
            if (!BookingId) {
                return rejectWithValue("BookingId missing");
            }

            const result = await axios.get(
                `/booking/BookingVoucher?BookingId=${BookingId}&LoginId=${LoginID}&Token=${Token}`
            );

            const data = arrayToObject(result.data.slice(0, 6));
            data.roomData = result.data[4];
            data.hotelData = result.data[0];

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const LaundryInvoiceDetails = createAsyncThunk(
    "laundryInvoice",
    async (obj) => {
        try {

            const result = await axios.post("/laundry/transaction", obj);
            console.log("laundryres: ", result)
            const data = arrayToObject(result.data.slice(0, 2));
            data.laundryItemsData = result.data[2]
            return data;
        }
        catch (error) {
            console.log(error)
        }
    }
)

export const getBookingData = createAsyncThunk(
    "OTAvoucher",
    async (obj) => {
        try {
            const { OTABookingId, LoginID, Token } = obj;
            const result = await axios.get(`booking/GetReservationFromSTAAH/${OTABookingId}`, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            const data = result.data
            console.log("otaresponse: ", data)
            return data;
        }
        catch (error) {
            console.log(error)
        }
    }
)


export const voucherSlice = createSlice({
    name: "bookingData",
    initialState: {
        bookingId: null,
        invoiceDetails: [],
        bookingDetails: null,
        laundryDetails: null,
        bookingData: null,
        invoiceID: '',
        posInvoiceID: '',
        otabookingID: ''
    },
    reducers: {
        setBookingId: (state, action) => { state.bookingId = action.payload },
        setInvoiceID: (state, action) => { state.invoiceID = action.payload },
        setPosInvoiceID: (state, action) => { state.posInvoiceID = action.payload },
        setOTABookingID: (state, action) => { state.otabookingID = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(storeInvoiceDetails.fulfilled, (state, action) => {
            return { ...state, invoiceDetails: action.payload }
        }),
            builder.addCase(storeBookingDetails.fulfilled, (state, action) => {
                return { ...state, bookingDetails: action.payload }
            }),
            builder.addCase(LaundryInvoiceDetails.fulfilled, (state, action) => {
                return { ...state, laundryDetails: action.payload }
            })
        builder.addCase(getBookingData.fulfilled, (state, action) => {
            return { ...state, bookingData: action.payload }
        })
    }
})

export const { setBookingId, setInvoiceID, setPosInvoiceID, setOTABookingID } = voucherSlice.actions

export default voucherSlice.reducer

