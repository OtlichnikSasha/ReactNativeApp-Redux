import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPacksOnPallet } from '../../../server'

const initialState = {
    packs: [],
    loading: false,
    total: 0
}

export const fetchShipmentPalletPacks = createAsyncThunk(
    'shipmentPalletPacks/fetchShipmentPalletPack',
    async (args) => {
        args.palletType = "FROM_SECTION_TO_STORE"
        console.log('argsPack', args)
        return await getPacksOnPallet(args)
    }
)

export const reloadShipmentPalletPacks = createAsyncThunk(
    'shipmentPalletPacks/reloadShipmentPalletPack',
    async (args) => {
        args.palletType = "FROM_SECTION_TO_STORE"
        console.log('argsPack', args)
        return await getPacksOnPallet(args)
    }
)

const shipmentPalletPacks = createSlice({
    name: 'shipmentPalletPack',
    initialState,
    reducers: {
        clearPack: state => {
            state.packs = []
            state.total = 0
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPalletPacks.pending, state => {
                state.loading = true
            })
            .addCase(reloadShipmentPalletPacks.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.packs = action.payload.data
                state.loading = false
                state.total = action.payload.total
            })
            .addCase(fetchShipmentPalletPacks.fulfilled, (state, action) => {
                if (!action.payload.data.length) return
                state.packs = state.packs.concat(action.payload.data)
                state.loading = false
                state.total = action.payload.total
            })
            .addCase(fetchShipmentPalletPacks.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentPalletPacks

export default reducer
export const {
    clearPack,
} = actions



