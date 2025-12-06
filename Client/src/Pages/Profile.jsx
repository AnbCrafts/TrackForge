import React, { useContext, useEffect } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useParams } from 'react-router-dom';
import ProjectListPreview from '../Components/ProjectListPreview';
import TeamListPreview from '../Components/TeamListPreview';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, AlertTriangle, AlignCenter, Calendar, Check, CheckCheck, Copy, Flag, Flame, MessageSquareOff, MessageSquareText, Send, User, Wrench,Text, FileText, Folder, ActivityIcon, Hash, MoveLeft, MoveRight, CheckCircle, Clock, Trash } from 'lucide-react';
import LinkGithubButton from '../Components/LinkGithubButton';

const Profile = () => {
  const{unLinkThisUserGithub,createActivity,postComment, authUserData,ticketComments,getUserDataById,userProjects, getUserProjects,userTeams,getUsersTeam,getUserAssignedTickets,userAssignedTickets,getTicketComments,deleteActivity,deleteTicket} = useContext(TrackForgeContextAPI);
  
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

      {
  authUserData && authUserData.githubAccessToken === null
    ? (
      <div className="flex justify-between">
        <LinkGithubButton />
      </div>
    )
    : (
      <div><div className="flex justify-between">
        <span className="text-green-600 font-medium">GitHub Linked: {authUserData?.githubUsername}</span>
        
      </div>
      <button
          onClick={unLinkThisUserGithub} // function to unlink
         className="flex  cursor-pointer items-center gap-2 text-gray-600 hover:text-white hover:bg-gray-800 transition-all mt-6 border border-gray-300 rounded px-4 py-1"
        >
          Unlink
        </button></div>
    )
}


    </div>
      </div>

  </div>


</div>



<div className='mt-10 bg-white px-5 py-5 shadow rounded'>
  <h1 className='text-2xl text-gray-800 mb-3'>Ticket assigned by me </h1>

  <div className='text-gray-900'>
    {
      userAssignedTickets && userAssignedTickets.tickets && userAssignedTickets.tickets.length>0
      ?
      (
        <div>
          <div className=''>
                  {
                    userAssignedTickets && userAssignedTickets.tickets.map((t)=>{
          
                      return(
          
          
                        <div 
  key={t.raw._id}
  className="rounded-xl border border-gray-300 bg-white shadow hover:shadow-lg transition-all mb-10 overflow-hidden"
>
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
    <h1 className="text-xl font-semibold flex items-center gap-3">
      <Flag className="w-6 h-6 text-blue-400" />
      {t.raw.title}
    </h1>

    {/* Priority & Status */}
    <div className="flex items-center gap-3">
      <PriorityBadge priority={t.raw.priority} />

      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          t.raw.status === "Open"
            ? "bg-blue-100 text-blue-700"
            : t.raw.status === "In Progress"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {t.raw.status}
      </span>

      <Trash
        onClick={() => deleteTicket(t.raw._id)}
        className="h-8 w-8 p-1 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
      />
    </div>
  </div>

  {/* Body */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
    
    {/* LEFT: Meta Info */}
    <div className="space-y-5 col-span-1">

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-500" />
          Ticket Meta
        </h2>

        <div className="text-gray-600 space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-800">Assigned To:</span>{" "}
            {t.doer.username}
          </p>

          <p>
            <span className="font-medium text-gray-800">Project:</span>{" "}
            {t.project?.name}
          </p>

          <p>
            <span className="font-medium text-gray-800">Assigned On:</span>{" "}
            {new Date(t.raw.assignedOn).toLocaleDateString()}
          </p>

          {/* Validity */}
          <div className="mt-3">
            {(() => {
              if (!t.raw.validFor) return null;

              const today = new Date();
              const validForDate = new Date(t.raw.validFor);
              today.setHours(0,0,0,0);
              validForDate.setHours(0,0,0,0);

              const diffDays = Math.round((validForDate - today) / (1000*3600*24));

              if (diffDays < 0)
                return (
                  <p className="text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded px-3 py-1">
                    ❌ Ticket expired
                  </p>
                );

              if (diffDays === 0)
                return (
                  <p className="text-sm bg-red-100 border border-red-300 text-red-600 rounded px-3 py-1">
                    ⚠️ Expires today
                  </p>
                );

              if (diffDays === 1)
                return (
                  <p className="text-sm bg-orange-100 border border-orange-300 text-orange-600 rounded px-3 py-1">
                    ⏳ Expires tomorrow
                  </p>
                );

              return (
                <p className="text-sm bg-green-100 border border-green-300 text-green-600 rounded px-3 py-1">
                  ✅ Valid for {diffDays} more days
                </p>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Steps To Reproduce */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Steps to Reproduce
        </h2>
        <ul className="space-y-2">
          {t.raw.stepsToReproduce?.map((s, i) => (
            <li
              key={i}
              className="text-sm bg-gray-100 p-2 rounded flex items-center gap-2"
            >
              <Wrench className="w-5 h-5 text-green-600" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* MIDDLE: Description */}
    <div className="col-span-1 lg:col-span-1 bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Text className="w-6 h-6 text-gray-500" />
        Description
      </h2>
      <p className="text-gray-700 leading-relaxed">{t.raw.description}</p>

      {/* Activity Log */}
      <h2 className="mt-8 text-xl font-semibold text-green-600 flex items-center gap-2">
        <CheckCheck className="w-6 h-6 bg-green-500 text-white rounded p-1" />
        Activity Log
      </h2>

      <ul className="space-y-4 mt-3">
        {t.raw.activityLog?.map((a) => (
          <li
            key={a._id}
            className="border border-gray-200 bg-gray-100 p-3 rounded-lg shadow"
          >
            <p className="font-medium text-gray-800">{a.details}</p>
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {new Date(a.doneOn).toDateString()}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" /> {a.performedBy.username}
              </div>
            </div>

            <button
              onClick={() => deleteActivity(a._id, a.ticketId._id)}
              className="text-red-500 hover:text-red-700 text-xs mt-2 flex items-center gap-1"
            >
              <Trash className="w-4 h-4" /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* RIGHT: Comments */}
    <div className="col-span-1 bg-white p-5 rounded-lg shadow flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MessageSquareText className="w-6 h-6 text-blue-500" />
        Comments
      </h2>

      <div className="flex-1 overflow-y-scroll noScroll space-y-3">
        {ticketComments?.comments?.length ? (
          ticketComments.comments.map((c) => (
            <div
              key={c._id}
              className="p-3 border border-gray-200 bg-gray-50 rounded-lg"
            >
              <p className="font-medium text-gray-800">{c.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                by {c.userId.username} •{" "}
                {new Date(c.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        )}
      </div>

      {/* Comment Form */}
      <div className="mt-4">
        <input
          type="text"
          value={commentForm.message}
          onChange={(e) =>
            setCommentForm((prev) => ({ ...prev, message: e.target.value }))
          }
          className="w-full p-2 border rounded-md mb-2"
          placeholder="Write a comment…"
        />
        <div className="flex items-center gap-2">
          <select
            value={commentForm.type}
            onChange={(e) =>
              setCommentForm((prev) => ({ ...prev, type: e.target.value }))
            }
            className="border rounded px-3 py-2"
          >
            {["Text", "Status Change", "System"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Send
            onClick={submitCommentHandler}
            className="h-10 w-10 p-2 rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          />
        </div>
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
    <h1 className='text-2xl text-gray-800 mb-3'>Projects Requested to join</h1>

    <div className='mt-5 flex items-center justify-start gap-3'>
      


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
