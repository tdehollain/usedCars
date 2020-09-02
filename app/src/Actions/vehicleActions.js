import API from '../lib/API';
import vehicleActionTypes from './vehicleActionTypes';
import { calculateStatistics, removeOutliers } from '../lib/statistics';

const updateVehiclesList = () => async (dispatch) => {
  const list = await API.getVehicleList();
  if (list) {
    dispatch({
      type: vehicleActionTypes.UPDATE_VEHICLE_LIST,
      vehiclesList: list,
    });
  } else {
    // happens if offline
  }
};

const updateStatistics = (vehicleRecords) => {
  const vehicleStatistics = vehicleRecords.map((currentVehicleRecords) => ({
    yearmonth: currentVehicleRecords.yearmonth,
    statistics: calculateStatistics(currentVehicleRecords.records),
  }));
  return {
    type: vehicleActionTypes.UPDATE_VEHICLE_STATISTICS,
    vehicleStatistics,
  };
};

const fetchVehicleRecords = (vehicleName) => async (dispatch) => {
  const allVehicleRecords = await API.getVehicleRecords(vehicleName);
  const allYearMonths = [...new Set(allVehicleRecords.map((el) => el.yearmonth))].sort();

  // Build array of records for each measurement month (+ remove outliers for each)
  const vehicleRecords = allYearMonths.map((currentYearMonth) => ({
    yearmonth: currentYearMonth,
    records: removeOutliers(allVehicleRecords.filter((el) => el.yearmonth === currentYearMonth)),
  }));

  dispatch({
    type: vehicleActionTypes.UPDATE_VEHICLE_RECORDS,
    vehicleRecords,
  });

  dispatch(updateStatistics(vehicleRecords));
};

const updateSelectedVehicle = (vehicleDetails) => async (dispatch) => {
  // Dispatch action to fetch vehicle records
  dispatch(fetchVehicleRecords(vehicleDetails.title));

  dispatch({
    type: vehicleActionTypes.UPDATE_SELECTED_VEHICLE,
    vehicleDetails,
  });
};

export default {
  updateVehiclesList,
  updateSelectedVehicle,
};
