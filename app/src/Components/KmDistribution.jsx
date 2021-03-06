import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'plotly.js-cartesian-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

const KmDistribution = (props) => {
  const { fontColor, barColor, chartWidth } = props;

  return (
    <div style={{ width: chartWidth }}>
      <Plot
        data={[
          {
            x: props.data.map((el) => el.km),
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
          title: 'Mileage distribution',
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

KmDistribution.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fontColor: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

export default KmDistribution;
