import React, { Component } from 'react';

export default class VehicleSelectionForm extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		if(
			nextProps.selectedVehicle === this.props.selectedVehicle && 
			nextProps.vehicleList.length === this.props.vehicleList.length
		) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		// console.log('Rendering VehicleSelectionForm');
		return (
			<form>
				<label className='pt-label'>
					Vehicle
					<div className='pt-select'>
						<select className='pt-select' value={this.props.selectedVehicle} onChange={this.props.changeSelectedVehicle}>
							<option></option>
							{this.props.vehicleList.map(el => <option key={el._id}>{el.title}</option>)}
						</select>
					</div>
				</label>
			</form>
		);
	}
}