from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient
import json

KAFKA_HOSTS = ['kafka1:9092']
KAFKA_VERSION = (0, 10)
topic = "retrieve_data_viz_service"
consumer = KafkaConsumer(topic, auto_offset_reset='earliest', group_id='kafkagroupid', enable_auto_commit=True,
						 bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION)
producer = KafkaProducer(bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION,value_serializer=lambda m: json.dumps(m).encode('ascii'))
admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_HOSTS, client_id='test')
