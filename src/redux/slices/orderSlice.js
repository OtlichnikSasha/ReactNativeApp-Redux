import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders } from '../../server';

const initialState = {
    order: {},
    loading: false,
};

export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async (args) => {
        return await getOrders(args);
    }
);


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: state => {
            state.order = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                console.log('order', action.payload.data)
                if(action.payload.data.length) state.order = action.payload.data[0]
                state.loading = false;
            })
            .addCase(fetchOrder.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {});
    },
});

const { actions, reducer } = orderSlice;

export default reducer;

export const {clearOrder} = actions;
