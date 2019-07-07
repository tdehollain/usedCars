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
      headless: chromium.headless
    });

    // let page = await browser.newPage();
    // await page.goto(event.url || 'https://www.bbc.com');
    // result = await page.title();

    let processedVehicles = await scrapVehicle.start();
    console.log(`Job Complete. ${processedVehicles.length} vehicles processed.`);

    callback(null, 'Processed vehicles: ' + processedVehicles.length);
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
