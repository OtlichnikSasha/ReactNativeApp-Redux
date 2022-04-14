import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {packsCount} from '../../server'

const initialState = {
    result: 0,
    loading: false,
}

export const fetchPacksCount = createAsyncThunk(
    'packsCount/fetchPacksCount',
    async (args) => {
        args.args = "isDefect=false&haveDeparture=true&status=ON_STORE&status=ON_PALLET_TO_SECTOR&status=STAYED_ON_SECTOR"
        return await packsCount(args)
    }
)

const packsCountForSector = createSlice({
    name: 'packsCountForSector',
    initialState,
    reducers: {
        clearPacksCount: state => {
            state.result = 0
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPacksCount.pending, state => {
                state.loading = true
            })
            .addCase(fetchPacksCount.fulfilled, (state, action) => {
                console.log('packsCount', action.payload)
                state.loading = false
                state.result  = action.payload.data
                state.error  = action.payload.error

            })
            .addCase(fetchPacksCount.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = packsCountForSector

export default reducer

export const {
    clearPacksCount
} = actions