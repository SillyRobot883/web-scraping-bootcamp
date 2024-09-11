import {JSDOM } from 'jsdom';

// import fs promise
import fs from 'fs/promises';

// async function getData() {
//     const url = "https://ar.wikipedia.org/wiki/%D8%AE%D8%A7%D8%B5:%D8%A5%D8%AD%D8%B5%D8%A7%D8%A1%D8%A7%D8%AA";
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }
//
//         const json = await response.json();
//         console.log(json);
//     } catch (error) {
//         console.error(error.message);
//     }
// }
// getData();

// JSON
// // JSON.parse will convert JSON string to JSON object
// // JSON.stringify will convert JSON object to JSON string
// let x = JSON.parse('{"name":"aziz", "age":21, "city":"Riyadh"}');
// console.log(x);
// let y = JSON.stringify(x);
// console.log(y);

// console.log(typeof getData().text());

// let URL = "https://ar.wikipedia.org/wiki/%D8%AE%D8%A7%D8%B5:%D8%A5%D8%AD%D8%B5%D8%A7%D8%A1%D8%A7%D8%AA";
//
// // fetch data from the URL
// let resp = await fetch(URL);
// resp = await resp.text();
//
// // convert the data to HTML
// let body = new JSDOM(resp);
//     body = body.window.document;
//
// // where are data will be stored temporarily
// let data2 = {};
//
// // read data from file to chekc if there's changes
// let readData = JSON.parse(await fs.readFile('data.json', 'utf-8'));
// console.log(readData.articles);
//
// // check if there's changes in the data
// data2 = !readData ? data2 : readData; // if readData is empty,
//
// // get the data from the website
// const articles = body.querySelector(".wikitable .mw-statistics-articles .mw-statistics-numbers").textContent;
// if(data2.articles !== articles) {
//     console.log("articles has changed");
//     data2["articles"] = articles;
// }
//
// const pages = body.querySelector(".wikitable .mw-statistics-pages .mw-statistics-numbers").textContent;
// if(data2.pages !== pages) {
//     console.log("pages has changed");
//     data2["pages"] = pages;
// }
//
// const files = body.querySelector(".wikitable .mw-statistics-files .mw-statistics-numbers").textContent;
// // check if there's changes in the data
// if(data2.files !== files) {
//     console.log("files has changed");
//     data2["files"] = files;
// }


// fs.writeFile('data.json', JSON.stringify(data2, '\n', 2), 'utf-8');




// create an object to store the data of each book
let booksObject = {};

// loop over the number of pages available in the website
for(let page = 1; page <= 50; page++) {
    let URL = `https://books.toscrape.com/catalogue/page-${page}.html`;
    let resp = await fetch(URL);
    resp = await resp.text();

    let body = new JSDOM(resp);
    body = body.window.document;

    let container = body.querySelector('ol.row');

    let bookContainer = container.querySelectorAll('li');


    console.log(`currently at page: ${page}`);

   // data model in json format to store the data of each book
    for(let book of bookContainer){
        // get book image
        let imageContainer = book.querySelector(".image_container");

        // book URL: remove "page-{page}.html/.." and add the book URL
        let bookURL = book.querySelector('a').getAttribute('href');

        // book image URL:
        let imgURL = book.querySelector('a img').getAttribute('src');
        // book rating, clsasList to get the rating as "one", "two", "three", etc
        let rating = book.querySelector('.star-rating').classList[1]

        // book title
        let title = book.querySelector('h3 a').getAttribute("title");

        // book price
        let price = book.querySelector('.product_price .price_color').textContent;

        // book availability
        let inStock = book.querySelector('.instock.availability').textContent.trim();

        // title as the key and the book object as the value
        booksObject[title] = {
            title : title,
            price : price,
            inStock : inStock,
            rating  : rating,
            imgURL : imgURL,
            URL : bookURL
        }
    }
}
// fetch data from the URL
await fs.writeFile('booksObject.json', JSON.stringify(booksObject, '\n', 4), 'utf-8');
