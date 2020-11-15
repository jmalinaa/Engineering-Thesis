from django.template.response import TemplateResponse
from django.http import HttpResponse
from Backend.models import *
from django.core import serializers
from django.http import JsonResponse
from django.db import connection
import json

default_radius = 50.0


def stations(request):
    all_stations = Station.objects.all()
    data = serializers.serialize('json', all_stations)
    return JsonResponse(data, safe=False)


def stations_within_radius(request):
    station_id = request.GET.get('station_id')
    radius = request.GET.get('radius')
    if radius is None:
        radius = default_radius
    else:
        radius = float(radius)
    cursor = connection.cursor()
    try:
        params = [int(station_id), float(radius)]
        cursor.execute("CALL stations_within_radius (%s, %s)", params)
        # If args is a list or tuple, %s can be used as a placeholder in the query.
        # If args is a dict, %(name)s can be used as a placeholder in the query.
        result_set = cursor.fetchall()
    finally:
        cursor.close()
    #data = serializers.serialize('json', result_set, fields=['station_id', 'latitude', 'longitude', 'distance_meters'])
    #return JsonResponse(data, safe=False)
    # Serializers are used to serialize the django models only. To serialize simple python data use the built-in json module:
    return JsonResponse(json.dumps(result_set), safe=False)


def station_within_radius_from_coords(request):
    longitude = request.GET.get('longitude')
    latitude = request.GET.get('latitude')
    radius = request.GET.get('radius')
    if radius is None:
        radius = default_radius
    else:
        radius = float(radius)
    cursor = connection.cursor()
    try:
        params = [int(latitude), int(longitude), float(radius)]
        cursor.execute("CALL stations_within_radius (%s, %s, %s)", params)
        # If args is a list or tuple, %s can be used as a placeholder in the query.
        # If args is a dict, %(name)s can be used as a placeholder in the query.
        result_set = cursor.fetchall()
    finally:
        cursor.close()
    return JsonResponse(json.dumps(result_set), safe=False)

