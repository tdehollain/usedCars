import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import VehicleList from './VehicleList';

class VehicleListContainer extends Component {

	constructor() {
		super();
		this.state = {
			filteredList: [],
			searchTerm: ''
		};
		this.handleChangeSearchTerm = this.handleChangeSearchTerm.bind(this);
	}

	componentDidMount() {
		fetch('/api/getVehicleList')
		.then(res => res.json())
		.then(res => {
			let sortedList = res.vehicleList.sort((a,b) => {
				if (a.title < b.title)
					return -1;
				if (a.title > b.title)
					return 1;
				return 0;
			});
			this.setState({ filteredList: sortedList });
			store.dispatch({
				"type": "UPDATE_VEHICLE_LIST",
				vehicleList: sortedList
			});
		});
	}

	handleChangeSearchTerm(e) {
		this.setState({ 
			searchTerm: e.target.value,
			filteredList: this.props.vehicleList.filter(el => el.title.toLowerCase().includes(e.target.value.toLowerCase()))
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
				vehicleList={this.state.filteredList}
				deleteVehicle={this.deleteVehicle}
				searchTerm={this.state.searchTerm}
				handleChangeSearchTerm={this.handleChangeSearchTerm}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { vehicleList: store.vehicleListState.vehicleList };
}

export default connect(mapStateToProps)(VehicleListContainer);