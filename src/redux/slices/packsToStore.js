import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {palletToStore} from '../../server'

const initialState = {
    status: '',
    loading: false,
    error: null
}

export const fetchPackToStore = createAsyncThunk(
    'packToStore/fetchPackToStore',
    async (args) => {
        return await palletToStore(args)
    }
)

const packToStore = createSlice({
    name: 'packToStore',
    initialState,
    reducers: {
        clearPackStore: state => {
            state.status = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackToStore.pending, state => {
                state.loading = true
            })
            .addCase(fetchPackToStore.fulfilled, (state, action) => {
                state.loading = false
                state.status  = action.payload.success
                state.error  = action.payload.error

            })
            .addCase(fetchPackToStore.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = packToStore

export default reducer

export const {
    clearPackStore
} = actions