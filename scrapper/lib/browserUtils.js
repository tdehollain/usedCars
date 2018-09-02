const puppeteer = require('puppeteer');

async function loadBrowser() {
	const browser = await puppeteer.launch({ headless: true });
	const browserPage = await browser.newPage();
	// browserPage.on('console', msg => {
	// 	let logText = msg.text();
	// 	if (logText.slice(0, 32) !== "Failed to register CustomElement") {
	// 		console.log(msg.text());
	// 	}
	// });
	return browserPage;
}

module.exports = {
	loadBrowser
};