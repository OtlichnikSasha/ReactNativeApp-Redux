import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPack } from '../../../server'

const initialState = {
    pack: {},
    id: null,
    loading: false,
}

export const fetchShipmentPack = createAsyncThunk(
    'shipmentPack/fetchShipmentPack',
    async (args) => {
        console.log('argsPack', args)
        return await getPack(args)
    }
)

const shipmentPackSlice = createSlice({
    name: 'shipmentPack',
    initialState,
    reducers: {
        clearPack: state => {
            state.pack = {}
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPack.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPack.fulfilled, (state, action) => {
                console.log('action', action.payload)
                if(action.payload.data.length) state.pack = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchShipmentPack.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentPackSlice

export default reducer
export const {
    clearPack,
} = actions



