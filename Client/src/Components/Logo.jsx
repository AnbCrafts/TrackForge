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
        className="w-12 h-12 rounded-2xl shadow-lg border border-default p-0.5 object-cover"
      />
      <h1 className="text-gradient text-2xl font-extrabold tracking-wide">TrackForge</h1>
    </Link>
  );
};

export default Logo;
