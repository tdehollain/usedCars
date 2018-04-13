import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { getBinData, groupBy, linearRegression } from '../lib/mathUtil';

export default class PriceKmScatter extends Component {
	constructor() {
		super();
		this.state = {
			km: [0],
			price: [0],
			predictedPrice: []
		}
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log((nextProps.data[0].title !== this.props.data[0].title) || this.state.predictedPrice.length === 0);
	// 	// return nextProps.data[0].title === this.props.data[0].title;
	// 	return true;
	// }

	componentDidMount() {
		// order data by ascending km
		let vehicleData = this.props.data.sort((a,b) => {
			return a.km - b.km;
		});

		let km = vehicleData.map(el => el.km || 0);
		let price = vehicleData.map(el => el.price);
		this.setState({ km, price	}, () => {
			this.updateRegression(km, price);
		});
		
	}

	// componentDidUpdate() {
	// 	console.log(this.props.data[0].title);
	// 	// this.updateRegression();
	// }

	async updateRegression(km, price) {
		let predictedPrice = await linearRegression(km, price);
		// console.log(predict);
		// this.setState({ predictedPrice: predict });
		this.setState({	predictedPrice });
	}

	render() {

		let fontColor = this.props.fontColor;
		let lineColor = this.props.lineColor;
		let markerColor = this.props.markerColor;

		let min = math.min(this.state.km);
		let max = math.max(this.state.km);

		return (
			<Plot
				data = {[
					{
						x: this.state.km,
						y: this.state.price,
						type: 'scatter',
						mode: 'markers',
						marker:{
							color: markerColor,
							opacity: 1,
							size: 3
						},
					},
					// {
					// 	x: this.state.lineChartData.map(el => el.binFrom + this.state.binSize/2),
					// 	y: this.state.lineChartData.map(el => el.median),
					// 	type: 'scatter',
					// 	mode: 'lines',
					// 	marker: {
					// 		color: lineColor
					// 	}
					// },
					{
						x: this.state.km,
						y: this.state.predictedPrice,
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