import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import SimpleLinearRegression from 'ml-regression-simple-linear';
// import { linearRegression } from '../lib/statistics';

const PriceKmScatter = (props) => {
  const { fontColor, lineColor, markerColor, chartWidth } = props;

  const prices = props.data.map((el) => el.price);
  const kms = props.data.map((el) => (el.km || 0));

  const regression = new SimpleLinearRegression(kms, prices);
  const predictedPrices = kms.map((km) => regression.predict(km));

  return (
    <Plot
      data={[
        {
          x: kms,
          y: props.data.map((el) => el.price),
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
          x: kms,
          y: predictedPrices,
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
  fontColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  markerColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

export default PriceKmScatter;
