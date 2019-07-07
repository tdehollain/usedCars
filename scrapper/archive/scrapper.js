// const fetch = require('node-fetch');
// const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
// const fs = require('fs');
const util = require('./lib/util');
const mongoose = require('mongoose');

// DB =====================================================
const db = require('./lib/db')(mongoose);
// mongoose.set('debug', true);
mongoose.connect(db.url, err => {
  start();
});

let processedVehicles = [];

async function start() {
  // Get tracked vehicles data
  const { success, vehicleList } = await db.getVehicleList();
  if (success) {
    await processVehicles(vehicleList);
    let d = new Date();
    console.log(
      `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()} - ${('0' + d.getHours()).slice(-2)}:${(
        '0' + d.getMinutes()
      ).slice(-2)}. Complete. ${processedVehicles.length} vehicles processed.`
    );
    process.exit(0);
  } else {
    console.log('Error getting the list of tracked vehicles');
    process.exit(0);
  }
}

async function processVehicles(vehicleData) {
  for (vehicle of vehicleData) {
    // Skip vehicle if no title, brand, model, or firstRegFrom
    if (util.hasValidData(vehicle)) {
      // only process vehicles that need to be processed at this time
      let currentDay;
      let currentHour;

      if (process.argv[2] && process.argv[3]) {
        currentDay = parseInt(process.argv[2], 10);
        currentHour = parseInt(process.argv[3], 10);
        if (currentDay < 1 || currentDay > 28) throw new Error('Day to process must be between 1 and 28');
        if (currentHour < 0 || currentHour > 23) throw new Error('Hour to process must be between 0 and 23');
      } else {
        currentDay = new Date().getDate();
        currentHour = new Date().getHours();
      }
      let vehicleDay = vehicle.timingDay;
      let vehicleHour = vehicle.timingHour;
      // console.log(`day: ${currentDay} - ${vehicleDay}; hour: ${currentHour} - ${vehicleHour}`);

      // only process the vehicles for this time stamp
      if (vehicleDay === currentDay && vehicleHour === currentHour) {
        // Browser ================================================
        const browser = await puppeteer.launch({ headless: false });
        const browserPage = await browser.newPage();
        browserPage.on('console', msg => {
          console.log(msg.text());
        });

        console.log(`<-----   Processing: ${vehicle.title}   ----->`);
        let nbResults = await waitTillPageReady(vehicle, browserPage); // get number of pages
        console.log(`Number of results: ${nbResults}`);
        if (nbResults > 400) {
          console.log(`More than 20 pages. Querying by year.`);
          // do it year by year
          let lastYear = vehicle.regTo || new Date().getFullYear();
          for (i = parseInt(vehicle.regFrom, 10); i <= lastYear; i++) {
            console.log(`   Processing: ${vehicle.title} - year ${i}`);
            let vehicleByYear = vehicle;
            vehicleByYear.regFrom = i;
            vehicleByYear.regTo = i === new Date().getFullYear() ? '' : i;

            let nbResultsByYear = await waitTillPageReady(vehicleByYear, browserPage); // get number of pages
            console.log(`   nbResultsByYear: ${nbResultsByYear}`);
            if (nbResultsByYear > 400) {
              console.log('   More than 20 pages, even by year. Querying by year and mileage.');
              // do it by mileage
              let vehicleByYearAndMileage = [
                { ...vehicle, kmFrom: '', kmTo: '2500' },
                { ...vehicle, kmFrom: '2500', kmTo: '5000' },
                { ...vehicle, kmFrom: '5000', kmTo: '10000' },
                { ...vehicle, kmFrom: '10000', kmTo: '20000' },
                { ...vehicle, kmFrom: '20000', kmTo: '40000' },
                { ...vehicle, kmFrom: '40000', kmTo: '80000' },
                { ...vehicle, kmFrom: '80000', kmTo: '' }
              ];
              for (j = 0; j < 7; j++) {
                console.log(
                  `      Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${
                    vehicleByYearAndMileage[j].kmTo
                  }`
                );
                let nbResultsByYearAndMileage = await waitTillPageReady(vehicleByYearAndMileage[j], browserPage); // get number of pages
                console.log(`      nbResultsByYearAndMileage: ${nbResultsByYearAndMileage}`);
                if (nbResultsByYearAndMileage > 800) {
                  console.log('      More than 40 pages, even by year AND mileage. Skipping vehicle.');
                  return;
                } else if (nbResultsByYearAndMileage > 400) {
                  console.log(
                    '      Between 20 and 40 pages, even by year AND mileage. Doing it once in ascending price and once in descending price.'
                  );
                  let vehicleByYearAndMileageAsc = { ...vehicleByYearAndMileage[j], sorting: 'asc' };
                  let vehicleByYearAndMileageDesc = { ...vehicleByYearAndMileage[j], sorting: 'desc' };

                  console.log(
                    `         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${
                      vehicleByYearAndMileage[j].kmTo
                    }. Order: ascending`
                  );
                  let hasNextPage = true;
                  let page = 1;
                  do {
                    hasNextPage = await processPage(vehicleByYearAndMileageAsc, browserPage, page);
                    page++;
                  } while (hasNextPage);

                  console.log(
                    `         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${
                      vehicleByYearAndMileage[j].kmTo
                    }. Order: descending`
                  );
                  hasNextPage = true;
                  page = 1;
                  do {
                    hasNextPage = await processPage(vehicleByYearAndMileageDesc, browserPage, page);
                    page++;
                  } while (hasNextPage);
                } else {
                  if (nbResultsByYearAndMileage > 0) {
                    let hasNextPage = true;
                    let page = 1;
                    do {
                      hasNextPage = await processPage(vehicleByYearAndMileage[j], browserPage, page);
                      page++;
                    } while (hasNextPage);
                  }
                }
              }
            } else {
              if (nbResultsByYear > 0) {
                let hasNextPage = true;
                let page = 1;
                do {
                  hasNextPage = await processPage(vehicleByYear, browserPage, page);
                  page++;
                } while (hasNextPage);
              }
            }
          }
        } else {
          if (nbResults > 0) {
            let hasNextPage = true;
            let page = 1;
            do {
              hasNextPage = await processPage(vehicle, browserPage, page);
              page++;
            } while (hasNextPage);
          }
        }
        //update last count for this vehicle
        await db.updateLastCount(vehicle.title, nbResults);
        browser.close();
      } else {
        // console.log('not now');
      }
    } else {
      console.log('Invalid data for vehicle [' + vehicle.title !== '' ? vehicle.title : 'no title provided' + ']. Skipping vehicle');
    }
  }
}

async function processPage(vehicle, browserPage, page = 1) {
  console.log('processing page: ' + page);
  let nbResultsThisPage = await waitTillPageReady(vehicle, browserPage, page);
  console.log(`Number of results for page ${page}: ${nbResultsThisPage}`);
  // // util.logMemoryUsage();
  // let url = util.buildURL(vehicle, page);
  // // page === 1 && console.log(`url: ${url}`);

  // // console.log(`heapTotal1: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
  // await browserPage.goto(url);
  // await browserPage.waitFor(1000);
  // // console.log(`heapTotal2: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
  let vehicles = await browserPage.evaluate(() => {
    let vehiclesSelector = '.cldt-summary-full-item';
    let vehiclesElements = Array.from(document.querySelectorAll(vehiclesSelector));

    function getAttribute(name, vehicleElement, parameters) {
      let DOMElement =
        name === 'country'
          ? vehicleElement.querySelector(parameters.selector1) || vehicleElement.querySelector(parameters.selector2)
          : vehicleElement.querySelector(parameters.selector);
      try {
        let outputContent = name === 'price' ? DOMElement.childNodes[0].textContent : DOMElement.textContent;
        let output = parameters.numerical ? outputContent.trim().replace(/\D/g, '') : outputContent.trim();
        if (name === 'firstReg') {
          let firstRegArr = output.split('/');
          let firstRegMonth = firstRegArr[0] ? firstRegArr[0].replace(/\D/g, '') : '';
          let firstRegYear = firstRegArr[1] ? firstRegArr[1].replace(/\D/g, '') : '';
          return { firstRegMonth, firstRegYear };
        } else {
          return output;
        }
      } catch (error) {
        console.log('Warning: no content for attribute [' + name + ']');
        return '';
      }
    }

    return vehiclesElements.map(vehicleElement => {
      let url =
        'https://www.autoscout24.com' +
        vehicleElement.querySelector('.cldt-summary-headline > .cldt-summary-titles > a').href.split('?')[0];

      let model = getAttribute('model', vehicleElement, {
        numerical: false,
        selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-makemodel'
      });
      let version = getAttribute('version', vehicleElement, {
        numerical: false,
        selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-version'
      });
      let price = getAttribute('price', vehicleElement, { numerical: true, selector: '.cldt-price' });
      let km = getAttribute('km', vehicleElement, { numerical: true, selector: 'li:nth-child(1)' });
      let { firstRegMonth, firstRegYear } = getAttribute('firstReg', vehicleElement, { numerical: false, selector: 'li:nth-child(2)' });
      let power = getAttribute('power', vehicleElement, { numerical: false, selector: 'li:nth-child(3)' });
      let used = getAttribute('used', vehicleElement, { numerical: false, selector: 'li:nth-child(4)' });
      let prevOwners = getAttribute('prevOwners', vehicleElement, { numerical: true, selector: 'li:nth-child(5)' });
      let transmissionType = getAttribute('transmissionType', vehicleElement, { numerical: false, selector: 'li:nth-child(6)' });
      let fuelType = getAttribute('fuelType', vehicleElement, { numerical: false, selector: 'li:nth-child(7)' });
      let country = getAttribute('country', vehicleElement, {
        numerical: false,
        selector1: '.cldt-summary-seller-contact-country',
        selector2: '.cldf-summary-seller-contact-country'
      });

      return { url, model, version, price, km, firstRegMonth, firstRegYear, power, used, prevOwners, transmissionType, fuelType, country };
    });
  });

  // Add measureDate
  vehicles = vehicles.map(el => {
    return { ...el, measureDate: new Date() };
  });

  // console.log(`vehicles: ${JSON.stringify(vehicles, null, '\t')}`);

  for (vehicleDetails of vehicles) {
    // check if vehicle was already processed
    if (!processedVehicles.includes(vehicleDetails.url)) {
      // console.log('#' + processedVehicles.length + ':' + vehicleDetails.model + ' - ' + vehicleDetails.version);
      let { success, id } = await db.addVehicleRecord(vehicle.title, vehicleDetails);
      if (success) {
        processedVehicles.push(vehicleDetails.url);
        // console.log('Successfully saved record for vehicle [' + vehicle.title + ']. URL: ' + vehicleDetails.url);
      } else {
        // console.log('Record for vehicle [' + vehicle.title + '] already present. URL: ' + vehicleDetails.url);
      }
    }
  }

  // Check if there is a next page
  let numberOfResults = await getNbOfResults(browserPage);
  let hasNextPage = numberOfResults / page > 20 ? true : false;
  return hasNextPage;
}

async function waitTillPageReady(vehicle, browserPage, page = 1) {
  let url = util.buildURL(vehicle, page);
  // console.log(`url: ${url}`);
  let nbTimeouts = 0;
  loadPage(url);

  async function loadPage(url) {
    try {
      await browserPage.goto(url);
    } catch (error) {
      console.log('error loading page (timeout #' + nbTimeouts + '): ' + error);
      nbTimeouts++;
      if (nbTimeouts <= 5) {
        loadPage(url);
      } else {
        return 0;
      }
    }
  }

  let numberOfResults = 0;
  let iterator = 0;
  do {
    if (iterator > 0) console.log(`Waiting ${iterator + 1} seconds`);
    await browserPage.waitFor(1000);
    numberOfResults = await getNbOfResults(browserPage);
    iterator = numberOfResults > 50000 ? iterator + 1 : 100;
  } while (iterator <= 15);

  // console.log(`Number of results: ${numberOfResults}`);
  return numberOfResults;
}

async function getNbOfResults(browserPage) {
  try {
    return await browserPage.evaluate(() => {
      let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
      try {
        let output = document
          .querySelectorAll(counterSelector)[0]
          .textContent.slice(0, -8)
          .replace(/,/g, '');
        return output;
      } catch (error) {
        console.log('Error getting number of results: ' + error);
        throw new Error('STOP');
      }
    });
  } catch (error) {
    console.log('Unknown error');
  }
}
