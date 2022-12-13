from django.shortcuts import render
import json
import urllib.request, urllib.parse

from .models import Cities
from .utils import current_weather_data, OpenWeatherMap, serialize_page

import random
import asyncio

from cursor_pagination import CursorPaginator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core import serializers

# Create your views here.

languages = {
            'Afrikaans' : 'af',
            'Albanian' : 'al',
            'Arabic' : 'ar',
            'Azerbaijani' : 'az', 
            'Bulgarian' : 'bg', 
            'Catalan' : 'ca', 
            'Czech' : 'cz', 
            'Danish' : 'da',
            'German' : 'de',
            'Greek' : 'el',
            'English' : 'en',
            'Basque' : 'eu',
            'Persian' : 'fa',
            'Finnish' : 'fi',
            'French' : 'fr',
            'Galician' : 'gl',
            'Hebrew' : 'he',
            'Hindi' : 'hi',
            'Croatian' : 'hr',
            'Hungarian' : 'hu',
            'Indonesian' : 'id',
            'Italian' : 'it',
            'Japanese' : 'ja',
            'Korean' : 'kr',
            'Latvian' : 'la',
            'Lithuanian' : 'lt',
            'Macedonian' : 'mk',
            'Norwegian' : 'no',
            'Dutch' : 'nl',
            'Polish' : 'pl',
            'Portuguese' : 'pt',
            'Português Brasil' : 'pt_br', 
            'Romanian' : 'ro',
            'Russian' : 'ru',
            'Swedish' : 'sv',
            'Slovak' : 'sk',
            'Slovenian' : 'sl',
            'Spanish' : 'sp',
            'Serbian' : 'sr',
            'Thai' : 'th',
            'Turkish' : 'tr',
            'Ukrainian' : 'uk',
            'Vietnamese' : 'vi',
            'Chinese Simplified' : 'zh_cn', 
            'Chinese Traditional' : 'zh_tw', 
            'Zulu' : 'zu',
            }

cities = ['Honolulu', 'Cape Town', 'Moscow', 'New York', 'London', 'Los Angeles', 'Rio De Janeiro', 'Jakarta', 'Shanghai', 'Sidney', 'Tokyo', 'Buenos Aires', 'Paris', 'Nairobi']

from django.views.generic.list import ListView

class PredictionView(ListView):
    model = Cities
    paginate_by = 2
    context_object_name = 'cities'
    template_name = 'weather/prediction.html'

def prediction_view(request):

    #cursor = request.GET.get('cursor')
    # page_size = 2
    # paginator = CursorPaginator(qs, ordering=('-id', '-name'))
    # page = paginator.page(first=page_size, after=cursor)
    # has_next = page.has_next

    units = request.GET.get('units') if request.GET.get('units') != None else 'imperial'
    language = request.GET.get('language') if request.GET.get('language') != None else 'en'

    qs = Cities.objects.all().order_by('-id')
    page = request.GET.get('page', 1)
    paginator = Paginator(qs, 1)

    try:
        cities = paginator.page(page)
    except PageNotAnInteger:
        cities = paginator.page(1)
    except EmptyPage:
        cities = paginator.page(paginator.num_pages)

    # if has_next == False:
    #     page = paginator.page(first=page_size, after=paginator.cursor(page[0]))
    #     #page = paginator.page(first=page_size, after='M3xMb3MgQW5nZWxlcw==')
    # else:

    data = {
        #'json': serialize_page(page),
        'languages': languages,
        'units': units,
        'language': language,
        'qs': qs,
        'cities': cities,
        'num_pages': paginator.page(paginator.num_pages),
        'page': page,
        #'hasNext': page.has_next,
        #'hasNext': has_next,
        #'last_cursor': paginator.cursor(page[-1]),
        #'lastCursor': paginator.cursor(page[-1]),
    }
    return render(request, 'weather/prediction.html', data)


def home_view(request):
    if request.method == 'POST':
        form_city = request.POST['city']
        stringified_city = str(form_city)
        cities = Cities.objects.all()
        city = cities.get(name=stringified_city)

    else:
        city = None

    

    units = request.GET.get('units') if request.GET.get('units') != None else 'imperial'
    language = request.GET.get('language') if request.GET.get('language') != None else 'English'

    qs = Cities.objects.all().order_by('-id')


    #city = qs.get(name=city_name)
    page = request.GET.get('page', 1)
    paginator = Paginator(qs, 1)

    try:
        cities = paginator.page(page)
    except PageNotAnInteger:
        cities = paginator.page(1)
    except EmptyPage:
        cities = paginator.page(paginator.num_pages)

    context = {
        'languages': languages,
        'cities': cities,
        'data': serializers.serialize('json', cities),
        #'city': city,
        'units': units,
        'language': language,
        'num_pages': paginator.page(paginator.num_pages),
        'page': page,
    }
    
    return render(request, 'weather/home.html', context)


def forecast_view(request):

    units = request.GET.get('units') if request.GET.get('units') != None else 'imperial'
    language = request.GET.get('language') if request.GET.get('language') != None else 'English'
    
    if request.method == 'POST' and 'get_info' in request.POST:

        coords = request.POST['coords']
        lat, lon = coords.split(' ')

        owm = OpenWeatherMap()
        owm_forecast = OpenWeatherMap()

        current_weather = owm.set_up(lat, lon, "weather", units, languages[language])
        serialized_current_weather = json.dumps(current_weather)
        
        owm_forecast.set_up(lat, lon, 'forecast', units=units, language=languages[language])
        forecast = owm_forecast.get_forecast_improved()
        serialized_forecast = json.dumps(forecast)


        context = {
            'serialized_current_weather': serialized_current_weather,
            'serialized_forecast': serialized_forecast,
            'languages': languages,
            'units': units,
            'lat': lat,
            'lon': lon,
        }
    else:
        context = {
            'languages': languages,
        }
    return render(request, 'weather/forecast.html', context)