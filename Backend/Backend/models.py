# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Station(models.Model):
    station_id = models.AutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    station_name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'station'


class Measurement(models.Model):
    measurement_id = models.AutoField(primary_key=True)
    station = models.ForeignKey('Station', models.PROTECT)
    time_utc = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'measurement'


class Pollutiondictionary(models.Model):
    pollution_dict_id = models.AutoField(primary_key=True)
    pollution_name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'pollutiondictionary'


class Pollution(models.Model):
    pollution_id = models.AutoField(primary_key=True)
    measurement = models.ForeignKey(Measurement, models.PROTECT)
    pollution_dict = models.ForeignKey('Pollutiondictionary', models.PROTECT)
    measurement_value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pollution'


class Weatherdictionary(models.Model):
    weather_dict_id = models.AutoField(primary_key=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'weatherdictionary'


class Weather(models.Model):
    weather_id = models.AutoField(primary_key=True)
    measurement = models.ForeignKey(Measurement, models.PROTECT)
    weather_dict = models.ForeignKey('Weatherdictionary', models.PROTECT)
    measurement_value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'weather'
