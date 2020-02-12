from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient

KAFKA_HOSTS = ['localhost:9092']
KAFKA_VERSION = (0, 10)
consumer = KafkaConsumer("API_Consumer", auto_offset_reset='earliest', group_id='kafkagroupid', enable_auto_commit=True,
						 bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION)
producer = KafkaProducer(bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION,value_serializer=lambda m: json.dumps(m).encode('ascii'))
admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_HOSTS, client_id='test')