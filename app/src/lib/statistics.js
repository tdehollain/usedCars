import math from 'mathjs';

const calculateStatistics = (records) => {
  console.log(records[0]);

  // console.log(`Nb of records: ${records.length}`);
  // Get latest yearmonth
  const latestYearMonth = records.map((el) => el.yearmonth).sort((a, b) => b - a)[0];

  // Keep only latest records
  const latestRecords = records.filter((el) => el.yearmonth === latestYearMonth).sort((a, b) => a.price - b.price);
  // console.log(`Nb of latest records: ${latestRecords.length}`);
  // console.log(latestRecords);

  const nbVehicles = latestRecords.length;
  const medianPrice = nbVehicles ? math.median(latestRecords.map((el) => el.price)) : 'N/A';
  const priceP10 = nbVehicles ? latestRecords[Math.floor(0.1 * nbVehicles)].price : 'N/A';
  const priceP90 = nbVehicles ? latestRecords[Math.floor(0.9 * nbVehicles)].price : 'N/A';
  // console.log(`priceP10: ${priceP10}`);
  // console.log(`priceP90: ${priceP90}`);

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
};
