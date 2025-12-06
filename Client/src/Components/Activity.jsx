import { Text, Timer } from 'lucide-react';
import React, { useContext } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';

const Activity = ({ activity }) => {
  const { formatDateTime } = useContext(TrackForgeContextAPI);

  return (
    <div className="p-5 bg-gray-300 text-gray-900 rounded-xl shadow-2xl w-full max-w-xl">
      {/* Description Section */}
      <div>
        <div className="flex items-center gap-3 font-semibold text-lg">
          <Text className="h-10 w-10 p-1 rounded-full bg-gray-900 text-white" />
          <span>Description</span>
        </div>

        <p className="p-2 max-w-full whitespace-normal break-words overflow-hidden">
          {activity?.activity?.details}
        </p>
      </div>

      {/* Project Section */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <Text className="h-10 w-10 p-1 rounded-full bg-gray-900 text-white" />
          <span>Project -</span>
        </div>

        <p className="p-2 max-w-full whitespace-normal break-words overflow-hidden">
          {activity?.project?.name}
        </p>
      </div>

      {/* Timestamp */}
      <p className="flex items-center gap-3 mt-5">
        <Timer className="h-10 w-10 p-1 rounded-full bg-gray-900 text-white" />
        <span className="text-gray-600 text-sm font-semibold">
          {formatDateTime(activity?.activity?.doneOn)}
        </span>
      </p>
    </div>
  );
};

export default Activity;
