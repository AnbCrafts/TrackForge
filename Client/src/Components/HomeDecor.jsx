import {
  BarChart2,
  Bug,
  FolderKanban,
  HelpCircle,
  PlusCircle,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const HomeDecor = ({ user }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">

      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Your team’s productivity hub. Let’s track, resolve, and build better.
          </p>
        </div>

        <Link
          to="/projects/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 text-sm md:text-base"
        >
          <PlusCircle className="h-5 w-5" /> Create New Project
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FolderKanban, label: "Projects", value: "5", color: "text-indigo-600" },
          { icon: Bug, label: "Open Bugs", value: "12", color: "text-red-500" },
          { icon: Users, label: "Team Members", value: "9", color: "text-green-500" },
          { icon: BarChart2, label: "Analytics", value: "View", color: "text-yellow-500" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center"
          >
            <item.icon className={`h-8 w-8 ${item.color}`} />
            <p className="text-sm text-gray-500 mt-2">{item.label}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Your Projects */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
            <Link to="/projects" className="text-indigo-600 text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "Project Alpha", status: "Active", color: "text-green-600" },
              { name: "UI Redesign", status: "On Hold", color: "text-yellow-600" },
            ].map((p, i) => (
              <div
                key={i}
                className="p-3 bg-gray-100 rounded-xl flex justify-between text-sm"
              >
                <span>{p.name}</span>
                <span className={`text-xs ${p.color}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bug Tracker Overview */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Bug Overview</h2>
            <Link to="/bugs" className="text-indigo-600 text-sm">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {[
              { label: "Critical", value: 4, color: "text-red-500" },
              { label: "High", value: 3, color: "text-orange-500" },
              { label: "Medium", value: 5, color: "text-yellow-500" },
            ].map((b, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{b.label}</span>
                <span className={b.color}>{b.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <Link to="/notifications" className="text-indigo-600 text-sm">
              View All
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="bg-gray-100 p-2 rounded-lg">Bug #124 assigned to you.</li>
            <li className="bg-gray-100 p-2 rounded-lg">New comment on Project Alpha.</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            {[
              { to: "/projects/create", icon: PlusCircle, label: "Add Project" },
              { to: "/bugs/report", icon: Bug, label: "Report Bug" },
              { to: "/teams/create", icon: Users, label: "Create Team" },
              { to: "/help", icon: HelpCircle, label: "Help & Support" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-2 text-indigo-600 hover:underline"
              >
                <item.icon className="h-5 w-5" /> {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeDecor;
