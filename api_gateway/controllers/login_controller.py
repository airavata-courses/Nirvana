from static.constants import *

login_api = Blueprint('login_api', __name__)



@login_api.route("/authenticateUser", methods=['POST'])
def call_login_microservice():
    try:
        # Fetching data from post body
        data = request.get_json()
        generated_map_key = generate_keys_for_user(data['email'] , "login_service")
        GlobalMap[generated_map_key] = "waiting"
        producer.send('authentication_login', key=bytes(generated_map_key, 'utf-8'), value=data)

        while(GlobalMap[generated_map_key]=="waiting"):
            ## wait for the data to process
            pass

        if(str(GlobalMap[generated_map_key], 'utf-8') == "login Successful"):
            jwt_token = jwthandler.encode_auth_token(data['email'])
            del GlobalMap[generated_map_key]
            return jsonify({'jwt': str(jwt_token, 'utf-8')}), 500

        else:
            return_message = str(GlobalMap[generated_map_key])
            del GlobalMap[generated_map_key]
            return jsonify({'ApiCall': return_message}), 500

    except Exception as e:
        return jsonify({'errorMessage': str(e)}), 500

@login_api.route("/signUpUser", methods=['POST'])
def call_signup_microservice():
    try:
        # Fetching data from post body
        data = request.get_json()
        generated_map_key = generate_keys_for_user(data['email'], "signup_service")
        GlobalMap[generated_map_key] = "waiting"
        producer.send('authentication_signup',
                      key=bytes(generated_map_key, 'utf-8'), value=data)

        while (GlobalMap[generated_map_key] == "waiting"):
            ## wait for the data to process
            pass

        return_message = str(GlobalMap[generated_map_key])
        del GlobalMap[generated_map_key]
        return jsonify({'ApiCall': return_message}), 500
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
