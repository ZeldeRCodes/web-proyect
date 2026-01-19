from flask import Flask, request, jsonify, render_template
from db import query_one, query_all, execute
import os
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")

# -----------------------------
# FRONTEND
# -----------------------------
@app.route("/")
def serve_frontend():
    return render_template("index.html")


# -----------------------------
# CREAR TIERLIST
# -----------------------------
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


# -----------------------------
# AGREGAR RANGO
# -----------------------------
@app.route("/api/tierlists/<tierlist_id>/ranges", methods=["POST"])
def add_range(tierlist_id):
    data = request.get_json()

    label = data.get("label")
    color = data.get("color")
    position = data.get("position")

    if not label or not color or position is None:
        return jsonify({"error": "label, color y position son obligatorios"}), 400

    range_id = str(uuid.uuid4())

    execute(
        """
        INSERT INTO tierlist_ranges (id, tierlist_id, label, color, position)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (range_id, tierlist_id, label, color, position)
    )

    return jsonify({
        "id": range_id,
        "tierlist_id": tierlist_id,
        "label": label,
        "color": color,
        "position": position
    }), 201


# -----------------------------
# AGREGAR ITEM
# -----------------------------
@app.route("/api/tierlists/<tierlist_id>/items", methods=["POST"])
def add_item(tierlist_id):
    data = request.get_json()

    image_url = data.get("image_url")
    label = data.get("label")

    if not image_url:
        return jsonify({"error": "image_url es obligatorio"}), 400

    item_id = str(uuid.uuid4())

    execute(
        """
        INSERT INTO tierlist_items (id, tierlist_id, image_url, label)
        VALUES (%s, %s, %s, %s)
        """,
        (item_id, tierlist_id, image_url, label)
    )

    return jsonify({
        "id": item_id,
        "tierlist_id": tierlist_id,
        "image_url": image_url,
        "label": label
    }), 201


# -----------------------------
# OBTENER TIERLIST COMPLETA
# -----------------------------
@app.route("/api/tierlists/<tierlist_id>", methods=["GET"])
def get_tierlist(tierlist_id):
    tierlist = query_one(
        "SELECT * FROM tierlists WHERE id = %s",
        (tierlist_id,)
    )

    if not tierlist:
        return jsonify({"error": "Tierlist no encontrada"}), 404

    ranges = query_all(
        "SELECT * FROM tierlist_ranges WHERE tierlist_id = %s ORDER BY position ASC",
        (tierlist_id,)
    )

    items = query_all(
        "SELECT * FROM tierlist_items WHERE tierlist_id = %s",
        (tierlist_id,)
    )

    return jsonify({
        "tierlist": tierlist,
        "ranges": ranges,
        "items": items
    })


# -----------------------------
# INICIO DEL SERVIDOR
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)

