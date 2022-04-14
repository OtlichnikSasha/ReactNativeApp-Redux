import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login } from '../../server'

const initialState = {
	loading: false,
	hasError: false,
	loginError: false,
	role: null,
	name: null
}

export const authLogin = createAsyncThunk(
	'user/authLogin',
	async (data) => {
		return await login(data)
	}
)

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setRole: (state, action) => {
			state.role = action.payload
		},
		setName: (state, action) => {
			state.name = action.payload
		},
		setErrors: (state) => {
			state.hasError = false
			state.loginError = false
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(authLogin.pending, state => {
				state.loading = true
			})
			.addCase(authLogin.fulfilled, (state, action) => {
				console.log('action.payload', action.payload)
				if (action.payload.success) {
					state.role = action.payload.data.role
					state.name = action.payload.data.login
				} else if (action.payload.error) {
					state.loginError = true
					state.hasError = true
				}
				state.loading = false
			})
			.addCase(authLogin.rejected, (state) => {
				state.hasError = true
				state.loading = false
			})
			.addDefaultCase(() => {
			})
	}
})

const { actions, reducer } = userSlice

export default reducer

export const {
	setRole,
	setName,
	setErrors
} = actions