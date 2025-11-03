interface Vehicle {
  timingDay: number;
  timingHour: number;
  title: string;
  brand: string;
  model: string;
  regFrom: string;
}

type VehicleRecord = {
  url: string;
  [key: string]: unknown;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

const filterVehiclesToProcessNow = (vehicle: Vehicle): boolean => {
  // only process vehicles that need to be processed at this time
  let currentDay: number;
  let currentHour: number;

  // Use arguments provided as vehicle scrap date, or current date if no argument provided
  if (process.argv[2] && process.argv[3]) {
    currentDay = parseInt(process.argv[2], 10);
    currentHour = parseInt(process.argv[3], 10);
    if (currentDay < 1 || currentDay > 28)
      throw new Error('Day to process must be between 1 and 28');
    if (currentHour < 0 || currentHour > 23)
      throw new Error('Hour to process must be between 0 and 23');
  } else {
    currentDay = new Date().getDate();
    currentHour = new Date().getHours();
  }

  const vehicleDay = vehicle.timingDay;
  const vehicleHour = vehicle.timingHour;

  // currentDay = 20;
  // currentHour = 1;

  // only process the vehicles for this time stamp
  return (
    hasValidData(vehicle) &&
    vehicleDay === currentDay &&
    vehicleHour === currentHour
  );
};

const hasValidData = (vehicle: Vehicle): boolean =>
  [vehicle.title, vehicle.brand, vehicle.model, vehicle.regFrom].every(
    isNonEmptyString
  );

const addRecordsToList = (
  vehicleRecords: VehicleRecord[],
  vehicleRecordsThisPage: VehicleRecord[]
): VehicleRecord[] => {
  // console.log(`vehicleRecords.length: ${vehicleRecords.length}`);
  for (const record of vehicleRecordsThisPage) {
    // check if vehicle was already processed
    const filteredVehicleRecords = vehicleRecords.filter(
      (el) => el.url === record.url
    );
    if (filteredVehicleRecords.length > 0) {
      // console.log('Record for vehicle [' + vehicle.title + '] already present. URL: ' + record.url);
    } else {
      vehicleRecords.push(record);
    }
  }
  return vehicleRecords;
};

export { filterVehiclesToProcessNow, addRecordsToList };
