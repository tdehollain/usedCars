/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'plotly.js-cartesian-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { numberWithCommas } from '../lib/mathUtil';

const Plot = createPlotlyComponent(Plotly);

const MedianPriceEvolution = (props) => {
  const { fontColor, lineColor, lineColor2, barColor, chartWidth } = props;

  const months = props.data.map((currentYearMonthData) => `${currentYearMonthData.yearmonth.toString().slice(-2)}-${currentYearMonthData.yearmonth.toString().slice(0, 4)}`);
  const nbVehiclesArray = props.data.map((currentYearMonthData) => currentYearMonthData.statistics.nbVehicles);
  const medianPrices = props.data.map((currentYearMonthData) => currentYearMonthData.statistics.medianPrice);
  const medianPricesText = props.data.map((currentYearMonthData) => numberWithCommas(currentYearMonthData.statistics.medianPrice));
  const P10prices = props.data.map((currentYearMonthData) => currentYearMonthData.statistics.priceP10);
  const P90prices = props.data.map((currentYearMonthData) => currentYearMonthData.statistics.priceP90);

  // console.log(months);
  // console.log(P10prices);
  // console.log(medianPrices);
  // console.log(P90prices);

  return (
    <div>
      <Plot
        data={[
          {
            x: months,
            y: nbVehiclesArray,
            type: 'bar',
            marker: {
              color: barColor,
            },
            hoverinfo: 'y+text',
            hoverlabel: {
              bgcolor: '#293742',
            },
            name: 'count',
          },
          {
            x: months,
            y: medianPrices,
            text: medianPricesText,
            textposition: 'top',
            textfont: {
              color: fontColor,
            },
            mode: 'lines+markers+text',
            line: {
              color: lineColor,
              dash: 'solid',
              width: 2,
            },
            yaxis: 'y2',
          },
          {
            x: months,
            y: P10prices,
            mode: 'lines',
            line: {
              color: lineColor2,
              dash: 'dot',
              width: 1,
            },
            yaxis: 'y2',
          },
          {
            x: months,
            y: P90prices,
            mode: 'lines',
            line: {
              color: lineColor2,
              dash: 'dot',
              width: 1,
            },
            yaxis: 'y2',
          },
        ]}
        layout={{
          title: 'Price Evolution',
          titlefont: {
            color: fontColor,
          },
          width: chartWidth,
          height: 400,
          margin: { pad: 5 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            // title: 'Date',
            color: fontColor,
            showgrid: false,
            // rangemode: 'tozero',
            // range: [-1*(max-min)*0.01, max*1.01],
            zeroline: false,
            hoverformat: ',.1',
          },
          yaxis: {
            title: 'count',
            color: fontColor,
            gridcolor: '#394B59',
            rangemode: 'tozero',
            hoverformat: ',.1',
          },
          yaxis2: {
            title: 'Price (€)',
            color: fontColor,
            gridcolor: '#394B59',
            rangemode: 'tozero',
            showgrid: false,
            side: 'right',
          },
          showlegend: false,
          hovermode: 'closest',
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

MedianPriceEvolution.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fontColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  lineColor2: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

export default MedianPriceEvolution;
