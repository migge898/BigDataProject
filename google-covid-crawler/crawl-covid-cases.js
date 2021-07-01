const puppeteer = require('puppeteer');

const searchTerm = "covid-19 cases ";
const coutries =['Germany','China'];

const getNumberFromString = (str)=>{
    // if(str.includes(',')&&str.includes('.')){
    //     if(str.split(',')[0].includes('.')){
    //         str = str.replace(/\./gm,'');
    //         str = str.replace(/,/gm,'.');
    //     }
    // }
    
    if(str[0] === '+') str = str.substring(1);
    if(str.includes('K')){
        str = str.replace(/,/gm,'.');
        return parseFloat(str) * 1000;
    } 
    else if(str.includes('M')){
        str = str.replace(/,/gm,'.');
        return parseFloat(str) * 1000000;
    }
    else{
        str = str.replace(/\./gm,'');
        return parseInt(str);}
}
const getNumberData = (str)=>{
    const number = getNumberFromString(str);
    return {str, parsed: number};
}
const getField = async (page,name, selector) =>{
    try{
        const data = await page.$eval(selector,el=>el.textContent) ;
        return getNumberData(data);
    }
    catch(e){
        console.log("Error at getting field:",name);
        console.log(e);
    }
}

;(async ()=>{
    const browser = await puppeteer.launch({headless:false,args: ['--lang=en-GB,en']});
    for(let i = 0; i<coutries.length; i++){
        const country = coutries[i];
        try{
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en'
            });
            await page.goto(`https://google.com?q=${encodeURIComponent(searchTerm+country)}&lr=lang_en`);
            await page.click('#L2AGLb').catch(()=>{});

            console.log("Now crawling: "+country);
            await page.click('body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b').catch(()=>{});

            await page.waitForNavigation();
            await page.waitForSelector('#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span');
            const casesTotal = await getField(page,'casesTotal','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span') ;
            const casesToday = await getField(page,'casesToday','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(1) > div.h5Hgwe > div > span');
            const recoveredTotal = await getField(page,'recoveredTotal','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(2) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span');
            const recoveredToday  = await getField(page,'recoveredToday','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(2) > div.h5Hgwe > div > span');
            const deathsTotal = await getField(page,'deathsTotal','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(3) > div.m7B03.XcVN5d.d83oBf > div:nth-child(1) > span') ;
            const deathsToday  = await getField(page,'deathsToday','#eTST2 > div:nth-child(3) > div.o6Yscf.iB3eO > table > tbody > tr > td:nth-child(3) > div.h5Hgwe > div > span') ;
            console.log(casesTotal, casesToday, recoveredTotal, recoveredToday, deathsTotal, deathsToday);
            page.close();
        }
        catch(e){
            console.log(e);
        }
        
    }

    browser.close();
})()