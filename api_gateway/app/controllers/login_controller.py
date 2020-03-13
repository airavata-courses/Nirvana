from static.constants import *
import time
import threading
from static.dataPool import getdata, deletedata, setdata
import click

login_api = Blueprint('login_api', __name__)

def get_data_thread():
    for message in consumer:
        print(message)
        map_key = str(message.key)[2:len(str(message.key)) - 1]
        setdata(map_key, message.value)

@login_api.route("/authenticateUser", methods=['POST'])
def call_login_microservice():
    try:
        # Fetching data from post body
        data = request.get_json()
        click.echo("got data AUTHENTICATE USER LINK: ")
        generated_map_key = generate_keys_for_user(data['email'], "login_service")
        generated_map_key2 = generate_keys_for_user(data['email'],"session_service")
        producer.send('authentication_login', key=bytes(generated_map_key, 'utf-8'), value=data)
        click.echo("AUTHENTICATE USER PRODUCER SEND SUCCESS!!")
        thread1 = threading.Thread(target=get_data_thread)
        thread1.start()
        counter = 0
        while True:
            if generated_map_key in getdata():
                consumer_value = getdata()[generated_map_key]
                deletedata(generated_map_key)
                if (str(consumer_value, 'utf-8') == "login Successful"):
                    jwt_token = jwthandler.encode_auth_token(data['email'])
                    while True:
                        if generated_map_key2 in getdata():
                            consumer_value2 = getdata()[generated_map_key2]
                            deletedata(generated_map_key2)
                            return jsonify({'jwt': str(jwt_token, 'utf-8'),
                                            'sessionId': str(consumer_value2, 'utf-8'), 'ApiCall': "login Successful"}), 200
                else:
                    return jsonify({'ApiCall': str(consumer_value, 'utf-8')}), 200

            counter += 1
            if (counter > 6):
                return jsonify({'ApiCall': "request timeout"}), 500
            time.sleep(5)
        return jsonify({'ApiCall': "im broke"}), 500
    except Exception as e:
        return jsonify({'errorMessage': str(e)}), 500


@login_api.route("/signUpUser", methods=['POST'])
def call_signup_microservice():
    try:
        # Fetching data from post body
        data = request.get_json()
        generated_map_key = generate_keys_for_user(data['email'], "signup_service")
        producer.send('authentication_signup',
                      key=bytes(generated_map_key, 'utf-8'), value=data)

        thread1 = threading.Thread(target=get_data_thread)
        thread1.start()
        counter = 0
        while True:
            if generated_map_key in getdata():
                consumer_value = getdata()[generated_map_key]
                deletedata(generated_map_key)
                return jsonify({'ApiCall': str(consumer_value, 'utf-8')}), 200
            counter += 1
            if (counter > 6):
                return jsonify({'ApiCall': "request timeout"}), 500
            time.sleep(5)
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
