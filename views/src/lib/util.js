export default function buildURL(vehicle) {
	let brand = vehicle.brand ? "&mmvmk0=" + vehicle.brand : "";
	let model = vehicle.model ? "&mmvmd0=" + vehicle.model : "";
	let ver = vehicle.version ? "&version0=" + vehicle.version : "";
	let regFrom = vehicle.regFrom ? "&fregfrom=" + vehicle.regFrom : "";
	let regTo = vehicle.regTo ? "&fregto=" + vehicle.regTo : "";
	let doorFrom = vehicle.doorsFrom ? "&doorfrom=" + vehicle.doorsFrom : "";
	let doorTo = vehicle.doorsTo ? "&doorto=" + vehicle.doorsTo : "";

	let kwFrom = Math.round(parseInt(vehicle.chFrom, 10) / 1.341, 1).toString(10);
	let kwTo = Math.round(parseInt(vehicle.chTo, 10) / 1.341, 1).toString(10);
	let powerFrom = vehicle.chFrom ? "&powerfrom=" + kwFrom : "";
	let powerTo = vehicle.chTo ? "&powerto=" + kwTo : "";

	let body = vehicle.checkedBodyCompact ? "&body=1" : "";
	if(vehicle.checkedBodyConvertible) body += "&body=2";
	if(vehicle.checkedBodyCoupe) body += "&body=3";
	if(vehicle.checkedBodySUV) body += "&body=4";
	if(vehicle.checkedBodySedan) body += "&body=6";
	if(vehicle.checkedBodySW) body += "&body=5";
	if(vehicle.checkedBodyCompact && vehicle.checkedBodyConvertible && vehicle.checkedBodyCoupe && vehicle.checkedBodySUV && vehicle.checkedBodySedan && vehicle.checkedBodySUV) body = '';

	let fuel = vehicle.checkedFuelPetrol ? "&fuel=B" : "";
	if(vehicle.checkedFuelDiesel) fuel += "&fuel=D";
	if(vehicle.checkedFuelElec) fuel += "&fuel=E";
	if(vehicle.checkedFuelElecPetrol) fuel += "&fuel=2";
	if(vehicle.checkedFuelElecDiesel) fuel += "&fuel=3";
	if(vehicle.checkedFuelPetrol && vehicle.checkedFuelDiesel && vehicle.checkedFuelElec && vehicle.checkedFuelElecDiesel && vehicle.checkedFuelElecPetrol) fuel = '';

	let gear = vehicle.checkedTransAuto ? "&gear=A" : "";
	if(vehicle.checkedTransMan) gear += "&gear=M";
	if(vehicle.checkedTransSemi) gear += "&gear=S";
	if(vehicle.checkedTransAuto && vehicle.checkedTransMan && vehicle.checkedTransSemi) gear = '';

	return `https://www.autoscout24.com/results?${brand}${model}${ver}&mmvco=1${body}${regFrom}${regTo}${fuel}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU&sort=price&desc=0&page=1&size=20`;
}