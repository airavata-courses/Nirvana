import json
from kafka import KafkaConsumer
from kafka import KafkaProducer
from bson import json_util
from dark_sky_api_call import darksky_api_call
KAFKA_HOSTS = ['kafka1:9092']

KAFKA_VERSION = (0, 10)
consumer = KafkaConsumer("retrieve_data_service", auto_offset_reset='earliest', group_id='kafkagroupid', enable_auto_commit=True,
						 bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION)
producer = KafkaProducer(bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION,value_serializer=lambda m: json.dumps(m,default=json_util.default).encode('utf-8'))
for message_in_consumer in consumer:
    message = str(message_in_consumer.value, 'utf-8')
    message = json.loads(message)
    print(message)
    city_name = message['city_name']
    from_date = json.loads(message['from_date'])
    to_date = json.loads(message['to_date'])
    print("******* data to send ************")
    data_to_send = darksky_api_call(city_name, from_date, to_date)
    data_to_send = json.dumps(data_to_send)
    print(data_to_send)
    producer.send("API_Consumer", key=message_in_consumer.key, value=data_to_send)
'''
1. convert city name to lat long
2. if to_date == null that means only one date is asked for
3. if from_date, to_date == null means current weather report is asked
4. flags will consist of temprature, precipitation, humidity, pressure, windspeed, visibility, dewpoint so send the user whatever flags are true
5. iterate to loop if to and from dates are present and prepare the json data to be sent in the producer.
6. get 150 cities data of temprature, precipitation, humidity, pressure, windspeed, visibility, dewpoint (hardcoded) (only for one day) (reduce to 5)
7. prepare your own dataset as you explore through the data.
'''
