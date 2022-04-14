import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getPoints} from '../../server'

const initialState = {
  points: [],
}

export const fetchPoints = createAsyncThunk(
  'points/fetchPoints',
  async (args) => {
    return await getPoints(args)
  }
)

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, state => {
      })
      .addCase(fetchPoints.fulfilled, (state, action) => {
        state.points = action.payload.data
      })
      .addCase(fetchPoints.rejected, state => {
      })
      .addDefaultCase(() => {
      })
  }
})

const { reducer } = pointsSlice

export default reducer