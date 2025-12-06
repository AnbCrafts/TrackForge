import React, { useState, useContext } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Edit,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { motion } from "framer-motion";

const TicketList = ({ userTickets }) => {
  const { hash, username } = useParams();
  const navigate = useNavigate();

  const [filterRange, setFilterRange] = useState("all");
  const { patchTicketStatus } = useContext(TrackForgeContextAPI);

  const getFilteredTickets = () => {
    if (!userTickets?.tickets) return [];

    if (filterRange === "all") return userTickets.tickets;

    const now = new Date();
    let compareDate = new Date();

    switch (filterRange) {
      case "1day":
        compareDate.setDate(now.getDate() - 1);
        break;
      case "3days":
        compareDate.setDate(now.getDate() - 3);
        break;
      case "1week":
        compareDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        compareDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return userTickets.tickets;
    }

    return userTickets.tickets.filter((t) => {
      if (!t.assignedOn) return false;
      return new Date(t.assignedOn) >= compareDate;
    });
  };

  const filteredTickets = getFilteredTickets();

  // ✨ Smooth reveal animation
  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 bg-white min-h-screen">

      {/* FILTER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-4 flex flex-wrap items-center gap-3"
      >
        <label className="font-medium text-gray-700">Show tickets from:</label>
        <select
          className="border border-gray-300 px-3 py-1 rounded bg-white text-gray-700"
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="1day">Last 1 Day</option>
          <option value="3days">Last 3 Days</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
        </select>
      </motion.div>

      {/* TICKETS */}
      {filteredTickets.length > 0 ? (
        filteredTickets.map((t, index) => (
          <motion.div
            key={t._id}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="border border-gray-200 rounded-xl bg-white p-5 my-4 
                       shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >

            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="font-semibold text-xl text-gray-900">{t.title}</h2>

              <div className="flex items-center gap-3">
                {/* Status toggle */}
                <button
                  onClick={() =>
                    patchTicketStatus(t._id, t.status === "Closed" ? "Open" : "Closed")
                  }
                  className={`px-4 py-1.5 flex items-center gap-2 rounded-lg text-white transition-all
                  ${t.status === "Closed" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}
                `}
                >
                  <RefreshCcw size={16} />
                  {t.status === "Closed" ? "Activate" : "Close"}
                </button>

                <button
                  className="p-2 border border-gray-300 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>

            {/* META INFO */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">

              <p>
                Assigned:{" "}
                {new Date(t.assignedOn).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <span>|</span>

              <p className="text-purple-600 font-medium">
                Valid:{" "}
                {new Date(t.validFor).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <span>|</span>

              {/* Validity Badge */}
              <div className="mt-1">
                {(() => {
                  const today = new Date();
                  const validDate = new Date(t.validFor);
                  today.setHours(0, 0, 0, 0);
                  validDate.setHours(0, 0, 0, 0);

                  const diff = Math.round((validDate - today) / (1000 * 60 * 60 * 24));

                  if (diff === 0)
                    return (
                      <span className="text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <AlertTriangle size={14} /> Expires today
                      </span>
                    );

                  if (diff === 1)
                    return (
                      <span className="text-orange-600 bg-orange-100 border border-orange-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Clock size={14} /> Tomorrow
                      </span>
                    );

                  if (diff > 1)
                    return (
                      <span className="text-green-600 bg-green-100 border border-green-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <CheckCircle size={14} /> {diff} days left
                      </span>
                    );

                  return (
                    <span className="text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <AlertTriangle size={14} /> Expired
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 mt-4">{t.description}</p>

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 mt-5">

              <button
                onClick={() => {
                  const today = new Date();
                  const validDate = new Date(t.validFor);

                  today.setHours(0, 0, 0, 0);
                  validDate.setHours(0, 0, 0, 0);

                  if (today > validDate) return toast.error("This ticket has expired");

                  navigate(
                    `/auth/${hash}/${username}/workspace/ticket-detail/${t._id}`
                  );
                }}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white shadow-sm 
                           hover:bg-purple-700 hover:-translate-y-1 transition"
              >
                Add Activity
              </button>

              <button
                onClick={() =>
                  navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${t._id}`)
                }
                className="px-6 py-2 rounded-lg bg-gray-800 text-white shadow-sm 
                           hover:bg-gray-900 hover:-translate-y-1 transition"
              >
                View Activities
              </button>
            </div>

          </motion.div>
        ))
      ) : (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-gray-500 italic mt-10"
        >
          No tickets found for this range.
        </motion.p>
      )}
    </div>
  );
};

export default TicketList;
