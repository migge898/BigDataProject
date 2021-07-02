#!/usr/bin/env python
# coding: utf-8

# In[1]:


import requests
import csv
from bs4 import BeautifulSoup


# In[39]:


def getTable(link):
    data = []
    r = requests.get(link)
    
    doc = BeautifulSoup(r.text, "html.parser")
    table = doc.find("table")
    table_body = table.find("tbody")
    rows = table_body.find_all("tr")
    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        data.append([ele for ele in cols if ele])
#     for d in data:
#         for dd in d:
#             dd = dd.replace(u'\xad', u'-',2)
    return data


# In[40]:


data = getTable("https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html")


# In[75]:


import pandas as pd
import numpy as np
import datetime
arr = np.array(data)
head = ["Bundesland", "Anzahl","Differenz zum Vortag","Fälle in den letzten 7 Tagen","7-Tage-Inzidenz","Todesfälle"]
file = pd.DataFrame(data=arr,columns=head)
date = str(datetime.date.today())
file.to_csv("./GermanyCovidCases_"+date+".csv")

