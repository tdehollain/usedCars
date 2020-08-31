import math from 'mathjs';

const removeOutliers = (records) => {
  const count = records.length;
  if (count === 0) return false;

  const sortedPrices = records.sort((a, b) => a.price - b.price).map((el) => el.price);
  const Q1 = sortedPrices[Math.floor(0.25 * count)]; // 1st quartile
  const Q3 = sortedPrices[Math.floor(0.75 * count)]; // 3rd quartile

  const IQrange = Q3 - Q1;
  const lowerOuterFence = Q1 - 1.5 * IQrange;
  const upperOuterFence = Q3 + 1.5 * IQrange;
  // console.log(`Q1: ${Q1}, Q3: ${Q3}, IQrange: ${IQrange}, lowerOuterFence: ${lowerOuterFence}, upperOuterFence: ${upperOuterFence}`);

  return records.filter((el) => el.price >= lowerOuterFence && el.price <= upperOuterFence);
};

const calculateStatistics = (records) => {
  // sort records by price
  const sortedRecords = records.sort((a, b) => a.price - b.price);
  // console.log(sortedRecords);

  // remove outliers
  const sortedRecords_noOutliers = removeOutliers(sortedRecords);
  // console.log(sortedRecords_noOutliers);

  const nbVehicles = sortedRecords_noOutliers.length;
  const medianPrice = nbVehicles ? math.median(sortedRecords_noOutliers.map((el) => el.price)) : 'N/A';
  const priceP10 = nbVehicles ? sortedRecords_noOutliers[Math.floor(0.1 * nbVehicles)].price : 'N/A';
  const priceP90 = nbVehicles ? sortedRecords_noOutliers[Math.floor(0.9 * nbVehicles)].price : 'N/A';

  return {
    nbVehicles,
    medianPrice,
    priceP10,
    priceP90,
    slope1: 1,
    slope2: 1,
  };
};

export {
  calculateStatistics,
  removeOutliers,
};
