import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getPacks} from '../../../server'

const initialState = {
    packs: [],
    total: 0,
    loading: false,
    error: null,
}

export const fetchShipmentPartialPacks = createAsyncThunk(
    'shipmentPartialPacks/fetchShipmentPartialPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

export const reloadShipmentPartialPacks = createAsyncThunk(
    'shipmentPartialPacks/reloadShipmentPartialPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

const shipmentPartialPacksSlice = createSlice({
    name: 'shipmentPartialPacks',
    initialState,
    reducers: {
        clearPartialPacks: state => {
            state.packs = []
            state.total = 0
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(reloadShipmentPartialPacks.pending, (state, action) => {
                state.loading = true
            })
            .addCase(reloadShipmentPartialPacks.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                state.packs = action.payload.data
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(reloadShipmentPartialPacks.rejected, state => {
                state.loading = false
            })
            .addCase(fetchShipmentPartialPacks.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPartialPacks.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                state.packs = state.packs.concat(action.payload.data)
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(fetchShipmentPartialPacks.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentPartialPacksSlice

export default reducer
export const {
    clearPartialPacks,
} = actions



