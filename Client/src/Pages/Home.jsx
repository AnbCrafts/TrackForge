import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import { assets } from '../assets/assets'
import SideBar from '../Components/SideBar'
import FirstTimeHome from '../Components/FirstTime'
import Footer from '../Components/Footer'
import PageHeader from '../Components/PageHeader'
import { Menu } from 'lucide-react'
import { FcRight } from 'react-icons/fc'

const Home = () => {
  const { userData, getUserDataById } = useContext(TrackForgeContextAPI)
  const { username, hash } = useParams()

  const location = useLocation()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

   const [sidebarWidth,setSideBarWidth] = useState(120);
 

  // Paths
  const codeEditorPath = `/auth/${hash}/${username}/workspace/code-editor`
  const dashboardPath = `/auth/${hash}/${username}/workspace`

  // OAuth login cleanup
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    const userId = params.get("userId")
    const email = params.get("email")

    if (token && userId) {
      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)
      localStorage.setItem("hash", hash)
      localStorage.setItem("username", username)
      localStorage.setItem("email", email)

      navigate(`/auth/${hash}/${username}/workspace`, { replace: true })
    }
  }, [location, hash, username, navigate])

  // fetch user
  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (id) getUserDataById(id)
  }, [hash])

  useEffect(()=>{
    setIsSidebarOpen(!isSidebarOpen);
  },[sidebarWidth])

  // 📌 AUTO COLLAPSE OR EXPAND SIDEBAR BASED ON PAGE
 
  return (
    <div className="h-screen w-full flex text-white">

      {/* ================= Sidebar ================= */}
      <div
        className={`fixed top-0 left-0 h-full border-r border-[#312E81]/40 transition-all duration-300 z-30 shadow-xl
          w-[${sidebarWidth}]px
        `}
      >
          <div className=" py-3 flex sidebar h-full flex-col items-center">
            <Link to={dashboardPath} className="flex items-center justify-center gap-4 flex-wrap">
              <img src={assets.logo} className="w-14 rounded-2xl border border-white/20 shadow-lg" alt="" />
            </Link>

            {/* Sidebar is unchanged — just wrapped */}
            <SideBar onSidebarChange={setSideBarWidth}/>
          </div>
       
      </div>


        

      {/* ================= Main Content ================= */}
      <div
        className={`
          flex-1 overflow-y-auto h-screen transition-all duration-300
          ${!isSidebarOpen ? "ml-[118px]" : "ml-[56px]"}
        `}
      >
        <PageHeader want={false} />

        {/* FIX: remove blank space — ensure content starts immediately */}
        <div>
          <Outlet />
        </div>

        {location.pathname === dashboardPath && (
          <FirstTimeHome username={username} />
        )}

        <Footer />
      </div>

    </div>
  )
}

export default Home
