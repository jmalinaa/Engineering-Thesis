"""Backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from Backend import views
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('stations/', stations),
    path('good_stations/', good_stations),
    path('stations_within_radius/', stations_within_radius),
    path('station_within_radius_from_coords/', station_within_radius_from_coords),
    path('station_measurements_with_data/', station_measurements_with_data),
    path('pollution_and_weather_compact/', pollution_and_weather_compact),
    path('weather_measurement_data/', weather_measurement_data)
]
