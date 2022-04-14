import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getPoints} from '../../server'

const initialState = {
    point: null,
    loading: false
}

export const fetchPoint = createAsyncThunk(
    'point/fetchPoint',
    async (args) => {
        return await getPoints(args)
    }
)

const pointSlice = createSlice({
    name: 'point',
    initialState,
    reducers: {
        clearPoint: state => {
            state.point = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoint.pending, state => {
                state.loading = true
            })
            .addCase(fetchPoint.fulfilled, (state, action) => {
                if(action.payload.data.length) state.point = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchPoint.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})
const { actions, reducer } = pointSlice
export const {
    clearPoint,
} = actions

export default reducer