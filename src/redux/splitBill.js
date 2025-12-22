import { createSlice } from "@reduxjs/toolkit";

export const splitSlice = createSlice({
    name: 'splitBill',
    initialState: {
        split: []
    },
    reducers: {
        setSplit: (state, action) => { state.split = action.payload },
        disposeSplit: (state, action) => {
            if (action.payload) {
                state.split = []
            }
        }
    }
})

export const {
    setSplit,
    disposeSplit
} = splitSlice.actions

export default splitSlice.reducer