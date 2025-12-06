import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { motion } from "framer-motion";

import {
  FiCloudLightning,
  FiLock,
  FiZap,
} from "react-icons/fi";
import {
  ChevronDown,
  ChevronRight,
  CloudLightningIcon,
  Home,
  LogOut,
  Folder,
  User,
  Bell,
  Settings,
  HelpCircle,
  HomeIcon,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
 
const PageHeader = ({ want = true }) => {
  const [userId, setUserId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { username, hash } = useParams();
  const location = useLocation();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);


  const isActive = (segment) => location.pathname.includes(segment);
  const menu = [
    { id: "home", icon: HomeIcon, path: "" },
    { id: "notifications", icon: Bell, path: "notifications" },
    { id: "settings", icon: Settings, path: "settings" },
    { id: "help", icon: HelpCircle, path: "help" },

  ]
  return (
    <div className={`p-3  flex flex-wrap items-center justify-between 
                   ${username ? "bg-white":"bg-secondary"}
                    backdrop-blur-xl gap-4`}>

      {/* Logo */}
      {want && <Logo />}

      <div className="flex-1 flex items-center justify-between flex-wrap gap-4">

        {/* Feature Tags */}
        

        { want &&<div className="flex flex-wrap items-center gap-2 md:gap-3">
          {[
            { icon: <FiLock />, label: "Secure" },
            { icon: <CloudLightningIcon />, label: "Efficient" },
            { icon: <FiCloudLightning />, label: "Robust" },
            { icon: <FiZap />, label: "Fast" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm px-4 py-1.5
                         rounded-xl border border-[#2d0a39] 
                         bg-[#111318]/70 backdrop-blur-xl
                         text-purple-200 font-medium
                         hover:border-pink-500
                         hover:shadow-[0_0_15px_rgba(255,0,200,0.4)]
                         transition-all"
            >
              <span className="text-pink-400">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>}

        {/* User Dropdown */}
        {(location.pathname === "/" || username) && (
          
            <div className="flex items-center justify-start gap-5">
              
                    {menu.map(({ id, icon: Icon, path }, index) => {
  const active = isActive(id);

  return (
    <motion.div
  key={id}
  initial={{ opacity: 0, y: 5 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay: index * 0.03 }}
>
  <Link
    to={path}
    className={`
      h-11 w-11 flex items-center justify-center rounded-xl cursor-pointer
      border-2     
      backdrop-blur-md
      transition-all duration-200
      text-purple-600
      hover:bg-purple-600 hover:text-white
      ${active
        ? "border-transparent bg-purple-600 text-white"
        : "border-purple-600 transition-all"
      }
    `}
  >
    <Icon
      className={`
        h-6 w-6 transition-all 
        ${active ? "text-white" : "text-purple-500 hover:bg-purple-600 hover:text-white transition-all"}
      `}
    />
  </Link>
</motion.div>

  );
})}

     <div className="text-white shadow-2xl px-4 py-1.5 relative 
                          rounded-xl min-w-40 select-none
                          bg-purple-600 backdrop-blur-xl
                          hover:border-[#b614eb] transition ">

            {username && userId ? (
              <div
                onClick={() => setShowMore(!showMore)}
                className="flex cursor-pointer items-center gap-2"
              >
                <User className="p-1 rounded-full bg-gradient-to-r 
                                 from-white to-gray-200 text-purple-600 h-7 w-7" />
                <span className="font-medium">{username}</span>
                {showMore ? (
                  <ChevronDown className="text-purple-200" />
                ) : (
                  <ChevronRight className="text-purple-200" />
                )}
              </div>
            ) : (
              <span className="text-purple-600">Login</span>
            )}

            {/* Dropdown */}
            <div
              className={`
                absolute left-0 top-10 w-full rounded-lg overflow-hidden 
                bg-purple-600
                backdrop-blur-xl mt-2
                shadow-[0_0_25px_rgba(200,0,255,0.25)]
                transition-all duration-300
                
                ${showMore 
                  ? "opacity-100 translate-y-2 visible"
                  : "opacity-0 -translate-y-4 invisible"}
              `}
            >

              
              <Link
                className="py-2 px-4 flex items-center gap-2 
                           transition-all hover:bg-white 
                           hover:text-purple-600 transition border-b border-white/30"
                to={`/auth/${hash}/${username}/workspace`}
              >
                <Home size={18} /> Home
              </Link>

              <Link
                className="py-2 px-4 flex items-center gap-2 
                           transition-all hover:bg-white 
                           hover:text-purple-600 transition border-b border-white/30"
                to={`/auth/${hash}/${username}/workspace/profile`}
              >
                <User size={18} /> Profile
              </Link>

              <Link
                className="py-2 px-4 flex items-center gap-2 
                           transition-all hover:bg-white 
                           hover:text-purple-600 transition border-b border-white/30"
                to={`/auth/${hash}/${username}/workspace/dashboard`}
              >
                <Folder size={18} /> Dashboard
              </Link>

              <Link
                className="py-2 px-4 flex items-center gap-2 
                           transition-all hover:bg-white 
                           hover:text-purple-600 transition border-b border-white/30"
                to={`/auth/${hash}/${username}/workspace/logout`}
              >
                <LogOut size={18} /> Logout
              </Link>
            </div>
          </div>


            </div>
          
          
          
        )}
      </div>

    </div>
  );
};

export default PageHeader;
