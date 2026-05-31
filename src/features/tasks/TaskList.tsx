import { useEffect, useState } from "react";
import { TaskItem } from "./TaskItem";
import type { Task } from "../../types/task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
} from "../../api/taskApi";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Load tasks from Flask API
  useEffect(() => {
    async function load() {
      const data = await getTasks();
      setTasks(data);
    }

    load();
  }, []);

  // TOGGLE task (server-driven)
  async function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await updateTask({
      ...task,
      completed: !task.completed,
    });

    const updated = await getTasks();
    setTasks(updated);
  }

  // DELETE task (server-driven)
  async function deleteTask(id: string) {
    await apiDeleteTask(id);

    const updated = await getTasks();
    setTasks(updated);
  }

  // ADD task (server-driven)
  async function addTask() {
    if (!newTaskTitle.trim()) return;

    await createTask(newTaskTitle);

    const updated = await getTasks();
    setTasks(updated);

    setNewTaskTitle("");
  }

  // EDIT task (server-driven)
  async function editTask(id: string, newTitle: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await updateTask({
      ...task,
      title: newTitle,
    });

    const updated = await getTasks();
    setTasks(updated);
  }

  return (
    <div>
      <h2>Tasks</h2>

      <input
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task title"
      />

      <button onClick={addTask}>Add Task</button>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      ))}
    </div>
  );
}