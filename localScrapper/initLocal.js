// const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
const scrapVehicle = require('../scrapper/scrapVehicle.js');
const vehiclesDefinitions = require('../scrapper/localModeVehicles.json');

console.log('Starting');
const manualMode = true;
const localMode = true;
console.log(vehiclesDefinitions);

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      // args: chromium.args,
      // defaultViewport: chromium.defaultViewport,
      // executablePath: await chromium.executablePath,
      headless: false,
      slowMo: 50
    });

    const browserContext = browser.defaultBrowserContext();
    browserContext.overridePermissions("https://www.autoscout24.com", ["geolocation", "notifications"]);
    let browserPage = await browser.newPage();
    await browserPage.setViewport({
      width: 1440,
      height: 4000,
      deviceScaleFactor: 1
    });

    // let processedVehicles = await scrapVehicle.start(browserPage, manualMode, vehiclesDefinitions, localMode);
    let processedVehicles = await scrapVehicle.processVehicles(browserPage, vehiclesDefinitions);
    const outputMessage = `Job Complete. ${processedVehicles.length} vehicles processed. Vehicles processed: ${processedVehicles.map(
      e => `\n${e.title}, success: ${e.success} (nb results: ${e.lastCount})`
    )}`;
    console.log(outputMessage);
    return outputMessage;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
})();