import React from 'react';
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <div className="font-bold text-purple-600">MyBrand</div>
      <div className="flex gap-4">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
      </div>
    </nav>
  );
}