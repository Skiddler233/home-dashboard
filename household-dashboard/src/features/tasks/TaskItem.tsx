import { useState } from "react";
import type { Task } from "../../types/task";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  return (
    <li className={`task-item${task.completed ? " task-item--done" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-check__box" aria-hidden="true" />
      </label>

      {isEditing ? (
        <div className="task-edit">
          <input
            className="input input--compact"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <div className="task-actions">
            <button
              className="btn btn-primary btn--compact"
              type="button"
              onClick={() => {
                onEdit(task.id, editTitle);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="btn btn-ghost btn--compact"
              type="button"
              onClick={() => {
                setEditTitle(task.title);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button
              className="btn btn-ghost btn--compact"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn--compact"
              type="button"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
