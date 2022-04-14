import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDetails } from '../../../server';

const initialState = {
  details: [],
  total: null,
  loading: false,
};

export const fetchDetails = createAsyncThunk(
  'details/fetchDetails',
  async (args) => {
    console.log('fetchDetails', args);
    return await getDetails(args);
  }
);

export const reloadDetails = createAsyncThunk(
    'reloadDetails/reloadDetails',
    async (args) => {
      console.log('fetchDetails', args);
      return await getDetails(args);
    }
);

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        console.log('pending');
        state.loading = true;
      })
        .addCase(reloadDetails.fulfilled, (state, action) => {
          state.details = action.payload.data;
          state.loading = false;
          if (action.payload.total) {
            state.total = action.payload.total;
          }
        })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.details = state.details.concat(action.payload.data);
        state.loading = false;
        if (action.payload.total) {
          state.total = action.payload.total;
        }
      })
      .addCase(fetchDetails.rejected, (state) => {
        console.log('rejected');
        state.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = detailsSlice;

export default reducer;

export const {} = actions;
