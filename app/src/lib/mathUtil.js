const isOutlier = (data, value) => {
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
};

const numberWithCommas = (x) => {
  if (x === 0) {
    return '0';
  } if (!x) {
    return 'N/A';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export {
  isOutlier,
  numberWithCommas,
};
