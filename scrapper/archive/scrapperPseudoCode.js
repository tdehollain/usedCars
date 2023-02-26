// Requires

// 1. Start
// 1.1 get list of vehicles to track; vehicleFullList

// 2. For each vehicle in vehicleFullList: processVehicle
// 2.1 Check if vehicle has valid data: needs to have: title, brand, model and firstRegistrationFrom
// 2.2 Check if vehicle needs to be processed
// 2.2.1 ...how to do this properly? 
// 2.3.1 If vehicle needs to be processed, get the number of pages for this vehicle: getNumberOfPages
// 2.3.2 If nbPages < 20: for each page: processPage
// 2.3.3 Else: query by year:
// 2.4.1 for each year between firstRegistrationFrom and firstRegistrationTo (OR current year): getNumberOfPages
// 2.4.2 If nbPage < 20: for each page: processPage
// 2.4.3 Else: query by year and mileage band
// 2.5.1 for each mileage band: getNumberOfPages
// 2.5.2 If nbPage < 20: for each page: processPage
// 2.5.3 Else If nbPages > 40: skip vehicle
// 2.6.1 Else:
// 2.6.1.1 for each mileage band and with ascending price: processPage
// 2.6.1.2 for each mileage band and with descending price: processPage
