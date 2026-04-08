"use client";
import { useState, useEffect } from "react";

export default function ThemeToggleSidebar({ compact = false }: { compact?: boolean }) {
  const [isDark, setIsDark] = useState<boolean>(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage or system preference on mount
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleSync = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('theme-sync', handleSync);
    return () => window.removeEventListener('theme-sync', handleSync);
  }, []);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Sync other components just in case
    window.dispatchEvent(new CustomEvent('theme-sync', { detail: { isDark: newIsDark } }));
  };

  if (!mounted) return null;

  if (compact) {
    return (
      <button
        role="switch"
        aria-checked={isDark}
        onClick={toggle}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none
          ${isDark
            ? "bg-zinc-900 border-zinc-700 dark:bg-white dark:border-white"
            : "bg-zinc-200 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600"
          }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200 mt-[2px]
            ${isDark
              ? "translate-x-[18px] bg-white dark:bg-zinc-900"
              : "translate-x-[2px] bg-zinc-500 dark:bg-zinc-400"
            }`}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
      <span className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        Dark mode
      </span>
      <button
        role="switch"
        aria-checked={isDark}
        onClick={toggle}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none
          ${isDark
            ? "bg-zinc-900 border-zinc-700 dark:bg-white dark:border-white"
            : "bg-zinc-200 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600"
          }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200 mt-[2px]
            ${isDark
              ? "translate-x-[18px] bg-white dark:bg-zinc-900"
              : "translate-x-[2px] bg-zinc-500 dark:bg-zinc-400"
            }`}
        />
      </button>
    </div>
  );
}
