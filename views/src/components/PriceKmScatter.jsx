import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { getBinData, groupBy } from '../lib/mathUtil';

export default class PriceKmScatter extends Component {
	render() {

		let kmBinsData = getBinData(this.props.data.map(el => el.km || 0), this.props.nbins).data;
		let kmBinsCounts = groupBy(kmBinsData, 'binFrom', 'count');
		let barChartData = [];
		for(let key in kmBinsCounts) {
			barChartData.push({ binFrom: key, count: kmBinsCounts[key]});
		}
		
		// add price to kmBinsCount
		let kmBinsPriceData = [];
		for(let dataPoint of this.props.data) {
			for(let key in kmBinsCounts) {
				if(dataPoint.km <= key) {
					kmBinsPriceData.push({ binFrom: key, price: dataPoint.price});
					break;
				}
			}
		}
		let kmBinsPriceMedians = groupBy(kmBinsPriceData, 'binFrom', 'median', 'price');
		let lineChartData = [];
		for(let key in kmBinsPriceMedians) {
			lineChartData.push({ binFrom: parseInt(key), median: kmBinsPriceMedians[key]});
		}
		let binSize = lineChartData[1].binFrom - lineChartData[0].binFrom;
		console.log(lineChartData);
		

		let fontColor = this.props.fontColor;
		let lineColor = this.props.lineColor;
		let markerColor = this.props.markerColor;

		let min = math.min(this.props.data.map(el => el.km || 0));
		let max = math.max(this.props.data.map(el => el.km || 0));

		return (
			<Plot
				data = {[
					{
						x: this.props.data.map(el => el.km || 0),
						y: this.props.data.map(el => el.price),
						type: 'scatter',
						mode: 'markers',
						marker:{
							color: markerColor,
							opacity: 1,
							size: 3
						},
					},
					{
						x: lineChartData.map(el => el.binFrom + binSize/2),
						y: lineChartData.map(el => el.median),
						type: 'scatter',
						mode: 'lines',
						marker: {

							color: lineColor
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
						// rangemode: 'nonnegative',
						range: [min - (max-min)*0.01, max*1.01],
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