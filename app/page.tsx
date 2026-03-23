"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients);
  }, []);

  const loadTasks = async (clientId: string) => {
    const res = await fetch(`/api/tasks/${clientId}`);
    const data = await res.json();
    setTasks(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Clients</h1>

      <div className="flex gap-2 mb-6">
        {clients.map((c: any) => (
          <button
            key={c.id}
            className="border px-3 py-1"
            onClick={() => {
              setSelectedClient(c.id);
              loadTasks(c.id);
            }}
          >
            {c.company_name}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Tasks</h2>

      {tasks.map((task: any) => {
        const isOverdue =
          task.status === "pending" && new Date(task.due_date) < new Date();

        return (
          <div
            key={task.id}
            className={`border p-2 mb-2 ${isOverdue ? "bg-red-200" : ""}`}
          >
            <p>{task.title}</p>
            <p>Status: {task.status}</p>

            <button
              onClick={async () => {
                await fetch("/api/tasks/update", {
                  method: "PATCH",
                  body: JSON.stringify({
                    id: task.id,
                    status: "completed",
                  }),
                });
                loadTasks(selectedClient!);
              }}
              className="text-blue-500"
            >
              Mark Complete
            </button>
          </div>
        );
      })}
    </div>
  );
}
