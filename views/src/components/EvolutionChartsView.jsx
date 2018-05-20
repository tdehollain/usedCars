import React, { Component } from 'react';
import MedianPriceEvolution from './MedianPriceEvolution';

export default class EvolutionChartsView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selectedVehicle === this.props.selectedVehicle &&
      nextProps.vehicleData.length === this.props.vehicleData.length
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let medianPriceEvolution = this.props.vehicleData.length ? (
      <MedianPriceEvolution
        data={this.props.vehicleData}
        fontColor={'#E1E8ED'}
        lineColor={'#FF6E4A'}
        lineColor2={'#FF6E4A'}
        barColor={'#2B95D6'}
      />
    ) : null;

    return <div className="evolutionChartsView">{medianPriceEvolution}</div>;
  }
}
