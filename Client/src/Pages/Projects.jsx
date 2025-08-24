import React from 'react'
import { useContext } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ProjectPreview from '../Components/ProjectPreview';
import { useState } from 'react';
import { Clock, Search, Send, StickyNote, Trash, Type, User, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const Projects = () => {
  const {createProject,currProject,allProjects,getAllProjects,project,projectById,projectActivities,getActivitiesOfProject,projectTeam,getProjectTeam,allMembers,getAllMembers,addMember,removeMember,addTeam,removeTeam,getProjectStats,projectStats,getUserProjects,userProjects,getUserIDs,userIds,getTeamIDByName,teamIds} = useContext(TrackForgeContextAPI);
  const {hash,username} = useParams();
  
 

  // useEffect(()=>{
  //   console.log(userProjects);

  // },[userProjects])

  const [searchText,setSearchText] = useState("");
  const [list,setList] = useState("All");

  const [projectForm,setProjectForm] = useState({
    name:"",
    description:"",
    owner:localStorage.getItem("userId"),
    startedOn:Date.now() + 7 * 60 * 1000,
    deadline:"",
    teams:[],
    members:[],

  })
  useEffect(()=>{
    const id = localStorage.getItem("userId");
    if(id){
      getUserProjects(id);
       
    }

    
  },[hash])

  const [usernames,setUserNames] = useState([]);
  const [teamNames,setTeamNames] = useState([]);

  useEffect(()=>{
      if(usernames && usernames.length>0){
          getUserIDs(usernames);
      }
  
    },[usernames]);

  useEffect(()=>{
      if(teamNames && teamNames.length>0){
          getTeamIDByName(teamNames);
      }
  
    },[teamNames]);

    const [memberName,setMemberName] = useState("");
    const [teamName,setTeamName] = useState("");
  
  
    const addUser = () => {
      if (memberName.trim() !== "") {
        setUserNames([...usernames, memberName.trim()]);
        setMemberName("");
      }
    };
    const removeUser = (index) => {
      const updatedUsernames = usernames.filter((_, i) => i !== index);
      setUserNames(updatedUsernames);
    };


    
    const addTeamToProject = () => {
      if (teamName.trim() !== "") {
        setTeamNames([...teamNames, teamName.trim()]);
        setTeamName("");
      }
    };
    const removeTeamForProject = (index) => {
      const updatedTeamNames = teamNames.filter((_, i) => i !== index);
      setTeamNames(updatedTeamNames);
    };
  

    useEffect(()=>{
      // console.log("teamIds", teamIds);
      // console.log("userIds",userIds);

      if( teamIds &&teamIds.length>0){
          setProjectForm((prev) => ({
      ...prev,
      teams: teamIds
    }))

      }



      if( userIds &&userIds.length>0){
          setProjectForm((prev) => ({
      ...prev,
      members: userIds
    }))

      }

    },[teamIds,userIds])

      const [loading,setLoading] = useState(false);

   const submitHandler = async(e) => {
    e.preventDefault();
    setLoading(true);

    await createProject(projectForm);  // Wait for API to complete
    console.log(projectForm);

    if (currProject && currProject.name !== "") {
        toast.success("Project Created");

        setProjectForm({
            name: "",
            description: "",
            owner: localStorage.getItem("userId"),
            startedOn: Date.now() + 2 * 60 * 1000,
            deadline: "",
            teams: [],
            members: [],
        });

        setTeamNames(null);
        setUserNames(null);
    }

    setLoading(false);
};

    
    

  return (
    <div className='w-full p-5 min-h-[100vh]'>
     <div className='py-5 flex items-center justify-start gap-5'>
  <span
    onClick={() => setList("All")}
    className={`px-4 ${list === "All" ? "bg-gray-900 text-white" : ""} py-1.5 border border-gray-300 rounded shadow min-w-30 text-center cursor-pointer transition-all text-gray-700 hover:bg-gray-900 hover:text-white`}
  >
    All
  </span>
  <span
    onClick={() => setList("Archived")}
    className={`px-4 ${list === "Archived" ? "bg-gray-900 text-white" : ""} py-1.5 border border-gray-300 rounded shadow min-w-30 text-center cursor-pointer transition-all text-gray-700 hover:bg-gray-900 hover:text-white`}
  >
    Archived
  </span>
  <span
    onClick={() => setList("Un-archived")}
    className={`px-4 ${list === "Un-archived" ? "bg-gray-900 text-white" : ""} py-1.5 border border-gray-300 rounded shadow min-w-30 text-center cursor-pointer transition-all text-gray-700 hover:bg-gray-900 hover:text-white`}
  >
    Un-archived
  </span>
  
  <div className='flex items-center justify-start gap-2'>
    <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      type="search"
      className='outline-none border rounded-md shadow-sm focus:shadow-lg border-gray-300 p-2 flex-1 w-lg'
      placeholder='Search - Frontend Devs...'
    />
    <Search
      className={`h-9 w-9 p-1 ${searchText.length > 0 ? "bg-gray-800 text-white" : "border border-gray-600 bg-gray-400 text-gray-700"} rounded cursor-pointer`}
    />
  </div>
</div>

     {
     (userProjects && userProjects.projects && userProjects.projects.length) ?  
      (<ProjectPreview projects={userProjects}/>)
      :(
        <p className='text-lg font-medium text-gray-700'>You do not have any projects, create now</p>

      )
     }


    <div className='mt-15'>
      <form onSubmit={submitHandler} className='max-w-full bg-white p-5 rounded shadow'>
        <h1 className=' text-center text-4xl mb-10 text-green-500 w-full py-2 border-b border-gray-200'>
          Create new Project
        </h1>

        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-4 mb-4'>
  <label htmlFor="name" className='flex items-center justify-start gap-2 text-gray-700 w-40'>
    <Type className='bg-gray-600 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
    Project Name
  </label>

  <input
    value={projectForm.name}
    name='name'
    onChange={(e) => setProjectForm((prev) => ({
      ...prev,
      name: e.target.value
    }))}
    type="text"
    className='outline-none border rounded-md shadow-sm focus:shadow-lg border-gray-300 p-2 w-lg'
    placeholder='Food Ordering Platform...'
  />
  
</div>
        <div className='flex items-center gap-4 mb-4'>
  <label htmlFor="description" className='flex items-center justify-start gap-2 text-gray-700 w-40'>
    <StickyNote className='bg-gray-600 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
   About Project
  </label>

  <textarea
    value={projectForm.description}
    name='description'
    onChange={(e) => setProjectForm((prev) => ({
      ...prev,
      description: e.target.value
    }))}
    type="text"
    className='outline-none border rounded-md shadow-sm focus:shadow-lg border-gray-300 p-2 w-lg h-80 resize-none overflow-y-scroll noScroll'
    placeholder='Food Ordering Platform...'
  />

</div>
        <div className='flex items-center gap-4 mb-4'>
  <label htmlFor="description" className='flex items-center justify-start gap-2 text-gray-700 w-40'>
    <Clock className='bg-gray-600 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded'/>
   Deadline
  </label>

  <input
    value={projectForm.deadline}
    name='deadline'
    onChange={(e) => setProjectForm((prev) => ({
      ...prev,
      deadline: e.target.value
    }))}
    type="date"
    className='outline-none border rounded-md shadow-sm focus:shadow-lg border-gray-300 p-2 w-lg '
    placeholder='Food Ordering Platform...'
  />

</div>

          </div>


          <div>

            <div>
  {/* Input Field */}
  <div className='flex items-center justify-between gap-5 mb-5 max-w-xl'>
    <label htmlFor="member" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-40'>
      <User className='bg-gray-600 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded' /> Member
    </label>
    <div className='max-w-lg gap-2 w-lg flex items-center justify-between'>
      <input
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        type="text"
        name="member"
        id="member"
        className='flex-1 py-2 px-3 outline-none border border-gray-200 shadow rounded'
        placeholder='Enter username and click send'
      />
      <Send
        onClick={addUser}
        className={`h-9 w-9 ${memberName.trim() !== "" ? "bg-gray-900 text-white" : "text-gray-900 border border-gray-400"} p-1 rounded shadow cursor-pointer`}
      />
    </div>
  </div>

  {/* Usernames Preview */}
  <div className='p-5 flex flex-wrap gap-2'>
    {usernames.map((u, i) => (
      <div key={i} className='flex items-center justify-start gap-1 text-sm px-2 py-1 border border-gray-300 rounded-full bg-gray-50'>
        <span>{u}</span>
        <Trash
          onClick={() => removeUser(i)}
          className='h-4 w-4 text-red-500 cursor-pointer hover:scale-110 transition'
        />
      </div>
    ))}
  </div>
</div>



          <div>
  {/* Team Input Field */}
  <div className='flex items-center justify-between gap-5 mb-5 max-w-xl'>
    <label htmlFor="team" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-40'>
      <Users className='bg-gray-600 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded' /> Team
    </label>
    <div className='max-w-lg gap-2 w-lg flex items-center justify-between'>
      <input
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        type="text"
        name="team"
        id="team"
        className='flex-1 py-2 px-3 outline-none border border-gray-200 shadow rounded'
        placeholder='Enter team name and click add'
      />
      <Send
        onClick={addTeamToProject}
        className={`h-9 w-9 ${teamName.trim() !== "" ? "bg-gray-900 text-white" : "text-gray-900 border border-gray-400"} p-1 rounded shadow cursor-pointer`}
      />
    </div>
  </div>

  {/* Teams Preview */}
  <div className='p-5 flex flex-wrap gap-2'>
    {teamNames.map((t, i) => (
      <div key={i} className='flex items-center justify-start gap-1 text-sm px-2 py-1 border border-gray-300 rounded-full bg-gray-50'>
        <span>{t}</span>
        <Trash
          onClick={() => removeTeamForProject(i)}
          className='h-4 w-4 text-red-500 cursor-pointer hover:scale-110 transition'
        />
      </div>
    ))}
  </div>
      </div>








    

          </div>
        </div>

        <div className='w-fit mx-auto my-10'>
          <button type='submit' className='px-6 py-1.5 rounded shadow border border-gray-300 cursor-pointer hover:bg-green-500 hover:text-white transition-all'>
          
          Create Project
        </button>
        </div>

      </form>


    </div>
      


      
    </div>
  )
}

export default Projects
