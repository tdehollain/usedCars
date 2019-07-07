const db = require('./lib/db');

const start = async () => {
  // Get tracked vehicles data
  const vehicleList = await db.getVehicleList();

  let processedVehicles = await processVehicles(vehicleList);

  return processedVehicles;
};

const processVehicles = async vehicleList => {
  for (vehicle of vehicleList) {
  }
};

module.exports = {
  start
};
