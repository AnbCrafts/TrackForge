import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectPreview = ({ projects }) => {
  const heads = [
    "Id",
    "Project",
    "Owner",
    "Admin",
    "Teams",
    "Bugs",
    "Started On",
    "Deadline",
  ];

  const navigate = useNavigate();

  return (
    <div className="mb-10 w-full">
      <p className="italic text-gray-400 mb-3">
        Click any project to view details...
      </p>

      {/* ----------- HEADERS ----------- */}
      <div className="hidden md:flex items-center text-center justify-between gap-1">
        {heads.map((h, i) => (
          <h1
            key={i}
            className="w-40 max-w-40 p-2 border border-purple-600 bg-purple-700 rounded text-white font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {h}
          </h1>
        ))}
      </div>

      {/* ----------- BODY ----------- */}
      <div className="mt-2 space-y-2">
        {projects ? (
          projects.projects.map((p, i) => {
            const { project, owner, members } = p;

            const rowData = {
              Id: project._id,
              Project: project.name,
              Owner: owner.username,
              Admin: owner.email,
              Teams: members.length,
              Bugs: project.bugs?.length || 0,
              "Started On": project.createdAt?.slice(0, 10),
              Deadline: project.deadline?.slice(0, 10) || "N/A",
            };

            return (
              <div
                key={i}
                onClick={() => navigate(project._id)}
                className="bg-gray-50 border border-gray-200 md:flex items-center justify-between gap-1 rounded cursor-pointer hover:shadow-md hover:bg-purple-100 transition-all p-3 text-center"
              >
                {/* Desktop layout */}
                <div className="hidden md:flex w-full items-center justify-between">
                  {heads.map((h, idx) => (
                    <div
                      key={idx}
                      className="w-40 max-w-40 px-2 py-1 text-sm font-medium text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {rowData[h]}
                    </div>
                  ))}
                </div>

                {/* Mobile stacked layout */}
                <div className="flex flex-col gap-1 md:hidden">
                  {heads.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b border-gray-200 pb-1"
                    >
                      <span className="font-semibold text-gray-700">{h}:</span>
                      <span className="text-gray-600">{rowData[h]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-purple-500">No Projects Found</p>
        )}
      </div>
    </div>
  );
};

export default ProjectPreview;
