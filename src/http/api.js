import { http } from './index';

export class api {

	static async get (url, args) {
		let result = {
			success: false,
			data: [],
			error: '',
			total: null
		};
		try {
			const res = await http.get(url, { params: { ...args } })
			if (res.status === 200) {
				result.success = true;
				result.total = res.data.total;
				result.data = res.data.result;
			}
		} catch (e) {
			console.log('error', e.response.data.error)
			result.error = e.response.data.error
		}
		return result;
	}

	static async post (url, data = {}, args) {
		let result = {
			success: false,
			data: [],
			error: '',
			total: null,
			status: null
		};
		try {
			const res = await http.post(url, data, { params: { ...args } })
			console.log('res', res)
			if (res.status === 200) {
				result.success = true;
				result.data = res.data;
				result.status = res.status;
			}
		} catch (e) {
			console.log('e.response', e.response)
			console.log('error', e.response.data.error)
			result.error = e.response.data.error
			return result
		}
		return result
	}

	static async put (url, data = {}, args) {
		let result = {
			success: false,
			data: [],
			error: '',
			total: null
		};
		try {
			const res = await http.put(url, data, { params: { ...args } });
			if (res.status === 200) {
				result.success = true;
				result.data = res.data.result;
			}
		} catch (e) {
			throw e;
		}
		return result;
	}

	static async delete (url, args) {
		let result = {
			success: false,
			data: [],
			error: '',
			total: null
		};
		try {
			const res = await http.delete(url, { params: { ...args } });
			if (res.status === 200) {
				result.success = true;
				result.data = res.data.result;
			}
		} catch (e) {
			throw e;
		}
		return result;
	}
}
