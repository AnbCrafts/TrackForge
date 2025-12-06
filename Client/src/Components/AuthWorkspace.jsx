import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

function AuthWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const { secureHash, username } = useParams();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const userId = params.get("userId");
    const email = params.get("email");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("secureHash", secureHash);
      localStorage.setItem("username", username);
      if (email) localStorage.setItem("email", email);

      navigate(`/auth/${secureHash}/${username}/workspace`, { replace: true });
    }
  }, [location, secureHash, username, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-700">
      Loading your workspace...
    </div>
  );
}

export default AuthWorkspace;
