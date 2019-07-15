import mysql.connector
import csv
from datetime import timedelta
import dateutil.parser

cnx = mysql.connector.connect(user='user',
                              host='35.189.123.186',
                              database='airpollution')
cursor = cnx.cursor()

add_pollution_dict = ("INSERT INTO pollutiondictionary (pollution_name) VALUES (%s)")

add_weather_dict = ("INSERT INTO weatherdictionary (component_name) VALUES (%s)")

add_measurement = ("INSERT INTO measurement (station_id, time_utc) VALUES (%s, DATE_FORMAT(%s, '%Y-%m-%d %H:%i:%S'))")

add_pollution = ("INSERT INTO pollution (measurement_id, pollution_dict_id, measurement_value) VALUES (%s, %s, %s)")

add_weather = ("INSERT INTO weather (measurement_id, weather_dict_id, measurement_value) VALUES (%s, %s, %s)")


def gios(filepath):
    # filename = 'C:\\Users\\jjanm\\Documents\\Studia\\Inżynierka\\air_quality\\gios_observations_2012_2018.csv'
    with open(filepath, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            print(row)
            station_id = -1
            st = row['station_id']
            st_id = st.split(' ')[0]
            if st_id == 'gios_bujaka':
                station_id = 955
            elif st_id == 'gios_bulwarowa':
                station_id = 956
            elif st_id == 'gios_krasinskiego':
                station_id = 957
            time = row['measurement_time']
            s = time.split('+')
            dt = dateutil.parser.parse(s[0])
            h = int(s[1])
            datetime = dt + timedelta(hours=h)

            data_measurement = (station_id, str(datetime))
            cursor.execute(add_measurement, data_measurement)
            mid = cursor.lastrowid

            pm25 = row['pm2_5']
            if pm25 != '':
                pm25 = float(pm25)
                data_pollution = (mid, 6, pm25)
                cursor.execute(add_pollution, data_pollution)

            pm10 = row['pm10']
            if pm10 != '':
                pm10 = float(pm10)
                data_pollution = (mid, 7, pm10)
                cursor.execute(add_pollution, data_pollution)
            cnx.commit()
        cursor.close()
        cnx.close()


def airly(filepath):
    # filename = 'C:\\Users\\jjanm\\Documents\\Studia\\Inżynierka\\air_quality\\airly_observations_2017.csv'
    with open(filepath, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            print(row)
            station_id = row['station_id']
            time = row['utc_time']
            datetime = dateutil.parser.parse(time)

            data_measurement = (station_id, str(datetime))
            cursor.execute(add_measurement, data_measurement)
            mid = cursor.lastrowid

            pm1 = row['pm1']
            if pm1 != '':
                pm1 = float(pm1)
                data_pollution = (mid, 5, pm1)
                cursor.execute(add_pollution, data_pollution)

            pm25 = row['pm2_5']
            if pm25 != '':
                pm25 = float(pm25)
                data_pollution = (mid, 6, pm25)
                cursor.execute(add_pollution, data_pollution)

            pm10 = row['pm10']
            if pm10 != '':
                pm10 = float(pm10)
                data_pollution = (mid, 7, pm10)
                cursor.execute(add_pollution, data_pollution)

            temp = row['temperature']
            if temp != '':
                temp = float(temp)
                data_weather = (mid, 7, temp)
                cursor.execute(add_weather, data_weather)

            humidity = row['humidity']
            if humidity != '':
                humidity = float(humidity)
                data_weather = (mid, 8, humidity)
                cursor.execute(add_weather, data_weather)

            pre = row['pressure']
            if pre != '':
                pre = float(pre)
                data_weather = (mid, 9, pre)
                cursor.execute(add_weather, data_weather)
            cnx.commit()
        cursor.close()
        cnx.close()


def imgw(filepath, type):
    # filename = 'C:\\Users\\jjanm\\Documents\\Studia\\Inżynierka\\Meteo_2017-01\\B00202A_2017_01.csv'
    with open(filepath, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=';')
        for row in csv_reader:
            is_station = False
            print(row)
            if row['station'] == str(250190470):
                station_id = 958
                is_station = True
            elif row['station'] == str(350190566):
                station_id = 959
                is_station = True
            if is_station:
                time = row['utc_time']
                datetime = dateutil.parser.parse(time)
                data_measurement = (station_id, str(datetime))
                cursor.execute(add_measurement, data_measurement)
                mid = cursor.lastrowid

                val = row['value']
                if val != '':
                    val = float(val)
                    data_weather = (mid, type, val)
                    cursor.execute(add_weather, data_weather)
            cnx.commit()
        cursor.close()
        cnx.close()
