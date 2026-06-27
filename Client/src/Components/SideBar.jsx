import React, { useContext, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  Users,
  LogOut,
  Code,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { motion } from "framer-motion";

const SideBar = ({ onSidebarChange }) => {
  const location = useLocation();
  const { getUserDataById, authUserData } = useContext(TrackForgeContextAPI);
  const { username, hash } = useParams();

  const baseMenu = [
    { id: "dashboard", icon: LayoutDashboard, path: "dashboard", label: "Dashboard" },
    { id: "projects", icon: FolderKanban, path: "projects", label: "Projects" },
    { id: "code-editor", icon: Code, path: "code-editor/view-project", label: "Code Editor" },
    { id: "bugs", icon: Bug, path: "bugs", label: "Bugs" },
  ];

  const isAdminOrOwner = authUserData?.role === "Owner" || authUserData?.role === "Admin";

  const menu = [
    ...baseMenu,
    { id: "team", icon: Users, path: "team", label: isAdminOrOwner ? "Teams" : "My Teams" },
    { id: "members", icon: UserPlus, path: "members", label: "Users" },
    ...(isAdminOrOwner
      ? [
          { id: "meetings", icon: Calendar, path: "meetings", label: "Meetings" }
        ]
      : []
    ),
    { id: "logout", icon: LogOut, path: "logout", label: "Logout" },
  ];

  const [isOpen, setIsOpen] = useState(true);

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
      onSidebarChange(isOpen ? 220 : 70); // Adjusted widths
    }
  }, [isOpen]);

  const isActive = (segment) => location.pathname.includes(segment);

  return (
    <div className="h-full text-[var(--text-sidebar)] flex flex-col py-6 transition-all duration-300 w-full">
      {/* Manual Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`mb-6 p-2 rounded-xl bg-[var(--bg-sidebar)] hover:bg-[var(--bg-hover)] text-[var(--text-sidebar)] hover:text-[var(--text-sidebar-active)] transition-all border border-[var(--border-sidebar)] flex items-center justify-center cursor-pointer ${
          isOpen ? "w-[180px] mx-auto gap-2" : "w-11 h-11 mx-auto"
        }`}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? (
          <>
            <ChevronLeft className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Collapse</span>
          </>
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

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
                h-11 cursor-pointer flex items-center transition-all duration-200 rounded-xl border
                ${isOpen
                  ? "w-[180px] px-4 justify-start mx-auto"
                  : "w-11 justify-center mx-auto"
                }
                ${active
                  ? "bg-[var(--button-primary)] text-[var(--button-primary-text)] border-transparent shadow-md font-semibold"
                  : "text-[var(--text-sidebar)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-sidebar-active)] border-[var(--border-sidebar)]/30"
                }
              `}
            >
              {isOpen ? (
                <>
                  <Icon className="h-5 w-5 transition-all text-current mr-3" />
                  <span className="text-sm font-medium">
                    {label}
                  </span>
                </>
              ) : (
                <Icon className="h-6 w-6 transition-all text-current" />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SideBar;
