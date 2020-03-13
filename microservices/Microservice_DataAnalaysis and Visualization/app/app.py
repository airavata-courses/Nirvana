from statics import consumer,producer
import json
import datetime
import os
import base64
from generate import generate_dates, generate_graph, generate_array_of_dates


for message_in_consumer in consumer:
        key = str(message_in_consumer.key)[2:len(str(message_in_consumer.key)) - 1]
        message = str(message_in_consumer.value, 'utf-8')
        message = json.loads(message)

        city_name = message['city_name']
        from_date = json.loads(message['from_date'])
        to_date = json.loads(message['to_date'])
        message["records"] = json.loads(message["records"])
        print(message['records'])
        temprature_recordings = message['records']['temprature']
        precipitation_recordings = message['records']['precipitation']
        humidity_recordings = message['records']['humidity']
        wind_speed_recordings = message['records']['wind_speed']
        array_of_dates = generate_array_of_dates(from_date,to_date)
        print(temprature_recordings)

        data_to_send ={}
        data_to_send["temprature_recordings"] = generate_graph(city_name, array_of_dates,temprature_recordings,key,"temprature_recordings")
        data_to_send["precipitation_recordings"] = generate_graph(city_name, array_of_dates, precipitation_recordings, key, "precipitation_recordings")
        data_to_send["humidity_recordings"] = generate_graph(city_name, array_of_dates, humidity_recordings, key, "humidity_recordings")
        data_to_send["wind_speed_recordings"] = generate_graph(city_name, array_of_dates, wind_speed_recordings, key, "wind_speed_recordings")

        producer.send("API_Consumer",
                      key=bytes(key, 'utf-8'), value=data_to_send)

