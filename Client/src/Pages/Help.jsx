import { HelpCircle, Info, CheckCircle, Lightbulb, Search, LogIn, ArrowRight, WavesLadder, InfoIcon } from "lucide-react";
import { assets } from "../assets/assets";
import Gallery from "../Components/Gallery";
import { useState } from "react";
import FAQSection from "../Components/FAQSection";


const imageObjects = [
  { title: 'Intro', image: assets.intro },
  { title: 'Preview', image: assets.preview },
  { title: 'Bug', image: assets.bug },
  { title: 'Teams', image: assets.teams },
  { title: 'Profile', image: assets.profile },
  
];

const helpQuestions = [
  {
    question: "How to create a project?",
    answer: "Go to the Projects section and click on the 'Create Project' button. Enter your project name, description, and assign a team. Once created, you can start adding tickets and tracking progress.",
    images: ["/help/create-project-step1.png", "/help/create-project-step2.png"]
  },
  {
    question: "How to invite team members?",
    answer: "Navigate to the Team tab inside your project. Click 'Invite Member', enter their email address, and assign them a role (Admin, Developer, Tester, etc.). An invitation email will be sent to them.",
    images: ["/help/invite-member.png"]
  },
  {
    question: "How to create and assign a ticket?",
    answer: "Open your project and go to the Tickets section. Click 'New Ticket', provide details such as title, description, priority, and assign it to a team member. You can also attach files and set deadlines.",
    images: ["/help/create-ticket.png", "/help/assign-ticket.png"]
  },
  {
    question: "How to track progress of tasks?",
    answer: "Each ticket has a status (Open, In Progress, Resolved, Closed). Use the dashboard to monitor updates in real-time. Progress graphs and activity logs help you stay informed about your team’s work.",
    images: ["/help/dashboard-progress.png"]
  },
  {
    question: "How to reset my password?",
    answer: "On the login screen, click on 'Forgot Password'. Enter your registered email, and you’ll receive a link to reset your password securely.",
    images: ["/help/reset-password.png"]
  },
  {
    question: "How to view analytics for my project?",
    answer: "Go to the Analytics tab in your project. You’ll find charts and reports showing ticket distribution, team performance, and overall progress trends.",
    images: ["/help/project-analytics.png"]
  }
];



export default function Help() { 

  

  return (
    <div className="max-w-full mx-auto">
      <div className="h-[100vh] w-full relative">
        <img src={assets.help_bg} className="h-full w-full object-cover" alt="" />
        <div className="absolute flex items-center justify-center  h-full w-full top-0">
          <div className="text-center p-5 w-xl bg-white/10 text-white shadow-2xl rounded">
          <div>
            <img src={assets.confused} className="w-50 h-50 mx-auto p-1" alt="" />
          </div>
          <h1 className="text-3xl font-medium text-white mb-5">How can we help you ?</h1>
          <div className="w-full flex items-center justify-start gap-3">
            <input type="search" className="py-3 px-9 bg-gray-50 text-gray-800 w-full rounded outline-none border border-gray-100" placeholder="How to create account..." />
            <Search className=" p-1 h-12 w-12 rounded cursor-pointer bg-blue-500 text-white transition-all"/>

          </div>

          </div>

        </div>




      </div>



<section className="mt-5 p-10 text-gray-800 flex items-center justify-center gap-5 flex-wrap">

  {
    helpQuestions.map((q,i)=>{
      return(
        <div key={i} className="max-w-xl relative p-5 text-center min-h-60 bg-gray-50 rounded-lg shadow-lg transition-all hover:shadow-2xl">
        <InfoIcon className="h-8 w-8 text-blue-500 absolute top-2 left-2" />
          <h1 className="text-3xl font-medium text-teal-500 my-5">{q.question}</h1>
          <p className="text-gray-600 ">{q.answer}</p>
        </div>
      )
    })
  }


</section>

      


      

      

    <section className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
  <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
    <LogIn className="text-purple-500" /> Register and Login
  </h2>

  <div className="flex items-start justify-between gap-5 my-5 border-t border-gray-200 py-10">
  
  <div className="flex flex-col items-start  p-3 border border-gray-100 rounded-lg justify-between min-h-70">

    <h1 className="text-3xl font-medium text-teal-500">Why should you register?</h1>

  <ul className="list-disc mt-5 list-inside text-gray-600 space-y-2">
    <li>Quick sign-up with email and password</li>
    <li>Secure login with encrypted credentials</li>
    <li>Role-based access after login</li>
    <li>Stay signed in with session management</li>
    <li>Password reset and account recovery options</li>
  </ul>
  </div>


    <div className="flex flex-1 px-5 items-start gap-5  justify-between">
      <div className="flex flex-col items-start  p-3 border border-gray-100 rounded-lg justify-between min-h-70">
        <h1 className="text-3xl font-medium text-teal-500">Registration in our platform is very simple</h1>
        <ul className="list-disc mt-5 list-inside text-gray-600 space-y-2">

        <li>Read the fields requirement carefully</li>
        <li>Fill all the required fields</li>
        <li>Choose your role</li>    
        <li>Click on "register"</li>   
        <li>Welcome, there you go !!!</li> 

        </ul>
      </div>

  <img src={assets.register} className="w-lg p-2 border border-gray-200 rounded-md shadow" alt="" />
    </div>

  </div>


  <div className="mt-10 ">
        <h1 className="flex items-center justify-start gap-3 text-3xl mb-5">Steps to login
          <WavesLadder className="text-teal-500 h-10 w-10"/>
        </h1>
  <div className="flex items-center justify-between flex-wrap gap-5 p-5">
    <img src={assets.dash} className="w-sm p-2 border border-gray-200 rounded-md shadow" alt="" />
    <ArrowRight className="text-blue-500 font-medium h-8 w-8 p-0.5 shadow-lg"/>
    <img src={assets.login} className="w-sm p-2 border border-gray-200 rounded-md shadow" alt="" />
    <ArrowRight className="text-blue-500 font-medium h-8 w-8 p-0.5 shadow-lg"/>
    
    <img src={assets.intro} className="w-sm p-2 border border-gray-200 rounded-md shadow" alt="" />
  </div>
  </div>

</section>


<section className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
 
    <div className="mt-10">
  <h1 className="text-3xl text-teal-500 font-medium">Easy to manage dashboard and Profile Section</h1>

    <div className="flex items-center justify-between gap-5 mt-5">
      <img src={assets.dashboard} className="w-sm p-2" alt="" />
      <img src={assets.profile2} className="w-sm p-2" alt="" />
      <img src={assets.intro} className="w-sm p-2" alt="" />

    </div>
 </div>

 <div className="flex items-center justify-between flex-row-reverse">

  <div className="max-w-xl p-5 rounded-lg">
  <h1 className="text-3xl font-semibold text-gray-800 mb-2">
    Manage your dashboard and daily activities
  </h1>
  <p className="text-gray-600">
    Organize all your tasks and projects in one place. Stay updated with real-time activity logs, 
    monitor progress, and manage your workflow effortlessly from your personalized dashboard.
  </p>
      <img src={assets.manage} className="w-sm mt-5 mx-auto" alt="" />

</div>

<div className="p-5 flex-1">
  <img className="w-3xl" src={assets.dash_bg}  alt="" />
</div>
 </div>


 
 



</section>

      <section className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <CheckCircle className="text-purple-500" /> Features & Support
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Create and assign tickets to team members</li>
          <li>Track progress with live status updates</li>
          <li>Collaborate with comments and attachments</li>
          <li>View analytics and insights for your projects</li>
          <li>Supports role-based access control</li>
        </ul>

        <div>
          
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Lightbulb className="text-yellow-500" /> How to Use
        </h2>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Sign up and create your workspace.</li>
          <li>Add team members to your workspace.</li>
          <li>Create tickets for bugs or tasks.</li>
          <li>Assign tickets to team members and set priorities.</li>
          <li>Update status as progress is made.</li>
        </ol>
      </section>

    


      <FAQSection/>
    </div>
  );
}
