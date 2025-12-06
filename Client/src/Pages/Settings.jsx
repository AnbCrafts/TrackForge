import React from "react";
import {
  Delete,
  Folder,
  Group,
  Lock,
  PauseCircle,
  Skull,
  User,
} from "lucide-react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

const Settings = () => {
  const location = useLocation();
  const { username, hash } = useParams();
  const fullPath = `/auth/${hash}/${username}/workspace/settings/`;

  const linkBase =
    "py-2 px-3 mb-2 w-full text-left flex items-center justify-between gap-3 rounded-lg transition cursor-pointer border border-gray-200";

  const inactive =
    "bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-300";
  const active =
    "bg-purple-600 text-white border-purple-600 shadow";

  return (
    <div className="h-[100vh] w-full flex items-start gap-5 bg-white">

      {/* LEFT SIDEBAR */}
      <div className="w-3xs shadow-sm bg-gray-50 h-full p-4 border-r border-gray-200">
        <div className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h1 className="font-medium text-center text-gray-700 mb-4">
            Account Settings
          </h1>

          <ul className="space-y-2">

            <Link
              to={"reset-password"}
              className={
                linkBase +
                " " +
                (location.pathname === fullPath + "reset-password"
                  ? active
                  : inactive)
              }
            >
              Change password
              <Lock className="h-5 w-5 text-gray-500" />
            </Link>

            <Link
              to={"update-profile"}
              className={
                linkBase +
                " " +
                (location.pathname === fullPath + "update-profile"
                  ? active
                  : inactive)
              }
            >
              Update profile
              <User className="h-5 w-5 text-gray-500" />
            </Link>

            <Link className={linkBase + " " + inactive}>
              Deactivate Profile
              <PauseCircle className="h-5 w-5 text-gray-500" />
            </Link>

            <Link className={linkBase + " " + inactive}>
              Delete Account
              <Skull className="h-5 w-5 text-gray-500" />
            </Link>

            <Link className={linkBase + " " + inactive}>
              Manage projects
              <Folder className="h-5 w-5 text-gray-500" />
            </Link>

            <Link className={linkBase + " " + inactive}>
              Manage teams
              <Group className="h-5 w-5 text-gray-500" />
            </Link>

          </ul>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="min-h-[100vh] flex-1 bg-gray-50 overflow-y-scroll noScroll shadow-sm border-l border-gray-200 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
