import React, { Component } from 'react';
import { store } from '../store';
import math from 'mathjs';
import VehicleSelectionForm from './VehicleSelectionForm';
import StatisticsView from './StatisticsView';
import ChartsView from './ChartsView';

export default class HomeView extends Component {

	constructor() {
		super();

		this.state = {
			vehicleList: [],
			selectedVehicle: '',
			selectedVehicleURL: '',
			vehiclesData: []
		}

		this.changeSelectedVehicle = this.changeSelectedVehicle.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(
			nextState.selectedVehicle === this.state.selectedVehicle && 
			nextState.vehicleList.length === this.state.vehicleList.length &&
			nextState.vehiclesData.length === this.state.vehiclesData.length
		) {
			return false;
		} else {
			// if(nextState.vehicleList.length !== this.state.vehicleList.length) console.log('Update due to: vehicleList');
			// if(nextState.selectedVehicle !== this.state.selectedVehicle) console.log('Update due to: selectedVehicle');
			// if(nextState.vehiclesData.length !== this.state.vehiclesData.length) console.log('Update due to: vehiclesData');
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
			this.setState({ selectedVehicle: '', selectedVehicleURL: '', vehiclesData: [] });
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
			let vehicleData = res.data;
			let sortedData = vehicleData.sort((a,b) => {
				return a.price - b.price;
			});
			
			let nbVehicles = vehicleData.length;
			let medianPrice;
			let priceP10;
			let priceP90;
			let sortedData_filtered;
			// remove price outliers
			if(nbVehicles) {
				let priceQ1 = nbVehicles ? sortedData[Math.floor(0.25*nbVehicles)].price : 'N/A'; // 1st quartile
				let priceQ3 = nbVehicles ? sortedData[Math.floor(0.75*nbVehicles)].price : 'N/A'; // 3rd quartile
				let IQrange = nbVehicles ? priceQ3 - priceQ1 : 'N/A';
				let lowerOuterFence = nbVehicles ? priceQ1 - 3*IQrange : 'N/A';
				let upperOuterFence = nbVehicles ? priceQ3 + 3*IQrange : 'N/A';
				let vehicleData_filtered = [];
				for(let i=0; i<vehicleData.length; i++) {
					if(vehicleData[i].price < upperOuterFence && vehicleData[i].price > lowerOuterFence) vehicleData_filtered.push(vehicleData[i]);
				}
				sortedData_filtered = vehicleData_filtered.sort((a,b) => {
					return a.price - b.price;
				});
				
				nbVehicles = sortedData_filtered.length;

				// Update vehicle statistics
				medianPrice = math.median(sortedData_filtered.map(el => el.price));
				priceP10 = sortedData_filtered[Math.floor(0.1*nbVehicles)].price;
				priceP90 = sortedData_filtered[Math.floor(0.9*nbVehicles)].price;

				store.dispatch({
					type: 'UPDATE_VEHICLE_STATISTICS',
					data: { 
						nbVehicles, 
						medianPrice,
						priceP10,
						priceP90
					}
				});
			} else {
				medianPrice = 'N/A';
				priceP10 = 'N/A';
				priceP90 = 'N/A';
				sortedData_filtered = sortedData;

				store.dispatch({
					type: 'UPDATE_VEHICLE_STATISTICS',
					data: { 
						nbVehicles, 
						medianPrice,
						priceP10,
						priceP90,
						slope1: 'N/A',
						slope2: 'N/A',
					}
				});
			}

			this.setState({
				vehiclesData: sortedData_filtered
			});
		});
	}

	render() {
		// console.log('Rendering HomeView');
		let sortedList = this.state.vehicleList.sort((a,b) => {
			if (a.title < b.title)
				return -1;
			if (a.title > b.title)
				return 1;
			return 0;
		});

		return (
			<div className='homeView'>
				<VehicleSelectionForm 
					vehicleList={sortedList}
					selectedVehicle={this.state.selectedVehicle}
					changeSelectedVehicle={this.changeSelectedVehicle}
				/>
				<StatisticsView />
				<ChartsView
					selectedVehicle={this.state.selectedVehicle}
					selectedVehicleURL={this.state.selectedVehicleURL}
					vehiclesData={this.state.vehiclesData}
				/>
			</div>
		)
	}
}