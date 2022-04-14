import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getPacks} from '../../../server'

const initialState = {
    packs: [],
    total: 0,
    loading: false,
}

export const fetchShipmentPacks = createAsyncThunk(
    'shipmentPacks/fetchShipmentPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

export const reloadShipmentPacks = createAsyncThunk(
    'shipmentPacks/reloadShipmentPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

const shipmentPacksSlice = createSlice({
    name: 'shipmentPacks',
    initialState,
    reducers: {
        clearPacks: state => {
            state.packs = []
            state.total = 0
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPacks.pending, state => {
                state.loading = true
            })
            .addCase(reloadShipmentPacks.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                state.packs = action.payload.data
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(fetchShipmentPacks.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                state.packs = state.packs.concat(action.payload.data)
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(fetchShipmentPacks.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentPacksSlice

export default reducer
export const {
    clearPacks,
} = actions



