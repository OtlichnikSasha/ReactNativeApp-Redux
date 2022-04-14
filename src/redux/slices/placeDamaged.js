import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {placeDamaged} from '../../server'

const initialState = {
    result: null,
    status: '',
    error: '',
    loading: false
}

export const fetchPlaceDamaged = createAsyncThunk(
    'placeDamaged/fetchPlaceDamaged',
    async (args) => {
        return await placeDamaged(args)
    }
)

const placeDamagedSlice = createSlice({
    name: 'placeDamagedSlice',
    initialState,
    reducers: {
        clearPack: state => {
            state.result = null
            state.status = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaceDamaged.pending, state => {
                state.loading = true
            })
            .addCase(fetchPlaceDamaged.fulfilled, (state, action) => {
                console.log('fetchPlaceDamaged', action.payload)
                state.result = action.payload.data
                state.loading = false
                state.status  = action.payload.success
                state.error  = action.payload.error

            })
            .addCase(fetchPlaceDamaged.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = placeDamagedSlice

export default reducer

export const {
    clearPack
} = actions