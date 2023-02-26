
const db = require('./db.js');
const VEHICLE_RECORDS_TABLE = process.env.VEHICLE_RECORDS_TABLE;

exports.handler = async (event, context, callback) => {
	// if (!event.requestContext.authorizer) {
	// 	errorResponse('Authorization not configured', context.awsRequestId, callback);
	// 	return;
	// }

	const vehicleRecords = JSON.parse(event.body);
	// const vehicleRecords = event.body;
	// console.log(vehicleRecords[0]);

	try {
		// Add the records
		let res = await db.putVehicleRecords(vehicleRecords, VEHICLE_RECORDS_TABLE);
		return callback(null, {
			statusCode: 201,
			body: JSON.stringify(res),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			}
		});
	} catch (err) {
		return callback(null, {
			statusCode: 500,
			body: { err: err.message },
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			}
		});
	}
};