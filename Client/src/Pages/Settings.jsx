import React from 'react'
import {Delete, Folder, Group, Lock, PauseCircle, Skull, User} from 'lucide-react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const {username,hash} = useParams();
  const fullPath = `/auth/${hash}/${username}/workspace/settings/`;
  return (
    <div className='h-[100vh] w-full flex items-start gap-5'>
      <div className='w-3xs shadow bg-gray-50 h-full p-3'>
        <div className='w-full p-2  bg-gray-100 mb-4 rounded shadow'>
          <h1 className='font-medium text-center text-gray-600 mb-3'>Account Settings</h1>
          <ul>
            <Link to={'reset-password'} className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+'reset-password'?"bg-gray-700 text-white":""}`}>
              Change password
              <Lock className='h-5 w-5 font-medium text-gray-500' />
              
              </Link>
            <Link to={'update-profile'} className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+'update-profile'?"bg-gray-700 text-white":""}`}>
              Update profile
              <User className='h-5 w-5 font-medium text-gray-500' />
              
              </Link>
            <Link className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+''?"bg-gray-700 text-white":""}`}>
              Deactivate Profile
              <PauseCircle className='h-5 w-5 font-medium text-gray-500' />
              
              </Link>
            <Link className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+''?"bg-gray-700 text-white":""}`}>
              Delete Account
              <Skull className='h-5 w-5 font-medium text-gray-500' />
              
              </Link>
            <Link className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+''?"bg-gray-700 text-white":""}`}>
              Manage projects
              <Folder className='h-5 w-5 font-medium text-gray-500' />
              
              </Link>
            <Link className={`py-1.5 px-3 mb-2 border-t border-gray-200 w-full text-center hover:bg-gray-800 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-3 ${location.pathname===fullPath+''?"bg-gray-700 text-white":""}`}>
              Manage teams
              <Group className='h-5 w-5 font-medium text-gray-500' />
              </Link>
          </ul>

        </div>

        




      </div>
      <div className='min-h-[100vh] flex-1 bg-gray-50 overflow-y-scroll noScroll shadow'>
      
        <Outlet/>


      </div>

      
    </div>
  )
}

export default Settings
