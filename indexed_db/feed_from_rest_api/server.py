
from flask import Flask, Response
from time import sleep
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/table")
def sse_stream():
    response = '''[{ "id": 1, "column1": "c1v1", "column2": "c2v1" },
    { "id": 2, "column1": "c1v1", "column2": "c2v2" },
    { "id": 3, "column1": "c1v2", "column2": "c2v3" },
    { "id": 4, "column1": "c1v3", "column2": "c2v4" }]'''
    return Response(response, mimetype="application/json")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
