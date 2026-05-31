import type { Task } from "../../types/task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Buy milk",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Take bins out",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Take Medication",
    completed: true,
    createdAt: new Date().toISOString(),
  },
];