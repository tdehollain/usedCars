const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10', convertEmptyValues: true });

const vehicleListTable = process.env.VEHICLE_LIST_TABLE;
const vehicleRecordsTable = process.env.VEHICLE_RECORDS_TABLE;
const scrapLogTable = process.env.SCRAP_LOG_TABLE;

//==================================
//=====   Vehicle List Table   =====
//==================================

const getVehicleList = async function () {
  let params = {
    TableName: vehicleListTable
  };
  try {
    let rawResponse = await ddb.scan(params).promise();
    vehicleList = rawResponse.Items;
    return vehicleList;
  } catch (err) {
    throw new Error('Error getting vehicle list: ' + err.message);
  }
};

const updateVehicle = async function (vehicle) {
  let vehicleWithoutRecords = JSON.parse(JSON.stringify(vehicle));
  delete vehicleWithoutRecords.records;

  let params = {
    TableName: vehicleListTable,
    Item: vehicleWithoutRecords
  };

  try {
    await ddb.put(params).promise();
    return;
  } catch (err) {
    throw new Error(`Error updating vehicle "${vehicleWithoutRecords.title}": ${err.message}`);
  }
};

//=====================================
//=====   Vehicle Records Table   =====
//=====================================

const putVehicleRecords = async vehicle => {
  let { err, res } = await batchWriteItems(vehicle.records);
  if (err) {
    throw new Error(`Error saving records for vehicle "${vehicle.title}": ${err}`);
  } else {
    return res;
  }
};

const batchWriteItems = async data => {
  // Split the data into the number of concurrent processes
  // Only do it if there are at least 1000 records
  // if (data.length >= 500) {
  //   let nbConcurrentProcesses = 10;
  //   let nbItemsPerProcess = Math.ceil(data.length / nbConcurrentProcesses);
  //   let processPromises = [];
  //   for (let i = 0; i < nbConcurrentProcesses; i++) {
  //     let currentProcessItems = data.slice(i * nbItemsPerProcess, (i + 1) * nbItemsPerProcess);
  //     let currentProcessPromise = batchWriteItems_process(currentProcessItems);
  //     processPromises.push(currentProcessPromise);
  //   }

  //   let processesOutput = await Promise.all(processPromises);
  //   // if at least 1 error return then error for the whole batch
  //   let { err, res } = processesOutput.reduce(
  //     (acc, val) => {
  //       if (acc.err) {
  //         return acc;
  //       } else if (val.err) {
  //         return val;
  //       } else {
  //         return {
  //           err: null,
  //           res: {
  //             success: true,
  //             nbItemsInserted: acc.res.nbItemsInserted + val.res.nbItemsInserted,
  //             nbRetries: acc.res.nbRetries + val.res.nbRetries
  //           }
  //         };
  //       }
  //     },
  //     { err: null, res: { success: true, nbItemsInserted: 0, nbRetries: 0 } }
  //   );

  //   return { err, res };
  // } else {
  let { err, res } = await batchWriteItems_process(data);
  return { err, res };
  // }
};

const batchWriteItems_process = async data => {
  // console.log(JSON.stringify(data));
  // split data in batches of 25 items
  let batchSize = 25;
  let nbBatches = Math.ceil(data.length / batchSize);
  let totalRetries = 0;

  for (let i = 0; i < nbBatches; i++) {
    let currentBatch = data.slice(i * batchSize, (i + 1) * batchSize);
    let currentBatchItems = currentBatch.map(el => {
      return {
        PutRequest: {
          // Item: stripEmptyStringAttributes(stripEmptyAttributes(el))
          Item: el
        }
      };
    });
    // console.log(JSON.stringify(currentBatchItems));
    let reqParams = {
      RequestItems: {
        [vehicleRecordsTable]: currentBatchItems
      }
    };

    let res;
    let nbRetries = -1;
    // console.log(JSON.stringify(reqParams));
    do {
      res = await ddb.batchWrite(reqParams).promise();
      // if (Object.entries(res.UnprocessedItems).length > 0) {
      // console.log(JSON.stringify(res));
      // }
      nbRetries++;
      // Pause 0.5s if too many retries
      if (nbRetries > 0 && nbRetries % 10 === 0) {
        await sleep(500);
      }
    } while (Object.entries(res.UnprocessedItems).length !== 0 && nbRetries <= 10);

    totalRetries += nbRetries;
    if (nbRetries > 0) console.log(`Batch #${i + 1}: ${nbRetries} retries.`);

    if (Object.entries(res.UnprocessedItems).length !== 0) {
      return { err: `Error writing batch of data: still some UnprocessedItems after ${nbRetries} retries` };
    }
  }
  return { err: null, res: { success: true, nbItemsInserted: data.length, nbRetries: totalRetries } };
};

//================================
//=====   Scrap Logs Table   =====
//================================

const getScrapLogs = async countHours => {
  const timestampNow = new Date().getTime();
  const millisecondsInCountHours = (countHours + 1) * 60 * 60 * 1000; // adding 1hr to include the log of exactly countHours ago
  const timestampBefore = timestampNow - millisecondsInCountHours;

  let params = {
    TableName: scrapLogTable
  };
  try {
    let rawResponse = await ddb.scan(params).promise();
    logs = rawResponse.Items;
    logs = logs.filter(el => el.scrapDate > timestampBefore);
    logs = logs.sort((a, b) => a.scrapDate - b.scrapDate);
    return logs;
  } catch (err) {
    throw new Error('Error getting scrap logs: ' + err.message);
  }
};

const writeToScrapLog = async (title, scrapDetails) => {
  let params = {
    TableName: scrapLogTable,
    Item: { title, scrapDate: new Date().getTime(), log: scrapDetails }
  };
  try {
    await ddb.put(params).promise();
    return;
  } catch (err) {
    throw new Error(`Error writing to Scrap Log for vehicle "${title}": ${err.message}`);
  }
};

const sleep = waitTimeInMs => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

const deleteVehicleRecords = async function (vehicleTitle, month) {
  let URL = baseURL + '/vehiclerecord';
  try {
    let options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vehicleTitle, month })
    };
    let raw_response = await fetch(URL, options);
    let res = await raw_response.json();
    if (res.success) {
      return { err: null, res };
    } else {
      return { err: res.message, res: null };
    }
  } catch (err) {
    console.log('err: ' + err);
    return { err, res: null };
  }
};

module.exports = {
  getVehicleList,
  updateVehicle,
  putVehicleRecords,
  getScrapLogs,
  writeToScrapLog,
  deleteVehicleRecords
};
