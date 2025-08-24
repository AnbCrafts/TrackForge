import React, { useContext, useEffect } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'

const CodeEditor = () => {
    const {getUserProjects,userProjects} = useContext(TrackForgeContextAPI);
    const id = localStorage.getItem("userId");
    useEffect(()=>{
        getUserProjects(id);
    })

   
  return (
    <div className='min-h-[100vh] w-full'>
        <div className='p-1 bg-gray-50 w-full min-h-10 flex items-center justify-start gap-3 border border-gray-200'>
        {
            userProjects && userProjects.projects && userProjects.projects.length
            ?(
                
                userProjects.projects
  .slice() // to avoid mutating original array
  .sort((a, b) => new Date(b.project.createdAt) - new Date(a.project.createdAt)) // oldest first
  .map((p) => (
    <span className='font-medium px-4 py-0.5 border-r border-gray-400 transition-all hover:bg-gray-900 hover:text-white cursor-pointer' key={p?.project?._id}>{p?.project?.name}</span>
  ))

            )
            :(
                <span>No Projects Found</span>
            )
        }

        </div>

      
    </div>
  )
}

export default CodeEditor
