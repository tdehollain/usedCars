const buildURL = vehicle => {
	const baseURL = 'https://www.autoscout24.com/lst';

	// let brand = vehicle.brand ? "&mmvmk0=" + vehicle.brand : "";
	// let model = vehicle.model ? "&mmvmd0=" + vehicle.model : "";
	let version = vehicle.version ? "&version0=" + vehicle.version : "";
	let regFrom = vehicle.regFrom ? "&fregfrom=" + vehicle.regFrom : "";
	let regTo = vehicle.regTo ? "&fregto=" + vehicle.regTo : "";
	let doorFrom = vehicle.doorsFrom ? "&doorfrom=" + vehicle.doorsFrom : "";
	let doorTo = vehicle.doorsTo ? "&doorto=" + vehicle.doorsTo : "";

	let kwFrom = Math.round(parseInt(vehicle.chFrom, 10) / 1.36, 1).toString(10);
	let kwTo = Math.round(parseInt(vehicle.chTo, 10) / 1.36, 1).toString(10);
	let powerFrom = vehicle.chFrom ? "&powerfrom=" + kwFrom : "";
	let powerTo = vehicle.chTo ? "&powerto=" + kwTo : "";

	let body = vehicle.checkedBodyCompact ? "&body=1" : "";
	if (vehicle.checkedBodyConvertible) body += "&body=2";
	if (vehicle.checkedBodyCoupe) body += "&body=3";
	if (vehicle.checkedBodySUV) body += "&body=4";
	if (vehicle.checkedBodySedan) body += "&body=6";
	if (vehicle.checkedBodySW) body += "&body=5";
	if (vehicle.checkedBodyCompact && vehicle.checkedBodyConvertible && vehicle.checkedBodyCoupe && vehicle.checkedBodySUV && vehicle.checkedBodySedan && vehicle.checkedBodySW) body = '';

	let fuel = vehicle.checkedFuelPetrol ? "&fuel=B" : "";
	if (vehicle.checkedFuelDiesel) fuel += "&fuel=D";
	if (vehicle.checkedFuelElec) fuel += "&fuel=E";
	if (vehicle.checkedFuelElecPetrol) fuel += "&fuel=2";
	if (vehicle.checkedFuelElecDiesel) fuel += "&fuel=3";
	if (vehicle.checkedFuelPetrol && vehicle.checkedFuelDiesel && vehicle.checkedFuelElec && vehicle.checkedFuelElecDiesel && vehicle.checkedFuelElecPetrol) fuel = '';

	let gear = vehicle.checkedTransAuto ? "&gear=A" : "";
	if (vehicle.checkedTransMan) gear += "&gear=M";
	if (vehicle.checkedTransSemi) gear += "&gear=S";
	if (vehicle.checkedTransAuto && vehicle.checkedTransMan && vehicle.checkedTransSemi) gear = '';

	let other = '&atype=C&';
	// OLD VERSION
	// return `https://www.autoscout24.com/results?${brand}${model}${version}&mmvco=1${body}${regFrom}${regTo}${fuel}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU&sort=price&desc=0&page=1&size=20`;
	// NEW VERSION
	const result = `${baseURL}/${vehicle.brand}/${vehicle.model}?sort=price&desc=0&ustate=N%2CU&size=20&page=1${version}${body}${regFrom}${regTo}${fuel}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}${other}`;
	return result;
}

const sortByPropertyTitle = (a, b) => {
	if (a.title < b.title)
		return -1;
	if (a.title > b.title)
		return 1;
	return 0;
}

export {
	buildURL,
	sortByPropertyTitle
}