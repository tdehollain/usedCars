import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StatisticsBox from './StatisticsBox';
import { numberWithCommas } from '../../lib/mathUtil';
import './StatisticsView.css';

const StatisticsView = (props) => {
  const priceRange = `${numberWithCommas(props.vehiclesStatistics.priceP10)} € - ${numberWithCommas(props.vehiclesStatistics.priceP90)} €`;

  return (
    <div className="statisticsContainer">
      <StatisticsBox
        number={numberWithCommas(props.vehiclesStatistics.nbVehicles)}
        icon="drive-time"
        caption="Vehicles"
      />
      <StatisticsBox
        number={`${numberWithCommas(props.vehiclesStatistics.medianPrice)} €`}
        icon="bank-account"
        caption="Median Price"
      />
      <StatisticsBox
        number={priceRange}
        icon="arrows-horizontal"
        caption={'Price Range\n(P10 - P90)'}
      />
      <StatisticsBox
        number={`${numberWithCommas(Math.round(10000 * props.vehiclesStatistics.slope1))} €/10,000 km`}
        icon="trending-down"
        caption="Depreciation (0 - 10,000 km)"
      />
      <StatisticsBox
        number={`${numberWithCommas(Math.round(10000 * props.vehiclesStatistics.slope2))} €/10,000 km`}
        icon="trending-down"
        caption="Depreciation (10,000+ km)"
      />
    </div>
  );
};

StatisticsView.propTypes = {
  vehiclesStatistics: PropTypes.shape({
    nbVehicles: PropTypes.number,
    medianPrice: PropTypes.number,
    priceP10: PropTypes.number,
    priceP90: PropTypes.number,
    slope1: PropTypes.number,
    slope2: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = (store) => ({
  vehiclesStatistics: store.vehiclesState.vehicleStatistics,
});

export default connect(mapStateToProps)(StatisticsView);
