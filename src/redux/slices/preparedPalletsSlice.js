import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getPreparedPallets} from '../../server'

const initialState = {
    pallets: [],
    loading: null,
    total: null,
    stackTotal: null,
    packsTotal: 0,
    palletsForTotal: []
}

export const fetchPreparedPallets = createAsyncThunk(
    'preparedPallets/fetchPreparedPallets',
    async (args) => {
        return await getPreparedPallets(args)
    }
)

export const reloadPreparedPallets = createAsyncThunk(
    'preparedPallets/reloadPreparedPallets',
    async (args) => {
        return await getPreparedPallets(args)
    }
)

export const totalPreparedPallets = createAsyncThunk(
    'totalPreparedPallets/fetchTotalPreparedPallets',
    async (args) => {
        return await getPreparedPallets(args)
    }
)

const preparedPalletsSlice = createSlice({
    name: 'preparedPallets',
    initialState,
    reducers: {
        clearPreparedPallets: state => {
            state.pallets = []
            state.loading = null
            state.total = null
        },
        clearTotal: state => {
            state.packsTotal = 0
            state.palletsForTotal = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreparedPallets.pending, state => {
                state.loading = false
            })
            .addCase(reloadPreparedPallets.fulfilled, (state, action) => {
                console.log('palletsSlice', action.payload)
                state.pallets = action.payload.data
                state.loading = true
                state.total = action.payload.total
            })
            .addCase(fetchPreparedPallets.fulfilled, (state, action) => {
                console.log('palletsSlice', action.payload)
                if (!action.payload.data.length) return;
                state.pallets = state.pallets.concat(action.payload.data)
                state.loading = true
                state.total = action.payload.total
            })
            .addCase(totalPreparedPallets.fulfilled, (state, action) => {
                state.packsTotal = 0
                state.palletsForTotal = action.payload.data
                if (action.payload.data.length) {
                    state.palletsForTotal.map(pallet => state.packsTotal += pallet.packsCount)
                }
            })
            .addCase(fetchPreparedPallets.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = preparedPalletsSlice
export default reducer
export const {
    clearPreparedPallets, clearTotal
} = actions