from flask import Flask, render_template

app = Flask(__name__)

@app.route('/score', methods=["GET"])
def score():
    return render_template("score.html")

@app.route('/hello', methods=["GET"])
def hello():
    return render_template("hello.html")

app.debug = True
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)