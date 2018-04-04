const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('./lib/util');
const mongoose = require('mongoose');

// DB =====================================================
const db = require("./lib/db")(mongoose);
// mongoose.set('debug', true);
mongoose.connect(db.url, err => {
	start();
});

let processedVehicles = [];

async function start() {
	// Get tracked vehicles data
	const { success, vehicleList } = await db.getVehicleList();
	if(success) {
		await processVehicles(vehicleList);
		let d = new Date();
		console.log(`${('0'+d.getDate()).slice(-2)}/${('0'+(d.getMonth()+1)).slice(-2)}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}. Complete. ${processedVehicles.length} vehicles processed.`);
		process.exit(0);
	} else {
		console.log('Error getting the list of tracked vehicles');
		process.exit(0);
	}
};

async function processVehicles(vehicleData) {
	for(vehicle of vehicleData) {
		// Skip vehicle if no title, brand, model, or firstRegFrom
		if(util.hasValidData(vehicle)) {
			// only process vehicles that need to be processed at this time
			let currentDay;
			let currentHour;
			
			if(process.argv[2] && process.argv[3]) {
				currentDay = parseInt(process.argv[2], 10);
				currentHour = parseInt(process.argv[3], 10);
				if(currentDay < 1 || currentDay > 28) throw new Error('Day to process must be between 1 and 28');
				if(currentHour < 0 || currentHour > 23) throw new Error('Hour to process must be between 1 and 28');
			} else {
				currentDay = new Date().getDate();
				currentHour = new Date().getHours();
			}
			let vehicleDay = vehicle.timingDay;
			let vehicleHour = vehicle.timingHour;
			// console.log(`day: ${currentDay} - ${vehicleDay}; hour: ${currentHour} - ${vehicleHour}`);

			// only process the vehicles for this time stamp
			if(vehicleDay === currentDay && vehicleHour === currentHour) {
				console.log(`<-----   Processing: ${vehicle.title}   ----->`);
				let nbResults = await getNumberOfResults(vehicle); // get number of pages
				console.log(`Number of results: ${nbResults}`);
				if(nbResults > 400) {
					console.log(`More than 20 pages. Querying by year.`);
					// do it year by year
					let lastYear = vehicle.regTo === "" ? vehicle.regTo : (new Date()).getFullYear();
					for(i=parseInt(vehicle.regFrom, 10); i <= lastYear; i++) {
						console.log(`   Processing: ${vehicle.title} - year ${i}`);
						let vehicleByYear = vehicle;
						vehicleByYear.regFrom = i;
						vehicleByYear.regTo = i === lastYear ? '' : i;

						let nbResultsByYear = await getNumberOfResults(vehicleByYear); // get number of pages
						console.log(`   nbResultsByYear: ${nbResultsByYear}`);
						if(nbResultsByYear > 400) {
							console.log('   More than 20 pages, even by year. Querying by year and mileage.');
							// do it by mileage
							let vehicleByYearAndMileage = [
								{...vehicle, kmFrom: "", kmTo: "2500"},
								{...vehicle, kmFrom: "2500", kmTo: "5000"},
								{...vehicle, kmFrom: "5000", kmTo: "10000"},
								{...vehicle, kmFrom: "10000", kmTo: "20000"},
								{...vehicle, kmFrom: "20000", kmTo: "40000"},
								{...vehicle, kmFrom: "40000", kmTo: "80000"},
								{...vehicle, kmFrom: "80000", kmTo: ""},
							];
							for(j=0; j<7; j++) {
								console.log(`      Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}`);
								let nbResultsByYearAndMileage = await getNumberOfResults(vehicleByYearAndMileage[j]); // get number of pages
								console.log(`      nbResultsByYearAndMileage: ${nbResultsByYearAndMileage}`);
								if(nbResultsByYearAndMileage > 800) {
									console.log('      More than 40 pages, even by year AND mileage. Skipping vehicle.');
									return;
								} else if(nbResultsByYearAndMileage > 400) {
									console.log('      Between 20 and 40 pages, even by year AND mileage. Doing it once in ascending price and once in descending price.');
									let vehicleByYearAndMileageAsc = {...vehicleByYearAndMileage[j], sorting: "asc" };
									let vehicleByYearAndMileageDesc = {...vehicleByYearAndMileage[j], sorting: "desc"};

									console.log(`         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}. Order: ascending`);
									let hasNextPage = true;
									let page = 1;
									do {
										hasNextPage = await processPage(vehicleByYearAndMileageAsc, page);
										page++;
									} while (hasNextPage);
									
									console.log(`         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}. Order: descending`);
									hasNextPage = true;
									page = 1;
									do {
										hasNextPage = await processPage(vehicleByYearAndMileageDesc, page);
										page++;
									} while (hasNextPage);
								} else {
									if(nbResultsByYearAndMileage > 0) {
										let hasNextPage = true;
										let page = 1;
										do {
											hasNextPage = await processPage(vehicleByYearAndMileage[j], page);
											page++;
										} while (hasNextPage);
									}
								}
							}
						} else {
							if(nbResultsByYear > 0) {
								let hasNextPage = true;
								let page = 1;
								do {
									hasNextPage = await processPage(vehicleByYear, page);
									page++;
								} while (hasNextPage);
							}
						}
					}
				} else {
					if(nbResults > 0) {
						let hasNextPage = true;
						let page = 1;
						do {
							hasNextPage = await processPage(vehicle, page);
							page++;
						} while (hasNextPage);
					}
				}
				// update last count for this vehicle
				await db.updateLastCount(vehicle.title, nbResults);
			} else {
				// console.log('not now');
				
			}
		} else {
			console.log('Invalid data for vehicle [' + vehicle.title !== "" ? vehicle.title : 'no title provided' + ']. Skipping vehicle');
		}
	}
}


async function processPage(vehicle, page = 1) {
	// console.log('processing: ' + vehicle.title + ' - page ' + page);
	// util.logMemoryUsage();
	let url = util.buildURL(vehicle, page);
	// page === 1 && console.log(`url: ${url}`);
	let res = await fetch(url);
	let body = await res.text();

	let $ = cheerio.load(body);

	let mainSelector = '.cl-list-element > .cldt-summary-full-item';

	let vehicles = []
	$('.cl-list-elements').find(mainSelector).each(async (i, elem) => {
		let vehicleDetails = util.getVehicleDetails(elem, $);
		vehicles.push(vehicleDetails);
	});
	
	for(vehicleDetails of vehicles) {
		// check if vehicle was already processed
		if(!processedVehicles.includes(vehicleDetails.url)) {
			// console.log('#' + processedVehicles.length + ':' + vehicleDetails.model + ' - ' + vehicleDetails.version);
			let { success, id } = await db.addVehicleRecord(vehicle.title, vehicleDetails);
			if(success) {
				processedVehicles.push(vehicleDetails.url);
				// console.log('Successfully saved record for vehicle [' + vehicle.title + ']. URL: ' + vehicleDetails.url);
			} else {
				// console.log('Record for vehicle [' + vehicle.title + '] already present. URL: ' + vehicleDetails.url);	
			}
		}
	}

	// Check if there is a next page
	let paginationElement = $('.cl-pagination > .sc-pagination');
	let numberOfResults = paginationElement.data('total-items');
	let currentPage = paginationElement.data('current-page');
	let hasNextPage = numberOfResults / currentPage > 20 ? true : false;
	// console.log('total items: ' + numberOfResults);
	// console.log('has next page: ' + hasNextPage);
	// move on to next page
	return hasNextPage;
}

async function getNumberOfResults(vehicle) {
	let url = util.buildURL(vehicle);
	// console.log(`url: ${url}`);
	let res = await fetch(url);
	let body = await res.text();

	const $ = cheerio.load(body);
	let paginationElement = $('.cl-pagination > .sc-pagination');
	let numberOfResults = paginationElement.data('total-items');
	// console.log(`Number of results: ${numberOfResults}`);
	return numberOfResults;
}