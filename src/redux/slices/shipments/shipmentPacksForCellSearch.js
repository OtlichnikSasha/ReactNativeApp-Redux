import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getPacks} from '../../../server'

const initialState = {
    packs: [],
    total: null,
    loading: false,
}

export const fetchShipmentPacksForCellSearch = createAsyncThunk(
    'shipmentPacks/fetchShipmentPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

export const reloadShipmentPacksCellSearch = createAsyncThunk(
    'shipmentPacks/reloadShipmentPacks',
    async (args) => {
        console.log('args', args)
        return await getPacks(args)
    }
)

const shipmentPacksForCellSearchSlice = createSlice({
    name: 'shipmentPacks',
    initialState,
    reducers: {
        clearPacks: state => {
            state.packs = []
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPacksForCellSearch.pending, state => {
                state.loading = true
            })
            .addCase(reloadShipmentPacksCellSearch.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                if (!action.payload.data.length) return
                state.packs = action.payload.data
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(fetchShipmentPacksForCellSearch.fulfilled, (state, action) => {
                console.log('fetchShipmentPacks', action.payload)
                if (!action.payload.data.length) return
                state.packs = state.packs.concat(action.payload.data)
                state.total = action.payload.total
                state.loading = false
            })
            .addCase(fetchShipmentPacksForCellSearch.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentPacksForCellSearchSlice

export default reducer
export const {
    clearPacks,
} = actions



