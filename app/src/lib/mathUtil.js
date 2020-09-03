import math from 'mathjs';

/**
 *
 * @param {Array.<Number>} data - list of prices to be grouped in bins
 * @param {Int} nbins - number of bins by which to group the data
 */

export function getBinData(data, nbins) {
  console.log(data);
  console.log(`nbins: ${nbins}`);

  // If there is only 1 element in data, return directly a single bin
  if (data.length < 2) {
    return { data: [{ data: data[0], binFrom: data[0] * 0.9, binTo: data[0] * 1.1 }], binSize: data[0] * 0.2 };
  }

  // 1. Remove outliers

  const sortedData = data.sort((a, b) => a - b);

  // get bin size
  const min = sortedData[0];
  const max = sortedData.slice(-1)[0];
  const range = max - min;
  const binSize = Math.max(range / nbins, max * 0.1); // if range is very small, use 10% of the max value
  console.log(`min: ${min}`);
  console.log(`max: ${max}`);
  console.log(`range: ${range}`);
  console.log(`binSize: ${binSize}`);

  // get the order of magnitude of the bin size
  // let binSizeOrderMag = Math.ceil(Math.log10(binSize));

  // // round the bin size
  // if (binSize < 1.5 * Math.pow(10, binSizeOrderMag - 1)) {
  //   binSize = Math.pow(10, binSizeOrderMag - 1);
  // } else if (binSize < 3.5 * Math.pow(10, binSizeOrderMag - 1)) {
  //   binSize = 2 * Math.pow(10, binSizeOrderMag - 1);
  // } else if (binSize < 7.5 * Math.pow(10, binSizeOrderMag - 1)) {
  //   binSize = 5 * Math.pow(10, binSizeOrderMag - 1);
  // } else {
  //   binSize = Math.pow(10, binSizeOrderMag);
  // }
  // // console.log(`binSize: ${binSize}`);

  // // new nbins
  // nbins = Math.max(Math.ceil(range / binSize), 1);
  // // console.log(`nbins: ${nbins}`);
  // console.log(`binsize: ${binSize}`);

  // new min
  // let newMin;
  // let i = 0;

  // do {
  //   if (min <= (i + 1) * binSize) {
  //     newMin = i * binSize;
  //   }
  //   i++;
  // } while (newMin === undefined);

  // // console.log(`newMin: ${newMin}`);
  // min = newMin;

  // // Add a bin if the new min took us to far
  // if (min + nbins * binSize < max) nbins++;

  const output = [];

  for (const element of sortedData) {
    // console.log(`data ${i}: ${data[i]}`);
    for (let i = 0; i < nbins; i += 1) {
      const binMin = min + (i + 1) * binSize;
      const binMax = i < (nbins - 1) ? min + (i + 2) * binSize : max + 1;

      if (element >= binMin && element < binMax) {
        // console.log(`output: ${i}`);
        output.push({
          data: element,
          binFrom: min + i * binSize,
          binTo: min + (i + 1) * binSize,
        });
      }
    }
  }

  console.log(`data length: ${data.length}`);
  console.log(`output length: ${JSON.stringify(output.length)}`);
  console.log(`data: ${data}`);
  console.log(`output: ${JSON.stringify(output)}`);
  return { data: output, binSize };
}

export function isOutlier(data, value) {
  const count = data.length;
  if (count === 0) return false;
  const sortedData = data.sort((a, b) => a - b);
  const Q1 = sortedData[Math.floor(0.25 * count)]; // 1st quartile
  const Q3 = sortedData[Math.floor(0.75 * count)]; // 3rd quartile

  const IQrange = Q3 - Q1;
  const lowerOuterFence = Q1 - 1.5 * IQrange;
  const upperOuterFence = Q3 + 1.5 * IQrange;

  // console.log(`Value: ${value}, Q1: ${Q1}, Q3: ${Q3}, IQrange: ${IQrange}, lowerOuterFence: ${lowerOuterFence}, upperOuterFence: ${upperOuterFence}`);

  return value < lowerOuterFence || value > upperOuterFence;
}

export function groupBy(arr, prop, func, attr) {
  const output = arr.reduce((groups, item) => {
    const val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});

  if (func === 'count') {
    for (const key in output) {
      output[key] = output[key].length;
    }
  } else if (func === 'median') {
    for (const key in output) {
      output[key] = math.median(output[key].map((el) => el[attr]));
    }
  }

  return output;
}

export function numberWithCommas(x) {
  if (x === 0) {
    return '0';
  } if (!x) {
    return 'N/A';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
