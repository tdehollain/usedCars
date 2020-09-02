import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import math from 'mathjs';
import { getBinData, groupBy } from '../lib/mathUtil';

const KmDistribution = (props) => {
  const kmBinsData = getBinData(this.props.data.map((el) => el.km || 0), this.props.nbins).data;
  const kmBinsCounts = groupBy(kmBinsData, 'binFrom', 'count');
  const barChartData = [];
  for (const key in kmBinsCounts) {
    barChartData.push({ binFrom: key, count: kmBinsCounts[key] });
  }

  // add price to kmBinsCount
  const kmBinsPriceData = [];
  for (const dataPoint of this.props.data) {
    for (const key in kmBinsCounts) {
      if (dataPoint.km <= key) {
        kmBinsPriceData.push({ binFrom: key, price: dataPoint.price });
        break;
      }
    }
  }
  const kmBinsPriceMedians = groupBy(kmBinsPriceData, 'binFrom', 'median', 'price');

  const lineChartData = [];
  for (const key in kmBinsPriceMedians) {
    lineChartData.push({ binFrom: key, median: kmBinsPriceMedians[key] });
  }
  const minLineChart = lineChartData.length ? math.min(lineChartData.map((el) => el.binFrom)) : math.min(this.props.data.map((el) => el.price));
  const maxLineChart = lineChartData.length ? math.max(lineChartData.map((el) => el.binFrom)) : math.max(this.props.data.map((el) => el.price));

  const { fontColor } = this.props;
  const { barColor } = this.props;
  const { lineColor } = this.props;

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: barChartData.map((el) => el.binFrom),
          y: barChartData.map((el) => el.count),
          marker: {
            color: barColor,
          },
          hoverinfo: 'y',
          hoverlabel: {
            bgcolor: '#293742',
          },
          name: 'count',
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          x: barChartData.map((el) => el.binFrom),
          y: lineChartData.map((el) => el.median),
          marker: {
            color: lineColor,
          },
          // hoverinfo: 'skip',
          // hoverlabel: {
          // 	bgcolor: '#293742'
          // },
          yaxis: 'y2',
          name: 'price',
        },
      ]}
      layout={{
        title: 'Mileage distribution',
        titlefont: {
          color: fontColor,
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
          range: [-1 * (maxLineChart - minLineChart) * 0.07, maxLineChart * 1.07],
        },
        yaxis: {
          title: 'count',
          color: fontColor,
          gridcolor: '#394B59',
        },
        yaxis2: {
          title: 'price (€)',
          color: fontColor,
          rangemode: 'tozero',
          showgrid: false,
          side: 'right',
          gridcolor: '#394B59',
        },
        showlegend: false,
        hovermode: 'closest',
      }}
      config={{
        displayModeBar: false,
      }}
    />
  );
};

export default KmDistribution;
