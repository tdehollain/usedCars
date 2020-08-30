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
  } catch (err) {}
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

  try {
    const res = await fetch(URL, options);
    const rawData = await res.json();

    const sortedData = rawData.sort(sortByPropertyScrapDate);

    // Convert strings to numbers
    const formattedRecords = sortedData.map((record) => ({
      ...record,
      price: parseInt(record.price, 10),
      km: parseInt(record.km, 10),
      firstRegMonth: parseInt(record.firstRegMonth, 10),
      firstRegYear: parseInt(record.firstRegYear, 10),
      powerKW: parseInt(record.power.split(' kW')[0], 10),
      powerHp: parseInt(record.power.split('(')[1].split(' ')[0], 10),
    }));
    return formattedRecords;
  } catch (err) {}
};

export default {
  getVehicleList,
  addVehicle,
  deleteVehicle,
  getVehicleRecords,
  getLatestVehicleRecords,
};
