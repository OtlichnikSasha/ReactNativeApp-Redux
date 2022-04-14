import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {fromSectorOnStore} from '../../../server'

const initialState = {
    status: false,
    loading: false,
    error: ''
}

export const fetchShipmentPackOnStore = createAsyncThunk(
    'shipmentPacksStore/fetchShipmentPacksStore',
    async (data) => {
        return await fromSectorOnStore(data)
    }
)

const shipmentPacksOnStore = createSlice({
    name: 'shipmentPacksStore',
    initialState,
    reducers: {
        clearResult: state => {
            state.status = false
            state.error = ''
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPackOnStore.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPackOnStore.fulfilled, (state, action) => {
                state.loading = false
                console.log('fetchShipmentPackOnStore', action.payload)
                state.status = action.payload.success
                if(action.payload.hasOwnProperty("error")){
                    state.error = action.payload.error
                }
            })
            .addCase(fetchShipmentPackOnStore.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentPacksOnStore

export default reducer
export const {
    clearResult
} = actions



