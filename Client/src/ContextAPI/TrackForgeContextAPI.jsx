import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SHA256 from "crypto-js/sha256";
import { toast } from "react-toastify";
   
export const TrackForgeContextAPI = createContext();

export const WorkContextProvider = ({ children }) => {
  
  const getHashSecret = (fixedTime = '') => {
  const part1 = "Yy9!Ffwk_+@54$+trackForge@secret__2025!@";
  const time = fixedTime || Date.now().toString().slice(-4);  // Extract same 4-digit suffix
  const part2 = 'XyZ123!#$_@' + time;
  return [...part1].map((ch, i) => ch + (part2[i] || '')).join('');
};



  const navigate = useNavigate();
  const {hash,username} = useParams();

  const serverURL = "http://localhost:9000/api";


  const verifyResponse = (response) => {
     if(!response){
      toast.error("Response not found");
      return;
    }
    if(!response.data.success){
      toast.error(response.data.message || "Cannot get positive response");
      return;
    }
  }
  const throwError=(error)=>{
        toast.error(error.response?.data?.error || error.response?.data?.message || error.message || "Internal Server Error");
        console.log(error)
    return
  }
  const formatDateTime = (isoDateString) => {
  const date = new Date(isoDateString);

  const options = {
    weekday: 'short',    // e.g., Mon
    year: 'numeric',     // e.g., 2025
    month: 'short',      // e.g., Aug
    day: 'numeric',      // e.g., 04
    hour: '2-digit',     // e.g., 10 AM / 10 PM
    minute: '2-digit',
    hour12: true         // For 12-hour format with AM/PM
  };

  return date.toLocaleString('en-US', options);
  };
  

const PatchUserProfile = async(id,status)=>{
  if(!id){
    toast.warn("ID is required");
  }  
  if(!status){
    toast.warn("Status is required");

  } 
  try {
        const response = await axios.patch(`${serverURL}/user/info/${id}/${status}`);
        verifyResponse(response);
        if(response.data.success){
          toast.success(response.data.message);
        }

      } catch (error) {
        throwError(error)
      }

}

  const [userData,setUserData] = useState(null);
const registerUser = async (data, path) => {
  if (!data) {
    toast.warn("Data is required");
    return;
  }

  if (!path) {
    toast.warn("Path is required");
    return;
  }

  try {
    const response = await axios.post(`${serverURL}/user/${path}`, data);

    verifyResponse(response);
    

    const { success, message, user, token, secureHash, loginTime } = response.data;

    if (!success) {
      toast.error(message || "Server responded with failure");
      return;
    }

    setUserData(user);

    const { username } = user;
    const secret = getHashSecret(response.data.loginTime.toString().slice(-4));
const payload = user?._id?.toString() + response?.data?.loginTime + secret;
const calculatedHash = SHA256(payload).toString();
    if (secureHash === calculatedHash) {
      localStorage.setItem("userId", user?._id);
      localStorage.setItem("userToken", token);
      await PatchUserProfile(user?._id,"Online");
      toast.success(message);
      navigate(`/auth/${secureHash}/${username.toLowerCase()}/workspace`);
    } else {
      toast.error("Hash Verification Failed - False Login Attempt");
    }

  } catch (error) {
  throwError(error)
  }
}; 

const [authUserData,setAuthUserData] = useState(null);
const getUserDataById = async(id)=>{
  if(!id){
    toast.warn("Provide ID to fetch user Data");
  }
  try {
    const response = await axios.get(`${serverURL}/user/info/${id}`);
    verifyResponse(response);

    if(response && response.data.success){

      setAuthUserData(response.data.user);
    }

    
  } catch (error) {
    throwError(error)
  }

}

const [currUserData,setCurrUserData] = useState(null);


const getCurrentUserData = async(id)=>{
  if(!id){
    toast.warn("Provide ID to fetch user Data");
  }
  try {
    const response = await axios.get(`${serverURL}/user/info/${id}`);
    verifyResponse(response);

    if(response && response.data.success){

      setCurrUserData(response.data.user);
    }

    
  } catch (error) {
    throwError(error)
  }

}

const [allUsers,setAllUsers] = useState(null);

const getAllUsers = async(page)=>{
  try {
    const response = await axios.get(`${serverURL}/user/info/list/all?page=${page ||1}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data;
      setAllUsers(data);
      toast.success("Fetched All users for page - ", page);
    }
    
  } catch (error) {
    throwError(error)
  }
  
}
const deleteProfile = async(id)=>{
  if(!id){
    toast.warn("Provide ID");

  }
  try {
    const response = await axios.delete(`${serverURL}/user/info/${id}/remove`);
    verifyResponse(response);
    if(response && response.data.success){
      toast.success(response.data.message);
      await getAllUsers()

    }
    
  } catch (error) {
    throwError(error)
  }
}

const [userTeams,setUserTeams] = useState(null);
const getUsersTeam = async(id)=>{
   if(!id){
    toast.warn("ID is required");
  }   
  try {
    const response = await axios.get(`${serverURL}/user/info/${id}/teams`);
    verifyResponse(response);
    if(response.data.success){
      const teams = response.data.teams;
      setUserTeams(teams);
      toast.success(response.data.message);
    }
      
    } catch (error) {
      throwError(error)
    }
}

const [userLastSeen,setUserLastSeen]=useState(null);

const getLastActiveTime = async(id)=>{
   if(!id){
    toast.warn("ID is required");
  } 
  try {
    const response = await axios.get(`${serverURL}/user/info/:${id}/lastSeen`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.user;
      setUserLastSeen(data);
    }


    
  } catch (error) {
    throwError(error)
  }
}
const updateUserProfile = async(id,updates)=>{
      if(!id || !updates){
        toast.warn("ID and updates are required");
      }
      try {
        const response = await axios.put(`${serverURL}/user/info/${id}/edit`,updates);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.user;
          setAuthUserData(data);
          toast.success("User updated successfully");
        }
        
      } catch (error) {
        throwError(error)
      }
      
}
const changeUserRole = async(id,role)=>{
      if(!role || !id){
        toast.warn("ID and role are required");
      }
      try {
        const response = await axios.put(`${serverURL}/user/info/:${id}/update/${role}`);
        verifyResponse(response);
        if(response.data.success){
          toast.success("Role updated to - ",role);
        }
        
      } catch (error) {
        throwError(error);
      }
}
const [userActivities,setUserActivities]= useState(null);
const getUserActivities = async(id)=>{
       if(!id){
        toast.warn("ID is required");
       }
  try {
    const response = await axios.get(`${serverURL}/user/info/${id}/activities`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.activities;
      setUserActivities(data);
    }


        
       } catch (error) {
        throwError(error);
       }
} 

const [userIds,setUserIds] = useState(null);

const getUserIDs = async(users)=>{
  if(!users || !users.length>0){
    toast.warn("Usernames are not provided")
  }

  try {
    const ids = [];
    await Promise.all(
      users.map(async(u)=>{
        const response = await axios.get(`${serverURL}/user/info/username/${u}`);
        verifyResponse(response);
        
        if(response.data.success){
          ids.push(response.data.userId);
        }
      })
    )

    if(ids.length>0){
      setUserIds(ids);

    }else{
      toast.error("No IDs found")
    }
    
  } catch (error) {
    throwError(error);
  }


} 
const [searchedUser,setSearchedUser] = useState(null);
const searchUser =async (email,username)=>{
  if(!email || !username){
    toast.warn("Search term is required");
  }
  try {
    const response = await axios.get(`${serverURL}/user/info/user-detail/${username}/${email}`);
    verifyResponse(response);
    if(response.data.success){
        const user = response.data.user;
        setSearchedUser(user);
        toast.success("User Profile found");
    }
    
  } catch (error) {
    throwError(error);
  }
}

const [allUserProfiles,setAllUserProfiles] = useState([]);
const searchUserProfiles = async(search)=>{

  if(!search){
    toast.warn("Search text is required");

  }
  try {
      const response = await axios.get(`${serverURL}/user/info/list/all/search?q=${search}`);
      verifyResponse(response);
      if(response.data.success){
          const data = response.data.users;
          setAllUserProfiles(data);
      }
  } catch (error) {
    throwError(error) 
  }

}


const logoutUser = async()=>{
      const id = localStorage.getItem("userId");
      await PatchUserProfile(id,"Offline");
      setAuthUserData(null);

      navigate('/login');
      toast.success("Logged out");
      localStorage.clear();


}


// PROJECTS ENDPOINTS


const [currProject,setCurrProject] = useState(null);

const createProject = async(data)=>{
  if(!data){
    toast.warn("Data is required");
  }
  try {
    const response =  await axios.post(`${serverURL}/project/create/new`,data);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Project Created Successfully")
      const data = response.data.project;
      setCurrProject(data);

    }
  } catch (error) {
    throwError(error);
  }

}

const [allProjects,setAllProjects] = useState(null);
const getAllProjects = async(page)=>{
  try {
    const response = await axios.get(`${serverURL}/project/list-all?page=${page||1}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data;
      setAllProjects(data);
    }
    
  } catch (error) {
    throwError(error);
  }

}

const [project,setProject] = useState(null);
const projectById = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/list/${id}`);
   verifyResponse(response);
    if(response.data.success){
        const data = response.data.project;
        setProject(data);
    }
    
  } catch (error) {
    throwError(error)
  }


}

const [projectActivities,setProjectActivities] = useState(null);

const getActivitiesOfProject = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/list/:${id}/activities`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.allActivities;
      setProjectActivities(data);
    }
    
  } catch (error) {
    throwError(error);
  }

}

const [projectTeam,setProjectTeam]= useState(null);
const getProjectTeam = async (id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/${id}/teams-list`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.teams;
      setProjectTeam(data);

    }
  } catch (error) {
    throwError(error)
  }
}

const [allMembers ,setAllMembers] = useState(null);
const getAllMembers = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/${id}/members-list`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.members;
      setAllMembers(data);

    }
  } catch (error) {
    throwError(error)
  }
}
const addMember = async(pId,mId)=>{
  if(!pId || !mId){
    toast.warn("IDs are required");
  }
  try {
    const response = await axios.put(`${serverURL}/project/list/${pId}/member/${mId}/add`);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Member Added to project");
      await projectById(pId);
    }
    
  } catch (error) {
    throwError(error)
  }
}
const removeMember = async(pId,mId)=>{
  if(!pId || !mId){
    toast.warn("IDs are required");
  }
  try {
    const response = await axios.put(`${serverURL}/project/list/${pId}/${mId}/remove`);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Member Removed from project");
      await getAllMembers(pId);
    }
    
  } catch (error) {
    throwError(error)
  }
}
const addTeam = async(pId,tId)=>{
      if(!pId || !tId){
        toast.warn("IDs are required");
      }
      try {
        const response = await axios.put(`${serverURL}/project/list/${pId}/team/${tId}/add`);
        verifyResponse(response);
        if(response.data.success){
            toast.success("Team Added");
            await projectById(pId);

        }
        
      } catch (error) {
        throwError(error);
      }
}
const removeTeam = async(pId,tId)=>{
      if(!pId || !tId){
        toast.warn("IDs are required");
      }
      try {
        const response = await axios.put(`${serverURL}/project/list/${pId}/${tId}/remove`);
        verifyResponse(response);
        if(response.data.success){
            toast.success("Team Removed");
            await getProjectTeam(pId);

        }
        
      } catch (error) {
        throwError(error);
      }
}
const [projectStats,setProjectStats] = useState(null);

const getProjectStats = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/list/${id}/stats`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.stats;
      setProjectStats(data);
    }
  } catch (error) {
    throwError(error)
  }
}
const [userProjects,setUserProjects] = useState({
  projects:[],
  length:0
});
const getUserProjects = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/list-all/project/${id}`);
    verifyResponse(response);
    if(response.data.success){
      const data= response.data.projects;
      const length = response.data.total;


      setUserProjects({
        projects:data,
        length:length
      });
    }
  } catch (error) {
   throwError(error); 
  }
}

const [searchedProjects,setSearchedProjects] = useState(null);

const searchProjects = async(text,page)=>{
  if(!text || !page){
    toast.warn("Search text is required");
  }
  try {
    const response = await axios.get(`${serverURL}/project/list/all/search?q=${text}&page=${page}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data;
      setSearchedProjects(data);
    }
    
  } catch (error) {
    throwError(error)
  }

}

const updateProject = async(pId,uId,updates,location)=>{
  if(!pId || !uId || !updates){
    toast.success("project ID, user ID and updates are required");
  }
  try {
    const response = await axios.put(`${serverURL}/project/list/${pId}/${uId}/update`,updates);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Project Updated Successfully");
      await projectById(pId);
      if(location){
        navigate(location);
      }else{
        navigate(`/auth/${hash}/${username}/workspace/projects/${pId}`);

      }
    }
    
  } catch (error) {
    throwError(error)
  }

}

const deleteProject = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.delete(`${serverURL}/project/list/${id}/delete`);
    verifyResponse(response);
    if(response.data.success){
      toast.success(response.data.message);
      navigate(`/auth/${hash}/${username}/workspace/projects`);
    }
    
  } catch (error) {
    throwError(error);
  }
}







// TEAMS ENDPOINTS 

const [teamData,setTeamData] = useState(null);

const getTeamByID = async(id)=>{
      if(!id){
        toast.warn("ID is required");
        return;
      }
      try {
        const response = await axios.get(`${serverURL}/team/list/all/${id}`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.team;
          setTeamData(data);
        }
      } catch (error) {
        throwError(error)
      }
}

const [teamIds,setTeamIds] = useState(null);

const getTeamIDByName = async(name)=>{
  if(!name || name.length<=0){
    toast.warn("Names array is required");
  }
  try {
    const ids = [];
    if(name.length>0){
      await Promise.all(
        name.map(async(n)=>{
          const response = await axios.get(`${serverURL}/team/list/all/team-name/search?name=${n}`);
          verifyResponse(response);
          if(response.data.success){
            ids.push(response.data.teamId)
    }
        })
      )
    }
    if(ids.length>0){
      setTeamIds(ids);

    }

    
  } catch (error) {
    throwError(error)
  }

}
 

const [searchedTeams,setSearchedTeams] = useState(null);

const searchTeams = async(text)=>{
  if(!text ){
    toast.warn("Search text is required");
  }
  try {
    const response = await axios.get(`${serverURL}/team/list/all/search?q=${text}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data;
      setSearchedTeams(data);
    }
    
  } catch (error) {
    throwError(error)
  }

}

const updateTeam = async(teamId,updates,path)=>{
      if(!updates || !teamId || !path){
        toast.warn("Updates are required");
        return;
      }
      try {
        const response = await axios.put(`${serverURL}/team/list/all/${teamId}/update`,updates);
        verifyResponse(response);
        if(response.data.success){
            toast.success("Team Updated successfully");
            navigate(path)
            getTeamByID(teamId);

        }
        
      } catch (error) {
        throwError(error)
      }
}


// Ticket ROutes

// /list/assigned-to/:assignedTo


const [userTicketsForNotification,setUserTicketsForNotification] = useState(null);

const getUserTicketsForNotification = async(id,page,limit)=>{
  if(!id || !page){
    toast.warn("ID and page is required");
  }
  try {
    const response = await axios.get(`${serverURL}/ticket/list/all/assigned-to/${id}?page=${page}&limit=${limit ||"all"}`);
    verifyResponse(response);

    if(response.data.success){
      const data = response.data;
      setUserTicketsForNotification(data);
      // const tId = response?.data?.tickets[0]?.raw?._id;
      //   const pId = response?.data?.tickets[0]?.raw?.projectId._id;
      //   localStorage.setItem("currTicketId",tId)
      //   localStorage.setItem("currProjectId",pId)

      
    }
  } catch (error) {
    throwError(error)
  }

}
const [singleTicket,setSingleTicket] = useState(null);

const getSingleTicket = async(id)=>{
  if(!id){
    toast.warn("ID  is required");
  }
  try {
    const response = await axios.get(`${serverURL}/ticket/list/all/${id}`);
    verifyResponse(response);

    if(response.data.success){
      const data = response.data.ticket;
      setSingleTicket(data);
      const tId = response?.data?.tickets?.raw?._id;
        const pId = response?.data?.tickets?.raw?.projectId._id;
        localStorage.setItem("currTicketId",tId)
        localStorage.setItem("currProjectId",pId)
 
    }
  } catch (error) {
    throwError(error)
  }

}

const [userAssignedTicketsForNotification,setUserAssignedTicketsForNotification] = useState(null);

const getUserAssignedTicketsForNotification = async(id,page,limit)=>{
  if(!id || !page){
    toast.warn("ID and page is required");
  }
  try {
    const response = await axios.get(`${serverURL}/ticket/list/all/assigned-by/${id}?page=${page}&limit=${limit ||"all"}`);
    verifyResponse(response);

    if(response.data.success){
      const data = response.data;
      setUserAssignedTicketsForNotification(data);
      // const tId = response?.data?.tickets[0]?.raw?._id;
      //   const pId = response?.data?.tickets[0]?.raw?.projectId._id;
      //   localStorage.setItem("currTicketId",tId)
      //   localStorage.setItem("currProjectId",pId)

      
    }
  } catch (error) {
    throwError(error)
  }

}

const [userTickets,setUserTickets] = useState(null);

const getUserTickets = async(id,p,limit)=>{
  if(!id || !p){
    toast.warn("ID and page number are required");
  }
  try {
    const response = await axios.get(`${serverURL}/ticket/list/all/assigned-to/${id}/page?page=${p}&limit=${limit||1}`);
    verifyResponse(response);

    if(response.data.success){
      const data = response.data;
      setUserTickets(data);
      const tId = response?.data?.tickets[0]?.raw?._id;
        const pId = response?.data?.tickets[0]?.raw?.projectId._id;
        localStorage.setItem("currTicketId",tId)
        localStorage.setItem("currProjectId",pId)

      
    }
  } catch (error) {
    throwError(error)
  }

}


const [userAssignedTickets,setUserAssignedTickets] = useState(null);

const getUserAssignedTickets = async(id,p)=>{
  if(!id || !p){
    toast.warn("ID and page number are required");
  }
  try {
    const response = await axios.get(`${serverURL}/ticket/list/all/assigned-by/${id}/page?page=${p}`);
    verifyResponse(response);

    if(response.data.success){
      const data = response.data;
      setUserAssignedTickets(data);
      const tId = response?.data?.tickets[0]?.raw?._id;
        const pId = response?.data?.tickets[0]?.raw?.projectId._id;
        localStorage.setItem("currTicketId",tId)
        localStorage.setItem("currProjectId",pId)

       
    }
  } catch (error) {
    throwError(error)
  }

}

const [ticket,setTicket] = useState(null);

const createTicket = async(data)=>{
  if(!data){
    toast.warn("Data is required");
  }
  try {
    const response = await axios.post(`${serverURL}/ticket/create`,data);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Ticket Created and assigned to user successfully")
      const ticket = response.data.ticket;
      setTicket(ticket);
    }
    
  } catch (error) {
    throwError(error)
  }

}

const [filteredTickets, setFilteredTickets] = useState([]);

const getFilteredTickets = async(filter)=>{
  if(!filter){
    toast.warn("Search text is required");
  }
  try {
     const query = new URLSearchParams(filter).toString();
    const response = await axios.get(`${serverURL}/ticket/list/all/filter-details?${query}`)
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.tickets;
      setFilteredTickets(data);
      toast.success("All tickets found for this query")
    }
  } catch (error) {
    throwError(error)
  }

}

const [thisProjectTickets,setThisProjectTickets]= useState([]);
const getThisProjectTickets = async(id,page,limit)=>{
  let num = 5;
  if(!id || !page){
    toast.warn("ID and page is required");
  }
  
  try {
    const response = await axios.get(`${serverURL}/ticket/list/project/${id}?page=${page}&limit=${limit||num}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.tickets;
      setThisProjectTickets(data);
    }
    
  } catch (error) {
    throwError(error);
  }
}

const updateTicket = async(id,status)=>{
    if(!id || !status){
      toast.warn("ID and status are required");
    }
    try {
      const response = await axios.put(`${serverURL}/ticket/${id}/status/${status}`);
      verifyResponse(response);
      if(response.data.success){
        toast.success("Status updated to : "+status);
      }
    } catch (error) {
     throwError(error) 
    }
}

const deleteTicket = async(id)=>{
    if(!id){
      toast.warn("ID is required");
    }
    try {
      const response = await axios.delete(`${serverURL}/ticket/delete/${id}`);
      verifyResponse(response);
      if(response.data.success){
        toast.success(response.data.message);
        
        const id2 = localStorage.getItem("userId");
        await getUserAssignedTickets(id2);
      }
    } catch (error) {
      throwError(error);
    }
}

const patchTicketStatus = async(id,status)=>{
  if(!id || !status){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.put(`${serverURL}/ticket/${id}/status/${status}`);
    verifyResponse(response);
    if(response.data.success){
      toast.success(response.data.message);
      toast.success("status updated to "+status);

      await getSingleTicket(id);
    }
    
  } catch (error) {
    throwError(error);
  }
}


// Activity Routes

const createActivity = async(data)=>{
  if(!data){
    toast.warn("Data is required");
  }
  try {
    const response = await axios.post(`${serverURL}/activity/create/new`,data);
    verifyResponse(response);

    if(response.data.success){
      
      toast.success("Activity Posted");
    }
  } catch (error) {
    throwError(error);
    
  }
}

const [thisTicketActivities,setThisTicketActivities] = useState([]);
const getThisTicketActivities = async(id)=>{
  if(!id){
    toast.warn("ID is required");
  }
  try {
    const response = await axios.get(`${serverURL}/activity/list/activity/ticket/${id}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.activities;
      setThisTicketActivities(data);
    }
  } catch (error) {
    throwError(error)
  }
}


const deleteActivity = async(activityId,ticketId)=>{
  if(!activityId || !ticketId){
    toast.warn("Both IDs are required");
  }
  try {
    const response = await axios.delete(`${serverURL}/activity/list/activity/${activityId}/ticket/${ticketId}/delete`);
    verifyResponse(response);
    if(response.data.success){
      toast.success(response.data.message);
      const id = localStorage.getItem("userId");
      await getUserActivities(id);
      await getThisTicketActivities(ticketId);
      await getSingleTicket(ticketId);
    }
  } catch (error) {
    throwError(error)
  }

}

// Comment ROutes


 

const [projectComments, setProjectComments] = useState(null);

const getProjectComments = async(id,p)=>{
    if(!id || !p){
      toast.warn("ID and page is required");
    }
    try {
      const response = await axios.get(`${serverURL}/comment/list/project/${id}/page?page=${p}`)
      verifyResponse(response);
      if(response.data.success){
        setProjectComments(response.data);
      }
    } catch (error) {
      throwError(error)
    }
}

const [ticketComments, setTicketComments] = useState(null);

const getTicketComments = async(id,p)=>{
    if(!id || !p){
      toast.warn("ID and page is required");
    }
    try {
      const response = await axios.get(`${serverURL}/comment/list/ticket/${id}/page?page=${p}`)
      verifyResponse(response);
      if(response.data.success){
        setTicketComments(response.data);
        
      }
    } catch (error) {
      throwError(error)
    }
}


const postComment = async(data)=>{
    if(!data){
      toast.warn("Data is required");

    }
    try {
      const response = await axios.post(`${serverURL}/comment/new`,data);
      verifyResponse(response);

      if(response.data.success){
        const tId = localStorage.getItem("currTicketId");
        getTicketComments(tId,1);
      }
    } catch (error) {
      throwError(error)
    }
}









  useEffect(()=>{
    setUserData(userData);

  },[userData]);

  const contextObj = {registerUser,userData,getUserDataById,authUserData,getAllUsers,allUsers,deleteProfile,PatchUserProfile,userTeams,getUsersTeam,userLastSeen,getLastActiveTime,updateUserProfile,changeUserRole,userActivities,getUserActivities,formatDateTime,getCurrentUserData,currUserData,getTeamByID,teamData,getUserIDs,userIds,createProject,currProject,allProjects,getAllProjects,project,projectById,projectActivities,getActivitiesOfProject,projectTeam,getProjectTeam,allMembers,getAllMembers,addMember,removeMember,addTeam,removeTeam,getProjectStats,projectStats,getUserProjects,userProjects,getTeamIDByName,teamIds,getUserTickets,userTickets,createActivity,getProjectComments,projectComments,getTicketComments,ticketComments,postComment,searchUser,searchedUser,searchProjects,searchedProjects,searchTeams,searchedTeams,searchUserProfiles,allUserProfiles,updateTeam,createTicket,ticket,getUserAssignedTickets,userAssignedTickets,getFilteredTickets,filteredTickets,getThisProjectTickets,thisProjectTickets,getUserTicketsForNotification,userTicketsForNotification,getUserAssignedTicketsForNotification,userAssignedTicketsForNotification,getSingleTicket,singleTicket,getThisTicketActivities,thisTicketActivities,updateTicket,updateProject,deleteActivity,deleteTicket,patchTicketStatus,deleteProject,logoutUser};

  return (
    <TrackForgeContextAPI.Provider value={contextObj}>
      {children}
    </TrackForgeContextAPI.Provider>
  );
};  
