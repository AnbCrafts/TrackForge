import { Projector, Text, Timer } from 'lucide-react'
import React from 'react'
import { useContext } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'

const Activity = ({activity}) => {
    const {formatDateTime} = useContext(TrackForgeContextAPI);
  return (
    <div className='p-5 bg-gray-300 text-gray-900 w-xl rounded-xl shadow-2xl '>
        <div>
        <div className='flex items-center justify-start gap-3 font-semibold text-lg'>
                <Text className='h-10 w-10 p-1 rounded-full bg-gray-900 text-white'/>
            <span>
                Description
                </span>
        </div>
        <p className='p-2 max-w-lg h-20 overflow-ellipsis text-ellipsis whitespace-wrap'>{activity?.activity?.details}</p>
     
        </div>

       <div className='mt-3 flex items-center gap-5'>
        <div className='flex items-center justify-start gap-3 font-semibold text-lg'>
                <Text className='h-10 w-10 p-1 rounded-full bg-gray-900 text-white'/>
            <span>
                Project-
                </span>
        </div>
        <p className='p-2 max-w-lg  overflow-ellipsis text-ellipsis whitespace-nowrap'>
            {activity?.project?.name}
        </p>

        </div> 

        <p className='flex items-center justify-start gap-3 mt-5'>
            <Timer className='h-10 w-10 p-1 rounded-full bg-gray-900 text-white'/> <span className='text-gray-600 text-sm font-semibold'>{formatDateTime(activity?.activity?.doneOn)}</span>
        </p>



      
    </div>
  )
}

export default Activity
