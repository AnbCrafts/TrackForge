import React, { useEffect } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Gateway from './Pages/Gateway'
import Dashboard from './Pages/Dashboard'
import Teams from './Pages/Teams'
import TeamDetail from './Pages/TeamDetail'
import Projects from './Pages/Projects'
import ProjectDetail from './Pages/ProjectDetail'
import Bugs from './Pages/Bugs'
import Profile from './Pages/Profile'
import Notifications from './Pages/Notifications'
import ResetPass from './Pages/ResetPass'
import Help from './Pages/Help'
import Logout from './Pages/Logout'
import EditTeam from './Pages/EditTeam'
import ViewDetailedBug from './Pages/ViewDetailedBug'
import EditProject from './Pages/EditProject'
import EditActivity from './Pages/EditActivity'
import Admin from './Pages/Admin'
import Settings from './Pages/Settings'
import EditProfile from './Pages/EditProfile'
import CodeEditor from './Pages/CodeEditor'

const App = () => {
  const {hash,username} = useParams();



  
  // useEffect(() => {
  //   const fadeEls = document.querySelectorAll('div');
  //   fadeEls.forEach(div => div.classList.add('fade-in'));
  //   console.log("Divs updated:", fadeEls.length);
  // }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     document.querySelectorAll(".fade-in").forEach((el) => {
  //       const rect = el.getBoundingClientRect();
  //       if (rect.top < window.innerHeight && rect.bottom >= 0) {
  //         el.classList.add("show");
  //       } else {
  //         el.classList.remove("show");
  //       }
  //     });
  //   };

  //   handleScroll();
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // });

  
  return (
    <div>

    

    
       
      
      <Routes>
        <Route path='/' element={<Gateway/>} />
        <Route path='/reset-password' element={<ResetPass/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Login/>} />
        <Route path='/auth/:hash/:username/workspace/' element={<Home />}>
        <Route path='code-editor/view-project' element={<CodeEditor />} />
        <Route path='help' element={<Help />} />
        <Route path='admin' element={<Admin />} />
        <Route path='logout' element={<Logout />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='dashboard/ticket-detail/:ticketId/activity/:activityId/edit' element={<EditActivity />} />
        <Route path='projects' element={<Projects />} />
        <Route path='projects/:projectId/code-editor/view-project' element={<CodeEditor />} />
        
        <Route path='bugs' element={<Bugs />} />
        <Route path='ticket-detail/:ticketId' element={<ViewDetailedBug />} />
        <Route path='ticket-detail/:ticketId/activity/:activityId/edit' element={<EditActivity />} />
        <Route path='profile' element={<Profile />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path='projects/:projectId' element={<ProjectDetail />} /> 
        <Route path='projects/:projectId/edit' element={<EditProject />} /> 
        <Route path='team' element={<Teams />} >
        <Route path=':teamId' element={<TeamDetail />} />
        <Route path=':teamId/edit' element={<EditTeam />} />
        </Route>

        <Route path='settings' element={<Settings />}>
        <Route path='reset-password' element={<ResetPass want={false} />} />
        <Route path='update-profile' element={<EditProfile/>} />

        
        </Route>



</Route>


{/* 689376b3221c775a5a77565f 
68937661221c775a5a77565c
68937381221c775a5a775600
*/}

      </Routes>
      
    </div>
  )
}

export default App
