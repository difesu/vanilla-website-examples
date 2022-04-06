
from flask import Flask, Response
from time import sleep
from datetime import datetime as dt
#based on https://medium.com/code-zen/python-generator-and-html-server-sent-events-3cdf14140e56

app = Flask(__name__)


def eventStream():
    count = 0
    while True:
        count += 1
        data = f"{count};{dt.now()};useless string"
        yield f"data: {data}\n\n"
        sleep(2)


@app.route("/stream")
def sse_stream():
    response = Response(eventStream(), mimetype="text/event-stream")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
