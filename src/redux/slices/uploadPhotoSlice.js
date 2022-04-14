import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {uploadPhoto} from '../../server'

const initialState = {
    result: null,
    status: false,
    loading: false
}

export const fetchUploadPhoto = createAsyncThunk(
    'uploadPhoto/fetchUploadPhoto',
    async (args) => {
        console.log('fetchUploadPhoto', args)
        return await uploadPhoto(args)
    }
)

const uploadPhotoSlice = createSlice({
    name: 'uploadPhotoSlice',
    initialState,
    reducers: {
        clearResult: state => {
            state.result = null
            state.status = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUploadPhoto.pending, state => {
                state.loading = true
            })
            .addCase(fetchUploadPhoto.fulfilled, (state, action) => {
                console.log('UploadPhotoData', action.payload)
                state.result = action.payload.data.result
                state.status = action.payload.success
                state.loading = false
            })
            .addCase(fetchUploadPhoto.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = uploadPhotoSlice

export default reducer

export const {
    clearResult
} = actions