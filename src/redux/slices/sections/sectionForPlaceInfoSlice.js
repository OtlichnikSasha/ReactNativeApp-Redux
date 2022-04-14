import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getSection} from '../../../server'

const initialState = {
    section: null,
    loading: null
}

export const fetchSectionForPlaceInfo = createAsyncThunk(
    'sectionForPlace/fetchSectionForPlaceInfo',
    async (args) => {
        console.log('sectionArgs', args)
        return await getSection(args)
    }
)

const sectionForPlaceInfoSlice = createSlice({
    name: 'sectionForPlaceInfo',
    initialState,
    reducers: {
        clearSection: state => {
            state.section = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSectionForPlaceInfo.pending, state => {
                state.loading = true
            })
            .addCase(fetchSectionForPlaceInfo.fulfilled, (state, action) => {
                if(action.payload.data.length) state.section = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchSectionForPlaceInfo.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = sectionForPlaceInfoSlice
export const {clearSection} = actions;
export default reducer