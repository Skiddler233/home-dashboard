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
  onEdit
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  
  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button
            onClick={() => {
              onEdit(task.id, editTitle);
              setIsEditing(false);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditTitle(task.title);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {task.title}

          <button onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button onClick={() => onDelete(task.id)}>
            Delete
          </button>

        </>
      )}
    </div>
  );
}