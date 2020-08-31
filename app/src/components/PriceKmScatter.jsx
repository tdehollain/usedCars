import React, { Component } from 'react';
import { store } from '../store';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { linearRegression } from '../lib/mathUtil';

export default class PriceKmScatter extends Component {

	render() {

		// order data by ascending km
		let vehicleData = this.props.data.sort((a,b) => {
			return a.km - b.km;
		});
		let km = vehicleData.map(el => el.km || 0);
		let price = vehicleData.map(el => el.price);
		// separte km and price between <10,000 km and >10,000 km
		let km1 = [];
		let km2 = [];
		let price1 = [];
		let price2 = [];
		for(let i=0; i<km.length; i++) {
			if(km[i] <= 10000) {
				km1.push(km[i]);
				price1.push(price[i]);
			} else {
				km2.push(km[i]);
				price2.push(price[i]);
			}
		}

		let predictedPrice = [];
		let slope1, slope2;

		if(km1.length <= 2 && km2.length <= 2) {
			predictedPrice = [];
		}	else if(km1.length <= 2) {
			predictedPrice = linearRegression(km2, price2);
			slope2 = (predictedPrice[predictedPrice.length-1] - predictedPrice[0]) / (km2[km2.length-1] - km2[0]);
		} else if(km2.length <= 2) {
			predictedPrice = linearRegression(km1, price1);
			slope1 = (predictedPrice[predictedPrice.length-1] - predictedPrice[0]) / (km1[km1.length-1] - km1[0]);
		} else {
			let predictedPrice1 = linearRegression(km1, price1);
			let predictedPrice2 = linearRegression(km2, price2);
			predictedPrice = [...predictedPrice1, ...predictedPrice2];
			slope1 = (predictedPrice1[predictedPrice1.length-1] - predictedPrice1[0]) / (km1[km1.length-1] - km1[0]);
			slope2 = (predictedPrice2[predictedPrice2.length-1] - predictedPrice2[0]) / (km2[km2.length-1] - km2[0]);
		}

		store.dispatch({
			type: 'UPDATE_REGRESSION_SLOPES',
			data: { slope1, slope2 }
		});
		

		let fontColor = this.props.fontColor;
		let lineColor = this.props.lineColor;
		let markerColor = this.props.markerColor;

		let min = math.min(km);
		let max = math.max(km);

		return (
			<Plot
				data = {[
					{
						x: km,
						y: price,
						type: 'scatter',
						mode: 'markers',
						marker:{
							color: markerColor,
							opacity: 1,
							size: 3
						},
					},
					{
						x: km,
						y: predictedPrice,
						type: 'scatter',
						mode: 'lines',
						line: {
							color: lineColor,
							width: 1
						}
					}
				]}
				layout = {{
					title: 'Price - mileage scatter',
					titlefont: {
						color: fontColor
					},
					width: 1200,
					height: 400,
					margin: { pad: 5 },
					paper_bgcolor: 'rgba(0,0,0,0)',
					plot_bgcolor: 'rgba(0,0,0,0)',
					xaxis: {
						title: 'Mileage (km)',
						color: fontColor,
						showgrid: false,
						// rangemode: 'tozero',
						range: [-1*(max-min)*0.01, max*1.01],
						zeroline: false,
						hoverformat: ',.1'
					},
					yaxis: {
						title: 'Price (€)',
						color: fontColor,
						gridcolor: '#394B59',
						rangemode: 'tozero',
						hoverformat: ',.1'
					},
					showlegend: false,
					hovermode: 'closest'
				}}
				config = {{
					displayModeBar: false
				}}
			/>
		)
	}
}