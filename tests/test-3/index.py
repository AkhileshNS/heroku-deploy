# IMPORTS
import os
from flask import Flask
app = Flask(__name__)
port = int(os.environ.get("PORT", 8080))

@app.route('/')
def hello_handler():
    f = open("data.json");
    return f.read()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
