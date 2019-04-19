import serverlessConfig from './serverlessConfig';
import { sortByPropertyTitle } from '../lib/util';

const getVehicleList = async () => {
	let URL = serverlessConfig.endpoints.vehicleListURL;
	let list = [];
	try {
		let res = await fetch(URL);
		let rawList = await res.json();
		let sortedList = rawList.sort(sortByPropertyTitle);
		list = sortedList;
		return list;
	} catch (err) {

	}
}

const addVehicle = async vehicle => {
	let URL = serverlessConfig.endpoints.vehicleListURL;
	let options = {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify(vehicle)
	};

	try {
		let res = await fetch(URL, options);
		res = await res.json();
		return { res }
	} catch (err) {
		return { err }
	}
}

const deleteVehicle = async title => {
	let URL = serverlessConfig.endpoints.vehicleListURL;
	let options = {
		method: 'DELETE',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			// "Authorization": accessToken
		},
		body: JSON.stringify(title)
	};

	try {
		let res = await fetch(URL, options);
		res = await res.json();
		return { res }
	} catch (err) {
		return { err }
	}
}

export default {
	getVehicleList,
	addVehicle,
	deleteVehicle
}