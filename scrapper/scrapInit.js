const chromium = require('chrome-aws-lambda');
const scrapVehicle = require('./scrapVehicle.js');

exports.handler = async (event, context, callback) => {
  console.log('Starting');
  const manualMode = event.manualMode;
  const vehiclesDefinitions = event.vehicles;

  console.log({ manualMode });

  let browser;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      slowMo: 50
    });
    let browserPage = await browser.newPage();
    await browserPage.setViewport({
      width: 1440,
      height: 4000,
      deviceScaleFactor: 1
    });

    let processedVehicles = await scrapVehicle.start(browserPage, manualMode, vehiclesDefinitions);
    const outputMessage = `Job Complete. ${processedVehicles.length} vehicles processed. Vehicles processed: ${processedVehicles.map(
      e => `\n${e.title}, success: ${e.success} (nb results: ${e.lastCount})`
    )}`;
    console.log(outputMessage);
    return outputMessage;
  } catch (error) {
    callback(error);
    return;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
