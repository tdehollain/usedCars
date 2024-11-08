const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

const getVehicleTiming = async () => {
  let { err, list } = await db.getVehicleList(VEHICLE_LIST_TABLE);
  if (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }

  let output = [];
  for (let i = 0; i <= 27; i++) {
    for (let j = 0; j <= 23; j++) {
      output.push({ day: i + 1, hour: j, count: 0 });
    }
  }

  console.log('ALL VEHICLES:', {
    allVehicles: list.map((el) => ({
      timingDay: el.timingDay,
      timingHour: el.timingHour,
      count: el.lastCount,
    })),
  });

  for (const vehicle of allVehicles) {
    for (const [index, value] of output.entries()) {
      if (
        value.day === vehicle.timingDay &&
        value.hour === (vehicle.timingHour || 0)
      ) {
        // const count = vehicle.lastCount === 'n/a' ? 10 : vehicle.lastCount;
        output[index].count += 1;
      }
    }
  }

  console.log('OUTPUT UNSORTED', { output });

  output.sort((a, b) => {
    if (a.count === b.count) {
      if (a.day === b.day) {
        return a.hour - b.hour;
      } else {
        return a.day - b.day;
      }
    } else {
      return a.count - b.count;
    }
  });
  console.log('OUTPUT SORTED', { output });

  const res = { timingDay: output[0].day, timingHour: output[0].hour };
  console.log('RES', res);

  return res;
};

exports.handler = async (event, context, callback) => {
  return await getVehicleTiming();
};
