import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Badge, Users, LinkIcon, Pen, Plus, Cross, Ban, Option, MoreHorizontal } from 'lucide-react';

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { teamData, getTeamByID, formatDateTime ,getCurrentUserData,currUserData} = useContext(TrackForgeContextAPI);

  useEffect(()=>{
    const id = localStorage.getItem("userId");
    getCurrentUserData(id);
  })
  const [activeDropdown, setActiveDropdown] = useState(null);  // holds current open memberId
  const toggleDropdown = (memberId) => {
    if (activeDropdown === memberId) {
      setActiveDropdown(null); // close if clicking again
    } else {
      setActiveDropdown(memberId); // open new dropdown
    }
  };

  useEffect(() => {
    getTeamByID(teamId);
  }, [teamId]);

  const [ hasAuthority,setHasAuthority] = useState(false);
  useEffect(()=>{
    if(currUserData && (currUserData.role ==="Admin" ||currUserData.role ==="Owner")){
        setHasAuthority(true);

    }else{
        setHasAuthority(false);
    }
  },[currUserData])

  
  
  
  
  if (!teamData || !teamData.raw) return <p className="text-center text-gray-500">Loading Team Details...</p>;
  const { creator, members, projects, raw } = teamData;

  return (
    <div className='max-w-full mx-auto min-h-[90vh] max-h-[100vh] overflow-y-scroll noScroll '>
      {/* Header */}
      <div className='p-6 bg-gray-900 rounded-t-xl text-white flex items-center justify-between '>
        <div>
            <h1 className='text-3xl font-bold'>{raw.name}</h1>
        <p className='text-sm text-gray-300'>Created on {formatDateTime(raw.createdAt)}</p>
        </div>

        {hasAuthority && <Link to={'edit'} className='flex items-center justify-start gap-3 border px-2 py-0.5 rounded border-gray-600 hover:bg-white hover:text-gray-900 transition-all cursor-pointer'>
            <span className='text-lg'>Edit</span>
            <Pen className='cursor-pointer'/>

        </Link>}
      </div>

      <div className='w-full flex items-center flex-wrap'>
        {/* Creator Info */}
      <div className='w-full'>
        
        <div className='p-5 bg-white  shadow  flex items-center gap-4'>
        <img src={creator.picture} alt='creator' className='w-14 h-14 rounded-full object-cover border border-gray-300' />
        <div>
          <p className='text-lg font-semibold'>{creator.firstName} {creator.lastName}
            <span className='px-3 py-0.5 bg-green-500 text-white rounded ml-6 text-sm'>{creator.role}</span>

          </p>
          <p className='text-sm text-gray-500'>@{creator.username} | {creator.email} 
          </p>
        </div>

        {/* {hasAuthority &&<p className='flex ml-10 items-center justify-start gap-2 px-2 py-1 border-gray-300 bg-gray-300 border rounded shadow cursor-pointer'>
            <span className='text-sm font-medium '>Add Admin</span>
            <Plus className=' bg-gray-900 h-7 w-7 p-1 rounded-full text-white'/>
        </p>} */}
        <Badge variant="secondary" className='ml-auto'>{creator.status}</Badge>
      </div>

      {/* Project Info */}
      {
        projects && projects.length>0?(
            projects.map(project=>{
              return(
                 <div key={project._id} className='p-5 bg-white  shadow '>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>Project: {project.name}</h2>
        <p className='text-gray-600'>{project.description}</p>
        <div className='flex mt-5 items-center justify-start gap-3'>
        <Link to={project._id} className='px-3 py-0.5 bg-green-500 text-white rounded text-sm  cursor-pointer'>View Project</Link>
     

        </div>
      </div>
              )
            })
        ):(
          <p>No Projects have been added</p>
        )
        
      }
     


      </div>

     <div className='w-full'>
         {/* Members List */}
      <div className='p-5 bg-white  shadow '>
        
        <div className='flex items-center justify-between w-full gap-5 mb-5'>
            <h2 className='text-xl font-semibold text-gray-800'>Team Members</h2>
        { hasAuthority && <p className='flex ml-10 items-center justify-start gap-2 px-2 py-1 border-gray-300 bg-gray-300 border rounded shadow cursor-pointer'>
            <span className='text-sm font-medium '>Add Members</span>
            <Plus className=' bg-gray-900 h-7 w-7 p-1 rounded-full text-white'/>
        </p>}
        </div>

         <div className='flex flex-wrap gap-4'>
      {members.map((member) => (
        <div key={member._id} className='flex relative items-center gap-2 bg-gray-100 px-4 py-2 rounded-full'>
          <Users className='w-5 h-5 text-blue-500' />
          <p className='text-gray-700 font-medium'>{member.firstName} {member.lastName}</p>
          <Badge variant="outline" className='ml-2'>{member.role}</Badge>

          { hasAuthority &&<MoreHorizontal
            className='cursor-pointer'
            onClick={() => toggleDropdown(member._id)}
          />}

          
          { hasAuthority && activeDropdown === member._id && (
            <div className='absolute right-0 top-10 rounded shadow-2xl p-2 flex flex-col items-center justify-start gap-2 bg-gray-800 text-white z-50'>
              <span className='text-sm py-0.5 border-b border-gray-700 px-1 hover:bg-gray-700 cursor-pointer block w-full text-center'>Remove</span>
              <span className='text-sm py-0.5 border-b border-gray-700 px-1 hover:bg-gray-700 cursor-pointer block w-full text-center'>Block</span>
              <span className='text-sm py-0.5 border-b border-gray-700 px-1 hover:bg-gray-700 cursor-pointer block w-full text-center'>Promote</span>
              <span className='text-sm py-0.5 border-b border-gray-700 px-1 hover:bg-gray-700 cursor-pointer block w-full text-center'>Add to project</span>
            </div>
          )}
        </div>
      ))}


    </div>

      </div>

      {/* Invite Link */}
      <div className='p-5 bg-white rounded-b-xl '>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>Invite Link</h2>
        <div className='flex items-center justify-between   gap-2'>
         <div className='flex items-center justify-start gap-3'>
           <LinkIcon className='w-5 h-5 text-green-600' />
          <a href={raw.link.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline truncate max-w-xs'>
            {raw.link.url}
          </a>
         </div>

          {hasAuthority && <p className='flex ml-10 items-center justify-start gap-2 px-2 py-1 bg-red-500 rounded shadow cursor-pointer'>
            <span className='text-sm font-medium text-white'>Discard Link</span>
            <Ban className=' bg-white h-7 w-7 p-1 rounded-full text-red-500'/>
        </p>}


        </div>
        <p className='text-sm text-gray-500 mt-1'>Valid Till: {formatDateTime(raw.link.validTill)} 
            
             
            <span className='px-3 ml-6 py-0.5 bg-green-500 text-white rounded text-sm'>{raw.link.status}</span>
            
            </p>
      </div>
     </div>
      </div>


    </div>
  );
};

export default TeamDetail;
