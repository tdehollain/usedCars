const scrapUtils = require('./lib/scrapUtils');

class Vehicle {
	constructor(attributes) {
		this.attributes = attributes;
		this.buildURL = this.buildURL.bind(this);
	}

	hasValidData() {
		// vehicle can be scanned and the results saved if has 
		// a title, a brand, a model and a first registration date 'from'
		return (
			!!this.attributes.title &&
			// this.attributes.title !== '' &&
			!!this.attributes.brand &&
			// this.attributes.brand !== '' &&
			!!this.attributes.model &&
			// this.attributes.model !== '' &&
			!!this.attributes.regFrom
			// this.attributes.regFrom !== ''
		);
	}

	shouldBeScanned() {

		let currentDay;
		let currentHour;

		// if process is invoked with arguments, these should be the day and hour of the vehicles to be scanned
		if (process.argv[2] && process.argv[3]) {
			currentDay = parseInt(process.argv[2], 10);
			currentHour = parseInt(process.argv[3], 10);
			if (currentDay < 1 || currentDay > 28)
				throw new Error('Day to process must be between 1 and 28');
			if (currentHour < 0 || currentHour > 23)
				throw new Error('Hour to process must be between 0 and 23');
		} else {
			// if process is invoked with no arguments, scan vehicles of the current day and hour
			let currentDate = new Date();
			currentDay = currentDate.getDate();
			currentHour = currentDate.getHours();
		}

		let vehicleDay = this.attributes.timingDay;
		let vehicleHour = this.attributes.timingHour;
		// console.log(`day: ${currentDay} - ${vehicleDay}; hour: ${currentHour} - ${vehicleHour}`);

		// only process the vehicles for this time stamp
		return (vehicleDay === currentDay && vehicleHour === currentHour);
	}

	buildURL(page = 1) {
		const baseURL = 'https://www.autoscout24.com/lst';

		let attributes = this.attributes;

		// let brand = attributes.brandId ? '&mmvmk0=' + attributes.brandId : '';
		// let model = attributes.modelId ? '&mmvmd0=' + attributes.modelId : '';
		let version = attributes.version ? '&version0=' + attributes.version : '';
		let regFrom = attributes.regFrom ? '&fregfrom=' + attributes.regFrom : '';
		let regTo = attributes.regTo ? '&fregto=' + attributes.regTo : '';
		let kmTo = attributes.kmTo ? '&kmto=' + attributes.kmTo : '';
		let kmFrom = attributes.kmFrom ? '&kmfrom=' + attributes.kmFrom : '';
		let doorFrom = attributes.doorsFrom ? '&doorfrom=' + attributes.doorsFrom : '';
		let doorTo = attributes.doorsTo ? '&doorto=' + attributes.doorsTo : '';

		let kwFrom = Math.round(parseInt(attributes.chFrom, 10) / 1.36, 1).toString(10);
		let kwTo = Math.round(parseInt(attributes.chTo, 10) / 1.36, 1).toString(10);
		let powerFrom = attributes.chFrom ? '&powerfrom=' + kwFrom : '';
		let powerTo = attributes.chTo ? '&powerto=' + kwTo : '';

		let body = attributes.checkedBodyCompact ? '&body=1' : '';
		if (attributes.checkedBodyConvertible) body += '&body=2';
		if (attributes.checkedBodyCoupe) body += '&body=3';
		if (attributes.checkedBodySUV) body += '&body=4';
		if (attributes.checkedBodySedan) body += '&body=6';
		if (attributes.checkedBodySW) body += '&body=5';
		if (
			attributes.checkedBodyCompact &&
			attributes.checkedBodyConvertible &&
			attributes.checkedBodyCoupe &&
			attributes.checkedBodySUV &&
			attributes.checkedBodySedan &&
			attributes.checkedBodySUV
		)
			body = '';

		let fuel = attributes.checkedFuelPetrol ? '&fuel=B' : '';
		if (attributes.checkedFuelDiesel) fuel += '&fuel=D';
		if (attributes.checkedFuelElec) fuel += '&fuel=E';
		if (attributes.checkedFuelElecPetrol) fuel += '&fuel=2';
		if (attributes.checkedFuelElecDiesel) fuel += '&fuel=3';
		if (
			attributes.checkedFuelPetrol &&
			attributes.checkedFuelDiesel &&
			attributes.checkedFuelElec &&
			attributes.checkedFuelElecDiesel &&
			attributes.checkedFuelElecPetrol
		)
			fuel = '';

		let gear = attributes.checkedTransAuto ? '&gear=A' : '';
		if (attributes.checkedTransMan) gear += '&gear=M';
		if (attributes.checkedTransSemi) gear += '&gear=S';
		if (
			attributes.checkedTransAuto &&
			attributes.checkedTransMan &&
			attributes.checkedTransSemi
		)
			gear = '';

		let sort = attributes.sorting
			? '&sort=price&desc=' + (attributes.sorting === 'desc' ? '1' : '0')
			: '&sort=price&desc=0';

		let other = '&atype=C';

		// OLD VERSION
		// return `https://www.autoscout24.com/results?${brand}${model}${ver}&mmvco=1${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU${sort}&page=${page}&size=20`;
		// NEW VERSION
		const result = `${baseURL}/${attributes.brand}/${attributes.model}?sort=price&desc=0&ustate=N%2CU&size=20${version}${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}${sort}&page=${page}&size=20${other}`;
		// console.log(`result: ${result}`);
		return result;
	};

	async simpleScan(browserPage) {
		let vehicleMeasuredData = [];
		let hasNextPage = true;
		let page = 1;
		do {
			let vehicleCurrentageURL = this.buildURL(page);
			let pageOutput = await scrapUtils.processPage(vehicleCurrentageURL, browserPage, page);
			vehicleMeasuredData = [...vehicleMeasuredData, ...pageOutput.measuredData];
			hasNextPage = pageOutput.hasNextPage;
			page++;
		} while (hasNextPage && page <= 20);

		return vehicleMeasuredData;
	}
}


module.exports = Vehicle;