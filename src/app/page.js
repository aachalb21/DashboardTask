'use client';
// src/app/page.js
import Link from 'next/link';

export default function HomePage() {
  // Check for auth in localStorage and redirect if present
    const auth = localStorage.getItem("auth");
    if (auth) {
      window.location.replace("/dashboard/agent");
      return null;
    }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to proPAL AI</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Revolutionizing voice interactions for Indian businesses using AI.
        </p>
        <Link href="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
