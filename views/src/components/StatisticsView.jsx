import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatisticsBox from './StatisticsBox';
import { numberWithCommas } from '../lib/mathUtil';

class StatisticsView extends Component {
	render() {

		let priceRange = numberWithCommas(this.props.vehiclesStatistics.priceP10) + ' € - ' + numberWithCommas(this.props.vehiclesStatistics.priceP90) + ' €';

		return (
			<div className='statisticsContainer'>
				<StatisticsBox
					number={numberWithCommas(this.props.vehiclesStatistics.nbVehicles)}
					icon={"drive-time"}
					caption={"Vehicles"}
				/>
				<StatisticsBox
					number={numberWithCommas(this.props.vehiclesStatistics.medianPrice) + ' €'}
					icon={"bank-account"}
					caption={"Median Price"}
				/>
				<StatisticsBox
					number={priceRange}
					icon={"arrows-horizontal"}
					caption={"Price Range\n(P10 - P90)"}
				/>
				<StatisticsBox
					number={numberWithCommas(Math.round(10000*this.props.vehiclesStatistics.slope1)) + ' €/10,000 km'}
					icon={"trending-down"}
					caption={"Depreciation (0 - 10,000 km)"}
				/>
				<StatisticsBox
					number={numberWithCommas(Math.round(10000*this.props.vehiclesStatistics.slope2)) + ' €/10,000 km'}
					icon={"trending-down"}
					caption={"Depreciation (10,000+ km)"}
				/>
			</div>
		);
	}
}

const mapStateToProps =  (store) => {
	return {
		vehiclesStatistics: store.vehiclesStatisticsState
	}
}

export default connect(mapStateToProps)(StatisticsView);