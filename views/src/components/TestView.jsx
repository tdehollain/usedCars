import React, { Component } from 'react';
import SingleVehicleData from './SingleVehicleData';

export default class TestView extends Component {
	render() {
		let vehicleDataComponent = this.props.vehicleData.length ? <SingleVehicleData vehicleData={this.props.vehicleData} /> : null;
		return (
			<div className='testView'>
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
				<div>
					{vehicleDataComponent}
				</div>
			</div>
		)
	}
}