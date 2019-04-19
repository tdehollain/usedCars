
const getTiming = allVehicles => {

	let output = []
	for(let i=0; i<=27; i++) {
		for(let j=0; j<=23; j++) {
			output.push({ day: i+1, hour: j, count: 0 });
		}
	}

	for(vehicle of allVehicles) {
		for(const [index, value] of output.entries()) {
			if(value.day === vehicle.timingDay && value.hour === vehicle.timingHour) {
				output[index].count += vehicle.lastCount || 10;
			}
		}
	}
	
	output.sort((a, b) => {
		if(a.count === b.count) {
			if(a.day === b.day) {
				return a.hour - b.hour;
			} else {
				return a.day - b.day;
			}
		} else {
			return a.count - b.count;
		}
	});

	return { timingDay: output[0].day, timingHour: output[0].hour };
}

module.exports = {
	getTiming
}