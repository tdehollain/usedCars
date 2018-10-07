
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const addVehicle = async (vehicle, tableName) => {
	let tableParams = {
		TableName: tableName,
		Item: vehicle
	}

	try {
		let res = await ddb.put(tableParams).promise();
		return { err: null, res };
	} catch (err) {
		return { err };
	}
}

const getVehicleList = async (tableName) => {
	let tableParams = { TableName: tableName };

	try {
		let res = await ddb.scan(tableParams).promise();
		let list = res.Items;
		// Sort list by title
		let sortedList = list.sort((a, b) => {
			return (b.Title - new Date(a.Title));
		});
		return { err: null, list: sortedList };
	} catch (err) {
		return { err };
	}
}

const deleteVehicle = async (vehicleTitle, tableName) => {
	let tableParams = {
		TableName: tableName,
		Key: {
			"title": vehicleTitle
		}
	}

	try {
		let res = await ddb.delete(tableParams).promise();
		return { success: true, res };
	} catch (err) {
		return { success: false, err };
	}
}

module.exports = {
	getVehicleList,
	addVehicle,
	deleteVehicle
};