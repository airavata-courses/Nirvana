from static.constants import *
session_api = Blueprint('session_api', __name__)

@session_api.route("/logUserTask", methods=['POST'])
def call_login_microservice():
    try:
        # Fetching data from post body
        data = request.get_json()
        headers = request.headers
        payload = JwtHandler.decode_auth_token(headers['Authorization'])
        if not payload:
            return jsonify({'error': "JWT invalid"}), 500
        producer.send('session_management_and_logging_service', key=bytes("user_log", 'utf-8'), value=data)
        return jsonify({'ApiCall': "logged"}), 200
    except Exception as e:
        return jsonify({'errorMessage': str(e)}), 500

