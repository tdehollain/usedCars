import React from 'react';
import { connect } from 'react-redux';
import AddVehicleForm from './AddVehicleForm';
import addVehicleFormActions from './addVehicleFormActions';

const AddVehicleFormContainer = props => {
  const handleSubmitForm = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    let vehicle = { ...props.vehicle, dateAdded: new Date(), editMode: props.editMode };
    await props.addVehicle(vehicle);
  };

  const validateForm = () => {
    return props.vehicle.title && props.vehicle.brand && props.vehicle.model && props.vehicle.regFrom;
  };

  const changeValue = e => {
    const id = e.target.id;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    props.changeValue(id, value);
  };

  return <AddVehicleForm submitForm={handleSubmitForm} vehicle={props.vehicle} changeValue={changeValue} editMode={props.editMode} />;
};

const mapStateToProps = store => {
  return {
    vehicle: store.adminViewState.vehicle,
    editMode: store.adminViewState.editMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addVehicle: vehicle => dispatch(addVehicleFormActions.addVehicle(vehicle)),
    changeValue: (id, value) => dispatch(addVehicleFormActions.changeValue(id, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVehicleFormContainer);
