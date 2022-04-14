import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPacksOnPallet } from '../../server'

const initialState = {
	packs: [],
	total: null,
	loading: false
}

export const fetchPointPalletPacks = createAsyncThunk(
	'pointPalletPacks/fetchPointPalletPacks',
	async (args) => {
		args.status = 'ON_PALLET_TO_STORE'
		args.palletType = 'TO_STORE'
		return await getPacksOnPallet(args)
	}
)


export const reloadPointPalletPacks = createAsyncThunk(
	'reloadPointPalletPacks/fetchReloadPointPalletPacks',
	async (args) => {
		args.status = 'ON_PALLET_TO_STORE'
		args.palletType = 'TO_STORE'
		return await getPacksOnPallet(args)
	}
)

const pointPalletPackSlice = createSlice({
	name: 'pointPalletPacks',
	initialState,
	reducers: {
		clearPointPalletPacks: state => {
			state.packs = []
			state.total = null
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(reloadPointPalletPacks.pending, state => {
				state.loading = true
			})
			.addCase(reloadPointPalletPacks.fulfilled, (state, action) => {
				state.packs = action.payload.data
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(reloadPointPalletPacks.rejected, state => {
				state.loading = false
			})
			.addCase(fetchPointPalletPacks.pending, state => {
				state.loading = true
			})
			.addCase(fetchPointPalletPacks.fulfilled, (state, action) => {
				state.packs = state.packs.concat(action.payload.data)
				state.loading = false
				state.total = action.payload.total
			})
			.addCase(fetchPointPalletPacks.rejected, state => {
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = pointPalletPackSlice

export default reducer

export const {
	clearPointPalletPacks
} = actions