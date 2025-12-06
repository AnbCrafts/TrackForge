import React, { useContext, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  Users,
  LogOut,
  Code
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { motion } from "framer-motion";

const SideBar = ({ onSidebarChange }) => {
  const location = useLocation();
  const { getUserDataById } = useContext(TrackForgeContextAPI);
  const { username, hash } = useParams();
  const menu = [
    { id: "dashboard", icon: LayoutDashboard, path: "dashboard", label: "Dashboard" },
    { id: "projects", icon: FolderKanban, path: "projects", label: "Projects" },
    { id: "code-editor", icon: Code, path: "code-editor/view-project", label: "Code Editor" },
    { id: "bugs", icon: Bug, path: "bugs", label: "Bugs" },
    { id: "team", icon: Users, path: "team", label: "Team" },
    { id: "logout", icon: LogOut, path: "logout", label: "Logout" },
  ];

  const [isOpen, setIsOpen] = useState(true);
  const [lastActive, setLastActive] = useState(Date.now());

  const dashboardPath = `/auth/${hash}/${username}/workspace`;

  // fetch user
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) getUserDataById(id);
  }, []);

  // Open on dashboard, collapse on other pages
  useEffect(() => {
    if (location.pathname === dashboardPath) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Report width to parent
  useEffect(() => {
    if (onSidebarChange) {
      onSidebarChange(isOpen ? 120 : 60); // Adjusted widths
    }
  }, [isOpen]);

  // auto-collapse after 20s inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastActive(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("click", handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActive > 20000) {
        setIsOpen(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [lastActive]);

  const isActive = (segment) => location.pathname.includes(segment);

  return (
    <div
      className={`
        h-full text-white 
        flex flex-col py-6 transition-all duration-300 
        ${isOpen ? "w-full" : "w-fit"}
      `}
    >

     {menu.map(({ id, icon: Icon, path, label }, index) => {
       const active = isActive(id);
     
       return (
         <motion.div
       key={id}
       initial={{ opacity: 0, y: 5 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.25, delay: index * 0.03 }}
        className="mb-5"
     >
       <Link
         to={path}
         className={`
           h-11 
           ${isOpen?"w[100px] border-b justify-start border-white/30":"w-11 rounded-xl border-2 border-white/20 items-center justify-center"}
             cursor-pointer
             flex 
           backdrop-blur-md
           transition-all duration-200
           text-white
           hover:bg-white hover:text-purple-600
           
           ${active
             ? " border-transparent bg-white text-purple-600"
             : " transition-all"
           }
         `}
       >
         

         {
          isOpen
          ?
          (
          <div className="flex items-center justify-between w-full px-2.5 gap-1">
            <h1 className="text-sm font-medium">
            {label}
          </h1>
          <Icon
           className={`
             h-5 w-5 transition-all 
             ${active ? "text-purple-600" : "text-white hover:bg-white hover:text-purple-600 transition-all"}
           `}
         />
          </div>
          
        )
          :
          (<Icon
           className={`
             h-6 w-6 transition-all 
             ${active ? "text-purple-600" : "text-white hover:bg-white hover:text-purple-600 transition-all"}
           `}
         />)
         }
       </Link>
     </motion.div>
     
       );
     })}
    </div>
  );
};

export default SideBar;
