import React, { useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const { serverURL } = useContext(TrackForgeContextAPI);
  const handleGoogleLogin = () => {
    const apiBase = serverURL.replace("/api", "");
    window.location.href = `${apiBase}/api/authorize/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 text-gray-700 hover:text-black transition font-medium mt-6"
    >
      <FcGoogle size={24} />
      Login via Google
    </button>
  );
};

export default GoogleLoginButton;
