import React, { useContext, useEffect } from 'react';
import { 
  LayoutDashboard, FolderKanban, Bug, Users, 
  BarChart2, Bell, User, LogOut, Shield, HelpCircle, 
  Settings,
  SlidersVertical,
  Code
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';

const SideBar = () => {
  const location = useLocation();
   const {userData,getUserDataById,authUserData} = useContext(TrackForgeContextAPI);
    const {username,hash} = useParams();
    useEffect(()=>{
        const id = localStorage.getItem("userId")
        if(id){
          getUserDataById(id);
        }
    },[hash])

  const isActive = (pathSegment) => {
    return location.pathname.endsWith(pathSegment);
  };

  const getLinkClasses = (segment) =>
    `h-10 w-10 flex items-center justify-center rounded-xl cursor-pointer transition-all p-1 
    ${isActive(segment) ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'}`;

  const getIconClasses = (segment) =>
    `h-7 w-7 transition-all 
    ${isActive(segment) ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`;

  return (
    <div className='flex flex-col items-center justify-start gap-4 py-5 relative'>
  <Link to="dashboard" className={getLinkClasses('dashboard')}>
    <LayoutDashboard className={getIconClasses('dashboard')} />
  </Link>

  <Link to="projects" className={getLinkClasses('projects')}>
    <FolderKanban className={getIconClasses('projects')} />
  </Link>

  <Link to="code-editor" className={getLinkClasses('code-editor')}>
    <Code className={getIconClasses('code-editor')} />
  </Link>

  <Link to="bugs" className={getLinkClasses('bugs')}>
    <Bug className={getIconClasses('bugs')} />
  </Link>

  <Link to="team" className={getLinkClasses('team')}>
    <Users className={getIconClasses('team')} />
  </Link>

  <Link to="notifications" className={getLinkClasses('notifications')}>
    <Bell className={getIconClasses('notifications')} />
  </Link>

  <Link to="profile" className={getLinkClasses('profile')}>
    <User className={getIconClasses('profile')} />
  </Link>

  <Link to="settings" className={getLinkClasses('settings')}>
    <Settings className={getIconClasses('settings')} />
  </Link>

  <Link to="help" className={getLinkClasses('help')}>
    <HelpCircle className={getIconClasses('help')} />
  </Link>

  <Link to="logout" className={getLinkClasses('logout')}>
    <LogOut className={getIconClasses('logout')} />
  </Link>
</div>

  )
};

export default SideBar;
