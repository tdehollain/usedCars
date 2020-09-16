/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VehicleSelectionForm from './VehicleSelectionForm/VehicleSelectionForm';
import vehicleActions from '../Actions/vehicleActions';
import StatisticsView from './StatisticsView/StatisticsView';
import ChartsView from './ChartsView/ChartsView';
import './HomeView.css';

const HomeView = () => {
  const { vehiclesList, selectedVehicle } = useSelector((store) => store.vehiclesState);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState(selectedVehicle.title || '');

  const dispatch = useDispatch();
  const stableDispatch = React.useCallback(dispatch, []);

  // When selectedVehicle changes: fetch vehicle's records
  React.useEffect(() => {
    if (selectedVehicleName) {
      const vehicleDetails = vehiclesList.find((el) => el.title === selectedVehicleName);
      stableDispatch(vehicleActions.updateSelectedVehicle(vehicleDetails));
    }
  }, [selectedVehicleName, vehiclesList, stableDispatch]);

  return (
    <div className="homeView">
      <div className="vehicleSelection">
        <span style={{ fontSize: '1rem' }}>Vehicle </span>
        <span id="numberOfVehicles" style={{ fontSize: '0.7rem', marginTop: '2px' }}>({vehiclesList.length || 'loading...'}):</span>
        <VehicleSelectionForm
          vehiclesList={vehiclesList}
          selectedVehicleName={selectedVehicleName}
          setSelectedVehicleName={setSelectedVehicleName}
        />
        <div className="linkAndLastUpdate">
          {Object.keys(selectedVehicle).length > 0 && <p>Last Update: {selectedVehicle.lastUpdate ? selectedVehicle.lastUpdate.slice(0, 10) : 'N/A'}</p>}
          {Object.keys(selectedVehicle).length > 0 && <a href={selectedVehicle.vehicleURL} target="_blank" rel="noopener noreferrer">Link</a>}
        </div>
      </div>
      <StatisticsView />
      <ChartsView selectedVehicle={selectedVehicle} />
    </div>
  );
};

export default HomeView;
