module.exports = async function(router, db) {

	// Get vehicle list
	router.get('/api/getVehicleList', async (req, res) => {
		let outcome = await db.getVehicleList();
		// console.log(`outcome: ${JSON.stringify(outcome)}`);
		res.json(outcome);
	});

	// Delete vehicle from list
	router.get('/api/deleteVehicle/:id', async (req, res) => {
		console.log(`id: ${req.params.id}`);
		let outcome = await db.deleteVehicle(req.params.id);
		res.json(outcome);
	});

	// Add vehicle
	router.post('/api/post', async (req, res) => {
		let vehicle = req.body;
		let outcome = await db.addVehicle(vehicle);
		res.json(outcome);
	});
}