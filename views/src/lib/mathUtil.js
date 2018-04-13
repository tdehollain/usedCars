import math from 'mathjs';
import * as tf from '@tensorflow/tfjs';

export function getBinData(data, nbins) {
	
	// reduce nbins for small datasets
	if(data.length < 10) { nbins = Math.floor(data.length / 2) }
	else if(data.length < 20) { nbins = Math.floor(data.length / 3) }
	else if(data.length < 40) { nbins = Math.floor(data.length / 4) }

	// get bin size
	let min = math.min(data);
	let max = math.max(data);
	let range = max - min;
	let binSize = range / nbins;
	// console.log(`min: ${min}`);
	// console.log(`max: ${max}`);
	// console.log(`range: ${range}`);
	// console.log(`binSize: ${binSize}`);

	// get the order of magnitude of the bin size
	let binSizeOrderMag = Math.ceil(Math.log10(binSize));

	// round the bin size
	if(binSize < 1.5 * Math.pow(10, binSizeOrderMag - 1)) { binSize = Math.pow(10, binSizeOrderMag - 1) }
	else if(binSize < 3.5 * Math.pow(10, binSizeOrderMag - 1)) { binSize = 2 * Math.pow(10, binSizeOrderMag - 1) }
	else if(binSize < 7.5 * Math.pow(10, binSizeOrderMag - 1)) { binSize = 5 * Math.pow(10, binSizeOrderMag - 1) }
	else { binSize = Math.pow(10, binSizeOrderMag) }

	// new nbins
	nbins = Math.ceil(range / binSize);
	// console.log(`nbins: ${nbins}`);
	// console.log(`binsize: ${binSize}`);

	// new min
	let newMin;
	let i=0;
	do {
		if(min <= (i+1) * binSize) {
			newMin = i * binSize;
		}
		i++;
	} while (newMin === undefined);

	// console.log(`newMin: ${newMin}`);
	min = newMin;

	// Add a bin if the new min took us to far
	if((min + nbins*binSize) < max) nbins++;

	let output = [];

	for(let i=0; i<data.length; i++) {
		// console.log(`data ${i}: ${data[i]}`);
		for(let j=0; j<nbins; j++) {
			if(data[i] >= (min + (j * binSize)) && data[i] < (min + ((j+1) * binSize))) {
				// console.log(`output: ${i}`);
				output.push({
					data: data[i], 
					binFrom: min + (j*binSize), 
					binTo: min + ((j+1)*binSize) 
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

export function groupBy(arr, prop, func, attr) {

  let output = arr.reduce(function(groups, item) {
    const val = item[prop]
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
	}, {});

	if(func === 'count') {
		for(let key in output) {
			output[key] = output[key].length;
		}
	} else if(func === 'median') {
		for(let key in output) {
			output[key] = math.median(output[key].map(el => el[attr]));
		}
	}

	return output;
}

export async function linearRegression(km, price) {

	const x = tf.tensor1d(km.map(el => el/math.max(km)));
	const y = tf.tensor1d(price.map(el => el/math.max(price)));

	const nbIterations = 100;
	const learningRate = 0.5;
	const optimizer = tf.train.sgd(learningRate);

	const a = tf.variable(tf.scalar(Math.random()));
	const b = tf.variable(tf.scalar(Math.random()));
	const c = tf.variable(tf.scalar(Math.random()));
	const d = tf.variable(tf.scalar(Math.random()));

	function loss(prediction, labels) {
		const meanSquareError = prediction.sub(labels).square().mean();
		// console.log(`meanSquareError: ${meanSquareError}`);
		return meanSquareError;
	}

	async function train(xs, ys, numIterations = 75) {
		for(let iter=0; iter < numIterations; iter++) {
			optimizer.minimize(() => {
				const predsYs = predict(xs);
				return loss(predsYs, ys);
			});
			await tf.nextFrame();
		}
	}

	function predict(x) {
		// y = a*x + b
		return tf.tidy(() => {
			// return a; // y = a
			// return a.mul(x).add(b); // y = a*x + b
			// return a.mul(x.square()).add(b.mul(x)).add(c); // y = a*xˆ2 + b*x + c
			// return a.mul(x.pow(tf.scalar(3, 'int32'))) // y = a*xˆ2 + b*xˆ2 + c*x + d
			// 	.add(b.mul(x.square()))
			// 	.add(c.mul(x))
			// 	.add(d);
			return a.mul(tf.log(x.add(c))).add(b); // y = a*log(x+c) + b
			// return a.mul(x.add(c).pow(tf.scalar(-1, 'int32'))).add(b); // y = a * 1/(x+c) + b
		});
	}

	async function learnCoefficients(x, y) {
		await train(x, y, nbIterations);
	}

	await learnCoefficients(x, y);
	let predictedPrice = await predict(x);
	let output = predictedPrice.dataSync().map(el => el*math.max(price));
	// console.log(output);
	// console.log({ a: a.dataSync(), b: b.dataSync(), c: c.dataSync(), d: d.dataSync() })
	return output;
	
}