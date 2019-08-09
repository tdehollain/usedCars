import React, { Component } from 'react';
import { store } from '../store';
import math from 'mathjs';
import { isOutlier } from '../lib/mathUtil';
import VehicleSelectionForm from './VehicleSelectionForm';
import StatisticsView from './StatisticsView';
import ChartsView from './ChartsView';
import API from '../lib/API';

export default class HomeView extends Component {
  constructor() {
    super();

    this.state = {
      vehicleList: [],
      selectedVehicle: '',
      selectedVehicleURL: '',
      vehiclesData: []
    };

    this.changeSelectedVehicle = this.changeSelectedVehicle.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
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

  async componentDidMount() {
    const vehicleList = await API.getVehicleList();
    // const vehicleList = [
    //   { title: 'BMW M2', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M2 Competition', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M4 CS', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M4 GTS', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M5', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M5 Competition', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M6', vehicleURL: 'http://www.example.com' },
    //   { title: 'BMW M6 Gran Coupe', vehicleURL: 'http://www.example.com' },
    //   { title: 'Audi RS5 Mk1', vehicleURL: 'http://www.example.com' },
    //   { title: 'Audi RS5 Mk2 Coupe', vehicleURL: 'http://www.example.com' },
    //   { title: 'Audi RS5 Mk2 Sportback', vehicleURL: 'http://www.example.com' },
    //   { title: 'Aston Martin DB7', vehicleURL: 'http://www.example.com' },
    //   { title: 'Aston Martin DB9', vehicleURL: 'http://www.example.com' },
    //   { title: 'Aston Martin DB11', vehicleURL: 'http://www.example.com' },
    //   { title: 'Aston Martin Vanquish', vehicleURL: 'http://www.example.com' }
    // ];
    if (!vehicleList) return; // happens if offline
    this.setState({
      vehicleList: vehicleList
    });
    let selectedVehicle = localStorage.getItem('selectedVehicle');
    if (!selectedVehicle) selectedVehicle = '';
    this.updateSelectedVehicle(selectedVehicle);
  }

  changeSelectedVehicle(e) {
    let selectedVehicle = e.target.value;
    this.updateSelectedVehicle(selectedVehicle);
    localStorage.setItem('selectedVehicle', selectedVehicle);
  }

  updateSelectedVehicle(selectedVehicle) {
    if (selectedVehicle === '') {
      this.setState({ selectedVehicle: '', selectedVehicleURL: '', vehiclesData: [] });
    } else {
      // get vehicle data
      this.updateVehicleData(selectedVehicle);
      // get selected vehicle URL
      for (let vehicle of this.state.vehicleList) {
        if (vehicle.title === selectedVehicle) {
          this.setState({ selectedVehicle: selectedVehicle, selectedVehicleURL: vehicle.vehicleURL });
          break;
        }
      }
    }
  }

  async updateVehicleData(title) {
    // console.log('fetching vehicle data');
    const vehicleData = await API.getVehicleRecords(title);
    let sortedData = vehicleData.sort((a, b) => {
      return a.price - b.price;
    });
    let nbVehicles = vehicleData.length;
    console.log(nbVehicles);

    // remove price outliers
    let sortedData_filtered = sortedData.filter(
      el => !isOutlier(vehicleData.map(vehicle => parseFloat(vehicle.price)), parseFloat(el.price))
    );
    nbVehicles = sortedData_filtered.length;
    console.log(nbVehicles);

    // Update vehicle statistics
    let medianPrice = nbVehicles ? math.median(sortedData_filtered.map(el => el.price)) : 'N/A';
    let priceP10 = nbVehicles ? sortedData_filtered[Math.floor(0.1 * nbVehicles)].price : 'N/A';
    let priceP90 = nbVehicles ? sortedData_filtered[Math.floor(0.9 * nbVehicles)].price : 'N/A';

    store.dispatch({
      type: 'UPDATE_VEHICLE_STATISTICS',
      data: {
        nbVehicles,
        medianPrice,
        priceP10,
        priceP90
      }
    });

    this.setState({
      vehiclesData: sortedData_filtered
    });
  }

  render() {
    console.log('Rendering HomeView');

    return (
      <div className="homeView">
        <VehicleSelectionForm
          vehicleList={this.state.vehicleList}
          selectedVehicle={this.state.selectedVehicle}
          changeSelectedVehicle={this.changeSelectedVehicle}
        />
        <StatisticsView />
        {/* <ChartsView
          selectedVehicle={this.state.selectedVehicle}
          selectedVehicleURL={this.state.selectedVehicleURL}
          vehiclesData={this.state.vehiclesData}
        /> */}
      </div>
    );
  }
}
