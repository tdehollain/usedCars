import math from 'mathjs';
import * as tf from '@tensorflow/tfjs';

/**
 *
 * @param {Array.<Number>} data - list of prices to be grouped in bins
 * @param {Int} nbins - number of bins by which to group the data
 */

export function getBinData(data, nbins) {
  // If there is only 1 element in data, return directly a single bin
  if (data.length < 2) {
    return { data: [{ data: data[0], binFrom: data[0] * 0.9, binTo: data[0] * 1.1 }], binSize: data[0] * 0.2 };
  }

  // 1. Remove outliers

  const sortedData = data.sort((a, b) => a - b);

  // get bin size
  let min = sortedData[0];
  let max = sortedData[sortedData.length - 1];
  let range = max - min;
  let binSize = Math.max(range / nbins, max * 0.1); // if range is very small, use 10% of the max value
  // console.log(`min: ${min}`);
  // console.log(`max: ${max}`);
  // console.log(`range: ${range}`);
  // console.log(`binSize: ${binSize}`);

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

  let output = [];

  for (let element of sortedData) {
    // console.log(`data ${i}: ${data[i]}`);
    for (let i = 0; i < nbins; i++) {
      if (element < min + (i + 1) * binSize) {
        // console.log(`output: ${i}`);
        output.push({
          data: element,
          binFrom: min + i * binSize,
          binTo: min + (i + 1) * binSize
        });
      }
    }
  }

  // console.log(`data length: ${data.length}`);
  // console.log(`output length: ${JSON.stringify(output.length)}`);
  // console.log(`data: ${data}`);
  // console.log(`output: ${JSON.stringify(output)}`);
  return { data: output, binSize };
}

export function isOutlier(data, value) {
  const count = data.length;
  if (count === 0) return false;
  const sortedData = data.sort((a, b) => a - b);
  const Q1 = sortedData[Math.floor(0.25 * count)]; // 1st quartile
  const Q3 = sortedData[Math.floor(0.75 * count)]; // 3rd quartile

  let IQrange = Q3 - Q1;
  let lowerOuterFence = Q1 - 1.5 * IQrange;
  let upperOuterFence = Q3 + 1.5 * IQrange;

  // console.log(`Value: ${value}, Q1: ${Q1}, Q3: ${Q3}, IQrange: ${IQrange}, lowerOuterFence: ${lowerOuterFence}, upperOuterFence: ${upperOuterFence}`);

  return value < lowerOuterFence || value > upperOuterFence;
}

export function groupBy(arr, prop, func, attr) {
  let output = arr.reduce(function(groups, item) {
    const val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});

  if (func === 'count') {
    for (let key in output) {
      output[key] = output[key].length;
    }
  } else if (func === 'median') {
    for (let key in output) {
      output[key] = math.median(output[key].map(el => el[attr]));
    }
  }

  return output;
}

export function linearRegression(km, price) {
  const x = tf.tensor1d(km.map(el => el / math.max(km)));
  const y = tf.tensor1d(price.map(el => el / math.max(price)));

  const nbIterations = 100;
  const learningRate = 0.5;
  const optimizer = tf.train.sgd(learningRate);

  const a = tf.variable(tf.scalar(Math.random()));
  const b = tf.variable(tf.scalar(Math.random()));
  // const c = tf.variable(tf.scalar(Math.random()));
  // const d = tf.variable(tf.scalar(Math.random()));

  function loss(prediction, labels) {
    const meanSquareError = prediction
      .sub(labels)
      .square()
      .mean();
    // console.log(`meanSquareError: ${meanSquareError}`);
    return meanSquareError;
  }

  function train(xs, ys, numIterations = 75) {
    for (let iter = 0; iter < numIterations; iter++) {
      optimizer.minimize(() => {
        const predsYs = predict(xs);
        return loss(predsYs, ys);
      });
      tf.nextFrame();
    }
  }

  function predict(x) {
    // y = a*x + b
    return tf.tidy(() => {
      // return a; // y = a
      return a.mul(x).add(b); // y = a*x + b
      // return a.mul(x.square()).add(b.mul(x)).add(c); // y = a*xˆ2 + b*x + c
      // return a.mul(x.pow(tf.scalar(3, 'int32'))) // y = a*xˆ2 + b*xˆ2 + c*x + d
      // 	.add(b.mul(x.square()))
      // 	.add(c.mul(x))
      // 	.add(d);
      // return a.mul(tf.log(x.add(c))).add(b); // y = a*log(x+c) + b
      // return a.mul(x.add(c).pow(tf.scalar(-1, 'int32'))).add(b); // y = a * 1/(x+c) + b
    });
  }

  function learnCoefficients(x, y) {
    train(x, y, nbIterations);
  }

  learnCoefficients(x, y);
  let predictedPrice = predict(x);
  let output = predictedPrice.dataSync().map(el => el * math.max(price));
  // console.log(output);
  // console.log({ a: a.dataSync(), b: b.dataSync() })
  return output;
}

export function numberWithCommas(x) {
  if (x === 0) {
    return '0';
  } else if (!x) {
    return 'N/A';
  } else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
