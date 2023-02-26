
const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

exports.handler = async (event, context, callback) => {

	let vehicle = JSON.parse(event.body);

	// add timing for new vehicles
	if (!vehicle.editMode) {
		// get all vehicles
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
			const { timingDay, timingHour } = getTiming(list);
			vehicle = { ...vehicle, timingDay, timingHour }
		}
	}

	let { err } = await db.addVehicle(vehicle, VEHICLE_LIST_TABLE);

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
			body: JSON.stringify(vehicle),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
		});
	}
};

const getTiming = allVehicles => {

	let output = []
	for (let i = 0; i <= 27; i++) {
		for (let j = 0; j <= 23; j++) {
			output.push({ day: i + 1, hour: j, count: 0 });
		}
	}

	for (const vehicle of allVehicles) {
		for (const [index, value] of output.entries()) {
			if (value.day === vehicle.timingDay && value.hour === vehicle.timingHour) {
				output[index].count += vehicle.lastCount || 10;
			}
		}
	}

	output.sort((a, b) => {
		if (a.count === b.count) {
			if (a.day === b.day) {
				return a.hour - b.hour;
			} else {
				return a.day - b.day;
			}
		} else {
			return a.count - b.count;
		}
	});

	return { timingDay: output[0].day, timingHour: output[0].hour };
}