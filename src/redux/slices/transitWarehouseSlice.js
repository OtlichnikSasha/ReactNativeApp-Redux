import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getTransitWarehouses} from '../../server'

const initialState = {
    warehouse: {},
    loading: false
}

export const fetchTransitWarehouse = createAsyncThunk(
    'transitWarehouse/fetchTransitWarehouse',
    async (args) => {
        return await getTransitWarehouses(args)
    }
)

const TransitWarehouse = createSlice({
    name: 'transitWarehouse',
    initialState,
    reducers: {
        clearWarehouse: state => {
            state.warehouse = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransitWarehouse.pending, state => {
                state.loading = true
            })
            .addCase(fetchTransitWarehouse.fulfilled, (state, action) => {
                if(action.payload.data.length) state.warehouse = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchTransitWarehouse.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = TransitWarehouse
export default reducer
export const {
    clearWarehouse,
} = actions