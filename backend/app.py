from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -------------------------
# In-memory database
# -------------------------
tasks = []

# -------------------------
# GET all tasks
# -------------------------
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

# -------------------------
# CREATE task
# -------------------------
@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json

    task = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "completed": False,
        "createdAt": datetime.utcnow().isoformat()
    }

    tasks.append(task)
    return jsonify(task), 201

# -------------------------
# UPDATE task
# -------------------------
@app.route("/api/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json

    for task in tasks:
        if task["id"] == task_id:
            task["title"] = data.get("title", task["title"])
            task["completed"] = data.get("completed", task["completed"])
            return jsonify(task)

    return jsonify({"error": "Task not found"}), 404

# -------------------------
# DELETE task
# -------------------------
@app.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return "", 204

# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)