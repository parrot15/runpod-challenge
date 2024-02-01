import React from 'react';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/generate">
            Generate
          </Link>
        </li>
        <li>
          <Link href='/library'>
            Library
          </Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;