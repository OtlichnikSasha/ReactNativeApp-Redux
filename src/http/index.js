import axios from 'axios'
import { APP_SERVER_BASE } from '@env'
import jwtDecode from 'jwt-decode'
import * as SecureStore from 'expo-secure-store'

export const http = axios.create({
	withCredentials: true,
	baseURL: APP_SERVER_BASE
})

let token = null

export async function getToken () {
	return await SecureStore.getItemAsync('access_token')
}

async function getRefreshToken () {
	return await SecureStore.getItemAsync('refresh_token')
}

export async function getUser () {
	const tokenData = await getToken()
	if (tokenData) {
		return jwtDecode(tokenData)
	}
}

export async function saveToken (accessToken, refreshToken) {
	await SecureStore.setItemAsync('access_token', accessToken)
	await SecureStore.setItemAsync('refresh_token', refreshToken)
	token = await SecureStore.getItemAsync('access_token')
	if (token) {
		return jwtDecode(token)
	}
}

const refreshRequest = async (baseUrl, token) => {
	const refreshToken = await getRefreshToken()
	return await axios.post(`${baseUrl}auth/refresh`, { refreshToken }, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		withCredentials: true
	})
}

http.interceptors.request.use(async (options) => {
	token = await getToken()
	if (token) {
		const decoded = jwtDecode(token)
		if (Date.now() >= (decoded.exp - 10) * 1000) {
			const res = await refreshRequest(options.baseURL, token)
			if (res.status === 200) {
				await saveToken(res.data.token, res.data.refreshToken)
				options.headers.Authorization = `Bearer ${res.data.token}`
				return options
			}
		}
		options.headers.Authorization = `Bearer ${token}`
	}
	return options
})

http.interceptors.response.use(
	(config) => {
		return config
	},
	async (error) => {
		const originalRequest = error.config
		if (
			error?.response?.status === 401 &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			token = await getToken()
			if (token) {
				try {
					const res = await refreshRequest(error.config.baseURL, token)
					if (res.status === 200) {
						await saveToken(res.data.token, res.data.refreshToken)
						return http.request(originalRequest)
					}
				} catch (e) {
					throw error
				}
			}
		}
		throw error
	}
)