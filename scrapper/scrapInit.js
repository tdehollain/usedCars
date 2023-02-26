// const chromium = require('chrome-aws-lambda');
const scrapVehicle = require('./scrapVehicle.js');

exports.handler = async (event) => {
  console.log('Starting');
  const manualMode = event.manualMode || false;
  const vehiclesDefinitions = event.vehicles;

  console.log({ manualMode });

    let { processedVehicles } = await scrapVehicle.start(manualMode, vehiclesDefinitions);
    const outputMessage = `Job Complete. ${processedVehicles.length} vehicles processed. Vehicles processed: ${processedVehicles.map(
      e => `\n${e.title}, success: ${e.success} (nb results: ${e.lastCount})`
    )}`;
    console.log(outputMessage);
    return outputMessage;
};
