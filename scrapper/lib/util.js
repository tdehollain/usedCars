
const alreadyIncluded = function (element, arr) {
  let alreadyIncluded = false;
  for (let el of arr) {
    if (el.url === element.url) {
      alreadyIncluded = true;
      break;
    }
  }
  return alreadyIncluded;
}

const hasValidData = function (vehicle) {
  return (
    vehicle.title &&
    vehicle.title !== '' &&
    vehicle.brand &&
    vehicle.brand !== '' &&
    vehicle.model &&
    vehicle.model !== '' &&
    vehicle.regFrom &&
    vehicle.regFrom !== ''
  );
};

const logMemoryUsage = (prefix = '') => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `${prefix}. The script uses approximately ${Math.round(used * 100) /
    100} MB`
  );
};

const logMemoryUsageLong = (prefix = '') => {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${prefix}. ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`
    );
  }
};

const getTimeStamp = function () {
  let currentDate = new Date();
  let day = ('0' + currentDate.getDate()).slice(-2); // to always have double digit number
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // idem
  let year = currentDate.getFullYear();
  let hour = ('0' + currentDate.getHours()).slice(-2); // idem
  let minute = ('0' + currentDate.getMinutes()).slice(-2); // idem

  return `${day}/${month}/${year} - ${hour}:${minute}`;
}

module.exports = {
  alreadyIncluded,
  hasValidData,
  getTimeStamp,
  logMemoryUsage,
  logMemoryUsageLong
}