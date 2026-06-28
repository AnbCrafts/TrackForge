import { Activity, ClipboardList, Image, Lock, Mail, MoveLeftIcon, Shield, User, Users, Brain, Code, FileText, Link as LinkIcon } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';

const EditProfile = () => {
  const { hash, username } = useParams();
  const id = localStorage.getItem("userId");
  const { getUserDataById, authUserData, updateUserProfile } = useContext(TrackForgeContextAPI);
  const navigate = useNavigate();

  const [updateProfileForm, setUpdateProfileForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    teams: [],
    manages: [],
    activity: [],
    experience: "",
    resumeUrl: ""
  });

  const [skillsText, setSkillsText] = useState("");
  const [strengthsText, setStrengthsText] = useState("");

  useEffect(() => {
    getUserDataById(id);
  }, [id]);

  useEffect(() => {
    if (authUserData) {
      setUpdateProfileForm((prev) => ({
        ...prev,
        ...authUserData,
        experience: authUserData.experience || "",
        resumeUrl: authUserData.resumeUrl || ""
      }));
      setSkillsText(authUserData.skills ? authUserData.skills.join(", ") : "");
      setStrengthsText(authUserData.strengths ? authUserData.strengths.join(", ") : "");
    }
  }, [authUserData]);

  const handleRemove = (field, itemId) => {
    setUpdateProfileForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== itemId),
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("userId");

    if (updateProfileForm && id) {
      try {
        const payload = {
          ...updateProfileForm,
          skills: skillsText.split(",").map(s => s.trim()).filter(Boolean),
          strengths: strengthsText.split(",").map(s => s.trim()).filter(Boolean),
        };

        await updateUserProfile(id, payload);

        // Reset text entries & navigate
        setSkillsText("");
        setStrengthsText("");
        setUpdateProfileForm((prev) => ({
          ...prev,
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          status: "",
          role: "",
          experience: "",
          resumeUrl: "",
          teams: prev.teams,
          manages: prev.manages,
          activity: prev.activity,
        }));

        navigate(`/auth/${hash}/${username}/workspace/profile`);
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    }
  };

  return (
    <div className='max-h-[100vh] overflow-y-scroll scrollbar-thin w-full bg-primary text-primary p-6'>
      <Link to={`/auth/${hash}/${username}/workspace/profile`} className="p-2 mb-6 bg-secondary border border-default text-primary w-fit rounded-xl shadow hover:bg-hover hover:scale-105 transition flex items-center justify-center cursor-pointer">
        <MoveLeftIcon size={18} />
      </Link>

      <form onSubmit={submitHandler} className="flex-1 max-w-3xl bg-card border border-default/40 p-8 rounded-2xl shadow-xl backdrop-blur-md text-primary">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-8">Edit Profile Details</h2>
        
        <div className="space-y-6">
          {/* Username */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <User className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Username:
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
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* First Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <User className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> First Name:
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
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <User className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Last Name:
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
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <Mail className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Email:
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
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <Shield className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Role:
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
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs cursor-pointer"
            >
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Tester">Tester</option>
              <option value="Developer">Developer</option>
              <option value="Debugger">Debugger</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Skills */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <Code className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Skills (CSV):
            </label>
            <input
              type="text"
              name="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Node, Python, MongoDB"
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Strengths */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <Brain className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Strengths (CSV):
            </label>
            <input
              type="text"
              name="strengths"
              value={strengthsText}
              onChange={(e) => setStrengthsText(e.target.value)}
              placeholder="e.g. Debugging, Profiling, Optimization, System Design"
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Experience */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0 mt-1">
              <FileText className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Experience:
            </label>
            <textarea
              name="experience"
              value={updateProfileForm.experience}
              onChange={(e) =>
                setUpdateProfileForm((prev) => ({
                  ...prev,
                  experience: e.target.value,
                }))
              }
              placeholder="Describe your past roles, software engineering experiences..."
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs resize-none h-32"
            />
          </div>

          {/* Resume URL */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
              <LinkIcon className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Resume Link:
            </label>
            <input
              type="text"
              name="resumeUrl"
              value={updateProfileForm.resumeUrl}
              onChange={(e) =>
                setUpdateProfileForm((prev) => ({
                  ...prev,
                  resumeUrl: e.target.value,
                }))
              }
              placeholder="e.g. https://linkedin.com/in/username or Gdrive link"
              className="flex-1 bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
            />
          </div>

          {/* Teams */}
          {updateProfileForm.teams && updateProfileForm.teams.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 border-t border-default/20 pt-4 mt-6">
              <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
                <Users className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Teams:
              </label>
              <div className="flex-1 space-y-2">
                {updateProfileForm.teams.map((teamId) => (
                  <div
                    key={teamId}
                    className="flex items-center justify-between border border-default bg-secondary/50 rounded-xl px-3 py-2 text-xs"
                  >
                    <span className="font-mono text-secondary truncate flex-1 mr-4">{teamId}</span>
                    <button
                      type="button"
                      className="text-rose-500 font-bold hover:text-rose-400 cursor-pointer"
                      onClick={() => handleRemove("teams", teamId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manages */}
          {updateProfileForm.manages && updateProfileForm.manages.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="text-primary flex items-center gap-2 w-48 font-semibold text-xs uppercase tracking-wider shrink-0">
                <ClipboardList className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg shadow-sm" /> Manages:
              </label>
              <div className="flex-1 space-y-2">
                {updateProfileForm.manages.map((projId) => (
                  <div
                    key={projId}
                    className="flex items-center justify-between border border-default bg-secondary/50 rounded-xl px-3 py-2 text-xs"
                  >
                    <span className="font-mono text-secondary truncate flex-1 mr-4">{projId}</span>
                    <button
                      type="button"
                      className="text-rose-500 font-bold hover:text-rose-400 cursor-pointer"
                      onClick={() => handleRemove("manages", projId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-fit mx-auto mb-4 mt-12">
          <button type="submit"
            className="px-10 py-3 btn-gradient text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-xs"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
