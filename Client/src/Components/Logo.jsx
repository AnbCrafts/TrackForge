import React from 'react'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'
const Logo = ({path}) => {
  return (
     <Link to={path || "/"} className='flex items-center justify-start gap-4 flex-wrap'>
        <img src={assets.logo} className='w-15 rounded-2xl shadow-2xl border border-white p-0.5' alt="" />
        <h1 className='font-semibold text-white'>Track Forge</h1>

    </Link>
  )
}

export default Logo
