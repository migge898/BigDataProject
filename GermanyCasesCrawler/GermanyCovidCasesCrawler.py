import requests
import mysql.connector
import time

from bs4 import BeautifulSoup
from datetime import datetime


mydb = mysql.connector.connect(
  host="localhost",
  user="test",
  password="uaLAygor",
  database="gr8covid"
)

mycursor = mydb.cursor()

link = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html"
r = requests.get(link)
doc = BeautifulSoup(r.text, "html.parser")

table = doc.find("table")
table_body = table.find("tbody")
rows = table_body.find_all("tr")

bundeslaender = ["baden-wuerttemberg","bayern","berlin","brandenburg","bremen","hamburg", "hessen","mecklenburg-vorpommern","niedersachsen","nordrhein-westfalen","rheinland-pfalz","saarland","sachsen","sachsen-anhalt","schleswig-holstein","thueringen"]
mydb.rollback()

for row,b in zip(rows, bundeslaender):
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]
    data = [ele for ele in cols if ele]
    data = data[1:]

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    timee = doc.find_all("p")[12]
    t_time = str(timee)[19:35].replace(",", "")
    zeitStand = datetime.strptime(t_time,'%d.%m.%Y %H:%M').strftime('%Y-%m-%d %H:%M:%S')
    zeitStand = doc.find_all("p")[12]
    zeitStand = str(zeitStand)[19:35].replace(",", "")
    zeitStand = datetime.strptime(t_time,'%d.%m.%Y %H:%M').strftime('%Y-%m-%d %H:%M:%S')

    anzahl = int(str(data[0]).replace(".", ""))
    diff = int(str(data[1]).replace(".", ""))
    faelle7 = int(str(data[2]).replace(".", ""))
    inzidenz7 = float(data[3].replace(",", "."))
    todesfaelle = int(str(data[4]).replace(".", ""))

    rawZeitStand = str(doc.find_all("p")[12])
    rawAnzahl = str(data[0])
    rawDiff = str(data[1])
    rawFaelle7 = str(data[2])
    rawInzidenz7 = str(data[3])
    rawTodesfaelle = str(data[4])

    html_raw = str(doc)

    mySql_insert_query = "INSERT INTO covid19_cases_rki  (zeit_abgerufen ,zeit_datenstand,bundesland ,anzahl ,differenz_zum_vortag ,faelle_letzte_7_tage ,_7_tage_inzidenz , todesfaelle ,zeit_datenstand_raw ,anzahl_raw ,differenz_zum_vortag_raw ,faelle_letzte_7_tage_raw ,_7_tage_inzidenz_raw ,todesfaelle_raw ,html_raw ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    record = (timestamp, zeitStand, b, anzahl, diff, faelle7, inzidenz7, todesfaelle, rawZeitStand[:20], rawAnzahl, rawDiff, rawFaelle7, rawInzidenz7, rawTodesfaelle, html_raw)
    mycursor.execute(mySql_insert_query, record)

mydb.commit()
mycursor.close()
mydb.close()  