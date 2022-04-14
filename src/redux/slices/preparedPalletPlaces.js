import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPacks } from '../../server'

const initialState = {
    packs: [],
    total: null,
    loading: false
}

export const fetchPreparedPalletPacks = createAsyncThunk(
    'preparedPalletPacks/fetchPreparedPalletPacks',
    async (args) => {
        console.log('argsSectorPackSlice', args)
        return await getPacks(args)
    }
)

export const reloadPreparedPalletPacks = createAsyncThunk(
    'reloadPreparedPalletPacks/fetchReloadPreparedPalletPacks',
    async (args) => {
        return await getPacks(args)
    }
)

const preparedPalletPacksSlice = createSlice({
    name: 'preparedPalletPacks',
    initialState,
    reducers: {
        clearPreparedPalletPacks: state => {
            state.packs = []
            state.total = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreparedPalletPacks.pending, state => {
                state.loading = true
            })
            .addCase(reloadPreparedPalletPacks.fulfilled, (state, action) => {
                console.log('reloadSectorPacks', action.payload)
                if (action.payload.data.length) {
                    state.packs = action.payload.data
                }
                state.loading = false
                state.total = action.payload.total
            })
            .addCase(fetchPreparedPalletPacks.fulfilled, (state, action) => {
                if (action.payload.data.length) {
                    state.packs = state.packs.concat(action.payload.data)
                }
                state.loading = false
                state.total = action.payload.total
            })
            .addCase(fetchPreparedPalletPacks.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = preparedPalletPacksSlice

export default reducer

export const {
    clearPreparedPalletPacks
} = actions