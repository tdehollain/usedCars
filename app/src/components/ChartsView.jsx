import React from 'react';
// import PriceDistribution from './PriceDistribution';
// import Histogram from './Histogram';
// import KmDistribution from './KmDistribution';
import PriceKmScatter from './PriceKmScatter';
import { maxNumberOfBins } from '../lib/constants';
import { formatDate_ddmmyyy } from '../lib/util';

const ChartsView = props => {
  const [measureDate, setMeasureDate] = React.useState('');

  // When vehiclesRecords changes, define the measureDate string
  React.useEffect(() => {
    const measureDateRaw = props.vehiclesRecords.length ? props.vehiclesRecords[0].measureDate : null;
    if (measureDateRaw) {
      const measureDate_temp = formatDate_ddmmyyy(new Date(measureDateRaw));
      setMeasureDate(measureDate_temp);
    } else {
      setMeasureDate('N/A');
    }
  }, [props.vehiclesRecords]);
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     nextProps.selectedVehicle === this.props.selectedVehicle &&
  //     nextProps.vehiclesRecords.length === this.props.vehiclesRecords.length
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // let priceDistribution = this.props.vehiclesRecords.length ? <Histogram data={this.props.vehiclesRecords} /> : null;

  // let priceDistribution = this.props.vehiclesRecords.length ? (
  //   <PriceDistribution
  //     data={this.props.vehiclesRecords}
  //     fontColor={'#E1E8ED'}
  //     barColor={'#2B95D6'}
  //     lineColor={'#EB532D'}
  //     nbins={Math.max(maxNumberOfBins, Math.sqrt(2 * nbVehicles))}
  //   />
  // ) : null;

  // let kmDistribution = null;
  // let kmDistribution = this.props.vehiclesRecords.length ? (
  //   <KmDistribution
  //     data={this.props.vehiclesRecords}
  //     fontColor={'#E1E8ED'}
  //     barColor={'#2B95D6'}
  //     lineColor={'#EB532D'}
  //     nbins={Math.max(maxNumberOfBins, Math.sqrt(2 * nbVehicles))}
  //   />
  // ) : null;

  // let priceKmScatter = this.props.vehiclesRecords.length ? (
  //   <PriceKmScatter
  //     data={this.props.vehiclesRecords}
  //     fontColor={'#E1E8ED'}
  //     markerColor={'#2B95D6'}
  //     lineColor={'#EB532D'}
  //     nbins={Math.max(maxNumberOfBins, Math.sqrt(2 * nbVehicles))}
  //   />
  // ) : null;

  return (
    <div className="chartsView">
      <a className="vehicleLink" href={props.selectedVehicleURL} target="_blank">
        Link
      </a>
      <p className="measureDate">Last Update: {measureDate}</p>
      <div>{/* {priceDistribution}
          {kmDistribution}
          {priceKmScatter} */}</div>
    </div>
  );
};

export default ChartsView;
