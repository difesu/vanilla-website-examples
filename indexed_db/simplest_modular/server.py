
from flask import Flask, make_response, send_from_directory

app = Flask(__name__)


@app.route("/js/<string:filename>")
def serve_js_file(filename):
    response = make_response(send_from_directory(".", filename))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
