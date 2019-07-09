// const util = require('./util');
const constants = require('./constants');

const logProgress = false;

const navigateToVehicle = async (vehicle, browserPage) => {
  await browserPage.goto(constants.autoScoutBaseURL);

  //===========================
  //=====   Brand Input   =====
  //===========================
  if (logProgress) console.log('Starting Brand Input');
  const brandInputSelector =
    '#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(1) input';
  await browserPage.waitForSelector(brandInputSelector);
  await browserPage.click(brandInputSelector);

  await browserPage.type(brandInputSelector, vehicle.brand);
  const brandValueSelector = `#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(1) > div > div > div > .as24-grouped-suggestions-list > div:nth-child(1) > li`;
  await browserPage.waitForSelector(brandValueSelector);
  await browserPage.click(brandValueSelector);
  if (logProgress) console.log('Completed Brand Input');

  //===========================
  //=====   Model Input   =====
  //===========================
  if (logProgress) console.log('Starting Model Input');
  const modelInputSelector =
    '#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(2) input';
  await browserPage.waitForSelector(modelInputSelector);
  await browserPage.click(modelInputSelector);

  await browserPage.type(modelInputSelector, vehicle.model);
  // Find model number in filtered list
  const filteredModels = await browserPage.evaluate(() => {
    const modelsListSelector = `#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(2) > div > div > div > .react-autocomplete__list--visible li`;
    return Array.from(document.querySelectorAll(modelsListSelector), e => e.textContent);
  });
  const modelNumberInFilteredList = filteredModels.findIndex(e => e.toLowerCase() === vehicle.model.toLowerCase()) + 1;

  // //prettier-ignore
  const modelValueSelector = `#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(2) > div > div > div > .react-autocomplete__list--visible > div:nth-child(${modelNumberInFilteredList}) > li`;
  await browserPage.waitForSelector(modelValueSelector);
  await browserPage.click(modelValueSelector);
  if (logProgress) console.log('Completed Model Input');

  //=============================
  //=====   Version Input   =====
  //=============================
  if (logProgress) console.log('Starting Model Input');
  if (vehicle.version) {
    const versionInputSelector =
      '#details > .cl-filters-section-body > div > .sc-grid-row:nth-child(1) > .cl-filter-element:nth-child(3) input';
    await browserPage.waitForSelector(versionInputSelector);
    await browserPage.click(versionInputSelector);
    await browserPage.type(versionInputSelector, vehicle.version);
    await browserPage.waitFor(5000);
  }
  if (logProgress) console.log('Completed Model Input');

  //===============================
  //=====   Body Type Input   =====
  //===============================
  if (logProgress) console.log('Starting Body Type Input');
  if (
    vehicle.checkedBodyCompact &&
    vehicle.checkedBodyConvertible &&
    vehicle.checkedBodyCoupe &&
    vehicle.checkedBodySedan &&
    vehicle.checkedBodySUV &&
    vehicle.checkedBodySW
  ) {
    // Do nothing if all body types are selected
  } else {
    const bodyTypeInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(2) > .cl-filter-element:nth-child(1) > span > div.as24-custom-dropdown';
    await browserPage.waitForSelector(bodyTypeInputSelector);
    await browserPage.click(bodyTypeInputSelector);

    vehicle.checkedBodyCompact && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(1)'));
    vehicle.checkedBodyConvertible && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(3)'));
    vehicle.checkedBodyCoupe && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(5)'));
    vehicle.checkedBodySedan && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(9)'));
    vehicle.checkedBodySUV && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(7)'));
    vehicle.checkedBodySW && (await browserPage.click(bodyTypeInputSelector + ' > div:nth-child(2) > input:nth-child(11)'));

    // Click again to close dropdown
    await browserPage.click(bodyTypeInputSelector);
  }
  if (logProgress) console.log('Completed Body Type Input');

  //==============================
  //=====   Reg From Input   =====
  //==============================
  if (logProgress) console.log('Starting Reg From Input');
  if (vehicle.regFrom) {
    const regFromInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(2) > .cl-filter-element:nth-child(2) > div > span:nth-child(1)';
    await browserPage.waitForSelector(regFromInputSelector + ' > div > div:nth-child(1) > div > input');
    await browserPage.click(regFromInputSelector + ' > div > div:nth-child(1) > div > input');

    await browserPage.type(regFromInputSelector + ' > div > div:nth-child(1) > div > input', vehicle.regFrom.toString());
    const regFromValueSelector =
      regFromInputSelector + ` > .react-autocomplete > .react-autocomplete__list--visible > div:nth-child(1) > li`;
    await browserPage.waitForSelector(regFromValueSelector);
    await browserPage.click(regFromValueSelector);
  }
  if (logProgress) console.log('Completed Reg From Input');

  //============================
  //=====   Reg To Input   =====
  //============================
  if (logProgress) console.log('Starting Reg To Input');
  if (vehicle.regTo) {
    const regToInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(2) > .cl-filter-element:nth-child(2) > div > span:nth-child(2)';
    await browserPage.waitForSelector(regToInputSelector + ' > div > div:nth-child(1) > div > input');
    await browserPage.click(regToInputSelector + ' > div > div:nth-child(1) > div > input');

    await browserPage.type(regToInputSelector + ' > div > div:nth-child(1) > div > input', vehicle.regTo.toString());
    const regToValueSelector = regToInputSelector + ` > .react-autocomplete > .react-autocomplete__list--visible > div:nth-child(1) > li`;
    await browserPage.waitForSelector(regToValueSelector);
    await browserPage.click(regToValueSelector);
  }
  if (logProgress) console.log('Completed Reg To Input');

  //===============================
  //=====   Fuel Type Input   =====
  //===============================
  if (logProgress) console.log('Starting Fuel Type Input');
  if (
    vehicle.checkedFuelPetrol &&
    vehicle.checkedFuelDiesel &&
    vehicle.checkedFuelElec &&
    vehicle.checkedFuelElecPetrol &&
    vehicle.checkedFuelElecDiesel
  ) {
    // Do nothing if all fuel types are selected
  } else {
    const fuelTypeInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(1) > .cl-filter-element > .as24-custom-dropdown';
    await browserPage.waitForSelector(fuelTypeInputSelector);
    await browserPage.click(fuelTypeInputSelector);
    // await browserPage.waitFor(5000);

    vehicle.checkedFuelPetrol && (await browserPage.click(fuelTypeInputSelector + ` > div:nth-child(2) > input[value='B']`));
    vehicle.checkedFuelDiesel && (await browserPage.click(fuelTypeInputSelector + ` > div:nth-child(2) > input[value='D']`));
    vehicle.checkedFuelElec && (await browserPage.click(fuelTypeInputSelector + ` > div:nth-child(2) > input[value='E']`));
    vehicle.checkedFuelElecPetrol && (await browserPage.click(fuelTypeInputSelector + ` > div:nth-child(2) > input[value='2']`));
    vehicle.checkedFuelElecDiesel && (await browserPage.click(fuelTypeInputSelector + ` > div:nth-child(2) > input[value='3']`));

    // Click again to close dropdown
    await browserPage.click(fuelTypeInputSelector);
  }
  if (logProgress) console.log('Completed Fuel Type Input');

  //================================
  //=====   Power From Input   =====
  //================================
  if (logProgress) console.log('Starting Power From Input');
  if (vehicle.chFrom) {
    // Set power type to ch
    // Check if power type is set to ch
    const powerTypeSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .cl-power-type > select';
    await browserPage.waitForSelector(powerTypeSelector);
    let selectedPowerType = await browserPage.evaluate(
      () =>
        document.querySelectorAll(
          `#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .cl-power-type > select`
        )[0].value
    );
    if (selectedPowerType !== 'hp') await browserPage.select(powerTypeSelector, 'hp');

    const chFromInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .sc-input-group > div:nth-child(1) > input';
    await browserPage.waitForSelector(chFromInputSelector);
    await browserPage.click(chFromInputSelector);
    await browserPage.type(chFromInputSelector, vehicle.chFrom.toString());
  }
  if (logProgress) console.log('Completed Power From Input');

  //================================
  //=====   Power To Input   =====
  //================================
  if (logProgress) console.log('Starting Power To Input');
  if (vehicle.chTo) {
    // Set power type to ch
    // Check if power type is set to ch
    const powerTypeSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .cl-power-type > select';
    await browserPage.waitForSelector(powerTypeSelector);
    let selectedPowerType = await browserPage.evaluate(
      () =>
        document.querySelectorAll(
          `#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .cl-power-type > select`
        )[0].value
    );
    if (selectedPowerType !== 'hp') await browserPage.select(powerTypeSelector, 'hp');

    const chToInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(3) > .cl-power-group > .sc-input-group > div:nth-child(2) > input';
    await browserPage.waitForSelector(chToInputSelector);
    await browserPage.click(chToInputSelector);
    await browserPage.type(chToInputSelector, vehicle.chTo.toString());
  }
  if (logProgress) console.log('Completed Power To Input');

  //===============================
  //=====   Gear Type Input   =====
  //===============================
  if (logProgress) console.log('Starting Trans Type Input');
  if (vehicle.checkedTransAuto && vehicle.checkedTransMan && vehicle.checkedTransSemi) {
    // Do nothing if all trans types are selected
  } else {
    const transTypeInputSelector =
      '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(4) > .cl-filter-element > .as24-custom-dropdown';
    await browserPage.waitForSelector(transTypeInputSelector);
    await browserPage.click(transTypeInputSelector);
    // await browserPage.waitFor(5000);

    vehicle.checkedTransAuto && (await browserPage.click(transTypeInputSelector + ` > div:nth-child(2) > input[value='A']`));
    vehicle.checkedTransMan && (await browserPage.click(transTypeInputSelector + ` > div:nth-child(2) > input[value='M']`));
    vehicle.checkedTransSemi && (await browserPage.click(transTypeInputSelector + ` > div:nth-child(2) > input[value='S']`));

    // Click again to close dropdown
    await browserPage.click(transTypeInputSelector);
  }
  if (logProgress) console.log('Completed Trans Type Input');

  //===========================
  //=====   Doors Input   =====
  //===========================
  if (vehicle.doorsFrom || vehicle.doorsTo) {
    if (logProgress) console.log('Starting Doors Input');

    if (vehicle.doorsFrom === 2 && vehicle.doorsTo === 3) {
      const doorsInputSelector =
        '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(5) > .cl-doors-filter > .cl-filter-element > .sc-input-group-radio > label:nth-child(4)';
      await browserPage.waitForSelector(doorsInputSelector);
      await browserPage.click(doorsInputSelector);
    } else if (vehicle.doorsFrom === 4 && vehicle.doorsTo === 5) {
      const doorsInputSelector =
        '#details > .cl-filters-section-body > div:nth-child(4) > div:nth-child(5) > .cl-doors-filter > .cl-filter-element > .sc-input-group-radio > label:nth-child(6)';
      await browserPage.waitForSelector(doorsInputSelector);
      await browserPage.click(doorsInputSelector);
    }
    if (logProgress) console.log('Completed Doors Input');
  }

  //========================
  //=====   FINALIZE   =====
  //========================
  // Wait for number of offers to be updated
  let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
  await browserPage.waitForSelector(counterSelector);

  let numberOfResults = await getNbOfResults(browserPage);
  return numberOfResults;
};

const getNbOfResults = async browserPage => {
  let numberOfResults = await browserPage.evaluate(() => {
    let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
    let output = document.querySelectorAll(counterSelector)[0].textContent.replace(/\D/g, '');
    return output;
  });
  // console.log(`numberOfResults: ${numberOfResults}`);
  return numberOfResults;
};

// const buildURL = (attributes, page = 1) => {
//   const baseURL = constants.autoScoutBaseURL;

//   // let brand = attributes.brandId ? '&mmvmk0=' + attributes.brandId : '';
//   // let model = attributes.modelId ? '&mmvmd0=' + attributes.modelId : '';
//   let version = attributes.version ? '&version0=' + attributes.version : '';
//   let regFrom = attributes.regFrom ? '&fregfrom=' + attributes.regFrom : '';
//   let regTo = attributes.regTo ? '&fregto=' + attributes.regTo : '';
//   let kmTo = attributes.kmTo ? '&kmto=' + attributes.kmTo : '';
//   let kmFrom = attributes.kmFrom ? '&kmfrom=' + attributes.kmFrom : '';
//   let doorFrom = attributes.doorsFrom ? '&doorfrom=' + attributes.doorsFrom : '';
//   let doorTo = attributes.doorsTo ? '&doorto=' + attributes.doorsTo : '';

//   let kwFrom = Math.round(parseInt(attributes.chFrom, 10) / 1.36, 1).toString(10);
//   let kwTo = Math.round(parseInt(attributes.chTo, 10) / 1.36, 1).toString(10);
//   let powerFrom = attributes.chFrom ? '&powerfrom=' + kwFrom : '';
//   let powerTo = attributes.chTo ? '&powerto=' + kwTo : '';

//   let body = attributes.checkedBodyCompact ? '&body=1' : '';
//   if (attributes.checkedBodyConvertible) body += '&body=2';
//   if (attributes.checkedBodyCoupe) body += '&body=3';
//   if (attributes.checkedBodySUV) body += '&body=4';
//   if (attributes.checkedBodySedan) body += '&body=6';
//   if (attributes.checkedBodySW) body += '&body=5';
//   if (
//     attributes.checkedBodyCompact &&
//     attributes.checkedBodyConvertible &&
//     attributes.checkedBodyCoupe &&
//     attributes.checkedBodySUV &&
//     attributes.checkedBodySedan &&
//     attributes.checkedBodySUV
//   )
//     body = '';

//   let fuel = attributes.checkedFuelPetrol ? '&fuel=B' : '';
//   if (attributes.checkedFuelDiesel) fuel += '&fuel=D';
//   if (attributes.checkedFuelElec) fuel += '&fuel=E';
//   if (attributes.checkedFuelElecPetrol) fuel += '&fuel=2';
//   if (attributes.checkedFuelElecDiesel) fuel += '&fuel=3';
//   if (
//     attributes.checkedFuelPetrol &&
//     attributes.checkedFuelDiesel &&
//     attributes.checkedFuelElec &&
//     attributes.checkedFuelElecDiesel &&
//     attributes.checkedFuelElecPetrol
//   )
//     fuel = '';

//   let gear = attributes.checkedTransAuto ? '&gear=A' : '';
//   if (attributes.checkedTransMan) gear += '&gear=M';
//   if (attributes.checkedTransSemi) gear += '&gear=S';
//   if (attributes.checkedTransAuto && attributes.checkedTransMan && attributes.checkedTransSemi) gear = '';

//   let sort = attributes.sorting ? '&sort=price&desc=' + (attributes.sorting === 'desc' ? '1' : '0') : '&sort=price&desc=0';

//   let other = '&atype=C';

//   // OLD VERSION
//   // return `https://www.autoscout24.com/results?${brand}${model}${ver}&mmvco=1${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}&powertype=kw&atype=C&ustate=N%2CU${sort}&page=${page}&size=20`;
//   // NEW VERSION
//   const result = `${baseURL}/${attributes.brand}/${
//     attributes.model
//   }?sort=price&desc=0&ustate=N%2CU&size=20${version}${body}${regFrom}${regTo}${fuel}${kmFrom}${kmTo}${powerFrom}${powerTo}${gear}${doorFrom}${doorTo}${sort}&page=${page}&size=20${other}`;
//   // console.log(`result: ${result}`);
//   return result;
// };

// async function getNumberOfResults(url, browserPage) {
// 	let nbTimeouts = 0;
// 	await loadPage(url);

// 	async function loadPage(url) {
// 		try {
// 			const response = await browserPage.goto(url);
// 			let status = await parseInt(response.headers().status, 10);
// 			// console.log("response status is: " + status);
// 			if (status !== 200) throw new Error("response status is " + status);
// 		} catch (error) {
// 			console.log('error loading page (timeout #' + nbTimeouts + '): ' + error);
// 			nbTimeouts++;
// 			if (nbTimeouts <= 5) {
// 				await loadPage(url);
// 			} else {
// 				return 0;
// 			}
// 		}
// 	}

// 	let numberOfResults = 0;
// 	let iterator = 0;
// 	do {
// 		if (iterator > 0) console.log(`Waiting ${iterator + 1} seconds`);
// 		await browserPage.waitFor(1000);
// 		numberOfResults = await evaluateNbOfResults(browserPage);
// 		iterator = numberOfResults > 50000 ? iterator + 1 : 100;
// 	} while (iterator <= 15);

// 	// console.log(`Number of results: ${numberOfResults}`);
// 	return numberOfResults;
// }

// async function evaluateNbOfResults(browserPage) {
// 	try {
// 		return await browserPage.evaluate(() => {
// 			let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
// 			try {
// 				let output = document.querySelectorAll(counterSelector)[0].textContent.slice(0, -7).replace(/,/g, '');
// 				return parseInt(output, 10);
// 			} catch (error) {
// 				console.log('Error getting number of results: ' + error);
// 				throw new Error('STOP');
// 			}
// 		});
// 	} catch (error) {
// 		console.log('Unknown error');
// 	}
// }

// async function processPage(url, browserPage, page = 1) {
// 	console.log('   processing page: ' + page);
// 	// make sure we wait for the page to be ready
// 	let nbResultsThisPage = await getNumberOfResults(url, browserPage);
// 	// console.log(`Number of results for page ${page}: ${nbResultsThisPage}`);

// 	let measuredData = await browserPage.evaluate(() => {
// 		let vehiclesSelector = '.cldt-summary-full-item';
// 		let vehiclesElements = Array.from(
// 			document.querySelectorAll(vehiclesSelector)
// 		);

// 		return vehiclesElements.map(vehicleElement => {
// 			let url = vehicleElement.querySelector('.cldt-summary-headline > .cldt-summary-titles > a').href.split('?')[0];

// 			let model = measureAttribute('model', vehicleElement, { numerical: false, selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-makemodel' });
// 			let version = measureAttribute('version', vehicleElement, { numerical: false, selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-version' });
// 			let price = measureAttribute('price', vehicleElement, { numerical: true, selector: '.cldt-price' });
// 			let km = measureAttribute('km', vehicleElement, { numerical: true, selector: 'li:nth-child(1)' });
// 			let { firstRegMonth, firstRegYear } = measureAttribute('firstReg', vehicleElement, { numerical: false, selector: 'li:nth-child(2)' });
// 			let power = measureAttribute('power', vehicleElement, { numerical: false, selector: 'li:nth-child(3)' });
// 			let used = measureAttribute('used', vehicleElement, { numerical: false, selector: 'li:nth-child(4)' });
// 			let prevOwners = measureAttribute('prevOwners', vehicleElement, { numerical: true, selector: 'li:nth-child(5)' });
// 			let transmissionType = measureAttribute('transmissionType', vehicleElement, { numerical: false, selector: 'li:nth-child(6)' });
// 			let fuelType = measureAttribute('fuelType', vehicleElement, { numerical: false, selector: 'li:nth-child(7)' });
// 			let country = measureAttribute('country', vehicleElement, { numerical: false, selector1: '.cldt-summary-seller-contact-country', selector2: '.cldf-summary-seller-contact-country' });
// 			let measureTimeStamp = (new Date()).getTime();

// 			return { measureTimeStamp, url, model, version, price, km, firstRegMonth, firstRegYear, power, used, prevOwners, transmissionType, fuelType, country };
// 		});

// 		function measureAttribute(name, vehicleElement, parameters) {
// 			let DOMElement = name === 'country' ?
// 				vehicleElement.querySelector(parameters.selector1) || vehicleElement.querySelector(parameters.selector2)
// 				: vehicleElement.querySelector(parameters.selector);
// 			try {
// 				let outputContent = name === 'price' ? DOMElement.childNodes[0].textContent : DOMElement.textContent;
// 				let output = parameters.numerical ? outputContent.trim().replace(/\D/g, '') : outputContent.trim();
// 				if (name === 'firstReg') {
// 					let firstRegArr = output.split('/');
// 					let firstRegMonth = firstRegArr[0] ? firstRegArr[0].replace(/\D/g, '') : '';
// 					let firstRegYear = firstRegArr[1] ? firstRegArr[1].replace(/\D/g, '') : '';
// 					return { firstRegMonth, firstRegYear };
// 				} else {
// 					return output;
// 				}
// 			} catch (error) {
// 				console.log('Warning: no content for attribute [' + name + ']');
// 				return '';
// 			}
// 		}

// 	});

// 	// Check if there is a next page
// 	let hasNextPage = nbResultsThisPage / page > 20 ? true : false;
// 	return { measuredData, hasNextPage };
// }

module.exports = {
  navigateToVehicle,
  getNbOfResults
  // getNumberOfResults,
  // processPage
};
