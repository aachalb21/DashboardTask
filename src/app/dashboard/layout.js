'use client';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2 flex flex-col">
          <a href="/dashboard/profile">Profile</a>
          <a href="/dashboard/agent">Agent</a>
          <button className="text-left w-full text-gray-300 hover:text-white" onClick={() => {
            localStorage.removeItem('auth');
            window.location.href = '/login';
          }
          }>
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        {children}
      </main>
    </div>
  );
}
