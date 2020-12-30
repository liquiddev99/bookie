const puppeteer = require("puppeteer");
const Book = require("../models/Book");

const getLinksGenre = async (page, url) => {
  await page.goto(url);
  console.log("Fahasa loaded");
  let linksGenre = await page.$$eval(
    "ul.nav.navbar-nav.verticalmenu > li:first-child div.dropdown-menu-inner div.row:not(:last-child) div.mega-col-inner ul.nav-links li:not(:last-child) > a",
    (link) => link.map((a) => a.href)
  );
  linksGenre = linksGenre.slice(0, 32);
  linksGenre.splice(26, 1);
  console.log(linksGenre);
  return linksGenre;
};

const getLinks = async (page, linkGenre) => {
  //page.setDefaultTimeout(0);
  await page.goto(linkGenre, { waitUntil: "networkidle2" });
  console.log("page loaded");
  const links = await page.$$eval(
    "h2.product-name-no-ellipsis.p-name-list > a",
    (link) => link.map((a) => a.href)
  );
  //await Promise.all([
  //  await page.waitForNavigation(),
  //  await page.click("div.icon-turn-right")
  //]);

  //await page.click("div.icon-turn-right");
  //await page.waitForTimeout(4000);
  //console.log("clicked");
  //const nextLinks = await page.$$eval(
  //  "h2.product-name-no-ellipsis.p-name-list > a",
  //  (link) => link.map((a) => a.href)
  //);
  //console.log(links.concat(nextLinks));
  console.log(links);
  return links;
};

const getBooks = async (page, link) => {
  let books = {};
  await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
  console.log("child page");
  const genre = await page.$eval(
    "div.container-inner.breadcrumbs > ol > li:last-child",
    (genre) => genre.innerText
  );
  books["title"] = await page.$eval(
    "div.product-essential-detail > h1",
    (h1) => h1.innerText
  );
  books["author"] = await page.$eval(
    ".product-view-sa-author > span:last-child",
    (span) => span.innerText
  );
  books["price"] = await page.$eval("p.special-price > span.price", (span) =>
    parseFloat(span.innerText.trim().split(" ")[0])
  );
  books["old_price"] = await page.$eval("p.old-price > span.price", (span) =>
    parseFloat(span.innerText.trim().split(" ")[0])
  );
  books["imgURL"] = await page.$eval(
    "div.product-view-image-product > img",
    (img) => img.src
  );
  books["genre"] = genre;

  return books;
};

module.exports = bookScraper = async (url) => {
  let books = [];
  let links = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const linksGenre = await getLinksGenre(page, url);
  for (linkGenre in linksGenre) {
    let link = await getLinks(page, linksGenre[linkGenre]);
    links = await links.concat(link);
  }
  console.log(links);
  for (link in links) {
    let book = await getBooks(page, links[link]);
    await books.push(book);
  }
  console.log(books);
  await browser.close();
  await Book.deleteMany({});
  await Book.insertMany(books);
};
