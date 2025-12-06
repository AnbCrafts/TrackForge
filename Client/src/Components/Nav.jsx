import React from 'react'
import { Link } from 'react-router-dom';
import{  FiCloudLightning, FiLock, FiZap } from "react-icons/fi";
import { assets } from '../assets/assets';
import { CloudLightningIcon } from 'lucide-react';

const Nav = () => {
  return (
    
     <nav className="w-full  px-6 md:px-12 py-4 backdrop-blur-md border-b border-default">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

    {/* Logo + Name */}
    <div className="flex items-center gap-3">
      <Link
        to="/"
        className="h-12 w-12 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105"
      >
        <img src={assets.logo} className="h-full w-full object-cover" alt="logo" />
      </Link>

      <h1 className="text-gradient text-2xl font-extrabold tracking-wide">
        TrackForge
      </h1>
    </div>

    {/* Feature Pills */}
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3">

      {[
        { icon: FiLock, label: "Secure" },
        { icon: CloudLightningIcon, label: "Efficient" },
        { icon: FiCloudLightning, label: "Robust" },
        { icon: FiZap, label: "Fast" },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="glass px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:border-neon"
          >
            <Icon className="text-neon text-lg" />
            <span className="text-secondary text-sm md:text-base">{item.label}</span>
          </div>
        );
      })}

    </div>

  </div>
</nav>
  )
}

export default Nav
