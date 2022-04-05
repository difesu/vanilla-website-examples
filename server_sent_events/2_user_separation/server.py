
from flask import Flask, Response
from time import sleep
#based on https://medium.com/code-zen/python-generator-and-html-server-sent-events-3cdf14140e56

app = Flask(__name__)

colors = ["red", "green", "blue", "black"]


def eventStream(user_id=1):
    count = 0
    while True:
        count += 1
        if count % user_id != 0:
            sleep(1)
            continue
        yield "data: {}\n\n".format(count)
        if count % 5 == 0:
            target_color = colors[count % len(colors)]
            data = target_color
            event_name = "color-change"

            yield f"event: {event_name}\ndata: {data}\n\n"
        sleep(1)


@app.route("/stream/<int:user_id>")
def sse_stream(user_id):
    response = Response(eventStream(user_id), mimetype="text/event-stream")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
