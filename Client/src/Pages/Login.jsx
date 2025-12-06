import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import { Link, useLocation } from "react-router-dom";
import {
  CardSim,
  Cross,
  File,
  Lock,
  Mail,
  PersonStanding,
  Upload,
  User,
  X,
} from "lucide-react";

import {FcGoogle} from 'react-icons/fc'
import ValidationMessagesDisplay from "../Components/ValidationMessages";
import SocialIcons from "../Components/SocialMediaIcons";
import { toast } from 'react-toastify';
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import GoogleLoginButton from "../Components/GoogleLoginButton";

// NEW: framer-motion + Circle parallax background
import { motion } from "framer-motion";
import Circle from "../Components/Circle";

const Login = () => {
  const location = useLocation();
  const {registerUser,userData} = useContext(TrackForgeContextAPI);

  const [file, setFile] = useState(null);
  const [path,setPath]= useState("");
  const [img, setImg] = useState(null);

  useEffect(()=>{
    if(location && location.pathname){
      const path = location.pathname.replace("/", "");
      setPath(path);
    }
  },[location])

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    picture: "",
    firstName: "",
    lastName: "",
    role: "",
  });

 const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setImg(URL.createObjectURL(file));
    }
  };

const submitHandler = async (e) => {
  e.preventDefault();

  if (path === "register") {
    
    const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      if (formData.picture) {
        data.append("picture", formData.picture);
      }
      registerUser(data, path); // Send FormData
  } else if (path === "login") {
    const loginData = {
      username: formData.username,
      password: formData.password,
    };
    registerUser(loginData, path);  // Send JSON object
  }
};

  return (
    <div className="min-h-screen w-full bg-[#0A0A0C] text-gray-100 relative overflow-hidden">
      {/* Parallax neon moon / Circle (keeps working if Circle uses parallax props) */}
      <Circle className="pointer-events-none absolute -top-20 right-1/4 opacity-60" />

      {/* subtle grid + radial glow layers */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#071028]/50 via-[#07132a]/30 to-[#06060a] opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#7C3AED]/10 via-[#A855F7]/3 to-transparent pointer-events-none"
      />

      <PageHeader />

      {/* Center container */}
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-16 w-8xl mx-auto">
        {/* outer neon gradient border */}
        <div className="relative w-full">
          <div
            className="absolute -inset-0.5 rounded-3xl blur-xl opacity-40"
            style={{
              background:
                "linear-gradient(90deg, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.25) 50%, rgba(124,58,237,0.3) 100%)",
              filter: "blur(36px)",
            }}
          />
          {/* glass card with inner gradient border */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[#7C3AED]/40 via-[#A855F7]/30 to-[#EC4899]/20">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="backdrop-blur-md bg-[rgba(10,10,12,0.6)] rounded-3xl shadow-2xl border border-[rgba(255,255,255,0.04)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left side - welcome / pitch */}
                  <div className="p-8 lg:p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.03)]">
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                    >
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#EC4899]">
                        {location.pathname === "/login"
                          ? "Welcome back to TrackForge"
                          : "Create your TrackForge account"}
                      </h2>

                      <p className="mt-2 text-sm md:text-base text-[#cbd5e1] max-w-prose">
                        {location.pathname === "/login"
                          ? "Sign in to access your projects, collaborate with your team, and stay on top of your workflow."
                          : "Join TrackForge to streamline your project management, build teams, and solve bugs efficiently."}
                      </p>
                    </motion.div>

                    <ValidationMessagesDisplay />

                    {/* Feature quick list (neon chips) */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.12)] text-[#DAD8FF]">
                        Real-time sync
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(236,72,153,0.08)] border border-[rgba(236,72,153,0.08)] text-[#FFD7EE]">
                        Role management
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.08)] text-[#EBD9FF]">
                        Analytics
                      </span>
                    </div>

                    {/* small decorative neon line */}
                    <div className="mt-auto">
                      <div className="h-0.5 w-24 rounded bg-gradient-to-r from-[#A855F7] to-[#EC4899] opacity-80" />
                      <p className="mt-3 text-xs text-[#94a3b8]">
                        Secure • Fast • Designed for teams
                      </p>
                    </div>
                  </div>

                  {/* Right side - form */}
                  <div className="p-8 lg:p-12 h-fit  lg:mt-39 mr-4 card-neon-animated sm:mt-0">
                    <h1 className="mb-5 text-2xl text-[#e6e9ff] font-semibold text-center pb-4 border-b border-[rgba(255,255,255,0.03)]">
                      {location.pathname === "/login"
                        ? "Login to your account"
                        : "Create a new account"}
                    </h1>

                    <form onSubmit={submitHandler} className="space-y-4 ">
                      {location.pathname === "/register" ? (
                        <>
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <label
                              htmlFor="firstName"
                              className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-[#cbd5e1]"
                            >
                              <PersonStanding className="h-9 w-9 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] text-[#b9b6ff]" />
                              <span className="font-medium text-sm">First Name</span>
                            </label>
                            <input
                              value={formData.firstName}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  firstName: e.target.value
                                });
                              }}
                              type="text"
                              name="firstName"
                              id="firstName"
                              className="flex-1 outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-[#e6eef8] max-w-xl"
                              placeholder="Enter your first name"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <label
                              htmlFor="lastName"
                              className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-[#cbd5e1]"
                            >
                              <PersonStanding className="h-9 w-9 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] text-[#b9b6ff]" />
                              <span className="font-medium text-sm">Last Name</span>
                            </label>
                            <input
                              value={formData.lastName}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  lastName: e.target.value
                                });
                              }}
                              type="text"
                              name="lastName"
                              id="lastName"
                              className="flex-1 outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-[#e6eef8] max-w-xl"
                              placeholder="Enter your last name"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <label
                              htmlFor="email"
                              className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-[#cbd5e1]"
                            >
                              <Mail className="h-9 w-9 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] text-[#b9b6ff]" />
                              <span className="font-medium text-sm">E-mail</span>
                            </label>
                            <input
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  email: e.target.value
                                });
                              }}
                              type="text"
                              name="email"
                              id="email"
                              className="flex-1 outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-[#e6eef8] max-w-xl"
                              placeholder="Enter your email"
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <label
                          htmlFor="username"
                          className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-[#cbd5e1]"
                        >
                          <User className="h-9 w-9 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] text-[#b9b6ff]" />
                          <span className="font-medium text-sm">Username</span>
                        </label>
                        <input
                          value={formData.username}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              username: e.target.value
                            });
                          }}
                          type="text"
                          name="username"
                          id="username"
                          className="flex-1 outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-[#e6eef8] max-w-xl"
                          placeholder="Enter your username"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <label
                          htmlFor="password"
                          className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-[#cbd5e1]"
                        >
                          <Lock className="h-9 w-9 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] text-[#b9b6ff]" />
                          <span className="font-medium text-sm">Password</span>
                        </label>
                        <input
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              password: e.target.value
                            });
                          }}
                          type="text"
                          name="password"
                          id="password"
                          className="flex-1 outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-[#e6eef8] max-w-xl"
                          placeholder="Enter your Password"
                        />
                      </div>

                      {location.pathname === "/register" ? (
                        <>
                          <div className="flex items-center gap-5 mt-2">
                            <label
                              htmlFor="picture"
                              className={`flex items-center gap-4 cursor-pointer transition-all ${
                                img ? "h-[110px] w-[160px]" : "h-12 px-4 py-2"
                              } text-sm text-[#cbd5e1] rounded-lg border border-[rgba(255,255,255,0.03)]`}
                            >
                              {img ? (
                                <img
                                  src={img}
                                  alt="file"
                                  className="w-[150px] h-[100px] rounded-lg object-cover"
                                />
                              ) : (
                                <>
                                  <Upload className="text-[#e6eef8]" />{" "}
                                  <span>Upload profile picture</span>
                                </>
                              )}
                            </label>

                            <input
                              type="file"
                              id="picture"
                              name="picture"
                              className="hidden"
                              onChange={(e) => handleImageChange(e)}
                            />
                          </div>

                          <div className="w-full p-4 mt-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
                            <h2 className="text-sm font-semibold text-[#e6eef8] mb-2">
                              Select Your Role
                            </h2>
                            <div className="flex flex-wrap gap-3">
                              {["Owner", "Admin", "Tester", "Developer", "Debugger"].map(
                                (role, index) => (
                                  <label
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.03)] hover:bg-[rgba(124,58,237,0.06)]"
                                  >
                                    <input
                                      onChange={(e) => {
                                        setFormData({
                                          ...formData,
                                          role: e.target.value,
                                        });
                                      }}
                                      type="radio"
                                      name="role"
                                      value={role}
                                      className="accent-[#A855F7]"
                                    />
                                    {role}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div className="mt-6 flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(168,85,247,0.18)" }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          className="py-2 px-8 rounded-lg text-lg font-semibold bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-black shadow-lg"
                        >
                          {location.pathname === "/login" ? "Login" : "Create account"}
                        </motion.button>
                      </div>

                      {location.pathname === "/login" ? (
                        <div className="py-2 text-sm font-medium mt-4 text-center">
                          <Link to={'/reset-password'} className="cursor-pointer text-[#9fb2d8] hover:text-[#e6eef8] transition-all">
                            Forgot Password??
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="mt-6 text-center">
                        <p className="text-xs text-[#9fb2d8]">Use your other accounts to continue</p>
                        <div className="flex items-center justify-center gap-4 mt-3">
                          <GoogleLoginButton />
                          <span className="text-xs text-[#9fb2d8]">OR</span>
                          <SocialIcons />
                        </div>
                      </div>

                      {
                        location.pathname ==='/login'
                        ?
                        (
                          <Link to={'/register'} className="block mt-6 mx-auto w-full text-center py-2 border-t border-[rgba(255,255,255,0.02)] font-medium text-[#9fb2d8] hover:text-[#e6eef8] transition-all cursor-pointer">Create a new account</Link>
                        )
                        :
                        (
                          <Link to={'/login'} className="block mt-6 mx-auto w-full text-center py-2 border-t border-[rgba(255,255,255,0.02)] font-medium text-[#9fb2d8] hover:text-[#e6eef8] transition-all cursor-pointer">Login to your account</Link>
                        )
                      }
                    </form>

                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* "Why Choose" section — neon cards kept but restyled */}
      <div className="w-full py-16 px-6">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#EC4899]">
            Why Choose TrackForge?
          </h2>
          <p className="text-[#9fb2d8] mt-3 text-lg max-w-2xl mx-auto">
            Empowering both individuals and teams with powerful tools to collaborate, manage, and deliver efficiently.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Simplified Project Management",
              desc: "Easily create, organize, and track project workflows without any complexity.",
            },
            {
              title: "Real-Time Collaboration",
              desc: "Work with your team seamlessly through live activity feeds, comments, and notifications.",
            },
            {
              title: "Role-Based Access Control",
              desc: "Assign specific roles and permissions to team members ensuring secure collaboration.",
            },
            {
              title: "Bug Tracking & Issue Management",
              desc: "Report, prioritize, and resolve bugs effectively to keep your projects on track.",
            },
            {
              title: "Analytics & Insights",
              desc: "Gain valuable insights on project progress and team productivity with powerful analytics.",
            },
            {
              title: "Flexible Team Structures",
              desc: "Create and manage teams effortlessly with dynamic team formation and ownership features.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={`p-6 rounded-xl border border-[rgba(255,255,255,0.03)] text-center ${
                index % 2 === 0 ? "bg-[rgba(17,19,24,0.6)] text-[#e6eef8]" : "bg-[rgba(255,255,255,0.02)] text-[#d1d5db]"
              }`}
            >
              <h3 className={`text-xl font-semibold mb-2 ${index % 2 === 0 ? "text-[#A855F7]" : "text-[#c7c7d3]"}`}>
                {item.title}
              </h3>
              <p className={`text-sm ${index % 2 === 0 ? "text-[#bfc8e6]" : "text-[#9fb2d8]"}`}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
