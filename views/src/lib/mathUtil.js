import math from 'mathjs';

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