import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'plotly.js-cartesian-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { regressionsKmSplit } from '../lib/constants';
// import { linearRegression } from '../lib/statistics';

const Plot = createPlotlyComponent(Plotly);

const PriceScatter = (props) => {
  const { chartTitle, data, metric, xAxisTtile, vehicleRegressions, fontColor, lineColor, markerColor, chartWidth } = props;

  const prices = data.map((el) => el.price);
  const Xdata = data.map((el) => el[metric]);

  const regressionSplit = metric === 'km' ? regressionsKmSplit : 1e9;

  // Regression lines
  let lowXs; let highXs; let predictedPricesLowXs; let predictedPricesHighXs;
  if (metric === 'km') {
    const lowMileageIntercept = vehicleRegressions.lowMileage.intercept;
    const lowMileageSlope = vehicleRegressions.lowMileage.slope;
    const highMileageIntercept = vehicleRegressions.highMileage.intercept;
    const highMileageSlope = vehicleRegressions.highMileage.slope;
    lowXs = [0, ...Xdata.filter((el) => el <= regressionSplit), regressionSplit]; // adding at end so the line goes from 0 to the split
    highXs = [regressionSplit, ...Xdata.filter((el) => el > regressionSplit)];

    predictedPricesLowXs = lowXs.map((km) => lowMileageIntercept + lowMileageSlope * km);
    predictedPricesHighXs = highXs.map((km) => highMileageIntercept + highMileageSlope * km);
  }

  let plotData = [
    {
      x: Xdata,
      y: prices,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: markerColor,
        opacity: 0.8,
        size: 10,
        // line: {
        //   width: 1,
        //   color: 'white',
        // },
      },
    },
  ];

  if (vehicleRegressions) {
    plotData = [...plotData, ...[{
      x: lowXs,
      y: predictedPricesLowXs,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: lineColor,
        width: 1,
      },
    },
    {
      x: highXs,
      y: predictedPricesHighXs,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: lineColor,
        width: 1,
      },
    },
    ]];
  }

  return (
    <Plot
      data={plotData}
      layout={{
        title: chartTitle,
        titlefont: {
          color: fontColor,
        },
        width: chartWidth,
        height: 400,
        margin: { pad: 5 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
          title: xAxisTtile,
          color: fontColor,
          showgrid: false,
          rangemode: 'tozero',
          zeroline: false,
          hoverformat: ',.1',
        },
        yaxis: {
          title: 'Price (€)',
          color: fontColor,
          gridcolor: '#394B59',
          rangemode: 'tozero',
          hoverformat: ',.1',
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

PriceScatter.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  metric: PropTypes.string.isRequired,
  xAxisTtile: PropTypes.string.isRequired,
  vehicleRegressions: PropTypes.shape({
    lowMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
    highMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
  }),
  fontColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  markerColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

PriceScatter.defaultProps = {
  vehicleRegressions: null,
};

export default PriceScatter;
