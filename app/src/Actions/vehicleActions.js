import API from '../lib/API';
import vehicleActionTypes from './vehicleActionTypes';
import { calculateStatistics } from '../lib/statistics';

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
  const vehicleStatistics = calculateStatistics(vehicleRecords);
  return {
    type: vehicleActionTypes.UPDATE_VEHICLE_STATISTICS,
    vehicleStatistics,
  };
};

const fetchVehicleRecords = (vehicleName) => async (dispatch) => {
  const vehicleRecords = await API.getVehicleRecords(vehicleName);
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
