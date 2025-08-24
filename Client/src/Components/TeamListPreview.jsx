import { Clock, Leaf, LinkIcon, LogOut, MoreHorizontal, Option, PersonStanding, Search, Trash } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';

const TeamListPreview = ({userTeams}) => {
    const {hash,username} = useParams();
    
    const navigate = useNavigate();
    const {formatDateTime,searchTeams,searchedTeams} = useContext(TrackForgeContextAPI);
        const [searchTerm,setSearchTerm] = useState("");
            useEffect(()=>{
                if(searchTerm !==""){
        
                    searchTeams(searchTerm);
                }
        
            },[searchTerm]); 
        
            useEffect(()=>{
                console.log(searchedTeams)
        
            },[searchedTeams]);
  return (
    <div className='flex gap-5 items-start justify-between'>
    <div className={`flex shrink-0 items-start justify-start gap-10 flex-wrap flex-col w-3xl`}>
            {userTeams && userTeams.length > 0 ? (
        userTeams.map((t, i) => (
          <div onClick={()=>navigate(`/auth/${hash}/${username}/workspace/team/${t?.team?._id}`)} key={i} className="py-4  hover:shadow-2xl border-gray-200 cursor-pointer px-5 mb-4 w-full rounded shadow bg-gray-50 text-gray-700 min-w-2xl">
           
            <h2 className="text-xl flex items-center justify-start gap-3 font-semibold text-gray-900 mb-2">
                <Leaf className='h-8 w-8 p-1 rounded border border-gray-300 text-gray-900 '/>
                <span>
                    {t.team.name}
                </span>
                
                </h2>
            
            <div className="flex items-center gap-2 text-teal-500 font-medium text-sm mb-2 cursor-pointer"
                 onClick={() => navigator.clipboard.writeText(t.team.link.url)}>
              <LinkIcon className="w-4 h-4" />
              <span className="truncate">{t.team.link.url}</span>
            </div>

           
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
              <Clock className="w-4 h-4" />
              Created on {formatDateTime(t.team.createdAt)}
            </div>

           
            
          </div>
        ))
      ) : (
        <p>No Teams</p>
      )}

      
            <div className='w-fit mt-5 mx-auto p-5'>
              <Link to={`/auth/${hash}/${username}/workspace/team`} className=' px-10 py-1.5 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-800 hover:text-white transition-all'>
              Create another team
              </Link>
      
            </div>
    </div>

   <div className='flex-1 p-5 h-full shadow rounded '>
    <h1 className='text-center text-2xl'>Search Teams to join</h1>
    <div className='mt-3 border border-gray-100 rounded p-3 w-full flex items-center justify-start gap-3'>
        <label htmlFor="search">
            <Search/>
        </label>
        <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} type="search" name='search' placeholder='Frontend dev...' className='outline-none px-4 py-2 bg-gray-100 rounded flex-1 text-gray-900' />
        <button className='py-1.5 px-3 cursor-pointer hover:bg-gray-900 hover:text-white transition-all rounded font-medium text-gray-900 bg-gray-100'>
            Go
        </button>

    </div>

    <div className='p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll'>
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

    </div>
    </div>
  )
}

export default TeamListPreview
