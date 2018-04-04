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
		firstRegMonth: Number,
		firstRegYear: Number,
		power: String,
		used: String,
		prevOwners: Number,
		transmissionType: String,
		fuelType: String,
		country: String
	});

	const vehicleListModel = mongoose.model('vehicleListColl', vehicleListSchema, 'vehicleListColl');
	const vehicleModel = mongoose.model('vehicleColl', vehicleSchema, 'vehicleColl');

	const getVehicleList = async () => {
		let vehicleList = await vehicleListModel.find().lean().sort({ dateAdded: 1 });
		return { success: true, vehicleList: vehicleList };
	}

	const addVehicleRecord = async (title, vehicleDetails) => {
		// check if record already exists for this vehicle
		let recordAlreadyPresent = false;
		let existingRecord;
		let docs = await vehicleModel.find({title: title, url: vehicleDetails.url});
		for(doc of docs) {
			if(doc.measureDate && (doc.measureDate.getMonth() === vehicleDetails.measureDate.getMonth())) {
				recordAlreadyPresent = true;
			}
			existingRecord = doc;
		}
		if(!recordAlreadyPresent) {
			let recordEntry = new vehicleModel({...vehicleDetails, title: title});
			let entry = await recordEntry.save();
			return { success: true, id: entry._id }; 
		} else {
			return { success: false, id: existingRecord._id };
		}
	}

	const updateLastCount = async (title, count) => {
		// update last count
		await vehicleListModel.update({ title: title }, { $set: { lastCount: count } });
	}

	return {
		url,
		getVehicleList,
		addVehicleRecord,
		updateLastCount	
	}
}