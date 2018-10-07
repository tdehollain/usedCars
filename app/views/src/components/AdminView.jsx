import React, { Component } from 'react';
import AddVehicleFormContainer from './AddVehicleFormContainer';
import VehicleListContainer from './VehicleListContainer';

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