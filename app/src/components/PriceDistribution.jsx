import React from 'react';
import PropTypes from 'prop-types';
import math from 'mathjs';
import Plot from 'react-plotly.js';
import { getBinData, groupBy } from '../lib/mathUtil';

const PriceDistribution = (props) => {
  const priceBinData = getBinData(props.data.map((el) => el.price), props.nbins).data;
  console.log(priceBinData);
  const priceBinsCounts = groupBy(priceBinData, 'binFrom', 'count');
  const barChartData = [];
  for (const key in priceBinsCounts) {
    barChartData.push({ binFrom: key, count: priceBinsCounts[key] });
  }
  // console.log(priceBinsCounts);

  // let hoverTexts = [];
  // for(let i=0; i<barChartData.length-1; i++) {
  //  hoverTexts.push(`${barChartData[i].binFrom/1000}k - ${barChartData[i+1].binFrom/1000}k`)
  // }
  // hoverTexts.push(`${barChartData[barChartData.length - 1].binFrom/1000}k - ${(barChartData[barChartData.length - 1].binFrom/1000 + (barChartData[barChartData.length - 1].binFrom/1000 - barChartData[barChartData.length - 2].binFrom/1000))}k`);

  const { fontColor, barColor, lineColor } = props;

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: barChartData.map((el) => el.binFrom),
          y: barChartData.map((el) => el.count),
          // text: barChartData.map(el => el.count),
          // textposition: 'outside',
          // outsidetextfont: {
          //  color: fontColor
          // },
          // hovertext: hoverTexts,
          marker: {
            color: barColor,
          },
          hoverinfo: 'y+text',
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
        width: 1200,
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
        shapes: [
          {
            type: 'line',
            x0: math.median(props.data.map((el) => el.price)),
            x1: math.median(props.data.map((el) => el.price)),
            y0: 0,
            y1: math.max(barChartData.map((el) => el.count)),
            line: {
              color: lineColor,
              width: 2,
            },
          },
        ],
      }}
      config={{
        displayModeBar: false,
      }}
    />
  );
};

PriceDistribution.propTypes = {
  nbins: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fontColor: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
};

export default PriceDistribution;
