from flask import Flask, jsonify
from db import query_one

app = Flask(__name__)

@app.route("/")
def home():
    try:
        result = query_one("SELECT NOW() AS time;")
        return jsonify({
            "status": "ok",
            "database_time": result["time"]
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
