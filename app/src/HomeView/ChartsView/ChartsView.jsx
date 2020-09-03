import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MedianPriceEvolution from '../../Components/MedianPriceEvolution';
import PriceDistribution from '../../Components/PriceDistribution';
import KmDistribution from '../../Components/KmDistribution';
import PriceKmScatter from '../../Components/PriceKmScatter';

const ChartsView = (props) => {
  if (!props.vehicleRecords.length) {
    return null;
  }
  return props.vehicleRecords.length && (
    <div className="chartsView">
      <MedianPriceEvolution
        data={props.vehicleStatistics}
        fontColor="#E1E8ED"
        lineColor="#FF6E4A"
        lineColor2="#FF6E4A"
        barColor="#2B95D6"
        chartWidth={1200}
      />
      <PriceDistribution
        data={props.vehicleRecords.slice(-1)[0].records}
        fontColor="#E1E8ED"
        barColor="#2B95D6"
        chartWidth={600}
      />
      <KmDistribution
        data={props.vehicleRecords.slice(-1)[0].records}
        fontColor="#E1E8ED"
        barColor="#2B95D6"
        chartWidth={600}
      />
      <PriceKmScatter
        data={props.vehicleRecords.slice(-1)[0].records}
        vehicleRegressions={props.vehicleRegressions}
        fontColor="#E1E8ED"
        markerColor="#2B95D6"
        lineColor="#EB532D"
        chartWidth={1200}
      />
    </div>
  );
};

ChartsView.propTypes = {
  vehicleRecords: PropTypes.arrayOf(PropTypes.object).isRequired,
  vehicleStatistics: PropTypes.arrayOf(PropTypes.object).isRequired,
  vehicleRegressions: PropTypes.shape({
    lowMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
    highMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
  }).isRequired,
};

const mapStateTpProps = (store) => ({
  vehicleRecords: store.vehiclesState.selectedVehicleRecords,
  vehicleStatistics: store.vehiclesState.selectedVehicleStatistics,
  vehicleRegressions: store.vehiclesState.selectedVehicleRegressions,
});

export default connect(mapStateTpProps)(ChartsView);
