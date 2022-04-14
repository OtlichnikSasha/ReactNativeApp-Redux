import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getPacks, acceptDepartures, awayOrders} from '../../../server';

const initialState = {
    packs: [],
    total: null,
    loading: false,
    transitWarehouseId: 0, //?
    data: {},
};

export const fetchWarehousePacks = createAsyncThunk(
    'warehousePacks/fetchWarehousePacks',
    async (args) => {
        args.status = "ACCEPTED_TRANSIT_STORE"
        return await getPacks(args);
    }
);

export const reloadWarehousePacks = createAsyncThunk(
    'reloadWarehousePacks/reloadFetchWarehousePacks',
    async (args) => {
        args.status = "ACCEPTED_TRANSIT_STORE"
        return await getPacks(args);
    }
);


const warehousePacksSlice = createSlice({
    name: 'warehousePacks',
    initialState,
    reducers: {
        addAwayPacks(state, action) {
            state.data = action.payload;
        },
        clearPacks(state) {
            state.packs = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarehousePacks.pending, (state) => {
                state.loading = true;
            })
            .addCase(reloadWarehousePacks.fulfilled, (state, action) => {
                state.packs = action.payload.data;
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchWarehousePacks.fulfilled, (state, action) => {
                state.packs = state.packs.concat(action.payload.data);
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchWarehousePacks.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = warehousePacksSlice;

export default reducer;

export const {addAwayPacks, clearPacks} = actions;
