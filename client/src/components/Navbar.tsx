'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faImages } from '@fortawesome/free-solid-svg-icons';

/**
 * Navigation bar for the application. Displays links to the
 * main generation page, and the library page.
 */
const NavBar = () => {
  const pathname = usePathname();
  const isActive = (selectedPathname: string) => pathname === selectedPathname;

  return (
    <nav className="bg-slate-950 p-4">
      <ul className="flex justify-center items-center space-x-4">
        <li
          className={`rounded-lg ${isActive('/') ? 'bg-purple-700' : 'hover:bg-white hover:bg-opacity-30 duration-300'}`}
        >
          <Link href="/" className="p-3 text-white">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Generate
          </Link>
        </li>
        <li
          className={`rounded-lg ${isActive('/library') ? 'bg-purple-700' : 'hover:bg-white hover:bg-opacity-30 duration-300'}`}
        >
          <Link href="/library" className="p-3 text-white">
            <FontAwesomeIcon icon={faImages} className="mr-2" />
            Library
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default NavBar;
