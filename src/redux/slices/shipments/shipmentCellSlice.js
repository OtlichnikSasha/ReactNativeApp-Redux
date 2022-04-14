import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCell } from '../../../server'

const initialState = {
    cell: {},
    id: null,
    loading: false,
}

export const fetchShipmentPack = createAsyncThunk(
    'shipmentCell/fetchShipmentCell',
    async (args) => {
        console.log('argsCell', args)
        return await getCell(args)
    }
)

const shipmentCellSlice = createSlice({
    name: 'shipmentCell',
    initialState,
    reducers: {
        clearCell: state => {
            state.cell = {}
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentPack.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentPack.fulfilled, (state, action) => {
                state.loading = false
                if (!action.payload.data.length) {
                    return
                }
                state.cell = state.cell.concat(action.payload.data)
            })
            .addCase(fetchShipmentPack.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = shipmentCellSlice

export default reducer
export const {
    clearCell,
} = actions



