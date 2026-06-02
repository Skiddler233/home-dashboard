from database import SessionLocal
from models import Task
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
    db = SessionLocal()
    
    try:
        tasks = db.query(Task).all()
        return jsonify([{
            "id": task.id,
            "title": task.title,
            "completed": task.completed,
            "createdAt": task.createdAt
        } for task in tasks])
    finally:
        db.close()

# -------------------------
# CREATE task
# -------------------------
@app.route("/api/tasks", methods=["POST"])
def create_task():
    db = SessionLocal()
    
    try:
        data = request.json
        
        task = Task(
            id=str(uuid.uuid4()),
            title=data["title"],
            completed=False,
            createdAt=datetime.utcnow().isoformat()
        )
        
        db.add(task)
        db.commit()
        
        return jsonify({
            "id": task.id,
            "title": task.title,
            "completed": task.completed,
            "createdAt": task.createdAt
        }), 201
        
    finally:
        db.close()

# -------------------------
# UPDATE task
# -------------------------
@app.route("/api/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):
    db = SessionLocal()
    
    try: 
        data = request.json

        task = db.query(Task).filter(Task.id == task_id).first()
        
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        task.title = data["title"]
        task.completed = data["completed"]
        
        db.commit()
        
        return jsonify({
            "id": task.id,
            "title": task.title,
            "completed": task.completed,
            "createdAt": task.createdAt
        })
        
    finally:
        db.close()

# -------------------------
# DELETE task
# -------------------------
@app.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    db = SessionLocal()
    
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        db.delete(task)
        db.commit()
        
        return "", 204
    
    finally:
        db.close()

# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)