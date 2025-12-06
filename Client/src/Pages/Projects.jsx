import React from 'react'
import { useContext } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ProjectPreview from '../Components/ProjectPreview';
import { useState } from 'react';
import { ChevronLeft, Clock, Plus, Search, Send, StickyNote, Trash, Type, User, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import SearchUser from '../Components/SearchUser';
import SearchTeam from '../Components/SearchTeams';

const Projects = () => {
  const {createProject,getUserProjects,userProjects,searchProjects,searchedProjects,getThisUserGithubRepo,githubRepo} = useContext(TrackForgeContextAPI);
  const {hash,username} = useParams();
  const navigate = useNavigate();
  


  const [searchText,setSearchText] = useState("");

  const [searchPage,setSearchPage] = useState(1);
  useEffect(()=>{
                if(searchText !==""){
        
                    searchProjects(searchText,searchPage);
                }
        
    },[searchText]); 

    
      useEffect(()=>{
        setTimeout(() => {
          setSearchText("");
        }, 10000);
      },[searchText])

  const [list,setList] = useState("All");

  const [projectForm,setProjectForm] = useState({
    name:"",
    description:"",
    owner:localStorage.getItem("userId"),
    startedOn:Date.now() + 7 * 60 * 1000,
    deadline:"",
    teams:[],
    members:[],
    files:[]

  })

  const [fileData, setFileData] = useState({
  filename: "",          
  path: "",              
  folder: "",           
  size: 0,              
  fileType: "",          
  uploadedAt: new Date(),
  uploadedBy: localStorage.getItem("userId")        
  });



  useEffect(()=>{
    const id = localStorage.getItem("userId");
    if(id){
      getUserProjects(id);
       
    }

    
  },[hash])


  

  

    const [selectedTeamIds, setSelectedTeamIds] = useState([]);
    const [selectedUserIds,setSelectedUserIds] = useState([]);
  
  
  
    const removeUser = (index) => {
      const updatedUserId = selectedUserIds.filter((_, i) => i !== index);
      setSelectedUserIds(updatedUserId);
    };


    const removeTeamForProject = (index) => {
      const updatedTeamId = selectedTeamIds.filter((_, i) => i !== index);
      setSelectedTeamIds(updatedTeamId);
    };


    
    useEffect(()=>{
      if(selectedTeamIds && selectedTeamIds.length){

        setProjectForm((prev) => ({
            ...prev,
            teams: [...selectedTeamIds], // force copy
          }));
      }



    },[selectedTeamIds]);

    
    useEffect(()=>{
      if(selectedUserIds && selectedUserIds.length){

        setProjectForm((prev) => ({
            ...prev,
            members: [...selectedUserIds], // force copy
          }));
      }



    },[selectedUserIds]);

    
  


    const [loading,setLoading] = useState(false);

   const submitHandler = async(e) => {
    e.preventDefault();
    setLoading(true);

    await createProject(projectForm);  
  

    setProjectForm({
        name: "",
        description: "",
        owner: localStorage.getItem("userId"),
        startedOn: Date.now() + 2 * 60 * 1000,
        deadline: "",
        teams: [],
        members: [],
        files:[]
    });

    setSelectedTeamIds([]);
    setSelectedUserIds([]);


    setLoading(false);
};





  
        


    const [addEntity,setAddEntity] = useState("Individual");

    
    const [creation,setCreation] = useState(false);



    useEffect(()=>{
        console.log("Projects - ",userProjects)
    },[userProjects])

  return (
    <div className='w-full p-5 min-h-[100vh] bg-white'>
     <div className='py-5 flex items-start justify-start gap-5'>
  <span
    onClick={() => setList("All")}
    className={`px-4 ${list === "All" ? "bg-purple-600 text-white" : "border border-purple-600"} py-1.5  shadow-2xl rounded min-w-30 text-center cursor-pointer transition-all text-purple-600 hover:bg-purple-600 hover:text-white`}
  >
    All
  </span>
  <span
    onClick={() => setList("Archived")}
    className={`px-4 ${list === "Archived" ? "bg-purple-600 text-white" : "border border-purple-600"} py-1.5  shadow-2xl rounded min-w-30 text-center cursor-pointer transition-all text-purple-600 hover:bg-purple-600 hover:text-white`}
  >
    Archived
  </span>
  <span
    onClick={() => setList("Un-archived")}
    className={`px-4 ${list === "Un-archived" ? "bg-purple-600 text-white" : "border border-purple-600"} py-1.5  shadow-2xl rounded min-w-30 text-center cursor-pointer transition-all text-purple-600 hover:bg-purple-600 hover:text-white`}
  >
    Un-archived
  </span>
  <span
    onClick={getThisUserGithubRepo}
    className={`px-4 ${list === "Get-GitHub_Repo" ? "bg-purple-600 text-white" : "border border-purple-600"} py-1.5  shadow-2xl rounded min-w-30 text-center cursor-pointer transition-all text-purple-600 hover:bg-purple-600 hover:text-white`}
  >
    Get Github Repo
  </span>

  <div>
      
  </div>
  
  <div className='relative flex items-center justify-start gap-2 '>
    <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      type="search"
      className='outline-none border rounded-md shadow-sm focus:shadow-lg border-purple-600 text-purple-600 p-2 flex-1 w-lg'
      placeholder='Search - Frontend Devs...'
    />
    <Search
      className={`h-9 w-9 p-1 ${searchText.length > 0 ? "bg-purple-700 text-white" : " shadow-2xl bg-purple-400 text-white"} rounded cursor-pointer`}
    />


      {
         searchText!=="" && searchedProjects!==null && searchedProjects.projects?.length &&
         <div className='p-3 absolute top-6 bg-white z-10 border mt-5 border-purple-400 rounded w-full max-h-100 overflow-y-scroll noScroll'>
  {searchText === "" ? (
    <p className='text-md text-purple-700'>Search Results appear here</p>
  ) : searchedProjects?.projects?.length > 0 ? (
    searchedProjects.projects.map((p, i) => (
      <p onClick={()=>navigate(`/auth/${hash}/${username}/workspace/projects/${p._id}`)} key={i} className='text-md flex rounded shadow hover:shadow-2xl hover:bg-purple-400 transition-all cursor-pointer flex-wrap items-center justify-between gap-3 text-purple-800 px-4 py-1.5 border border-purple-300 mb-3 font-medium'>
        <span>

        {p.name}
        </span>
        
        </p>
    ))
  ) : (
      
    <p className='text-md text-purple-600'>No Projects found for this search!!!</p>
  
  )}
</div>
        }
    
  </div>


</div>

     {
     (userProjects && userProjects.projects && userProjects.projects.length && !creation) ?  
      (<ProjectPreview projects={userProjects}/>)
      :(
        ""

      )
     }

<div onClick={()=>setCreation(!creation)} className={`p-5 w-fit ${creation?"bg-purple-700 text-white":"bg-white border-2 border-purple-400 rounded-2xl"}  rounded shadow-2xl  hover:text-white hover:bg-purple-700 cursor-pointer transition-all`}>
  <h1 className='flex text-gradient text-lg items-center min-w-60  justify-center gap-2 font-medium '>
   {creation?"Back to the list":" Create a new Project "}
    {creation?
    <ChevronLeft />:<Plus/>}
  </h1>
</div>


    {
      creation 
      &&
      (<div className='mt-5'>
      <form onSubmit={submitHandler} className='max-w-full bg-white p-5 rounded shadow text-purple-700'>
        <h1 className=' text-center text-4xl mb-10 text-gradient font-bold w-full py-2 border-b border-gray-200'>
          Create new Project
        </h1>

        <div className='flex items-start justify-between gap-5'>
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


    <div className='flex-1'>
      <div className='flex items-center justify-between gap-1 border border-gray-50'>
        <span className={`flex-1 px-5 py-3 rounded text-center ${addEntity==="Team"?"bg-purple-600 text-white":"bg-white text-purple-700 border border-purple-600"} transition-all cursor-pointer font-medium text-lg`} onClick={()=>setAddEntity("Team")}>Teams</span>
        <span className={`flex-1 px-5 py-3 rounded text-center ${addEntity==="Individual"?"bg-purple-600 text-white":"bg-white text-purple-700 border border-purple-600"} transition-all cursor-pointer font-medium text-lg`} onClick={()=>setAddEntity("Individual")}>Individuals</span>

      </div>

      {
        addEntity ==="Team"
        &&(
       <div className='w-full  py-5'>
  <SearchTeam selectedTeamIds={selectedTeamIds} setSelectedTeamIds={setSelectedTeamIds}/>

  {/* Teams Preview */}
  <div className='p-5 flex flex-wrap gap-2'>
    {selectedTeamIds && selectedTeamIds.length
    ? 
    selectedTeamIds.map((t, i) => {
        const maskedId = t.slice(0, 5) + "*".repeat(t.length - 5);
      
      return(
      <div key={i} className='flex items-center justify-start gap-1 text-sm px-2 py-1 border border-gray-300 rounded-full bg-gray-50'>
        <span>{maskedId}</span>
        <Trash
          onClick={() => removeTeamForProject(i)}
          className='h-4 w-4 text-red-500 cursor-pointer hover:scale-110 transition'
        />
      </div>
    )})

    :(
      ""
    )

    }
  </div>
    </div>

        )
      }

        {
          addEntity ==="Individual"
          &&
          (
      <div className='py-5'>
 


   <SearchUser setSelectedUserIds={setSelectedUserIds} selectedUserIds={selectedUserIds} />

  {/* Usernames Preview */}
  <div className='p-5 flex flex-wrap gap-2'>
    { selectedUserIds && selectedUserIds.length ? 
    selectedUserIds.map((u, i) => {
        const maskedId = u.slice(0, 5) + "*".repeat(u.length - 5);
      
      return(
      
      <div key={i} className='flex items-center justify-start gap-1 text-sm px-2 py-1 border border-gray-300 rounded-full bg-gray-50'>
        <span>{maskedId}</span>
        <Trash
          onClick={() => removeUser(i)}
          className='h-4 w-4 text-red-500 cursor-pointer hover:scale-110 transition'
        />
      </div>
    )})
    :(
      ""
    )
  
  }
  </div>





          </div>

          )
        }



    </div>


          
        </div>

        <div className='w-fit mx-auto my-10'>
          <button type='submit' className='px-6 py-1.5 rounded shadow border text-gradient cursor-pointer hover:bg-purple-500 font-medium text-lg hover:text-white transition-all'>
          
          Create Project
        </button>
        </div>

      </form>


    </div>)
    }
      


      
    </div>
  )
}

export default Projects
