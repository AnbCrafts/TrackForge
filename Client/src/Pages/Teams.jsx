import React, { useContext, useEffect, useState } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { Link, matchPath, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import PreviewTeam from '../Components/PreviewTeam';
import { BusFront, Expand, Group, GroupIcon, HdmiPortIcon, Link2, Projector, Search, Send, Shrink, Trash, User } from 'lucide-react';

const Teams = () => {
  const location = useLocation();

  
  const {userTeams,getUsersTeam,getTeamByID,teamData,getUserIDs,userIds,formatDateTime,searchTeams,searchedTeams} = useContext(TrackForgeContextAPI);
  const {hash,teamId,username} = useParams();
  useEffect(()=>{
    const id = localStorage.getItem("userId");
    if(id){
      
      getUsersTeam(id);
    }

  },[hash])

  const navigate = useNavigate();
  const [searchTerm,setSearchTerm] = useState("");
  useEffect(()=>{
                if(searchTerm !==""){
        
                    searchTeams(searchTerm);
                }
        
            },[searchTerm]); 
        
            useEffect(()=>{
                console.log(searchedTeams)
        
            },[searchedTeams]);

  

  const [teamForm,setTeamForm] = useState({
    name:"",
    projects:[],
    createdBy:"",
    link:{
      status:"Active",
      createdBy:"",
      validTill:"",
      createdAt:"",
      url:"",
    },
    members:[{
      participant:"",
      joinedAt:""
    }]
  })


 useEffect(() => {
  if (userIds && userIds.length > 0) {
    const data = userIds.map((id) => ({
      participant: id,
      joinedAt: new Date().toISOString(),
    }));

    setTeamForm((prev) => ({
      ...prev,
      members: data,
    }));
  }
}, [userIds]);





  const [usernames,setUserNames] = useState([]);
  useEffect(()=>{
    if(usernames.length>0){
        getUserIDs(usernames);
    }

  },[usernames]);


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



  const [memberName,setMemberName] = useState("");


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
      <div className='flex-1 bg-white min-h-[90vh] rounded-lg shadow-lg relative'>
       
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




      <div className='p-5 mt-5 bg-white'>
        <h1 className='text-3xl text-gray-900 mb-5'>Create Your own Team</h1>

      <form className='border border-gray-300 w-fit p-10 rounded-lg shadow'>
        <div className='flex items-center justify-between gap-5 mb-5 max-w-3xl'>
          <label htmlFor="name" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-3xs'>
            <GroupIcon/> Team Name
          </label>
          <input value={teamForm.name} onChange={(e)=>setTeamForm((prev) => ({
      ...prev,
      name: e.target.value,
    }))} type="text" name="name" id="name" className='py-2 px-3 outline-none border border-gray-200 shadow max-w-lg w-lg rounded' placeholder='Tech-knight...' />

        </div>
        
        <div>
      {/* Input Field */}
      <div className='flex items-center justify-between gap-5 mb-5 max-w-3xl'>
        <label htmlFor="participant" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-3xs'>
          <User /> Participant
        </label>
        <div className='max-w-lg gap-2 w-lg flex items-center justify-between'>
          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            type="text"
            name="participant"
            id="participant"
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

        <div className='flex items-center justify-between gap-5 mb-5 max-w-3xl'>
          <label htmlFor="name" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-3xs'>
            <Projector/> Project Name
          </label>
          <input type="text"  name="project" id="project" className='py-2 px-3 outline-none border border-gray-200 shadow max-w-lg w-lg rounded' placeholder='User Dashboard Preparation...' />

        </div>

        

        <div className='flex items-center justify-between gap-5 mb-5 max-w-3xl'>
          <label htmlFor="name" className='flex items-center justify-start gap-2 text-gray-600 text-lg w-3xs'>
            <Link2/> Link Validity
          </label>
          <input type="date" name="validTill" id="validTill" className='py-2 px-3 outline-none border border-gray-200 shadow max-w-lg w-lg rounded' placeholder='User Dashboard Preparation...' />

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
