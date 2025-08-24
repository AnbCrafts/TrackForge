import React from 'react'
import {ArrowBigRightDashIcon, ChevronRight, Expand, Eye, Forward, Leaf, PersonStanding, Presentation, Projector, RectangleVertical, Text, User} from 'lucide-react';
import { Link } from 'react-router-dom';


const ProjectPreview = ({projects}) => {

    // const {project,owner,members} = projects
  return (

    <>

   
    <div className=' flex items-center  justify-start flex-wrap gap-10'>
        {
            projects 
            ?(
                projects?.projects?.map((p,i)=>{
                    const {project,members,owner,actvities} = p;
                    return(
                        <div key={i} className='p-3 bg-gray-900 shadow rounded-lg max-w-xl min-h-72'>
                            <div className='text-start text-sm flex items-center justify-start gap-3 flex-wrap max-h-30 max-w-full overflow-hidden text-ellipsis whitespace-break-spaces'>

                                <span className=' inline-flex items-center justify-start gap-2 text-2xl font-medium text-white'>

                                    
                                    <Leaf className='h-8 w-8 p-1 rounded text-gray-900 bg-white'/>
                                  
                                    {project.name} - 
                                </span>
                                     <span className='flex items-center gap-5 text-gray-300'>
                                        <Text/>
                                {project.description}
                                    </span>


                            </div>
                            <div className='mt-3'>
                                <p className='flex items-center justify-start gap-2 font-medium text-gray-400'>
                                    <PersonStanding className='h-8 w-8 p-1 rounded text-gray-900 bg-white'/>
                                    {owner.username} | {owner.email}
                                </p>
                            </div>
                            <div className='mt-3'>
  <div className="flex items-center -space-x-2.5">
    {members.slice(0,3).map((m, i) => (
      <span
        key={i}
        className="h-8 w-8 flex items-center justify-center text-sm font-medium rounded-full bg-green-500 text-white shadow border-2 border-white"
      >
        {m.username.charAt(0).toUpperCase()}
      </span>
    ))}
    {members.length > 3 && (
      <div className="h-8 w-8 flex items-center justify-center text-xs font-bold rounded-full bg-white text-gray-700 shadow border-2 border-white">
        +{members.length - 3}
      </div>
    )}
<span className='px-5 flex items-center -space-x-6'>
    <ChevronRight className='h-8 w-8 text-green-500 hover:text-green-800 transition-all cursor-pointer' />
    <ChevronRight className='h-8 w-8 text-green-500 hover:text-green-800 transition-all cursor-pointer' />
    <ChevronRight className='h-8 w-8 text-green-500 hover:text-green-800 transition-all cursor-pointer' />
    </span>
  </div>

  <div className='mt-3 mx-auto w-fit'>
    <Link to={project._id} className='flex items-center justify-start gap-2 px-6 py-1.5 bg-green-500 text-white rounded shadow'>
    <Eye/>
    Visit Project
    
    </Link>

  </div>
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
    </div>


   
    </>
  )
}

export default ProjectPreview
