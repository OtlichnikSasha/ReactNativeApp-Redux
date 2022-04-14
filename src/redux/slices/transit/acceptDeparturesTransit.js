import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {acceptDepartures} from "../../../server";
const initialState = {
    result: false,
    status: false,
    error: null
};
export const sendAcceptedPackIDs = createAsyncThunk(
    'sendDeparturePacks/sendAcceptedPackIDs',
    async (data) => {
        return await acceptDepartures(data);
    }
);

const sendAcceptedPacksSlice = createSlice({
    name: 'acceptedDeparturePacks',
    initialState,
    reducers: {
        clearResult: state => {
            state.result = null
            state.status = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendAcceptedPackIDs.pending, (state) => {
                state.loading = true;
            })

            .addCase(sendAcceptedPackIDs.fulfilled, (state, action) => {
                state.status = action.payload.success;
                state.result = action.payload.data.result;
                state.error = action.payload.error;
                state.loading = false;
            })
            .addCase(sendAcceptedPackIDs.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {});
    },
});

const { actions, reducer } = sendAcceptedPacksSlice;

export default reducer;

export const { clearResult } = actions;