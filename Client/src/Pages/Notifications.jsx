import React, { useContext, useEffect, useState } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useParams } from 'react-router-dom';
import TicketList from '../Components/TicketList';

const Notifications = () => {
  const {getUserTicketsForNotification,userTicketsForNotification} = useContext(TrackForgeContextAPI);
  const [page,setPage] = useState(1);
  const [limit,setLimit] = useState("all");
  const {hash} = useParams();
  useEffect(()=>{
      const userId = localStorage.getItem("userId");
      getUserTicketsForNotification(userId,page,limit);
  },[hash, limit])




  return (
    <div className='p-3 bg-gray-100 min-h-[100vh]'>
      
      <div>

      {
        userTicketsForNotification && userTicketsForNotification.tickets && userTicketsForNotification.tickets.length>0 
        ?(
          <TicketList userTickets={userTicketsForNotification} />
        )
        :(
          <p> NO Ticket Found</p>

        )
      }
      </div>
     
      


      
    </div>
  )
}

export default Notifications
