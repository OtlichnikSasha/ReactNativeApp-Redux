import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {palletToStorePacks} from '../../server'

const initialState = {
    pack: {},
    status: null,
    loading: false,
    error: null
}

export const fetchPackOnPalletToStore = createAsyncThunk(
    'packOnPalletToStore/fetchPackOnPalletToStore',
    async (args) => {
        console.log('argsPackOnPalletToStore', args)
        return await palletToStorePacks(args)
    }
)

const packOnPalletToStore = createSlice({
    name: 'packOnPalletToStore',
    initialState,
    reducers: {
        clearPackToStore: state => {
            state.pack = {}
            state.status = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackOnPalletToStore.pending, state => {
                state.loading = true
            })
            .addCase(fetchPackOnPalletToStore.fulfilled, (state, action) => {
                console.log('fetchPackOnPalletToStore', action.payload)
                state.packs = action.payload.data
                state.loading = false
                state.status  = action.payload.success
                state.error = action.payload.error
            })
            .addCase(fetchPackOnPalletToStore.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = packOnPalletToStore

export default reducer

export const {
    clearPackToStore
} = actions