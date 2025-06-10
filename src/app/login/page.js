"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiMail, HiLockClosed } from "react-icons/hi";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const res = await fetch("/users.json");
      const users = await res.json();
      // console.log("Users fetched:", users);
      // console.log("Form data:", formData);

      var user = users.find(
        (u) => u.email == formData.email && u.password == formData.password
      );

      if (user) {
        // Simple auth: Save user email in localStorage as "auth"
        localStorage.setItem("auth", JSON.stringify(user));
        router.push("/dashboard/agent");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to login");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="relative px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-medium text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            >
              Sign In
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-center text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-blue-400 opacity-10"></div>
        </div>
      </div>
    </main>
  );
}
