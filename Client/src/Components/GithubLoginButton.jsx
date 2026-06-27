import React, { useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { FaGithub } from "react-icons/fa";

const GithubLoginButton = () => {
  const { serverURL } = useContext(TrackForgeContextAPI);
  const handleGithubLogin = () => {
    const apiBase = serverURL.replace("/api", "");
    window.location.href = `${apiBase}/api/authorize/github`;
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="flex items-center gap-2 text-gray-700 hover:text-black transition font-medium"
    >
      <FaGithub size={24} />
      Login via GitHub
    </button>
  );
};

export default GithubLoginButton;
