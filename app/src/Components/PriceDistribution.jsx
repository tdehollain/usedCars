import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const PriceDistribution = (props) => {
  const { fontColor, barColor, chartWidth } = props;

  return (
    <div style={{ width: chartWidth }}>
      <Plot
        data={[
          {
            x: props.data.map((el) => el.price),
            // y: this.props.data.map(el => el.km),
            type: 'histogram',
            // axis: 'y2',
            marker: {
              color: barColor,
            },
            hoverlabel: {
              bgcolor: '#293742',
            },
          },
        ]}
        layout={{
          title: 'Price distribution',
          titlefont: {
            color: fontColor,
          },
          width: chartWidth,
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
            gridcolor: '#394B59',
          },
          yaxis2: {
            color: fontColor,
            gridcolor: '#394B59',
          },
          bargap: 0.2,
          // shapes: [
          //   {
          //     type: 'line',
          //     x0: math.median(props.data.map((el) => el.price)),
          //     x1: math.median(props.data.map((el) => el.price)),
          //     y0: 0,
          //     y1: 120,
          //     line: {
          //       color: 'red',
          //       width: 2,
          //     },
          //   },
          // ],
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

PriceDistribution.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fontColor: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

export default PriceDistribution;
