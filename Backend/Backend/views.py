from django.template.response import TemplateResponse
from django.http import HttpResponse
from Backend.models import *
from django.core import serializers
from django.http import JsonResponse


def stations(request):
    all_stations = Station.objects.all()
    data = serializers.serialize('json', all_stations)
    return JsonResponse(data, safe=False)


def index(request):
    html = """<h1>Data Flair Django</h1>Hello, you just configured your First URL"""
    return HttpResponse(html)
