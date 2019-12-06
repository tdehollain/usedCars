// const util = require('./util');
const constants = require('./constants');

const logProgress = false;

const navigateToVehicle = async (vehicle, browserPage) => {
  await browserPage.goto(constants.autoScoutBaseURL);

  //===========================
  //=====   Brand Input   =====
  //===========================
  if (logProgress) console.log('Starting Brand Input');
  const brandInputSelector = `div[data-test='make0'] input`;
  await checkIfPageIsLoaded(browserPage, brandInputSelector);
  await browserPage.waitForSelector(brandInputSelector);
  await browserPage.click(brandInputSelector);

  await browserPage.type(brandInputSelector, vehicle.brand);
  // check if brand is not listed
  const firstBrand = await browserPage.evaluate(
    () => document.querySelectorAll(`div[data-test='make0'] .react-autocomplete__list--visible li`)[0].textContent
  );
  if (firstBrand === 'Unknown make') throw new Error(`Error navigating to vehicle "${vehicle.title}": brand not listed`);

  const brandValueSelector = `div[data-test='make0'] .as24-grouped-suggestions-list > div:nth-child(1) > li`;
  await browserPage.waitForSelector(brandValueSelector);
  await browserPage.click(brandValueSelector);
  if (logProgress) console.log('Completed Brand Input');

  //===========================
  //=====   Model Input   =====
  //===========================
  if (logProgress) console.log('Starting Model Input');
  const modelInputSelector = `div[data-test='modelmodelline0'] input`;
  await checkIfPageIsLoaded(browserPage, modelInputSelector);
  await browserPage.waitForSelector(modelInputSelector);
  await browserPage.click(modelInputSelector);

  await browserPage.type(modelInputSelector, vehicle.model);
  const modelSelector = `div[data-test='modelmodelline0'] .react-autocomplete__list--visible li`;

  // Array of models in the filtered list
  await browserPage.waitForSelector(modelSelector);
  const filteredModels = await browserPage.$$(modelSelector);

  let filteredModelNames = [];
  let modelElementHandle;
  for (const elHandle of filteredModels) {
    const modelNameHandle = await elHandle.getProperty('textContent');
    const modelName = await modelNameHandle.jsonValue();
    if (modelName.toLowerCase() === vehicle.model.toLowerCase()) modelElementHandle = elHandle;
    filteredModelNames.push(modelName);
  }

  // check if model is not listed
  if (filteredModelNames[0] === 'Unknown model') throw new Error(`Error navigating to vehicle "${vehicle.title}": model not listed`);

  await modelElementHandle.click();

  if (logProgress) console.log('Completed Model Input');

  //=============================
  //=====   Version Input   =====
  //=============================
  if (logProgress) console.log('Starting Model Input');
  if (vehicle.version) {
    const versionInputSelector = `div[data-test='version0'] input`;
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
    const bodyTypeInputSelector = `span.cl-filter-bodytype > div.as24-custom-dropdown`;
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

  //=========================================
  //=====   Reg From and Reg To Input   =====
  //=========================================
  const inputReg = async (browserPage, options) => {
    const { type, value } = options;
    const regInputSelector = `span[data-test='${type}']`;
    await browserPage.waitForSelector(regInputSelector + ' input');
    await browserPage.click(regInputSelector + ' input');

    await browserPage.type(regInputSelector + ' input', value.toString());
    const regValueSelector = regInputSelector + ` .react-autocomplete__list--visible > div:nth-child(1) > li`;
    await browserPage.waitForSelector(regValueSelector);
    await browserPage.click(regValueSelector);
  };

  if (logProgress) console.log('Starting Reg From Input');
  if (vehicle.regFrom) await inputReg(browserPage, { type: 'reg-from', value: vehicle.regFrom });
  if (logProgress) console.log('Completed Reg From Input');

  if (logProgress) console.log('Starting Reg To Input');
  if (vehicle.regTo) await inputReg(browserPage, { type: 'reg-to', value: vehicle.regTo });
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
    const fuelTypeInputSelector = `div[data-test='fueltype'] > .as24-custom-dropdown`;
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

  //=========================================
  //=====   km From and km To Input   =====
  //=========================================
  const inputKm = async (browserPage, options) => {
    const { type, value } = options;
    const regInputSelector = `select[data-test='${type}']`;
    await browserPage.waitForSelector(regInputSelector);
    await browserPage.select(regInputSelector, value.toString());
  };

  if (logProgress) console.log('Starting Km From Input');
  if (vehicle.kmFrom) await inputKm(browserPage, { type: 'km-from', value: vehicle.kmFrom });
  if (logProgress) console.log('Completed Km From Input');

  if (logProgress) console.log('Starting Km To Input');
  if (vehicle.kmTo) await inputKm(browserPage, { type: 'km-to', value: vehicle.kmTo });
  if (logProgress) console.log('Completed Km To Input');

  //================================
  //=====   Power From Input   =====
  //================================
  const inputPower = async (browserPage, options) => {
    const { type, value } = options;
    // Set power type to ch
    const powerTypeSelector = '.cl-power-type > select';
    await browserPage.waitForSelector(powerTypeSelector);
    let selectedPowerType = await browserPage.evaluate(() => document.querySelectorAll('.cl-power-type > select')[0].value);
    if (selectedPowerType !== 'hp') await browserPage.select(powerTypeSelector, 'hp');

    const chFromInputSelector = `.cl-power-group > .sc-input-group > div:nth-child(${type === 'power-from' ? 1 : 2}) > input`;
    await browserPage.waitForSelector(chFromInputSelector);
    await browserPage.click(chFromInputSelector);
    await browserPage.type(chFromInputSelector, value.toString());
  };

  if (logProgress) console.log('Starting Power From Input');
  if (vehicle.chFrom) await inputPower(browserPage, { type: 'power-from', value: vehicle.chFrom });
  if (logProgress) console.log('Completed Power From Input');

  if (logProgress) console.log('Starting Power To Input');
  if (vehicle.chTo) await inputPower(browserPage, { type: 'power-to', value: vehicle.chTo });
  if (logProgress) console.log('Completed Power To Input');

  //===============================
  //=====   Gear Type Input   =====
  //===============================
  if (logProgress) console.log('Starting Trans Type Input');
  if (vehicle.checkedTransAuto && vehicle.checkedTransMan && vehicle.checkedTransSemi) {
    // Do nothing if all trans types are selected
  } else {
    const transTypeInputSelector = `div[data-test='gears'] > .as24-custom-dropdown`;
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
      const doorsInputSelector = '.cl-doors-filter > .cl-filter-element > .sc-input-group-radio > label:nth-child(4)';
      await browserPage.waitForSelector(doorsInputSelector);
      await browserPage.click(doorsInputSelector);
    } else if (vehicle.doorsFrom === 4 && vehicle.doorsTo === 5) {
      const doorsInputSelector = '.cl-doors-filter > .cl-filter-element > .sc-input-group-radio > label:nth-child(6)';
      await browserPage.waitForSelector(doorsInputSelector);
      await browserPage.click(doorsInputSelector);
    }
    if (logProgress) console.log('Completed Doors Input');
  }

  //=============================
  //=====   Sorting Input   =====
  //=============================
  if (vehicle.sorting) {
    if (logProgress) console.log('Starting Sorting Input');
    // check if current sorting needs to be changed
    const currentSorting = browserPage.evaluate(
      () => document.querySelectorAll(`.cl-filters-summary__sorting > div > span.sc-link`)[0].textContent
    );
    if (currentSorting !== vehicle.sorting) {
      const sortingInputSelector = `.cl-filters-summary__sorting > div > span.sc-link`;
      await browserPage.waitForSelector(sortingInputSelector);
      await browserPage.click(sortingInputSelector);
      const itemNumber = vehicle.sorting === `Price ascending` ? 1 : 2;
      const sortingInputValueSelector = `.cl-filters-summary__sorting #sortKey > li:nth-child(${itemNumber})`;
      await browserPage.waitForSelector(sortingInputValueSelector);
      await browserPage.click(sortingInputValueSelector);
      // await browserPage.waitFor(5000);
    }

    if (logProgress) console.log('Completed Sorting Input');
  }

  //========================
  //=====   FINALIZE   =====
  //========================
  let numberOfResults = await getNbOfResults(browserPage);
  return numberOfResults;
};

const getNbOfResults = async browserPage => {
  // Check if number of results is present
  try {
    await browserPage.waitForSelector('.cl-listings-summary .cl-filters-summary-counter', { timeout: 5000 });
    let numberOfResults = await browserPage.evaluate(() => {
      let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
      let output = document.querySelectorAll(counterSelector)[0].textContent.replace(/\D/g, '');
      return output;
    });
    return numberOfResults;
  } catch (error) {
    // Not present
    // console.log('Not present');
    return 0;
  }
};

const goToNextPage = async browserPage => {
  const nextButtonSelector = '.sc-pagination .next-page > a';
  await browserPage.waitForSelector(nextButtonSelector);
  await browserPage.click(nextButtonSelector);
};

const hasNextPage = async browserPage => {
  const hasNextPage =
    (await browserPage.evaluate(() => document.querySelectorAll('.sc-pagination .next-page > a')[0].href)) === '' ? false : true;

  return hasNextPage;
};

const checkIfPageIsLoaded = async (browserPage, relevantSelector, retryNumber = 0) => {
  try {
    await browserPage.waitForSelector(relevantSelector);
  } catch (err) {
    if (retryNumber < constants.maxNumberOfTriesReload) {
      console.log(`Page didn't load properly. Reloading.`);
      await browserPage.reload();
      await checkIfPageIsLoaded(browserPage, relevantSelector, retryNumber + 1);
    }
  }
};

module.exports = {
  navigateToVehicle,
  getNbOfResults,
  goToNextPage,
  hasNextPage
};
