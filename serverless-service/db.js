const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const addVehicle = async (vehicle, tableName) => {
  let tableParams = {
    TableName: tableName,
    Item: stripEmptyAttributes(vehicle)
  };

  try {
    let res = await ddb.put(tableParams).promise();
    return { res };
  } catch (err) {
    return { err };
  }
};

const getVehicleList = async tableName => {
  let tableParams = { TableName: tableName };

  try {
    let res = await ddb.scan(tableParams).promise();
    let list = res.Items;
    // Sort list by title
    let sortedList = list.sort((a, b) => {
      return b.Title - a.Title;
    });
    return { err: null, list: sortedList };
  } catch (err) {
    return { err };
  }
};

const deleteVehicle = async (vehicleTitle, tableName) => {
  let tableParams = {
    TableName: tableName,
    Key: {
      title: vehicleTitle
    }
  };

  try {
    let res = await ddb.delete(tableParams).promise();
    return { err: null, res };
  } catch (err) {
    return { err };
  }
};

const putVehicleRecords = async (vehicleRecords, tableName) => {
  let iter = 0;
  for (let vehicleRecord of vehicleRecords) {
    let tic = new Date().getTime();
    let measureTimeStamp = parseInt(vehicleRecord.measureTimeStamp, 10);
    let month = buildTimeStamp(measureTimeStamp);
    let item = { ...vehicleRecord, measureTimeStamp, month };
    // remove empty attributes in the objects of the vehicles array
    item = stripEmptyAttributes(item);

    let tableParams = {
      TableName: tableName,
      Item: item
    };

    try {
      let res = await ddb.put(tableParams).promise();

      let toc = new Date().getTime();
      console.log('time elapsed: ' + (toc - tic) + 'ms');
      iter++;
    } catch (err) {
      return { success: false, err };
    }
  }
  return { success: true, count: iter };
};

const stripEmptyAttributes = obj => {
  let newObj = {};
  Object.keys(obj).forEach(prop => {
    if (obj[prop]) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

const buildTimeStamp = measureTimeStamp => {
  let measureDate = new Date(measureTimeStamp);
  let measureYear = measureDate.getFullYear();
  let measureMonth = measureDate.getMonth() + 1;
  return measureYear.toString() + '-' + measureMonth.toString();
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = {
  getVehicleList,
  addVehicle,
  deleteVehicle,
  putVehicleRecords
};
