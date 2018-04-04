
module.exports.buildURL = function buildURL(vehicle, page=1) {
	let brand = vehicle.brand ? "&mmvmk0=" + vehicle.brand : "";
	let model = vehicle.model ? "&mmvmd0=" + vehicle.model : "";
	let ver = vehicle.version ? "&version0=" + vehicle.version : "";
	let regFrom = vehicle.regFrom ? "&fregfrom=" + vehicle.regFrom : "";
	let regTo = vehicle.regTo ? "&fregto=" + vehicle.regTo : "";
	let kmTo = vehicle.kmTo ? "&kmto=" + vehicle.kmTo : "";
	let kmFrom = vehicle.kmFrom ? "&kmfrom=" + vehicle.kmFrom : "";
	let doorFrom = vehicle.doorsFrom ? "&doorfrom=" + vehicle.doorsFrom : "";
	let doorTo = vehicle.doorsTo ? "&doorto=" + vehicle.doorsTo : "";

	let kwFrom = Math.round(parseInt(vehicle.chFrom, 10) / 1.341, 1).toString(10);
	let kwTo = Math.round(parseInt(vehicle.chTo, 10) / 1.341, 1).toString(10);
	let powerFrom = vehicle.chFrom ? "&powerfrom=" + kwFrom : "";
	let powerTo = vehicle.chTo ? "&powerto=" + kwTo : "";

	let body = vehicle.checkedBodyConvertible ? "&body=2" : "";
	if(vehicle.checkedBodyCoupe) body += "&body=3";
	if(vehicle.checkedBodySUV) body += "&body=4";
	if(vehicle.checkedBodySedan) body += "&body=6";
	if(vehicle.checkedBodySW) body += "&body=5";

	let fuel = vehicle.checkedFuelPetrol ? "&fuel=B" : "";
	if(vehicle.checkedFuelDiesel) fuel += "&fuel=D";
	if(vehicle.checkedFuelElec) fuel += "&fuel=E";
	if(vehicle.checkedFuelElecPetrol) fuel += "&fuel=2";
	if(vehicle.checkedFuelElecDiesel) fuel += "&fuel=3";

	let gear = vehicle.checkedTransAuto ? "&gear=A" : "";
	if(vehicle.checkedTransMan) gear += "&gear=M";
	if(vehicle.checkedTransSemi) gear += "&gear=S";

	let sort = vehicle.sorting ? "&sort=price&desc=" + (vehicle.sorting === "desc" ? "1" : "0") : "&sort=price&desc=0";

	return `https://www.autoscout24.com/results?${brand}${model}${ver}&mmvco=1${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU${sort}&page=${page}&size=20`;
}

module.exports.getVehicleDetails = function(elem, $) {
	let url = 'https://www.autoscout24.com' + $(elem).find('.cldt-summary-headline > .cldt-summary-titles > a').attr('href').split('?')[0];
	let model = $(elem).find('.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-makemodel').text();
	let version = $(elem).find('.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-version').text();
	// console.log('title: ' + model + '(model) - ' + version + '(version)');
	let price = $(elem).find('.cldt-price').text().replace(/\D/g,'');
	let km = $(elem).find('li:nth-child(1)').text().replace(/\D/g,'');
	let firstRegistration = $(elem).find('li:nth-child(2)').text().trim();
	let firstRegArr = firstRegistration.split('/');
	let firstRegMonth = firstRegArr[0].replace(/\D/g,'');
	let firstRegYear = firstRegArr[1].replace(/\D/g,'');
	let power = $(elem).find('li:nth-child(3)').text().trim();
	let used = $(elem).find('li:nth-child(4)').text().trim();
	let prevOwners = $(elem).find('li:nth-child(5)').text().trim().replace(/\D/g,'');
	let transmissionType = $(elem).find('li:nth-child(6)').text().trim();
	let fuelType = $(elem).find('li:nth-child(7)').text().trim();
	let country = $(elem).find('.cldt-summary-seller-contact-country').text().trim();
	if(!country) country = $(elem).find('.cldf-summary-seller-contact-country').text().trim() || "Other";
	let measureDate = new Date();
	// console.log(`   price: ${price}`);
	// console.log(`   km: ${km}`);
	// console.log(`   First registration: ${firstRegistration}`);
	// console.log(`   power: ${power}`);
	// console.log(`   used: ${used}`);
	// console.log(`   prevOwners: ${prevOwners}`);
	// console.log(`   transmissionType: ${transmissionType}`);
	// console.log(`   fuelType: ${fuelType}`);
	// console.log(`   country: ${country}`);
	// console.log(`   measureDate: ${measureDate}`);
	return { url, measureDate, model, version, price, km, firstRegMonth, firstRegYear, power, used, prevOwners, transmissionType, fuelType, country };
}

module.exports.hasValidData = function (vehicle) {
	return vehicle.title && vehicle.title !== "" && vehicle.brand && vehicle.brand !== "" && vehicle.model && vehicle.model !== "" && vehicle.regFrom && vehicle.regFrom !== "";
}