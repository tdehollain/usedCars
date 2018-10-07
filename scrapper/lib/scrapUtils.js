

async function getNumberOfResults(url, browserPage) {
	let nbTimeouts = 0;
	await loadPage(url);

	async function loadPage(url) {
		try {
			const response = await browserPage.goto(url);
			let status = await parseInt(response.headers().status, 10);
			// console.log("response status is: " + status);
			if (status !== 200) throw new Error("response status is " + status);
		} catch (error) {
			console.log('error loading page (timeout #' + nbTimeouts + '): ' + error);
			nbTimeouts++;
			if (nbTimeouts <= 5) {
				await loadPage(url);
			} else {
				return 0;
			}
		}
	}

	let numberOfResults = 0;
	let iterator = 0;
	do {
		if (iterator > 0) console.log(`Waiting ${iterator + 1} seconds`);
		await browserPage.waitFor(1000);
		numberOfResults = await evaluateNbOfResults(browserPage);
		iterator = numberOfResults > 50000 ? iterator + 1 : 100;
	} while (iterator <= 15);

	// console.log(`Number of results: ${numberOfResults}`);
	return numberOfResults;
}

async function evaluateNbOfResults(browserPage) {
	try {
		return await browserPage.evaluate(() => {
			let counterSelector = '.cl-listings-summary .cl-filters-summary-counter';
			try {
				let output = document.querySelectorAll(counterSelector)[0].textContent.slice(0, -8).replace(/,/g, '');
				return parseInt(output, 10);
			} catch (error) {
				console.log('Error getting number of results: ' + error);
				throw new Error('STOP');
			}
		});
	} catch (error) {
		console.log('Unknown error');
	}
}


async function processPage(url, browserPage, page = 1) {
	console.log('   processing page: ' + page);
	// make sure we wait for the page to be ready
	let nbResultsThisPage = await getNumberOfResults(url, browserPage);
	// console.log(`Number of results for page ${page}: ${nbResultsThisPage}`);

	let measuredData = await browserPage.evaluate(() => {
		let vehiclesSelector = '.cldt-summary-full-item';
		let vehiclesElements = Array.from(
			document.querySelectorAll(vehiclesSelector)
		);

		return vehiclesElements.map(vehicleElement => {
			let url = vehicleElement.querySelector('.cldt-summary-headline > .cldt-summary-titles > a').href.split('?')[0];

			let model = measureAttribute('model', vehicleElement, { numerical: false, selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-makemodel' });
			let version = measureAttribute('version', vehicleElement, { numerical: false, selector: '.cldt-summary-headline > .cldt-summary-titles > a > .cldt-summary-title > .cldt-summary-version' });
			let price = measureAttribute('price', vehicleElement, { numerical: true, selector: '.cldt-price' });
			let km = measureAttribute('km', vehicleElement, { numerical: true, selector: 'li:nth-child(1)' });
			let { firstRegMonth, firstRegYear } = measureAttribute('firstReg', vehicleElement, { numerical: false, selector: 'li:nth-child(2)' });
			let power = measureAttribute('power', vehicleElement, { numerical: false, selector: 'li:nth-child(3)' });
			let used = measureAttribute('used', vehicleElement, { numerical: false, selector: 'li:nth-child(4)' });
			let prevOwners = measureAttribute('prevOwners', vehicleElement, { numerical: true, selector: 'li:nth-child(5)' });
			let transmissionType = measureAttribute('transmissionType', vehicleElement, { numerical: false, selector: 'li:nth-child(6)' });
			let fuelType = measureAttribute('fuelType', vehicleElement, { numerical: false, selector: 'li:nth-child(7)' });
			let country = measureAttribute('country', vehicleElement, { numerical: false, selector1: '.cldt-summary-seller-contact-country', selector2: '.cldf-summary-seller-contact-country' });
			let measureTimeStamp = (new Date()).getTime();

			return { measureTimeStamp, url, model, version, price, km, firstRegMonth, firstRegYear, power, used, prevOwners, transmissionType, fuelType, country };
		});

		function measureAttribute(name, vehicleElement, parameters) {
			let DOMElement = name === 'country' ?
				vehicleElement.querySelector(parameters.selector1) || vehicleElement.querySelector(parameters.selector2)
				: vehicleElement.querySelector(parameters.selector);
			try {
				let outputContent = name === 'price' ? DOMElement.childNodes[0].textContent : DOMElement.textContent;
				let output = parameters.numerical ? outputContent.trim().replace(/\D/g, '') : outputContent.trim();
				if (name === 'firstReg') {
					let firstRegArr = output.split('/');
					let firstRegMonth = firstRegArr[0] ? firstRegArr[0].replace(/\D/g, '') : '';
					let firstRegYear = firstRegArr[1] ? firstRegArr[1].replace(/\D/g, '') : '';
					return { firstRegMonth, firstRegYear };
				} else {
					return output;
				}
			} catch (error) {
				console.log('Warning: no content for attribute [' + name + ']');
				return '';
			}
		}

	});

	// Check if there is a next page
	let hasNextPage = nbResultsThisPage / page > 20 ? true : false;
	return { measuredData, hasNextPage };
}


module.exports = {
	getNumberOfResults,
	processPage
}