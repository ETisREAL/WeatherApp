from django.urls import path
from .views import home_view, forecast_view, prediction_view, PredictionView


app_name = 'weather'

urlpatterns = [
    path('', home_view, name='home'),
    path('forecast/', forecast_view, name='forecast'),
    path('prediction/', prediction_view, name='prediction')
]