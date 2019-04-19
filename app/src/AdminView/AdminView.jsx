import React, { Component } from 'react';
import AddVehicleFormContainer from './AddVehiceForm/AddVehicleFormContainer';
import VehicleListContainer from './VehicleList/VehicleListContainer';

export default class AdminView extends Component {
	render() {
		return (
			<div className='adminView'>
				<AddVehicleFormContainer />
				<VehicleListContainer />
			</div>
		)
	}
}