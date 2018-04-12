import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import ChartsView from './ChartsView';

class ChartsViewContainer extends Component {
	constructor() {
		super();

		this.state = {
			selectedVehicle: '',
			vehiclesData: []
		}

		this.changeSelectedVehicle = this.changeSelectedVehicle.bind(this);
	}

	componentDidMount() {
		fetch('/api/getVehicleList')
		.then(res => res.json())
		.then(res => {
			store.dispatch({
				"type": "UPDATE_VEHICLE_LIST",
				vehicleList: res.vehicleList
			});
			let selectedVehicle = localStorage.getItem('selectedVehicle');
			this.setState({ selectedVehicle });
			this.updateVehicleData(selectedVehicle);
		});
	}

	changeSelectedVehicle(e) {
		this.setState({ selectedVehicle: e.target.value });
		localStorage.setItem('selectedVehicle', e.target.value);
		this.updateVehicleData(e.target.value);
	}

	updateVehicleData(title) {
		fetch('/api/getVehicleData', {
			'method': 'POST',
			'body': JSON.stringify({ title }),
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then(res => res.json())
		.then(res => {
			store.dispatch({
				"type": "UPDATE_VEHICLES_DATA",
				vehiclesData: res.data
			});
		});
	}

	render() {
		return (
			<ChartsView 
				vehicleList={this.props.vehicleList}
				selectedVehicle={this.state.selectedVehicle}
				changeSelectedVehicle={this.changeSelectedVehicle}
				vehiclesData={this.props.vehiclesData}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { 
		vehicleList: store.vehicleListState.vehicleList,
		vehiclesData: store.vehiclesDataState.vehiclesData
	 };
}

export default connect(mapStateToProps)(ChartsViewContainer);