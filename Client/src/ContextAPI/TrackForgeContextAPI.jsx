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

  const serverURL = import.meta.env.VITE_SERVER_URL || (
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://127.0.0.1:9000/api"
      : "https://trackforge-server-side.onrender.com/api"
  );

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("trackforge-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("trackforge-theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };


  const verifyResponse = (response) => {
     if(!response){
      console.log("No response found")
      
      return;
    }
    if(!response.data.success){
      console.log(response)
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
    return false;
  }

  if (!path) {
    toast.warn("Path is required");
    return false;
  }

  try {
    const response = await axios.post(`${serverURL}/user/${path}`, data);

    verifyResponse(response);

    const { success, message, user, token, secureHash } = response.data;

    if (!success) {
      toast.error(message || "Server responded with failure");
      return false;
    }

    setUserData(user);

    const actualId = user._id || user.id;
    const username = user.username.toLowerCase();

    localStorage.setItem("userId", actualId);
    localStorage.setItem("userToken", token);
    await PatchUserProfile(user._id, "online");
    toast.success(message);
    navigate(`/auth/${secureHash}/${username}/workspace`);
    return true;
  } catch (error) {
    throwError(error);
    return false;
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


const unLinkThisUserGithub = async()=>{
  const id = localStorage.getItem("userId");
  if(!id){
    toast.warn("ID is required for fetching repo");
  }
  try {
    const response = await axios.delete(`${serverURL}/user/github/unlink/${id}`);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Github profile unlinked successfully");
      navigate(`/auth/${hash}/${username}/workspace`)
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
    const response = await axios.get(`${serverURL}/user/info/${id}/lastSeen`);
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
        const response = await axios.put(`${serverURL}/user/info/${id}/update/${role}`);
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
  try {
      const userId = localStorage.getItem("userId");
      
      let targetCreatedBy = userId;
      if (authUserData && authUserData.role !== "Owner" && authUserData.role !== "Admin" && authUserData.createdBy) {
        targetCreatedBy = authUserData.createdBy;
      }

      const response = await axios.get(`${serverURL}/user/info/list/all/search?q=${search || ""}&createdBy=${targetCreatedBy || ""}`);
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

const [currProject,setCurrProject] = useState(null);

const createProject = async(data)=>{
  if(!data){
    toast.warn("Data is required");
  }
  try {
    const id = localStorage.getItem("userId");
    const response =  await axios.post(`${serverURL}/project/create/new`,data);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Project Created Successfully")
      const data = response.data.project;
      setCurrProject(data);
      await getUserProjects(id);


    }
  } catch (error) {
    throwError(error);
  }

}
 
const [uploadedFolders, setUploadedFolders]= useState([]);
const uploadProjectFILES = async(id, data)=>{
      if(!id){
        toast.warn("ID is required");
      }
      if(!data){
        toast.warn("Data is required");

      }
      try {
        const response = await axios.put(`${serverURL}/project/${id}/files`,data);
        verifyResponse(response);

        if(response.data.success){
          toast.success(response.data.message)
          setUploadedFolders(response.data.folders);
        }
        
      } catch (error) {
        throwError(error);
      }
}



const [thisProjectFiles,setThisProjectFiles] = useState([]);
const fetchProjectFiles = async(id)=>{
  if(!id || id === "undefined"){
    return;
  }
  try {
    const uId = localStorage.getItem("userId");
    const response = await axios.get(`${serverURL}/project/list/${uId}/${id}/folders`);
    verifyResponse(response);
    if (response.data.success){
        const data = response.data.folders;
        setThisProjectFiles(data);
    }
    
  } catch (error) {
    throwError(error)
  }
}

const [githubRepo,setGithubRepo] = useState([]);

const getThisUserGithubRepo = async()=>{
  const id = localStorage.getItem("userId");
  if(!id){
    toast.warn("ID is required for fetching repo");
  }
  try {
    const response = await axios.get(`${serverURL}/authorize/github-repo/${id}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.repos;
      setGithubRepo(data);

    }




    
  } catch (error) {
    throwError(error)
  }

}
const linkThisUserGithub = async()=>{
  const id = localStorage.getItem("userId");
  if(!id){
    toast.warn("ID is required for fetching repo");
  }
  try {
    const response = await axios.get(`${serverURL}/authorize/github/link/${id}`);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Github profile added successfully");
      navigate(`/auth/${hash}/${username}/workspace`)
    }




    
  } catch (error) {
    throwError(error)
  }

}

const importGithubRepo = async (projectId, repoOwner, repoName, branch = "main") => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.warn("User ID is required to import repo");
    return;
  }
  try {
    const response = await axios.post(`${serverURL}/project/${projectId}/import-github`, {
      userId,
      repoOwner,
      repoName,
      branch,
    });
    verifyResponse(response);
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchProjectFiles(projectId);
    }
  } catch (error) {
    throwError(error);
  }
};


// projectRoutes.get("/list/project=:projectId/user=:userId/check-authorization",checkForProjectAuthorization)
// projectRoutes.post("/list/project=:projectId/user=:userId/send-join-request",requestToJoinProject)
// projectRoutes.patch("/list/project=:projectId/user=:userId/decision=:patch",patchJoinRequests)

const [hasAuthToSeeProject, setHasAuthToSeeProject] = useState(null);

const checkAuthorityToViewProject = async(projectId)=>{
      if(!projectId){
        toast.warn("Project ID is required");
      }
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${serverURL}/project/list/project=${projectId}/user=${userId}/check-authorization`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.hasAuth;
          setHasAuthToSeeProject(data);
          toast.success(response.data.message);

        }

        
      } catch (error) {
        throwError(error);
      }

}




const patchProjectJoinRequest = async(projectId,patch)=>{
    if(!projectId || !patch){
        toast.warn("ID and patch are required");
      }
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.patch(`${serverURL}/project/list/project=${projectId}/user=${userId}/decision=${patch}`);
        verifyResponse(response);
        if(response.data.success){
          toast.success(response.data.message);
          
        }
        
      } catch (error) {
        throwError(error)
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
  if(!id || id === "undefined"){
    return;
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
    const response = await axios.get(`${serverURL}/project/list/${id}/activities`);
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
    const response = await axios.get(`${serverURL}/project/list/${id}/teams-list`);
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
    const response = await axios.get(`${serverURL}/project/list/${id}/members-list`);
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


const [searchedProjects,setSearchedProjects] = useState(null);

const searchProjects = async(text,page)=>{
  try {
    const response = await axios.get(`${serverURL}/project/list/all/search?q=${text || ""}&page=${page || 1}`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data;
      setSearchedProjects(data);
    }
  } catch (error) {
    throwError(error);
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

const [projectFiles,setProjectFiles] = useState([]);
const getProjectFiles = async(id)=>{
  try {
    const response = await axios.get(`${serverURL}/project/${id}/folder/files`);
    verifyResponse(response);
    if(response.data.success){
      const data = response.data.files;
      setProjectFiles(data);
    }
    
  } catch (error) {
    throwError(error)
  }

}
 
const uploadFiles = async(id,files)=>{
  if(!id || !files || !files.length){
    toast.success("ID and file are required");
  }
      try {
        const response = await axios.put(`${serverURL}/project/${id}/files`,files);
        verifyResponse(response);
        if(response.data.success){
            toast.success(response.data.message);
            await projectById(id);
        }

        
      } catch (error) {
        throwError(error)
      }
}


const [reqStatus,setReqStatus] = useState("not_requested");

const sendProjectJoinRequest = async(projectId)=>{
      if(!projectId){
        toast.warn("ID is required");
      }
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.post(`${serverURL}/project/list/project=${projectId}/user=${userId}/send-join-request`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.status;
          setReqStatus(data);
         
          toast.success(response.data.message);
          await projectById(projectId)
        }
        
      } catch (error) {
        throwError(error)
      }
}


const checkProjectJoinRequest = async(projectId)=>{
      if(!projectId){
        toast.warn("ID is required");
      }

      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${serverURL}/project/list/project=${projectId}/user=${userId}/check-request-status`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.status;
          setReqStatus(data);
          await projectById(projectId)
        }
        
      } catch (error) {
        throwError(error)
      }
}

const [pendingProjectReqLists, setPendingProjectReqLists] = useState([]);
const getPendingProjectRequests = async(projectId)=>{
      if(!projectId){
        toast.warn("ID is required");

      }
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${serverURL}/project/list/project=${projectId}/user=${userId}/pending-request-list`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.userData;
          setPendingProjectReqLists(data);
        }
        
      } catch (error) {
        throwError(error);
      }
}



 






// TEAMS ENDPOINTS 

const createTeam = async(data)=>{
  if(!data){
    toast.warn("Data is required");
  }
  try {
    const response = await axios.post(`${serverURL}/team/create`,data);
    verifyResponse(response);
    if(response.data.success){
      toast.success("Team Created successfully");
      const id = localStorage.getItem("userId");
      await getUsersTeam(id);
      
    }
  } catch (error) {
    throwError(error);
  }
}

const inviteMemberToTeam = async (teamId, participant) => {
  if (!teamId || !participant) {
    toast.warn("Team ID and Participant ID are required");
    return false;
  }
  try {
    const response = await axios.put(`${serverURL}/team/add/${teamId}/participant/${participant}`);
    verifyResponse(response);
    if (response.data.success) {
      toast.success(response.data.message || "Team invitation sent successfully");
      await getTeamByID(teamId);
      return true;
    }
    return false;
  } catch (error) {
    throwError(error);
    return false;
  }
};

const removeMemberFromTeam = async (teamId, participant) => {
  if (!teamId || !participant) {
    toast.warn("Team ID and Participant ID are required");
    return false;
  }
  try {
    const response = await axios.delete(`${serverURL}/team/remove/${teamId}/participant/${participant}`);
    verifyResponse(response);
    if (response.data.success) {
      toast.success(response.data.message || "Member removed from team");
      await getTeamByID(teamId);
      return true;
    }
    return false;
  } catch (error) {
    throwError(error);
    return false;
  }
};

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
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${serverURL}/team/list/all/search?q=${text || ""}&createdBy=${userId || ""}`);
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



// TeamRoutes.get("/list/project=:projectId/user=:userId/check-authorization",checkForTeamAuthorization)
// TeamRoutes.post("/list/project=:projectId/user=:userId/send-join-request",requestToJoinTeam)
// TeamRoutes.patch("/list/project=:projectId/user=:userId/decision=:patch",patchTeamJoinRequests)


const [hasAuthToSeeTeam, setHasAuthToSeeTeam] = useState(null);

const checkAuthorityToViewTeam = async (teamId) => {
  if (!teamId) {
    toast.warn("Team ID is required");
    return;
  }
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(
      `${serverURL}/team/list/team=${teamId}/user=${userId}/check-authorization`
    );
    verifyResponse(response);

    if (response.data.success) {
      const data = response.data.hasAuth;
      setHasAuthToSeeTeam(data);
      toast.success(response.data.message);
    }
  } catch (error) {
    throwError(error);
  }
};
const patchTeamJoinRequest = async (teamId, patch) => {
  if (!teamId || !patch) {
    toast.warn("Team ID and patch are required");
    return;
  }
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.patch(
      `${serverURL}/team/list/team=${teamId}/user=${userId}/decision=${patch}`
    );
    verifyResponse(response);

    if (response.data.success) {
      toast.success(response.data.message);
    }
  } catch (error) {
    throwError(error);
  }
};

const [teamReqStatus,setTeamReqStatus] = useState("");
const sendTeamJoinRequest = async (teamId) => {
  if (!teamId) {
    toast.warn("Team ID is required");
    return;
  }
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.post(
      `${serverURL}/team/list/team=${teamId}/user=${userId}/send-join-request`
    );
    verifyResponse(response);

    if (response.data.success) {
      const data = response.data.status;
      setTeamReqStatus(data);
      toast.success(response.data.message);
      await getTeamByID(teamId); // 🔄 refresh team details after sending request
    }
  } catch (error) {
    throwError(error);
  }
};

const [teamJoinReqList, setTeamJoinReqList] = useState([]);
const getTeamJoinRequests = async(teamId)=>{
      if(!teamId){
        toast.warn("ID is required");
      }
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${serverURL}/team/list/team=${teamId}/user=${userId}/join-req-list`);
        verifyResponse(response);
        if(response.data.success){
          const data = response.data.userData;
          setTeamJoinReqList(data);
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
    console.log(error)
    
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


// MAILING


 const [loading, setLoading] = useState(false);
const [lastResponse, setLastResponse] = useState(null);
const [error, setError] = useState(null);

/**
 * 🧠 1️⃣ Direct Mail (user ↔ user/admin)
 * Endpoint: POST /api/ai-mail/direct
 */
const sendDirectMail = async (senderName, senderEmail, receiverEmail, subject, context) => {
  setLoading(true);
  setError(null);
  setLastResponse(null);

  try {
    const res = await axios.post(`${serverURL}/ai-mail/direct`, {
      senderName,
      senderEmail,
      receiverEmail,
      subject,
      context,
    });

    setLastResponse(res.data);
    return res.data; // component handles the result
  } catch (err) {
    console.error("❌ Direct Mail error:", err);
    setError(err.response?.data || "Server error");
    throw err;
  } finally {
    setLoading(false);
  }
};

/**
 * 🧠 2️⃣ Complaint Mail (user → platform owner/admin)
 * Endpoint: POST /api/ai-mail/complaint
 */
const sendComplaintMail = async (senderName, senderEmail, subject, context) => {
  setLoading(true);
  setError(null);
  setLastResponse(null);

  try {
    const res = await axios.post(`${serverURL}/ai-mail/complaint`, {
      senderName,
      senderEmail,
      subject,
      context,
    });

    setLastResponse(res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Complaint Mail error:", err);
    setError(err.response?.data || "Server error");
    throw err;
  } finally {
    setLoading(false);
  }
};





const [userNotifications, setUserNotifications] = useState([]);

const getUserNotifications = async (userId) => {
  if (!userId) return;
  try {
    const response = await axios.get(`${serverURL}/user/info/${userId}/notifications`);
    verifyResponse(response);
    if (response.data.success) {
      setUserNotifications(response.data.notifications);
    }
  } catch (error) {
    throwError(error);
  }
};

const markNotificationsRead = async (userId) => {
  if (!userId) return;
  try {
    const response = await axios.put(`${serverURL}/user/info/${userId}/notifications/read`);
    verifyResponse(response);
    if (response.data.success) {
      getUserNotifications(userId);
    }
  } catch (error) {
    throwError(error);
  }
};

const createTeamMember = async (data) => {
  if (!data) {
    toast.warn("Data is required");
    return false;
  }
  try {
    const response = await axios.post(`${serverURL}/user/register`, data);
    verifyResponse(response);
    if (response.data.success) {
      toast.success("Team member created successfully");
      return true;
    }
    return false;
  } catch (error) {
    throwError(error);
    return false;
  }
};

  useEffect(()=>{
    setUserData(userData);
  },[userData]);


  const contextObj = {serverURL, importGithubRepo, unLinkThisUserGithub,linkThisUserGithub,getThisUserGithubRepo,githubRepo,getTeamJoinRequests,teamJoinReqList,getPendingProjectRequests,pendingProjectReqLists,sendTeamJoinRequest,teamReqStatus,patchTeamJoinRequest,checkAuthorityToViewTeam,hasAuthToSeeTeam,checkProjectJoinRequest,reqStatus,patchProjectJoinRequest,sendProjectJoinRequest,checkAuthorityToViewProject,hasAuthToSeeProject,fetchProjectFiles,thisProjectFiles,uploadProjectFILES,uploadedFolders,createTeam,registerUser,userData,getUserDataById,authUserData,getAllUsers,allUsers,deleteProfile,PatchUserProfile,userTeams,getUsersTeam,userLastSeen,getLastActiveTime,updateUserProfile,changeUserRole,userActivities,getUserActivities,formatDateTime,getCurrentUserData,currUserData,getTeamByID,teamData,getUserIDs,userIds,createProject,currProject,allProjects,getAllProjects,project,projectById,projectActivities,getActivitiesOfProject,projectTeam,getProjectTeam,allMembers,getAllMembers,addMember,removeMember,addTeam,removeTeam,getProjectStats,projectStats,getUserProjects,userProjects,getTeamIDByName,teamIds,getUserTickets,userTickets,createActivity,getProjectComments,projectComments,getTicketComments,ticketComments,postComment,searchUser,searchedUser,searchProjects,searchedProjects,searchTeams,searchedTeams,searchUserProfiles,allUserProfiles,updateTeam,createTicket,ticket,getUserAssignedTickets,userAssignedTickets,getFilteredTickets,filteredTickets,getThisProjectTickets,thisProjectTickets,getUserTicketsForNotification,userTicketsForNotification,getUserAssignedTicketsForNotification,userAssignedTicketsForNotification,getSingleTicket,singleTicket,getThisTicketActivities,thisTicketActivities,updateTicket,updateProject,deleteActivity,deleteTicket,patchTicketStatus,deleteProject,logoutUser,getProjectFiles,projectFiles,uploadFiles, sendDirectMail,
    sendComplaintMail,
    loading,
    lastResponse,
    error,
    theme,
    toggleTheme,
    userNotifications,
    getUserNotifications,
    markNotificationsRead,
    createTeamMember,
    inviteMemberToTeam,
    removeMemberFromTeam,
  };

  return (
    <TrackForgeContextAPI.Provider value={contextObj}>
      {children}
    </TrackForgeContextAPI.Provider>
  );
};  
