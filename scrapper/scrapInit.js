const chromium = require('chrome-aws-lambda');
const scrapVehicle = require('./scrapVehicle.js');

exports.handler = async (event, context, callback) => {
  console.log('Starting');

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

    let processedVehicles = await scrapVehicle.start(browserPage);
    console.log(`Job Complete. ${processedVehicles.length} vehicles processed.`);
    // callback(null, 'Processed vehicles: ' + processedVehicles.length);
    callback(null, `Job Complete. ${processedVehicles.length} vehicles processed.`);
    return;
  } catch (error) {
    callback(error);
    return;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
