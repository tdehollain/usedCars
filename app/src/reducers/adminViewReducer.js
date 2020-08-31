import vehicleListActionTypes from '../AdminView/VehicleList/vehicleListActionTypes';
import addVehicleFormActionTypes from '../AdminView/AddVehiceForm/addVehicleFormActionTypes';
import { buildURL, sortByPropertyTitle } from '../lib/util';

const adminViewState = {
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
		vehicleURL: `https://www.autoscout24.com/results`
	},
	vehicleList: [],
	editMode: false
};

const adminViewReducer = (state = adminViewState, action) => {
	switch (action.type) {
		case addVehicleFormActionTypes.ADD_VEHICLE:
			// remove vehicle from list if it is there (edit mode)
			const oldList = state.vehicleList.filter(el => el.title !== action.vehicle.title)
			const newList = [action.vehicle, ...oldList];
			const newList_sorted = newList.sort(sortByPropertyTitle);
			return { ...state, vehicleList: newList_sorted };
		case addVehicleFormActionTypes.CHANGE_VALUE:
			const newVehicle = { ...state.vehicle, [action.id]: action.value };
			const vehicleURL = buildURL(newVehicle);
			// Find if vehicle with this title already exists
			let editMode = state.editMode;
			if (action.id === "title") {
				const vehicleTitles = state.vehicleList.map(el => el.title);
				editMode = vehicleTitles.includes(action.value);
			}
			return { ...state, vehicle: { ...newVehicle, vehicleURL }, editMode };
		case vehicleListActionTypes.EDIT_VEHICLE:
			return { ...state, vehicle: { ...action.vehicle, vehicleURL: buildURL(action.vehicle) }, editMode: true };
		case vehicleListActionTypes.DELETE_VEHICLE:
			return { ...state, vehicleList: state.vehicleList.filter(el => el.title !== action.title) };
		case vehicleListActionTypes.UPDATE_VEHICLE_LIST:
			return { ...state, vehicleList: action.vehicleList };
		default: return state
	}
};

export default adminViewReducer;