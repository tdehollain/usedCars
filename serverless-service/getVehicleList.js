
const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

exports.handler = async (event, context, callback) => {
	// if (!event.requestContext.authorizer) {
	// 	errorResponse('Authorization not configured', context.awsRequestId, callback);
	// 	return;
	// }

	let { err, list } = await db.getVehicleList(VEHICLE_LIST_TABLE);
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
		let info = { success: true, nbVehicles: list.length }
		return callback(null, {
			statusCode: 200,
			body: JSON.stringify(list),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
		});
	}
};