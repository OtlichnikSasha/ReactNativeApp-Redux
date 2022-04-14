import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getScanPack} from '../../../server'

const initialState = {
    pack: null,
    code: null,
    loading: false,
    type: '',
    success: '',
    error: null
}

export const fetchShipmentScanPack = createAsyncThunk(
    'shipmentScanPack/fetchShipmentScanPack',
    async (args) => {
        console.log('argsPack', args)
        return await getScanPack(args)
    }
)

const shipmentScanPackSlice = createSlice({
    name: 'shipmentScanPack',
    initialState,
    reducers: {
        clearPack: state => {
            state.pack = null
            state.code = null
            state.loading = false
            state.type = ''
            state.success = ''
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentScanPack.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentScanPack.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.pack = action.payload.data.data
                state.type = action.payload.data['entity']
                state.success = action.payload.success
                state.error = action.payload.error
                state.loading = false
            })
            .addCase(fetchShipmentScanPack.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentScanPackSlice

export default reducer
export const {
    clearPack,
} = actions



