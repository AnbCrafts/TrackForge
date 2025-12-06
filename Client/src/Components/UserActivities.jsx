import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Edit } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const UserActivities = ({ userActivities }) => {
  const { updateTicket, deleteActivity } = useContext(TrackForgeContextAPI);
  const { hash, username } = useParams();
  const navigate = useNavigate();

  const [filterRange, setFilterRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);

  // ---------------------- FILTER ACTIVITIES -----------------------
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
    }

    return userActivities.filter((a) => {
      if (!a?.doneOn) return false;
      return new Date(a.doneOn) >= compareDate;
    });
  };

  const filteredActivities = getFilteredActivities();
  const visibleActivities = filteredActivities.slice(0, visibleCount);

  // ----------------------------------------------------------------

  return (
    <div className="mt-5 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">

      <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2 border-gray-200">
        Recent Activities
      </h1>

      {/* FILTER */}
      <div className="mt-4 flex items-center gap-3">
        <label className="font-medium text-gray-700">Show:</label>
        <select
          className="border border-gray-300 px-3 py-1 rounded-lg bg-white text-gray-700"
          value={filterRange}
          onChange={(e) => {
            setFilterRange(e.target.value);
            setVisibleCount(4);
          }}
        >
          <option value="all">All</option>
          <option value="1day">Last 1 Day</option>
          <option value="3days">Last 3 Days</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
        </select>
      </div>

      {/* LIST */}
      <div className="flex flex-wrap gap-5 mt-6">
        {visibleActivities.length > 0 ? (
          <>
            {visibleActivities.map((a) => (
              <div
                key={a?.activity?._id}
                className="border border-purple-600 rounded-xl bg-white p-5 shadow-sm w-full lg:w-[48%]"
              >

                {/* TITLE */}
                <div className="flex items-start justify-between">
                  <h2 className="font-semibold text-lg text-purple-600 px-3 py-1 bg-purple-50 rounded">
                    {a?.activity?.actionType}
                  </h2>

                  <button
                    onClick={() =>
                      navigate(
                        `ticket-detail/${a.ticket._id}/activity/${a.activity._id}/edit`
                      )
                    }
                    className="p-2 border border-gray-300 rounded-md shadow-sm text-purple-600 hover:bg-purple-600 hover:text-white transition"
                  >
                    <Edit size={18} />
                  </button>
                </div>

                {/* DATES */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  <p>
                    Done:{" "}
                    <b>{new Date(a.activity.doneOn).toLocaleDateString("en-GB")}</b>
                  </p>
                  <span>|</span>
                  <p>
                    Created:{" "}
                    <b>{new Date(a.activity.createdAt).toLocaleDateString("en-GB")}</b>
                  </p>
                </div>

                {/* DETAILS */}
                <p className="text-gray-700 mt-3">
                  Details: {a?.activity?.details}
                </p>

                {/* USER INFO */}
                {a.user && (
                  <p className="text-gray-700 text-sm mt-1">
                    By: <span className="font-medium">{a.user.username}</span> (
                    {a.user.email})
                  </p>
                )}

                {/* PROJECT + TICKET */}
                <p className="text-gray-700 text-sm mt-2">
                  Project:{" "}
                  <span className="font-medium">{a.project?.name || "N/A"}</span>
                </p>
                <p className="text-gray-700 text-sm">
                  Ticket: <span className="font-medium">{a.ticket?.title}</span>{" "}
                  ({a.ticket?.priority})
                </p>

                {/* VALIDITY */}
                <div className="mt-3">
                  {(() => {
                    if (!a.ticket?.validFor) return null;

                    const today = new Date();
                    const exp = new Date(a.ticket.validFor);

                    today.setHours(0, 0, 0, 0);
                    exp.setHours(0, 0, 0, 0);

                    const diff = Math.round(
                      (exp - today) / (1000 * 60 * 60 * 24)
                    );

                    if (diff === 0)
                      return (
                        <div className="text-red-700 bg-red-100 border border-red-300 rounded-md px-3 py-2 text-sm">
                          ⚠️ Ticket expires <b>today</b>
                        </div>
                      );

                    if (diff === 1)
                      return (
                        <div className="text-orange-700 bg-orange-100 border border-orange-300 rounded-md px-3 py-2 text-sm">
                          ⏳ Expires <b>tomorrow</b>
                        </div>
                      );

                    if (diff > 1)
                      return (
                        <div className="text-purple-700 bg-purple-100 border border-purple-300 rounded-md px-3 py-2 text-sm">
                          ✅ Valid for <b>{diff}</b> days
                        </div>
                      );

                    return (
                      <div className="text-gray-700 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm">
                        ❌ Ticket expired
                      </div>
                    );
                  })()}
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(`/auth/${hash}/${username}/workspace/project/${a.project._id}`)
                    }
                    className="px-6 py-1.5 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
                  >
                    View Project
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${a.ticket._id}`)
                    }
                    className="px-6 py-1.5 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
                  >
                    View Ticket
                  </button>

                  <button
                    onClick={() =>
                      deleteActivity(a.activity._id, a.ticket._id)
                    }
                    className="px-6 py-1.5 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    Delete Activity
                  </button>
                </div>

              </div>
            ))}

            {/* Pagination */}
            <div className="w-full flex justify-center mt-5">
              {visibleCount < filteredActivities.length ? (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 transition"
                >
                  Show More
                </button>
              ) : (
                filteredActivities.length > 4 && (
                  <button
                    onClick={() => setVisibleCount(4)}
                    className="px-6 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 transition"
                  >
                    Show Less
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 border border-gray-200 bg-yellow-50 rounded-md w-full">
            <AlertTriangle className="text-yellow-600" />
            <p className="text-gray-800">No activity found in range.</p>
            <Link
              to={`/auth/${hash}/${username}/workspace/projects`}
              className="ml-5 bg-purple-600 px-6 py-1.5 rounded-md text-white hover:bg-purple-700 transition"
            >
              Go to Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivities;
