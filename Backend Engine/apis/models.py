# from djongo import models
from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here. 
class MoviesTable(models.Model):
  genre = ArrayField(
    models.CharField(max_length=100),
    size=30
  )
  id = models.IntegerField(primary_key=True)
  origninal_language = models.CharField(max_length=10)
  vote_average = models.FloatField(null=False)
  release_date = models.DateField(null=False)
  title = models.TextField(max_length=255)


#ek aur table banegi to store jo user movie dekh raha hai
class MoviesHistory(models.Model):
  movie = models.ForeignKey(MoviesTable,on_delete=models.CASCADE)

# select  avg(mt.vote_average) from movietable mt, movieshistory mh where mt.id = mh.movie_id

class MovieRecommendationTagsTable(models.Model):
  movie_id = models.IntegerField(primary_key=False)
  title = models.TextField(max_length=255,blank=True)
  tags = models.TextField(max_length=2000,null=True)