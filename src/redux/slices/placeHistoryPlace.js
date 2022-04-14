import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPackHistory } from '../../server';

const initialState = {
    history: [],
    loading: false,
};

export const fetchPackHistory = createAsyncThunk(
    'history/fetchHistory',
    async (args) => {
        return await getPackHistory(args);
    }
);


const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        clearHistory: state => {
            state.history = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPackHistory.fulfilled, (state, action) => {
                state.history = action.payload.data
                state.loading = false;
            })
            .addCase(fetchPackHistory.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {});
    },
});

const { actions, reducer } = historySlice;

export default reducer;

export const {clearHistory} = actions;
