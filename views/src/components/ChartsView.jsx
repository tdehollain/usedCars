import React, { Component } from 'react';
// import Histogram from './Histogram';
import PriceDistribution from './PriceDistribution';
import KmDistribution from './KmDistribution';
import PriceKmScatter from './PriceKmScatter';

export default class ChartsView extends Component {

	render() {
		
		// let histo = this.props.vehiclesData.length ? <Histogram	data = {this.props.vehiclesData} />	: null;

		let priceDistribution = this.props.vehiclesData.length 
			? <PriceDistribution 
					data = {this.props.vehiclesData}
					fontColor = {'#E1E8ED'}
					barColor = {'#2B95D6'}
					lineColor = {'#EB532D'}
					nbins = {15}
				/> 
			: null;

		let kmDistribution = this.props.vehiclesData.length
			? <KmDistribution 
					data = {this.props.vehiclesData}
					fontColor = {'#E1E8ED'}
					barColor = {'#2B95D6'}
					lineColor = {'#EB532D'}
					nbins = {7}
				/>
			: null;

		let priceKmScatter = this.props.vehiclesData.length
			? <PriceKmScatter
					data = {this.props.vehiclesData}
					fontColor = {'#E1E8ED'}
					markerColor = {'#2B95D6'}
					lineColor = {'#EB532D'}
					nbins = {15}
				/>
			: null;

		return (
			<div className='chartsView'>
				<form>
					<label className='pt-label'>
						Vehicle
						<div className='pt-select'>
							<select className='pt-select' value={this.props.selectedVehicle} onChange={this.props.changeSelectedVehicle}>
								<option></option>
								{this.props.vehicleList.map(el => <option key={el._id}>{el.title}</option>)}
							</select>
						</div>
					</label>
				</form>
				<a href={this.props.selectedVehicleURL} target ='_blank'>Link</a>
				<div>
					{priceDistribution}
					{kmDistribution}
					{priceKmScatter}
				</div>
			</div>
		)
	}
}