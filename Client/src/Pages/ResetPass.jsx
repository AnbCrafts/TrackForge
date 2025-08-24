import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import Footer from "../Components/Footer";
import {  Lock, Mail, MoveLeftIcon, Navigation, User } from "lucide-react";
import { toast } from "react-toastify";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPass = ({path = '/', want = true}) => {
  const { searchUser, searchedUser, updateUserProfile, authUserData, setSearchedUser } = useContext(TrackForgeContextAPI);
  const navigate = useNavigate();

  const [findUserForm, setFindUserForm] = useState({
    email: "",
    username: "",
  });
  const [changePassForm, setChangePassForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [id,setId] = useState(null);

  useEffect(()=>{
    if(searchedUser && searchedUser._id){
        setId(searchedUser._id);
        toast.success("Id set");
    }
  },[searchedUser])

const submitUserFindForm = async (e) => {
  e.preventDefault();

  const isAnyFieldEmpty = Object.values(findUserForm).some(
    (value) => value.trim() === ""
  );

  if (isAnyFieldEmpty) {
    toast.warn("Some fields are empty");
  } else {
    await searchUser(findUserForm.email, findUserForm.username);
    setFindUserForm({
      email: "",
      username: "",
    });
  }
};

const submitResetPassForm = async (e) => {
  e.preventDefault();

  const isAnyFieldEmpty = Object.values(changePassForm).some(
    (value) => value.trim() === ""
  );

  if (isAnyFieldEmpty) {
    toast.warn("Some fields are empty");
  } else {
    if (
      searchedUser &&
      searchedUser._id &&
      changePassForm.confirmPassword === changePassForm.password
    ) {
      await updateUserProfile(id, { password: changePassForm.password });

      setChangePassForm({
        password: "",
        confirmPassword: "",
      });
      setSearchedUser(null);

      // ✅ Success + redirect moved here
      toast.success("Password changed successfully");
      navigate(path || "/login");
    } else {
      toast.error("Cannot change password");
    }
  }
};



  

 const {username,hash}= useParams();

  return (
    <div className="min-h-[90vh]">
    {want &&  <PageHeader />}

      <Link to={want?"path":`/auth/${hash}/${username}/workspace/settings`} className="p-1 block mx-5 my-2 bg-gray-900 text-white w-fit rounded shadow cursor-pointer">
        <MoveLeftIcon/>
      </Link>

      <div className="flex items-center p-5 justify-start flex-col w-[90%] mx-auto h-[80vh] rounded-2xl  my-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-5">
          Reset Password
        </h1>

        {!searchedUser && <form
          onSubmit={submitUserFindForm}
          className="w-3xl border border-gray-300 mt-5 p-10 rounded bg-gray-200 shadow-2xl"
        >
          <div className="flex items-center justify-start gap-5 text-gray-700 mb-5">
            <label
              htmlFor="email"
              className="flex items-center justify-start gap-2 w-40"
            >
              <Mail /> E-mail
            </label>
            <input
              onChange={(e) => {
                setFindUserForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              type="text"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="flex-1 border border-gray-400 outline-none py-1.5 px-4 rounded"
            />
          </div>
          <div className="flex items-center justify-start gap-5 text-gray-700 mb-5">
            <label
              htmlFor="username"
              className="flex items-center justify-start gap-2 w-40"
            >
              <User /> Username
            </label>
            <input
              onChange={(e) => {
                setFindUserForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
              value={findUserForm.username}
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="flex-1 border border-gray-400 outline-none py-1.5 px-4 rounded"
            />
          </div>
          <div className="mx-auto w-fit mt-15">
            <button className="px-12 cursor-pointer hover:bg-green-500 hover:text-white transition-all hover:border-transparent py-1.5 border border-gray-400 text-gray-700 rounded">
              Submit
            </button>
          </div>
        </form>}
        {searchedUser &&
          <form
            onSubmit={submitResetPassForm}
            className="w-3xl border border-gray-300 mt-5 p-10 rounded bg-gray-200 shadow-2xl"
          >
            <div className="flex items-center justify-start gap-5 text-gray-700 mb-5">
              <label
                htmlFor="password"
                className="flex items-center justify-start gap-2 w-40"
              >
                <Lock />Password
              </label>
              <input
                onChange={(e) => {
                  setChangePassForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                type="password"
                name="password"
                id="password"
                placeholder="Enter new password"
                className="flex-1 border border-gray-400 outline-none py-1.5 px-4 rounded"
              />
            </div>
            <div className="flex items-center justify-start gap-5 text-gray-700 mb-5">
              <label
                htmlFor="confirmPassword"
                className="flex items-center justify-start gap-2 w-40"
              >
                <Lock />Confirm Password
              </label>
              <input
                onChange={(e) => {
                  setChangePassForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                }}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="flex-1 border border-gray-400 outline-none py-1.5 px-4 rounded"
              />
            </div>
            <div className="mx-auto w-fit mt-15">
              <button className="px-12 cursor-pointer hover:bg-green-500 hover:text-white transition-all hover:border-transparent py-1.5 border border-gray-400 text-gray-700 rounded">
                Submit
              </button>
            </div>
          </form>
        }
      </div>

{
  want && 
  <Footer />
}
    </div>
  );
};

export default ResetPass;
