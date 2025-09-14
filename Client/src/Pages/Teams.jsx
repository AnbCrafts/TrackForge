import React, { useContext, useEffect, useState } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { Link, matchPath, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import PreviewTeam from '../Components/PreviewTeam';
import { BusFront, Expand, Group, GroupIcon, HdmiPortIcon, Link2, Projector, Search, Send, Shrink, Trash, User, X } from 'lucide-react';
import SearchUser from '../Components/SearchUser';
import SearchProjects from '../Components/SearchProjects';

const Teams = () => {
  const location = useLocation();

  
  const {userTeams,getUsersTeam,getTeamByID,teamData,getUserIDs,userIds,formatDateTime,searchTeams,searchedTeams,createTeam} = useContext(TrackForgeContextAPI);
  const {hash,teamId,username} = useParams();
  const id = localStorage.getItem("userId");
  useEffect(()=>{
    if(id){
      
      getUsersTeam(id);
    }

  },[id])

  const navigate = useNavigate();
  const [searchTerm,setSearchTerm] = useState("");
  useEffect(()=>{
                if(searchTerm !==""){
        
                    searchTeams(searchTerm);
                }
        
            },[searchTerm]); 
        
            

  const [selectedProjectIds,setSelectedProjectIds] = useState([]);
  const [selectedUserIds,setSelectedUserIds] = useState([]);


  const [teamForm,setTeamForm] = useState({
    name:"",
    projects:selectedProjectIds,
    createdBy:id,
    members:[{
      participant:"",
      joinedAt:""
    }]
  })


useEffect(() => {
  if (selectedUserIds && selectedUserIds.length > 0) {
    const data = selectedUserIds.map((id) => ({
      participant: id,
      joinedAt: new Date().toISOString(),
    }));

    console.log("Mapped members data:", data);

    setTeamForm((prev) => ({
      ...prev,
      members: data,
    }));
  }
}, [selectedUserIds]);

// Watch for updates




useEffect(()=>{
  if(selectedProjectIds && selectedProjectIds.length){
    console.log("Updating teamForm.projects with", selectedProjectIds);
    setTeamForm((prev) => ({
        ...prev,
        projects: [...selectedProjectIds], // force copy
      }));
  }
},[selectedProjectIds]);





  const [hidePreview,setHidePreview] = useState(false);

  const isEditPage = matchPath(
    "/auth/:hash/:username/workspace/team/:teamId/edit",
    location.pathname
  );
  
useEffect(() => {
  

  if (isEditPage) {
    setHidePreview(true);
  } else {
    setHidePreview(false);
  }
}, [location]);


  useEffect(()=>{
    getTeamByID(teamId)
  },[teamId])



  useEffect(()=>{
    setTimeout(() => {
      setSearchTerm("");
    }, 10000);
  },[searchTerm])



  


 


  const submitHandler = async(e)=>{
    e.preventDefault();

    console.log(teamForm)
   await createTeam(teamForm);
    setTeamForm({
       name:"",
    projects:[],
    createdBy:id,
    members:[{
      participant:"",
      joinedAt:""
    }]
    })

    setSelectedProjectIds([]);
    setSelectedUserIds([]);
  }



  

  return (
    <div className='bg-gray-200 p-5 rounded-2xl shadow-2xl '>
     <div className='p-5 flex items-center justify-start gap-5
      w-full'>
      <button className='px-4 py-1.5 border border-gray-300 bg-gray-800 text-white rounded font-medium cursor-pointer hover:bg-gray-800 hover:text-white transition-all shadow-lg'>All Teams</button>
      <button className='px-4 py-1.5 border border-gray-300 rounded font-medium cursor-pointer hover:bg-gray-800 hover:text-white transition-all shadow-lg'>Archived Teams</button>
      <div className='flex relative items-center justify-start gap-2'>
        <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} type="search" className='outline-none border rounded-md shadow-sm focus:shadow-lg border-gray-300 p-2 flex-1 w-lg' placeholder='Search - Frontend Devs...' />
        <Search className={`h-9 w-9 p-1 ${searchTerm.length>0?"bg-gray-800 text-white":"border border-gray-600 bg-gray-400 text-gray-700"}  rounded cursor-pointer`} />
        {
          searchTerm.length &&
         <div className='p-3 absolute top-6 bg-white z-10 border mt-5 border-gray-200 rounded w-full max-h-100 overflow-y-scroll noScroll'>
  {searchTerm === "" ? (
    <p className='text-md text-gray-400'>Search Results appear here</p>
  ) : searchedTeams?.teams?.length > 0 ? (
    searchedTeams.teams.map((t, i) => (
      <p onClick={()=>navigate(`/auth/${hash}/${username}/workspace/team/${t._id}`)} key={i} className='text-md flex rounded shadow hover:shadow-2xl hover:bg-gray-300 transition-all cursor-pointer flex-wrap items-center justify-between gap-3 text-gray-900 px-4 py-1.5 border border-gray-300 mb-3 font-medium'>
        <span>

        {t.name}
        </span>
        
        </p>
    ))
  ) : (
    <p className='text-md text-gray-400'>No Teams found for this search!!!</p>
  )}
</div>
        }


      </div>

       <div className='flex items-center justify-start gap-5'>
      {
        hidePreview ? (
          <Shrink
            onClick={() => !isEditPage && setHidePreview(false)} // disable if edit page
            className={`bg-red-500 h-8 w-8 p-1 rounded shadow-lg text-white ${
              isEditPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          />
        ) : (
          <Expand
            onClick={() => !isEditPage && setHidePreview(true)} // disable if edit page
            className={`bg-red-500 h-8 w-8 p-1 rounded shadow-lg text-white ${
              isEditPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          />
        )
      }
    </div>

       
     
     </div>

     
        {
        userTeams && userTeams.length>0
        ?
        (
      <div className='flex  gap-3 items-start justify-between'>
        <div>
          
          <PreviewTeam team={userTeams} hide={hidePreview} />
        </div>
      <div className='flex-1 bg-white max-h-[100vh] h-auto rounded-lg shadow-lg relative'>
       
       <Outlet/>
       







      </div>
      </div>

        )
        :
        
        (
          <div>
          <p className='text-lg font-medium text-gray-700'>No Teams Found</p>
        </div>
        )
      }




      <div className='p-5 mt-5 bg-white w-full'>
        <h1 className='text-3xl text-gray-900 mb-5'>Create Your own Team</h1>

      <form onSubmit={submitHandler} className='border border-gray-300 w-full p-10 rounded-lg shadow'>
        <div className='flex items-center justify-between gap-5 mb-5 max-w-3xl'>
          <label htmlFor="name" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-3xs'>
            <GroupIcon/> Team Name
          </label>
          <input value={teamForm.name} onChange={(e)=>setTeamForm((prev) => ({
      ...prev,
      name: e.target.value,
    }))} type="text" name="name" id="name" className='py-2 px-3 outline-none border border-gray-200 shadow max-w-lg w-lg rounded' placeholder='Tech-knight...' />

        </div>


        <div className='flex items-center justify-between gap-5 mt-10'>

        <div className='w-full'>
      <SearchUser selectedUserIds={selectedUserIds} setSelectedUserIds={setSelectedUserIds}/>
{
  selectedUserIds && selectedUserIds.length > 0 && (
    <div className="p-5 mt-5 flex flex-wrap gap-2">
      {selectedUserIds.map((u, i) => {
        const maskedId = u.slice(0, 5) + "*".repeat(u.length - 5);

        return (
          <span
            key={i}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg text-sm font-mono"
          >
            {maskedId}
            <button
              type="button"
              onClick={() =>
                setSelectedUserIds((prev) => prev.filter((id) => id !== u))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </span>
        );
      })}
    </div>
  )
}


        </div>

        <div className='w-full'>

      <SearchProjects selectedProjectIds={selectedProjectIds} setSelectedProjectIds={setSelectedProjectIds}/>  

      {
  selectedProjectIds && selectedProjectIds.length > 0 && (
    <div className="p-5 mt-5 flex flex-wrap gap-2">
      {selectedProjectIds.map((u, i) => {
        const maskedId = u.slice(0, 5) + "*".repeat(u.length - 5);

        return (
          <span
            key={i}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg text-sm font-mono"
          >
            {maskedId}
            <button
              type="button"
              onClick={() =>
                setSelectedProjectIds((prev) => prev.filter((id) => id !== u))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </span>
        );
      })}
    </div>
  )
}


        </div>
        </div>
        
       




        

       



        <div className='w-fit mx-auto my-10'>
          <button type='submit' className='px-6 py-1.5 border border-gray-300 bg-gray-500 text-white hover:bg-gray-800 rounded shadow cursor-pointer'>Create Team</button>

        </div>
        

      </form>


       </div>
      
        


     

      
    </div>
  )
}

export default Teams
