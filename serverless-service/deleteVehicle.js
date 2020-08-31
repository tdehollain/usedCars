
const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

exports.handler = async (event, context, callback) => {

	// get current id of vehicle to delete
	let title = JSON.parse(event.body);

	let { err, res } = await db.deleteVehicle(title, VEHICLE_LIST_TABLE);

	if (err) {
		return callback(null, {
			statusCode: 500,
			body: JSON.stringify(err),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
		});
	} else {
		return callback(null, {
			statusCode: 200,
			body: JSON.stringify(res),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
		});
	}
	if (res.success) {
		return { success: true };
	} else {
		console.error(`Error deleting vehicle "${title}": + ${res.err}`);
		return { success: false };
	}
}