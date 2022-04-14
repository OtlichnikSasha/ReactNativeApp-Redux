import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getCells} from '../../server'

const initialState = {
    cell: null,
    loading: false
}

export const fetchCell = createAsyncThunk(
    'cell/fetchCell',
    async (args) => {
        console.log('args', args)
        return await getCells(args)
    }
)

const cellSlice = createSlice({
    name: 'cell',
    initialState,
    reducers: {
        clearCell: state => {
            state.cell = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCell.pending, state => {
                state.loading = true
            })
            .addCase(fetchCell.fulfilled, (state, action) => {
                if(action.payload.data.length) state.cell = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchCell.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = cellSlice
export default reducer
export const {
    clearCell,
} = actions