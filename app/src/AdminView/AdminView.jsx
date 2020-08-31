import React from 'react';
import AddVehicleFormContainer from './AddVehiceForm/AddVehicleFormContainer';
import VehicleListContainer from './VehicleList/VehicleListContainer';

const AdminView = props => (
  <div className="adminView">
    <AddVehicleFormContainer />
    <VehicleListContainer />
  </div>
);

export default AdminView;
