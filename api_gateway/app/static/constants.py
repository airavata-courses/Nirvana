import json
from kafka import KafkaConsumer
from kafka import KafkaProducer
from handlers.crypto_handler import CryptoHandler
from handlers.jwt_handler import JwtHandler
from flask import Blueprint, request, jsonify
from kafka.admin import KafkaAdminClient
jwthandler = JwtHandler()

KAFKA_HOSTS = ['kafka1:9092']
KAFKA_VERSION = (0, 10)

def generate_keys_for_user(user_email, user_service_task):
    encoded_email = ''.join(str(ord(c)) for c in user_email)
    generated_key = encoded_email + "_" + user_service_task
    return generated_key


consumer = KafkaConsumer("API_Consumer", auto_offset_reset='earliest', group_id='kafkagroupid', enable_auto_commit=True,
						 bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION)
producer = KafkaProducer(bootstrap_servers=KAFKA_HOSTS, api_version=KAFKA_VERSION,value_serializer=lambda m: json.dumps(m).encode('ascii'))
admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_HOSTS, client_id='test')
