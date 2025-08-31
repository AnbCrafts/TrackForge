import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, LogIn, LogInIcon, Regex, Contact, Locate, CloudLightningIcon, Flower, Workflow, Target, RefreshCw, Projector, Group, Users, UserPlus, Wrench, Cloud, RollerCoaster, MemoryStick, Proportions, Globe, Telescope, Star, Cross, X } from 'lucide-react'
import Logo from "../Components/Logo";
import { assets } from "../assets/assets";
import { FiBell, FiCloud, FiCloudLightning, FiLock, FiZap } from "react-icons/fi";
import { FiUser, FiShield, FiActivity, FiUsers, FiBarChart2, FiFolder, FiTool, FiTrendingUp } from "react-icons/fi"
import { motion } from "framer-motion";
import ProjectShowcase from "../Components/ProjectShowCase";
import FAQSection from "../Components/FAQSection";
import Footer from "../Components/Footer";
import { User } from "lucide-react";
import PartyPopper from "../Components/Popper";


const questions = [
  "Why TrackForge?",
  "What makes it different?",
  "How does it improve team productivity?",
  "Is it suitable for solo developers?",
  "How does it simplify bug tracking?",
  "Can I manage multiple teams/projects?",
];

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-rose-500",
];



 const testimonialsData = [
  {
    id: 1,
    username: "Aditi Sharma",
    role: "Frontend Engineer",
    feedback:
      "TrackForge made it super easy for our team to manage bugs without the chaos. We resolve issues faster than ever!",
    rating: 5,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation: "She loves the simplicity of organizing tickets with less overhead.",
  },
  {
    id: 2,
    username: "Rahul Mehta",
    role: "Product Manager",
    feedback:
      "The analytics give us a clear picture of project health. It's become a core tool for our sprint planning.",
    rating: 4,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation:
      "He highlights how the insights from analytics improve planning and decision-making.",
  },
  {
    id: 3,
    username: "Sneha Kapoor",
    role: "Team Lead",
    feedback:
      "We love the simplicity. TrackForge helps our distributed team stay aligned and productive.",
    rating: 5,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation:
      "She values how TrackForge bridges communication gaps in remote teams.",
  },
  {
    id: 4,
    username: "Karan Gupta",
    role: "Backend Developer",
    feedback:
      "The role-based ticketing system is a game changer. Assignments are clear and workloads are balanced.",
    rating: 4,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation:
      "He emphasizes better collaboration between backend and frontend developers.",
  },
   {
    id: 5,
    username: "Sneha Iyer",
    role: "UI/UX Designer",
    feedback:
      "I love how updates are structured. It keeps our design iterations in sync with development.",
    rating: 5,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation: "She points out smoother design-to-dev handoff and alignment.",
  },
  {
    id: 6,
    username: "Rohit Verma",
    role: "Team Lead",
    feedback:
      "Analytics and activity history give us complete clarity. It’s easy to track project health.",
    rating: 4,
    icon: <User className="w-10 h-10 text-gray-500" />,
    explanation: "He finds decision-making easier with clear project insights.",
  },
];


const getRandomColor = () => {


  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};
const FloatingQuestions = () => {


  return (
   <div className="relative w-6xl min-h-[60vh] flex flex-wrap justify-center items-center gap-8 px-6 py-16">
  {questions.map((q, index) => {
    const randomColor = colors[index]; // generate per-card
    return (
      <motion.div
        key={index}
        className={`w-fit max-w-xs p-5 ${randomColor} shadow-2xl rounded-xl text-center text-white font-semibold text-xl cursor-default dangle-hover`}
        initial={{ y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{
          transform: `rotate(${(Math.random() - 0.5) * 10}deg) translateY(${(Math.random() - 0.5) * 20}px)`,
        }}
      >
        {q}
      </motion.div>
    );
  })}
</div>

  );
};


const SectionCard = ({ Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition w-lg h-full min-h-48 flex-1">
    <div className="text-indigo-600 text-2xl mb-3">
      <Icon />
    </div>
    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
)

const FeatureSection = ({ heading, intro, features,hColor, pColor }) => (
  <section className="py-16 px-10 w-full mx-auto">
    <div className="w-full px-6">
      <div className="w-full mx-auto">
        <h2 className={`text-4xl font-bold text-${hColor || "blue-500"} mb-4`}>{heading}</h2>
        <p className={`text-${pColor ||"gray-600"} mb-10 max-w-3xl`}>{intro}</p>
        <div className="flex items-center justify-between gap-5 flex-wrap">
          {features.map((feature, index) => (
            <SectionCard
              key={index}
              Icon={feature.icon}
              title={feature.title}
              description={feature.description}
              
            />
          ))}
        </div>
      </div>
    </div>
  </section>
)






const Gateway = () => {
  const navigate = useNavigate();

  const [animateOnLoad, setAnimateOnLoad] = useState(false);

  useEffect(() => {
    // Trigger animation only when component mounts
    setAnimateOnLoad(true);
  }, []);

  const [showBox,setShowBox] = useState(true);
  
  return (
    <div className="min-h-[100vh] w-full mx-auto ">
      {
        showBox && 
      <div className="min-w-lg p-5 flex items-start justify-start gap-5 flex-col min-h-80 fixed top-[50vh] right-0 z-50 border-gray-200 border rounded-2xl bg-white/20">
        <X onClick={()=>setShowBox(false)} className="bg-gray-900 text-white p-1 h-8 w-8 rounded-full cursor-pointer shadow-2xl float-right  " />
        <p className="px-10 py-4 text-center mx-auto bg-blue-500 text-white rounded-md shadow-2xl transition-all animate-bounce delay-1000 text-lg">Feeling Hectic to manage projects?</p>
        <p className="px-10 py-4 text-center mx-auto bg-blue-500 text-white rounded-md shadow-2xl transition-all animate-bounce delay-700 text-lg">Team work doesn't work as planned?</p>
        <p className="px-10 py-4 text-center mx-auto bg-blue-500 text-white rounded-md shadow-2xl transition-all animate-bounce delay-700 text-lg">Creating project alone?</p>
        <p className="font-medium text-lg text-white py-1.5 px-4 rounded shadow-2xl  bg-green-500">
          Come here , we got solutions to all your problems...
        </p>

      </div>
      }

      <PartyPopper/>

      {
        !showBox && 
      <PartyPopper/>
      }
   

      

      <div className="px-4 md:px-10 py-1 bg-gray-800 flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-5">
  {/* Logo + Name */}
  <div className="flex items-center justify-start w-full md:w-2xs gap-2">
    <Link
      to={"/"}
      className="rounded-2xl cursor-pointer inline-block transition-all h-10 w-10"
    >
      <img src={assets.logo} className="rounded-2xl shadow-2xl" alt="" />
    </Link>
    <h1 className="text-gray-200 font-semibold text-lg md:text-xl">TrackForge</h1>
  </div>

  {/* Features */}
  <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-2 md:gap-3 w-full md:w-auto">
    <div className="flex items-center justify-start gap-1 text-white py-0.5 px-3 md:px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
      <FiLock className="text-gray-400" />
      <span className="text-sm md:text-base">Secure</span>
    </div>
    <div className="flex items-center justify-start gap-1 text-white py-0.5 px-3 md:px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
      <CloudLightningIcon className="text-gray-400" />
      <span className="text-sm md:text-base">Efficient</span>
    </div>
    <div className="flex items-center justify-start gap-1 text-white py-0.5 px-3 md:px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
      <FiCloudLightning className="text-gray-400" />
      <span className="text-sm md:text-base">Robust</span>
    </div>
    <div className="flex items-center justify-start gap-1 text-white py-0.5 px-3 md:px-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer">
      <FiZap className="text-gray-400" />
      <span className="text-sm md:text-base">Fast</span>
    </div>
  </div>
</div>

    
     <div className="w-full py-20 px-3 sm:px-5">
  <div className="w-full max-w-5xl mx-auto">
    {/* Hero Section */}
    <div className="p-5 sm:p-10 border-b border-gray-400 rounded-xl shadow-xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-2 flex flex-wrap items-center gap-2 text-gray-900">
        Welcome to
        <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Track-Forge
        </span>
      </h1>

      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">
        🚀{" "}
        <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Track-Forge
        </span>{" "}
        — Simplify Bug Tracking, Amplify Team Efficiency
      </h2>

      <p className="text-gray-600 mt-6 sm:mt-10 text-base sm:text-lg">
        Say goodbye to scattered bug reports and missed updates. TrackForge
        empowers teams to collaborate, prioritize, and resolve issues faster —
        all from a sleek, intuitive platform built for modern development
        workflows.
      </p>
    </div>

    {/* CTA Buttons */}
    <div className="p-3 sm:p-5 w-full md:w-2xl flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-5 mt-5">
      <Link
        to={"/login"}
        className="flex items-center justify-center gap-3 bg-blue-500 py-2 px-5 sm:px-7 rounded-xl shadow-2xl hover:shadow-none transition-all w-full sm:w-auto"
      >
        <LogInIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-200" />
        <span className="text-base sm:text-lg font-semibold text-white">
          Login
        </span>
      </Link>
      <Link
        to={"/register"}
        className="flex items-center justify-center gap-3 bg-blue-500 py-2 px-5 sm:px-7 rounded-xl shadow-2xl hover:shadow-none transition-all w-full sm:w-auto"
      >
        <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-gray-200" />
        <span className="text-base sm:text-lg font-semibold text-white">
          Register Now
        </span>
      </Link>
    </div>
  </div>

  {/* Steps Section */}
  <div className="mt-10 bg-gray-200 py-8 sm:py-10 rounded-2xl shadow-2xl">
    <div className="p-3 sm:p-5 text-gray-700 mx-auto w-fit text-center">
      <h1 className="text-2xl sm:text-4xl md:text-5xl">
        Facing Problem creating project??
      </h1>
      <p className="text-base sm:text-lg mt-2 text-gray-600">
        Follow these steps and the job is done!!
      </p>
    </div>

    {/* Step Cards */}
    <div className="py-5 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center bg-gray-800 text-xl sm:text-2xl text-white rounded-2xl h-40 max-w-xs min-w-[180px] gap-2 shadow-2xl">
        <LogIn className="h-10 w-10 bg-green-500 font-semibold text-white p-2 rounded-full" />
        <span className="py-1 px-2 rounded-xl border border-gray-700">
          Login
        </span>
      </div>
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center bg-gray-800 text-xl sm:text-2xl text-white rounded-2xl h-40 max-w-xs min-w-[180px] gap-2 shadow-2xl">
        <Rocket className="h-10 w-10 bg-green-500 font-semibold text-white p-2 rounded-full" />
        <span className="py-1 px-2 rounded-xl border border-gray-700">
          Create Project
        </span>
      </div>
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center bg-gray-800 text-xl sm:text-2xl text-white rounded-2xl h-40 max-w-xs min-w-[180px] gap-2 shadow-2xl">
        <Users className="h-10 w-10 bg-green-500 font-semibold text-white p-2 rounded-full" />
        <span className="py-1 px-2 rounded-xl border border-gray-700">
          Create Team
        </span>
      </div>
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center bg-gray-800 text-xl sm:text-2xl text-white rounded-2xl h-40 max-w-xs min-w-[180px] gap-2 shadow-2xl">
        <UserPlus className="h-10 w-10 bg-green-500 font-semibold text-white p-2 rounded-full" />
        <span className="py-1 px-2 rounded-xl border border-gray-700">
          Add Members
        </span>
      </div>
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center bg-gray-800 text-xl sm:text-2xl text-white rounded-2xl h-40 max-w-xs min-w-[180px] gap-2 shadow-2xl">
        <Wrench className="h-10 w-10 bg-green-500 font-semibold text-white p-2 rounded-full" />
        <span className="py-1 px-2 rounded-xl border border-gray-700">
          Solve Problems
        </span>
      </div>
    </div>
  </div>
</div>


      <div className="pb-20 bg-white ">
        <div className="py-10 w-fit mx-auto">
            <h1 className="text-5xl font-semibold text-gray-800">Why Are we here ??</h1>

        </div>
            <div className="flex items-center justify-center">
            <FloatingQuestions/>

            <div className="">
                <img src={assets.confused} className="w-3xl drop-shadow-2xl" alt="" />
            </div>
            </div>
        <div className="w-7xl mx-auto flex justify-items-center justify-between  gap-7">
            <div className="p-6 hover:shadow-lg transition-all rounded-2xl shadow-2xl flex items-start justify-between flex-col w-xs">
                <div className="p-1 rounded-full bg-blue-500 mb-2">
                    <Workflow className="h-8 w-8 text-white"/>

                </div>
                <h1 className="text-2xl mb-3 font-semibold text-gray-500">Streamline Team Workflow</h1>
                <p className="text-gray-800 font-semibold mt-4 p-1.5 px-4 border-gray-200 border rounded-lg">Assign, track, and resolve issues effortlessly across your team with a centralized workspace.</p>
            </div>
            <div className="p-6 hover:shadow-lg transition-all rounded-2xl shadow-2xl flex items-start justify-between flex-col w-xs">
                <div className="p-1 rounded-full bg-blue-500 mb-2">
                    <FiBell className="h-8 w-8 text-white"/>

                </div>
                <h1 className="text-2xl mb-3 font-semibold text-gray-500">Stay Ahead with Real-Time Updates</h1>
                <p className="text-gray-800 font-semibold mt-4 p-1.5 px-4 border-gray-200 border rounded-lg">Receive instant notifications on critical changes, comments, and status updates—no lag, no guesswork.</p>
            </div>
            <div className="p-6 hover:shadow-lg transition-all rounded-2xl shadow-2xl flex items-start justify-between flex-col w-xs">
                <div className="p-1 rounded-full bg-blue-500 mb-2">
                    <Target className="h-8 w-8 text-white"/>

                </div>
                <h1 className="text-2xl mb-3 font-semibold text-gray-500">Prioritize What Matters</h1>
                <p className="text-gray-800 font-semibold mt-4 p-1.5 px-4 border-gray-200 border rounded-lg">Focus on high-impact tasks with smart filters and custom tags that let your team stay mission-aligned.</p>
            </div>
            <div className="p-6 hover:shadow-lg transition-all rounded-2xl shadow-2xl flex items-start justify-between flex-col w-xs">
                <div className="p-1 rounded-full bg-blue-500 mb-2">
                    <RefreshCw className="h-8 w-8 text-white" />

                </div>
                <h1 className="text-2xl mb-3 font-semibold text-gray-500">Adapt with Confidence</h1>
                <p className="text-gray-800 font-semibold mt-4 p-1.5 px-4 border-gray-200 border rounded-lg">Reschedule, reassign, and reorganize with tools that keep your team agile and deadlines intact.</p>
            </div>

        </div>


      </div>

      <div className="py-20">
<div className="flex items-center justify-center gap-5 flex-row-reverse">
    
        <div className="w-fit bg-blue-500 p-10 rounded-2xl shadow-2xl ">
            <h1 className="text-5xl text-white font-semibold">For Individual Users</h1>
            <p className="text-lg text-gray-800 font-semibold py-2 max-w-2xl">Explore the features and facilities we provide for a user to enhance your work experience and make your job easy.</p>
            <div className="flex items-center justify-start gap-2 mt-5 py-5">
                <Link className="py-3 px-12 bg-white text-blue-500 text-lg font-semibold rounded-lg shadow-2xl cursor-pointer transition-all hover:bg-gray-100 hover:shadow-none">Create Account</Link>
            </div>

        </div>

        <img src={assets.cover_img} className="w-2xl p-2  drop-shadow-lg drop-shadow-blue-500" alt="" />
</div>


       <FeatureSection
        heading="Your Personal Command Center"
        intro="TrackForge empowers individual users to manage tasks, stay updated, and control their contributions across all projects and teams—efficiently and intuitively."
        features={[
          {
            icon: FiUser,
            title: "Personalized Dashboard",
            description: "View assigned issues, recent activity, and project updates—all in one place.",
          },
          {
            icon: FiShield,
            title: "Secure & Private Access",
            description: "Role-based control ensures your data stays private and protected.",
          },
          {
            icon: FiActivity,
            title: "Activity History",
            description: "Track everything you’ve done, what’s pending, and what’s next.",
          },
        ]}
      />

      </div>

        <div className="pt-20 bg-gray-200">
            <div className="flex items-center justify-center gap-10">
                <div className="p-5  bg-blue-500 text-white rounded-2xl shadow-2xl">
                    <h1 className="text-4xl font-semibold w-lg">Do we have any features for Team ??</h1>
                    <p className="text-lg mt-2 w-lg font-semibold text-gray-700">Absolutely Yes!! Explore our platform features and create your own team</p>

             <div className="flex items-center justify-start gap-2 mt-5 py-5">
                <Link className="py-3 px-12 bg-white text-blue-500 text-lg font-semibold rounded-lg shadow-2xl cursor-pointer transition-all hover:bg-gray-100 hover:shadow-none">Create Team</Link>
            </div>
                </div>
                <img src={assets.team} className="w-3xl drop-shadow-2xl" alt="" />

            </div>
            <div className="mt-10">     
      <FeatureSection
        heading="Collaboration Without Chaos"
        intro="Build and manage agile teams with role-based permissions, real-time updates, and centralized communication—designed to eliminate bottlenecks."
        features={[
          {
            icon: FiUsers,
            title: "Create & Manage Teams",
            description: "Form teams for specific projects and assign roles like Admin, Developer, Tester, etc.",
          },
          {
            icon: FiBell,
            title: "Shared Notifications",
            description: "Keep everyone in sync with changes, mentions, and updates.",
          },
          {
            icon: FiBarChart2,
            title: "Team Activity Analytics",
            description: "Gain insights into team performance and contribution trends.",
          },
        ]}
      />

    <div className="flex items-start justify-center gap-10 w-full mt-10 py-20 bg-gray-800">
        
       <div>
         <div className="p-10  bg-gray-900 rounded-2xl shadow-2xl w-xl">
  <h1 className="text-4xl font-semibold text-gray-400 mb-3">Manage Team Activities</h1>
  <p className="text-gray-500">
    Stay on top of your team's workflow with centralized activity tracking. Collaborate seamlessly by adding comments, tagging team members, and resolving issues together in real-time. TrackForge ensures every team member is aligned and engaged on every project milestone.
  </p>
</div>

<div className="mt-5 py-5 flex items-center justify-center gap-5 bg-blue-500 w-fit px-10 rounded-xl shadow-2xl text-lg font-semibold text-white">
    <h1>Utilize your role</h1>
    <RollerCoaster className="h-12 w-12 p-2 shadow-2xl rounded-full text-gray-500 bg-gray-900"/>
</div>
<div className="mt-5 py-5 flex items-center justify-center gap-5 bg-blue-500 w-fit px-10 rounded-xl shadow-2xl text-lg font-semibold text-white">
    <h1>Interact with your team</h1>
    <MemoryStick className="h-12 w-12 p-2 shadow-2xl rounded-full text-gray-500 bg-gray-900"/>
</div>
<div className="mt-5 py-5 flex items-center justify-center gap-5 bg-blue-500 w-fit px-10 rounded-xl shadow-2xl text-lg font-semibold text-white">
    <h1>Give your 100%</h1>
    <Proportions className="h-12 w-12 p-2 shadow-2xl rounded-full text-gray-500 bg-gray-900"/>
</div>

       </div>

<img src={assets.manage} className="w-2xl drop-shadow-2xl" alt="" />


    </div>




      </div>

      <div className="relative  flex items-center justify-center gap-5 w-full">
        <img src={assets.dash_bg} className="w-full max-h-[100vh]" alt="" />
           
          <div className="absolute top-0 left-0 h-[100vh] w-full bg-gradient-to-t from-black/90 via-black/80  to-black/60 flex items-center justify-center gap-5">
                
                <div className="w-2xl">
                    <div className=" p-10  bg-gray-800 rounded-2xl shadow-2xl">
  <h1 className="text-5xl text-white mb-4">Personalized Dashboards for Your Team</h1>
  <p className="text-gray-300 text-lg mt-10">
    Give every team member a clear, focused view of their tasks, projects, and activity. TrackForge's customizable dashboards ensure that everyone—from developers to project leads—sees exactly what matters to them, without unnecessary clutter.
  </p>
</div>



                </div>

                <img src={assets.dashboard} className="w-2xl" alt="" />
          
          </div>


            </div>




        </div>


         <div className="">
            <div className="py-10 flex items-center justify-center gap-5 bg-gray-800">
                <img src={assets.project3} className="w-xl drop-shadow-2xl" alt="" />

                <div className="p-10 bg-gray-900 rounded-2xl shadow-xl w-3xl">
  <h1 className="text-4xl font-bold text-white mb-4">Powerful Project Management Features</h1>
  <p className="text-gray-400 text-lg mb-6">
    TrackForge empowers you to create, manage, and own projects with ease. From setting up project goals to monitoring progress and managing teams, our platform offers a comprehensive suite of tools to streamline your workflow.
  </p>

  <ul className="space-y-2 text-gray-200 text-base">
    <li className="flex items-center justify-start gap-2">
         <Telescope className="p-1.5 bg-pink-500 text-white h-10 w-10 rounded-full shadow-2xl"/>
         <span className="text-lg text-white">

        Create and organize multiple projects effortlessly
        </span>
        </li>
    <li className="flex items-center justify-start gap-2">
         <Telescope className="p-1.5 bg-pink-500 text-white h-10 w-10 rounded-full shadow-2xl"/>
         <span className="text-lg text-white">
            
        Assign tasks and roles to team members
        </span>
        </li>
    <li className="flex items-center justify-start gap-2">
         <Telescope className="p-1.5 bg-pink-500 text-white h-10 w-10 rounded-full shadow-2xl"/>
         <span className="text-lg text-white">
            
        Track real-time project activity and status updates
        </span>
        </li>
    <li className="flex items-center justify-start gap-2">
         <Telescope className="p-1.5 bg-pink-500 text-white h-10 w-10 rounded-full shadow-2xl"/>
         <span className="text-lg text-white">
            
        Collaborate via comments, mentions, and notifications
        </span>
        </li>
    <li className="flex items-center justify-start gap-2">
         <Telescope className="p-1.5 bg-pink-500 text-white h-10 w-10 rounded-full shadow-2xl"/>
         <span className="text-lg text-white">
        Maintain clear project ownership and control access
            
        </span>
        </li>
  </ul>
</div>



            </div>



            <div className="relative">
                

                <img src={assets.project} className="w-full h-[120vh]" alt="" />
          <div className="absolute top-0 left-0 h-[120vh] w-full bg-gradient-to-t from-black/60 via-black/80  to-black/90 ">
            <div className="text-center bg-gray-900 py-10">
  <h1 className="text-5xl font-bold text-gray-200 mb-3">Discover Projects in Motion</h1>
  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
    Explore ongoing projects your teams are actively working on. From feature development to bug resolutions, stay informed about the progress and contributions across every workspace.
  </p>
</div>

          <ProjectShowcase/>

          <div className="w-fit mx-auto py-5">
            <Link className="py-5 px-15 bg-blue-500 text-xl font-semibold text-white rounded-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all shadow-2xl mt-10
            ">
           <Rocket className="bg-white text-blue-500 h-10 w-10 p-1.5 rounded-full" />
            Create Project Now
            </Link>

          </div>

            </div>
            </div>


      <FeatureSection
        heading="Projects, Organized and Optimized"
        intro="From idea to release, TrackForge helps you structure and monitor every project stage—with built-in workflows, comments, and bug-tracking."
        features={[
          {
            icon: FiFolder,
            title: "Create & Own Projects",
            description: "Initiate and manage projects with control over access and scope.",
          },
          {
            icon: FiTool,
            title: "Bug & Issue Tracking",
            description: "Report, assign, and resolve issues with powerful ticketing tools.",
          },
          {
            icon: FiTrendingUp,
            title: "Real-Time Status Updates",
            description: "Monitor project progress and updates in real-time.",
          },
        ]}
      />
      </div>

      <div>
        <FAQSection/>
      </div>

      <div className=" bg-gray-50">
<div className="flex p-10 items-center justify-between gap-5">
  
         <div className="flex-1 p-5 rounded shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Built for teams that move fast
        </h1>
        <p className="text-gray-600 mb-10 max-w-xl">
          From startups to growing teams, TrackForge empowers users to stay
          organized, ship better software, and celebrate wins together.
        </p>
         </div>
         <div className="p-5 ">
          <img src={assets.feedback} className="h-full w-2xl rounded shadow" alt="" />


         </div>
</div>

<div className="min-h-[80vh] w-full relative">
  <img src={assets.opinion} className="h-full w-full object-cover" alt="" />
  <div className="absolute inset-0 bg-[#000000c5] z-50 flex items-center justify-center">
  <div className="flex flex-wrap gap-5 justify-center">
    {testimonialsData.map((t,i) => (
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={animateOnLoad ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, delay: i * 0.2 }} // i = index of the card
>
  
     <div
        key={i}
        className="bg-white rounded-2xl shadow-md max-w-xl p-6 flex flex-col gap-3 hover:shadow-lg transition"
      >
        {/* User icon & info */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-full">{t.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-800">{t.username}</h3>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        </div>

        {/* Feedback */}
        <p className="text-gray-700 italic">“{t.feedback}”</p>

        {/* Rating */}
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < t.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Extra explanation */}
        <p className="text-sm text-gray-500">{t.explanation}</p>
      </div>
</motion.div>
    ))}
  </div>
</div>


</div>

      </div>

      <Footer/>
    
 



    </div>
  );
};

export default Gateway;
