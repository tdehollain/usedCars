const fetch = require('node-fetch');
const db = process.env.VEHICLE_LIST_TABLE ? require('./lib/db') : null;
const scrapUtils = require('./lib/scrapUtils');
const vehicleUtils = require('./lib/vehicleUtils');

const MAX_RETRIES = 4;

const start = async (manualMode = false, vehiclesDefinitions) => {
  const vehicleList = await db.getVehicleList();
  const vehiclesToProcess = getVehiclesToProcess(vehicleList, manualMode, vehiclesDefinitions);
  console.log({ vehiclesToProcess });
  const nonce = await getNonce(vehiclesToProcess[0].vehicleURL);
  const processedVehicles = await processAllVehicles(vehiclesToProcess, nonce);
  await saveRecordsToDB(processedVehicles);

  return {
    success: true,
    processedVehicles,
  };
};

const getVehiclesToProcess = (vehicleList, manualMode, vehiclesDefinitions) => {
  if(manualMode) {
    return vehicleList.filter(vehicle => {
      let found = false;
      for (const vehicleToProcess of vehiclesDefinitions) {
        if (vehicleToProcess.timingDay === vehicle.timingDay && vehicleToProcess.timingHour === (vehicle.timingHour || 0)) {
          found = true;
          break;
        }
      }
      return found;
    });
  } else {
    return vehicleList.filter(vehicleUtils.filterVehiclesToProcessNow);
  }
};

const getNonce = async URL => {
  const res = await fetch(URL);
  const text = await res.text();
  const split = text.split('as24-search-funnel_main-')[1]
  const nonce = isNaN(split.slice(4,5)) ? split.slice(0, 4) : split.slice(0, 5);
  console.log('nonce:', nonce);
  return nonce;
}

const processAllVehicles = async (vehiclesToProcess, nonce) => {
  return await Promise.all(vehiclesToProcess.map(async vehicle => {
    console.log('Processing vehicle: ', vehicle.title);
    const oldCount = vehicle.lastCount;
    try {
      let { vehicleRecords, lastCount } = await processVehicle(vehicle, nonce);
      const updatedVehicle = { ...vehicle, success: true, oldCount, lastCount, lastUpdate: new Date(), records: vehicleRecords };
      return updatedVehicle;
    } catch (err) {
      console.log('ERROR: ' + err.message);
      return { ...vehicle, success: false, oldCount, lastCount: 'n/a' };
    }
  }));
}


const processVehicle = async (vehicle, nonce) => {

  const { baseURL, params } = getURL(vehicle, nonce);
  const { listings, nbResults } = await getListings(baseURL, params);
  console.log('nbListings:', nbResults);
  if(listings.length > 400) {
    console.log('More than 400 results. Abording.');
    return { vehicleRecords: null, lastCount: nbResults };
  }
  const records = getRecords(vehicle.title, listings);
  return { vehicleRecords: records, lastCount: nbResults };
};

const getURL = (vehicle, nonce) => {

  const {brand, model, version} = vehicle;
  const queryType = version ? `/ve_${version}.json?` : '.json?';
  const baseURL = 'https://www.autoscout24.com/_next/data/as24-search-funnel_main-${nonce}'
                + `/lst/${brand.replaceAll(' ', '-')}/${model.replaceAll(' ', '-')}${queryType}`;

  const params = {
    sort: 'standard',
    damaged_listing: 'exclude',
    fregfrom: vehicle.regFrom
  };
  if(vehicle.regTo) params.fregto = vehicle.regTo;
  if(vehicle.chFrom) params.powerfrom = Math.round(vehicle.chFrom * 0.73549875);
  if(vehicle.chTo) params.powerto = Math.round(vehicle.chTo * 0.73549875);
  if(vehicle.doorFrom) params.doorfrom = vehicle.doorFrom;
  if(vehicle.doorTo) params.doorto = vehicle.doorTo;

  const bodyTypes = [];
  if(vehicle.checkedBodyCompact) bodyTypes.push(1);
  if(vehicle.checkedBodyConvertible) bodyTypes.push(2);
  if(vehicle.checkedBodyCoupe) bodyTypes.push(3);
  if(vehicle.checkedBodySUV) bodyTypes.push(4);
  if(vehicle.checkedBodySW) bodyTypes.push(5);
  if(vehicle.checkedBodySedan) bodyTypes.push(6);
  if(bodyTypes.length < 6) params.body = bodyTypes;

  const fuelTypes = [];
  if(vehicle.checkedFuelPetrol) fuelTypes.push('B');
  if(vehicle.checkedFuelDiesel) fuelTypes.push('D');
  if(vehicle.checkedFuelElec) fuelTypes.push('E');
  if(vehicle.checkedFuelElecPetrol) fuelTypes.push('2');
  if(vehicle.checkedFuelElecDiesel) fuelTypes.push('3');
  if(fuelTypes.length < 5) params.fuel = fuelTypes;

  const transTypes = [];
  if(vehicle.checkedTransMan) transTypes.push('M');
  if(vehicle.checkedTransSemi) transTypes.push('S');
  if(vehicle.checkedTransAuto) transTypes.push('A');
  if(transTypes.length < 3) params.gear = transTypes;

  return { baseURL, params };
};

const getListings = async (baseURL, params) => {
  let page = 1;
  let nbResults = 1;
  let pageCount;
  let listings = [];
  do {
    const URLParamsStr = (new URLSearchParams(page === 1 ? params : {...params, page})).toString();
    const finalURL = baseURL + URLParamsStr;
    const page_rawRes = await fetch(finalURL);
    const page_Res = (await page_rawRes.json()).pageProps;
    if(page === 1) {
      console.log(finalURL);
      nbResults = page_Res.numberOfResults;
      pageCount = Math.ceil(nbResults/20);
      console.log({nbResults});
      if(nbResults >= 400) {
        return { listing: null, nbResults };
      }
    }
    listings = [...listings, ...page_Res.listings];
    page += 1;
  } while (page <= pageCount);
  return { listings, nbResults };
};

const getRecords = (title, listings) => {
  const records = listings.map(item => {
    // console.log(JSON.stringify(item));
    const yearmonth = parseInt(new Date().getFullYear() + ('0' + (new Date().getMonth() + 1)).slice(-2));
    const vehicleRecordURL = `https://www.autoscout24.com${item.url}`;
    return {
      title,
      urlmonth: `${vehicleRecordURL}-${yearmonth}`,
      country: item.location.countryCode,
      firstRegMonth: item.tracking.firstRegistration.slice(0,2),
      firstRegYear: item.tracking.firstRegistration.slice(3),
      fuelType: item.tracking.fuelType,
      km: item.tracking.mileage,
      measureDate: new Date().getTime(),
      model: item.vehicle.model,
      power: item.vehicleDetails[2],
      prevOwners: typeof(item.vehicleDetails[4]) === 'string' ? item.vehicleDetails[4].slice(0,1) : null,
      price: item.tracking.price,
      transmissionType: typeof(item.vehicleDetails[5]) === 'string' ? item.vehicleDetails[5].slice(0,1) : null,
      url: vehicleRecordURL,
      used: item.vehicleDetails[3],
      version: item.vehicle.modelVersionInput,
      yearmonth,
    };
  });

  return records;
};

const saveRecordsToDB = async processedVehicles => {


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

module.exports = {
  start
};
