const db = require('./db.js');
const VEHICLE_RECORDS_TABLE = process.env.VEHICLE_RECORDS_TABLE;

exports.handler = async (event, context, callback) => {
  let vehicleTitle = event.queryStringParameters.title;
  // if (!event.requestContext.authorizer) {
  // 	errorResponse('Authorization not configured', context.awsRequestId, callback);
  // 	return;
  // }

  let { err, records } = await db.getVehicleRecords(vehicleTitle, VEHICLE_RECORDS_TABLE);
  if (err) {
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify(err),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    });
  } else {
    let info = { success: true, nbRecords: records.length };
    console.log(`info: ${JSON.stringify(info)}`);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(records),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    });
  }
};
