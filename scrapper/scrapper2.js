// Requires
const util = require('./lib/util');
const browserUtils = require('./lib/browserUtils');
const scrapUtils = require('./lib/scrapUtils');
const Vehicle = require('./Vehicle.js');
const mongoose = require('mongoose');

// DB =====================================================
const db = require('./lib/db')(mongoose);
// mongoose.set('debug', true);

try {
	mongoose.connect(db.url);
	start();
} catch (err) {
	throw new Error("Error connecting to MongoDB: " + err);
}

let allScannedData = [];
let processedVehicles = [];

// Start
async function start() {

	// get list of vehicles to track: vehicleFullList
	const { err, vehicleFullList } = await db.getVehicleList();

	if (err) {
		console.log('Error getting the list of tracked vehicles: ' + err);
		process.exit(0);
	} else {
		// await processVehicles(vehicleList);
		for (vehicleAttributes of vehicleFullList) {
			let currentVehicle = new Vehicle(vehicleAttributes);

			if (currentVehicle.hasValidData() && currentVehicle.shouldBeScanned()) {
				let { err, output } = await processVehicle(currentVehicle);
				console.log("Number of vehicles scanned: " + output.length);
				if (err) {
					console.log("Error while scanning vehicle " + vehicle.name + ": " + err);
				} else {
					// push output to API Gateway
				}
				processedVehicles.push(currentVehicle.title);
			}
		}

		//log result
		let timeStamp = util.getTimeStamp();
		console.log(`${timeStamp}. Complete. ${processedVehicles.length} vehicles processed.`);
		process.exit(0);
	}
}


async function processVehicle(vehicle) {
	console.log(`<-----   Processing: ${vehicle.attributes.title}   ----->`);
	const browserPage = await browserUtils.loadBrowser();

	let uniqueVehicles = await getUniqueVehiclesToScan(vehicle, browserPage);
	console.log("unique vehicles : " + uniqueVehicles.length);

	let vehicleScannedData = [];
	for (let i = 0; i < uniqueVehicles.length; i++) {
		let currentUniqueVehicle = uniqueVehicles[i];
		let regFrom = currentUniqueVehicle.attributes.regFrom;
		let regTo = currentUniqueVehicle.attributes.regTo;
		let kmFrom = currentUniqueVehicle.attributes.kmFrom;
		let kmTo = currentUniqueVehicle.attributes.kmTo;
		let sorting = currentUniqueVehicle.attributes.sorting;
		console.log(`Unique vehicle # ${i + 1}: Year=${regFrom} to ${regTo}, Mileage=${kmFrom} to ${kmTo}, sorting=${sorting}`);
		let results = await currentUniqueVehicle.simpleScan(browserPage);
		vehicleScannedData = [...vehicleScannedData, ...results];
	}
	console.log("Unfiltered number of vehicles scanned: " + vehicleScannedData.length);
	// filter out vehicles present twice (caused by the ascending and descending thing)
	let filteredVehicleScannedData = [];
	for (let vehicle of vehicleScannedData) {
		if (!util.alreadyIncluded(vehicle, filteredVehicleScannedData)) {
			filteredVehicleScannedData.push(vehicle);
		}
	}

	return { err: null, output: filteredVehicleScannedData };
}


async function getUniqueVehiclesToScan(vehicle, browserPage) {
	// Count the number of results
	let vehiclePageOneURL = vehicle.buildURL();
	// console.log(vehiclePageOneURL);
	let nbResults = await scrapUtils.getNumberOfResults(vehiclePageOneURL, browserPage); // get number of pages
	console.log(`Number of results: ${nbResults}`);

	let uniqueVehiclesToScan = []
	if (nbResults === 0) {
		// don't add the current vehicle to the list of unique vehicles to scan
	} else if (nbResults <= 400) {
		uniqueVehiclesToScan.push(vehicle);
	} else {
		console.log(`More than 20 pages. Querying by year.`);
		//==============
		// QUERY BY YEAR
		//==============
		// If vehicle doesn't have a regTo, it will be the current year
		let lastYear = vehicle.attributes.regTo || new Date().getFullYear();
		for (let i = parseInt(vehicle.attributes.regFrom, 10); i <= lastYear; i++) {
			console.log(`   Processing: ${vehicle.attributes.title} - year ${i}`);

			// create new vehicle for this particular year
			let newRegFrom = i;
			// if vehicle has no regTo, it has to be empty to include vehicles that have an empty regTo
			let newRegTo = i === new Date().getFullYear() ? '' : i
			let newAttributesYear = { ...vehicle.attributes, regFrom: newRegFrom, regTo: newRegTo };
			let byYearVehicle = new Vehicle(newAttributesYear);

			// Count number of results for the current year
			let byYearVehiclePageOneURL = byYearVehicle.buildURL();
			let nbResultsByYear = await scrapUtils.getNumberOfResults(byYearVehiclePageOneURL, browserPage);
			console.log(`       Number of results by year: ${nbResultsByYear}`);

			if (nbResultsByYear === 0) {
				// don't add the current vehicle to the list of unique vehicles to scan
			} else if (nbResultsByYear <= 400) {
				uniqueVehiclesToScan.push(byYearVehicle);
			} else {
				console.log(`   More than 20 pages, even by year. Querying by year and mileage.`);
				//==========================
				// QUERY BY YEAR AND MILEAGE
				//==========================
				let mileageBands = ['', '2500', '5000', '10000', '20000', '40000', '80000', '']
				// Create all the vehicles for this particular year and all mileage bands
				for (let j = 0; j < 7; j++) {
					let newAttributesYearMileage = {
						...vehicle.attributes,
						regFrom: newRegFrom,
						regTo: newRegTo,
						kmFrom: mileageBands[j],
						kmTo: mileageBands[j + 1]
					}
					let byYearAndMileageVehicle = new Vehicle(newAttributesYearMileage);

					console.log(`      Processing: ${vehicle.attributes.title} - year ${i} - mileage: ${mileageBands[j]} to ${mileageBands[j + 1]}`);

					// Count number of results for the current year
					let byYearAndMileageVehiclePageOneURL = byYearAndMileageVehicle.buildURL();
					let nbResultsByYearAndMileage = await scrapUtils.getNumberOfResults(byYearAndMileageVehiclePageOneURL, browserPage);
					console.log(`         Number of results by year and mileage: ${nbResultsByYearAndMileage}`);

					if (nbResultsByYearAndMileage === 0) {
						// don't add the current vehicle to the list of unique vehicles to scan
					} else if (nbResultsByYearAndMileage <= 400) {
						uniqueVehiclesToScan.push(byYearAndMileageVehicle);
					} else if (nbResultsByYearAndMileage <= 800) {
						// do it ascending and descnding
						console.log('         Between 20 and 40 pages, even by year AND mileage. Doing it once in ascending price and once in descending price.');
						let newAttributesYearMileageAsc = { ...newAttributesYearMileage, sorting: 'asc' };
						let newAttributesYearMileageDesc = { ...newAttributesYearMileage, sorting: 'desc' };
						let byYearAndMileageVehicleAsc = new Vehicle(newAttributesYearMileageAsc);
						let byYearAndMileageVehicleDesc = new Vehicle(newAttributesYearMileageDesc);
						uniqueVehiclesToScan.push(byYearAndMileageVehicleAsc);
						uniqueVehiclesToScan.push(byYearAndMileageVehicleDesc);
					} else {
						console.log('        More than 40 pages, even by year AND mileage. Skipping vehicle.');
					}
				}

			}
		}
	}
	return uniqueVehiclesToScan;
}