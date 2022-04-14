import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPacksOnPallet } from '../../server'

const initialState = {
	packs: [],
	total: null,
	loading: false,
	stackTotal: null
}

export const fetchSectorPalletPacks = createAsyncThunk(
	'sectorPacks/fetchSectorPalletPacks',
	async (args) => {
		args.status = 'ON_PALLET_TO_SECTOR'
		args.palletType = 'TO_SECTION'
		return await getPacksOnPallet(args)
	}
)


export const reloadSectorPalletPacks = createAsyncThunk(
	'reloadSectorPacks/fetchReloadSectorPalletPacks',
	async (args) => {
		args.status = 'ON_PALLET_TO_SECTOR'
		args.palletType = 'TO_SECTION'
		console.log('args', args)
		return await getPacksOnPallet(args)
	}
)


export const totalSectorPalletPacks = createAsyncThunk(
	'totalSectorPacks/fetchTotalSectorPalletPacks',
	async (args) => {
		args.status = 'ON_PALLET_TO_SECTOR'
		args.palletType = 'TO_SECTION'
		return await getPacksOnPallet(args)
	}
)

const sectorPalletPacksSlice = createSlice({
	name: 'sectorPalletPacks',
	initialState,
	reducers: {
		clearSectorPalletPacks: state => {
			state.packs = []
			state.total = null
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(reloadSectorPalletPacks.pending, state => {
				state.loading = true
			})
			.addCase(totalSectorPalletPacks.fulfilled, (state, action) => {
				state.stackTotal = action.payload.total
			})
			.addCase(reloadSectorPalletPacks.fulfilled, (state, action) => {
				state.packs = state.packs = action.payload.data
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(reloadSectorPalletPacks.rejected, state => {
				state.loading = false
			})
			.addCase(fetchSectorPalletPacks.pending, state => {
				state.loading = true
			})
			.addCase(fetchSectorPalletPacks.fulfilled, (state, action) => {
				state.packs = state.packs.concat(action.payload.data)
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(fetchSectorPalletPacks.rejected, state => {
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = sectorPalletPacksSlice

export default reducer

export const {
	clearSectorPalletPacks
} = actions