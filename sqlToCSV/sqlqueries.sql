
/* Get Percent vaccinated and daily cases for one country */

select vac.day,vac.country,percent_fully_vaccinated, cases_today from (select substring(time_crawled,1,10) as day,country,percent_fully_vaccinated from covid19_vaccinations_google) vac join (select substring(time_crawled,1,10) as day,country,cases_today from covid19_cases_google) cas on vac.day = cas.day and vac.country=cas.country where vac.country like "Germany";


/* Same but with weather */


select vac.day,vac.country,percent_fully_vaccinated, cases_today, wea.temperature from (select substring(time_crawled,1,10) as day,country,percent_fully_vaccinated from covid19_vaccinations_google) vac join (select substring(time_crawled,1,10) as day,country,cases_today from covid19_cases_google) cas on vac.day = cas.day and vac.country=cas.country join
(select substring(time_crawled,1,10) as day, avg(temperature) as temperature from weather group by day)  wea on vac.day = wea.day where vac.country like "Germany";
