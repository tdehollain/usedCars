/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VehicleSelectionForm from './VehicleSelectionForm/VehicleSelectionForm';
import vehicleActions from '../Actions/vehicleActions';
import StatisticsView from './StatisticsView/StatisticsView';
// import ChartsView from './ChartsView';
import './HomeView.css';

const HomeView = (props) => {
  const [vehiclesRecords, setVehiclesRecords] = React.useState([]);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState(props.selectedVehicle.title || '');

  // When selectedVehicle changes: fetch vehicle's records
  React.useEffect(() => {
    if (selectedVehicleName) {
      const vehicleDetails = props.vehiclesList.find((el) => el.title === selectedVehicleName);
      props.updateSelectedVehicle(vehicleDetails);
    }
    // if (selectedVehicle === '') {
    //   // setSelectedVehicle('');
    //   setSelectedVehicleURL('');
    //   setVehiclesRecords([]);
    // } else {
    //   // setSelectedVehicle(selectedVehicle);
    //   // get selected vehicle URL
    //   for (const vehicle of vehiclesList) {
    //     if (vehicle.title === selectedVehicle) {
    //       setSelectedVehicleURL(vehicle.vehicleURL);
    //       break;
    //     }
    //   }
    //   // fetch vehicle records
    //   fetchVehicleRecords(selectedVehicle);
    // }
  }, [selectedVehicleName]);

  // When vehiclesRecords change: sort and remove outliers
  React.useEffect(() => {
    // const sortedVehiclesRecords = vehiclesRecords.sort((a, b) => a.price - b.price);

    // const vehicleRecords_noOutliers = removePriceOutliers(sortedVehiclesRecords);
    // setVehiclesRecords(vehicleRecords_noOutliers);
  }, [vehiclesRecords]);

  // When vehiclesRecords changes: update statistics
  React.useEffect(() => {
    // const nbVehicles = vehiclesRecords.length;
    // const medianPrice = nbVehicles ? math.median(vehiclesRecords.map((el) => el.price)) : 'N/A';
    // const priceP10 = nbVehicles ? vehiclesRecords[Math.floor(0.1 * nbVehicles)].price : 'N/A';
    // const priceP90 = nbVehicles ? vehiclesRecords[Math.floor(0.9 * nbVehicles)].price : 'N/A';

    // store.dispatch({
    //   type: 'UPDATE_VEHICLE_STATISTICS',
    //   data: {
    //     nbVehicles,
    //     medianPrice,
    //     priceP10,
    //     priceP90,
    //   },
    // });

    // setVehiclesRecords(vehiclesRecords);
  }, [vehiclesRecords]);

  // const fetchVehicleRecords = async (title) => {
  //   const vehicleRecords = await API.getLatestVehicleRecords(title);
  //   // console.log('# records: ' + vehicleRecords.length);

  //   setVehiclesRecords(vehicleRecords);
  // };

  // const removePriceOutliers = (vehicleRecords) => vehicleRecords.filter((el) => !isOutlier(vehicleRecords.map((vehicle) => parseFloat(vehicle.price)), parseFloat(el.price)));

  return (
    <div className="homeView">
      <div className="vehicleSelection">
        <span style={{ fontSize: '1rem' }}>Vehicle </span>
        <span id="numberOfVehicles" style={{ fontSize: '0.7rem', marginTop: '2px' }}>({props.vehiclesList.length || 'loading...'})</span>
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
      {/* <ChartsView selectedVehicle={selectedVehicle} selectedVehicleURL={selectedVehicleURL} vehiclesRecords={vehiclesRecords} /> */}
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
