import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getSection} from '../../../server'

const initialState = {
    section: null,
    loading: null
}

export const fetchSection = createAsyncThunk(
    'section/fetchSection',
    async (args) => {
        console.log('sectionArgs', args)
        return await getSection(args)
    }
)

const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
        clearSection: state => {
            state.section = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSection.pending, state => {
                state.loading = true
            })
            .addCase(fetchSection.fulfilled, (state, action) => {
                if(action.payload.data.length) state.section = action.payload.data[0]
                state.loading = false
            })
            .addCase(fetchSection.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const { actions, reducer } = sectionSlice
export const {clearSection} = actions;
export default reducer