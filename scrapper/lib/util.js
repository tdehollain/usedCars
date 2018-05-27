module.exports.buildURL = function buildURL(vehicle, page = 1) {
  let brand = vehicle.brand ? '&mmvmk0=' + vehicle.brand : '';
  let model = vehicle.model ? '&mmvmd0=' + vehicle.model : '';
  let ver = vehicle.version ? '&version0=' + vehicle.version : '';
  let regFrom = vehicle.regFrom ? '&fregfrom=' + vehicle.regFrom : '';
  let regTo = vehicle.regTo ? '&fregto=' + vehicle.regTo : '';
  let kmTo = vehicle.kmTo ? '&kmto=' + vehicle.kmTo : '';
  let kmFrom = vehicle.kmFrom ? '&kmfrom=' + vehicle.kmFrom : '';
  let doorFrom = vehicle.doorsFrom ? '&doorfrom=' + vehicle.doorsFrom : '';
  let doorTo = vehicle.doorsTo ? '&doorto=' + vehicle.doorsTo : '';

  let kwFrom = Math.round(parseInt(vehicle.chFrom, 10) / 1.36, 1).toString(10);
  let kwTo = Math.round(parseInt(vehicle.chTo, 10) / 1.36, 1).toString(10);
  let powerFrom = vehicle.chFrom ? '&powerfrom=' + kwFrom : '';
  let powerTo = vehicle.chTo ? '&powerto=' + kwTo : '';

  let body = vehicle.checkedBodyCompact ? '&body=1' : '';
  if (vehicle.checkedBodyConvertible) body += '&body=2';
  if (vehicle.checkedBodyCoupe) body += '&body=3';
  if (vehicle.checkedBodySUV) body += '&body=4';
  if (vehicle.checkedBodySedan) body += '&body=6';
  if (vehicle.checkedBodySW) body += '&body=5';
  if (
    vehicle.checkedBodyCompact &&
    vehicle.checkedBodyConvertible &&
    vehicle.checkedBodyCoupe &&
    vehicle.checkedBodySUV &&
    vehicle.checkedBodySedan &&
    vehicle.checkedBodySUV
  )
    body = '';

  let fuel = vehicle.checkedFuelPetrol ? '&fuel=B' : '';
  if (vehicle.checkedFuelDiesel) fuel += '&fuel=D';
  if (vehicle.checkedFuelElec) fuel += '&fuel=E';
  if (vehicle.checkedFuelElecPetrol) fuel += '&fuel=2';
  if (vehicle.checkedFuelElecDiesel) fuel += '&fuel=3';
  if (
    vehicle.checkedFuelPetrol &&
    vehicle.checkedFuelDiesel &&
    vehicle.checkedFuelElec &&
    vehicle.checkedFuelElecDiesel &&
    vehicle.checkedFuelElecPetrol
  )
    fuel = '';

  let gear = vehicle.checkedTransAuto ? '&gear=A' : '';
  if (vehicle.checkedTransMan) gear += '&gear=M';
  if (vehicle.checkedTransSemi) gear += '&gear=S';
  if (
    vehicle.checkedTransAuto &&
    vehicle.checkedTransMan &&
    vehicle.checkedTransSemi
  )
    gear = '';

  let sort = vehicle.sorting
    ? '&sort=price&desc=' + (vehicle.sorting === 'desc' ? '1' : '0')
    : '&sort=price&desc=0';

  return `https://www.autoscout24.com/results?${brand}${model}${ver}&mmvco=1${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU${sort}&page=${page}&size=20`;
};

module.exports.hasValidData = function(vehicle) {
  return (
    vehicle.title &&
    vehicle.title !== '' &&
    vehicle.brand &&
    vehicle.brand !== '' &&
    vehicle.model &&
    vehicle.model !== '' &&
    vehicle.regFrom &&
    vehicle.regFrom !== ''
  );
};

module.exports.logMemoryUsage = (prefix = '') => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `${prefix}. The script uses approximately ${Math.round(used * 100) /
      100} MB`
  );
};

module.exports.logMemoryUsageLong = (prefix = '') => {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${prefix}. ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`
    );
  }
};
