const { time } = require('console');
const { timeout } = require('puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function starAndOrganizeRepositories() {
    const credentials = JSON.parse(await fs.readFile('credentials.json', 'utf8'));
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to login page
    await page.goto('https://github.com/login');

    await page.type('#login_field', credentials.username);
    await page.type('#password', credentials.password);

    // Submit form
    await page.click('[name="commit"]');

    // Wait for navigation after the login form submission
    await page.waitForNavigation();

    // Load cookies to log in


    // UNCOMMENT THIS IF YOU HAVE TWO FACTOR AUTHENTICATION ENABLED
    // YOU HAVE TO RUN getCookies.js FIRST TO GET THE COOKIES

    // const cookiesString = await fs.readFile('cookies.json');
    // const cookies = JSON.parse(cookiesString);
    // await page.setCookie(...cookies);
    

    // List of repositories to star
    const repos = [
        'cheeriojs/cheerio',
        'axios/axios',
        'puppeteer/puppeteer'
    ];

    for (const repo of repos) {
        const url = `https://github.com/${repo}`;
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.click("button[aria-label^='Star this repository']"); // Adjust if GitHub changes the selector
        console.log(`Starred ${repo}`);
    }

    // Navigate to "Your lists" page to create a new list
    await page.goto(`https://github.com/${credentials.username}`, { waitUntil: 'networkidle0' });
    await page.click('a[id="stars-tab"]', { waitUntil: 'networkidle0' }); // Adjust if GitHub changes the selector
    await page.waitForSelector("summary.btn-primary.btn", { visible: true });
    await page.click("summary.btn-primary.btn", { waitUntil: 'networkidle0' });
    await page.type('input[name="user_list[name]"]', 'Node Libraries', { delay: 10});
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.keyboard.press('Enter', waitUntil='networkidle0');
    await new Promise(resolve => setTimeout(resolve, 2000));




    for (const repo of repos) {
        const url = `https://github.com/${repo}`;
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.click('summary[aria-label="Add this repository to a list"]'); // Adjust if GitHub changes the selector
        await page.waitForSelector("label.d-flex", { visible: true });
        await page.click("label.d-flex"); // Adjust if GitHub changes the selector
        await page.keyboard.press('Escape', waitUntil='networkidle0');

        

    }
    const uurl = `https://github.com/stars/${credentials.username}/lists/node-libraries`;
    await page.goto(uurl, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));




    // Close browser
    await browser.close();
}

starAndOrganizeRepositories().catch(console.error);
