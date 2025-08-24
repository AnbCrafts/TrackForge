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
import ValidationMessagesDisplay from "../Components/ValidationMessages";
import SocialIcons from "../Components/SocialMediaIcons";
import { toast } from 'react-toastify';
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

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



//   useEffect(()=>{
//     if(userData !==null){
//       setFormData({
// username: "",
//     email: "",
//     password: "",
//     picture: "",
//     firstName: "",
//     lastName: "",
//     role: "",
//       })

//       setFile(null);
//     }
//   },[userData])

  return (
    <div className="bg-gray-100 min-h-[100vh] w-full">
      <PageHeader />

      <div className="flex items-start justify-between gap-10 p-10">
        <div>
          {location.pathname === "/login" ? (
            <div className="mb-8 text-center w-xl bg-gray-900 p-10 rounded-2xl shadow-2xl">
              <h1 className="text-4xl font-bold text-green-500">
                Welcome Back to TrackForge
              </h1>
              <p className="text-gray-200 mt-2 text-lg">
                Sign in to access your projects, collaborate with your team, and
                stay on top of your workflow.
              </p>
            </div>
          ) : (
            <div className="mb-8 text-center w-xl bg-gray-900 p-10 rounded-2xl shadow-2xl">
              <h1 className="text-4xl font-bold text-green-500">
                Create Your TrackForge Account
              </h1>
              <p className="text-gray-200 mt-2 text-lg">
                Join TrackForge to streamline your project management, build
                teams, and solve bugs efficiently.
              </p>
            </div>
          )}

          <ValidationMessagesDisplay />
        </div>

        <div className=" flex-1 p-10 rounded-2xl shadow-2xl border border-gray-300">
          <h1 className="mb-5 text-3xl text-gray-600 font-semibold text-center pb-5 border-b border-gray-300">
            {location.pathname === "/login"
              ? "Login to your account"
              : "Create a new account"}
          </h1>
                
          <form onSubmit={submitHandler}>
            {location.pathname === "/register" ? (
              <>
                <div className="flex items-center justify-between gap-10 mb-4">
                  <label
                    htmlFor="firstName"
                    className="flex items-center justify-start gap-2"
                  >
                    <PersonStanding className="h-10 w-10 p-2 rounded-xl bg-gray-400 text-gray-700" />
                    <span className="font-semibold text-gray-600">
                      First Name
                    </span>
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
                    className="flex-1 outline-none focus:border-gray-600 border border-gray-300 px-2 py-1.5 rounded-lg bg-gray-300 text-gray-700 max-w-xl"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="flex items-center justify-between gap-10 mb-4">
                  <label
                    htmlFor="lastName"
                    className="flex items-center justify-start gap-2"
                  >
                    <PersonStanding className="h-10 w-10 p-2 rounded-xl bg-gray-400 text-gray-700" />
                    <span className="font-semibold text-gray-600">
                      Last Name
                    </span>
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
                    className="flex-1 outline-none focus:border-gray-600 border border-gray-300 px-2 py-1.5 rounded-lg bg-gray-300 text-gray-700 max-w-xl"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="flex items-center justify-between gap-10 mb-4">
                  <label
                    htmlFor="email"
                    className="flex items-center justify-start gap-2"
                  >
                    <Mail className="h-10 w-10 p-2 rounded-xl bg-gray-400 text-gray-700" />
                    <span className="font-semibold text-gray-600">E-mail</span>
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
                    className="flex-1 outline-none focus:border-gray-600 border border-gray-300 px-2 py-1.5 rounded-lg bg-gray-300 text-gray-700 max-w-xl"
                    placeholder="Enter your email"
                  />
                </div>
              </>
            ) : (
              ""
            )}

            <div className="flex items-center justify-between gap-10 mb-4">
              <label
                htmlFor="username"
                className="flex items-center justify-start gap-2"
              >
                <User className="h-10 w-10 p-2 rounded-xl bg-gray-400 text-gray-700" />
                <span className="font-semibold text-gray-600">Username</span>
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
                className="flex-1 outline-none focus:border-gray-600 border border-gray-300 px-2 py-1.5 rounded-lg bg-gray-300 text-gray-700 max-w-xl"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex items-center justify-between gap-10 mb-4">
              <label
                htmlFor="password"
                className="flex items-center justify-start gap-2"
              >
                <Lock className="h-10 w-10 p-2 rounded-xl bg-gray-400 text-gray-700" />
                <span className="font-semibold text-gray-600">Password</span>
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
                className="flex-1 outline-none focus:border-gray-600 border border-gray-300 px-2 py-1.5 rounded-lg bg-gray-300 text-gray-700 max-w-xl"
                placeholder="Enter your Password"
              />
            </div>

            {location.pathname === "/register" ? (
              <>
               <div className="flex items-center justify-start gap-5 mb-5 my-2 w-full ">
                <label
                  htmlFor="picture"
                  className={` ${
                    img
                      ? "h-[100px] w-[150px] rounded-xl border-transparent shadow-2xl shadow-gray-600"
                      : " h-12 px-5"
                  } text-gray-500 text-lg py-2 border border-gray-300 rounded outline-none flex items-center justify-between gap-5 cursor-pointer`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt="file"
                      className="w-[150px] h-[100px] rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <Upload /> <span>Upload profile picture</span>
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



                <div className="w-full p-6 bg-white rounded-xl shadow-md mt-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Select Your Role
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {["Owner", "Admin", "Tester", "Developer", "Debugger"].map(
                      (role, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
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
                            className="accent-indigo-600"
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

            <div className=" mt-10 w-fit mx-auto">
              <button
                type="submit"
                className="py-2 cursor-pointer px-8 bg-green-500 text-lg font-semibold text-center text-white rounded-lg shadow-2xl"
              >
                {location.pathname === "/login" ? "Login" : "Create account"}
              </button>
            </div>

            {location.pathname === "/login" ? (
              <div className="py-2 text-lg font-semibold mt-10">
                <Link to={'/reset-password'} className="cursor-pointer text-gray-500 hover:text-gray-800 transition-all">
                  Forgot Password??
                </Link>
              </div>
            ) : (
              <div className="mt-10">
                <p className="cursor-pointer text-gray-500 hover:text-gray-800 transition-all text-center">
                  Use your other accounts to continue
                </p>
                <SocialIcons />
              </div>
            )}


            {
              location.pathname ==='/login'
              ?
              (
                <Link to={'/register'} className="block mt-10 mx-auto w-full text-center py-1.5 border-t border-gray-200  font-medium text-gray-600 hover:text-gray-800 transition-all cursor-pointer">Create a new account</Link>
              )
              :
              (
                <Link to={'/login'} className="block mt-10 mx-auto w-full text-center py-1.5 border-t border-gray-200  font-medium text-gray-600 hover:text-gray-800 transition-all cursor-pointer">Login to your account</Link>

              )
            }

            
          
          
          
          </form>
        </div>
      </div>

      

      <div className="w-full py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose TrackForge?
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Empowering both individuals and teams with powerful tools to
            collaborate, manage, and deliver efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md hover:shadow-xl transition text-center ${
                index % 2 === 0
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  index % 2 === 0 ? "text-green-500" : "text-gray-800"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm ${
                  index % 2 === 0 ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
