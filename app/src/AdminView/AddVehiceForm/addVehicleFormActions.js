import addVehicleFormActionTypes from './addVehicleFormActionTypes';
import { AddVehicleToaster } from '../../Components/AddVehicleToaster';
import API from '../../lib/API';

const addVehicle = vehicle => {
  return async dispatch => {
    let { err, res } = await API.addVehicle(vehicle);
    if (err) {
      // TO DO: implement better notification of failure
      alert('Error adding vehicle: ' + err);
    } else {
      // alert('vehicle successfully added / modified');
      AddVehicleToaster.show({ message: 'Vehicle successfully added / udpated', intent: 'success', icon: 'tick', timeout: 2500 });
      dispatch({
        type: addVehicleFormActionTypes.ADD_VEHICLE,
        vehicle: { ...vehicle, timingDay: res.timingDay, timingHour: res.timingHour }
      });
    }
  };
};

const changeValue = (id, value) => {
  return dispatch => {
    dispatch({
      type: addVehicleFormActionTypes.CHANGE_VALUE,
      id,
      value
    });
  };
};

export default {
  addVehicle,
  changeValue
};
