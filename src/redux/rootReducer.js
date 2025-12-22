// ** Reducers Imports
import layout from "./layout"
import navbar from "./navbar"
import booking from "./booking"
import userManageSlice from "./usermanageReducer"
import bookingDetails
    from "./quickBookingSlice"
import voucherSlice from "./voucherSlice"
import reserveSlice from "./reserve"
import splitSlice from "./splitBill"

import { combineReducers } from "redux"

// const rootReducer = { navbar, layout, booking,userManageSlice }
const rootReducer = combineReducers({ navbar, layout, booking, userManageSlice, bookingDetails, voucherSlice, reserveSlice, splitSlice })

export default rootReducer
