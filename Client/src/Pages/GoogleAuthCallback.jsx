import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const { serverURL } = useContext(TrackForgeContextAPI);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${serverURL}/authorize/google/callback`, {
          method: "GET",
          credentials: "include", // for cookies/session
        });
        const data = await res.json();

        if (data.success) {
          // Store user info in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("secureHash", data.secureHash);
          localStorage.setItem("username", data.user.username);

          // Redirect to workspace
          window.location.href = data.redirectUrl;
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching Google OAuth data:", err);
      }
    };

    fetchUserData();
  }, []);

  return <p>Loading Google login...</p>;
}
