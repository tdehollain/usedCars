import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import TestView from './TestView';

class TestViewContainer extends Component {
	constructor() {
		super();

		this.state = {
			selectedVehicle: '',
			vehicleData: []
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
		});
	}

	changeSelectedVehicle(e) {
		this.setState({ selectedVehicle: e.target.value });
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
				"type": "UPDATE_VEHICLE_DATA",
				vehicleData: res.data
			});
		});
	}

	render() {
		return (
			<TestView 
				vehicleList={this.props.vehicleList}
				selectedVehicle={this.state.selectedVehicle}
				changeSelectedVehicle={this.changeSelectedVehicle}
				vehicleData={this.props.vehicleData}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { 
		vehicleList: store.vehicleListState.vehicleList,
		vehicleData: store.vehicleDataState.vehicleData
	 };
}

export default connect(mapStateToProps)(TestViewContainer);