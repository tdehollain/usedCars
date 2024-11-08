const scrapVehicle = require('./scrapVehicle.js');
const vehiclesDefinitions = require('./vehiclesData/bentley.json');

const getNonce = async (URL) => {
  const res = await fetch(URL);
  const text = await res.text();
  const split = text.split('as24-search-funnel_main-')[1];
  const nonce = split.split('/')[0];
  // const nonce = isNaN(split.slice(4, 5))
  //   ? split.slice(0, 4)
  //   : split.slice(0, 5);
  // console.log(split);
  console.log('nonce:', nonce);
  return nonce;
};

const start = async (manualMode = true, vehiclesToProcess) => {
  const nonce = await getNonce(vehiclesToProcess[0].vehicleURL);
  console.log({ nonce });

  return vehiclesToProcess;
};

start(true, vehiclesDefinitions).then((processedVehicles) => {
  const outputMessage = `Job Complete. ${
    processedVehicles.length
  } vehicles processed. Vehicles processed: ${processedVehicles.map(
    (e) => `\n${e.title}, success: ${e.success} (nb results: ${e.lastCount})`
  )}`;
  console.log(outputMessage);
  return outputMessage;
});
