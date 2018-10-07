import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { getBinData, groupBy } from '../lib/mathUtil';

export default class KmDistribution extends Component {
  render() {
    let kmBinsData = getBinData(
      this.props.data.map(el => el.km || 0),
      this.props.nbins
    ).data;
    let kmBinsCounts = groupBy(kmBinsData, 'binFrom', 'count');
    let barChartData = [];
    for (let key in kmBinsCounts) {
      barChartData.push({ binFrom: key, count: kmBinsCounts[key] });
    }

    // add price to kmBinsCount
    let kmBinsPriceData = [];
    for (let dataPoint of this.props.data) {
      for (let key in kmBinsCounts) {
        if (dataPoint.km <= key) {
          kmBinsPriceData.push({ binFrom: key, price: dataPoint.price });
          break;
        }
      }
    }
    let kmBinsPriceMedians = groupBy(
      kmBinsPriceData,
      'binFrom',
      'median',
      'price'
    );

    let lineChartData = [];
    for (let key in kmBinsPriceMedians) {
      lineChartData.push({ binFrom: key, median: kmBinsPriceMedians[key] });
    }
    let minLineChart = lineChartData.length
      ? math.min(lineChartData.map(el => el.binFrom))
      : math.min(this.props.data.map(el => el.price));
    let maxLineChart = lineChartData.length
      ? math.max(lineChartData.map(el => el.binFrom))
      : math.max(this.props.data.map(el => el.price));

    let fontColor = this.props.fontColor;
    let barColor = this.props.barColor;
    let lineColor = this.props.lineColor;

    return (
      <Plot
        data={[
          {
            type: 'bar',
            x: barChartData.map(el => el.binFrom),
            y: barChartData.map(el => el.count),
            marker: {
              color: barColor
            },
            hoverinfo: 'y',
            hoverlabel: {
              bgcolor: '#293742'
            },
            name: 'count'
          },
          {
            type: 'scatter',
            mode: 'lines+markers',
            x: barChartData.map(el => el.binFrom),
            y: lineChartData.map(el => el.median),
            marker: {
              color: lineColor
            },
            // hoverinfo: 'skip',
            // hoverlabel: {
            // 	bgcolor: '#293742'
            // },
            yaxis: 'y2',
            name: 'price'
          }
        ]}
        layout={{
          title: 'Mileage distribution',
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
            rangemode: 'tozero',
            zeroline: false,
            range: [
              -1 * (maxLineChart - minLineChart) * 0.07,
              maxLineChart * 1.07
            ]
          },
          yaxis: {
            title: 'count',
            color: fontColor,
            gridcolor: '#394B59'
          },
          yaxis2: {
            title: 'price (€)',
            color: fontColor,
            rangemode: 'tozero',
            showgrid: false,
            side: 'right',
            gridcolor: '#394B59'
          },
          showlegend: false,
          hovermode: 'closest'
        }}
        config={{
          displayModeBar: false
        }}
      />
    );
  }
}
