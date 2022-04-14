import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {acceptTransitCar} from "../../../server";

const initialState = {
    result: '',
    success: false
};
export const sendAcceptedCar = createAsyncThunk(
    'sendDeparturePacks/sendAcceptedPackIDs',
    async (data) => {
        return await acceptTransitCar(data);
    }
);

const sendAcceptedCarSlice = createSlice({
    name: 'acceptedDepartureCar',
    initialState,
    reducers: {
        clearAcceptResult: state => {
            state.result = ''
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendAcceptedCar.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendAcceptedCar.fulfilled, (state, action) => {
                console.log("accepted car action.payload", action.payload)
                state.success = action.payload.success;
                state.result = action.payload.data.data;
                state.loading = false;
            })
            .addCase(sendAcceptedCar.rejected, (state) => {
                state.loading = false;
            })
            .addDefaultCase(() => {});
    },
});

const { actions, reducer } = sendAcceptedCarSlice;

export default reducer;

export const { clearAcceptResult } = actions;