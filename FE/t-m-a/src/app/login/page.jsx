"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import API from "@/api/axios";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-sky-50 to-slate-100">
      {" "}
      <section className="w-full max-w-md bg-white/90 backdrop-bg-gradient-to-br from-sky-50 via-white to-indigo-100blur rounded-3xl shadow-xl border border-white/70 p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">TaskFlow</h2>
            <p className="text-xs text-slate-500">Smart task management</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-900">
          Welcome back
        </h1>
        <p className="text-slate-500 mt-2 text-center">
          Login to manage your daily tasks.
        </p>

        {error && (
          <div className="mt-5 flex gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white rounded-xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          New here?{" "}
          <Link href="/register" className="text-blue-600 font-semibold">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
