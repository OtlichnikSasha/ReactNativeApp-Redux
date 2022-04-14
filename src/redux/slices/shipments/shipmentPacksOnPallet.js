import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {fromSectorOnPallet} from '../../../server'

const initialState = {
    result: null,
    status: false,
    loading: false,
    error: null
}

export const fetchShipmentPackOnPallet = createAsyncThunk(
    'shipmentPacksPallet/fetchShipmentPacksPallet',
    async (args) => {
        console.log('args', args)
        return await fromSectorOnPallet(args)
    }
)

const shipmentPacksOnPallet = createSlice({
    name: 'shipmentPacksPallet',
    initialState,
    reducers: {
        clearResult: state => {
            state.status = false
            state.error = null
            state.result = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPackOnPallet.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPackOnPallet.fulfilled, (state, action) => {
                state.loading = false
                console.log('fetchShipmentPackOnPallet', action.payload)
                state.status = action.payload.success
                state.result = action.payload.data
                state.error = action.payload.error
            })
            .addCase(fetchShipmentPackOnPallet.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentPacksOnPallet

export default reducer
export const {
    clearResult
} = actions



