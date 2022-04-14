import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getPallet} from '../../server'

const initialState = {
    pallet: [],
}

export const fetchPallets = createAsyncThunk(
    'pallets/fetchPallets',
    async (args) => {
        console.log('argsPallets', args)
        return await getPallet(args)
    }
)

const palletsSlice = createSlice({
    name: 'pallets',
    initialState,
    reducers: {
        clearPallet: state => {
            state.pallet = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPallets.pending, state => {
            })
            .addCase(fetchPallets.fulfilled, (state, action) => {
                console.log('palletsSlice', action.payload)
                if(action.payload.data.length) state.pallet = action.payload.data
            })
            .addCase(fetchPallets.rejected, state => {
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = palletsSlice
export default reducer
export const {
    clearPallet,
} = actions