const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function loginToGitHub() {
    // Load credentials
    const credentials = JSON.parse(await fs.readFile('credentials.json', 'utf8'));

    // Launch browser
    const browser = await puppeteer.launch({ headless: false }); // Running non-headless to see the browser
    const page = await browser.newPage();

    // Navigate to login page
    await page.goto('https://github.com/login');

    // Enter credentials
    await page.type('#login_field', credentials.username);
    await page.type('#password', credentials.password);

    // Submit form
    await page.click('[name="commit"]');

    // Wait for navigation after the login form submission
    await page.waitForNavigation();


    // ***

    // Ask user to manually enter 2FA
    console.log('Please enter your 2FA code.');

    // Wait for the element with class "logged-in" to appear
    await page.waitForSelector('.logged-in', {
        timeout: 60000 // waits up to 60 seconds
    });

    console.log('Login and 2FA verification successful, saving cookies.');


    // Get cookies
    const cookies = await page.cookies();
    await fs.writeFile('cookies.json', JSON.stringify(cookies, null, 2));

    // ***

    // Close browser
    await browser.close();
}

loginToGitHub().catch(console.error);
