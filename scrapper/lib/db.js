const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1', apiVersion: '2012-08-10' });

const vehicleListTable = process.env.VEHICLE_LIST_TABLE;

const getVehicleList = async function() {
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

const putVehicleRecords = async function(vehicleRecords) {
  let URL = baseURL + '/vehiclerecord';
  try {
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleRecords)
    };
    let raw_response = await fetch(URL, options);
    if (raw_response.status !== 201) {
      return { err: raw_response.status + ':' + raw_response.statusText };
    }
    let res = await raw_response.json();
    if (res.success) {
      return { res };
    } else {
      return { err: res.message };
    }
  } catch (err) {
    // console.log("err: " + err);
    return { err, res: null };
  }
};

const deleteVehicleRecords = async function(vehicleTitle, month) {
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
  putVehicleRecords,
  deleteVehicleRecords
};
