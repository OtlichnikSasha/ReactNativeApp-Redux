import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders } from '../../../server';

const initialState = {
  orders: [],
  total: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (args) => {
    console.log('orders', args);
    return await getOrders(args);
  }
);

export const reloadOrders = createAsyncThunk(
    'reloadOrders/reloadFetchOrders',
    async (args) => {
      return await getOrders(args);
    }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
      clearOrders: state => {
          state.orders = []
          state.total = null
          state.error = null
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
        .addCase(reloadOrders.fulfilled, (state, action) => {
            console.log('orders', action.payload)
          state.orders = action.payload.data;
          state.error = action.payload.error;
          state.loading = false;
          if (action.payload.total) {
            state.total = action.payload.total;
          }
        })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = state.orders.concat(action.payload.data);
        state.loading = false;
        if (action.payload.total) {
          state.total = action.payload.total;
        }
      })
      .addCase(fetchOrders.rejected, (state) => {
        console.log('rejected');
        state.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = ordersSlice;

export default reducer;

export const {clearOrders} = actions;
