#!/usr/bin/env python
# coding: utf-8

# In[4]:


import requests
import csv
from bs4 import BeautifulSoup


# In[19]:


def getSummaryText(link):
    r = requests.get(link)
    
    doc = BeautifulSoup(r.text, "html.parser")
    print(doc.find("p").text)


# In[20]:


getSummaryText("https://impfdashboard.de/")

