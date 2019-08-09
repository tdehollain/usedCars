import React, { Component } from 'react';
import math from 'mathjs';
import Plot from 'react-plotly.js';

export default class Histogram extends Component {
  render() {
    let fontColor = '#E1E8ED';
    // let barColor = '#15B371';
    let barColor = '#2B95D6';

    return (
      <div>
        <Plot
          data={[
            {
              x: this.props.data.map(el => el.price),
              // y: this.props.data.map(el => el.km),
              type: 'histogram',
              // axis: 'y2',
              marker: {
                color: barColor
              },
              hoverlabel: {
                bgcolor: '#293742'
              }
            }
          ]}
          layout={{
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
              zeroline: false
            },
            yaxis: {
              color: fontColor,
              gridcolor: '#394B59'
            },
            yaxis2: {
              color: fontColor,
              gridcolor: '#394B59'
            },
            bargap: 0.2,
            shapes: [
              {
                type: 'line',
                x0: math.median(this.props.data.map(el => el.price)),
                x1: math.median(this.props.data.map(el => el.price)),
                y0: 0,
                y1: 120,
                line: {
                  color: 'red',
                  width: 2
                }
              }
            ]
          }}
          config={{
            displayModeBar: false
          }}
        />
      </div>
    );
  }
}
