import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {awayOrders} from "../../../server";
const initialState = {
    result: '',
    status: ''
};

export const sendAwayPackIDs = createAsyncThunk(
    'sendAwayPacks/sendAwayPackIDs',
    async (data) => {
        return await awayOrders(data);
    }
);

const sendAwayPacksSlice = createSlice({
    name: 'sendAwayPacks',
    initialState,
    reducers: {
        clearResult: state => {
            state.result = ''
            state.status = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendAwayPackIDs.pending, (state) => {
                state.loading = true;
            })

            .addCase(sendAwayPackIDs.fulfilled, (state, action) => {
                state.status = action.payload.success;
                state.result = action.payload.data.result;
                state.loading = false;
            })
            .addCase(sendAwayPackIDs.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {});
    },
});

const { actions, reducer } = sendAwayPacksSlice;

export default reducer;

export const { clearResult } = actions;