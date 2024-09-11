import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function getData() {
    const URL = "https://quotes.toscrape.com/scroll";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage(); // open a new page
    await page.goto(URL); // go to the URL


    let quotes = []; // store the quotes
    let previousHeight;


    while (true) {
        const newQuotes = await page.evaluate(() => { // evaluate means to run the code in the browser
            const quoteElements = document.querySelectorAll('.quote'); // select all the quotes
            const quotes = []; // why are we defining quotes again? because this is a new scope
            quoteElements.forEach(quote => {
                const text = quote.querySelector('.text').textContent;
                const author = quote.querySelector('.author').textContent;
                quotes.push({ text, author });
            });
            window.scrollTo(0, document.body.scrollHeight); // scroll to the bottom of the page until you can't scroll anymore
            return quotes;
        });

        quotes = quotes.concat(newQuotes); // add the new quotes to the quotes array

        // Check if the height of the page hasn't changed, if it hasn't then break the loop, else continue
        const newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === previousHeight) break;
        previousHeight = newHeight;

        // Use setTimeout to wait for new quotes to load
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Write the quotes to a file
    await fs.writeFile('quotes.json', JSON.stringify(quotes, null, 4), 'utf-8');
    await browser.close();
}

getData();