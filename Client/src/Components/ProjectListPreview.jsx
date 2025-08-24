import { Leaf, LogOut, PersonStanding, Search, Trash } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';

const ProjectListPreview = ({projects}) => {
    const {searchProjects,searchedProjects,formatDateTime} = useContext(TrackForgeContextAPI);
    const{username,hash} = useParams();
    const navigate = useNavigate();

    const [page,setPage] = useState(1);
    const [searchTerm,setSearchTerm] = useState("");
    useEffect(()=>{
        if(searchTerm !==""){

            searchProjects(searchTerm,page);
        }

    },[searchTerm]); 

    

  return (
    <div className='flex items-start justify-between gap-5'>
    <div className=' flex items-center flex-col shrink-0 justify-start flex-wrap gap-5 w-3xl max-h-[80vh] overflow-y-scroll noScroll '>
        {
            projects 
            ?(
                projects?.projects?.map((p,i)=>{
                    const {project,owner} = p;
                    return(
                        <div onClick={()=>navigate(`/auth/${hash}/${username}/workspace/projects/${project?._id}`)} key={i} className='p-3 relative text-gray-800 bg-gray-50 border border-gray-200 shadow rounded-lg min-w-2xl w-full flex items-start justify-between cursor-pointer hover:shadow-2xl transition-all'>
                                <div>
                                <span className=' inline-flex items-center justify-start gap-2 text-2xl font-medium text-gray-800 mb-3'>
                                    <Leaf className='h-8 w-8 p-1 rounded border border-gray-300 text-gray-900 '/>
                                    {project.name}
                                </span>
                                <p className='flex items-center justify-start gap-2 font-medium text-gray-400 py-2 border-t border-gray-100'>
                                    <PersonStanding className='h-8 w-8 p-1 rounded border border-gray-300 text-gray-900 '/>
                                    {owner.username} | {owner.email}
                                </p>


                                </div>
                                <div className='mx-4 flex items-center justify-start gap-3' >
                                    <Trash className='p-1 text-red-500 h-8 w-8 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-300 transition-all'/>
                                    <LogOut className='p-1 text-red-500 h-8 w-8 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-300 transition-all'/>
                                </div>

                               
                            
                           
                            
                            
                         

                        </div>
                    )

                })
            )
            :(
                <p>
                    No Project Found
                </p>
            )
      }


      <div className='w-fit mt-5 mx-auto p-5'>
        <Link to={`/auth/${hash}/${username}/workspace/projects`} className=' px-10 py-1.5 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-800 hover:text-white transition-all'>
        Create another project
        </Link>

      </div>
    </div>

     <div className='flex-1 p-5 h-full shadow rounded '>
    <h1 className='text-center text-2xl'>Search Projects to join</h1>
    <div className='mt-3 border border-gray-100 rounded p-3 w-full flex items-center justify-start gap-3'>
        <label htmlFor="search">
            <Search/>
        </label>
        <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} type="search" name='search' placeholder='User Dashboard...' className='outline-none px-4 py-2 bg-gray-100 rounded flex-1 text-gray-900' />
        <button className='py-1.5 px-3 cursor-pointer hover:bg-gray-900 hover:text-white transition-all rounded font-medium text-gray-900 bg-gray-100'>
            Go
        </button>

    </div>

  <div className='p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll'>
  {searchTerm === "" ? (
    <p className='text-md text-gray-400'>Search Results appear here</p>
  ) : searchedProjects?.projects?.length > 0 ? (
    searchedProjects.projects.map((p, i) => (
      <p onClick={()=>navigate(`/auth/${hash}/${username}/workspace/projects/${p._id}`)} key={i} className='text-md flex rounded shadow hover:shadow-2xl hover:bg-gray-300 transition-all cursor-pointer flex-wrap items-center justify-between gap-3 text-gray-900 px-4 py-1.5 border border-gray-300 mb-3 font-medium'>
        <span>

        {p.name}
        </span>
        <span className='text-sm text-gray-400  shrink-0'>
        {formatDateTime(p.startedOn)}

        </span>
        </p>
    ))
  ) : (
    <p className='text-md text-gray-400'>No Projects found for this search!!!</p>
  )}
</div>


    </div>


    </div>
  )
}

export default ProjectListPreview
