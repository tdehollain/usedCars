import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddVehicleForm from './AddVehicleForm';
import addVehicleFormActions from '../../Actions/addVehicleFormActions';

const AddVehicleFormContainer = (props) => {
  const validateForm = () => props.vehicle.title && props.vehicle.brand && props.vehicle.model && props.vehicle.regFrom;

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const vehicle = { ...props.vehicle, dateAdded: new Date(), editMode: props.editMode };
    // console.log(vehicle);
    await props.addVehicle(vehicle);
  };

  const changeValue = (e) => {
    const { id } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    props.changeValue(id, value);
  };

  return (
    <AddVehicleForm
      submitForm={handleSubmitForm}
      vehicle={props.vehicle}
      changeValue={changeValue}
      editMode={props.editMode}
    />
  );
};

AddVehicleFormContainer.propTypes = {
  vehicle: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  addVehicle: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  vehicle: store.vehiclesState.admin.vehicle,
  editMode: store.vehiclesState.admin.editMode,
});

const mapDispatchToProps = (dispatch) => ({
  addVehicle: (vehicle) => dispatch(addVehicleFormActions.addVehicle(vehicle)),
  changeValue: (id, value) => dispatch(addVehicleFormActions.changeValue(id, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddVehicleFormContainer);
