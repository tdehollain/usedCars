const filterVehiclesToProcessNow = vehicle => {
  // only process vehicles that need to be processed at this time
  let currentDay;
  let currentHour;

  // Use arguments provided as vehicle scrap date, or current date if no argument provided
  if (process.argv[2] && process.argv[3]) {
    currentDay = parseInt(process.argv[2], 10);
    currentHour = parseInt(process.argv[3], 10);
    if (currentDay < 1 || currentDay > 28) throw new Error('Day to process must be between 1 and 28');
    if (currentHour < 0 || currentHour > 23) throw new Error('Hour to process must be between 0 and 23');
  } else {
    currentDay = new Date().getDate();
    currentHour = new Date().getHours();
  }

  let vehicleDay = vehicle.timingDay;
  let vehicleHour = vehicle.timingHour;

  // currentDay = 8;
  // currentHour = 3;

  // only process the vehicles for this time stamp
  return hasValidData(vehicle) && vehicleDay === currentDay && vehicleHour === currentHour;
};

const hasValidData = function(vehicle) {
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

const addRecordsToList = (vehicleRecords, vehicleRecordsThisPage) => {
  // console.log(`vehicleRecords.length: ${vehicleRecords.length}`);
  for (record of vehicleRecordsThisPage) {
    // check if vehicle was already processed
    let filteredVehicleRecords = vehicleRecords.filter(el => el.url === record.url);
    if (filteredVehicleRecords.length > 0) {
      // console.log('Record for vehicle [' + vehicle.title + '] already present. URL: ' + record.url);
    } else {
      vehicleRecords.push(record);
    }
  }
  return vehicleRecords;
};

module.exports = {
  filterVehiclesToProcessNow,
  addRecordsToList
};
