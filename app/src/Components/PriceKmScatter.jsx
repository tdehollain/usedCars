import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { regressionsKmSplit } from '../lib/constants';
// import { linearRegression } from '../lib/statistics';

const PriceKmScatter = (props) => {
  const { data, vehicleRegressions, fontColor, lineColor, markerColor, chartWidth } = props;

  const prices = data.map((el) => el.price);
  const kms = data.map((el) => el.km);

  // Regression lines
  const lowMileageIntercept = vehicleRegressions.lowMileage.intercept;
  const lowMileageSlope = vehicleRegressions.lowMileage.slope;
  const highMileageIntercept = vehicleRegressions.highMileage.intercept;
  const highMileageSlope = vehicleRegressions.highMileage.slope;
  const lowKms = [0, ...kms.filter((el) => el <= regressionsKmSplit), regressionsKmSplit]; // adding at end so the line goes from 0 to the split
  const highKms = [regressionsKmSplit, ...kms.filter((el) => el > regressionsKmSplit)];

  const predictedPricesLowMileage = lowKms.map((km) => lowMileageIntercept + lowMileageSlope * km);
  const predictedPricesHighMileage = highKms.map((km) => highMileageIntercept + highMileageSlope * km);

  return (
    <Plot
      data={[
        {
          x: kms,
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
        {
          x: lowKms,
          y: predictedPricesLowMileage,
          type: 'scatter',
          mode: 'lines',
          line: {
            color: lineColor,
            width: 1,
          },
        },
        {
          x: highKms,
          y: predictedPricesHighMileage,
          type: 'scatter',
          mode: 'lines',
          line: {
            color: lineColor,
            width: 1,
          },
        },
      ]}
      layout={{
        title: 'Price - mileage scatter',
        titlefont: {
          color: fontColor,
        },
        width: chartWidth,
        height: 400,
        margin: { pad: 5 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
          title: 'Mileage (km)',
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

PriceKmScatter.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  vehicleRegressions: PropTypes.shape({
    lowMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
    highMileage: PropTypes.shape({ intercept: PropTypes.number, slope: PropTypes.number }),
  }).isRequired,
  fontColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  markerColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

export default PriceKmScatter;
