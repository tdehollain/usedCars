import vehicleListActionTypes from './vehicleListActionTypes';
import API from '../../lib/API';

const getVehicleList = () => {
	return async (dispatch) => {
		let list = await API.getVehicleList();
		dispatch({
			type: vehicleListActionTypes.UPDATE_VEHICLE_LIST,
			vehicleList: list
		});
		return list;
	}
}

const editVehicle = vehicle => {
	return dispatch => {
		dispatch({
			type: vehicleListActionTypes.EDIT_VEHICLE,
			vehicle
		});
	}
}

const deleteVehicle = title => {
	return async (dispatch) => {
		let { err } = await API.deleteVehicle(title);
		if (err) {
			// TO DO: display error saying the operation failed
			console.log(err);
		} else {
			alert('vehicle successfully deleted');
			dispatch({
				type: vehicleListActionTypes.DELETE_VEHICLE,
				title
			})
		}
	}
}

export default {
	getVehicleList,
	editVehicle,
	deleteVehicle
}