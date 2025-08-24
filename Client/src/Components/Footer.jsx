import { BookUserIcon, Ticket, User, Users, Workflow } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { assets } from '../assets/assets'
import SocialIcons from './SocialMediaIcons'

const Footer = () => {
  return (
    <div className='p-10 bg-gray-900 text-white'>
       
       <div className='flex items-center justify-between border border-gray-700 p-10 rounded-2xl shadow-2xl'>
       
        <div className='w-4xl border-b border-gray-700 py-5'>
            <p className='mb-4 text-2xl text-green-500'>
                Free on Google Calendar & Outlook Calendar
            </p>
            <h1 className='text-7xl text-white'>Try the 
                <span className=' text-green-500 px-4'>#1 AI calendar</span>
for work</h1>
<div className=' flex items-center justify-start gap-5 my-10'>
    <span className='flex items-center gap-1'>
        <User className='h-8 w-8 p-1 rounded-full bg-green-500'/>
        For Individual Users
    </span>
    <span className='flex items-center gap-1'>
        <Users className='h-8 w-8 p-1 rounded-full bg-green-500'/>
        For Team 
    </span>
    <span className='flex items-center gap-1'>
        <Workflow className='h-8 w-8 p-1 rounded-full bg-green-500'/>
        For Project Management 
    </span>
    <span className='flex items-center gap-1'>
        <BookUserIcon className='h-8 w-8 p-1 rounded-full bg-green-500'/>
        For Client Management 
    </span>

</div>
        </div>



            <div className='mx-auto w-fit'>
                <Link className='bg-green-500 inline-block shadow-2xl py-3 px-15 rounded-2xl text-2xl font-semibold cursor-pointer hover:-translate-y-2 transition-all'>Join Us - It's free</Link>


            </div>


       </div>

        <div className="w-full bg-gray-900 text-gray-300 py-12 ">
            <div className="w-full bg-gray-900 text-gray-300 py-12 px-6 border border-gray-700 rounded-2xl shadow-2xl">
  <div className="max-w-7xl mx-auto  flex flex-col md:flex-row items-center justify-between gap-10">
    {/* Text */}
    <div className="max-w-xl">
      <h3 className="text-2xl font-semibold text-white mb-3">Subscribe to our Newsletter</h3>
      <p className="text-sm text-gray-400">
        Get the latest updates, new features, and productivity tips delivered straight to your inbox.
      </p>
    </div>

    {/* Subscription Form */}
    <form className="flex w-full max-w-md gap-3">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
      >
        Subscribe
      </button>
    </form>
  </div>
</div>

  <div className="w-full mt-10 flex gap-10 border p-10 rounded-2xl shadow-2xl border-gray-700">
    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-indigo-400">Home</a></li>
        <li><a href="#" className="hover:text-indigo-400">Dashboard</a></li>
        <li><a href="#" className="hover:text-indigo-400">Features</a></li>
        <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
        <li><a href="#" className="hover:text-indigo-400">FAQs</a></li>
        <li><a href="#" className="hover:text-indigo-400">Contact Us</a></li>
      </ul>
    </div>

    {/* Platform Links */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-indigo-400">API Documentation</a></li>
        <li><a href="#" className="hover:text-indigo-400">User Guides</a></li>
        <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-indigo-400">Terms & Conditions</a></li>
        <li><a href="#" className="hover:text-indigo-400">Changelog</a></li>
      </ul>
    </div>

    {/* Contact Information */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-2">
          <span>Email:</span>
          <a href="mailto:support@trackforge.com" className="hover:text-indigo-400">support@trackforge.com</a>
        </li>
        <li className="flex items-center gap-2">
          <span>Phone:</span>
          <a href="tel:+919876543210" className="hover:text-indigo-400">+91 98765 43210</a>
        </li>
        <li>
          <span>Address:</span>
          <p>TrackForge HQ, New Delhi, India</p>
        </li>
      </ul>
    </div>

    <SocialIcons/>
    <div className='w-xl'>
    <p className="text-center text-gray-500 text-sm ">
  TrackForge is committed to enhancing team productivity and streamlining project collaboration. Built with precision for modern teams, we ensure your workflow stays organized, efficient, and scalable as you grow.
</p>
<div className="w-full flex items-center justify-between mt-10 gap-6">
  <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-green-500 text-center hover:shadow-xl transition">
    <h3 className="text-xl font-semibold text-green-500">Mission-Oriented</h3>
  </div>

  <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-green-500 text-center hover:shadow-xl transition">
    <h3 className="text-xl font-semibold text-green-500">Trust & Support Focused</h3>
  </div>

  <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-green-500 text-center hover:shadow-xl transition">
    <h3 className="text-xl font-semibold text-green-500">Innovation Focused</h3>
  </div>
</div>

    </div>

  </div>
</div>





       <div className='p-10 border border-gray-700 mt-5 shadow-2xl rounded-2xl flex'>

       <div>
         <Link to={'/'} className='flex items-center justify-between w-fit gap-4'>
        <img src={assets.logo} className='w-[100px]' alt="" />
        <div>
            <h1 className='text-2xl font-semibold'>Track Forge</h1>
            <span className='text-sm text-green-500 font-semibold'>-Your Debugging Partner</span>
        </div>
        </Link>

        <div className='flex items-center justify-start gap-4 mt-10'>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>About Us</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Contact Us</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Security</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Privacy Policy</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Features</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Status</Link>
            <Link className='text-md text-white  hover:underline transition-all cursor-pointer'>Cookie Preferences</Link>

        </div>

        <p className="text-start text-gray-500 text-sm mt-10">
  © {new Date().getFullYear()} TrackForge. All rights reserved. Unauthorized duplication or distribution of this platform or its content is strictly prohibited. TrackForge™ and its logo are trademarks of TrackForge Inc.
</p>
       </div>

       <div className='border-b pb-4 border-gray-700 w-fit h-fit'>
        <SocialIcons/>
       </div>


       </div>
      
    </div>
  )
}

export default Footer
