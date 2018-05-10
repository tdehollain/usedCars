import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import VehicleList from './VehicleList';
// import VehicleListBluePrint from './VehicleListBluePrint';

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
		
		let sortedList = this.props.vehicleList.sort((a,b) => {
			if (a.title < b.title)
				return -1;
			if (a.title > b.title)
				return 1;
			return 0;
		});

		return (
			<VehicleList
				vehicleList={sortedList}
				deleteVehicle={this.deleteVehicle}
			/>
			// <VehicleListBluePrint
			// 	vehicleList={sortedList}
			// 	deleteVehicle={this.deleteVehicle}
			// />
		)
	}
}

const mapStateToProps = (store) => {
	return { vehicleList: store.vehicleListState.vehicleList };
}

export default connect(mapStateToProps)(VehicleListContainer);