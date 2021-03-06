const db = process.env.VEHICLE_LIST_TABLE ? require('./lib/db') : null;
const scrapUtils = require('./lib/scrapUtils');
const vehicleUtils = require('./lib/vehicleUtils');

const MAX_RETRIES = 4;

const start = async (browserPage, manualMode = false, vehiclesDefinitions) => {
  // Get tracked vehicles data
  const vehicleList = await db.getVehicleList();
  const vehiclesToProcess = manualMode
    ? vehicleList.filter(vehicle => {
      let found = false;
      for (const vehicleToProcess of vehiclesDefinitions) {
        if (vehicleToProcess.timingDay === vehicle.timingDay && vehicleToProcess.timingHour === vehicle.timingHour) {
          found = true;
          break;
        }
      }
      return found;
    })
    : vehicleList.filter(vehicleUtils.filterVehiclesToProcessNow);
  let processedVehicles = await processVehicles(browserPage, vehiclesToProcess);

  for (let processedVehicle of processedVehicles) {
    // Save records to DB
    if (processedVehicle.success) {
      await db.putVehicleRecords(processedVehicle);
    }

    // Update last count in vehicle list
    await db.updateVehicle(processedVehicle);

    // Write to Scrap Log
    const { title, success, oldCount, lastCount } = processedVehicle;
    await db.writeToScrapLog(title, { success, oldCount, lastCount });
  }
  return processedVehicles;
};

const processVehicles = async (browserPage, vehicleList) => {
  let processedVehicles = [];
  for (let vehicle of vehicleList) {
    const oldCount = vehicle.lastCount;
    try {
      let { vehicleRecords, lastCount } = await launchProcessVehicles(browserPage, vehicle);
      const updatedVehicle = { ...vehicle, success: true, oldCount, lastCount, lastUpdate: new Date(), records: vehicleRecords };
      console.log('updatedVehicle: ');
      console.log(updatedVehicle);
      processedVehicles.push(updatedVehicle);
    } catch (err) {
      console.log('ERROR: ' + err.message);
      processedVehicles.push({ ...vehicle, success: false, oldCount, lastCount: 'n/a' });
    }
  }
  return processedVehicles;
};

// Function wrappint processVehicle to get retries strategy
const launchProcessVehicles = async (browserPage, vehicle, nbOfRetries = 0) => {
  try {
    let { vehicleRecords, lastCount } = await processVehicle(browserPage, vehicle);
    return { vehicleRecords, lastCount };
  } catch (err) {
    if (nbOfRetries < MAX_RETRIES) {
      console.log(`Retry #${nbOfRetries + 1} (Error: ${err})`);
      return await launchProcessVehicles(browserPage, vehicle, nbOfRetries + 1);
    } else {
      throw new Error(err);
    }
  }
};

const processVehicle = async (browserPage, vehicle) => {
  console.log(`<-----   Processing: ${vehicle.title} (brand: ${vehicle.brand}, model: ${vehicle.model})    ----->`);
  let nbResults = await scrapUtils.navigateToVehicle(vehicle, browserPage); // get number of pages
  console.log(`Number of results: ${nbResults}`);

  // Process depending on number of results
  let vehicleRecords = [];
  if (nbResults > 0) {
    if (nbResults < 400) {
      //----------------------------
      //-----   General Case   -----
      //----------------------------
      vehicleRecords = await loopThroughPages(browserPage, vehicle.title, vehicleRecords);
    } else {
      //-----------------------
      //-----   By Year   -----
      //-----------------------
      console.log(`More than 20 pages. Querying by year.`);
      let lastYear = parseInt(vehicle.regTo, 10) || new Date().getFullYear();
      // Skip the current year if before mid-Jan (not yet listed on the website)
      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth();
      if (currentMonth === 0 && currentDay <= 15) lastYear = lastYear - 1;
      for (let i = parseInt(vehicle.regFrom, 10); i <= lastYear; i++) {
        console.log(`   Processing: ${vehicle.title} - year ${i}`);
        let vehicleByYear = JSON.parse(JSON.stringify(vehicle));
        vehicleByYear.regFrom = i;
        vehicleByYear.regTo = i === new Date().getFullYear() ? '' : i;

        let nbResultsByYear = await scrapUtils.navigateToVehicle(vehicleByYear, browserPage); // get number of pages
        console.log(`   Number of results: ${nbResultsByYear}`);
        if (nbResultsByYear > 0) {
          if (nbResultsByYear < 400) {
            vehicleRecords = await loopThroughPages(browserPage, vehicle.title, vehicleRecords);
          } else {
            //-----------------------------------
            //-----   By Year and Mileage   -----
            //-----------------------------------
            console.log('   More than 20 pages, even by year. Querying by year and mileage.');
            // do it by mileage
            let vehicleByYearAndMileage = [
              { ...vehicle, kmTo: '2500' },
              { ...vehicle, kmFrom: '2500', kmTo: '5000' },
              { ...vehicle, kmFrom: '5000', kmTo: '10000' },
              { ...vehicle, kmFrom: '10000', kmTo: '20000' },
              { ...vehicle, kmFrom: '20000', kmTo: '40000' },
              { ...vehicle, kmFrom: '40000', kmTo: '80000' },
              { ...vehicle, kmFrom: '80000' }
            ];
            for (let j = 0; j < 7; j++) {
              console.log(
                `      Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}`
              );
              let nbResultsByYearAndMileage = await scrapUtils.navigateToVehicle(vehicleByYearAndMileage[j], browserPage); // get number of pages
              console.log(`      Number of results: ${nbResultsByYearAndMileage}`);
              if (nbResultsByYearAndMileage > 0) {
                if (nbResultsByYearAndMileage < 400) {
                  vehicleRecords = await loopThroughPages(browserPage, vehicle.title, vehicleRecords);
                } else if (nbResultsByYearAndMileage < 800) {
                  console.log(
                    '      Between 20 and 40 pages, even by year AND mileage. Doing it once in ascending price and once in descending price.'
                  );

                  //----------------------------------------------
                  //-----   By Year and Mileage - Ascending  -----
                  //----------------------------------------------
                  let vehicleByYearAndMileageAsc = { ...vehicleByYearAndMileage[j], sorting: 'Price ascending' };
                  console.log(
                    `         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}. Order: ascending`
                  );

                  let nbResultsByYearAndMileageAscending = await scrapUtils.navigateToVehicle(vehicleByYearAndMileageAsc, browserPage);
                  vehicleRecords = await loopThroughPages(browserPage, vehicle.title, vehicleRecords);

                  //-----------------------------------------------
                  //-----   By Year and Mileage - Descending  -----
                  //-----------------------------------------------
                  let vehicleByYearAndMileageDesc = { ...vehicleByYearAndMileage[j], sorting: 'Price descending' };
                  console.log(
                    `         Processing: ${vehicle.title} - year ${i} - mileage: ${vehicleByYearAndMileage[j].kmFrom} to ${vehicleByYearAndMileage[j].kmTo}. Order: descending`
                  );

                  let nbResultsByYearAndMileageDescending = await scrapUtils.navigateToVehicle(vehicleByYearAndMileageDesc, browserPage);
                  vehicleRecords = await loopThroughPages(browserPage, vehicle.title, vehicleRecords);
                } else {
                  console.log('      More than 40 pages, even by year AND mileage. Skipping vehicle.');
                  return { vehicleRecords: null, lastCount: 'too many' };
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(`Completed ${vehicle.title}. ${vehicleRecords.length} records.`);
  return { vehicleRecords, lastCount: nbResults };
};

const loopThroughPages = async (browserPage, vehicleTitle, vehicleRecords) => {
  let output = JSON.parse(JSON.stringify(vehicleRecords));
  let hasNextPage = true;
  do {
    let vehicleRecordsThisPage = await getRecordsForPage(browserPage);
    // Add vehicle title to records
    vehicleRecordsThisPage = vehicleRecordsThisPage.map(el => {
      return { ...el, title: vehicleTitle };
    });
    output = vehicleUtils.addRecordsToList(output, vehicleRecordsThisPage);
    hasNextPage = await scrapUtils.hasNextPage(browserPage);
    if (hasNextPage) await scrapUtils.goToNextPage(browserPage);
  } while (hasNextPage);

  return output;
};

const getRecordsForPage = async browserPage => {
  await browserPage.waitForSelector('.cldt-summary-full-item');

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
      let url = vehicleElement.querySelector('.cldt-summary-headline > .cldt-summary-titles > a').href.split('?')[0];

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

      return {
        url,
        model,
        version,
        price,
        km,
        firstRegMonth,
        firstRegYear,
        power,
        used,
        prevOwners,
        transmissionType,
        fuelType,
        country
      };
    });
  });

  // Add url-month key, measureDate and month
  const yearmonth = parseInt(new Date().getFullYear() + ('0' + (new Date().getMonth() + 1)).slice(-2));
  vehicles = vehicles.map(el => {
    return {
      ...el,
      urlmonth: el.url + '-' + yearmonth,
      measureDate: new Date().getTime(),
      yearmonth
    };
  });

  // console.log(`vehicles on this page: ${vehicles.length}`);
  // console.log(`vehicles: ${JSON.stringify(vehicles, null, '\t')}`);

  return vehicles;
};

module.exports = {
  start,
  processVehicles
};
