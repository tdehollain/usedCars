import vehicleListActionTypes from './vehicleListActionTypes';
import API from '../lib/API';
import vehicleActions from './vehicleActions';
import { AddVehicleToaster } from '../Components/AddVehicleToaster';

const getVehicleList = () => async (dispatch) => {
  const list = await API.getVehicleList();
  dispatch({
    type: vehicleListActionTypes.UPDATE_VEHICLE_LIST,
    vehicleList: list,
  });
  return list;
};

const editVehicle = (vehicle) => (dispatch) => {
  dispatch({
    type: vehicleListActionTypes.EDIT_VEHICLE,
    vehicle,
  });
};

const deleteVehicle = (title) => async (dispatch) => {
  const { err } = await API.deleteVehicle(title);
  if (err) {
    // TO DO: display error saying the operation failed
    AddVehicleToaster.show({ message: `Error: ${JSON.stringify(err)}`, intent: 'danger', icon: 'warning-sign', timeout: 5000 });
  } else {
    AddVehicleToaster.show({ message: 'Vehicle successfully removed', intent: 'warning', icon: 'tick', timeout: 2500 });
    dispatch(vehicleActions.updateVehiclesList());
  }
};

export default {
  getVehicleList,
  editVehicle,
  deleteVehicle,
};
