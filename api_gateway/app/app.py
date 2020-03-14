from flask import Flask
from flask_cors import CORS
from controllers.login_controller import login_api
from controllers.data_controller import data_api
from controllers.session_controller import session_api
from static.constants import *
import threading
from threading import Lock
import time
from static.dataPool import setdata
import sys
import click



app = Flask(__name__, static_url_path='/static')
app.config.from_object(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})

## api resgistration
app.register_blueprint(login_api)
app.register_blueprint(data_api)
app.register_blueprint(session_api)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

