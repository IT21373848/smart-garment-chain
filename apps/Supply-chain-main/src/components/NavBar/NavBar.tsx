import React from 'react';

const NavBar = () => (
  <nav className="bg-primary text-secondary w-full h-16 flex items-center justify-between px-6">
    {/* Logo or Brand Name */}
    <div className="text-xl font-bold">
      MyLogo
    </div>
    {/* Navigation Links */}
    <ul className="flex space-x-6">
      <li>
        <a href="#" className="hover:text-white transition-colors">Home</a>
      </li>
      <li>
        <a href="#" className="hover:text-white transition-colors">About</a>
      </li>
      <li>
        <a href="#" className="hover:text-white transition-colors">Services</a>
      </li>
      <li>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </li>
    </ul>
  </nav>
);

export default NavBar;
