import vehicleActionTypes from '../Actions/vehicleActionTypes';

const initialState = {
  vehiclesList: JSON.parse(localStorage.getItem('vehiclesList')) || [],
  selectedVehicle: JSON.parse(localStorage.getItem('selectedVehicle')) || {},
  selectedVehicleData: [],
  vehicleStatistics: {
    nbVehicles: null,
    medianPrice: null,
    priceP10: null,
    priceP90: null,
    slope1: null,
    slope2: null,
  },
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
      return { ...state, selectedVehicleData: action.vehicleRecords };

    case vehicleActionTypes.UPDATE_VEHICLE_STATISTICS:
      return { ...state, vehicleStatistics: action.vehicleStatistics };

    default: return state;
  }
};

export default vehiclesReducer;
