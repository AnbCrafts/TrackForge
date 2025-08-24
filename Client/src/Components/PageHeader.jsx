import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { FiCloudLightning, FiLock, FiZap } from 'react-icons/fi'
import { ChevronDown, ChevronDownCircle, ChevronRight, CloudLightningIcon, Database, Folder, Home, LogOut, MoreVertical, MoveRight, User } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'

const PageHeader = ({want = true,name}) => {
    const [userId,setUserId] = useState(null);
    const {username,hash} = useParams();
    const [showMore,setShowMore] = useState(false);

    useEffect(()=>{
        const id = localStorage.getItem("userId");
        if(id){
            setUserId(id);
        }
    })

    const location = useLocation();
  return (
    <div className='p-2 px-10 flex items-center justify-between bg-gray-900 gap-5'>
        
        {
            want &&
            <Logo/>

        }

        <div className=" flex-1 flex items-center justify-between">
        
        <div className='flex items-center justify-start gap-3'>

        <div className="flex items-center justify-start gap-1 text-white py-0.5 px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
            <FiLock className="text-gray-400"/>
            <span>Secure</span>
        </div>
        <div className="flex items-center justify-start gap-1 text-white py-0.5 px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
            <CloudLightningIcon className="text-gray-400"/>
            <span>Efficient</span>
        </div>
        <div className="flex items-center justify-start gap-1 text-white py-0.5 px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
            <FiCloudLightning className="text-gray-400"/>
            <span>Robust</span>
        </div>
        <div className="flex items-center justify-start gap-1 text-white py-0.5 px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
            <FiZap className="text-gray-400"/>
            <span>Fast</span>
        </div>
        </div>

        {
            (location.pathname==='/' || username) &&
        <div className='text-white border border-gray-600 py-1 px-4 relative rounded min-w-40'>
            {
             (username && userId )?(
                    <div onClick={()=>setShowMore(!showMore)} className='flex cursor-pointer items-center justify-start gap-2'>
                        <User className='p-0.5 rounded-full bg-white text-gray-900 h-7 w-7'/>
                        <span>
                        {username}
                        </span>
                        {
                            showMore?(
                                <ChevronDown/>
                                
                            ):(

                                <ChevronRight/>
                            )
                        }
                    </div>
                ):
                (
                    
                    <span>Login</span>
                )
            }

        <div className={`w-full left-0  h-auto p-3 bg-gray-900  absolute rounded text-white flex flex-col items-center transition-all delay-100 justify-between gap-3  duration-700 ease-in-out  ${showMore?"-bottom-55":"-top-55"}`}>
            <Link className='w-full  py-1.5 hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer flex items-start justify-start px-3 gap-3' to={`/auth/${hash}/${username}/workspace`}>
            <Home/>
            Home
            </Link>
            <Link className='w-full  py-1.5 hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer flex items-start justify-start px-3 gap-3' to={`/auth/${hash}/${username}/workspace/profile`}>
            <User/>
            Profile
            </Link>
            <Link className='w-full  py-1.5 hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer flex items-start justify-start px-3 gap-3' to={`/auth/${hash}/${username}/workspace/dashboard`}>
            <Folder/>
            Dashboard
            </Link>
            <Link className='w-full  py-1.5 hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer flex items-start justify-start px-3 gap-3' to={`/auth/${hash}/${username}/workspace/logout`}>
            <LogOut/>
            Logout
            </Link>

        </div>
        

        </div>
        }




</div>


      
    </div>
  )
}

export default PageHeader
