const saveRecordsToDB = async (processedVehicles) => {
  for (let processedVehicle of processedVehicles) {
    // Save records to DB
    if (processedVehicle.success && !!processedVehicle.records) {
      // Find and remove duplicates
      const duplicates = [];
      const filteredRecords = [];
      for (let record of processedVehicle.records) {
        if (filteredRecords.find((el) => el.urlmonth === record.urlmonth)) {
          duplicates.push(record);
        } else {
          filteredRecords.push(record);
        }
      }
      if (duplicates.length > 0) {
        console.log(duplicates.length + ' DUPLICATES FOUND');
        // console.log(duplicates);
      }
      await db.putVehicleRecords({
        ...processedVehicle,
        records: filteredRecords,
      });
    }

    // Update last count in vehicle list
    await db.updateVehicle(processedVehicle);

    // Write to Scrap Log
    const { title, success, oldCount, lastCount } = processedVehicle;
    await db.writeToScrapLog(title, { success, oldCount, lastCount });
  }
  return processedVehicles;
};

export default {
  saveRecordsToDB,
};
