import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getShipmentSectorPacks} from '../../../server'

const initialState = {
    packs: [],
    loading: false,
    total: 0,
    success: null,
    error: null
}

export const reloadShipmentSectorPacks = createAsyncThunk(
    'shipSectorPacks/reloadShipmentSectorPacks',
    async (args) => {
        console.log('argsPack', args)
        return await getShipmentSectorPacks(args)
    }
)


export const fetchShipmentSectorPacks = createAsyncThunk(
    'shipSectorPacks/fetchShipmentSectorPacks',
    async (args) => {
        console.log('argsPack', args)
        return await getShipmentSectorPacks(args)
    }
)

const shipmentSectorPacksSlice = createSlice({
    name: 'shipmentSectorPacks',
    initialState,
    reducers: {
        clearSectorPacks: state => {
            state.packs = []
            state.total = 0
            state.error = null
            state.success = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(reloadShipmentSectorPacks.pending, state => {
                state.loading = true
            })
            .addCase(reloadShipmentSectorPacks.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.packs = action.payload.data
                state.success = action.payload.success
                state.total = action.payload.total
                state.error = action.payload.error
                state.loading = false
            })
            .addCase(reloadShipmentSectorPacks.rejected, state => {
                state.loading = false
            })
            .addCase(fetchShipmentSectorPacks.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentSectorPacks.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.packs = state.packs.concat(action.payload.data)
                state.success = action.payload.success
                state.total = action.payload.total
                state.error = action.payload.error
                state.loading = false
            })
            .addCase(fetchShipmentSectorPacks.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentSectorPacksSlice

export default reducer
export const {
    clearSectorPacks,
} = actions



