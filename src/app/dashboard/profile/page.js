"use client";

import { useEffect, useState } from "react";

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

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="mb-2">
        <strong>Username:</strong> {user.username}
      </p>
      <p className="mb-6">
        <strong>Phone:</strong> {user.phone || "Not provided"}
      </p>

      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Update
        </button>
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>
    </div>
  );
}
