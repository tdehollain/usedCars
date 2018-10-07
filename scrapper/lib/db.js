const fetch = require('node-fetch');
// API Gateway
const env = 'development';
const baseURL = 'https://6e9r69v0xj.execute-api.eu-west-1.amazonaws.com/' + env;

const getVehicleList = async function () {
	let URL = baseURL + '/vehiclelist';
	try {
		let raw_response = await fetch(URL, { method: 'GET' });
		let output = await raw_response.json();
		return { err: null, vehicleFullList: output.list };
	} catch (err) {
		return { err, vehicleFullList: null };
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