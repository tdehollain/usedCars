import serverlessConfig from './serverlessConfig';
import { sortByPropertyTitle, sortByPropertyScrapDate } from './util';

//= ===========================
//= ====   Vehicle List   =====
//= ===========================

const getVehicleList = async () => {
  const URL = serverlessConfig.endpoints.vehicleListURL;
  let list = [];
  try {
    const res = await fetch(URL);
    const rawList = await res.json();
    const sortedList = rawList.sort(sortByPropertyTitle);
    list = sortedList;
    return list;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const addVehicle = async (vehicle) => {
  const URL = serverlessConfig.endpoints.vehicleListURL;
  const options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // "Authorization": accessToken
    },
    body: JSON.stringify(vehicle),
  };

  try {
    let res = await fetch(URL, options);
    res = await res.json();
    return { res };
  } catch (err) {
    return { err };
  }
};

const deleteVehicle = async (title) => {
  const URL = serverlessConfig.endpoints.vehicleListURL;
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // "Authorization": accessToken
    },
    body: JSON.stringify(title),
  };

  try {
    let res = await fetch(URL, options);
    res = await res.json();
    return { res };
  } catch (err) {
    return { err };
  }
};

//= ===========================
//= ====   Vehicle Data   =====
//= ===========================

const getVehicleRecords = async (title) => {
  const URL = `${serverlessConfig.endpoints.vehicleRecordsURL}?title=${title}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // "Authorization": accessToken
    },
  };

  const res = await fetch(URL, options);
  const rawData = await res.json();

  // Remove records that don't have a price (happens for leasing ads)
  const filteredData = rawData.filter((record) => !!record.price);
  const sortedData = filteredData.sort(sortByPropertyScrapDate);

  // Needed for vehicle age
  const currentNbOfMonths = ((new Date()).getFullYear() - 1) * 12 + (new Date()).getMonth() + 1;

  // Convert strings to numbers
  const formattedRecords = sortedData.map((record) => ({
    ...record,
    yearmonth: parseInt(record.yearmonth, 10),
    measureDate: parseInt(record.measureDate, 10),
    price: parseInt(record.price, 10),
    km: parseInt(record.km, 10) || 0,
    firstRegMonth: parseInt(record.firstRegMonth, 10),
    firstRegYear: parseInt(record.firstRegYear, 10),
    age: parseInt(record.firstRegMonth, 10) && parseInt(record.firstRegYear, 10)
      ? currentNbOfMonths - ((parseInt(record.firstRegYear, 10) - 1) * 12 + parseInt(record.firstRegMonth, 10))
      : 0,
    powerKW: parseInt(record.power.split(' kW')[0], 10),
    powerHp: parseInt(record.power.split('(')[1].split(' ')[0], 10),
  }));
  return formattedRecords;
};

const getLatestVehicleRecords = async (title) => {
  const allRecords = await getVehicleRecords(title);
  // Get all record dates
  let dates = allRecords.map((record) => record.measureDate);
  dates = dates.sort((a, b) => b - a);
  const latestRecordDate = dates[0];

  // Only keep recprds that are max 1hr older than the most recent record (1st element in the sorted array)
  const latestRecords = [];
  for (const record of allRecords) {
    if (record.measureDate > latestRecordDate - 3600 * 1000) latestRecords.push(record);
  }
  return latestRecords;
};

export default {
  getVehicleList,
  addVehicle,
  deleteVehicle,
  getVehicleRecords,
  getLatestVehicleRecords,
};
