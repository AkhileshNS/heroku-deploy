# IMPORTS
from os import environ
from json import dumps
from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_handler():
    return dumps(dict(environ))

# $env:FLASK_APP="index.py";flask run
# export FLASK_APP=index.py && flask run
