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

	query = "SELECT zeit_abgerufen, bundesland ,anzahl ,differenz_zum_vortag ,faelle_letzte_7_tage ,_7_tage_inzidenz , todesfaelle covid19_cases_rki"
	q2 = "select zeit_abgerufen, bundesland, anzahl, differenz_zum_vortag, faelle_letzte_7_tage, _7_tage_inzidenz, todesfaelle from covid19_cases_rki"
	result_dataFrame = pd.read_sql(q2,mydb)

	mydb.close()
	result_dataFrame.to_csv('faelleRKI.csv')
except Exception as e:
    mydb.close()
    print(str(e))
