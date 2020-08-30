import React from 'react';
import VehicleSelectionForm from './VehicleSelectionForm';
import EvolutionChartsView from './EvolutionChartsView';
import API from '../lib/API';
import { isOutlier } from '../lib/mathUtil';

const EvolutionView = props => {
  const [vehicleList, setVehicleList] = React.useState([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [selectedVehicleURL, setSelectedVehicleURL] = React.useState('');
  const [vehiclesRecords, setVehiclesRecords] = React.useState([]);
  const [sortedVehiclesRecords, setSortedVehiclesRecords] = React.useState([]);

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

  const fetchVehicleRecords = async title => {
    const vehiclesRecords = await API.getVehicleRecords(title);
    // console.log('# records: ' + vehiclesRecords.length);

    setVehiclesRecords(vehiclesRecords);
  };

  // When vehiclesRecords change: sort and remove outliers
  React.useEffect(() => {
    const sortedVehiclesRecords = vehiclesRecords.sort((a, b) => a.price - b.price);

    const vehicleRecords_noOutliers = removePriceOutliers(sortedVehiclesRecords);
    setSortedVehiclesRecords(vehicleRecords_noOutliers);
  }, [vehiclesRecords]);

  const removePriceOutliers = records => {
    return records.filter(el => !isOutlier(records.map(vehicle => parseFloat(vehicle.price)), parseFloat(el.price)));
  };

  const changeSelectedVehicle = async e => {
    let selectedVehicle = e.target.value;
    setSelectedVehicle(selectedVehicle);
    localStorage.setItem('selectedVehicle', selectedVehicle);
  };

  let sortedList = vehicleList.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  return (
    <div className="evolutionView">
      <VehicleSelectionForm vehicleList={vehicleList} selectedVehicle={selectedVehicle} changeSelectedVehicle={changeSelectedVehicle} />
      <EvolutionChartsView selectedVehicle={selectedVehicle} selectedVehicleURL={selectedVehicleURL} vehicleData={sortedVehiclesRecords} />
    </div>
  );
};

export default EvolutionView;
