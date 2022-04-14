import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getDepartures} from '../../../server';

const initialState = {
    departures: [],
    total: null,
    loading: false,
};

export const fetchDepartures = createAsyncThunk(
    'departures/fetchDepartures',
    async (args) => {
        console.log('departures', args);
        return await getDepartures(args);
    }
);

export const reloadDepartures = createAsyncThunk(
    'departures/reloadDepartures',
    async (args) => {
        console.log('departures', args);
        return await getDepartures(args);
    }
);

const departuresSlice = createSlice({
    name: 'departures',
    initialState,
    reducers: {
        clearDepartures: (state) => {
          state.departures = [];
          state.total = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartures.pending, (state) => {
                console.log('pending');
                state.loading = true;
            })
            .addCase(reloadDepartures.fulfilled, (state, action) => {
                console.log('action.payload', action.payload);
                state.departures = action.payload.data;
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchDepartures.fulfilled, (state, action) => {
                console.log('action.payload', action.payload);
                state.departures = state.departures.concat(action.payload.data);
                state.loading = false;
                if (action.payload.total) {
                    state.total = action.payload.total;
                }
            })
            .addCase(fetchDepartures.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = departuresSlice;

export default reducer;

export const {clearDepartures} = actions;
