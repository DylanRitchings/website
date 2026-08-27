// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-3xl px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity"
        >
          Dylan Ritchings
        </Link>
        <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
          <a
            href="https://github.com/dylanritchings"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com/in/dylan-ritchings/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <FaLinkedin size={18} />
          </a>
          <ThemeToggle className="sm:hidden" />
        </div>
      </div>
      <ThemeToggle className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
    </header>
  );
}
