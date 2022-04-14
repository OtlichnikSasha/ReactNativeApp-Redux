import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPacks } from '../../../server';

const initialState = {
  packs: [],
  total: null,
  loading: false,
};

export const fetchDealerPacks = createAsyncThunk(
  'dealerPacks/fetchDealerPacks',
  async (args) => {
    console.log('dealerPacks args', args);
    return await getPacks(args);
  }
);

export const reloadDealerPacks = createAsyncThunk(
    'reloadDealerPacks/reloadDealerPacks',
    async (args) => {
      console.log('dealerPacks args', args);
      return await getPacks(args);
    }
);

const dealerPacksSlice = createSlice({
  name: 'dealerPacks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealerPacks.pending, (state) => {
        console.log('pending');
        state.loading = true;
      })
        .addCase(reloadDealerPacks.fulfilled, (state, action) => {
          state.packs = action.payload.data
          state.loading = false;
          if (action.payload.total) {
            state.total = action.payload.total;
          }
        })
      .addCase(fetchDealerPacks.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        state.packs = state.packs.concat(action.payload.data);
        state.loading = false;
        if (action.payload.total) {
          state.total = action.payload.total;
        }
      })
      .addCase(fetchDealerPacks.rejected, (state) => {
        console.log('rejected');
        state.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = dealerPacksSlice;

export default reducer;

export const {} = actions;
