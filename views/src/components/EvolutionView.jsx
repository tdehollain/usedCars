import React, { Component } from 'react';
import VehicleSelectionForm from './VehicleSelectionForm';
import EvolutionChartsView from './EvolutionChartsView';

export default class EvolutionView extends Component {

	constructor() {
		super();

		this.state = {
			vehicleList: [],
			selectedVehicle: '',
			selectedVehicleURL: '',
			vehicleData: []
		}

		this.changeSelectedVehicle = this.changeSelectedVehicle.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(
			nextState.selectedVehicle === this.state.selectedVehicle && 
			nextState.vehicleList.length === this.state.vehicleList.length &&
			nextState.vehicleData.length === this.state.vehicleData.length
		) {
			return false;
		} else {
			// if(nextState.vehicleList.length !== this.state.vehicleList.length) console.log('Update due to: vehicleList');
			// if(nextState.selectedVehicle !== this.state.selectedVehicle) console.log('Update due to: selectedVehicle');
			// if(nextState.vehicleData.length !== this.state.vehicleData.length) console.log('Update due to: vehicleData');
			return true;
		}
	}

	componentDidMount() {
		fetch('/api/getVehicleList')
		.then(res => res.json())
		.then(res => {
			this.setState({
				vehicleList: res.vehicleList
			});
			let selectedVehicle = localStorage.getItem('selectedVehicle');
			if(!selectedVehicle) selectedVehicle = '';
			this.updateSelectedVehicle(selectedVehicle);
		});
	}

	changeSelectedVehicle(e) {
		let selectedVehicle = e.target.value;
		this.updateSelectedVehicle(selectedVehicle);
		localStorage.setItem('selectedVehicle', selectedVehicle);
	}

	updateSelectedVehicle(selectedVehicle) {
		if(selectedVehicle === '') {
			this.setState({ selectedVehicle: '', selectedVehicleURL: '', vehicleData: [] });
		} else {
			// get vehicle data
			this.updateVehicleData(selectedVehicle);
			// get selected vehicle URL
			for(let el of this.state.vehicleList) {
				if(el.title === selectedVehicle) {
					this.setState({ selectedVehicle: selectedVehicle, selectedVehicleURL: el.vehicleURL });
					break;
				}
			}
		}
	}

	updateVehicleData(title) {
		// console.log('fetching vehicle data');
		fetch('/api/getAllVehicleData', {
			'method': 'POST',
			'body': JSON.stringify({ title }),
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then(res => res.json())
		.then(res => {
			let vehicleData = res.data;
			this.setState({
				vehicleData: vehicleData
			});
		});
	}

	render() {
		let sortedList = this.state.vehicleList.sort((a,b) => {
			if (a.title < b.title)
				return -1;
			if (a.title > b.title)
				return 1;
			return 0;
		});

		return (
			<div className='evolutionView'>
				<VehicleSelectionForm 
					vehicleList={sortedList}
					selectedVehicle={this.state.selectedVehicle}
					changeSelectedVehicle={this.changeSelectedVehicle}
				/>
				<EvolutionChartsView
					selectedVehicle={this.state.selectedVehicle}
					selectedVehicleURL={this.state.selectedVehicleURL}
					vehicleData={this.state.vehicleData}
				/>
			</div>
		);
	}
}