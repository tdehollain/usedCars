import React, { Component } from 'react';
import math from 'mathjs';
import Plot from 'react-plotly.js';

export default class Histogram extends Component {
	render() {

		return (
			<div>
				<Plot
					data = {[
						{
							x: this.props.data.map(el => el.price),
							// y: this.props.data.map(el => el.km),
							type: 'histogram',
							marker: { 
								color: '#9E2B0E' }
						}
					]}
					layout = {{
						width: 600,
						height: 400,
						paper_bgcolor: 'rgba(0,0,0,0)',
						plot_bgcolor: 'rgba(0,0,0,0)',
						xaxis: {
							title: 'Price [€]',
							color: '#E1E8ED'
						},
						yaxis: {
							color: '#E1E8ED',
							// linecolor: '#394B59'
						},
						bargap: 0.05
					}}
				/>
				<p>Min price: {math.min(this.props.data.map(el => el.price)).toLocaleString('en')} €</p>
				<p>Mean price: {math.round(math.mean(this.props.data.map(el => el.price))).toLocaleString('en')} €</p>
				<p>Median price: {math.median(this.props.data.map(el => el.price)).toLocaleString('en')} €</p>
				<p>Max price: {math.max(this.props.data.map(el => el.price)).toLocaleString('en')} €</p>
			</div>
		)
	}
}