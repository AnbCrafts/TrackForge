import { Github } from 'lucide-react';
import { toast } from 'react-toastify';

const LinkGithubButton = () => {
    const id = localStorage.getItem("userId")
  const handleLinkGithub = () => {
    if (!id) {
      toast.warn("User ID is required to link GitHub");
      return;
    }

    // Redirect user to backend GitHub OAuth link route
    window.location.href = `http://localhost:9000/api/authorize/github/link/${id}`;
  };

  return (
    <button
      onClick={handleLinkGithub}
      className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-white hover:bg-gray-800 transition-all mt-6 border border-gray-300 rounded px-4 py-1"
    >
      <Github size={24} /> Link GitHub
    </button>
  );
};

export default LinkGithubButton;
