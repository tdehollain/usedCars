import { Intent, Toaster } from '@blueprintjs/core';
import API from '../lib/API';
import vehicleActionTypes from './vehicleActionTypes';
import { calculateStatistics, calculateRegressions, removeOutliers } from '../lib/statistics';
import { regressionsKmSplit } from '../lib/constants';

const errorToaster = Toaster.create();

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
  // For all yearmonth: basic stats (median, p10, p90)
  const vehicleStatistics = vehicleRecords.map((currentVehicleRecords) => ({
    yearmonth: currentVehicleRecords.yearmonth,
    statistics: calculateStatistics(currentVehicleRecords.records),
  }));

  // For latest yearmonth: regressions
  const vehicleLatestRegressions = calculateRegressions(vehicleRecords.slice(-1)[0].records, regressionsKmSplit);

  return {
    type: vehicleActionTypes.UPDATE_VEHICLE_STATISTICS,
    vehicleStatistics,
    vehicleLatestRegressions,
  };
};

const fetchVehicleRecords = (vehicleName) => async (dispatch) => {
  let allVehicleRecords;
  try {
    allVehicleRecords = await API.getVehicleRecords(vehicleName);
  } catch (err) {
    errorToaster.show({ message: `Error getting vehicle records: ${err}`, intent: Intent.DANGER, icon: 'warning-sign' });
    return;
  }
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
