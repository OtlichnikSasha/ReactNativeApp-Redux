import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getDepartures} from '../../server'

const initialState = {
    departure: {},
    loading: false,
}

export const fetchDeparture = createAsyncThunk(
    'departure/fetchDeparture',
    async (args) => {
        return await getDepartures(args)
    }
)

const departureSlice = createSlice({
    name: 'departure',
    initialState,
    reducers: {
        clearDeparture: state => {
            state.departure = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeparture.pending, state => {
                state.loading = true
            })
            .addCase(fetchDeparture.fulfilled, (state, action) => {
                if(action.payload.data.length) state.departure = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchDeparture.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = departureSlice

export default reducer
export const {
    clearDeparture,
} = actions



