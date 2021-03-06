import math from 'mathjs';
import SimpleLinearRegression from 'ml-regression-simple-linear';

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

  const nbVehicles = sortedRecords.length;
  const medianPrice = nbVehicles ? math.median(sortedRecords.map((el) => el.price)) : 'N/A';
  const priceP10 = nbVehicles ? sortedRecords[Math.floor(0.1 * nbVehicles)].price : 'N/A';
  const priceP90 = nbVehicles ? sortedRecords[Math.floor(0.9 * nbVehicles)].price : 'N/A';

  return {
    nbVehicles,
    medianPrice,
    priceP10,
    priceP90,
  };
};

const calculateRegressions = (records, kmSplit) => {
  // Split the records between low mileage and high mileage
  const lowMileageRecords = records.filter((el) => el.km <= kmSplit);
  const highMileageRecords = records.filter((el) => el.km > kmSplit);

  const lowMileageRegression = new SimpleLinearRegression(lowMileageRecords.map((el) => el.km), lowMileageRecords.map((el) => el.price));
  const highMileageRegression = new SimpleLinearRegression(highMileageRecords.map((el) => el.km), highMileageRecords.map((el) => el.price));

  return { lowMileageRegression, highMileageRegression };
};

export {
  calculateStatistics,
  calculateRegressions,
  removeOutliers,
};
