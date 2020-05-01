import json
from kafka import KafkaConsumer
from kafka import KafkaProducer
from bson import json_util

KAFKA_HOSTS = ['kafka:9092']

KAFKA_VERSION = (0, 10)
consumer = KafkaConsumer("retrieve_data_future_service", auto_offset_reset='earliest', group_id='kafkagroupid',
                         enable_auto_commit=True,
                         bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION)
producer = KafkaProducer(bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION,
                         value_serializer=lambda m: json.dumps(m, default=json_util.default).encode('utf-8'))
