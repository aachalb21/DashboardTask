"use client";

import { useEffect, useState } from "react";
import { HiUser, HiMail, HiLockClosed, HiPhone, HiBadgeCheck } from "react-icons/hi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("auth"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({ email: storedUser.email, password: storedUser.password });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/users.json");
      const users = await res.json();

      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, email: formData.email, password: formData.password } : u
      );

      await fetch("/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUsers),
      });

      // Update localStorage
      const updatedUser = updatedUsers.find((u) => u.email === formData.email);
      localStorage.setItem("auth", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info Card */}
      <div className="mx-auto max-w-3xl">
        <div className="relative mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          
          {/* Profile Header */}
          <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Circle */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-4xl font-medium text-indigo-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-400 p-1 rounded-full">
                  <HiBadgeCheck className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
                  {user.username}
                </h1>
                <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <HiPhone className="w-4 h-4" />
                  {user.phone || "Add your phone number"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <HiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 text-gray-900 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <HiLockClosed className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 text-gray-900 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
                >
                  Save Changes
                  <HiBadgeCheck className="ml-2 w-5 h-5" />
                </button>

                {message && (
                  <div className={`px-4 py-2 rounded-xl text-sm ${
                    message.includes("successfully") 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
