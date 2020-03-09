from flask import Blueprint, request, jsonify
from static.constants import *
import threading,time
from static.dataPool import setdata,getdata,deletedata
data_api = Blueprint('data_api', __name__)

def get_data_thread():
    for message in consumer:
        map_key = str(message.key)[2:len(str(message.key)) - 1]
        setdata(map_key, message.value)

@data_api.route("/retrieveData", methods=['POST'])
def retrieve_data():
    try:
        # Fetching data from post body
        data = request.json
        print("data")
        headers = request.headers
        payload = JwtHandler.decode_auth_token(headers['Authorization'])
        if not payload:
            return jsonify({'error': "JWT invalid"})

        generated_map_key = generate_keys_for_user(headers['email'], "retrieve_data_service")
        producer.send('retrieve_data_service',
                      key=bytes(generated_map_key, 'utf-8'), value=data)
        thread1 = threading.Thread(target=get_data_thread)
        thread1.start()
        counter = 0
        while True:
            if generated_map_key in getdata():
                consumer_value = getdata()[generated_map_key]
                consumer_value = str(consumer_value, 'utf-8')
                consumer_value = consumer_value.replace('\\', "")
                consumer_value = consumer_value[1:-1]
                consumer_value = json.loads(consumer_value)
                consumer_value['latitude'] = float(consumer_value['latitude'])
                consumer_value['longitude'] = float(consumer_value['longitude'])
                consumer_value["center"]['lat'] = float(consumer_value["center"]['lat'])
                consumer_value["center"]['lng'] = float(consumer_value["center"]['lng'])
                deletedata(generated_map_key)
                return jsonify(consumer_value), 200
            counter += 1
            if (counter > 20):
                return jsonify({'ApiCall': "request timeout"}), 200
            time.sleep(5)
    except Exception as e:
        return jsonify({'Error': str(e)}), 200

@data_api.route("/retrieveDataViz", methods=['POST'])
def retrieve_data_viz():
    try:
        data = request.json
        print("viz")
        headers = request.headers
        payload = JwtHandler.decode_auth_token(headers['Authorization'])
        if not payload:
            return jsonify({'error': "JWT invalid"})

        topic = "retrieve_data_viz_service"
        generated_map_key = generate_keys_for_user(headers['email'], topic)
        producer.send(topic,
                      key=bytes(generated_map_key, 'utf-8'), value=data)
        producer.send('session_management_and_logging_service', key=bytes("user_log", 'utf-8'), value={	
            "user_action" : "User retrived data viz",
	        "session_id" : str(headers["session_id"])})

        thread1 = threading.Thread(target=get_data_thread)
        thread1.start()
        counter = 0
        while True:
            if generated_map_key in getdata():
                thread_use = 0
                consumer_value = getdata()[generated_map_key]
                deletedata(generated_map_key)
                return jsonify(consumer_value), 200
            counter += 1
            if (counter > 9):
                return jsonify({'ApiCall': "request timeout"}), 200
            time.sleep(5)
    except Exception as e:
        return jsonify({'Error': str(e)}), 200

@data_api.route("/retrieveDataFuture", methods=['POST'])
def retrieve_data_future():
    try:
        data = request.json
        headers = request.headers
        payload = JwtHandler.decode_auth_token(headers['Authorization'])
        if not payload:
            return jsonify({'error': "JWT invalid"})

        topic = "retrieve_data_future_service"
        generated_map_key = generate_keys_for_user(headers['email'], topic)
        producer.send(topic,
                      key=bytes(generated_map_key, 'utf-8'), value=data)
        producer.send('session_management_and_logging_service', key=bytes("user_log", 'utf-8'), value={	
            "user_action" : "User retrived data future",
	        "session_id" : str(headers["session_id"])})
        thread1 = threading.Thread(target=get_data_thread)
        thread1.start()
        counter = 0
        print("future")
        while True:
            if generated_map_key in getdata():
                consumer_value = getdata()[generated_map_key]
                consumer_value = str(consumer_value, 'utf-8')
                consumer_value = consumer_value.replace('\\', "")
                consumer_value = json.loads(consumer_value)
                consumer_value['latitude'] = float(consumer_value['latitude'])
                consumer_value['longitude'] = float(consumer_value['longitude'])
                consumer_value["center"]['lat'] = float(consumer_value["center"]['lat'])
                consumer_value["center"]['lng'] = float(consumer_value["center"]['lng'])
                deletedata(generated_map_key)
                return jsonify(consumer_value), 200
            counter += 1
            if (counter > 6):
                return jsonify({'ApiCall': "request timeout"}), 200
            time.sleep(5)
    except Exception as e:
        return jsonify({'Error': str(e)}), 200



