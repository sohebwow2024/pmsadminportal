import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../API/axios";

export const storeAccountList = createAsyncThunk(
  "AccountList",
  async (obj) => {
    const response = await axios.post("/getdata/userdata/userdetails", obj)
    return {
      data: response.data
    }
  }
)

export const userManageSlice = createSlice({
  name: "userManage",
  initialState: {
    userData: null,
    userLists: null,
    bookingRateData: null
  },
  reducers: {
    userDataStorage: (state, action) => {
      return { ...state, userData: action.payload }
    },
    accountListStorage: (state, action) => {
      return { ...state, userLists: action.payload }
    },
    setHotelProperty: (state, action) => {
      state.userData = { ...state.userData, PropertyID: action.payload.PropertyID, HotelName: action.payload.HotelName }
    },
    setBookingRate: (state, action) => {
      return { ...state, bookingRateData: action.payload }
    }

  },
  extraReducers: (builder) => {
    builder.addCase(storeAccountList.fulfilled, (state, action) => {
      return { ...state, userLists: action.payload }
    })
  }

})

export const { userDataStorage, accountListStorage, setHotelProperty, setBookingRate } = userManageSlice.actions

export default userManageSlice.reducer

