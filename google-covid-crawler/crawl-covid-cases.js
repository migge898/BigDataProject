const puppeteer = require("puppeteer");
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "nodejs",
  password: "bigdatagruppe8",
  database: "gr8covid",
});

const searchTerm = "covid-19 cases ";
const coutries = [
  "Germany",
  "China",
  "Japan",
  "Australia",
  "Russia",
  "Spain",
  "Italy",
  "Belgium",
  "Netherlands",
  "Sweden",
  "Finland",
  "Poland",
  "Austria",
  "Switzerland",
  "United States",
  "South Africa",
  "Brazil",
  "Mexico",
  "Canada",
  "India",
  "Hungary",
  "France",
  "Argentina",
  "Isreal",
  "Denmark",
  "Columbia",
  "Turkey",
  "Greece",
  "Egypt",
  "United Kingdom"
];

const tableName = "covid19_cases_google";

const getNumberFromString = (str) => {
  // if(str.includes(',')&&str.includes('.')){
  //     if(str.split(',')[0].includes('.')){
  //         str = str.replace(/\./gm,'');
  //         str = str.replace(/,/gm,'.');
  //     }
  // }

  if (str[0] === "+") str = str.substring(1);
  if (str.includes("K")) {
    str = str.replace(/,/gm, ".");
    return parseFloat(str) * 1000;
  } else if (str.includes("M")) {
    str = str.replace(/,/gm, ".");
    return parseFloat(str) * 1000000;
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
    // console.log("Error at getting field:", name);
    // console.log(e);
  }
};

(async () => {
  let crawledTotal = 0;
  // Connect to database
  await new Promise((res) =>
    dbConnection.connect((err) => {
      if (err) {
        throw err;
      }
      res();
    })
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--lang=en-GB,en"],
  });
  for (let i = 0; i < coutries.length; i++) {
    const country = coutries[i];
    try {
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en",
      });
      await page.goto(
        `https://google.com?q=${encodeURIComponent(
          searchTerm + country
        )}&lr=lang_en`
      );
      await page.click("#L2AGLb").catch(() => {});

      //console.log("Now crawling: " + country);
      await page
        .click(
          "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b"
        )
        .catch(() => {});

      await page.waitForNavigation();
      await page.waitForSelector(
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span"
      );
      const casesTotal = await getField(
        page,
        "casesTotal",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span"
      );
      const casesToday = await getField(
        page,
        "casesToday",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.h5Hgwe > div > span"
      );
      const recoveredTotal = await getField(
        page,
        "recoveredTotal",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(2) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span"
      );
      const recoveredToday = await getField(
        page,
        "recoveredToday",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(2) > div.h5Hgwe > div > span"
      );
      const deathsTotal = await getField(
        page,
        "deathsTotal",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(3) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span"
      );
      const deathsToday = await getField(
        page,
        "deathsToday",
        "#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(3) > div.h5Hgwe > div > span"
      );
      const bodyHTML = "abc"; // await page.evaluate(() => document.body.innerHTML).catch(e=>{});

    //   console.log(
    //     casesTotal,
    //     casesToday,
    //     recoveredTotal,
    //     recoveredToday,
    //     deathsTotal,
    //     deathsToday
    //   );
      page.close();

      // save to db:
      const sn = (a) => (typeof a === "object" && a.parsed) || "NULL";
      const ss = (a) =>
        typeof a === "object" && a.str && a.str.length > 0
          ? `'${a.str}'`
          : "NULL";
      let query = `INSERT INTO ${tableName} (time_crawled,country,cases_total,cases_today, recovered_total, recovered_today, deaths_total, deaths_today,`;
      query += `cases_total_raw, cases_today_raw, recovered_total_raw, recovered_today_raw, deaths_total_raw, deaths_today_raw)`;
      query += `VALUES ('${
        new Date().toISOString().replace("T", " ").split(".").splice(0, 1)[0]
      }','${country}',`;
      query += `${sn(casesTotal)}, ${sn(casesToday)}, ${sn(
        recoveredTotal
      )}, ${sn(recoveredToday)}, ${sn(deathsTotal)}, ${sn(deathsToday)},`;
      query += `${ss(casesTotal)}, ${ss(casesToday)}, ${ss(
        recoveredTotal
      )}, ${ss(recoveredToday)}, ${ss(deathsTotal)}, ${ss(deathsToday)})`;
      // query += `${bodyHTML?`'${bodyHTML}'`:'NULL'})`
      //console.log(query)

      await new Promise((res) => {
        dbConnection.query(query, (err, result) => {
          if (err) {
            throw err;
          }
          res();
        });
      });
      crawledTotal++;
    } catch (e) {
      console.log(e);
    }
  }
  console.log("[COVID_19_CASES_GOOGLE_CRAWLER] Crawled "+crawledTotal+" Countries");
  dbConnection.destroy();
  browser.close();
})();
