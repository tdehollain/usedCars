import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddVehicleForm from './AddVehicleForm';
import addVehicleFormActions from './addVehicleFormActions';

class AddVehicleFormContainer extends Component {
	constructor() {
		super();
		this.state = {
			title: ''
		}
		this.changeValue = this.changeValue.bind(this);
		this.handleSubmitForm = this.handleSubmitForm.bind(this);
	}

	async handleSubmitForm(e) {
		e.preventDefault();
		if (!this.validateForm()) return;

		let vehicle = { ...this.props.vehicle, dateAdded: new Date(), editMode: this.props.editMode };
		await this.props.addVehicle(vehicle);
	}

	validateForm() {
		return (this.props.vehicle.title && this.props.vehicle.brand && this.props.vehicle.model && this.props.vehicle.regFrom);
	}

	changeValue(e) {
		const id = e.target.id;
		const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		this.props.changeValue(id, value);
	}

	render() {
		return (
			<AddVehicleForm
				submitForm={this.handleSubmitForm}
				vehicle={this.props.vehicle}
				changeValue={this.changeValue}
				editMode={this.props.editMode}
			/>
		)
	}
}

const mapStateToProps = store => {
	return {
		vehicle: store.adminViewState.vehicle,
		editMode: store.adminViewState.editMode
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addVehicle: vehicle => dispatch(addVehicleFormActions.addVehicle(vehicle)),
		changeValue: (id, value) => dispatch(addVehicleFormActions.changeValue(id, value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddVehicleFormContainer);