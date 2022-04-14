import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSubOrders} from '../../server';

const initialState = {
    subOrder: {},
    loading: false,
};

export const fetchSubOrder = createAsyncThunk(
    'subOrder/fetchSubOrder',
    async (args) => {
        return await getSubOrders(args);
    }
);

const subOrderSlice = createSlice({
    name: 'subOrder',
    initialState,
    reducers: {
        clearSubOrder: state => {
            state.subOrder = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubOrder.fulfilled, (state, action) => {
                if(action.payload.data.length) state.subOrder = action.payload.data[0];
                state.loading = false;
            })
            .addCase(fetchSubOrder.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = subOrderSlice;

export default reducer;

export const {clearSubOrder} = actions;
