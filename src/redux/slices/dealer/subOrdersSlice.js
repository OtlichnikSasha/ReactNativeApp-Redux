import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSubOrders} from '../../../server';

const initialState = {
    subOrders: [],
    total: null,
    loading: false,
    error: null
};

export const fetchSubOrders = createAsyncThunk(
    'subOrders/fetchSubOrders',
    async (args) => {
        console.log('subOrders', args);
        return await getSubOrders(args);
    }
);


export const reloadSubOrders = createAsyncThunk(
    'reloadSubOrders/reloadFetchSubOrders',
    async (args) => {
        return await getSubOrders(args);
    }
);

const subOrdersSlice = createSlice({
    name: 'subOrders',
    initialState,
    reducers: {
        clearSubOrders: state => {
            state.subOrders = []
            state.total = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubOrders.pending, (state) => {
                console.log('pending');
                state.loading = true;
            })
            .addCase(reloadSubOrders.fulfilled, (state, action) => {
                console.log('subOrders', action.payload)
                state.subOrders = action.payload.data;
                state.loading = false;
                if (action.payload.total) {
                    state.total = action.payload.total;
                }
            })
            .addCase(fetchSubOrders.fulfilled, (state, action) => {
                state.subOrders = state.subOrders.concat(action.payload.data);
                state.loading = false;
                if (action.payload.total) {
                    state.total = action.payload.total;
                }
            })
            .addCase(fetchSubOrders.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = subOrdersSlice;

export default reducer;

export const {clearSubOrders} = actions;
