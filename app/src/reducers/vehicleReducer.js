import vehicleActionTypes from '../Actions/vehicleActionTypes';

const initialState = {
  vehiclesList: JSON.parse(localStorage.getItem('vehiclesList')) || [],
  selectedVehicle: JSON.parse(localStorage.getItem('selectedVehicle')) || {},
  selectedVehicleRecords: [],
  selectedVehicleStatistics: [],
};

const vehiclesReducer = (state = initialState, action) => {
  switch (action.type) {
    case vehicleActionTypes.UPDATE_VEHICLE_LIST:
      localStorage.setItem('vehiclesList', JSON.stringify(action.vehiclesList));
      return { ...state, vehiclesList: action.vehiclesList };

    case vehicleActionTypes.UPDATE_SELECTED_VEHICLE:
      localStorage.setItem('selectedVehicle', JSON.stringify(action.vehicleDetails));
      return { ...state, selectedVehicle: action.vehicleDetails };

    case vehicleActionTypes.UPDATE_VEHICLE_RECORDS:
      return { ...state, selectedVehicleRecords: action.vehicleRecords };

    case vehicleActionTypes.UPDATE_VEHICLE_STATISTICS:
      return { ...state, selectedVehicleStatistics: action.vehicleStatistics };

    default: return state;
  }
};

export default vehiclesReducer;
