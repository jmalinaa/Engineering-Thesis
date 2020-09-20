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


class CheapStations(models.Model):
    station_id = models.IntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    station_name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'cheap_stations'


class GoodStations(models.Model):
    station_id = models.IntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    station_name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'good_stations'


class Humidity(models.Model):
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'humidity'


# VIEWS:

class MeasurementsWithNames(models.Model):
    pollution_id = models.IntegerField()
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    pollution_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'measurements_with_names'


class PollutionAndWeather(models.Model):
    station_id = models.IntegerField()
    time_utc = models.DateTimeField()
    pollution_value = models.FloatField(blank=True, null=True)
    pollution_name = models.CharField(max_length=45)
    weather_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'pollution_and_weather'


class PollutionAndWeatherCompact(models.Model):
    station_id = models.IntegerField()
    measurement_id = models.IntegerField()
    time_utc = models.DateTimeField()
    value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'pollution_and_weather_compact'


class Pressure(models.Model):
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'pressure'


class StationMeasurements(models.Model):
    station_id = models.IntegerField()
    measurement_id = models.IntegerField()
    time_utc = models.DateTimeField()

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'station_measurements'


class StationMeasurementsWithData(models.Model):
    id = models.AutoField(primary_key=True)
    station_id = models.IntegerField()
    measurement_id = models.IntegerField()
    time_utc = models.DateTimeField()
    pollution_name = models.CharField(max_length=45)
    measurement_value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'station_measurements_with_data'


class StationMeasurementsWithData2(models.Model):
    station_id = models.IntegerField()
    measurement_id = models.IntegerField()
    time_utc = models.DateTimeField()
    pollution_name = models.CharField(max_length=45)
    measurement_value = models.FloatField(blank=True, null=True)
    rowhash = models.CharField(max_length=32, blank=True, primary_key=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'station_measurements_with_data2'


class Temperature(models.Model):
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'temperature'


class WeatherMeasurementData(models.Model):
    station_id = models.IntegerField()
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'weather_measurement_data'


class WindDirection(models.Model):
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'wind_direction'


class WindSpeed(models.Model):
    measurement_id = models.IntegerField()
    measurement_value = models.FloatField(blank=True, null=True)
    component_name = models.CharField(max_length=45)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'wind_speed'
