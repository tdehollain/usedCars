import vehicleActionTypes from '../Actions/vehicleActionTypes';
import addVehicleFormActionTypes from '../Actions/addVehicleFormActionTypes';
import vehicleListActionTypes from '../Actions/vehicleListActionTypes';
import { buildURL } from '../lib/util';

const initialState = {
  vehiclesList: JSON.parse(localStorage.getItem('vehiclesList')) || [],
  selectedVehicle: JSON.parse(localStorage.getItem('selectedVehicle')) || {},
  selectedVehicleRecords: [],
  selectedVehicleStatistics: [],
  admin: {
    vehicle: {
      title: '',
      brand: '',
      model: '',
      version: '',
      regFrom: '',
      regTo: '',
      chFrom: '',
      chTo: '',
      doorsFrom: '',
      doorsTo: '',
      checkedTransAuto: true,
      checkedTransMan: true,
      checkedTransSemi: true,
      checkedFuelPetrol: true,
      checkedFuelDiesel: true,
      checkedFuelElec: true,
      checkedFuelElecPetrol: true,
      checkedFuelElecDiesel: true,
      checkedBodyCompact: true,
      checkedBodyConvertible: true,
      checkedBodyCoupe: true,
      checkedBodySUV: true,
      checkedBodySedan: true,
      checkedBodySW: true,
      vehicleURL: 'https://www.autoscout24.com/results',
    },
    vehicleList: [],
    editMode: false,
  },
};

const vehiclesReducer = (state = initialState, action) => {
  let newVehicle = {};
  let vehicleURL = '';
  let editMode = false;
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

    case addVehicleFormActionTypes.CHANGE_VALUE:
      newVehicle = { ...state.admin.vehicle, [action.id]: action.value };
      vehicleURL = buildURL(newVehicle);
      // Find if vehicle with this title already exists
      editMode = state.admin.editMode;
      if (action.id === 'title') {
        editMode = state.vehiclesList.map((el) => el.title).includes(action.value);
      }
      return { ...state, admin: { ...state.admin, vehicle: { ...newVehicle, vehicleURL }, editMode } };

    case vehicleListActionTypes.EDIT_VEHICLE:
      return { ...state, admin: { ...state.admin, vehicle: { ...action.vehicle, vehicleURL: buildURL(action.vehicle) }, editMode: true } };

      // case vehicleListActionTypes.DELETE_VEHICLE:
      //   return { ...state, vehiclesList: state.vehiclesList.filter((el) => el.title !== action.title) };

    default: return state;
  }
};

export default vehiclesReducer;
