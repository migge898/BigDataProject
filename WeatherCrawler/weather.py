import requests
import mysql.connector
from bs4 import BeautifulSoup
from datetime import datetime

mydb = mysql.connector.connect(
  host="localhost",
  user="nodejs",
 password="bigdatagruppe8",
    database="gr8covid"
)

cursor = mydb.cursor()

bundeslaender = ["bayern","baden-wuerttemberg","berlin","brandenburg","bremen","hamburg","mecklenburg-vorpommern","niedersachsen","nordrhein-westfalen","rheinland-pfalz","saarland","sachsen","sachsen-anhalt","schleswig-holstein","thueringen"]

for b in bundeslaender:
    r = requests.get("https://www.wetteronline.de/wetter/" + b)
    doc = BeautifulSoup( r.text,"html.parser")
    for row in doc.select_one(".sortabletable_teaser").select("li"):
        name  = str(row.select_one(".loccol").text).strip()
        degree  = ((row.select("span"))[2].text)
        weather = (row.find('img', alt=True))['alt'].strip()
        degreeWithoutC = degree[:len(degree)-8]
        degreeWithoutC = float(degreeWithoutC)
    
      
        mySql_insert_query = "INSERT INTO weather (country,region,city,temperature,temperature_raw,weather,html_raw) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        record = ('Deutschland', str(b).strip() , str(name),degreeWithoutC, str(degree).strip(),str(weather),str(row))
        cursor.execute(mySql_insert_query,record)
 

        

mydb.commit()
cursor.close()
mydb.close()            
