/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
// import MySelect from './MySelect';
import './VehicleSelectionForm.css';

const VehicleSelectionForm = (props) => (
  <form className="vehicleSelectionForm">
    <label className="pt-label">
      <div className="pt-select">
        <select className="pt-select" value={props.selectedVehicleName} onChange={(e) => props.setSelectedVehicleName(e.target.value)}>
          <option />
          {props.vehiclesList.map((el) => (
            <option key={el.title}>{el.title}</option>
          ))}
        </select>
        {/* <MySelect
            items={props.vehiclesList.map(el => el.title)}
            selectedItem={props.selectedVehicleName}
            onItemSelect={props.changeSelectedVehicle}
            allowCreate={false}
            filterable={true}
            width={300}
          /> */}
      </div>
    </label>
  </form>
);

VehicleSelectionForm.propTypes = {
  vehiclesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedVehicleName: PropTypes.string.isRequired,
  setSelectedVehicleName: PropTypes.func.isRequired,
};

export default VehicleSelectionForm;
