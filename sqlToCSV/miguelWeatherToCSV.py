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

        query = "select time_crawled, region as bundesland, temperature,city from weather"
        result_dataFrame = pd.read_sql(query,mydb)

        mydb.close()
        result_dataFrame.to_csv('miguelWeather.csv')
except Exception as e:
    mydb.close()
    print(str(e))
