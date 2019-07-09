const db = require('./lib/db');
const util = require('./lib/util');
const scrapUtils = require('./lib/scrapUtils');
const vehicleUtils = require('./lib/vehicleUtils');

const start = async browserPage => {
  // Get tracked vehicles data
  const vehicleList = await db.getVehicleList();
  const vehiclesToProcess = vehicleList.filter(vehicleUtils.filterVehiclesToProcessNow);
  let processedVehicles = await processVehicles(vehiclesToProcess, browserPage);
  return processedVehicles;
};

const processVehicles = async (vehicleList, browserPage) => {
  let processedVehicles = [];
  for (vehicle of vehicleList) {
    console.log(`<-----   Processing: ${vehicle.title} (brand: ${vehicle.brand}, model: ${vehicle.model})    ----->`);
    // let nbResults = await scrapUtils.waitTillPageReady(vehicle, browserPage); // get number of pages
    let nbResults = await scrapUtils.navigateToVehicle(vehicle, browserPage); // get number of pages
    console.log(`Number of results: ${nbResults}`);
    processedVehicles.push({ ...vehicle, lastCount: nbResults });
  }
  return processedVehicles;
};

module.exports = {
  start
};
