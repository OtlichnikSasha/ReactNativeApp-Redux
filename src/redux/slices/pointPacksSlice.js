import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPacks } from '../../server'

const initialState = {
	packs: [],
	total: null,
	loading: false
}

export const fetchPointPacks = createAsyncThunk(
	'pointPacks/fetchPointPacks',
	async (args) => {
		console.log('fetch', args)
		args.status = 'CREATED'
		return await getPacks(args)
	}
)


export const reloadPointPacks = createAsyncThunk(
	'reloadPointPacks/fetchReloadPointPacks',
	async (args) => {
		console.log('fetch', args)
		args.status = 'CREATED'
		return await getPacks(args)
	}
)

const pointPacksSlice = createSlice({
	name: 'pointPacks',
	initialState,
	reducers: {
		clearPacks: state => {
			state.packs = []
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(reloadPointPacks.pending, state => {
				state.loading = true
			})
			.addCase(reloadPointPacks.fulfilled, (state, action) => {
				state.packs = action.payload.data
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(reloadPointPacks.rejected, state => {
				state.loading = false
			})
			.addCase(fetchPointPacks.pending, state => {
				state.loading = true
			})
			.addCase(fetchPointPacks.fulfilled, (state, action) => {
				state.packs = state.packs.concat(action.payload.data)
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(fetchPointPacks.rejected, state => {
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = pointPacksSlice

export default reducer

export const {
	clearPacks
} = actions