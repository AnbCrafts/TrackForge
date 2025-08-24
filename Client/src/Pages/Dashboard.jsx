import React, { useContext, useEffect, useState } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import { toast } from 'react-toastify';
import { ArrowBigDownIcon, ArrowBigUp, Bug, Projector, Sandwich, Ticket, Users } from 'lucide-react';
import Activity from '../Components/Activity';
import TicketList from '../Components/TicketList';
import UserActivities from '../Components/UserActivities';

const Dashboard = () => {
  const navigate = useNavigate();
   const {userData,getUserDataById,authUserData,getUserActivities,userActivities,getUserAssignedTicketsForNotification,userAssignedTicketsForNotification} = useContext(TrackForgeContextAPI);
    const {username,hash} = useParams();
    const [page,setPage] = useState(1);
    const [limit,setLimit] = useState(4);

    useEffect(()=>{
        const id = localStorage.getItem("userId")
        if(id){
          getUserDataById(id);
          getUserActivities(id);
        }
    },[hash])

    useEffect(()=>{
        const id = localStorage.getItem("userId")
          if(id){
          getUserAssignedTicketsForNotification(id,page,limit);

          }
    },[limit,page,hash])

    
  
  return (
   <div className='rounded-2xl shadow-2xl p-5 bg-gray-100 min-h-[100vh] w-full'>
     <div className=" mb-6">
  <h1 className="text-3xl ">
    <span className='bg-green-500 font-semibold text-white px-4 py-1.5 rounded-l-lg shadow-2xl'>
    {authUserData?.firstName}'s

    </span>
    
     <span className="text-green-500 bg-white px-4 py-1.5 rounded-r-lg shadow-2xl ">Workspace</span>
  
  </h1>
  
  
</div>

<div className='flex mt-10 items-center justify-center gap-5 p-5 border border-gray-300 rounded-2xl shadow flex-wrap'>
  <div className='p-5 rounded-xl shadow-2xl bg-green-500 text-white flex items-center flex-col justify-center gap-3 flex-1 h-48'>
    <span className='text-3xl font-semibold flex items-center justify-between gap-3'>
      Teams <Users className='h-10 w-10 p-1.5 rounded-full bg-gray-800'/>
    </span>
    <span className='text-3xl font-semibold'>{authUserData?.teams?.length || 0}</span>

  </div>
  <div className='p-5 rounded-xl shadow-2xl bg-blue-500 text-white flex items-center flex-col justify-center gap-3 flex-1 h-48'>
    <span className='text-3xl font-semibold flex items-center justify-between gap-3'>
      Projects <Projector className='h-10 w-10 p-1.5 rounded-full bg-gray-800'/>
    </span>
    <span className='text-3xl font-semibold'>{authUserData?.manages?.length || 0}</span>

  </div>
  <div className='p-5 rounded-xl shadow-2xl bg-teal-500 text-white flex items-center flex-col justify-center gap-3 flex-1 h-48'>
    <span className='text-3xl font-semibold flex items-center justify-between gap-3'>
      Bugs <Bug className='h-10 w-10 p-1.5 rounded-full bg-gray-800'/>
    </span> 
    <span className='text-3xl font-semibold'>{authUserData?.teams?.length || 0}</span>

  </div>
  <div className='p-5 rounded-xl shadow-2xl bg-purple-500 text-white flex items-center flex-col justify-center gap-3 flex-1 h-48'>
    <span className='text-3xl font-semibold flex items-center justify-between gap-3'>
      Tickets <Ticket className='h-10 w-10 p-1.5 rounded-full bg-gray-800'/>
    </span>
    <span className='text-3xl font-semibold'>{authUserData?.activity?.length || 0}</span>

  </div>

</div>

<div className='mt-5 '>
  {authUserData?.activity && userActivities && userActivities.length > 0 ? (
  
  <UserActivities userActivities={userActivities}/>
    
  ): (
      <div className='text-lg font-medium flex items-center justify-start gap-3 p-3 border border-gray-300 w-full'>
        <Sandwich className='text-green-500' />
        <p>
          No Activity done since last three days
        </p>
        <Link to={`/auth/${hash}/${username}/workspace/projects`} className='bg-emerald-500 px-8 py-1 rounded text-white ml-5  hover:bg-emerald-600 transition-all cursor-pointer'>Go to project</Link>
        
      </div>
    ) }
 
  {
    !authUserData?.activity && 
    <p>No Activities done yet</p>
  }


</div>


 <div>

      {
        userAssignedTicketsForNotification && userAssignedTicketsForNotification.tickets && userAssignedTicketsForNotification.tickets.length>0 
        ?(
          <div className='py-5 mt-5'>
            <h1 className='text-3xl font-medium mb-5 px-3 text-gray-200 bg-gray-800 py-2 rounded shadow'>Tickets Assigned by me</h1>
            <TicketList userTickets={userAssignedTicketsForNotification} />
            <div className='w-fit mx-auto mt-10'>
              {userAssignedTicketsForNotification?.totalLength>limit 
               ?
               (<p onClick={()=>setLimit(userAssignedTicketsForNotification?.totalLength)} className='flex items-center text-gray-800 justify-start gap-3 text-lg font-medium px-9 py-1.5 rounded shadow border border-gray-300 hover:bg-gray-900 hover:text-white transition-all cursor-pointer'>
                Show {userAssignedTicketsForNotification?.totalLength-limit } More 
                <ArrowBigDownIcon/>
               </p>)
               :(<p onClick={()=>setLimit(5)} className='flex items-center text-gray-800 justify-start gap-3 text-lg font-medium px-9 py-1.5 rounded shadow border border-gray-300 hover:bg-gray-900 hover:text-white transition-all cursor-pointer'>
                Show Default 
                <ArrowBigUp/>
               </p>)

               }
            </div>
          </div>

        )
        :(
          <p> NO Ticket Found</p>

        )
      }
      </div>



   </div>
  )
}

export default Dashboard
