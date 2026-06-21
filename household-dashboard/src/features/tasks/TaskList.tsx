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

  useEffect(() => {
    async function load() {
      const data = await getTasks();
      setTasks(data);
    }

    load();
  }, []);

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

  async function deleteTask(id: string) {
    await apiDeleteTask(id);

    const updated = await getTasks();
    setTasks(updated);
  }

  const addTask = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask(newTaskTitle);

    const updated = await getTasks();
    setTasks(updated);

    setNewTaskTitle("");
  }

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

  const openCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="task-list">
      <form className="task-form" onSubmit={addTask}>
        <input
          className="input"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      <div className="task-meta">
        <span className="task-count">
          {openCount} open · {tasks.length} total
        </span>
      </div>

      <ul className="task-items">
        {tasks.length === 0 ? (
          <li className="task-empty">No tasks yet. Add one above.</li>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))
        )}
      </ul>
    </div>
  );
}
