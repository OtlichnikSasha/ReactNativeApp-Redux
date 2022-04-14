import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getWarehouses} from '../../server'

const initialState = {
    warehouses: []
}

export const fetchWarehouses = createAsyncThunk(
  'warehouses/fetchWarehouses',
  async (args) => {
    return await getWarehouses(args)
  }
)

const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, state => {
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.warehouses = action.payload.data
      })
      .addCase(fetchWarehouses.rejected, state => {
      })
      .addDefaultCase(() => {
      })
  }
})

const { reducer } = warehousesSlice

export default reducer