import React, { useContext, useEffect } from 'react'
import Logo from '../Components/Logo'
import SideBar from '../Components/SideBar'
import { Link, Outlet, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import FirstTimeHome from '../Components/FirstTime'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import Footer from '../Components/Footer'
import PageHeader from '../Components/PageHeader'

const Home = () => {
  const {userData,getUserDataById,authUserData} = useContext(TrackForgeContextAPI);
  const {username,hash} = useParams();
  useEffect(()=>{
      const id = localStorage.getItem("userId")
      if(id){
        getUserDataById(id);
      }
  },[hash])
  

  return (
 <div className="h-screen w-full flex bg-[#F9FAFB]">

  {/* Sidebar (Sticky / Fixed) */}
  <div className="p-5 bg-gray-200 h-screen w-[120px] border-r border-gray-300 shadow-2xl flex flex-col items-center fixed left-0 top-0">
    <Link to={`/auth/${hash}/${username}/workspace`} className="flex items-center justify-center gap-4 flex-wrap">
      <img src={assets.logo} className="w-15 rounded-2xl shadow-2xl border border-white p-0.5" alt="" />
    </Link>
    <SideBar />
  </div>


  {/* Main Content (Scrollable) */}
  <div className="flex-1 ml-[120px] overflow-y-auto h-screen bg-gray-100">
    <PageHeader want={false} />
    <div >
    <Outlet/>

    </div>

    {
      location.pathname === `/auth/${hash}/${username}/workspace`
      &&
        <FirstTimeHome username={username} />
    }
   


  <Footer/>



  

    
  </div>


</div>



  )
}

export default Home
