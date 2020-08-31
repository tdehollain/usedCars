/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VehicleSelectionForm from './VehicleSelectionForm/VehicleSelectionForm';
import vehicleActions from '../Actions/vehicleActions';
import StatisticsView from './StatisticsView/StatisticsView';
import ChartsView from './ChartsView/ChartsView';
import './HomeView.css';

const HomeView = (props) => {
  const [selectedVehicleName, setSelectedVehicleName] = React.useState(props.selectedVehicle.title || '');

  // When selectedVehicle changes: fetch vehicle's records
  React.useEffect(() => {
    if (selectedVehicleName) {
      const vehicleDetails = props.vehiclesList.find((el) => el.title === selectedVehicleName);
      props.updateSelectedVehicle(vehicleDetails);
    }
  }, [selectedVehicleName]);

  return (
    <div className="homeView">
      <div className="vehicleSelection">
        <span style={{ fontSize: '1rem' }}>Vehicle </span>
        <span id="numberOfVehicles" style={{ fontSize: '0.7rem', marginTop: '2px' }}>({props.vehiclesList.length || 'loading...'}):</span>
        <VehicleSelectionForm
          vehiclesList={props.vehiclesList}
          selectedVehicleName={selectedVehicleName}
          setSelectedVehicleName={setSelectedVehicleName}
        />
        <div className="linkAndLastUpdate">
          {Object.keys(props.selectedVehicle).length > 0 && <p>Last Update: {props.selectedVehicle.lastUpdate ? props.selectedVehicle.lastUpdate.slice(0, 10) : 'N/A'}</p>}
          {Object.keys(props.selectedVehicle).length > 0 && <a href={props.selectedVehicle.vehicleURL} target="_blank" rel="noopener noreferrer">Link</a>}
        </div>
      </div>
      <StatisticsView />
      <ChartsView selectedVehicle={props.selectedVehicle} />
    </div>
  );
};

HomeView.propTypes = {
  vehiclesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedVehicle: PropTypes.object.isRequired,
  updateSelectedVehicle: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  vehiclesList: store.vehiclesState.vehiclesList,
  selectedVehicle: store.vehiclesState.selectedVehicle,
});

const mapDispatchToProps = (dispatch) => ({
  updateSelectedVehicle: (vehicleDetails) => dispatch(vehicleActions.updateSelectedVehicle(vehicleDetails)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
