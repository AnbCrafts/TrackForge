import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function Logout({ onLogout }) {
  const navigate = useNavigate();
  const {logoutUser} = useContext(TrackForgeContextAPI);

  useEffect(() => {
    if (onLogout && typeof onLogout === "function") {
      onLogout(); // clear auth state / tokens
    }
    const timer = setTimeout(() => {
      logoutUser();
      navigate("/login");
    }, 3000);


    return () => clearTimeout(timer);
  }, [onLogout, navigate]);

  

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg mt-20 border border-gray-200 text-center">
      <div className="flex justify-center mb-4">
        <LogOut className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Logging you out...
      </h1>
      <p className="text-gray-600">
        Please wait while we securely log you out of{" "}
        <span className="font-semibold">TrackForge</span>.  
        You will be redirected to the login page shortly.
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Redirecting in 3 seconds...
      </p>
    </div>
  );
}
