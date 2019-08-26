import serverlessConfig from './serverlessConfig';
import { sortByPropertyTitle, sortByPropertyScrapDate } from '../lib/util';

//============================
//=====   Vehicle List   =====
//============================

const getVehicleList = async () => {
  let URL = serverlessConfig.endpoints.vehicleListURL;
  let list = [];
  try {
    let res = await fetch(URL);
    let rawList = await res.json();
    let sortedList = rawList.sort(sortByPropertyTitle);
    list = sortedList;
    return list;
  } catch (err) {}
};

const addVehicle = async vehicle => {
  let URL = serverlessConfig.endpoints.vehicleListURL;
  let options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      // "Authorization": accessToken
    },
    body: JSON.stringify(vehicle)
  };

  try {
    let res = await fetch(URL, options);
    res = await res.json();
    return { res };
  } catch (err) {
    return { err };
  }
};

const deleteVehicle = async title => {
  let URL = serverlessConfig.endpoints.vehicleListURL;
  let options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      // "Authorization": accessToken
    },
    body: JSON.stringify(title)
  };

  try {
    let res = await fetch(URL, options);
    res = await res.json();
    return { res };
  } catch (err) {
    return { err };
  }
};

//============================
//=====   Vehicle Data   =====
//============================

const getLatestVehicleRecords = async title => {
  const allRecords = await getVehicleRecords(title);
  // Get all record dates
  let dates = allRecords.map(record => record.measureDate);
  dates = dates.sort((a, b) => b - a);
  const latestRecordDate = dates[0];

  // Only keep recprds that are max 1hr older than the most recent record (1st element in the sorted array)
  let latestRecords = [];
  for (let record of allRecords) {
    if (record.measureDate > latestRecordDate - 3600 * 1000) latestRecords.push(record);
  }
  return latestRecords;
};

const getVehicleRecords = async title => {
  let URL = serverlessConfig.endpoints.vehicleRecordsURL + '?title=' + title;
  let options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      // "Authorization": accessToken
    }
  };

  try {
    let res = await fetch(URL, options);
    let rawData = await res.json();

    let sortedData = rawData.sort(sortByPropertyScrapDate);
    return sortedData;
  } catch (err) {}
};

export default {
  getVehicleList,
  addVehicle,
  deleteVehicle,
  getVehicleRecords,
  getLatestVehicleRecords
};
