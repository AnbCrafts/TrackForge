import { Activity, ClipboardList, Image, Lock, Mail, MoveLeftIcon, Shield, User, Users } from 'lucide-react'
import React from 'react'
import { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { useEffect } from 'react';
import { useState } from 'react';

const EditProfile = () => {
    const {hash,username} = useParams();
    const id = localStorage.getItem("userId");
    const {getUserDataById,authUserData,updateUserProfile} = useContext(TrackForgeContextAPI);
    const navigate = useNavigate();
    useEffect(()=>{
        getUserDataById(id);
    },[id]);

    const [updateProfileForm,setUpdateProfileForm]= useState({
        username: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  teams: [],
  manages: [],
  activity: [],
 
    })


useEffect(()=>{
   
    setUpdateProfileForm((prev)=>({
            ...prev,
           ... authUserData
    }))
},[authUserData])


const handleRemove = (field, id) => {
    setUpdateProfileForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== id),
    }));
  };


  const submitHandler = async (e) => {
  e.preventDefault();
  const id = localStorage.getItem("userId");

  if (updateProfileForm && id) {
    try {
      await updateUserProfile(id, updateProfileForm);

      // Keep relations intact, only reset form fields
      setUpdateProfileForm((prev) => ({
        ...prev,
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        status: "",
        role: "",
        // Don’t reset these to empty
        teams: prev.teams,
        manages: prev.manages,
        activity: prev.activity,
      }));

      navigate(`/auth/${hash}/${username}/workspace/settings`);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  }
};




  return (
    <div className='max-h-[100vh] overflow-y-scroll noScroll w-full '>
        <Link to={`/auth/${hash}/${username}/workspace/settings`} className="p-1 block mx-5 my-2 bg-gray-900 text-white w-fit rounded shadow cursor-pointer">
        <MoveLeftIcon/>
      </Link>

      <form onSubmit={submitHandler} className="flex-1 max-w-3xl bg-white h-full p-3 border border-gray-200 rounded text-gray-900">
        <div className="space-y-6">
      {/* Username */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <User /> Username:
        </label>
        <input
          type="text"
          name="username"
          value={updateProfileForm.username}
          onChange={(e) =>
            setUpdateProfileForm((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
        />
      </div>

      {/* First Name */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <User /> First Name:
        </label>
        <input
          type="text"
          name="firstName"
          value={updateProfileForm.firstName}
          onChange={(e) =>
            setUpdateProfileForm((prev) => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
          className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
        />
      </div>

      {/* Last Name */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <User /> Last Name:
        </label>
        <input
          type="text"
          name="lastName"
          value={updateProfileForm.lastName}
          onChange={(e) =>
            setUpdateProfileForm((prev) => ({
              ...prev,
              lastName: e.target.value,
            }))
          }
          className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
        />
      </div>

      {/* Email */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <Mail /> Email:
        </label>
        <input
          type="email"
          name="email"
          value={updateProfileForm.email}
          onChange={(e) =>
            setUpdateProfileForm((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
        />
      </div>

     
      

      

      {/* Role */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <Shield /> Role:
        </label>
        <select
          name="role"
          value={updateProfileForm.role}
          onChange={(e) =>
            setUpdateProfileForm((prev) => ({
              ...prev,
              role: e.target.value,
            }))
          }
          className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
        >
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Tester">Tester</option>
          <option value="Developer">Developer</option>
          <option value="Debugger">Debugger</option>
        </select>
      </div>

      {/* Teams */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <Users /> Teams:
        </label>
        <div className="flex-1 space-y-2">
          {updateProfileForm.teams.map((teamId) => (
            <div
              key={teamId}
              className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
            >
              <span>{teamId}</span>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => handleRemove("teams", teamId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manages */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <ClipboardList /> Manages:
        </label>
        <div className="flex-1 space-y-2">
          {updateProfileForm.manages.map((projId) => (
            <div
              key={projId}
              className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
            >
              <span>{projId}</span>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => handleRemove("manages", projId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="flex items-start justify-start gap-3 mb-8">
        <label className="text-gray-600 flex items-center gap-2 w-40">
          <Activity /> Activity:
        </label>
        <div className="flex-1 space-y-2">
          {updateProfileForm.activity.map((actId) => (
            <div
              key={actId}
              className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
            >
              <span>{actId}</span>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => handleRemove("activity", actId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
        </div>


         <div className="w-fit mx-auto mb-10 mt-20">
              <button type="submit"
              className="px-10 py-2 border border-gray-200 rounded font-medium cursor-pointer hover:bg-green-500 hover:text-white transition-all"
              >
                Update Profile
              </button>

            </div>
      </form>

      
    </div>
  )
}

export default EditProfile
