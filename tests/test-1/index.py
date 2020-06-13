# IMPORTS
from os import environ
from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_handler():
    f = open("data.json");
    return f.read()

# $env:FLASK_APP="index.py";flask run
# export FLASK_APP=index.py && flask run
