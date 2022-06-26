import pandas as pd

file = pd.read_csv('dataset.csv')
print(file)
for r in file :
  print(r)

for index, row in file.iterrows():
  print(row['genres'], row['id'], row['original_language'], row['title'], row['vote_average'])
  break