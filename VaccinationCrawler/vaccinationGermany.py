import requests
import pandas as pd
r = requests.get("https://impfdashboard.de/static/data/germany_vaccinations_by_state.tsv")
with open("germany_vaccinations_by_state.tsv", 'wb') as f:
    f.write(r.content) 
r2 = requests.get("https://impfdashboard.de/static/data/germany_vaccinations_timeseries_v2.tsv")
with open("germany_vaccinations_timeseries_v2.tsv", 'wb') as f2:
    f2.write(r2.content) 
df = pd.read_csv("germany_vaccinations_by_state.tsv", delimiter="\t")

from datetime import datetime
import mysql.connector
mydb = mysql.connector.connect(
  host="",
  user="",
  password="",
  database="gr8covid"
)

mycursor = mydb.cursor()
for column_name, item in df.iterrows():
    sql = "INSERT INTO covid19_vaccinations_germany_by_state (time_crawled, code, vaccinationsTotal, peopleFirstTotal, peopleFullTotal) VALUES (%s, %s, %s, %s, %s)"
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    record=(timestamp,item[0], item[1], item[2], item[3])
    mycursor.execute(sql, record)

mydb.commit()
mycursor.close()
mydb.close()