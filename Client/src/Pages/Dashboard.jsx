import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBigDownIcon,
  ArrowBigUp,
  Bug,
  Projector,
  Sandwich,
  Ticket,
  Users
} from 'lucide-react';
import TicketList from '../Components/TicketList';
import UserActivities from '../Components/UserActivities';
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    authUserData,
    getUserDataById,
    getUserActivities,
    userActivities,
    getUserAssignedTicketsForNotification,
    userAssignedTicketsForNotification
  } = useContext(TrackForgeContextAPI);

  const { username, hash } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      getUserDataById(id);
      getUserActivities(id);
    }
  }, [hash]);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      getUserAssignedTicketsForNotification(id, page, limit);
    }
  }, [limit, page, hash]);

  return (
    <div className="shadow p-6 bg-white min-h-[100vh] w-full border-t border-gray-200">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-gradient">{authUserData?.firstName}'s</span>
          <span className="bg-purple-600 text-white px-4 py-1.5 rounded-lg shadow">
            Workspace
          </span>
        </h1>
      </motion.div>

      {/* Stats Cards */}
      <div className="flex mt-10 items-center justify-center gap-5 p-5 rounded-2xl shadow-sm border border-gray-200 flex-wrap bg-gray-50">

        {/* Card */}
        {[
          {
            label: "Teams",
            value: authUserData?.teams?.length || 0,
            icon: Users,
            color: "purple"
          },
          {
            label: "Projects",
            value: authUserData?.manages?.length || 0,
            icon: Projector,
            color: "purple"
          },
          {
            label: "Bugs",
            value: authUserData?.bugs?.length || 0,
            icon: Bug,
            color: "purple"
          },
          {
            label: "Tickets",
            value: authUserData?.activity?.length || 0,
            icon: Ticket,
            color: "purple"
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            className="p-5 rounded-xl bg-purple-600 border border-gray-200 shadow-sm flex items-center flex-col justify-center gap-3 flex-1 h-44 min-w-[200px]"
          >
            <span className="text-xl font-semibold flex items-center gap-3 text-white">
              {item.label}
              <item.icon className="h-9 w-9 p-2 text-purple-600 bg-white rounded-full" />
            </span>
            <span className="text-4xl font-bold text-white">
              {item.value}
            </span>
          </motion.div>
        ))}

      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-8"
      >
        {userActivities && userActivities.length > 0 ? (
          <UserActivities userActivities={userActivities} />
        ) : (
          <div className="text-lg font-medium flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
            <Sandwich className="text-purple-600" />
            <p>No Activity done recently</p>
            <Link
              to={`/auth/${hash}/${username}/workspace/projects`}
              className="bg-purple-600 px-6 py-1.5 rounded text-white ml-5 hover:bg-purple-700 transition-all"
            >
              Go to project
            </Link>
          </div>
        )}
      </motion.div>

      {/* Tickets Assigned */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-10"
      >
        {userAssignedTicketsForNotification?.tickets?.length > 0 ? (
          <div className="py-5 mt-5">
            <h1 className="text-2xl font-semibold mb-5 px-3 text-gray-900 flex items-center gap-2">
              <span className="text-purple-600">Tickets</span> Assigned by me
            </h1>

            <TicketList userTickets={userAssignedTicketsForNotification} />

            {/* Pagination */}
            <div className="w-fit mx-auto mt-8">
              {userAssignedTicketsForNotification.totalLength > limit ? (
                <p
                  onClick={() =>
                    setLimit(userAssignedTicketsForNotification.totalLength)
                  }
                  className="flex items-center gap-2 text-gray-700 text-lg font-medium px-8 py-1.5 rounded border border-gray-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                >
                  Show {userAssignedTicketsForNotification.totalLength - limit} More
                  <ArrowBigDownIcon />
                </p>
              ) : (
                <p
                  onClick={() => setLimit(5)}
                  className="flex items-center gap-2 text-gray-700 text-lg font-medium px-8 py-1.5 rounded border border-gray-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                >
                  Show Default
                  <ArrowBigUp />
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No Ticket Found</p>
        )}
      </motion.div>

    </div>
  );
};

export default Dashboard;
