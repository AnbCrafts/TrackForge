import { Users, Link as LinkIcon, Clock, Leaf } from "lucide-react";
import React, { useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useNavigate } from "react-router-dom";

const PreviewTeam = ({ team, hide }) => {
  const { formatDateTime } = useContext(TrackForgeContextAPI);
  const navigate = useNavigate();

  if (!team || team.length === 0) {
    return <p className="text-gray-500 p-4 text-center">No Teams</p>;
  }

  return (
    <div className="w-full">
      {hide ? (
        /* Compact Sidebar — Minimal */
        <div className="flex flex-col p-4 border bg-white border-gray-200 items-center gap-3 w-fit rounded-lg shadow-sm min-h-[100vh] overflow-y-auto noScroll">
          {team.map((t, i) => (
            <div
              key={i}
              onClick={() => navigate(`${t.team._id}`)}
              className="w-12 h-12 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center text-base font-semibold shadow-sm hover:scale-105 transition cursor-pointer"
              title={t.team.name}
            >
              {t.team.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      ) : (
        /* Full Preview — Minimal */
        <div className="p-4 border bg-white border-gray-200 rounded-lg shadow-sm max-w-xl h-[100vh] overflow-y-auto noScroll">
          {team.map((t, i) => (
            <div
              key={i}
              className="py-4 px-4 mb-4 rounded-lg shadow-sm bg-white border border-gray-100"
            >
              {/* Team Name */}
              <h2 className="text-lg font-semibold text-gray-900 w-full mb-2 flex items-center gap-2">
                <Leaf className="text-gray-500" /> {t.team.name}
              </h2>

              {/* Team Link */}
              <div
                className="flex items-center gap-2 text-gray-600 text-sm mb-2 cursor-pointer truncate"
                onClick={() => navigator.clipboard.writeText(t.team.link.url)}
                title={t.team.link.url}
              >
                <LinkIcon className="w-4 h-4 text-gray-500" />
                <span className="truncate">{t.team.link.url}</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                Created on {formatDateTime(t.team.createdAt)}
              </div>

              {/* Members */}
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div className="flex -space-x-2">
                  {t.members.slice(0, 3).map((m, idx) => (
                    <div
                      key={idx}
                      className="h-8 w-8 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm"
                      title={m.username}
                    >
                      {m.username.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {t.members.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm">
                      +{t.members.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Open Team */}
              <button
                onClick={() => navigate(`${t.team._id}`)}
                className="text-sm text-white mt-2 rounded-md shadow px-4 py-1.5 bg-purple-600 hover:bg-purple-700 transition"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewTeam;
