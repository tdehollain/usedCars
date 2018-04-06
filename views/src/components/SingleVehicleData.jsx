import React, { Component } from 'react';
import math from 'mathjs';
// import { avg, median } from '

export default class SingleVehicleData extends Component {
	render() {
		return (
			<div>
				{/* <p>{this.props.vehicleData[0].title}</p> */}
				<p>Min price: {math.min(this.props.vehicleData.map(el => el.price)).toLocaleString('en')} €</p>
				<p>Mean price: {math.round(math.mean(this.props.vehicleData.map(el => el.price))).toLocaleString('en')} €</p>
				<p>Median price: {math.median(this.props.vehicleData.map(el => el.price)).toLocaleString('en')} €</p>
				<p>Max price: {math.max(this.props.vehicleData.map(el => el.price)).toLocaleString('en')} €</p>
			</div>
		)
	}
}