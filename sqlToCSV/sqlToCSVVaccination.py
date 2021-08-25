import mysql.connector
import pandas as pd

try:
	mydb = mysql.connector.connect(
	  host="localhost",
	  user="nodejs",
	  password= "bigdatagruppe8",
	  database="gr8covid"
	)

	query = "SELECT time_crawled, code, vaccinationsTotal, peopleFirstTotal, peopleFullTotal FROM covid19_vaccinations_germany_by_state"
	result_dataFrame = pd.read_sql(query, mydb)

	mydb.close()
	result_dataFrame.to_csv('vaccinations_germany.csv')
except Exception as e:
	mydb.close()
	print(str(e))
