import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';
import ChartsView from './ChartsView';

class ChartsViewContainer extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		if(
			nextProps.selectedVehicle === this.props.selectedVehicle &&
			nextProps.vehiclesData.length === this.props.vehiclesData.length
		) {
			return false;
		} else {
			// console.log(`selectedVehicle: ${this.props.selectedVehicle} >> ${nextProps.selectedVehicle}`);
			// console.log(`vehiclesData.length: ${this.props.vehiclesData.length} >> ${nextProps.vehiclesData.length}`);
			return true;
		}
	}

	componentDidMount() {
		this.props.selectedVehicle && this.updateVehicleData(this.props.selectedVehicle);
	}

	componentDidUpdate() {
		this.props.selectedVehicle && this.updateVehicleData(this.props.selectedVehicle);
	}

	render() {
		console.log('Rendering ChartsViewContainer');
		return (
			<ChartsView 
				selectedVehicle={this.props.selectedVehicle}
				vehiclesData={this.props.vehiclesData}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { 
		vehiclesData: store.vehiclesDataState.vehiclesData
	 };
}

export default connect(mapStateToProps)(ChartsViewContainer);