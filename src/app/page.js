'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Check for auth in localStorage and redirect if present
    const auth = localStorage.getItem("auth");
    // If auth exists, redirect to dashboard
    if (auth) {
      window.location.replace("/dashboard/agent");
    }
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="relative px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-medium tracking-tight text-gray-900 sm:text-6xl">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              proPAL AI
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Revolutionizing voice interactions for Indian businesses using AI.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="rounded-xl border-2 border-gray-300 bg-white/50 backdrop-blur-sm px-8 py-3 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-white/80 transition-all duration-200">
                Login
              </button>
            </Link>
          </div>

          {/* Simple decorative line */}
          <div className="mt-16 h-[1px] w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-blue-400 opacity-10"></div>
        </div>
      </div>
    </main>
  );
}
