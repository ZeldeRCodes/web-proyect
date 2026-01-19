from flask import Flask, request, jsonify
from db import query_one, execute
import os
import uuid

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
        return jsonify({"status": "error", "message": str(e)}), 500


# Crear tierlist básica
@app.route("/api/tierlists", methods=["POST"])
def create_tierlist():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"error": "El título es obligatorio"}), 400

    tierlist_id = str(uuid.uuid4())

    execute(
        "INSERT INTO tierlists (id, user_id, title, description) VALUES (%s, %s, %s, %s)",
        (tierlist_id, None, title, description)
    )

    return jsonify({
        "id": tierlist_id,
        "title": title,
        "description": description
    }), 201


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)


