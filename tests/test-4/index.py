# IMPORTS
from os import environ
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_handler():
    f = open("data.json");
    return f.read()

@app.route('/health')
def health_handler():
    return "ok"

# $env:FLASK_APP="index.py";flask run
# export FLASK_APP=index.py && flask run
