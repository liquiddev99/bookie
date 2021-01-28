const puppeteer = require("puppeteer");
const Book = require("../models/Book");

const bookScrapev2 = async (page, url) => {
  await page.goto(url, { waitUntil: "networkidle2" });
  console.log("page loaded");
  let links = await page.$$eval(
    "h2.product-name-no-ellipsis.p-name-list > a",
    (link) => link.map((a) => a.href)
  );
  return links;
};
const getBook = async (page, link, genre) => {
  let book = {};
  await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
  console.log("child page");
  book["title"] = await page.$eval("div.product-essential-detail > h1", (h1) =>
    h1.innerText.trim()
  );
  book["author"] = (await page.$(".product-view-sa-author > span:last-child"))
    ? await page.$eval(".product-view-sa-author > span:last-child", (span) =>
        span.innerText.trim()
      )
    : "";
  book["price"] = await page.$eval("p.special-price > span.price", (span) =>
    parseFloat(span.innerText.trim().split(" ")[0])
  );
  book["old_price"] = (await page.$("p.old-price > span.price"))
    ? await page.$eval("p.old-price > span.price", (span) =>
        parseFloat(span.innerText.trim().split(" ")[0])
      )
    : "";
  book["imgURL"] = await page.$eval(
    "div.product-view-image-product > img",
    (img) => img.src
  );
  book["genre"] = genre;
  console.log(book);

  return book;
};
module.exports = crawl = async (genre) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let links = [];
  let books = [];
  for (var p = 1; p <= 3; p++) {
    let link = await bookScrapev2(
      page,
      `https://www.fahasa.com/sach-trong-nuoc/tam-ly-ky-nang-song/tam-ly.html?order=num_orders&limit=48&p=${p}`
    );
    links = links.concat(link);
  }
  console.log(links);
  for (link in links) {
    let book = await getBook(page, links[link], genre);
    await books.push(book);
  }
  console.log(books);
  await browser.close();
  await Book.deleteMany({ genre });
  await Book.insertMany(books);
};
