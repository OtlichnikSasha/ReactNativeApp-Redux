import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {shipmentPackDelivery} from '../../../server'

const initialState = {
    status: null,
    loading: false,
    error: null
}

export const fetchShipmentPacksDelivery = createAsyncThunk(
    'shipmentPacksDelivery/fetchShipmentPacksDelivery',
    async (data) => {
        return await shipmentPackDelivery(data)
    }
)

const shipmentPacksDelivery = createSlice({
    name: 'shipmentPacksD',
    initialState,
    reducers: {
        clearPacksResult: state => {
            state.status = null
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPacksDelivery.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPacksDelivery.fulfilled, (state, action) => {
                state.loading = false
                console.log('shipmentPacksDeliveryData', action.payload)
                state.status = action.payload.success
                state.error = action.payload.error
            })
            .addCase(fetchShipmentPacksDelivery.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentPacksDelivery

export default reducer
export const {
    clearPacksResult
} = actions



