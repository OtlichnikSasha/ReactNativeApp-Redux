import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { returnToStore } from '../../../server'

const initialState = {
    result: null,
    loading: false,
    error: null
}

export const fetchReturnToStore = createAsyncThunk(
    'shipmentReturnToStore/fetchShipmentReturnToStore',
    async (args) => {
        console.log('args', args)
        return await returnToStore(args)
    }
)

const shipmentReturnToStore = createSlice({
    name: 'shipmentReturn',
    initialState,
    reducers: {
        clearReturnToStoreData: state => {
            state.result = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReturnToStore.pending, state => {
                state.loading = true
            })
            .addCase(fetchReturnToStore.fulfilled, (state, action) => {
                console.log('action.payload', action.payload)
                state.loading = false
                state.result = action.payload.success
                state.error = action.payload.error
            })
            .addCase(fetchReturnToStore.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentReturnToStore
export default reducer
export const {
    clearReturnToStoreData,
} = actions




