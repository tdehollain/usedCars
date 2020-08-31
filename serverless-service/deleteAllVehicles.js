
const list = require('./existingVehicles.js');
const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

exports.handler = async (event, context, callback) => {

	// get current list
	let { err, list } = await db.getVehicleList(VEHICLE_LIST_TABLE);
	if (err) return { success: false, err: "Error getting current list of vehicles: " + err };

	let nbVehiclesDeleted = 0;
	let start = 0;
	let end = Math.min(1000, list.length); // for DEBUG - try with 1 or 11 vehicles instead of the full list

	for (let i = start; i < end; i++) {
		let vehicleToDeleteTitle = list[i].title;

		let res = await db.deleteVehicle(vehicleToDeleteTitle, VEHICLE_LIST_TABLE);
		if (res.success) {
			nbVehiclesDeleted++;
		} else {
			console.error(`Error deleting vehicle "${vehicleToDeleteTitle}": + ${res.err}`);
		}
	}
	return { success: true, nbVehiclesDeleted };
};