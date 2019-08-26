import React from 'react';
import { store } from '../store';
import math from 'mathjs';
import { isOutlier } from '../lib/mathUtil';
import VehicleSelectionForm from './VehicleSelectionForm';
import StatisticsView from './StatisticsView';
import ChartsView from './ChartsView';
import API from '../lib/API';

const HomeView = props => {
  const [vehicleList, setVehicleList] = React.useState([]);
  const [vehiclesRecords, setVehiclesRecords] = React.useState([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [selectedVehicleURL, setSelectedVehicleURL] = React.useState('');

  // When mounting: loading list of vehicles
  React.useEffect(() => {
    const getVehicleList = async () => {
      const list = await API.getVehicleList();
      if (!list) return; // happens if offline
      setVehicleList(list);
    };
    getVehicleList();
  }, []);

  // When list of vehicles is received: get selected vehicle from localStorage
  React.useEffect(() => {
    if (vehicleList.length > 0) {
      // get selected vehicle from Local Storage
      let storedVehicle = localStorage.getItem('selectedVehicle');
      if (!storedVehicle) storedVehicle = '';
      setSelectedVehicle(storedVehicle);
    }
  }, [vehicleList]);

  // When selectedVehicle changes: fetch vehicle's records
  React.useEffect(() => {
    // console.log('selectedVehicle: ' + selectedVehicle);
    if (selectedVehicle === '') {
      // setSelectedVehicle('');
      setSelectedVehicleURL('');
      setVehiclesRecords([]);
    } else {
      // setSelectedVehicle(selectedVehicle);
      // get selected vehicle URL
      for (let vehicle of vehicleList) {
        if (vehicle.title === selectedVehicle) {
          setSelectedVehicleURL(vehicle.vehicleURL);
          break;
        }
      }
      // fetch vehicle records
      fetchVehicleRecords(selectedVehicle);
    }
  }, [selectedVehicle]);

  // When vehiclesRecords change: sort and remove outliers
  React.useEffect(() => {
    const sortedVehiclesRecords = vehiclesRecords.sort((a, b) => a.price - b.price);

    const vehicleRecords_noOutliers = removePriceOutliers(sortedVehiclesRecords);
    setVehiclesRecords(vehicleRecords_noOutliers);
  }, [vehiclesRecords]);

  // When vehiclesRecords changes: update statistics
  React.useEffect(() => {
    const nbVehicles = vehiclesRecords.length;
    const medianPrice = nbVehicles ? math.median(vehiclesRecords.map(el => el.price)) : 'N/A';
    const priceP10 = nbVehicles ? vehiclesRecords[Math.floor(0.1 * nbVehicles)].price : 'N/A';
    const priceP90 = nbVehicles ? vehiclesRecords[Math.floor(0.9 * nbVehicles)].price : 'N/A';

    store.dispatch({
      type: 'UPDATE_VEHICLE_STATISTICS',
      data: {
        nbVehicles,
        medianPrice,
        priceP10,
        priceP90
      }
    });

    setVehiclesRecords(vehiclesRecords);
  }, [vehiclesRecords]);

  const fetchVehicleRecords = async title => {
    const vehicleRecords = await API.getLatestVehicleRecords(title);
    // console.log('# records: ' + vehicleRecords.length);

    setVehiclesRecords(vehicleRecords);
  };

  const removePriceOutliers = vehicleRecords => {
    return vehicleRecords.filter(el => !isOutlier(vehicleRecords.map(vehicle => parseFloat(vehicle.price)), parseFloat(el.price)));
  };

  const changeSelectedVehicle = async e => {
    let selectedVehicle = e.target.value;
    setSelectedVehicle(selectedVehicle);
    localStorage.setItem('selectedVehicle', selectedVehicle);
  };

  return (
    <div className="homeView">
      <VehicleSelectionForm vehicleList={vehicleList} selectedVehicle={selectedVehicle} changeSelectedVehicle={changeSelectedVehicle} />
      <StatisticsView />
      <ChartsView selectedVehicle={selectedVehicle} selectedVehicleURL={selectedVehicleURL} vehiclesRecords={vehiclesRecords} />
    </div>
  );
};

export default HomeView;
