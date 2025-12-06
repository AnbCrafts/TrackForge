import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Logo = ({ path }) => {
  return (
    <Link
      to={path || "/"}
      className="flex items-center gap-3 flex-wrap"
    >
      <img
        src={assets.logo}
        alt="TrackForge Logo"
        className="w-16 rounded-2xl shadow-lg border border-white p-0.5"
      />
      <h1 className="font-semibold text-white text-lg">Track Forge</h1>
    </Link>
  );
};

export default Logo;
