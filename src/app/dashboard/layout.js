'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HiHome, 
  HiUser, 
  HiChatAlt2, 
  HiLogout,
  HiMoon,
  HiSun
} from 'react-icons/hi';

export default function DashboardLayout({ children }) {
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    router.push('/login');
  };

  const NavLink = ({ href, children, icon: Icon }) => {
    const isActive = pathname === href;
    return (
      <Link href={href}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gray-700/50 text-white' 
            : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'
        }`}>
          <Icon className="w-5 h-5" />
          <span>{children}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-800 border-r border-gray-700/50">
        {/* Logo Area */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <HiChatAlt2 className="w-7 h-7 text-blue-400" />
            proPAL
          </h2>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2">
          <NavLink href="/dashboard" icon={HiHome}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/profile" icon={HiUser}>
            Profile
          </NavLink>
          <NavLink href="/dashboard/agent" icon={HiChatAlt2}>
            Agent
          </NavLink>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-72 border-t border-gray-700/50">
          <div className="px-3 py-4 space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/30 hover:text-white rounded-xl transition-all duration-200"
            >
              {theme === 'dark' ? (
                <>
                  <HiSun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <HiMoon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-xl transition-all duration-200"
            >
              <HiLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
