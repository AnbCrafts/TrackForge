import { BarChart2, Bug, FolderKanban, HelpCircle, PlusCircle, Users } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const HomeDecor = ({user}) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">

      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Your team’s productivity hub. Let’s track, resolve, and build better.</p>
        </div>
        <Link to="/projects/create" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
          <PlusCircle className="h-5 w-5" /> Create New Project
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <FolderKanban className="h-8 w-8 text-indigo-600" />
          <p className="text-sm text-gray-500 mt-2">Projects</p>
          <p className="text-xl font-bold">5</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <Bug className="h-8 w-8 text-red-500" />
          <p className="text-sm text-gray-500 mt-2">Open Bugs</p>
          <p className="text-xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <Users className="h-8 w-8 text-green-500" />
          <p className="text-sm text-gray-500 mt-2">Team Members</p>
          <p className="text-xl font-bold">9</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <BarChart2 className="h-8 w-8 text-yellow-500" />
          <p className="text-sm text-gray-500 mt-2">Analytics</p>
          <p className="text-xl font-bold">View</p>
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Your Projects */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
            <Link to="/projects" className="text-indigo-600 text-sm">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-100 rounded-xl flex justify-between">
              <span>Project Alpha</span>
              <span className="text-xs text-green-600">Active</span>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl flex justify-between">
              <span>UI Redesign</span>
              <span className="text-xs text-yellow-600">On Hold</span>
            </div>
          </div>
        </div>

        {/* Bug Tracker Overview */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Bug Overview</h2>
            <Link to="/bugs" className="text-indigo-600 text-sm">View All</Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span>Critical</span>
              <span className="text-red-500">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>High</span>
              <span className="text-orange-500">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Medium</span>
              <span className="text-yellow-500">5</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <Link to="/notifications" className="text-indigo-600 text-sm">View All</Link>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="bg-gray-100 p-2 rounded-lg">Bug #124 assigned to you.</li>
            <li className="bg-gray-100 p-2 rounded-lg">New comment on Project Alpha.</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link to="/projects/create" className="flex items-center gap-2 text-indigo-600 hover:underline">
              <PlusCircle className="h-5 w-5" /> Add Project
            </Link>
            <Link to="/bugs/report" className="flex items-center gap-2 text-indigo-600 hover:underline">
              <Bug className="h-5 w-5" /> Report Bug
            </Link>
            <Link to="/teams/create" className="flex items-center gap-2 text-indigo-600 hover:underline">
              <Users className="h-5 w-5" /> Create Team
            </Link>
            <Link to="/help" className="flex items-center gap-2 text-indigo-600 hover:underline">
              <HelpCircle className="h-5 w-5" /> Help & Support
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}

export default HomeDecor
