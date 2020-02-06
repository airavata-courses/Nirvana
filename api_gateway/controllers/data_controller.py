from flask import Blueprint, request, jsonify
from static.constants import *

data_api = Blueprint('data_api', __name__)
@data_api.route("/retrieveData", methods=['GET'])
def retrieve_data():
    try:
        # Fetching data from post body
        data = request.json
        headers = request.headers
        print(headers)
        payload = JwtHandler.decode_auth_token(headers['Authorization'])
        if not payload:
            return jsonify({'error': "JWT invalid"})

        generated_map_key = generate_keys_for_user(headers['email'], "retrieve_data_service")
        GlobalMap[generated_map_key] = "waiting"
        producer.send('retrieve_data_service',
                      key=bytes(generated_map_key, 'utf-8'), value=data)

        while (GlobalMap[generated_map_key] == "waiting"):
            ## wait for the data to process
            pass

        print(type(GlobalMap[generated_map_key]))
        return_message = str(GlobalMap[generated_map_key], 'UTF-8')
        del GlobalMap[generated_map_key]
        return jsonify({'ApiCall': return_message}), 500
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
