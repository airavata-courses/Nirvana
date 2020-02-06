from flask import Flask
from flask_cors import CORS
from controllers.login_controller import login_api
from controllers.data_controller import data_api
from static.constants import *
import threading
import time

app = Flask(__name__, static_url_path='/static')
app.config.from_object(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(login_api)
app.register_blueprint(data_api)



def consumer_thread():
    for message in consumer:
        map_key = str(message.key)[2:len(str(message.key))-1]
        GlobalMap[map_key] = message.value
        print(message)


thread1 = threading.Thread(target = consumer_thread)
thread1.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

