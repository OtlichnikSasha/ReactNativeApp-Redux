import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getPacks, acceptDepartures, sendImage} from '../../../server';

const initialState = {
    packs: [],
    total: null,
    loading: false,
    uploadResult: {},
    transitWarehouseId: 0, //?
    data: {},
    generalTotal: 0
};

export const fetchDeparturePacks = createAsyncThunk(
    'departurePacks/fetchDeparturePacks',
    async (args) => {
        args.status = "DELIVERY"
        args.withDetails = true
        return await getPacks(args);
    }
);

export const reloadDeparturePacks = createAsyncThunk(
    'departurePacks/reloadDeparturePacks',
    async (args) => {
        args.status = "DELIVERY"
        args.withDetails = true
        console.log('args', args)
        return await getPacks(args);
    }
);

export const sendPhoto = createAsyncThunk(
    'departurePacks/sendPhoto',
    async (data) => {
        return await sendImage(data);
    }
);


const departurePacksSlice = createSlice({
    name: 'departurePacks',
    initialState,
    reducers: {
        addAcceptPacks(state, action) {
            state.data = action.payload;
        },
        clearPacks(state) {
            state.packs = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeparturePacks.pending, (state) => {
                state.loading = true;
            })
            .addCase(reloadDeparturePacks.fulfilled, (state, action) => {
                state.packs = action.payload.data;
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchDeparturePacks.fulfilled, (state, action) => {
                state.packs = state.packs.concat(action.payload.data);
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(sendPhoto.fulfilled, (state, action) => {
                state.uploadResult = action.payload.data.result;
                state.loading = false;
            })
            .addCase(fetchDeparturePacks.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = departurePacksSlice;

export default reducer;

export const {addAcceptPacks, clearPacks} = actions;
