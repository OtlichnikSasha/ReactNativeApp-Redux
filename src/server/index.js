import { api } from '../http/api';
import { saveToken } from '../http/index';

export const login = async (data) => {
	const url = 'auth/login';
	const res = await api.post(url, data)
	if (res.success) {
		res.data = await saveToken(res.data.token, res.data.refreshToken)
	}
	return res
};

export const getPacks = async (args) => {
	const url = `packs`;
	args.isDefect = false
	return await api.get(url, args);
};

export const getShipmentSectorPacks = async (args) => {
	const url = `packs?${args.args}`;
	return await api.get(url);
};

export const getPartialPacks = async (args) => {
	const url = `packs?${args.args}`;
	return await api.get(url);
};

export const getPreparedPallets = async (args) => {
	const url = `preparedPallets`;
	return await api.get(url, args);
};

export const getWarehouseSectorPacks = async (args) => {
	const url = `packs?${args.args}`;
	return await api.get(url);
};


export const getPacksOnPallet = async (args) => {
	const url = `packs/pallets`;
	args.isDefect = false
	return await api.get(url, args);
};


export const getPack = async (args) => {
	const url = `packs`;
	return await api.get(url, args);
};

export const getPackHistory = async (args) => {
	const url = `history`;
	return await api.get(url, args);
};

export const packsCount = async (args) => {
	const url = `packsCount?${args.args}`;
	return await api.get(url);
};

export const getPoints = async (args) => {
	const url = `points`;
	return await api.get(url, args);
};

export const getWarehouses = async (args) => {
	const url = `warehouses`;
	return await api.get(url, args);
};

export const getCells = async (args) => {
	const url = `storageCells`;
	return await api.get(url, args);
};
export const getCell = async (args) => {
	const url = `storageCells`;
	const res = await api.get(url, args);
	return res.data[0];
};

export const getSections = async (args) => {
	const url = `sections`;
	return await api.get(url, args);
};

export const getSection = async (args) => {
	const url = `sections`;
	return await api.get(url, args);
};

export const getScanPack = async (args) => {
	const url = `scan`;
	return await api.get(url, args);
};

export const getDepartures = async (args) => {
	const url = `departures`;
	return await api.get(url, args);
};

export const getTransitWarehouses = async (args) => {
	const url = `transitWarehouses`;
	return await api.get(url, args);
};

export const shipmentPackDelivery = async (data) => {
	const url = `packs/delivery`;
	return await api.post(url, data);
};

export const shipmentSendCar = async (data) => {
	const url = `departures/sendCar`;
	const fileIDs = {
		'fileIDs': data.fileIDs
	}
	delete data.fileIDs
	return await api.post(url, fileIDs, data);
};

export const palletToStore = async (data) => {
	const url = `packs/onStore`;
	return await api.post(url, data);
};

export const palletToStorePacks = async (data) => {
	const url = `packs/onPalletToStore`;
	return await api.post(url, data);
};

export const palletToSectorPacks = async (data) => {
	const url = `packs/onPalletToSector`;
	return api.post(url, data);
};

export const packToSector = async (data) => {
	const url = `packs/onSector`;
	return api.post(url, data);
};

export const fromSectorOnPallet = async (data) => {
	const url = `packs/fromSectorOnPallet`;
	return api.post(url, data);
};

export const fromSectorOnStore = async (data) => {
	const url = `packs/fromSectorOnStore`;
	return api.post(url, data);
};

export const returnToStore = async (data) => {
	const url = `subOrders/returnToStore`;
	return api.post(url, data);
};

export const placeDamaged = async (data) => {
	const url = `packs/${data.packID}/defect`
	return await api.get(url)
}

export const acceptDepartures = async (data) => {
	const url = `packs/acceptedTransitStore`;
	return await api.post(url, data);
};

export const awayOrders = async (data) => {
	const url = `packs/giveAwayClient`;
	return await api.post(url, data);
};


export const getPallet = async (args) => {
	const url = `pallets`;
	return await api.get(url, args);
}

export const getDeparturesForTransit = async (args) => {
	const url = `departuresForTransit`;
	return await api.get(url, args);
};


export const acceptTransitCar = async (data) => {
	const url = 'departures/accept'
	const fileIDs = {
		'fileIDs': data.fileIDs
	}
	delete data.fileIDs
	return await api.post(url, fileIDs, data);
}

export const sendImage = async (data, args) => {
	const url = `upload`;
	return await api.post(url, data, args);
};

export const sendImgIDs = async (data, args) => {
	const url = `departures/accept`;
	return await api.post(url, data, args);
};

export const uploadPhoto = async (data, args) => {
	const url = `upload`;
	return await api.post(url, data, args);
}

export const getOrders = async (args) => {
	const url = `orders`;
	return await api.get(url, args);
};

export const getSubOrders = async (args) => {
	const url = `subOrders`;
	return await api.get(url, args);
};

export const getDetails = async (args) => {
	const url = `details`;
	return await api.get(url, args);
};

export const dealerSearch = async (args) => {
  const url = `searchByDealer`;
  return await api.get(url, args);
}


