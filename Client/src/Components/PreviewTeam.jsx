import { Users, Link as LinkIcon, Clock, Leaf } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useNavigate } from "react-router-dom";

const PreviewTeam = ({ team,hide }) => {
  const { formatDateTime } = useContext(TrackForgeContextAPI);
  const navigate = useNavigate();

useEffect(()=>{
  console.log(team);
},[team])

  return (
    <div>

        {
            hide
            ?
            (
                
    team && team.length > 0 ? (
  <div className="flex flex-col p-5 border bg-white border-gray-300 items-center gap-4 w-fit rounded-lg shadow-lg h-full min-h-[100vh] overflow-y-scroll noScroll transition-all">
    {team.map((t, i) => (
      <div
        key={i}
        className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow cursor-pointer hover:scale-105 transition"
        onClick={() => navigate(`${t.team._id}`)}
      >
        {t.team.name.charAt(0).toUpperCase()}
      </div>
    ))}
  </div>
) : (
  <p>No Teams</p>
)

            )
            :(
            <div className={`p-5 border bg-white border-gray-300 rounded-lg shadow-md max-w-xl h-[100vh] max-h-[100vh] overflow-y-scroll noScroll `}>
            {team && team.length > 0 ? (
        team.map((t, i) => (
          <div key={i} className="py-4 px-5 mb-4 rounded shadow bg-gray-900 text-gray-700">
           
            {/* Team Name */}
            <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
                <Leaf className="inline-block mr-2"/>
                {t.team.name}</h2>
            
            <div className="ml-3">

            </div>
            </div>

            {/* Link */}
            <div className="flex items-center gap-2 text-green-400 text-sm mb-2 cursor-pointer"
                 onClick={() => navigator.clipboard.writeText(t.team.link.url)}>
              <LinkIcon className="w-4 h-4" />
              <span className="truncate">{t.team.link.url}</span>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <Clock className="w-4 h-4" />
              Created on {formatDateTime(t.team.createdAt)}
            </div>

            {/* Members */}
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div className="flex -space-x-3">
                {t.members.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold border-2 border-white">
                    {m.username.charAt(0).toUpperCase()}
                  </div>
                ))}
                {t.members.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                    +{t.members.length - 3}
                  </div>
                )}
              </div>
            </div>

            {/* View Team Button */}
            <button
              onClick={() => navigate(`${t.team._id}`)}
              className="text-sm text-white mt-5 rounded shadow py-1.5 px-6 bg-green-500 cursor-pointer"
            >
             Open
            </button>
          </div>
        ))
      ) : (
        <p>No Teams</p>
      )}
    </div>
            )
        }

   





   
  </div>
  );
};

export default PreviewTeam;
