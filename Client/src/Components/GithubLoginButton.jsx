import { FaGithub } from "react-icons/fa";

const GithubLoginButton = () => {
  const handleGithubLogin = () =>
    (window.location.href = "http://localhost:9000/api/authorize/github");

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
