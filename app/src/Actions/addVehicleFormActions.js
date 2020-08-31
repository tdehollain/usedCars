import addVehicleFormActionTypes from './addVehicleFormActionTypes';
import vehicleActions from './vehicleActions';
import { AddVehicleToaster } from '../Components/AddVehicleToaster';
import API from '../lib/API';

const addVehicle = (vehicle) => async (dispatch) => {
  const { err, res } = await API.addVehicle(vehicle);
  if (err) {
    // TO DO: implement better notification of failure
    AddVehicleToaster.show({ message: `Error: ${JSON.stringify(err)}`, intent: 'danger', icon: 'warning-sign', timeout: 5000 });
  } else {
    // alert('vehicle successfully added / modified');
    AddVehicleToaster.show({ message: 'Vehicle successfully added / udpated', intent: 'success', icon: 'tick', timeout: 2500 });
    dispatch(vehicleActions.updateVehiclesList());
  }
};

const changeValue = (id, value) => (dispatch) => {
  dispatch({
    type: addVehicleFormActionTypes.CHANGE_VALUE,
    id,
    value,
  });
};

export default {
  addVehicle,
  changeValue,
};
