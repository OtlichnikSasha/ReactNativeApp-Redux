import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getTransitWarehouses} from '../../server'

const initialState = {
    warehouses: [],
    loading: false
}

export const fetchTransitWarehouses = createAsyncThunk(
    'transitWarehouses/fetchTransitWarehouses',
    async (args) => {
        return await getTransitWarehouses(args)
    }
)

const TransitWarehouses = createSlice({
    name: 'transitWarehouses',
    initialState,
    reducers: {
        clearWarehouses: state => {
            state.warehouses = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransitWarehouses.pending, state => {
                state.loading = true
            })
            .addCase(fetchTransitWarehouses.fulfilled, (state, action) => {
                state.warehouses = action.payload.data
                state.loading = false
                state.total = action.payload.total
            })
            .addCase(fetchTransitWarehouses.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = TransitWarehouses
export default reducer
export const {
    clearWarehouses,
} = actions