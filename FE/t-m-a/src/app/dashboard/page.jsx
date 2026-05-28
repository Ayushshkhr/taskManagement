"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/api/axios";
import { FiEdit, FiTrash2, FiCheckCircle, FiCircle, FiLogOut } from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?search=${search}&status=${status}&page=${page}&limit=6`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setMessage("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [search, status, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.title.trim()) {
      return setMessage("Task title is required");
    }

    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, formData);
        setMessage("Task updated successfully");
      } else {
        await API.post("/tasks", formData);
        setMessage("Task added successfully");
      }

      setFormData({ title: "", description: "" });
      setEditingId(null);
      fetchTasks();
    } catch {
      setMessage("Something went wrong");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      setMessage("Failed to delete task");
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/tasks/${id}/status`);
      fetchTasks();
    } catch {
      setMessage("Failed to update status");
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">TaskFlow</h1>
            <p className="text-sm text-slate-500">Welcome, {user?.name || "User"}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-5 py-8 grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Task" : "Add New Task"}
          </h2>

          {message && (
            <div className="mb-4 bg-blue-50 text-blue-700 text-sm p-3 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Task description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 min-h-28"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", description: "" });
                }}
                className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow p-5 grid md:grid-cols-2 gap-4">
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {tasks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500 md:col-span-2">
                No tasks found. Add your first task.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{task.title}</h3>
                      <p className="text-slate-500 text-sm mt-2">
                        {task.description || "No description"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggle(task._id)}
                      className={
                        task.status === "completed"
                          ? "text-green-600 text-2xl"
                          : "text-slate-400 text-2xl"
                      }
                    >
                      {task.status === "completed" ? <FiCheckCircle /> : <FiCircle />}
                    </button>
                  </div>

                  <div className="mt-5 flex justify-between items-center">
                    <span
                      className={
                        task.status === "completed"
                          ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                          : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
                      }
                    >
                      {task.status}
                    </span>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}