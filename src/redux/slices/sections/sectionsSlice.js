import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSections } from '../../../server'

const initialState = {
	sections: [],
	loading: false
}

export const fetchSections = createAsyncThunk(
	'sections/fetchSections',
	async (args) => {
		return await getSections(args)
	}
)

const sectionsSlice = createSlice({
	name: 'sections',
	initialState,
	reducers: {
		clearSections: state => {
			state.sections = []
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSections.pending, state => {
				state.loading = true
			})
			.addCase(fetchSections.fulfilled, (state, action) => {
				state.sections = action.payload.data
				state.loading = false
			})
			.addCase(fetchSections.rejected, state => {
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = sectionsSlice
export const {
	clearSections,
} = actions
export default reducer