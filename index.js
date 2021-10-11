/* Modules */
const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();
const ora = require('ora');
const fetch = require('./lib.js');

/* Config */
const config = require('./conf.json');

// URL YouTube input
const url = process.argv[2]

// Get Artist & Song Title from user
const artiste = prompt('Artist ? ');
const songtitle = prompt('Title ? ');

// Custom cli-progress
const throbber = ora({spinner: config.spinner_type, text: config.spinner_text});
throbber.start();

crawl();


async function crawl() {

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    
    await page.goto(config.service_url)
    await page.type(config.input_el, url)
    await page.click(config.button_el)
  
    page.on('response', async (response) => {    
        try { 
            const body = await response.json();
            if (body.data.fileUrl !== null) { // Get mp3 url from final response
                let { fileUrl } = body.data
                let title = `${artiste} - ${songtitle}`
                await fetch.getMP3File(fileUrl, title, artiste, songtitle)
                throbber.succeed(config.spinner_succed)
                await browser.close()
            }
        } catch(error) {
            if (!error instanceof SyntaxError) { // JSON input body not existing
                console.log(error)
            }
        }
    })
    
}
  




