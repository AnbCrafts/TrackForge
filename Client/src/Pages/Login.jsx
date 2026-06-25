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
  Loader2,
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
  const [showRules, setShowRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  setIsLoading(true);
  try {
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
      await registerUser(data, path); // Send FormData
    } else if (path === "login") {
      const loginData = {
        username: formData.username,
        password: formData.password,
      };
      await registerUser(loginData, path);  // Send JSON object
    }
  } catch (error) {
    console.error("Authentication error:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-primary text-primary relative overflow-hidden">
      {/* Parallax neon moon / Circle (keeps working if Circle uses parallax props) */}
      <Circle className="pointer-events-none absolute -top-20 right-1/4 opacity-60" />

      {/* subtle grid + radial glow layers */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg-secondary)]/50 via-[var(--bg-primary)]/30 to-[var(--bg-primary)] opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[var(--border-neon)]/10 via-[var(--border-neon)]/3 to-transparent pointer-events-none"
      />

      <PageHeader />

      {/* Center container */}
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-16 w-full max-w-4xl mx-auto">
        {/* outer neon gradient border */}
        <div className="relative w-full max-w-2xl">
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
            <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[var(--border-neon)]/40 to-[var(--border-neon)]/20">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="backdrop-blur-md bg-card/65 rounded-3xl shadow-2xl border border-default card-neon-animated"
              >
                <div className="p-8 lg:p-12 h-fit">
                  <h1 className="mb-5 text-2xl text-primary font-semibold text-center pb-4 border-b border-default/20">
                    {location.pathname === "/login"
                      ? "Login to your account"
                      : "Create a new account"}
                  </h1>

                  <form onSubmit={submitHandler} className="space-y-4">
                    {location.pathname === "/register" ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <label
                            htmlFor="firstName"
                            className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-secondary"
                          >
                            <PersonStanding className="h-9 w-9 p-2 rounded-lg bg-secondary text-neon" />
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
                            className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary max-w-xl"
                            placeholder="Enter your first name"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <label
                            htmlFor="lastName"
                            className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-secondary"
                          >
                            <PersonStanding className="h-9 w-9 p-2 rounded-lg bg-secondary text-neon" />
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
                            className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary max-w-xl"
                            placeholder="Enter your last name"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <label
                            htmlFor="email"
                            className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-secondary"
                          >
                            <Mail className="h-9 w-9 p-2 rounded-lg bg-secondary text-neon" />
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
                            className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary max-w-xl"
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
                        className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-secondary"
                      >
                        <User className="h-9 w-9 p-2 rounded-lg bg-secondary text-neon" />
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
                        className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary max-w-xl"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <label
                        htmlFor="password"
                        className="flex items-center gap-3 w-full sm:w-1/3 text-sm text-secondary"
                      >
                        <Lock className="h-9 w-9 p-2 rounded-lg bg-secondary text-neon" />
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
                        type="password"
                        name="password"
                        id="password"
                        className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary max-w-xl"
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
                            } text-sm text-secondary rounded-lg border border-default bg-secondary hover:bg-hover`}
                          >
                            {img ? (
                              <img
                                src={img}
                                alt="file"
                                className="w-[150px] h-[100px] rounded-lg object-cover"
                              />
                            ) : (
                              <>
                                <Upload className="text-primary" />{" "}
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

                        <div className="w-full p-4 mt-4 rounded-lg bg-secondary border border-default">
                          <h2 className="text-sm font-semibold text-primary mb-2">
                            Select Your Role
                          </h2>
                          <div className="flex flex-wrap gap-3">
                            {["Owner", "Admin"].map(
                              (role, index) => (
                                <label
                                  key={index}
                                  className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-default bg-card text-secondary hover:bg-hover"
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
                                    className="accent-[var(--border-neon)]"
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
                        whileHover={isLoading ? {} : { scale: 1.02, translateY: -2 }}
                        whileTap={isLoading ? {} : { scale: 0.99 }}
                        disabled={isLoading}
                        type="submit"
                        className={`py-3 px-8 text-base font-bold text-center btn-gradient w-full max-w-xs rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                          isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                        {isLoading 
                          ? (location.pathname === "/login" ? "Logging in..." : "Creating account...")
                          : (location.pathname === "/login" ? "Login" : "Create account")
                        }
                      </motion.button>
                    </div>

                    {location.pathname === "/login" ? (
                      <div className="py-2 text-sm font-medium mt-4 text-center">
                        <Link to={'/reset-password'} className="cursor-pointer text-muted hover:text-primary transition-all">
                          Forgot Password??
                        </Link>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="mt-6 text-center">
                      <p className="text-xs text-muted">Use your other accounts to continue</p>
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <GoogleLoginButton />
                        <span className="text-xs text-muted">OR</span>
                        <SocialIcons />
                      </div>
                    </div>

                    {
                      location.pathname ==='/login'
                      ?
                      (
                        <Link to={'/register'} className="block mt-6 mx-auto w-full text-center py-2 border-t border-default font-medium text-muted hover:text-primary transition-all cursor-pointer">Create a new account</Link>
                      )
                      :
                      (
                        <Link to={'/login'} className="block mt-6 mx-auto w-full text-center py-2 border-t border-default font-medium text-muted hover:text-primary transition-all cursor-pointer">Login to your account</Link>
                      )
                    }

                    {/* Modal Rules Popup Trigger */}
                    <div className="mt-4 border-t border-default pt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setShowRules(true)}
                        className="text-xs text-secondary hover:text-primary transition font-medium cursor-pointer underline"
                      >
                        View Registration Rules & Field Requirements
                      </button>
                    </div>
                  </form>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* "Why Choose" section — neon cards kept but restyled */}
      <div className="w-full py-16 px-6">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold text-gradient-glow">
            Why Choose TrackForge?
          </h2>
          <p className="text-muted mt-3 text-lg max-w-2xl mx-auto">
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
              className="card p-6 text-center hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2 text-primary">
                {item.title}
              </h3>
              <p className="text-sm text-secondary">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal popup for Validation Rules */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 rounded-2xl bg-card border border-default shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary hover:bg-hover hover:text-primary transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-gradient mb-4 text-center">
              Field Validation Requirements
            </h3>
            
            <div className="space-y-3.5 text-sm text-secondary leading-relaxed max-h-96 overflow-y-auto pr-1">
              <p><strong>Username:</strong> Lowercase letters and numbers only, no special characters, required.</p>
              <p><strong>First / Last Name:</strong> Must be at least 3 characters long, required.</p>
              <p><strong>E-mail:</strong> Must be a valid email address structure (e.g. test@example.com), required.</p>
              <p><strong>Password:</strong> Must be at least 8 characters, containing at least 3 numbers, 4 letters, and 1 special character.</p>
              <p><strong>Role:</strong> Must be one of: Owner, Admin, Tester, Developer, Debugger.</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="px-5 py-2 bg-secondary hover:bg-hover text-primary font-medium rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
