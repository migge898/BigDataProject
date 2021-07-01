const puppeteer = require("puppeteer");

const searchTerm = (country) => `coronavirus vaccine ${country} statistics`;
const coutries = ["India","Germany", "China"];

const getNumberFromString = (str) => {
  if (str[0] === "+") str = str.substring(1);
  if (str.includes("K")) {
    str = str.replace(/,/gm, ".");
    return parseFloat(str) * 1000;
  } else if (str.includes("M")) {
    str = str.replace(/,/gm, ".");
    return parseFloat(str) * 1000000;
  } else if (str.includes("B")) {
    str = str.replace(/,/gm, ".");
    return parseFloat(str) * 1000000000;
  } else {
    str = str.replace(/\./gm, "");
    return parseInt(str);
  }
};
const getNumberData = (str) => {
  const number = getNumberFromString(str);
  return { str, parsed: number };
};
const getField = async (page, name, selector) => {
  try {
    const data = await page.$eval(selector, (el) => el.textContent);
    return getNumberData(data);
  } catch (e) {
    console.log("Error at getting field:", name);
    console.log(e);
  }
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--lang=en-US,en"],
  });
  for (let i = 0; i < coutries.length; i++) {
    const country = coutries[i];
    try {
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en",
      });
      // Set the language forcefully on javascript
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "language", {
          get: function () {
            return "en-US";
          },
        });
        Object.defineProperty(navigator, "languages", {
          get: function () {
            return ["en-US", "en"];
          },
        });
      });

      await page.goto(
        `https://google.com?q=${encodeURIComponent(
          searchTerm(country)
        )}&lr=lang_en&hl=en`
      );
      await page.click("#L2AGLb").catch(() => {});

      console.log("Now crawling: " + country);
      await page
        .click(
          "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b"
        )
        .catch(() => {});

      await page.waitForNavigation();
      await page.waitForSelector(
        "#eTST2 > div:nth-child(3) > div.iaUz9d > div > div.ZDcxi > table > tbody > tr.viwUIc.qk4EEc > td.HB6aoe.p8lMe.QM7g5b.mvzKZe > div > div > span"
      );

      const countryNameInList = await page.$eval(
        "#eTST2 > div:nth-child(3) > div.iaUz9d > div > div.ZDcxi > table > tbody > tr.viwUIc.qk4EEc > td.HB6aoe.p8lMe.QM7g5b.mvzKZe > div > div > span",
        (el) => el.textContent
      );
      if (!countryNameInList.toLowerCase().includes(country.toLowerCase())) {
        throw new Error(
          `Country name in list (${countryNameInList}) does not match requested country name (${country})`
        );
      }
      const dosesGiven = await getField(
        page,
        "dosesGiven",
        "#eTST2 > div:nth-child(3) > div.iaUz9d > div > div.ZDcxi > table > tbody > tr.viwUIc.qk4EEc > td:nth-child(2) > div.QM7g5b > div:nth-child(1) > span"
      );
      const fullyVaccinated = await getField(
        page,
        "fullyVaccinated",
        "#eTST2 > div:nth-child(3) > div.iaUz9d > div > div.ZDcxi > table > tbody > tr.viwUIc.qk4EEc > td:nth-child(3) > div.QM7g5b > div:nth-child(1) > span"
      );

      
      let percentFullyVaccinated
      try{
          let str = await page.$eval("#eTST2 > div:nth-child(3) > div.iaUz9d > div > div.ZDcxi > table > tbody > tr.viwUIc.qk4EEc > td:nth-child(4) > div.QM7g5b > div:nth-child(1) > span",el=>el.textContent);
          percentFullyVaccinated = {str};
          if(!str.includes('%')){
              throw new Error('No percent figure given');
          }
          str = str.replace(/,/gm,'.');
        percentFullyVaccinated.parsed = parseFloat((str));
      }
      catch(e){
          console.log(e);
      }

      console.log(dosesGiven, fullyVaccinated, percentFullyVaccinated);

      page.close();
    } catch (e) {
      console.log(e);
    }
  }

  // browser.close();
})();
