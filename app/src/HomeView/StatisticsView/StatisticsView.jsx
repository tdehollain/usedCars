import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StatisticsBox from './StatisticsBox';
import { numberWithCommas } from '../../lib/mathUtil';
import './StatisticsView.css';

const StatisticsView = (props) => {
  if (!props.vehicleStatistics.length) return null;

  const latestVehicleStatistics = props.vehicleStatistics.slice(-1)[0].statistics;
  const priceRange = `${numberWithCommas(latestVehicleStatistics.priceP10)} € - ${numberWithCommas(latestVehicleStatistics.priceP90)} €`;

  return (
    <div className="statisticsContainer">
      <StatisticsBox
        number={numberWithCommas(latestVehicleStatistics.nbVehicles)}
        icon="drive-time"
        caption="Vehicles"
      />
      <StatisticsBox
        number={`${numberWithCommas(latestVehicleStatistics.medianPrice)} €`}
        icon="bank-account"
        caption="Median Price"
      />
      <StatisticsBox
        number={priceRange}
        icon="arrows-horizontal"
        caption={'Price Range\n(P10 - P90)'}
      />
      <StatisticsBox
        number={`${numberWithCommas(Math.round(10000 * latestVehicleStatistics.slope1))} €/10,000 km`}
        icon="trending-down"
        caption="Depreciation (0 - 10,000 km)"
      />
      <StatisticsBox
        number={`${numberWithCommas(Math.round(10000 * latestVehicleStatistics.slope2))} €/10,000 km`}
        icon="trending-down"
        caption="Depreciation (10,000+ km)"
      />
    </div>
  );
};

StatisticsView.propTypes = {
  vehicleStatistics: PropTypes.arrayOf(PropTypes.shape({
    yearmonth: PropTypes.number.isRequired,
    statistics: PropTypes.shape({
      nbVehicles: PropTypes.number,
      medianPrice: PropTypes.number,
      priceP10: PropTypes.number,
      priceP90: PropTypes.number,
      slope1: PropTypes.number,
      slope2: PropTypes.number,
    }).isRequired,
  })).isRequired,
};

const mapStateToProps = (store) => ({
  vehicleStatistics: store.vehiclesState.selectedVehicleStatistics,
});

export default connect(mapStateToProps)(StatisticsView);
