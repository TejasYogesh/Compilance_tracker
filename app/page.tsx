"use client";

import { useEffect, useState } from "react";
type Client = {
  id: string;
  company_name: string;
  country: string;
  entity_type: string;
};

type Task = {
  id: string;
  title: string;
  due_date: string;
  status: string;
};
export default function Home() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  // Load clients
  const loadClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  // Load tasks
  const loadTasks = async (clientId: string) => {
    const res = await fetch(`/api/tasks/${clientId}`);
    const data = await res.json();
    setTasks(data);
  };

  // Add Client
  const handleAddClient = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        company_name: form.get("company_name"),
        country: form.get("country"),
        entity_type: form.get("entity_type"),
      }),
    });

    e.target.reset();
    loadClients();
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

  // Filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Compliance Tracker
        </h1>

        {/* ADD CLIENT */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Add Client</h2>

          <form onSubmit={handleAddClient} className="flex flex-wrap gap-2">
            <input
              name="company_name"
              placeholder="Company Name"
              className="border p-2 rounded w-full sm:w-auto"
              required
            />
            <input
              name="country"
              placeholder="Country"
              className="border p-2 rounded"
            />
            <input
              name="entity_type"
              placeholder="Entity Type"
              className="border p-2 rounded"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>
        </div>

        {/* CLIENT LIST */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Clients</h2>

          <div className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <button
                key={c.id}
                className={`px-4 py-2 rounded border ${
                  selectedClient === c.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
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
        </div>

        {/* TASK SECTION */}
        {selectedClient && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Tasks</h2>

            {/* ADD TASK */}
            <form
              onSubmit={handleAddTask}
              className="flex flex-wrap gap-2 mb-4"
            >
              <input
                name="title"
                placeholder="Task title"
                className="border p-2 rounded"
                required
              />
              <input
                type="date"
                name="due_date"
                className="border p-2 rounded"
              />
              <input
                name="category"
                placeholder="Category"
                className="border p-2 rounded"
              />
              <input
                name="priority"
                placeholder="Priority"
                className="border p-2 rounded"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Task
              </button>
            </form>

            {/* FILTER */}
            <div className="mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* TASK LIST */}
            {filteredTasks.map((task) => {
              const isOverdue =
                task.status === "pending" &&
                task.due_date &&
                new Date(task.due_date) < new Date();

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded border mb-2 ${
                    isOverdue ? "bg-red-100 border-red-400" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">
                        Due: {task.due_date || "N/A"}
                      </p>
                      <p className="text-sm">Status: {task.status}</p>
                    </div>

                    {task.status === "pending" && (
                      <button
                        onClick={() => updateStatus(task.id)}
                        className="text-blue-600 font-medium"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
