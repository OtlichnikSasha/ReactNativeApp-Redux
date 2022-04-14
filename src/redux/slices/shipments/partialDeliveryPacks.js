import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getPartialPacks} from '../../../server'

const initialState = {
    packs: [],
    loading: false,
    total: 0,
    success: null,
    error: null
}

export const reloadPartialPacks = createAsyncThunk(
    'shipmentPartialPacks/reloadPartialPacks',
    async (args) => {
        console.log('argsPack', args)
        return await getPartialPacks(args)
    }
)


export const fetchPartialPacks = createAsyncThunk(
    'shipmentPartialPacks/fetchPartialPacks',
    async (args) => {
        console.log('argsPack', args)
        return await getPartialPacks(args)
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
            state.success = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(reloadPartialPacks.pending, state => {
                state.loading = true
            })
            .addCase(reloadPartialPacks.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.packs = action.payload.data
                state.success = action.payload.success
                state.total = action.payload.total
                state.error = action.payload.error
                state.loading = false
            })
            .addCase(reloadPartialPacks.rejected, state => {
                state.loading = false
            })
            .addCase(fetchPartialPacks.pending, state => {
                state.loading = true
            })
            .addCase(fetchPartialPacks.fulfilled, (state, action) => {
                console.log('action.payload.data', action.payload)
                state.packs = state.packs.concat(action.payload.data)
                state.success = action.payload.success
                state.total = action.payload.total
                state.error = action.payload.error
                state.loading = false
            })
            .addCase(fetchPartialPacks.rejected, state => {
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



