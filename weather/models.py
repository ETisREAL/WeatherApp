from django.core.files.storage import FileSystemStorage
from django.db import models
from django.contrib.auth.models import User
from .utils import current_weather_data, OpenWeatherMap
import json

# Create your models here.


class Cities(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField()
    #weather = JSONField()

    class Meta:
        ordering = ['-id']

    def get_weather(self, units, language):
        data = current_weather_data(self.name, units, language)
        return data

    def __str__(self):
        return self.name