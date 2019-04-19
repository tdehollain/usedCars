import React, { Component } from 'react';
import { getBinData, groupBy } from '../lib/mathUtil';
import math from 'mathjs';
import Plot from 'react-plotly.js';

export default class PriceDistribution extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.data.length === this.props.data.length) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		// console.log('Rendering PriceDistribution');
		
		let priceBinData = getBinData(this.props.data.map(el => el.price), this.props.nbins).data;
		let priceBinsCounts = groupBy(priceBinData, 'binFrom', 'count');
		let barChartData = [];
		for(let key in priceBinsCounts) {
			barChartData.push({ binFrom: key, count: priceBinsCounts[key]})
		}
		// console.log(priceBinsCounts);

		// let hoverTexts = [];
		// for(let i=0; i<barChartData.length-1; i++) {
		// 	hoverTexts.push(`${barChartData[i].binFrom/1000}k - ${barChartData[i+1].binFrom/1000}k`)
		// }
		// hoverTexts.push(`${barChartData[barChartData.length - 1].binFrom/1000}k - ${(barChartData[barChartData.length - 1].binFrom/1000 + (barChartData[barChartData.length - 1].binFrom/1000 - barChartData[barChartData.length - 2].binFrom/1000))}k`);
		

		let fontColor = this.props.fontColor;
		let barColor = this.props.barColor;
		let lineColor = this.props.lineColor;

		return (
			<Plot
				data = {[
					{
						type: 'bar',
						x: barChartData.map(el => el.binFrom),
						y: barChartData.map(el => el.count),
						// text: barChartData.map(el => el.count),
						// textposition: 'outside',
						// outsidetextfont: {
						// 	color: fontColor
						// },
						// hovertext: hoverTexts,
						marker: { 
							color: barColor
						},
						hoverinfo: 'y+text',
						hoverlabel: {
							bgcolor: '#293742'
						},
					}
				]}	
				layout = {{
					title: 'Price distribution',
					titlefont: {
						color: fontColor
					},
					width: 1200,
					height: 400,
					margin: { pad: 5 },
					paper_bgcolor: 'rgba(0,0,0,0)',
					plot_bgcolor: 'rgba(0,0,0,0)',
					xaxis: {
						title: 'Price (€)',
						color: fontColor,
						rangemode: 'tozero',
						zeroline: false,
					},
					yaxis: {
						color: fontColor,
						gridcolor: '#394B59'
					},
					shapes: [{
						type: 'line',
						x0: math.median(this.props.data.map(el => el.price)),
						x1: math.median(this.props.data.map(el => el.price)),
						y0: 0,
						y1: math.max(barChartData.map(el => el.count)),
						line: {
							color: lineColor,
							width: 2
						}
					}]
				}}
				config = {{
					displayModeBar: false
				}}
			/>
		)
	}
}