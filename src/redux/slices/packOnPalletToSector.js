import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {palletToSectorPacks} from '../../server'

const initialState = {
    status: false,
    loading: false,
    error: null
}

export const fetchPackOnPalletToSector = createAsyncThunk(
    'packOnPalletToSector/fetchPackOnPalletToSector',
    async (args) => {
        console.log('argsPackOnPalletToSector', args)
        return await palletToSectorPacks(args)
    }
)

const packOnPalletToSector = createSlice({
    name: 'packToSector',
    initialState,
    reducers: {
        clearPalletPack: state => {
            state.status = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackOnPalletToSector.pending, state => {
                state.loading = true
            })
            .addCase(fetchPackOnPalletToSector.fulfilled, (state, action) => {
                console.log('fetchPackOnPalletToSector', action.payload)
                state.loading = false
                state.status = action.payload.success
                state.error = action.payload.error

            })
            .addCase(fetchPackOnPalletToSector.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = packOnPalletToSector

export default reducer

export const {
    clearPalletPack
} = actions