import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getCells} from '../../server'

const initialState = {
  cells: [],
}

export const fetchCells = createAsyncThunk(
  'cells/fetchCells',
  async (args) => {
    console.log('args', args)
    return await getCells(args)
  }
)

const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    clearCells: state => {
      state.cells = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCells.pending, state => {
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.cells = action.payload.data
      })
      .addCase(fetchCells.rejected, state => {
      })
      .addDefaultCase(() => {
      })
  }
})

const { actions, reducer } = cellsSlice
export default reducer
export const {
  clearCells,
} = actions