import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MedianPriceEvolution from '../../Components/MedianPriceEvolution';
import PriceDistribution from '../../Components/PriceDistribution';
// import Histogram from './Histogram';
// import KmDistribution from './KmDistribution';
// import PriceKmScatter from './PriceKmScatter';
import { maxNumberOfBins } from '../../lib/constants';
// import { formatDate_ddmmyyy } from '../../lib/util';

const ChartsView = (props) =>
// const [measureDate, setMeasureDate] = React.useState('');

// When vehicleRecords changes, define the measureDate string
// React.useEffect(() => {
//   const measureDateRaw = props.vehicleRecords.length ? props.vehicleRecords[0].measureDate : null;
//   if (measureDateRaw) {
//     const measureDate_temp = formatDate_ddmmyyy(new Date(measureDateRaw));
//     setMeasureDate(measureDate_temp);
//   } else {
//     setMeasureDate('N/A');
//   }
// }, [props.vehicleRecords]);

// let priceDistribution = this.props.vehicleRecords.length ? <Histogram data={this.props.vehicleRecords} /> : null;

// let kmDistribution = null;
// let kmDistribution = this.props.vehicleRecords.length ? (
//   <KmDistribution
//     data={this.props.vehicleRecords}
//     fontColor={'#E1E8ED'}
//     barColor={'#2B95D6'}
//     lineColor={'#EB532D'}
//     nbins={Math.max(maxNumberOfBins, Math.sqrt(2 * nbVehicles))}
//   />
// ) : null;

// let priceKmScatter = this.props.vehicleRecords.length ? (
//   <PriceKmScatter
//     data={this.props.vehicleRecords}
//     fontColor={'#E1E8ED'}
//     markerColor={'#2B95D6'}
//     lineColor={'#EB532D'}
//     nbins={Math.max(maxNumberOfBins, Math.sqrt(2 * nbVehicles))}
//   />
// ) : null;

  (
    <div className="chartsView">
      {props.vehicleRecords.length ? (
        <div>
          <MedianPriceEvolution
            data={props.vehicleStatistics}
            fontColor="#E1E8ED"
            lineColor="#FF6E4A"
            lineColor2="#FF6E4A"
            barColor="#2B95D6"
          />
          {/* <PriceDistribution
            data={props.vehicleLatestRecords}
            fontColor="#E1E8ED"
            barColor="#2B95D6"
            lineColor="#EB532D"
            nbins={Math.max(maxNumberOfBins, Math.floor(Math.sqrt(2 * props.vehicleRecords.length)))}
          /> */}
          {/* {kmDistribution}
          {priceKmScatter} */}
        </div>
      ) : null}
    </div>
  );
ChartsView.propTypes = {
  vehicleRecords: PropTypes.arrayOf(PropTypes.object).isRequired,
  vehicleStatistics: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateTpProps = (store) => ({
  vehicleRecords: store.vehiclesState.selectedVehicleRecords,
  vehicleStatistics: store.vehiclesState.selectedVehicleStatistics,
});

export default connect(mapStateTpProps)(ChartsView);
