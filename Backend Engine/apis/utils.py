import ast

def convert(text):
  L = []
  for i in ast.literal_eval(text):
    L.append(i['name']) 
  return L 

def convert3(text):
  L = []
  counter = 0
  for i in ast.literal_eval(text):
    if counter < 3:
      L.append(i['name'])
    counter+=1
  return L 

def collapse(L):
  L1 = []
  for i in L:
      L1.append(i.replace(" ",""))
  return L1

def fetch_director(text):
  L = []
  for i in ast.literal_eval(text):
      if i['job'] == 'Director':
          L.append(i['name'])
  return L
