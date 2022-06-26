# Generated by Django 3.2 on 2022-05-24 12:38

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MoviesTable',
            fields=[
                ('genre', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), size=30)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('origninal_language', models.CharField(max_length=10)),
                ('vote_average', models.FloatField()),
                ('release_date', models.DateField()),
                ('title', models.TextField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='MoviesHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.moviestable')),
            ],
        ),
    ]
