import React from 'react';
import { PlusCircle, Users, Search, FolderOpen, Rocket, Workflow, Code } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const FirstTimeHome = ({ username }) => {
  const {hash} = useParams();
  
  return (
    <div className="min-h-screen rounded-2xl shadow-2xl flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6">

      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Welcome, {username || 'New User'}!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          TrackForge is your collaborative space to manage teams, projects, and bugs.
          Let's set you up for success!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">

        <Link to={`/auth/${hash}/${username}/workspace/code-editor`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <Code className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Start Working </h2>
          <p className="text-center text-gray-500 mt-2">
          Start working on the project in our code editor
          </p>
        </Link>
        <Link to={`/auth/${hash}/${username}/workspace/team`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <PlusCircle className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Create a Team</h2>
          <p className="text-center text-gray-500 mt-2">
            Start by creating your own team and invite your collaborators.
          </p>
        </Link>

        <Link to={`/auth/${hash}/${username}/workspace/team`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <Users className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Join a Team</h2>
          <p className="text-center text-gray-500 mt-2">
            Already have a team? Join them and get started.
          </p>
        </Link>

        <Link to={`/auth/${hash}/${username}/workspace/team`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <Search className="h-12 w-12 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Find Users</h2>
          <p className="text-center text-gray-500 mt-2">
            Connect with people across the platform.
          </p>
        </Link>

        <Link to={`/auth/${hash}/${username}/workspace/projects`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <FolderOpen className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Explore Projects</h2>
          <p className="text-center text-gray-500 mt-2">
            Browse open projects and see where you can contribute.
          </p>
        </Link>

        <Link to={`/auth/${hash}/${username}/workspace/help`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
          <Rocket className="h-12 w-12 text-pink-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Quick Start Guide</h2>
          <p className="text-center text-gray-500 mt-2">
            Learn how to navigate TrackForge in 2 minutes.
          </p>
        </Link>

      </div>

    </div>
  );
};

export default FirstTimeHome;
