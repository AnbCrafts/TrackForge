import React, { useContext, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  PersonStanding,
  Upload,
  X,
  Loader2,
  RefreshCw,
  Key
} from "lucide-react";

export default function CreateMemberModal({ isOpen, onClose }) {
  const { createTeamMember } = useContext(TrackForgeContextAPI);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "Developer"
  });

  const generateRandomPassword = () => {
    // Generate a password matching: at least 8 chars, 3 numbers, 4 letters, 1 special char
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specials = "!@#$%^&*()_+";
    
    let pass = "";
    // Pick 3 numbers
    for (let i = 0; i < 3; i++) {
      pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    // Pick 4 letters
    for (let i = 0; i < 4; i++) {
      pass += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Pick 1 special char
    pass += specials.charAt(Math.floor(Math.random() * specials.length));
    // Add extra chars to make it random and length >= 8
    const all = letters + numbers + specials;
    for (let i = 0; i < 4; i++) {
      pass += all.charAt(Math.floor(Math.random() * all.length));
    }
    
    // Shuffle the password
    pass = pass.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData((prev) => ({ ...prev, password: pass }));
    toast.info("Random secure password generated!");
  };

  const handleImageChange = (e) => {
    const fileSelected = e.target.files[0];
    if (fileSelected) {
      setFile(fileSelected);
      setImg(URL.createObjectURL(fileSelected));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.password) {
      toast.warn("All fields are required!");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      
      const adminId = localStorage.getItem("userId");
      if (adminId) {
        data.append("createdBy", adminId);
      }

      if (file) {
        data.append("picture", file);
      }

      const success = await createTeamMember(data);
      if (success) {
        // Reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "Developer"
        });
        setFile(null);
        setImg(null);
        onClose();
      }
    } catch (error) {
      console.error("Create member error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xl bg-card border border-default rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default/20 bg-secondary/50">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-primary">Create Team Member</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-hover text-secondary hover:text-primary transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <PersonStanding className="h-3.5 w-3.5 text-neon" /> First Name
                  </label>
                  <input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    type="text"
                    placeholder="John"
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <PersonStanding className="h-3.5 w-3.5 text-neon" /> Last Name
                  </label>
                  <input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    type="text"
                    placeholder="Doe"
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-neon" /> Email Address
                </label>
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  placeholder="johndoe@example.com"
                  className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-neon" /> Username
                </label>
                <input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  type="text"
                  placeholder="johndoe123"
                  className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-neon" /> Password
                </label>
                <div className="flex gap-2">
                  <input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type="text"
                    placeholder="Enter password or generate"
                    className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                  />
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="px-3 py-2 bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-secondary">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Tester">Tester</option>
                    <option value="Debugger">Debugger</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-secondary">Profile Image</label>
                  <label
                    htmlFor="picture-modal"
                    className={`flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      img ? "h-20" : "h-10"
                    } text-xs text-secondary rounded-lg border border-default bg-secondary hover:bg-hover`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt="file"
                        className="h-full w-24 rounded-lg object-cover p-1"
                      />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-primary" />
                        <span>Upload photo</span>
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    id="picture-modal"
                    name="picture"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-default/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary rounded-lg transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 btn-gradient text-white rounded-lg shadow-lg flex items-center gap-1.5 text-sm font-bold disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                  <span>{isLoading ? "Creating..." : "Create User"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
