const fetch = require('node-fetch');
// API Gateway
const env = 'dev';
const baseURL = 'https://h5gywnncj1.execute-api.eu-west-1.amazonaws.com/' + env;

const getVehicleList = async function () {
	let URL = baseURL + '/vehiclelist';
	try {
		let options = {
			method: 'GET',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		};
		let raw_response = await fetch(URL, options);
		if (raw_response.status !== 200) {
			return { err: raw_response.status + ':' + raw_response.statusText }
		}
		let list = await raw_response.json();
		return { vehicleFullList: list };
	} catch (err) {
		return { err };
	}
}

const putVehicleRecords = async function (vehicleRecords) {
	let URL = baseURL + '/vehiclerecord';
	try {
		let options = {
			method: 'PUT',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(vehicleRecords)
		};
		let raw_response = await fetch(URL, options);
		if (raw_response.status !== 201) {
			return { err: raw_response.status + ':' + raw_response.statusText }
		}
		let res = await raw_response.json();
		if (res.success) {
			return { res };
		} else {
			return { err: res.message };
		}
	} catch (err) {
		// console.log("err: " + err);
		return { err, res: null };
	}
}

const deleteVehicleRecords = async function (vehicleTitle, month) {
	let URL = baseURL + '/vehiclerecord';
	try {
		let options = {
			method: 'DELETE',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ vehicleTitle, month })
		};
		let raw_response = await fetch(URL, options);
		let res = await raw_response.json();
		if (res.success) {
			return { err: null, res };
		} else {
			return { err: res.message, res: null };
		}
	} catch (err) {
		console.log("err: " + err);
		return { err, res: null };
	}
}

module.exports = {
	getVehicleList,
	putVehicleRecords,
	deleteVehicleRecords
};