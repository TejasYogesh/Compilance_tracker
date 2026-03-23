"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  // Load clients
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients);
  }, []);

  // Load tasks
  const loadTasks = async (clientId: string) => {
    const res = await fetch(`/api/tasks/${clientId}`);
    const data = await res.json();
    setTasks(data);
  };

  // Add Task
  const handleAddTask = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        client_id: selectedClient,
        title: form.get("title"),
        due_date: form.get("due_date"),
        category: form.get("category"),
        priority: form.get("priority"),
      }),
    });

    e.target.reset();
    loadTasks(selectedClient!);
  };

  // Update Status
  const updateStatus = async (id: string) => {
    await fetch("/api/tasks/update", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        status: "completed",
      }),
    });

    loadTasks(selectedClient!);
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mini Compliance Tracker</h1>

      {/* CLIENTS */}
      <h2 className="font-semibold mb-2">Clients</h2>
      <div className="flex gap-2 mb-6 flex-wrap">
        {clients.map((c) => (
          <button
            key={c.id}
            className={`px-3 py-1 border rounded ${
              selectedClient === c.id ? "bg-blue-200" : ""
            }`}
            onClick={() => {
              setSelectedClient(c.id);
              loadTasks(c.id);
            }}
          >
            {c.company_name}
          </button>
        ))}
      </div>

      {/* ADD TASK */}
      {selectedClient && (
        <form onSubmit={handleAddTask} className="mb-6 space-x-2">
          <input
            name="title"
            placeholder="Task title"
            className="border p-1"
            required
          />
          <input type="date" name="due_date" className="border p-1" />
          <input
            name="category"
            placeholder="Category"
            className="border p-1"
          />
          <input
            name="priority"
            placeholder="Priority"
            className="border p-1"
          />
          <button className="bg-blue-500 text-white px-3 py-1">Add Task</button>
        </form>
      )}

      {/* FILTER */}
      {selectedClient && (
        <div className="mb-4">
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* TASKS */}
      {filteredTasks.map((task) => {
        const isOverdue =
          task.status === "pending" &&
          task.due_date &&
          new Date(task.due_date) < new Date();

        return (
          <div
            key={task.id}
            className={`border p-3 mb-2 rounded ${
              isOverdue ? "bg-red-200" : ""
            }`}
          >
            <h3 className="font-semibold">{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Due: {task.due_date}</p>

            {task.status === "pending" && (
              <button
                onClick={() => updateStatus(task.id)}
                className="text-blue-600 mt-1"
              >
                Mark Complete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
