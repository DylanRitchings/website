// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const navItems = [
  { name: '🏠 Home', href: '/' },
  { name: '📷 Photography', href: '/photography' },
  { name: '📄 CV', href: '/cv' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        {navItems.map(({ name, href }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              'hover:underline',
              pathname === href ? 'text-yellow-300 font-semibold' : 'text-white'
            )}
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/dylanritchings"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-gray-300"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://linkedin.com/in/dylan-ritchings/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-gray-300"
        >
          <FaLinkedin size={20} />
        </a>
      </div>
    </header>
  );
}
