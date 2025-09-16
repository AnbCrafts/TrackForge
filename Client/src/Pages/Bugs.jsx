import React from 'react'
import { useContext } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Bug, Wrench, Star, User, Clock, AlertTriangle, CheckCircle, ListChecks, Check, Text, Flag, Flame, AlertCircle, MessageSquareOff, MessageSquareText, MoveLeft, MoveRight, Paperclip, Folder, Calendar, AlignLeft, FileText, ActivityIcon, Hash, Copy, CheckCheck, AlignCenter, Send } from "lucide-react";
import { useParams } from 'react-router-dom';


const Bugs = () => {
  const {getUserTickets,userTickets,createActivity,getTicketComments,ticketComments,postComment} = useContext(TrackForgeContextAPI);
  const {ticketId} = useParams();
  const [currPage,setCurrPage] = useState(1);
  const [currTickPage,setCurrTickPage] = useState(1);
  const [userId,setUserId] = useState(null);

  const [activityForm, setActivityForm] = useState({
  actionType: "",
  ticketId: "",
  performedBy: "",
  performedOn: "",
  details: "",
  doneOn: ""
});

const [commentForm,setCommentForm] = useState({
  message:"",
  userId:"",
  projectId:"",
  ticket:"",
  type:"Text"
});
  useEffect(()=>{
    const userId = localStorage.getItem("userId");
    setUserId(userId);
    if(userId){
      getUserTickets(userId,currPage);
    }
  },[currPage, activityForm]);

  


  

  

  useEffect(()=>{
    const tId = localStorage.getItem("currTicketId") ||(userTickets && userTickets[currPage] && userTickets[currPage]?.raw?._id) || ticketId;
    const pId = localStorage.getItem("currProjectId")||(userTickets && userTickets[currPage] && userTickets[currPage]?.project?._id) || projectId;
    if(pId && tId){

      getTicketComments(tId,currTickPage);

      setCommentForm((prev) => ({
      ...prev,
      projectId:pId,
      ticket:tId,
    }))
    }
    
  },[ userTickets,ticketComments])


  useEffect(()=>{
    const tId = localStorage.getItem("currTicketId")||(userTickets && userTickets[currPage] && userTickets[currPage]?.raw?._id);

    if(tId){

      getTicketComments(tId,currTickPage);
    
    }

  },[currPage])

  const hideTicketID = (ticketID) => {
  if (ticketID && typeof ticketID === "string") {
    if (ticketID.length > 10) {
      return ticketID.slice(0, 10) + "*".repeat(ticketID.length - 10);
    }
    return ticketID; 
  }
  return "";
};


const priorityStyles = {
  low: {
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded  flex items-center gap-1  mt-2 text-lg",
    icon: Flag,
  },
  medium: {
    className: "bg-yellow-200 text-yellow-900 border border-yellow-400 px-2 py-1 rounded  flex items-center gap-1  mt-2 text-lg",
    icon: AlertTriangle,
  },
  high: {
    className: "bg-orange-200 text-orange-900 border border-orange-400 px-2 py-1 rounded  flex items-center gap-1  mt-2 text-lg",
    icon: Flame,
  },
  critical: {
    className: "bg-red-200 text-red-900 border border-red-400 px-2 py-1 rounded  flex items-center gap-1  mt-2 text-lg",
    icon: AlertCircle,
  },
};

function PriorityBadge({ priority }) {
  const p = priorityStyles[priority?.toLowerCase()] || priorityStyles.low;
  const Icon = p.icon;

  return (
    <span className={p.className}>
      <Icon size={14} />
      {priority}
    </span>
  );
}



useEffect(() => {

  if ( userId) {
    setActivityForm(prev => ({
      ...prev,
      performedBy: userId || prev.performedBy,
    }));

    setCommentForm((prev) => ({
      ...prev,
      userId:userId,

    }))
  }
}, [userTickets, userId, currPage]);


const [ticket,setTicket] = useState(false);
const [projectId,setProjectId] = useState(false);

useEffect(()=>{
    setTimeout(() => {
      setTicket(false);
    }, 3000);
},[ticket])

useEffect(()=>{
    setTimeout(() => {
      setProjectId(false);
    }, 3000);
},[projectId])


const submitHandler = async(e)=>{
  e.preventDefault();
  const hasEmptyField = Object.values(activityForm).some(
  value => value === "" || value === null || value === undefined
);

if (hasEmptyField) {
  toast.warn("Please fill all fields before submitting!");
  return;
}
else{
  await createActivity(activityForm);
  setActivityForm({
     actionType: "",
  ticketId: "",
  performedBy: "",
  performedOn: "",
  details: "",
  doneOn: ""
  })
}

}


const submitCommentHandler = async(e)=>{
  e.preventDefault();

    const hasEmptyField = Object.values(commentForm).some(
  value => value === "" || value === null || value === undefined
);

  console.log("commentForm",commentForm)


if (hasEmptyField) {
  toast.warn("Please fill all fields before submitting!");
  return;
}
else{


  await  postComment(commentForm);

  setCommentForm((prev) => ({
        ...prev,
        message: "",
      }))
}

  
}





  return (
    
    <div className='min-h-[100vh] w-full p-5 text-white'>

      <div className='p-3 bg-gray-200 mb-5 flex items-start gap-5 justify-start text-gray-900'>
        <span className='flex items-center justify-start gap-3 border border-gray-300 px-4 py-1 rounded cursor-pointer hover:bg-gray-900 hover:text-white'>
          All <Bug className='text-red-500'/>
        </span>

        <div>
          
          <select name="priority" id="" className='py-1 outline-none border border-gray-300 rounded w-3xs text-center font-semibold focus:border-gray-400 transition-all cursor-pointer'>
            <option value="">Select Priority</option>
            {
              ["Low", "Medium", "High", "Critical"].map((p,i)=>{
                return(
                  <option value={p} key={i}>{p}</option>

                )
              })
            }
          </select>
          
        </div>

        <div>
          
          <select name="priority" id="" className='py-1 outline-none border border-gray-300 rounded w-3xs text-center font-semibold focus:border-gray-400 transition-all cursor-pointer'>
            <option value="">Select Status</option>
{            ["Open", "Closed", "Expired", "In Progress"].map((o,i)=>
  {
    return(

      <option value={o} key={i}>{o}</option>
    )
  })}
          </select>

        </div>



      </div>
        
        <div className=''>
        {
          userTickets && userTickets.tickets.map((t)=>{

            return(


              <div key={t.raw._id} className="flex items-start justify-between w-full shadow-2xl rounded-md min-h-[80vh]">

  {/* Header */}

  <div className='flex-1 rounded-l-md bg-gray-900 h-full p-5 max-h-[100vh] overflow-y-scroll noScroll'>

 

  <div className="flex items-start justify-between flex-wrap font-semibold text-green-500 py-4 border-b border-gray-600">
     <div>
        <h1 className="text-2xl">{t.raw.title}</h1>
        <h1 className={`text-sm px-4 py-1 rounded w-fit text-white 
            ${t.raw.status ==="Open"?"bg-green-500":t.raw.status==="Closed"?"bg-red-500":"bg-yellow-300"}
            `}>{t.raw.status}</h1>
    </div>

    <div className="text-right">
      
      <h1 className="font-bold text-gray-200 max-w-2xs overflow-hidden text-ellipsis whitespace-normal flex items-center justify-start gap-1">
        {!ticket?<Copy
  className="cursor-pointer"
  onClick={() => {
    navigator.clipboard.writeText(t.raw._id);
    toast.success("Ticket ID copied to clipboard!");
    setTicket(true);

  }}
/>:<Check/>}
        <span className="font-medium text-gray-500">#Bug ID- </span>
        {hideTicketID(t.raw._id)}
      </h1>

      <span>
        <PriorityBadge priority={t.raw.priority} />
      </span>
    </div>
  </div>

  {/* Meta Info */}
  <div className="mt-5 text-gray-400 space-y-1 pb-4 border-b border-gray-600">
    <h1>
      Issued By -{" "}
      <span className="text-gray-200">{t.giver.username}</span>
    </h1>
    <div className='flex items-center justify-start gap-5'>

    <h1 className="text-lg">
      Project - <span className="text-gray-200">{t.project.name}</span>
    </h1>
    <h1 className="font-bold text-gray-200 max-w-xs  overflow-hidden text-ellipsis whitespace-normal flex items-center justify-start gap-3">
        {!projectId?<Copy
  className="cursor-pointer"
  onClick={() => {
    navigator.clipboard.writeText(t.project._id);
    toast.success("Project ID copied to clipboard!");
    setProjectId(true);

  }}
/>:<Check/>}
        <span className="font-medium text-gray-500">#Bug ID- </span>
        {hideTicketID(t.project._id)}
      </h1>
    </div>
    <h1>
      Assigned On -{" "}
      <span className="text-gray-200">
        {new Date(t.raw.assignedOn).toLocaleDateString()}
      </span>
    </h1>
    

    <div className='flex items-center justify-start gap-3'>
       <p className="text-red-600">
                    Valid for:{" "}
                    {new Date(t.raw.validFor).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  |
                  <div className="mt-2 w-fit">
        {(() => {
          if (!t.raw.validFor) return null;
      
          const today = new Date();
          const validForDate = new Date(t.raw.validFor);
      
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
    
  </div>

  {/* Description */}
  <div className="mt-3 text-lg pb-4 border-b border-gray-600">
    <span className="flex items-center justify-start text-2xl gap-3 text-gray-400">
      <Text /> Details
    </span>
    <p className="text-lg my-2">{t.raw.description}</p>
  </div>

  {/* Steps to reproduce */}
  <div>
    <h1 className="text-2xl my-3 font-semibold text-red-500 flex items-center justify-start gap-3">
      <AlertTriangle className="h-8 w-8 p-1.5 bg-red-500 text-white rounded-md shadow-2xl" />
      Steps to reproduce -
    </h1>

    <ul>
      {t.raw.stepsToReproduce &&
        t.raw.stepsToReproduce.map((s, i) => (
          <li key={i} className="flex items-center justify-start gap-3 mb-2">
            <Wrench className="h-6 w-6 p-1 bg-green-500 rounded-full" />
            {s}
          </li>
        ))}
    </ul>
  </div>

  <div className='mt-15'>
    <h1 className="text-2xl my-3 font-semibold text-green-500 flex items-center justify-start gap-3">
      <CheckCheck className="h-8 w-8 p-1.5 bg-green-500 text-white rounded-md shadow-2xl" />
      Activities done -
    </h1>

    <ul >
      {t.raw.activityLog &&
        t.raw.activityLog.map((s, i) => (
        <li key={i} className="flex items-start justify-start flex-wrap gap-3 mb-2 bg-gray-200 text-gray-900 p-3 rounded-md shadow">
            <div className='flex items-start justify-start gap-4 max-w-lg border border-gray-300 p-1 rounded'>
            <AlignCenter className="h-7 w-7 text-white p-1 bg-green-500 rounded-full shrink-0" />
<p className=' flex-1 font-medium'>

            {s.details}
</p>
            </div>
            
           <div className='flex items-center flex-col flex-1 p-1 border border-gray-300 rounded'>
            <span className='px-3 py-1 bg-green-500 rounded text-white'>
            {s.actionType}
            </span>
            <span className='max-w-full mt-3 flex items-center justify-start gap-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium'>
           <Calendar className='w-5 h-5 bg-gray-900 text-white rounded-full p-0.5'/>
           { new Date(s.doneOn).toDateString()}


            </span>
            <span className='max-w-full mt-3 flex items-center justify-start gap-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium'>
            <User className='w-5 h-5 bg-gray-900 text-white rounded-full p-0.5'/>
            {s.performedBy.username}

            </span>

            </div> 
          </li>
        ))}
    </ul>
  </div>





   </div>



<div className="p-5 min-h-[100vh] rounded-r-md w-xl flex flex-col items-center justify-between">
    { userTickets && ticketComments?.comments?.length > 0 ? (
  <div className="text-gray-700 flex-1 max-h-[100vh] space-y-3 overflow-y-scroll noScroll w-full">
    {ticketComments.comments.map((c) => (
     <div
  key={c._id}
  className="flex flex-col p-3 border border-gray-200 rounded shadow w-full"
>
  <div className="flex items-start justify-between gap-2">
    <div className="flex items-start justify-start gap-2">
      <MessageSquareText className="w-7 shrink-0 h-7 p-1 text-blue-500" />
      <p className="text-lg font-bold text-gray-800">{c.message}</p>
    </div>
    <span className="text-xs shrink-0 text-gray-500 self-start">
{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>

  <span className="text-sm text-gray-500 mt-1">
    - user {c?.userId?.username}
  </span>
</div>

    ))}
  </div>
) : (
  <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 w-full">
    <MessageSquareOff className="w-5 h-5" />
    <p className="text-sm italic">No comments have been added yet.</p>
  </div>
)}





   <div className="p-3 border border-gray-300 rounded-lg w-full bg-white">
  {/* Message Input */}
  <input
    type="text"
    value={commentForm.message}
    onChange={(e) =>
      setCommentForm((prev) => ({
        ...prev,
        message: e.target.value,
      }))
    }
    className="outline-none rounded focus:shadow-md p-2 w-full text-gray-900 bg-gray-50 border border-gray-200 mb-3"
    placeholder="Type message here..."
  />

  {/* Select + Send Button */}
  <div className="flex items-center gap-3">
    <select
      name="type"
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:bg-gray-700 focus:text-white text-gray-900"
      value={commentForm.type}
      onChange={(e) =>
        setCommentForm((prev) => ({
          ...prev,
          type: e.target.value,
        }))
      }
    >
      {["Text", "Status Change", "System"].map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>

    <Send
      onClick={
        submitCommentHandler
      }
      className="text-white bg-teal-500 h-10 w-10 p-1.5 rounded-full cursor-pointer shadow hover:bg-teal-600 transition"
    />
  </div>
</div>




  </div>




</div>

            )

          })


}

        

        </div>


{
  userTickets && 
       <div className='p-5 bg-gray-200 mt-10 text-gray-900'>
  <div className='flex items-center justify-start gap-5 font-semibold w-fit mx-auto'>
    
    {/* Left arrow */}
    <MoveLeft
      className='bg-gray-900 cursor-pointer transition-all text-white p-1 rounded h-7 w-7'
      onClick={() => {
        if (currPage > 1) {
          setCurrPage(currPage - 1);
        } else {
          toast.warn("Invalid Navigation");
        }
      }}
    />

    {/* Page info */}
    <span>
      {`${currPage} of ${userTickets?.totalPages} Tickets`}
    </span>

    {/* Right arrow */}
    <MoveRight
      className='bg-gray-900 cursor-pointer transition-all text-white p-1 rounded h-7 w-7'
      onClick={() => {
        if (currPage < userTickets?.totalPages) {
          setCurrPage(currPage + 1);
        } else {
          toast.warn("No More Tickets Found");
        }
      }}
    />

  </div>
</div>
}




        <div className='p-5 mt-10 border border-gray-300'>
          <h1 className='text-2xl text-gray-500 font-medium mb-5'>
            Create an Activity
          </h1>

         <form onSubmit={submitHandler} className="p-5 bg-white rounded shadow-md text-gray-900">
  {/* Ticket ID */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="ticketId" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <Hash className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Ticket ID
    </label>
    <input
      value={activityForm.ticketId}
      name='ticketId'
      type="text"
      onChange={(e) => setActivityForm(prev => ({
        ...prev,
        ticketId: e.target.value
      }))}
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-100 border border-gray-200 '
      placeholder='Copy ticket Id above'
    />
  </div>

  {/* Action Type (editable) */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="actionType" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <ActivityIcon className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Action Type
    </label>
    <input
      value={activityForm.actionType}
      name='actionType'
      onChange={(e) => setActivityForm(prev => ({
        ...prev,
        actionType: e.target.value
      }))}
      type="text"
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-50 border border-gray-200'
      placeholder='E.g. Status Update, Comment Added'
    />
  </div>

  {/* Performed By */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="performedBy" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <User className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Performed By
    </label>
    <input
      value={activityForm.performedBy}
      name='performedBy'
      type="text"
      readOnly
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-100 border border-gray-200 cursor-not-allowed'
    />
  </div>

  {/* Performed On */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="performedOn" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <Folder className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Performed On
    </label>
    <input
      value={activityForm.performedOn}
      name='performedOn'
      type="text"
      onChange={(e) => setActivityForm(prev => ({
        ...prev,
        performedOn: e.target.value
      }))}
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-100 border border-gray-200 '
      placeholder='Copy project Id above'
    />
  </div>

  {/* Details (editable) */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="details" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <FileText className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Details
    </label>
    <textarea
      value={activityForm.details}
      name='details'
      onChange={(e) => setActivityForm(prev => ({
        ...prev,
        details: e.target.value
      }))}
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-50 border border-gray-200 resize-none h-48 overflow-y-scroll noScroll'
      placeholder='Describe the activity...'
    />
  </div>

  {/* Done On */}
  <div className='flex items-start gap-4 mb-4 max-w-full'>
    <label htmlFor="doneOn" className='flex items-start justify-start gap-2 text-gray-700 w-3xs'>
      <Calendar className='bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
      Done On
    </label>
    <input
      value={activityForm.doneOn}
      name='doneOn'
      type="date"
      onChange={(e) => setActivityForm(prev => ({
        ...prev,
        doneOn: e.target.value
      }))}
      className='outline-none rounded focus:shadow-lg p-2 w-xl bg-gray-100 border border-gray-200 '
    />
  </div>


   <div className='w-fit mx-auto my-10'>
          <button type='submit' className='px-6 py-1.5 rounded shadow border border-gray-300 cursor-pointer hover:bg-green-500 hover:text-white transition-all'>
          
          Create Activity
        </button>
        </div>


</form>



         

        </div>
      
    </div>
  )
}

export default Bugs
