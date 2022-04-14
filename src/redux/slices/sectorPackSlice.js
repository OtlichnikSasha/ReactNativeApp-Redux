import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {getPacks, getWarehouseSectorPacks} from '../../server'

const initialState = {
	packs: [],
	total: null,
	loading: false,
	stackTotal: null
}

export const fetchSectorPacks = createAsyncThunk(
	'sectorPacks/fetchSectorPacks',
	async (args) => {
		console.log('argsSectorPackSlice', args)
		return await getWarehouseSectorPacks(args)
	}
)

export const reloadSectorPacks = createAsyncThunk(
	'reloadSectorPacks/fetchReloadSectorPacks',
	async (args) => {
		console.log('argsSectorPackSlice', args)
		return await getWarehouseSectorPacks(args)
	}
)

export const totalSectorPacks = createAsyncThunk(
	'totalSectorPacks/fetchTotalSectorPacks',
	async (args) => {
		args.status = 'ON_STORE'
		args.haveDeparture = true
		return await getPacks(args)
	}
)

const sectorPacksSlice = createSlice({
	name: 'sectorPacks',
	initialState,
	reducers: {
		clearSectorPacks: state => {
			state.packs = []
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(reloadSectorPacks.pending, state => {
				state.loading = true
			})
			.addCase(totalSectorPacks.fulfilled, (state, action) => {
				state.stackTotal = action.payload.total
			})
			.addCase(reloadSectorPacks.fulfilled, (state, action) => {
				console.log('reloadSectorPacks', action.payload)
				if (action.payload.data.length) {
					state.packs = action.payload.data
				}
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(reloadSectorPacks.rejected, state => {
				state.loading = false
			})
			.addCase(fetchSectorPacks.pending, state => {
				state.loading = true
			})
			.addCase(fetchSectorPacks.fulfilled, (state, action) => {
				if (action.payload.data.length) {
					state.packs = state.packs.concat(action.payload.data)
				}
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(fetchSectorPacks.rejected, state => {
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = sectorPacksSlice

export default reducer

export const {
	clearSectorPacks
} = actions