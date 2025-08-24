import React, { useContext, useEffect } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useParams } from 'react-router-dom';
import ProjectListPreview from '../Components/ProjectListPreview';
import TeamListPreview from '../Components/TeamListPreview';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, AlertTriangle, AlignCenter, Calendar, Check, CheckCheck, Copy, Flag, Flame, MessageSquareOff, MessageSquareText, Send, User, Wrench,Text, FileText, Folder, ActivityIcon, Hash, MoveLeft, MoveRight, CheckCircle, Clock, Trash } from 'lucide-react';

const Profile = () => {
  const{patchTicketStatus,createActivity,postComment, authUserData,ticketComments,getUserDataById,userProjects, getUserProjects,userTeams,getUsersTeam,getUserAssignedTickets,userAssignedTickets,getTicketComments,deleteActivity,deleteTicket} = useContext(TrackForgeContextAPI);
  
const [currTickPage, setCurrTickPage] = useState(1);
  const{hash} = useParams();

  useEffect(()=>{
    const userId = localStorage.getItem("userId");
    if(userId){
      getUserProjects(userId);
      getUsersTeam(userId);
      getUserDataById(userId);
      getUserAssignedTickets(userId,currTickPage);

    }
  },[hash]);

 


   const [currPage,setCurrPage] = useState(1);
    const [userId,setUserId] = useState(null);

    useEffect(()=>{
      const id = localStorage.getItem("userId");
      if(id){
        setUserId(id);
      }
    },[hash]);

  
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
    const tId = localStorage.getItem("currTicketId") ||(userAssignedTickets && userAssignedTickets[currPage] && userAssignedTickets[currPage]?.raw?._id)
    const pId = localStorage.getItem("currProjectId") ||(userAssignedTickets && userAssignedTickets[currPage] && userAssignedTickets[currPage]?.project?._id)
    if(pId && tId){ 

      getTicketComments(tId,currTickPage);

      setCommentForm((prev) => ({
      ...prev,
      projectId:pId,
      ticket:tId,
    }))
    }
    
  },[ userAssignedTickets,ticketComments])


  useEffect(()=>{
    const tId = localStorage.getItem("currTicketId");

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
}, [userAssignedTickets, userId, currPage]);


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
  getUserAssignedTickets(userId,currTickPage);
  setActivityForm({actionType: "",
  ticketId: "",
  performedBy: "",
  performedOn: "",
  details: "",
  doneOn: ""})

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
   





   useEffect(()=>{
    const id = localStorage.getItem("userId");
      getUserAssignedTickets(userId || id,currTickPage);

  },[currTickPage,userId])


  useEffect(()=>{
    console.log(userAssignedTickets);
  },[userAssignedTickets])

  return (
    <div className='p-5 min-h-[100vh]'>
      
    <div className="bg-white rounded-2xl shadow-lg p-3 border border-gray-200">
  
  <div className="p-6 flex items-center justify-start gap-8 flex-wrap">
    <div className=" rounded-lg h-fit w-fit p-1 bg-gray-50 shadow-2xl">
      <img 
        className="w-60 h-60 rounded-lg border-white object-cover"
        src={authUserData?.picture}
        alt="User Avatar"
      />
    </div>

      <div>

    <div className='flex items-start justify-between gap-3 w-sm'>
          <div>
        <h2 className="font-bold text-gray-800 text-2xl">{authUserData?.firstName + " "+ authUserData?.lastName}</h2>
        <p className="text-lg text-gray-500">@{authUserData?.username}</p>

        </div>

        <p className="text-lg px-6 py-1.5 bg-teal-500 text-white rounded-md shadow">{authUserData?.role}</p>

    </div>


    <div className="mt-6  space-y-2 ">
      
      <div className="flex justify-between w-sm">
        <span className="text-gray-500">Email</span>
        <span className="font-medium text-gray-800">{authUserData?.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Total Projects</span>
        <span className="font-medium text-gray-800">{authUserData?.manages?.length || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Teams joined</span>
        <span className="font-medium text-gray-800">{authUserData?.teams?.length || 0}</span>
      </div>

    </div>
      </div>

  </div>


</div>



<div className='mt-10 bg-white px-5 py-5 shadow rounded'>
  <h1 className='text-2xl text-gray-800 mb-3'>Ticket assigned by me </h1>

  <div className='text-white'>
    {
      userAssignedTickets && userAssignedTickets.tickets && userAssignedTickets.tickets.length>0
      ?
      (
        <div>
          <div className=''>
                  {
                    userAssignedTickets && userAssignedTickets.tickets.map((t)=>{
          
                      return(
          
          
                        <div key={t.raw._id} className="flex items-start justify-between w-full shadow-2xl rounded-md min-h-[80vh] relative">
                          <Trash onClick={()=>deleteTicket(t.raw._id)} className='absolute p-1 h-7 w-7 m-1 rounded-full bg-red-500 cursor-pointer '/> 

          
            {/* Header */}
          
            <div className='flex-1 rounded-l-md bg-gray-900 h-full p-5 max-h-[100vh] overflow-y-scroll noScroll'>
          
           
          
            <div className="flex items-start justify-between flex-wrap font-semibold text-green-500 py-4 border-b border-gray-600">
              <h1 className="text-2xl">{t.raw.title}</h1>
          
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
                Issued for -{" "}
                <span className="text-gray-200">{t.doer.username}</span>
              </h1>
              <div className='flex items-center justify-start gap-5'>
          
              <h1 className="text-lg">
                Project - <span className="text-gray-200">{t.project?.name}</span>
              </h1>
              <h1 className="font-bold text-gray-200 max-w-xs  overflow-hidden text-ellipsis whitespace-normal flex items-center justify-start gap-3">
                  {!projectId?<Copy
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(t.project?._id);
              toast.success("Project ID copied to clipboard!");
              setProjectId(true);
          
            }}
          />:<Check/>}
                  <span className="font-medium text-gray-500">#Bug ID- </span>
                  {hideTicketID(t.project?._id)}
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
          
              <ul>
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
                     <span onClick={()=>deleteActivity(s._id,s.ticketId._id)} className='px-3 py-1 cursor-pointer bg-red-500 rounded text-white mt-3'>
                      <Trash className='w-5 h-5'/>
                      </span>
          
                      </div> 
                    </li>
                  ))}
              </ul>
            </div>
          
          
          
          
          
             </div>
          
          
          
          <div className="p-5 min-h-[100vh] rounded-r-md w-xl flex flex-col items-center justify-between">
              { userAssignedTickets && ticketComments?.comments?.length > 0 ? (
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

        </div>
      )
      :(
    <p>No tickets were assigned to you</p>

      )
    }
  </div>

{
  userAssignedTickets && 
       <div className='p-5 bg-gray-200 mt-10 text-gray-900'>
  <div className='flex items-center justify-start gap-5 font-semibold w-fit mx-auto'>
    
 
    <MoveLeft
      className='bg-gray-900 cursor-pointer transition-all text-white p-1 rounded h-7 w-7'
      onClick={() => {
        if (currTickPage > 1) {
          setCurrTickPage(currTickPage - 1);
        } else {
          toast.warn("Invalid Navigation");
        }
      }}
    />

    {/* Page info */}
    <span>
      {`${currTickPage} of ${userAssignedTickets?.totalPages} Tickets`}
    </span>

    {/* Right arrow */}
    <MoveRight
      className='bg-gray-900 cursor-pointer transition-all text-white p-1 rounded h-7 w-7'
      onClick={() => {
        if (currTickPage < userAssignedTickets?.totalPages) {
          setCurrTickPage(currTickPage + 1);
        } else {
          toast.warn("No More Tickets Found");
        }
      }}
    />

  </div>
</div>
}

  
        <div className='mt-10 text-white'>
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


<div className='mt-10 bg-white px-5 py-5 shadow rounded'>
  <h1 className='text-2xl mb-5 font-medium text-gray-800 '>My projects  
    
  </h1>

      {
     userProjects &&  

      <ProjectListPreview projects={userProjects}/>
     }
</div>
<div className='mt-10 bg-white px-5 py-5 shadow rounded'>
  <h1 className='text-2xl mb-5 font-medium text-gray-900 '>My Teams</h1>

      {
        userTeams && userTeams.length>0
        ?
        (
        <TeamListPreview userTeams={userTeams}/>

        )
        :(
          <div>
          <p>No Teams Found</p>
        </div>
        )
      }

</div>


      
      
    </div>
  )
}

export default Profile
