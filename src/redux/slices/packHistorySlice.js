import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPack } from '../../server'

const initialState = {
    pack: null,
    loading: false
}

export const fetchHistoryPackSlice = createAsyncThunk(
    'historyPackSlice/fetchHistoryPackSlice',
    async (args) => {
        console.log('argsPack', args)
        return await getPack(args)
    }
)

const shipmentHistoryPackSlice = createSlice({
    name: 'shipmentHistoryPack',
    initialState,
    reducers: {
        clearPack: state => {
            state.pack = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchHistoryPackSlice.pending, state => {
                state.loading = true
            })
            .addCase(fetchHistoryPackSlice.fulfilled, (state, action) => {
                console.log('action', action.payload)
                if(action.payload.data.length) state.pack = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchHistoryPackSlice.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentHistoryPackSlice

export default reducer
export const {
    clearPack,
} = actions



