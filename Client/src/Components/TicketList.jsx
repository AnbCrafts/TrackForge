import React, {  useState } from "react";
import { AlertTriangle, Clock, CheckCircle, Edit, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const TicketList = ({ userTickets }) => {
  const {hash,username} = useParams();
  const [filterRange, setFilterRange] = useState("all"); // default: last 3 days
  const {patchTicketStatus} = useContext(TrackForgeContextAPI);


  
  const getFilteredTickets = () => {
  if (!userTickets || !userTickets.tickets) return [];

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
    case "3days":
      compareDate.setDate(now.getDate() - 3);
      break;
    case "all":
      return userTickets.tickets; // ✅ return all tickets without filtering
    default:
      compareDate.setDate(now.getDate() - 3);
      break;
  }

  return userTickets.tickets.filter((ticket) => {
    if (!ticket.assignedOn) return false;
    const assignedOn = new Date(ticket.assignedOn);
    return assignedOn <= compareDate; // ✅ changed to >= to include recent tickets
  });
};


  const filteredTickets = getFilteredTickets();


const navigate = useNavigate();

  return ( 
    <div className="p-3 bg-gray-100 min-h-[100vh]">
      {/* Dropdown Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Show tickets from:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="1day">Last 1 Day</option>
          <option value="3days">Last 3 Days</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
        </select>
      </div>

      {/* Ticket Results */}
      {filteredTickets.length > 0 ? (
        filteredTickets.map((t) => (
          <div
            key={t._id}
            className="border border-gray-300 rounded bg-white p-3 my-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{t.title}</h2>
             
             <div className="flex items-center justify-start gap-3">


             <span onClick={()=>{
              t.status === "Closed"
              ?
              patchTicketStatus(t._id,"Open")
              :
              patchTicketStatus(t._id,"Closed")
              
              }} className={`p-1 flex items-center justify-start gap-3 rounded shadow ${t.status==="Closed"?"bg-teal-500":"bg-red-500"} text-white hover:border-transparent transition-all cursor-pointer`}>
                        <RefreshCcw />
                        {t.status ==="Closed"?"Activate":"Close"}
              </span>
             <span className="p-1 border text-teal-500 border-gray-300 rounded shadow hover:bg-teal-500 hover:text-white hover:border-transparent transition-all cursor-pointer">
                        <Edit />
              </span>

             </div>

            </div>
            
            <div className="flex items-center justify-start gap-3">
            <p className="text-gray-600">
              Assigned on:{" "}
              {new Date(t.assignedOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            |

            <p className="text-red-600">
              Valid for:{" "}
              {new Date(t.validFor).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            |
            <div className="mt-2 w-fit">
  {(() => {
    if (!t.validFor) return null;

    const today = new Date();
    const validForDate = new Date(t.validFor);

    // Strip time to compare only dates
    today.setHours(0, 0, 0, 0);
    validForDate.setHours(0, 0, 0, 0);

    const diffTime = validForDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded p-2">
          <AlertTriangle size={18} />
          <span>⚠️ Ticket expires <b>today</b>!</span>
        </div>
      );
    } else if (diffDays === 1) {
      return (
        <div className="flex items-center gap-2 text-orange-600 bg-orange-100 border border-orange-300 rounded p-2">
          <Clock size={18} />
          <span>⏳ Ticket will expire <b>tomorrow</b>.</span>
        </div>
      );
    } else if (diffDays > 1) {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-100 border border-green-300 rounded p-2">
          <CheckCircle size={18} />
          <span>✅ Ticket valid for <b>{diffDays}</b> more days.</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-gray-600 bg-gray-100 border border-gray-300 rounded p-2">
          <AlertTriangle size={18} />
          <span>❌ Ticket already expired.</span>
        </div>
      );
    }
  })()}
</div>
            </div>
            


            <p className="text-gray-700">{t.description}</p>
            <div className=" mt-5 flex items-center justify-start gap-5">
<button
  onClick={() => {
    const today = new Date();
    const validForDate = new Date(t.validFor);

    // Normalize both dates to midnight (strip time)
    today.setHours(0, 0, 0, 0);
    validForDate.setHours(0, 0, 0, 0);

    if (today > validForDate) {
      toast.error("This ticket has expired");
    } else {
        navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${t._id}`)

    }
  }}
  className={`px-8 py-1 border border-gray-300 rounded shadow cursor-pointer bg-gray-900 text-white hover:-translate-y-1.5 transition-all`}
>
  Add an activity
</button>

<button
  onClick={() => {
    
        navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${t._id}`);
    
  }}
  className={`px-8 py-1 border border-gray-300 rounded shadow cursor-pointer bg-gray-900 text-white hover:-translate-y-1.5 transition-all`}
>
  View activities
</button>


            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No tickets found for this range.</p>
      )}
    </div>
  );
};

export default TicketList;
