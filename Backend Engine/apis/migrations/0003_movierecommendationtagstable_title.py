# Generated by Django 3.2 on 2022-05-27 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0002_movierecommendationtagstable'),
    ]

    operations = [
        migrations.AddField(
            model_name='movierecommendationtagstable',
            name='title',
            field=models.TextField(blank=True, max_length=255),
        ),
    ]
