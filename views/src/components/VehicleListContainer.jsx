import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import VehicleList from './VehicleList';

class VehicleListContainer extends Component {

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

	deleteVehicle(id) {
		fetch('/api/deleteVehicle/' + id)
		.then(res => res.json())
		.then(res => {
			if(res.success) {
				store.dispatch({
					"type": "DELETE_VEHICLE",
					"id": id
				});
			}
		});
	}

	render() {
		return (
			<VehicleList 
				vehicleList={this.props.vehicleList}
				deleteVehicle={this.deleteVehicle}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { vehicleList: store.vehicleListState.vehicleList };
}

export default connect(mapStateToProps)(VehicleListContainer);