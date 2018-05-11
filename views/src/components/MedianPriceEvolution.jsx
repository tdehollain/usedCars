import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { numberWithCommas } from '../lib/mathUtil';

export default class MedianPriceEvolution extends Component {
	render() {

		// order data by ascending date
		let vehicleData = this.props.data.sort((a,b) => {
			return new Date(a.measureDate) - new Date(b.measureDate);
		});
		let measureDates = vehicleData.map(el => el.measureDate);
		// get the distinct dates
		let dates = [];
		for(let currentDate of measureDates) {
			let month = (new Date(currentDate)).getMonth();
			let year = (new Date(currentDate)).getFullYear();
			let alreadyPresent = false;
			for(let presentDate of dates) {
				if(presentDate.month === month && presentDate.year === year) {
					alreadyPresent = true;
					break;
				}
			}
			if(!alreadyPresent) dates.push({ month, year });
		}
		
		// build up chart arrays
		let medianPrices = [];
		let medianPricesText = [];
		let P10prices = [];
		let P90prices = [];
		let months = [];

		for(let currentMonth of dates) {
			let vehicleDataFiltered = vehicleData.filter(el => {
				return (new Date(el.measureDate)).getMonth() === currentMonth.month && (new Date(el.measureDate)).getFullYear() === currentMonth.year;
			});
			let nbVehicles = vehicleDataFiltered.length;
			medianPrices.push(math.median(vehicleDataFiltered.map(el => el.price)));
			medianPricesText.push(numberWithCommas(math.median(vehicleDataFiltered.map(el => el.price))));
			P10prices.push(vehicleDataFiltered[Math.floor(0.1*nbVehicles)].price);
			P90prices.push(vehicleDataFiltered[Math.floor(0.9*nbVehicles)].price);
			months.push(('0'+(currentMonth.month+1)).slice(-2) + '/' + currentMonth.year);
		}

		console.log(medianPrices);
		console.log(P10prices);
		console.log(P90prices);

		let fontColor = this.props.fontColor;
		let lineColor = this.props.lineColor;
		let lineColor2 = this.props.lineColor2;

		return (
			<div>
				<Plot
					data={[
						{
							x: months,
							y: medianPrices,
							text: medianPricesText,
							textposition: 'top',
							textfont: {
								color: fontColor
							},
							mode: 'lines+markers+text',
							line: {
								color: lineColor,
								dash: 'solid',
								width: 2
							}
						},
						{
							x: months,
							y: P10prices,
							mode: 'lines',
							line: {
								color: lineColor2,
								dash: 'dot',
								width: 1
							}
						},
						{
							x: months,
							y: P90prices,
							mode: 'lines',
							line: {
								color: lineColor2,
								dash: 'dot',
								width: 1
							}						
						}
					]}
					layout = {{
						title: 'Price Evolution',
						titlefont: {
							color: fontColor
						},
						width: 1200,
						height: 400,
						margin: { pad: 5 },
						paper_bgcolor: 'rgba(0,0,0,0)',
						plot_bgcolor: 'rgba(0,0,0,0)',
						xaxis: {
							title: 'Date',
							color: fontColor,
							showgrid: false,
							// rangemode: 'tozero',
							// range: [-1*(max-min)*0.01, max*1.01],
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
			</div>
		);
	}
}