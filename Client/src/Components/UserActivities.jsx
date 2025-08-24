import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Edit } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const UserActivities = ({ userActivities }) => {
  const {updateTicket,deleteActivity} = useContext(TrackForgeContextAPI);
  const {hash,username} = useParams();
  const [filterRange, setFilterRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4); // default limit
  const navigate = useNavigate();
  const getFilteredActivities = () => {
    
    if (!userActivities || userActivities.length === 0) return [];

    const now = new Date();
    let compareDate = new Date();

    switch (filterRange) {
      case "1day":
        compareDate.setDate(now.getDate() - 1);
        break;
      case "1week":
        compareDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        compareDate.setMonth(now.getMonth() - 1);
        break;
      case "all":
        return userActivities;
      case "3days":
      default:
        compareDate.setDate(now.getDate() - 3);
        break;
    }

    return userActivities.filter((a) => {
      if (!a?.doneOn) return false;
      return new Date(a.doneOn) >= compareDate;
    });
  };

  const filteredActivities = getFilteredActivities();
  const visibleActivities = filteredActivities.slice(0, visibleCount);


  useEffect(()=>{
    console.log(filteredActivities);
  },[filteredActivities])



  return (
    <div className="mt-5 py-5 bg-gray-100 rounded">
      <h1 className="text-2xl text-white font-semibold bg-gray-800 p-3 rounded">
        Recent Activities
      </h1>

      {/* Dropdown Filter */}
      <div className="mb-4 flex items-center gap-2 mt-3">
        <label className="font-medium">Show activities from:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filterRange}
          onChange={(e) => {
            setFilterRange(e.target.value);
            setVisibleCount(4); // reset when filter changes
          }}
        >
          <option value="all">All</option>
          <option value="1day">Last 1 Day</option>
          <option value="3days">Last 3 Days</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
        </select>
      </div>

      {/* Activities List */}
      <div className="flex flex-wrap gap-5">
        {visibleActivities.length > 0 ? (
          <>
            {visibleActivities.map((a) => (
              <div
                key={a?.activity?._id}
                className="border border-gray-300 rounded bg-white p-3 my-2 shadow-sm flex-1 min-w-xl"
              >
                <div className="flex justify-between flex-col h-full">
                  <div>
                    {/* Action Type */}
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-lg py-1 px-4 text-white bg-teal-500 w-fit rounded mb-3 ">
                        {a?.activity?.actionType}
                      </h2>
                      <span className="p-1 border text-teal-500 border-gray-300 rounded shadow hover:bg-teal-500 hover:text-white hover:border-transparent transition-all cursor-pointer">
                        <Edit onClick={()=>navigate(`ticket-detail/${a.ticket._id}/activity/${a.activity._id}/edit`)}/>
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-start gap-3">
                      <p className="text-gray-600">
                        Done on:{" "}
                        {new Date(a?.activity?.doneOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      |
                      <p className="text-gray-600">
                        Created at:{" "}
                        {new Date(a?.activity?.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <p className="text-gray-600 my-3">
                      Details: {a?.activity?.details}
                    </p>

                    {/* User */}
                    {a.user && (
                      <p className="text-gray-700 text-sm mt-1">
                        By: <span className="font-medium">{a.user.username}</span> (
                        {a.user.email})
                      </p>
                    )}

                    {/* Project + Ticket */}
                    <p className="text-gray-700 text-sm">
                      Project:{" "}
                      <span className="font-medium">{a.project?.name || "N/A"}</span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      Ticket:{" "}
                      <span className="font-medium">{a.ticket?.title || "N/A"}</span>{" "}
                      ({a.ticket?.priority})
                    </p>

                    {/* Details */}
                    {a.details && <p className="text-gray-800 mt-2">{a.details}</p>}

                    {/* Status-like Info */}
                    <div className="mt-3 w-fit">
                      {(() => {
                        if (!a.ticket?.validFor) return null;

                        const today = new Date();
                        const validForDate = new Date(a.ticket.validFor);

                        today.setHours(0, 0, 0, 0);
                        validForDate.setHours(0, 0, 0, 0);

                        const diffTime = validForDate - today;
                        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 0) {
                          return (
                            <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded p-2">
                              <span>⚠️ Ticket expires <b>today</b>!</span>
                            </div>
                          );
                        } else if (diffDays === 1) {
                          return (
                            <div className="flex items-center gap-2 text-orange-600 bg-orange-100 border border-orange-300 rounded p-2">
                              <span>⏳ Ticket will expire <b>tomorrow</b>.</span>
                            </div>
                          );
                        } else if (diffDays > 1) {
                          return (
                            <div className="flex items-center gap-2 text-green-600 bg-green-100 border border-green-300 rounded p-2">
                              <span>✅ Ticket valid for <b>{diffDays}</b> more days.</span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-100 border border-gray-300 rounded p-2">
                              <span>❌ Ticket already expired.</span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-start gap-5">
                    <button
                      onClick={() => {
                          navigate(`/auth/${hash}/${username}/workspace/project/${a.project._id}`)

                      }}
                      className="px-8 py-1 border border-gray-300 rounded shadow cursor-pointer bg-gray-900 text-white hover:-translate-y-1.5 transition-all"
                    >
                      View Project
                    </button>
                    <button
                      onClick={() => {
                          navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${a.ticket._id}`)

                      }}
                      className="px-8 py-1 border border-gray-300 rounded shadow cursor-pointer bg-gray-900 text-white hover:-translate-y-1.5 transition-all"
                    >
                      View Ticket
                    </button>
                    <button
                      onClick={() => {
                          deleteActivity(a.activity._id, a.ticket._id);

                      }}
                      className="px-8 py-1 border border-gray-300 rounded shadow cursor-pointer bg-red-500 text-white hover:-translate-y-1.5 transition-all"
                    >
                      Delete Activity
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Show More Button */}
            {visibleCount < filteredActivities.length ? (
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="px-6 cursor-pointer py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-900 transition-all"
                >
                  Show More

                </button>
              </div>
            )
            :<div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => visibleCount>4 && setVisibleCount((prev) => prev - 4)}
                  className="px-6 cursor-pointer py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-900 transition-all"
                >
                  Show Less
                </button>
              </div>
            
            
            }
          </>
        ) : (
          <div className="text-lg font-medium flex items-center justify-start gap-3 p-3 border border-gray-300 w-full bg-yellow-50">
            <AlertTriangle className="text-yellow-600" />
            <p>No Activity done in the selected range</p>
            <Link
              to={`/auth/${hash}/${username}/workspace/projects`}
              className="bg-emerald-500 px-8 py-1 rounded text-white ml-5 hover:bg-emerald-600 transition-all cursor-pointer"
            >
              Go to project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivities;
