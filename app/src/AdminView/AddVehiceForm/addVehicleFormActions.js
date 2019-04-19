import addVehicleFormActionTypes from './addVehicleFormActionTypes';
import API from "../../lib/API";

const addVehicle = vehicle => {
	return async dispatch => {
		let { err, res } = await API.addVehicle(vehicle);
		if (err) {
			// TO DO: implement better notification of failure
			alert('Error adding vehicle: ' + err)
		} else {
			alert('vehicle successfully added / modified');
			dispatch({
				type: addVehicleFormActionTypes.ADD_VEHICLE,
				vehicle: { ...vehicle, timingDay: res.timingDay, timingHour: res.timingHour }
			});
		}
	}
}

const changeValue = (id, value) => {
	return dispatch => {
		dispatch({
			type: addVehicleFormActionTypes.CHANGE_VALUE,
			id,
			value
		});
	}
}

export default {
	addVehicle,
	changeValue
}