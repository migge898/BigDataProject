import requests
import mysql.connector
import time
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime

try:
	mydb = mysql.connector.connect(
	  host="localhost",
	  user="nodejs",
	  password="bigdatagruppe8",
	  database="gr8covid"
	)

	query = "select vac.day,vac.country,percent_fully_vaccinated, cases_today, wea.temperature from (select substring(time_crawled,1,10) as day,country,percent_fully_vaccinated from covid19_vaccinations_google) vac join (select substring(time_crawled,1,10) as day,country,cases_today from covid19_cases_google) cas on vac.day = cas.day and vac.country=cas.country join(select substring(time_crawled,1,10) as day, avg(temperature) as temperature from weather group by day)  wea on vac.day = wea.day where vac.country like \"Germany\";"
	result_dataFrame = pd.read_sql(query,mydb)

	mydb.close()
	result_dataFrame.to_csv('vaccinations-cases-temperature.csv')
except Exception as e:
    mydb.close()
    print(str(e))
