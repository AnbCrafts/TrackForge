import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  Badge,
  Users,
  LinkIcon,
  Pen,
  Plus,
  MoreHorizontal,
  Ban,
} from "lucide-react";
import RestrictedTeamView from "./RestrictedTeamView";

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const {
    teamData,
    getTeamByID,
    formatDateTime,
    getCurrentUserData,
    currUserData,
    checkAuthorityToViewTeam,
    hasAuthToSeeTeam,
    getTeamJoinRequests,
  } = useContext(TrackForgeContextAPI);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasAuthority, setHasAuthority] = useState(false);

  const toggleDropdown = (memberId) => {
    setActiveDropdown(activeDropdown === memberId ? null : memberId);
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    getCurrentUserData(id);
  }, []);

  useEffect(() => {
    getTeamByID(teamId);
    checkAuthorityToViewTeam(teamId);
    getTeamJoinRequests(teamId);
  }, [teamId]);

  useEffect(() => {
    if (currUserData && (currUserData.role === "Admin" || currUserData.role === "Owner")) {
      setHasAuthority(true);
    } else setHasAuthority(false);
  }, [currUserData]);

  if (!teamData || !teamData.raw)
    return <p className="text-center text-gray-500">Loading Team Details...</p>;

  const { creator, members, projects, raw } = teamData;

  return (
    <div className="max-w-full mx-auto h-fit max-h-[100vh] overflow-y-scroll noScroll p-3">

      {/* PERMISSION CHECK */}
      {hasAuthToSeeTeam !== null && !hasAuthToSeeTeam ? (
        <RestrictedTeamView creator={creator} projects={projects} raw={raw} members={members} />
      ) : (
        <div className="space-y-6">

          {/* TEAM HEADER — Minimal */}
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex items-start justify-between shadow-sm">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{raw.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Created on {formatDateTime(raw.createdAt)}
              </p>
            </div>

            {hasAuthority && (
              <Link
                to={"edit"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
              >
                <Pen className="h-4 w-4" />
                Edit
              </Link>
            )}
          </div>

          {/* CREATOR CARD */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center gap-5">
            <img
              src={creator.picture}
              alt="creator"
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />

            <div className="flex-1">
              <p className="text-lg font-medium text-gray-900 flex items-center gap-3">
                {creator.firstName} {creator.lastName}
                <span className="px-3 py-0.5 bg-purple-100 text-purple-700 rounded text-xs border border-purple-200">
                  {creator.role}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                @{creator.username} • {creator.email}
              </p>
            </div>

            <Badge className="ml-auto bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs">
              {creator.status}
            </Badge>
          </div>

          {/* PROJECTS */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>

            {projects?.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <p className="text-gray-600">{project.description}</p>

                  <Link
                    to={`${project._id}`}
                    className="inline-block mt-3 px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
                  >
                    View Project
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Projects have been added</p>
            )}
          </div>

          {/* MEMBERS */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>

              {hasAuthority && (
                <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 text-sm">
                  <Plus className="h-5 w-5 text-gray-600" />
                  Add Members
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full relative shadow-sm border border-gray-200"
                >
                  <Users className="w-5 h-5 text-gray-700" />

                  <p className="text-gray-800 font-medium">
                    {member.firstName} {member.lastName}
                  </p>

                  <Badge className="ml-2 bg-white text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-xs">
                    {member.role}
                  </Badge>

                  {hasAuthority && (
                    <MoreHorizontal
                      onClick={() => toggleDropdown(member._id)}
                      className="cursor-pointer ml-2 text-gray-500 hover:text-gray-700"
                    />
                  )}

                  {hasAuthority && activeDropdown === member._id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 text-gray-700 rounded shadow-xl p-2 flex flex-col w-32 z-50">
                      <button className="text-sm hover:bg-gray-100 py-1 w-full text-left px-2 rounded">
                        Remove
                      </button>
                      <button className="text-sm hover:bg-gray-100 py-1 w-full text-left px-2 rounded">
                        Block
                      </button>
                      <button className="text-sm hover:bg-gray-100 py-1 w-full text-left px-2 rounded">
                        Promote
                      </button>
                      <button className="text-sm hover:bg-gray-100 py-1 w-full text-left px-2 rounded">
                        Add to project
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* INVITE LINK */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invite Link</h2>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-gray-600" />
                <a
                  href={raw.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 underline truncate max-w-xs text-sm"
                >
                  {raw.link.url}
                </a>
              </div>

              {hasAuthority && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded text-white text-sm cursor-pointer hover:bg-red-600">
                  Discard Link
                  <Ban className="h-5 w-5 bg-white text-red-600 p-1 rounded-full" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Valid Till: {formatDateTime(raw.link.validTill)}
              <span className="px-3 py-0.5 ml-4 bg-purple-600 text-white rounded text-xs shadow">
                {raw.link.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;
