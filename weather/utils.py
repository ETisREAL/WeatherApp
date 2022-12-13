import json, requests, base64
import urllib.request, urllib.parse
import random
from django.core.serializers import serialize


def serialize_page(data):
    serialized = serialize('json', data)
    return serialized


def current_weather_data(city, units, language):
    city_capitalized = city.title()
    safe_string_city = urllib.parse.quote_plus(city)

    url = urllib.request.urlopen('http://api.openweathermap.org/data/2.5/weather?q='+safe_string_city+'&units='+units+'&lang='+language+'&appid=66d8dd58fe4ab3e2cbf275d5aee1d85b').read()
    
    json_data = json.loads(url)

    data = {
        'main': {
                'temperature': json_data['main']['temp'],
                'perceived_temperature': json_data['main']['feels_like'],
                'temp_min': json_data['main']['temp_min'],
                'temp_max': json_data['main']['temp_max'],
                'pressure': json_data['main']['pressure'],
                'humidity': json_data['main']['humidity'],
                },
        'coord': {
            'longitude': json_data['coord']['lon'],
            'latitude': json_data['coord']['lat'],
                },
        'weather': {
            'main': json_data['weather'][0]['main'],
            'description': json_data['weather'][0]['description'].title(),
            'icon': 'http://openweathermap.org/img/wn/' + json_data['weather'][0]['icon'] + '@2x.png',
        },
        'wind': {
            'speed': json_data['wind']['speed'],
        },
        'clouds': {
            'all': json_data['clouds']['all'],
        },
        'sys': {
            'country': json_data['sys']['country'],
            'sunrise': json_data['sys']['sunrise'],
            'sunset': json_data['sys']['sunset'],

        },
        'location': {
            'city_capitalized': city_capitalized,
            'city': json_data['name'],
            'time': json_data['dt'],
            'timezone': json_data['timezone'],
            'visibility': json_data['visibility'],
        }
        }
    return data


#############################


class OpenWeatherMap:

    openWeatherMap_API_key = '66d8dd58fe4ab3e2cbf275d5aee1d85b'

    coords = ()

    def __init__(self):
        #self.geo = "http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={API_key}"
        self.url = "http://api.openweathermap.org/data/2.5/{mode}?lat={lat}&lon={lon}&units={units}&lang={language}&appid={API_key}"
        self.json = {}

    def geoloc(self, city):
        url = self.geo.format(API_key=self.openWeatherMap_API_key, city=city)
        self.json = requests.get(url).json()
        coords = (self.json[0]['lat'], self.json[0]['lon'])
        return coords

    def set_up(self, lat, lon, mode, units, language):
        url = self.url.format(API_key=self.openWeatherMap_API_key, lat=lat, lon=lon, mode=mode, units=units, language=language)
        self.json = requests.get(url).json()
        #coords = (self.json[0]['lat'], self.json[0]['lon'])
        #url = self.url.format(API_key=self.openWeatherMap_API_key, mode=mode, lat=coords[0], lon=coords[1], units=units, language=language)
        #self.json = requests.get(url).json()
        return self.json
    

        # get_ HAS TO MATCH set_up MODE

    def get_weather(self, category, key):
        if category == 'weather':
            return self.json[category][0][key]
        else:
            return self.json[category][key]

    def get_forecast(self, category, key):
        data_list = self.json['list']

        if category == 'weather':
            data = []
            for i in range(0,39):
                data.append(data_list[i][category][0][key])
            return data

        else:
            if key == None:
                data = []
                for i in range(0,39):
                    data.append(data_list[i][category])
                return data
            else:
                data = []
                for i in range(0,39):
                    data.append(data_list[i][category][key])
                return data

    def get_forecast_improved(self):
        data = []
        for i in range(0,40):
            parse = {
                'temperature': self.json['list'][i]['main']['temp'],
                'weather': self.json['list'][i]['weather'][0]['main'],
                'icon': 'http://openweathermap.org/img/wn/' + self.json['list'][i]['weather'][0]['icon'] + '@2x.png',
                'date': self.json['list'][i]['dt'],
                'timezone': self.json['city']['timezone']
            }
            data.append(parse)
        return data

