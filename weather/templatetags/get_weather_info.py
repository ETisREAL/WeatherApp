from django import template
from weather.utils import current_weather_data
import datetime
import json

register = template.Library()


@register.simple_tag
def get_weather(city, units, language):
    return current_weather_data(city, units, language)


@register.simple_tag
def get_json(city, units, language):
    data = current_weather_data(city, units, language)
    return json.dumps(data)


@register.simple_tag
def destructure(dictionary, category, key):
    if category == 'location' and key == 'time':
        unix = dictionary['location']['time']
        formatted = datetime.datetime.utcfromtimestamp(unix).strftime('%a %H:%M')
        unix = datetime.date.fromtimestamp(int(unix))
        #return strptime(unix, '%B %d %Y')
        return formatted
    return dictionary[category][key]