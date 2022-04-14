import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {packToSector} from '../../server'

const initialState = {
    status: false,
    loading: false,
    error: null
}

export const fetchPackToSector = createAsyncThunk(
    'packToSector/fetchPackToSector',
    async (args) => {
        console.log('argsPackToSector', args)
        return await packToSector(args)
    }
)

const packToSect = createSlice({
    name: 'packToSector',
    initialState,
    reducers: {
        clearSectorPack: state => {
            state.status = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackToSector.pending, state => {
                state.loading = true
            })
            .addCase(fetchPackToSector.fulfilled, (state, action) => {
                console.log('fetchPackToSector', action.payload)
                state.status  = action.payload.success
                state.error  = action.payload.error
                state.loading = false
            })
            .addCase(fetchPackToSector.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = packToSect

export default reducer

export const {
    clearSectorPack
} = actions