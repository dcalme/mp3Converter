/* Modules */
const puppeteer = require('puppeteer');
const fetch = require('./lib.js');
const ora = require('ora');

/* Config */
const config = require('./conf.json');


// Custom cli-progress
const throbber = ora({spinner: config.spinner_type, text: config.spinner_text});
throbber.start();

// URL YouTube input
const url = process.argv[2]


async function crawl() {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    
    await page.goto(config.service_url);
    await page.type(config.input_el, url);
    await page.click(config.button_el);
  
    page.on('response', async (response) => {    
        try { 
            const body = await response.json();

            if (body.data.fileUrl !== null) { // Get mp3 url from final response
                let {title, fileUrl} = body.data;
                await fetch.getMP3File(fileUrl, title);
                throbber.succeed(config.spinner_succed);
                console.log(title);
                await browser.close();
            }

        } catch(error) {
            if (!error instanceof SyntaxError) { // JSON input body not existing
                console.log(error);
            }
        }
    }); 
}
  
crawl();



