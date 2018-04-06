const util = require('./util');

module.exports = function(mongoose){

	const url = 'mongodb://localhost:9001/usedCarsDB';

	const vehicleListSchema = new mongoose.Schema({
		title: String,
		brand: String,
		model: String,
		version: String,
		regFrom: Number,
		regTo: Number,
		chFrom: Number,
		chTo: Number,
		doorsFrom: Number,
		doorsTo: Number,
		checkedBodyCompact: Boolean,
		checkedBodyConvertible: Boolean,
		checkedBodyCoupe: Boolean,
		checkedBodySUV: Boolean,
		checkedBodySedan: Boolean,
		checkedBodySW: Boolean,
		checkedFuelPetrol: Boolean,
		checkedFuelDiesel: Boolean,
		checkedFuelElec: Boolean,
		checkedFuelElecPetrol: Boolean,
		checkedFuelElecDiesel: Boolean,
		checkedTransAuto: Boolean,
		checkedTransMan: Boolean,
		checkedTransSemi: Boolean,
		dateAdded: Date,
		timingDay: Number,
		timingHour: Number,
		lastCount: Number,
		vehicleURL: String
	});

	const vehicleSchema = new mongoose.Schema({
		title: String,
		url: String,
		model: String,
		version: String,
		measureDate: Date,
		price: Number,
		km: Number,
		firstRegistration: Number,
		power: Number,
		used: String,
		prevOwners: Number,
		transmissionType: String,
		fuelType: String,
		country: String
	});

	const vehicleListModel = mongoose.model('vehicleListColl', vehicleListSchema, 'vehicleListColl');
	const vehicleModel = mongoose.model('vehicleColl', vehicleSchema, 'vehicleColl');

	const getVehicleList = async () => {
		let vehicleList = await vehicleListModel.find().sort({ dateAdded: 1 });
		return { success: true, vehicleList: vehicleList };
	}

	const deleteVehicle = async (id) => {
		// console.log(`id: ${id}`);
		let res = await vehicleListModel.remove({ _id: id });
		// console.log(`res: ${JSON.stringify(res)}`);
		return { success: res.ok };
	}

	const addVehicle = async (vehicle) => {
		// check if vehicle with same title already exists
		let existingVehicle = await vehicleListModel.findOne({ title: vehicle.title });
		if(existingVehicle) {
			console.log('A vehicle with this title already exists: ' + vehicle.title);
			// console.log(`Existing entry ID: ${entry._id}`);
			return { success: false, id: existingVehicle._id };
		} else {
			// assign a timing
			// get all current timings
			let allVehicles = await vehicleListModel.find({}).select({'timingDay': 1, 'timingHour': 1, 'lastCount': 1,  '_id': 0});
			let { timingDay, timingHour } = util.getTiming(allVehicles);

			let vehicleListEntry = new vehicleListModel({...vehicle, timingDay: timingDay, timingHour: timingHour});
			let entry = await vehicleListEntry.save();
			// console.log(`New entry ID: ${entry._id}`);
			return { success: true, id: entry._id, timingDay: timingDay, timingHour: timingHour };
		}
	}

	const getVehicleData = async (title) => {
		let data = await vehicleModel.find({ title: title }).sort({ measureDate: 1 });
		return { success: true, data: data };
	}

	return {
		url,
		addVehicle,
		getVehicleList,
		deleteVehicle,
		getVehicleData
	}
}