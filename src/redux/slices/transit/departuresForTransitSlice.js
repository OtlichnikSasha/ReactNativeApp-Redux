import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getDeparturesForTransit} from '../../../server';

const initialState = {
    departures: [],
    total: null,
    loading: false,
    error: null
};

export const fetchDeparturesForTransit = createAsyncThunk(
    'departuresForTransit/fetchDeparturesForTransit',
    async (args) => {
        args.status = 'DELIVERY'
        return await getDeparturesForTransit(args);
    }
);

export const reloadDeparturesForTransit = createAsyncThunk(
    'reloadDeparturesForTransit/reloadDeparturesForTransit',
    async (args) => {
        args.status = 'DELIVERY'
        return await getDeparturesForTransit(args);
    }
);

const departuresForTransitSlice = createSlice({
    name: 'departuresForTransit',
    initialState,
    reducers: {
        clearDepartures: (state) => {
            state.departures = []
            state.error = null
            state.total = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeparturesForTransit.pending, (state) => {
                state.loading = true;
            })
            .addCase(reloadDeparturesForTransit.fulfilled, (state, action) => {
                if(action.payload.data.hasOwnProperty("departures")){
                    state.departures = action.payload.data.departures;
                }
                state.loading = false;
                state.total = action.payload.total;
                state.error = action.payload.error;

            })
            .addCase(fetchDeparturesForTransit.fulfilled, (state, action) => {
                if(action.payload.data.hasOwnProperty("departures")){
                    state.departures = state.departures.concat(action.payload.data.departures);
                }
                state.loading = false;
                state.total = action.payload.total;
                state.error = action.payload.error;
            })
            .addCase(fetchDeparturesForTransit.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = departuresForTransitSlice;

export default reducer;

export const {clearDepartures} = actions;
