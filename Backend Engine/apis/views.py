from django.http import HttpResponse, JsonResponse
import pandas as pd
import json 
from django.db.models import Avg
from sklearn.feature_extraction.text import CountVectorizer  #for making vectors
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity
from django.views.decorators.csrf import csrf_exempt
from apis.models import MoviesTable,MoviesHistory,MovieRecommendationTagsTable
from apis.utils import collapse,convert,convert3,fetch_director

# function to load csv data into database
def loadCsv(request):
  file = pd.read_csv('apis/dataset.csv')
  i = 0
  for _ , row in file.iterrows():
    row['genres'] = json.loads(row['genres'])
    row['genres'] = [x['name'] for x in row['genres']]

    # insert data
    obj = MoviesTable.objects.create(
      genre = row['genres'],
      id = row['id'],
      origninal_language = row['original_language'],
      title = row['title'],
      vote_average = row['vote_average'],
      release_date = row['release_date']
    )

    if(i < 20):
      MoviesHistory.objects.create(
        movie = obj
      )
    i += 1  
    print(i)
  print("movies done")
  movies = pd.read_csv('apis/movies.csv')
  credits = pd.read_csv('apis/credits.csv')

  movies = movies.merge(credits,on='title')
  movies = movies[['movie_id','title','overview','genres','keywords','cast','crew']]
  
  movies.dropna(inplace=True)
  movies['genres'] = movies['genres'].apply(convert)
  movies['keywords'] = movies['keywords'].apply(convert)
  movies['cast'] = movies['cast'].apply(convert3)
  movies['cast'] = movies['cast'].apply(lambda x:x[0:3])

  movies['crew'] = movies['crew'].apply(fetch_director)
  movies['cast'] = movies['cast'].apply(collapse)
  movies['crew'] = movies['crew'].apply(collapse)
  movies['genres'] = movies['genres'].apply(collapse)
  movies['keywords'] = movies['keywords'].apply(collapse)

  movies['overview'] = movies['overview'].apply(lambda x:x.split())
  movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']

  print('tstem')
  ps = PorterStemmer()
  def stem(text):
    y = []
    for i in text.split():
      y.append(ps.stem(i))
    return " ".join(y)

  new_df = movies.drop(columns=['overview','genres','keywords','cast','crew'])
  new_df['tags'] = new_df['tags'].apply(lambda x: " ".join(x))
  new_df['tags'] = new_df['tags'].apply(stem)
  i = 0
  for _ , row in new_df.iterrows():
    # insert data
    MovieRecommendationTagsTable.objects.create(
      movie_id = row['movie_id'],
      title = row['title'],
      tags = row['tags']
    )
    print(i+1)
    i += 1

  return HttpResponse("done preprocessing the data")

# recommend movies based on movie tags 
@csrf_exempt
def recommendUsingHistory(request):
  # logic quries likhni padegi to get data based on recommendation using history
  movie_name = json.loads(request.body)['movie_name']
  
  # data = MovieRecommendationTagsTable.objects.all().values_list()
  df = pd.DataFrame(list(MovieRecommendationTagsTable.objects.all().values('movie_id', 'tags', 'title')))

  cv = CountVectorizer(max_features=5000,stop_words='english') #will generate frequently
  # occuring words and not including english words(the,in,of, etc)

  vectors = cv.fit_transform(df['tags']).toarray()

  #we are using cosine distance for higher dimensions
  similarity = cosine_similarity(vectors)

  def recommend(movie):
    L = []
    index = df[df['title'] == movie]#.index[0]
    
    # if movie does not exist with that name return empty list
    if(len(index) == 0):
      return L
    index = index.index[0]
    distances = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])
    for i in distances[1:21]:
        L.append({'title': df.iloc[i[0]].title, 'id': str(df.iloc[i[0]].movie_id) })
    return L
  
  recommendData = recommend(movie_name)
  
  return JsonResponse(recommendData,safe=False) #converts any variable into strings

# recommend movies based on history using KNN
def recommendUsingRating(request):
  # get average
  avg = MoviesHistory.objects.aggregate(Avg('movie__vote_average'))['movie__vote_average__avg']

  if(avg==None or avg < 1):
    avg = 9
  
  # knn 
  data = MoviesTable.objects.values()
  data = list(data)
  data.sort(key=lambda x: abs(x['vote_average'] - avg))

  return JsonResponse(data=data[:20],safe=False)

# store user history
def addMovie(request,movie_id):
  obj = MoviesTable.objects.filter(id=movie_id)
  if(len(obj) != 0):
    MoviesHistory.objects.get_or_create(movie=obj[0])
  else:
    print("no movie present")
  return JsonResponse(data={'msg': '200 OK'})